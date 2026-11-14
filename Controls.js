export class Controls {
  constructor(player, camera, ui) {
    this.player=player; this.camera=camera; this.ui=ui;
    this.joy=document.getElementById("joystick"); this.stick=document.getElementById("stick");
    this.lookPointers=new Map(); this.bind();
  }
  bind(){
    const joyStart=e=>{e.preventDefault();this.joy.setPointerCapture(e.pointerId);this.joyPointer=e.pointerId;this.joyMove(e);};
    this.joy.addEventListener("pointerdown",joyStart);
    this.joy.addEventListener("pointermove",e=>{if(e.pointerId===this.joyPointer)this.joyMove(e);});
    const joyEnd=e=>{if(e.pointerId===this.joyPointer){this.joyPointer=null;this.player.setMove(0,0);this.stick.style.transform="translate(0,0)";}};
    this.joy.addEventListener("pointerup",joyEnd);this.joy.addEventListener("pointercancel",joyEnd);
    const canvas=this.camera.userData.canvas;
    canvas.addEventListener("pointerdown",e=>{
      if(e.pointerType==="mouse"){if(document.pointerLockElement!==canvas)canvas.requestPointerLock?.();return;}
      if(e.clientX<window.innerWidth*.38)return;
      this.lookPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove",e=>{
      if(e.pointerType==="mouse"&&document.pointerLockElement===canvas){this.player.look(e.movementX,e.movementY);return;}
      const p=this.lookPointers.get(e.pointerId);if(!p)return;
      this.player.look(e.clientX-p.x,e.clientY-p.y, .004);
      p.x=e.clientX;p.y=e.clientY;
    });
    ["pointerup","pointercancel"].forEach(type=>canvas.addEventListener(type,e=>this.lookPointers.delete(e.pointerId)));
    document.getElementById("flashBtn").onclick=()=>{this.player.toggleFlash();document.getElementById("flashBtn").classList.toggle("active",this.player.flashOn);};
    document.getElementById("crouchBtn").onclick=()=>{this.player.setCrouch(!this.player.isCrouching);document.getElementById("crouchBtn").classList.toggle("active",this.player.isCrouching);};
    const run=document.getElementById("runBtn");
    run.addEventListener("pointerdown",e=>{e.preventDefault();this.player.setRun(true);run.classList.add("active");});
    ["pointerup","pointercancel","pointerleave"].forEach(t=>run.addEventListener(t,()=>{this.player.setRun(false);run.classList.remove("active");}));
    document.getElementById("interactBtn").onclick=()=>this.ui.toast("NENHUM TERMINAL AO ALCANCE");
    document.getElementById("inventoryBtn").onclick=()=>this.ui.inventory(true);
    document.getElementById("closeInventory").onclick=()=>this.ui.inventory(false);
    document.getElementById("pauseBtn").onclick=()=>this.ui.pause(true);
    document.getElementById("resumeBtn").onclick=()=>this.ui.pause(false);
    document.getElementById("restartBtn").onclick=()=>location.reload();
    document.addEventListener("keydown",e=>{
      if(e.code==="KeyF"){this.player.toggleFlash();document.getElementById("flashBtn").classList.toggle("active",this.player.flashOn);}
      if(e.code==="KeyE")this.ui.toast("NENHUM TERMINAL AO ALCANCE");
      if(e.code==="Escape")this.ui.pause(true);
      if(e.code==="Tab"){e.preventDefault();this.ui.inventory(true);}
    });
  }
  joyMove(e){
    const r=this.joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    let dx=e.clientX-cx,dy=e.clientY-cy;const max=r.width*.34,len=Math.hypot(dx,dy);
    if(len>max){dx=dx/len*max;dy=dy/len*max;}
    this.stick.style.transform=`translate(${dx}px,${dy}px)`;
    this.player.setMove(dx/max,-dy/max);
  }
}