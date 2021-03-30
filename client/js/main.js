const socket = io();
let id;
socket.on('id', i => (id = i));

let [x, y, z] = [0, 0, 0];
const me = new Player(0, 0, 0, "transparent");

let oof = new Audio("assets/die.wav");

const players = {};
const bullets = {};

const floors = [];

socket.on('floors', data => {
	for (const f of data) {
		floors.push(new Floor(f.x, f.y, f.z, f.w, f.h, f.d, f.c));
	}
});

var sun = new THREE.Mesh(
    new THREE.SphereGeometry(50, 20, 20),
    new THREE.MeshLambertMaterial({ color: 0xffff1a})
    );
sun.position.set(375, 375, 375);
scene.add(sun);
window.onresize = function(){ location.reload(); }
var menu = document.getElementById("menu");
var health = document.getElementById("health-full");
var coordinates = document.getElementById("coordinates");
var kills = document.getElementById("kills");
socket.on('players', data => {
  if(document.pointerLockElement === canvas ||
  document.mozPointerLockElement === canvas) {
      menu.style.display = "none";
			lock = false;
  } else {
      menu.style.display = "block";
			lock = true;
  }
	let notUpdated = [];
	for (let i in players) notUpdated.push(i);

	let notUpdatedBullets = [];
	for (let i in bullets) notUpdatedBullets.push(i);

	for (const p of data) {
		if (p.id == id) {
			({ x, y, z } = p);
			camera.position.set(x, y, z);
			me.mesh.position.set(x, y, z);
			me.updateHealth(p.hp, p.score, x, y, z);
      coordinates.innerHTML = String(Math.floor(x)) + ", " + String(Math.floor(z)) + ", " +String(Math.floor(y));
      kills.innerHTML = p.score;
      health.style.width = (p.hp / 2.5) + "%";
		} else if (!players[p.id]) {
			players[p.id] = new Player(p.x, p.y, p.z, 0xff7777);
			players[p.id].mesh.rotation.z = -p.angle;
			players[p.id].updateHealth(p.hp, p.score, p.x, p.y, p.z);
		} else {
			players[p.id].mesh.position.set(p.x, p.y, p.z);
			players[p.id].mesh.rotation.z = -p.angle;
			notUpdated.splice(notUpdated.indexOf(p.id), 1);
			players[p.id].updateHealth(p.hp, p.score, p.x, p.y, p.z);
		}

		for (const b of p.bullets) {
			if (!bullets[b.id]) {
				bullets[b.id] = new Bullet(b.x, b.y, b.z);
			} else {
				bullets[b.id].mesh.position.set(b.x, b.y, b.z);
				notUpdatedBullets.splice(notUpdatedBullets.indexOf(b.id), 1);
			}
		}
	}

	for (const i of notUpdatedBullets) {
		bullets[i].mesh.name = 'tmp';
		scene.remove(scene.getObjectByName('tmp'));
		delete bullets[i];
	}

	for (const i of notUpdated) {
		players[i].mesh.name = 'tmp';
		scene.remove(scene.getObjectByName('tmp'));
		players[i].healthbar.name = 'tmp';
		scene.remove(scene.getObjectByName('tmp'));
		delete players[i];
	}
});

function dist(x1, x2, y1, y2, z1, z2) {
  var a = x1 - x2;
  var b = y1 - y2;
  var c = z1 - z2;
  return Math.sqrt(a*a+b*b+c*c);
}

function getDistance(mesh2, mesh1) { 
  var dx = mesh2.x - mesh1.mesh.position.x; 
  var dy = mesh2.y - mesh1.mesh.position.z; 
  var dz = mesh2.z - mesh1.mesh.position.y; 

  return Math.sqrt(dx*dx+dy*dy+dz*dz); 
}

socket.on("oof", data => {
  console.log(getDistance(data, me));
  oof.play();
});

function animate() {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}
animate();
