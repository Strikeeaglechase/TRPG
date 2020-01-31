const ID_LEN = 10;
const ID_CHAR_SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');

function rpHitbox(x, y, w, h, px, py) {
	if (typeof x == 'object') {
		px = y;
		py = w;
		y = x.absY || x.y;
		w = x.w;
		h = x.h;
		x = x.absX || x.x;
	}
	return px > x && py > y && px < x + w && py < y + h;
}

function ID() {
	var str = '';
	while (str.length < ID_LEN) {
		str += ID_CHAR_SET[Math.floor(Math.random() * ID_CHAR_SET.length)];
	}
	return str;
}
class UI_Controller {
	constructor(p5Insance) {
		this.x = 0;
		this.y = 0;
		this.activeElementCanChange = true;
		this.activeElement = {};
		this.draggedElement = {};
		this.elements = [];
		this.p5Inst = p5Instance;
		if (!p5Instance) {
			throw new Error('No p5 instance passed to UI');
		}
	}
	run() {
		this.elements.forEach(elm => elm.run());
	}
	spawnElement(elm) {
		// debugger;
		this.elements.push(elm);
	}
	mouseUp() {
		this.elements.forEach(element => element.mouseUp());
	}
	mouseDragged() {
		this.elements.forEach(element => element.mouseDragged());
	}
	mouseDown() {
		this.elements.forEach(element => element.mouseDown());
	}
	forceMouseUp() {
		p5Instance._pInst._onmouseup();
	}
}

class UI_Element {
	constructor(owner, x, y, w, h, opts) {
		opts = opts || {};
		this.owner = owner;
		this.UI = this.owner instanceof UI_Controller ? this.owner : this.owner.UI;
		this.isDragging = false;
		this.elements = [];
		this.x = x;
		this.y = y;
		this.absX = 0;
		this.absY = 0;
		this.w = w || 10;
		this.h = h || 10;
		this.dragable = opts.dragable || false;
		this.clickable = opts.clickable || false;
		this.id = ID();
	}
	move() {
		this.absX = this.owner.x + this.x;
		this.absY = this.owner.y + this.y;
	}
	draw() {
		noFill();
		if (UI.activeElement.id == this.id) {
			stroke(255, 0, 0);
		} else {
			stroke(255);
		}
		rect(this.absX, this.absY, this.w, this.h);
	}
	run() {
		this.move();
		this.draw();
	}
	spawnElement(element) {
		if (!this.UI.elements.find(elm => elm.id == element.id)) {
			this.UI.spawnElement(element);
		}
	}
	mouseUp() {
		this.elements.forEach(element => element.mouseUp());
		if (this.UI.draggedElement.id == this.id) {
			this.UI.draggedElement = {};
			this.UI.activeElementCanChange = true;
		}
	}
	mouseDragged() {
		this.elements.forEach(element => element.mouseDragged());
		if (this.UI.draggedElement.id == this.id && this.dragable) {
			this.x = mouseX - this.w / 2 - this.owner.x;
			this.y = mouseY - this.h / 2 - this.owner.y;
		}
		if (rpHitbox(this, mouseX, mouseY) && this.UI.activeElement.id == this.id) {
			this.UI.draggedElement = this;
			this.UI.activeElementCanChange = false;
		}
	}
	mouseDown() {
		this.elements.forEach(element => element.mouseDown());
		if (rpHitbox(this, mouseX, mouseY) && this.UI.activeElementCanChange && this.clickable) {
			this.UI.activeElement = this;
		}
	}
}