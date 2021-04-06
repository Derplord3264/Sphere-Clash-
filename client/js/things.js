const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.getElementById('gc');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
const distance = 0;
var shadowresolution = 100;
var sensitivity = 50;
var resolution = 100;
if(Cookies.get("resolution") == undefined) {
  Cookies.set("resolution", 100);
} else {
  resolution = parseInt(Cookies.get("resolution"));
}
if(Cookies.get("shadowresolution") == undefined) {
  Cookies.set("shadowresolution", 100);
} else {
  shadowresolution = parseInt(Cookies.get("shadowresolution"));
}
if(Cookies.get("sensitivity") == undefined) {
  Cookies.set("sensitivity", 50);
} else {
  sensitivity = parseInt(Cookies.get("sensitivity"));
}
renderer.setPixelRatio((window.devicePixelRatio / 50) * resolution);
renderer.setClearColor(0x00bfff);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);


camera.position.set(0, -5, 0);
camera.rotation.x = Math.PI / 2;

const light = new THREE.AmbientLight("#ffffee");
scene.add(light);
const shadowLight = new THREE.PointLight(0x333333, 1.2, 1000);
shadowLight.position.set(150, 150, 150);
scene.add(shadowLight);
shadowLight.castShadow = true;
shadowLight.shadow.mapSize.width = shadowresolution * 41;
shadowLight.shadow.mapSize.height = shadowresolution * 41;

class Player {
	constructor(x, y, z, color) {
		this.mesh = new THREE.Mesh(
			new THREE.SphereGeometry(0.5, 100, 100),
      new THREE.MeshPhongMaterial({color: color, shininess: 25, specular: 0xffffff, emissive: 0x0})
		);
		this.mesh.castShadow = true;
		this.mesh.position.set(x, y, z);
		scene.add(this.mesh);
    
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    this.texture = new THREE.Texture(canvas);
    this.healthbar = new THREE.Sprite(
      new THREE.SpriteMaterial({map: this.texture})
    );
    this.healthbar.position.set(x, y, z + 1);
		if(color != "#66ff66") {
    	scene.add(this.healthbar);
		}
    this.ctx = canvas.getContext('2d');
    this.ctx.textAlign = "center";
    this.ctx.font = "50px Arial";
  }
  updateHealth(hp, score, x, y, z) {
    this.healthbar.position.set(x, y, z + 1.5);
    this.texture.needsUpdate = true;
    this.ctx.clearRect(0, 0, 64, 64);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 54, 64, 10);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 54, hp * 0.64, 10);
    this.ctx.fillStyle = "black";
    this.ctx.fillText(score, 32, 40);
  }
}

class Floor {
	constructor(x, y, z, w, h, d, c) {
		this.mesh = new THREE.Mesh(
			new THREE.BoxGeometry(w, h, d),
			new THREE.MeshPhongMaterial({ color: c , shininess: 100})
		);
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.mesh.position.set(x, y, z);
		scene.add(this.mesh);
	}
  
}

class Bullet {
  constructor(x, y, z) {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 20),
      new THREE.MeshPhongMaterial({color: 0x656565, shininess: 1000, specular: 0xffffff, emissive: 0x0})
    );
    this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.mesh.position.set(x, y, z);
		scene.add(this.mesh);
  }
}