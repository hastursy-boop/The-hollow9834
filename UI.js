export class UI {
  constructor(){this.battery=document.getElementById("battery");this.fill=document.getElementById("batteryFill");this.message=document.getElementById("message");this.toastTimer=null;}
  setBattery(v){const n=Math.round(v);this.battery.textContent=n+"%";this.fill.style.width=n+"%";this.fill.style.background=n<20?"#b64c43":"#b8c9c6";}
  toast(text){this.message.textContent=text;clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>this.message.textContent="COMPLEXO NADIR · SETOR DE RECEPÇÃO",2200);}
  pause(show){document.getElementById("pause").classList.toggle("hidden",!show);if(show&&document.pointerLockElement)document.exitPointerLock();}
  inventory(show){document.getElementById("inventory").classList.toggle("hidden",!show);}
}