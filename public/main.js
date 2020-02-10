var keys = [];
var UI;
var mouseUp = true;
var buttonSpacer = 10;
const TEXT_SIZE = 12;
const SIDEBAR_SIZE = 150;
const SIDEBAR_BUFF = 25;
const SIDE_BTN_WID = SIDEBAR_SIZE - SIDEBAR_BUFF;
const SIDE_BTN_HEI = TEXT_SIZE + 3;
const Y_SPACER = 15;
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
	// fill(col || 0);
	fill(51);
	rect(x, y, acW, h);
	fill(255);
	noStroke();
	text(txt, x + 5, y + h / 2 + 4);
	if (mouseX > x && mouseX < x + acW && mouseY > y && mouseY < y + h && mouseUp) {
		if (mouseIsPressed) {
			fill(0, 255, 0, 100);
			rect(x, y, acW, h);
			mouseUp = false;
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

	var sidebarData = [{
		lb: 'noU'
	}, {
		lb: 'die'
	}, {
		lb: '1'
	}, {
		lb: '2'
	}, {
		lb: 'wut'
	}];
	var sidebar = new UI_Sidebar(UI, 'right', sidebarData)
	UI.spawnElement(sidebar);

	// var sidebar2 = new UI_Sidebar(UI, 'left', sidebarData)
	// UI.spawnElement(sidebar2);
}

function draw() {
	background(0);
	drawTree(windowWidth / 2, 50);
	if (textSize() != UI.TEXT_SIZE) {
		textSize(UI.TEXT_SIZE);
	}
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
	mouseUp = true;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
// function mouseWheel(e) {}{}