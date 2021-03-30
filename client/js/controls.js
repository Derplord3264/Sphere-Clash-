const keystate = [];
const angle = { z: 0, x: Math.PI / 2 };
var sensitivity = 50;
var aim = false;
window.addEventListener('keydown', e => {
  e.preventDefault();
  if (!keystate[e.keyCode]) {
    keystate[e.keyCode] = true;
    push();
  }
});

window.addEventListener('keyup', e => {
  e.preventDefault();
  delete keystate[e.keyCode];
  push();
});

const start = [{ x: 0, y: 0 }, { x: 0, y: 0 }];

const startAngle = { x: 0, z: 0 };
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  start[e.touches.length - 1].x = e.touches[e.touches.length - 1].pageX;
  start[e.touches.length - 1].y = e.touches[e.touches.length - 1].pageY;
});

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  let i, j, tmp = {};
  if (e.changedTouches[0].pageX < window.innerWidth / 2) {
    i = 0;
    if (e.changedTouches[1])
      if (e.changedTouches[1].pageX > window.innerWidth / 2) {
        j = 1;
      }
  } else {
    j = 0;
    if (e.changedTouches[1])
      if (e.changedTouches[1].pageX < window.innerWidth / 2) i = 1;
  }

  if (i !== undefined) {
    let x = start[i].x - e.changedTouches[i].pageX;
    let y = start[i].y - e.changedTouches[i].pageY;
    let moveAngle = Math.atan(x / -y);
    if (y < 0) moveAngle += Math.PI;
    socket.emit('move', { angle: angle.z + moveAngle, speed: 0.3, jump: false });
  }

  if (j !== undefined) {
    angle.z = startAngle.z + (e.changedTouches[j].pageX - start[j].x) / 100;
    angle.x = startAngle.x - (e.changedTouches[j].pageY - start[j].y) / 100;

    socket.emit('angle', angle.z);
    if (angle.x < 0) angle.x = 0;
    if (angle.x > Math.PI) angle.x = Math.PI;
    camera.position.set(x, y, z);
    camera.rotation.set(0.8, 0, 0);
    camera.rotation.x = angle.x;
    camera.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -angle.z);

    me.mesh.rotation.z = -angle.z;
  }

});

window.addEventListener('touchend', e => {
  e.preventDefault();
  if (e.touches[0]) {
    if (e.touches[0].pageX < window.innerWidth / 2) {
      startAngle.x = angle.x;
      startAngle.z = angle.z;
    }
    else
      socket.emit('move', { angle: angle.z, speed: 0, jump: false });
  } else {
    startAngle.x = angle.x;
    startAngle.z = angle.z;
    socket.emit('move', { angle: angle.z, speed: 0, jump: false });
  }

});
setInterval(function(){ push() }, 1);
function push() {
  let x = 0,
    y = 0,
    jump = false;
  if(aim) {
    var speed = 0.05;
  } else {
    var speed = 0.3;
  }
	if(!lock) {
		if (keystate[87]) y++;
		if (keystate[65]) x--;
		if (keystate[83]) y--;
		if (keystate[68]) x++;
		if (keystate[32]) jump = true;
		if (keystate[81] && !aim) {
			aim = true;
			camera.fov = 9;
			camera.updateProjectionMatrix();
		}else if (!keystate[81] && aim) {
			aim = false;
			camera.fov = 60;
			camera.updateProjectionMatrix();
		}

	}
  if (!x && !y) speed = 0;

  let moveAngle = Math.atan(x / y);
  if (y < 0) moveAngle += Math.PI;

  socket.emit('move', { angle: angle.z + moveAngle, speed: speed, jump });
}

document.getElementById("Playbutton").addEventListener('click', e => {
  e.preventDefault();
  canvas.requestPointerLock();
});

document.getElementById("Settingsbutton").addEventListener('click', e => {
  if (confirm("Are you sure you want to change settings, the page will reload") == true) {
    var answer = prompt("Graphics quality? (more than 100 will reduce FOV. default 100)");
    Cookies.set("resolution", answer);
    var answer = prompt("Shadow quality? (default 100)");
    Cookies.set("shadowresolution", answer);
    location.reload();
  }
});

canvas.addEventListener('click', e => {
  e.preventDefault();
  var button = e.button;
  if(button == 0) {
    socket.emit('shoot', angle);
  }
});


document.addEventListener('mousemove', e => {
  e.preventDefault();
	if(!lock) {
		if(aim) {
			angle.z += e.movementX / (sensitivity * 50);
			angle.x -= e.movementY / (sensitivity * 50);    
		} else {
			angle.z += e.movementX / (sensitivity * 10);
			angle.x -= e.movementY / (sensitivity * 10);
  	}
	}
  socket.emit('angle', angle.z);
  if (angle.x < 0) angle.x = 0;
  if (angle.x > Math.PI) angle.x = Math.PI;
  camera.position.set(x, y, z);
  camera.rotation.set(0.8, 0, 0);
  camera.rotation.x = angle.x;
  camera.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -angle.z);
  delete keystate[e.keyCode];
  push();
  me.mesh.rotation.z = -angle.z;
});

