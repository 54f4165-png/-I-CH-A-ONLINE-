import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT || 8080);
const MAX_ROOM = 30;
const rooms = new Map();
// Fixed seats are calculated around six tables, matching the client geometry.
function seatPosition(i){const table=Math.floor(i/4), slot=i%4;const tx=[-7,0,7,-7,0,7][table],tz=[-5,-5,-5,5,5,5][table];const angles=[0,Math.PI/2,Math.PI,3*Math.PI/2];return {x:tx+Math.cos(angles[slot])*1.65,z:tz+Math.sin(angles[slot])*1.65};}
const clean=(s,max=80)=>String(s??'').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,max);
const send=(ws,data)=>{if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(data));};
function broadcast(room,data,exclude){for(const p of room.values())if(p.ws!==exclude)send(p.ws,data);}
const server=http.createServer((req,res)=>{res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Content-Type','application/json; charset=utf-8');if(req.url==='/health'){res.end(JSON.stringify({ok:true,rooms:rooms.size,players:[...rooms.values()].reduce((a,r)=>a+r.size,0),maxPerRoom:MAX_ROOM}));return;}res.statusCode=404;res.end(JSON.stringify({error:'not found'}));});
const wss=new WebSocketServer({server,maxPayload:2048});
wss.on('connection',(ws,req)=>{
 let player=null, room=null;let lastMove=0,lastChat=0,lastAction=0;
 const timeout=setTimeout(()=>{if(!player)ws.close(1008,'join timeout');},10000);
 ws.on('message',raw=>{let msg;try{msg=JSON.parse(raw.toString());}catch{return;}if(!msg||typeof msg!=='object')return;
 if(msg.type==='join'&&!player){const name=clean(msg.name,18)||'Khách';const roomId=clean(msg.room,16).replace(/[^a-zA-Z0-9_-]/g,'').toUpperCase()||'QUAN-1';room=rooms.get(roomId)||new Map();if(room.size>=MAX_ROOM){send(ws,{type:'error',message:'Phòng đã đủ 30 người'});ws.close(1008,'room full');return;}rooms.set(roomId,room);player={id:randomUUID(),name,room:roomId,x:0,z:11,rot:0,seat:null,color:Number.isInteger(Number(msg.color))?Math.max(0,Math.min(5,Number(msg.color))):0,ws};room.set(player.id,player);clearTimeout(timeout);send(ws,{type:'welcome',id:player.id,room:roomId,players:[...room.values()].map(publicPlayer),seats:24,max:MAX_ROOM});broadcast(room,{type:'joined',player:publicPlayer(player)},ws);broadcast(room,{type:'notice',text:`${name} vừa vào quán!`});return;}
 if(!player)return;
 if(msg.type==='move'){if(Date.now()-lastMove<40||player.seat!==null)return;lastMove=Date.now();const x=Number(msg.x),z=Number(msg.z),rot=Number(msg.rot);if(![x,z,rot].every(Number.isFinite))return;const dx=x-player.x,dz=z-player.z;if(Math.hypot(dx,dz)>3)return;player.x=Math.max(-12,Math.min(12,x));player.z=Math.max(-10,Math.min(13,z));player.rot=rot;broadcast(room,{type:'moved',id:player.id,x:player.x,z:player.z,rot:player.rot},ws);return;}
 if(msg.type==='seat'){if(player.seat!==null){player.seat=null;broadcast(room,{type:'seated',id:player.id,seat:null});return;}const i=Number(msg.index);if(!Number.isInteger(i)||i<0||i>=24)return;if([...room.values()].some(p=>p.seat===i))return;const pos=seatPosition(i);if(Math.hypot(pos.x-player.x,pos.z-player.z)>3.5)return;player.seat=i;player.x=pos.x;player.z=pos.z;broadcast(room,{type:'seated',id:player.id,seat:i,x:pos.x,z:pos.z});return;}
 if(msg.type==='chat'){if(Date.now()-lastChat<900)return;lastChat=Date.now();const text=clean(msg.text,120);if(text)broadcast(room,{type:'chat',id:player.id,name:player.name,text,at:Date.now()});return;}
 if(msg.type==='order'){if(Date.now()-lastAction<1500)return;lastAction=Date.now();const items=['Lẩu hải sản','Đậu phộng','Mực nướng','Nước ngọt','Khoai chiên'];const item=items[Math.floor(Math.random()*items.length)];broadcast(room,{type:'ordered',id:player.id,name:player.name,item});return;}
 if(msg.type==='cheers'){if(Date.now()-lastAction<1500)return;lastAction=Date.now();broadcast(room,{type:'cheers',id:player.id,name:player.name});return;}
 });
 ws.on('close',()=>{clearTimeout(timeout);if(!player||!room)return;room.delete(player.id);broadcast(room,{type:'left',id:player.id});if(room.size===0)rooms.delete(player.room);});
 ws.on('error',()=>{});
});
function publicPlayer(p){return {id:p.id,name:p.name,x:p.x,z:p.z,rot:p.rot,seat:p.seat,color:p.color};}
server.listen(PORT,'0.0.0.0',()=>console.log(`Di Nhau Multiplayer WS on :${PORT}`));
