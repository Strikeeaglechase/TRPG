var keys = [];
var UI;
var tree = [ //
	{
		txt: 'Words words words words words words',
		opts: [{
			txt: 'option 1',
			targetId: 1
		}, {
			txt: 'option 2',
			targetId: 2
		}],
		id: 0,
		x: 200,
		y: 200
	},
	{
		txt: 'I am option 1',
		opts: [{
			txt: 'Back to start',
			targetId: 0
		}, {
			txt: 'Option 2',
			targetId: 2
		}],
		id: 1,
		x: 200,
		y: 200
	},
	{
		txt: 'I am option 2',
		opts: [{
			txt: 'Back to start',
			targetId: 0
		}, {
			txt: 'Option 1',
			targetId: 1
		}],
		id: 2,
		x: 200,
		y: 200
	}
];

function k(letter) {
	return keys[letter.toUpperCase().charCodeAt(0)];
}

function btn(x, y, w, h, txt, col) {
	if (!txt) {
		txt = '';
	}
	var needW = textWidth(txt);
	var acW = max(w, needW + buttonSpacer);
	fill(col || 0);
	rect(x, y, acW, h);
	fill(255);
	text(txt, x + 5, y + h / 2 + 4);
	if (mouseX > x && mouseX < x + acW && mouseY > y && mouseY < y + h) {
		if (mouseIsPressed) {
			fill(0, 255, 0, 100);
			rect(x, y, acW, h);
			return true;
		} else {
			fill(0, 100);
			rect(x, y, acW, h);
			return false;
		}
	}
}

function drawTree(x, y) {

}

function setup() {
	createCanvas(windowWidth, windowHeight);
	p5Instance = createCanvas(windowWidth, windowHeight);
	p5Instance.canvas.oncontextmenu = function(e) {
		e.preventDefault();
	};
	UI = new UI_Controller(p5Instance);
	var newElm = new UI_Element(UI, 200, 200, 50, 50, {
		dragable: true,
		clickable: true
	});
	newElm.spawnElement(new UI_Element(newElm, 0, 100, 50, 50, {
		dragable: true,
		clickable: true
	}));
	newElm.spawnElement(new UI_Element(newElm, 100, 0, 50, 50, {
		dragable: true,
		clickable: true
	}));
	UI.spawnElement(newElm);
}

function draw() {
	background(0);
	drawTree(windowWidth / 2, 50);
	UI.run();
}

function keyPressed() {
	keys[keyCode] = true;
}

function keyReleased() {
	keys[keyCode] = false;
}

function mousePressed() {
	UI.mouseDown();
}

function mouseDragged() {
	UI.mouseDragged();
}

function mouseReleased() {
	UI.mouseUp();
}
// function windowResized() {}
// function mouseWheel(e) {}