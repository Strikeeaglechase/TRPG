const ID_LEN = 15;
const ID_CHAR_SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');

function rpHitbox(x, y, w, h, px, py) {
	if (typeof x == 'object') {
		px = y;
		py = w;
		y = x.y;
		w = x.w;
		h = x.h;
		x = x.x;
	}
	return px > x && py > y && px < x + w && py < y + h;
}

function ID() {

}
class UI {
	constuructor(p5Insance) {
		this.x = 0;
		this.y = 0;
		this.activeElementCanChange = true;
		this.activeElement = {
			id: 0
		};
		this.draggedElement = undefined;
		this.elements = [];
		this.p5Inst = p5Instance;
		if (!p5Instance) {
			throw new Error('No p5 instance passed to UI');
		}
	}
	run() {

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
	constructor(owner, x, y, w, h, dragable) {
		this.owner = owner;
		this.UI = this.owner instanceOf UI ? this.owner : this.owner.UI;
		this.isDragging = false;
		this.x = x;
		this.y = y;
		this.w = w || 10;
		this.h = h || 10;
		this.dragable = dragable || false;
	}
	draw() {
		noFill();
		stroke(255);
		rect(this.x, this.y, this.w, this.h);
	}
	mouseDown() {
		if (rpHitbox(this, mouseX, mouseY) && activeElementCanChange) {
			this.UI.activeElement = this;
		}
	}
	mouseDragged() {
		if (this.UI.draggedElement.id == this.id && this.dragable) {
			this.x = mouseX - this.w / 2;
			this.y = mouseX - this.h / 2;
		}
		if (rpHitbox(this, mouseX, mouseY) && this.UI.activeElement.id == this.id) {
			this.UI.draggedElement = this;
			this.UI.activeElementCanChange = false;
		}
	}
	mouseUp() {
		if (this.UI.draggedElement.id == this.id) {
			this.UI.draggedElement = undefined;
			this.activeElementCanChange = true;
		}
	}
}