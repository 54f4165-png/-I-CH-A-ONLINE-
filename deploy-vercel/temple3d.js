// Three-dimensional procedural pilgrims wearing Vietnamese ao dai.
// Three.js is loaded as a module from a CDN; network access is needed for this version.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
const host=document.getElementById('threeCrowd');
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(1080,850);renderer.outputColorSpace=THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(42,1080/850,.1,150);camera.position.set(0,13.5,24);camera.lookAt(0,0,-9);
scene.add(new THREE.HemisphereLight(0xffedcd,0x3b2a25,2.5));const sun=new THREE.DirectionalLight(0xffd6a0,2.2);sun.position.set(-4,12,8);scene.add(sun);
const mat=(color,roughness=0.88)=>new THREE.MeshStandardMaterial({color,roughness,side:THREE.DoubleSide});
const skin=mat(0xc99676),hair=mat(0x241a1c),black=mat(0x20151b),floor=mat(0x76502b);
const stage=new THREE.Mesh(new THREE.PlaneGeometry(42,43),new THREE.MeshStandardMaterial({color:0x9b662e,transparent:true,opacity:.13,side:THREE.DoubleSide}));stage.rotation.x=-Math.PI/2;stage.position.set(0,-.1,-8);scene.add(stage);
function part(parent,geometry,material,x,y,z){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);parent.add(m);return m}
function capsule(parent,radius,height,material,x,y,z){return part(parent,new THREE.CapsuleGeometry(radius,height,4,8),material,x,y,z)}
function label(text){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='rgba(29,15,18,.94)';ctx.beginPath();ctx.roundRect(4,5,504,86,18);ctx.fill();ctx.strokeStyle='#f8d38b';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle='#fff3cf';ctx.textAlign='center';ctx.font='bold 38px Arial';ctx.fillText(String(text).slice(0,18),256,63,480);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));sprite.scale.set(1.9,.38,1);sprite.position.set(0,1.75,.44);return sprite}
function pilgrim(name,color){const root=new THREE.Group(),body=new THREE.Group();root.add(body);const cloth=mat(color);const pants=mat(0xeee3db);const tunic=part(body,new THREE.CylinderGeometry(.33,.54,1.12,12,1),cloth,0,1.02,0);tunic.rotation.y=Math.PI/12;
// Two separate long ao dai panels hang below the waist.
for(const x of [-.25,.25]){const panel=part(body,new THREE.BoxGeometry(.44,.83,.11),cloth,x,.34,.16);panel.rotation.z=x>0?-.09:.09;}
part(body,new THREE.SphereGeometry(.31,16,12),skin,0,1.88,0);
part(body,new THREE.SphereGeometry(.32,16,12,0,Math.PI*2,0,Math.PI*.5),hair,0,2.01,-.035);
const bun=part(body,new THREE.SphereGeometry(.17,12,10),hair,0,1.97,.28);bun.scale.set(1,.8,.65);
const leftArm=new THREE.Group(),rightArm=new THREE.Group();body.add(leftArm,rightArm);leftArm.position.set(-.34,1.46,0);rightArm.position.set(.34,1.46,0);
const armShape=new THREE.CapsuleGeometry(.12,.55,4,8);const a=part(leftArm,armShape,cloth,-.08,-.3,.03),b=part(rightArm,armShape,cloth,.08,-.3,.03);a.rotation.z=-.15;b.rotation.z=.15;
const legs=[];for(const x of [-.19,.19]){const leg=new THREE.Group();leg.position.set(x,.55,0);body.add(leg);capsule(leg,.13,.45,pants,0,-.24,0);legs.push(leg)}
body.add(label(name));root.userData={body,leftArm,rightArm,legs,name};return root}
const colors=[0xd6c4d2,0xe9e0d8,0xb9a4c3,0xd5b7aa,0xc9c6df,0xe0c9ba,0xb9b8cc];
const occupants=[];const clock=new THREE.Clock();
function posFor(index){const row=Math.floor(index/10),col=index%10;const side=col<5?-1:1;const lane=col%5;return new THREE.Vector3(side*(2.3+lane*1.35),0,-13+row*2.05)}
for(let i=0;i<60;i++){const p=pilgrim('',colors[i%colors.length]);p.position.copy(posFor(i));p.scale.setScalar(.86);p.userData.body.children.find(c=>c.type==='Sprite').visible=false;p.userData.phase='seated';p.userData.offset=i*.41;scene.add(p);occupants.push(p)}
let counter=0;const visitors=[];
function arrive(name){if(visitors.length>=9)return;const slot=counter++%60;const target=posFor(slot);const p=pilgrim(name,colors[counter%colors.length]);p.position.set(0,0,10);p.userData.target=target;p.userData.phase='enter';p.userData.time=0;p.userData.offset=counter;p.userData.slot=slot;p.scale.setScalar(.95);occupants[slot].visible=false;scene.add(p);visitors.push(p)}
window.Temple3D={arrive};
const samples=['Diệu Tâm','Thiện An','Minh Đức','Tịnh Liên','Phúc An','Tâm Bình','Diệu Hương'];let sampleIndex=0;
setTimeout(()=>arrive(samples[sampleIndex++%samples.length]),1600);
setInterval(()=>{if(visitors.length<6)arrive(samples[sampleIndex++%samples.length])},4300);
function updateCharacter(p,t,dt){const d=p.userData,body=d.body;d.time=(d.time||0)+dt;const phase=d.phase;
if(phase==='enter'){const goal=d.time<3.4?new THREE.Vector3(0,0,d.target.z):d.target;const delta=goal.clone().sub(p.position);const length=delta.length();if(length>.05){p.position.addScaledVector(delta,Math.min(1,dt*1.35));p.rotation.y=Math.atan2(-delta.x,-delta.z)}else if(d.time>3.6){d.phase='bow';d.time=0;p.rotation.y=0}}
if(phase==='bow'&&d.time>6){d.phase='leave';d.time=0}
if(phase==='leave'){const goal=d.time<2.3?new THREE.Vector3(0,0,d.target.z):new THREE.Vector3(0,0,12);const delta=goal.clone().sub(p.position);p.position.addScaledVector(delta,Math.min(1,dt*1.5));p.rotation.y=Math.atan2(-delta.x,-delta.z);if(d.time>7){scene.remove(p);occupants[d.slot].visible=true;visitors.splice(visitors.indexOf(p),1);return}}
const walking=phase==='enter'||phase==='leave';const bow=phase==='bow';const bowAmount=bow?Math.max(0,Math.sin(Math.min(1,d.time/1.1)*Math.PI/2))*Math.max(0,Math.min(1,(6-d.time)/1.1)):0;
body.rotation.x=bowAmount*.95;body.position.y=walking?Math.abs(Math.sin(t*7+d.offset))*.07:-bowAmount*.38;
d.legs[0].rotation.x=walking?Math.sin(t*7+d.offset)*.55:0;d.legs[1].rotation.x=walking?-Math.sin(t*7+d.offset)*.55:0;
d.leftArm.rotation.x=bow?-1.05:walking?Math.sin(t*7+d.offset)*.25:-.25;d.rightArm.rotation.x=bow?-1.05:walking?-Math.sin(t*7+d.offset)*.25:-.25;
}
let previous=clock.getElapsedTime();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime(),dt=Math.min(.05,t-previous);previous=t;for(const p of occupants){const b=p.userData.body;b.rotation.x=.14+Math.max(0,Math.sin(t*.75+p.userData.offset))*.16;b.position.y=-.26;b.userData&&(b.userData.x=1)}for(const p of [...visitors])updateCharacter(p,t,dt);renderer.render(scene,camera)}animate();
