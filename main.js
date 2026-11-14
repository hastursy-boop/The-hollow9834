import * as THREE from "three";
import {World} from "./systems/World.js";
import {Player} from "./systems/Player.js";
import {Controls} from "./ui/Controls.js";
import {UI} from "./ui/UI.js";

const canvas=document.getElementById("view");
const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
renderer.setSize(window.innerWidth,window.innerHeight,false);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x080d10);
scene.fog=new THREE.FogExp2(0x101719,.035);
const camera=new THREE.PerspectiveCamera(76,window.innerWidth/window.innerHeight,.08,90);
camera.userData.canvas=canvas;
scene.add(camera);
const hemi=new THREE.HemisphereLight(0x80989d,0x111719,.5);scene.add(hemi);
const world=new World(scene);
const ui=new UI();
const player=new Player(camera,world,ui);
new Controls(player,camera,ui);
const clock=new THREE.Clock();

function resize(){
  const w=window.innerWidth,h=window.innerHeight;
  camera.aspect=w/h;camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.setSize(w,h,false);
}
window.addEventListener("resize",resize);
document.addEventListener("visibilitychange",()=>{if(document.hidden)ui.pause(true);});

function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.05);
  player.update(dt);
  renderer.render(scene,camera);
}
animate();

ui.toast("COMPLEXO NADIR · SETOR DE RECEPÇÃO");
