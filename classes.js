class Floor {
	constructor(x, y, z, w, h, d, c) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		this.h = h;
		this.d = d;
    this.c = c;
	}
	collide(player) {
		if (
			player.x + player.w / 2 > this.x - this.w / 2 &&
			player.x - player.w / 2 < this.x + this.w / 2
		) {
			if (
				player.y + player.w / 2 > this.y - this.h / 2 &&
				player.y - player.w / 2 < this.y + this.h / 2
			) {
				if (
					player.z + player.w / 2 >= this.z - this.d / 2 &&
					player.z - player.w / 2 <= this.z + this.d / 2
				) {
					if (player.z > this.z) {
						player.z = this.z + this.d / 2 + player.w / 2;
						return true;
					} else player.z = this.z - this.d / 2 - player.w / 2;
				}
			}
		}
		return false;
	}
}

class Player {
	constructor(x, y, z, w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		this.sx = 0;
		this.sy = 0;
		this.sz = 0;
		this.angle = 0;
		this.landed = true;
		this.hp = 100;
		this.bullets = [];
    this.ready = true;
    this.score = 0;
	}
	reSpawn() {
		[this.x, this.y, this.z] = [Math.floor((Math.random() * 250) - 124), Math.floor((Math.random() * 250) - 124), 500];
		[this.sx, this.sy, this.sz] = [0, 0, 0];
    this.hp = 100;
    this.score = 0;
    
	}
}

class Bullet {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.sx = 0;
		this.sy = 0;
		this.sz = 0;
		this.id = Math.random();
	}
	collide(player) {
		if (player.x + player.w / 2 > this.x && player.x - player.w / 2 < this.x) {
			if (
				player.y + player.w / 2 > this.y &&
				player.y - player.w / 2 < this.y
			) {
				if (
					player.z + player.w / 2 >= this.z &&
					player.z - player.w / 2 <= this.z
				) {
					return true;
				}
			}
		}
		return false;
	}
}

exports.Floor = Floor;
exports.Player = Player;
exports.Bullet = Bullet;
