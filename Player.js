import * as THREE from "three";

export class Player {
  constructor(camera, world, ui) {
    this.camera=camera; this.world=world; this.ui=ui;
    this.position=new THREE.Vector3(0,0,12);
    this.yaw=0; this.pitch=0; this.radius=.32;
    this.isCrouching=false; this.isRunning=false; this.touchCrouch=false; this.touchRun=false; this.flashOn=true; this.battery=100;
    this.keys={}; this.move={x:0,y:0};
    this.flash=new THREE.SpotLight(0xdce9e5,38,24,Math.PI/7,.45,1.5);
    this.flash.position.set(0,0,0); this.flash.target.position.set(0,0,-1);
    camera.add(this.flash); camera.add(this.flash.target);
    this.ambientLamp=new THREE.PointLight(0x9bb8b8,.12,3); camera.add(this.ambientLamp);
    this.bindKeys();
  }
  bindKeys(){
    window.addEventListener("keydown",e=>{this.keys[e.code]=true;if(["Space","ArrowUp","ArrowDown"].includes(e.code))e.preventDefault();});
    window.addEventListener("keyup",e=>this.keys[e.code]=false);
  }
  look(dx,dy,sensitivity=.0022){
    this.yaw-=dx*sensitivity; this.pitch-=dy*sensitivity;
    this.pitch=Math.max(-1.45,Math.min(1.45,this.pitch));
  }
  setMove(x,y){this.move.x=x;this.move.y=y;}
  toggleFlash(){this.flashOn=!this.flashOn;this.flash.visible=this.flashOn;}
  setCrouch(v){this.touchCrouch=v;}
  setRun(v){this.touchRun=v;}
  update(dt){
    const forward=(this.keys.KeyW?1:0)-(this.keys.KeyS?1:0)-this.move.y;
    const side=(this.keys.KeyD?1:0)-(this.keys.KeyA?1:0)+this.move.x;
    this.isRunning=!!(this.touchRun||this.keys.ShiftLeft||this.keys.ShiftRight);
    this.isCrouching=!!(this.touchCrouch||this.keys.ControlLeft||this.keys.ControlRight);
    const speed=this.isCrouching?1.35:(this.isRunning?4.8:2.65);
    const len=Math.hypot(forward,side);
    if(len>.01){
      const f=forward/Math.max(1,len), s=side/Math.max(1,len);
      const dx=(Math.sin(this.yaw)*f+Math.cos(this.yaw)*s)*speed*dt;
      const dz=(Math.cos(this.yaw)*f-Math.sin(this.yaw)*s)*speed*dt;
      if(!this.world.collides(this.position.x+dx,this.position.z,this.radius))this.position.x+=dx;
      if(!this.world.collides(this.position.x,this.position.z+dz,this.radius))this.position.z+=dz;
    }
    this.camera.position.set(this.position.x,this.isCrouching?1.12:1.68,this.position.z);
    this.camera.rotation.order="YXZ"; this.camera.rotation.y=this.yaw; this.camera.rotation.x=this.pitch;
    if(this.flashOn)this.battery=Math.max(0,this.battery-dt*.12);
    if(this.battery<=0)this.toggleFlashIfNeeded();
    this.ui.setBattery(this.battery);
  }
  toggleFlashIfNeeded(){if(this.flashOn){this.flashOn=false;this.flash.visible=false;}}
}