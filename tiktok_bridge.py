"""Local TikTok LIVE -> Phat Phap LIVE bridge. Unofficial connector; use at your own risk."""
import asyncio, json, os, urllib.request
from TikTokLive import TikTokLiveClient
from TikTokLive.events import CommentEvent, GiftEvent, ConnectEvent

username = input('Nhap ten TikTok cua ban (khong can @): ').strip().lstrip('@')
if not username:
    raise SystemExit('Can nhap ten TikTok.')
endpoint = os.getenv('EVENT_URL', 'http://127.0.0.1:3000/event')
token = os.getenv('EVENT_TOKEN', '')
if not token:
    raise SystemExit('Chua co EVENT_TOKEN. Hay chay START_LIVE.bat.')
client = TikTokLiveClient(unique_id='@' + username)

def send(data):
    req = urllib.request.Request(endpoint, data=json.dumps(data, ensure_ascii=False).encode('utf-8'), headers={'Content-Type':'application/json', 'Authorization':'Bearer '+token}, method='POST')
    with urllib.request.urlopen(req, timeout=5) as response:
        response.read()

async def forward(data):
    try:
        await asyncio.to_thread(send, data)
    except Exception as exc:
        print('Khong gui duoc su kien den web:', exc)

@client.on(ConnectEvent)
async def connected(event):
    print('Da ket noi LIVE:', username)

@client.on(CommentEvent)
async def comment(event):
    name = event.user.nickname or event.user.unique_id
    print('Binh luan:', name, event.comment)
    await forward({'type':'comment','name':name,'text':event.comment})

@client.on(GiftEvent)
async def gift(event):
    if event.gift is None or event.streaking:
        return  # streak only counted at end; do not double count
    name = event.user.nickname or event.user.unique_id
    gift_name = event.gift.name or ''
    qty = max(1, int(event.repeat_count or 1))
    print('Qua tang:', name, gift_name, qty)
    # Ranking is LOTUS gift count only, not all gifts / money.
    if gift_name.casefold() in {'hoa sen','lotus'}:
        await forward({'type':'gift','name':name,'count':qty})

async def main():
    while True:
        try:
            await client.start()
        except KeyboardInterrupt:
            break
        except Exception as exc:
            print('Mat ket noi / LIVE chua bat:', exc)
        print('Thu ket noi lai sau 15 giay...')
        await asyncio.sleep(15)

if __name__ == '__main__':
    asyncio.run(main())
