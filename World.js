import * as THREE from "three";

export class World {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
    this.build();
  }
  material(color, roughness=0.8, metalness=0.15) {
    return new THREE.MeshStandardMaterial({color, roughness, metalness});
  }
  box(name, x,y,z, sx,sy,sz, material, collide=true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz), material);
    mesh.name=name; mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true;
    this.scene.add(mesh);
    if(collide) this.colliders.push({minX:x-sx/2,maxX:x+sx/2,minZ:z-sz/2,maxZ:z+sz/2});
    return mesh;
  }
  build() {
    const concrete=this.material(0x343b3d,.94), dark=this.material(0x171e21,.72,.35);
    const metal=this.material(0x596568,.42,.72), stripe=this.material(0x9b493c,.7,.2);
    const floor=this.material(0x252d30,.82,.25);
    // Reception corridor: a connected, walkable foundation space.
    this.box("floor",0,-.18,0,12,.35,34,floor,false);
    this.box("ceiling",0,4.1,0,12,.3,34,dark,false);
    this.box("left-wall",-6,1.95,0,.35,4,34,concrete);
    this.box("right-wall",6,1.95,0,.35,4,34,concrete);
    this.box("back-wall",0,1.95,-17,12,4,.35,concrete);
    this.box("front-wall",0,1.95,17,12,4,.35,concrete);
    // Cross-beams and architectural ribs.
    for(let z=-13;z<=13;z+=4.3){
      this.box("support-left",-5.55,2,z,.48,4,.55,dark);
      this.box("support-right",5.55,2,z,.48,4,.55,dark);
      this.box("beam",0,3.78,z,11.2,.32,.5,metal,false);
    }
    // Reception desk and equipment islands.
    this.box("desk",-2.5,.75,-7,3.2,1.5,1.1,dark);
    this.box("desk-top",-2.5,1.53,-7,3.35,.12,1.2,metal,false);
    this.box("terminal",-2.4,1.9,-7,.65,.55,.12,this.material(0x243b3c,.35,.4),false);
    this.box("cabinet",4.5,1.2,-10,1.4,2.4,1.1,dark);
    this.box("crate",3.8,.45,3,1.1,.9,1.1,metal);
    this.box("crate2",-4.3,.45,7,1.1,.9,1.1,metal);
    // Wall-mounted conduits and hazard markings.
    for(let z=-14;z<15;z+=2.5){
      this.box("pipe-left",-5.68,2.9,z,.12,.12,2.2,metal,false);
      this.box("pipe-right",5.68,2.7,z,.12,.12,2.2,metal,false);
    }
    this.box("warning-panel",5.78,1.45,-3,.05,.9,1.4,stripe,false);
    // Light fixtures: cold overhead pools and emergency red spill.
    for(let z=-12;z<=12;z+=6){
      const fixture=this.box("light-fixture",0,3.88,z,1.6,.12,.55,metal,false);
      const light=new THREE.PointLight(0xa9cbd0, z===0?1.1:.72, 10, 2);
      light.position.set(0,3.55,z); this.scene.add(light);
    }
    const red=new THREE.PointLight(0xb43c30,1.4,9,2);
    red.position.set(-5.35,2.7,11); this.scene.add(red);
    // Wet floor patches.
    const wet=new THREE.MeshStandardMaterial({color:0x26383b,roughness:.18,metalness:.35});
    for(const p of [[1.5,-4,2.2,3.5],[-2,8,2.8,2.1],[3,13,1.7,2.2]]){
      const patch=new THREE.Mesh(new THREE.PlaneGeometry(p[2],p[3]),wet);
      patch.rotation.x=-Math.PI/2; patch.position.set(p[0],.002,p[1]); this.scene.add(patch);
    }
    // Sparse suspended dust motes.
    const count=260, positions=new Float32Array(count*3);
    for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*10;positions[i*3+1]=Math.random()*3.5;positions[i*3+2]=(Math.random()-.5)*30;}
    const geo=new THREE.BufferGeometry(); geo.setAttribute("position",new THREE.BufferAttribute(positions,3));
    const dust=new THREE.Points(geo,new THREE.PointsMaterial({color:0xa9b7b5,size:.025,transparent:true,opacity:.32}));
    this.scene.add(dust);
  }
  collides(x,z,r=.32) {
    return this.colliders.some(c => x+r>c.minX && x-r<c.maxX && z+r>c.minZ && z-r<c.maxZ);
  }
}