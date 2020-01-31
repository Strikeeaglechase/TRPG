var nodes = [ //
	{
		name: 'a',
		conn: ['b', 'c']
	},
	{
		name: 'b',
		conn: ['d', 'a', 'e', 'c']
	},
	{
		name: 'c',
		conn: ['a', 'd', 'e', 'b']
	},
	{
		name: 'd',
		conn: ['b', 'c', 'f', 'e']
	},
	{
		name: 'e',
		conn: ['c', 'f', 'b', 'd']
	},
	{
		name: 'f',
		conn: ['d', 'e']
	},
];
var cx = 0;
var cy = 0;
var rad = 200;

var possible = [];

function canMove(n1, n2, paths) {
	var pathName = getPathName(n1, n2).name;
	return !paths.find(p => p.name == pathName);
}

function getPathName(n1, n2) {
	var name = [n1.name, n2.name];
	name.sort();
	return {
		name: name.join(''),
		path: [n1.name, n2.name]
	};
}

function getAllPossible(currentNode, visitedPaths) {
	if (!currentNode) {
		nodes.forEach(node => {
			getAllPossible(node, []);
		});
		return;
	}
	var wasAbleToContinue = false;
	currentNode.conn.forEach(connection => {
		var connNode = nodes.find(n => n.name == connection);
		if (canMove(currentNode, connNode, visitedPaths)) {
			var path = getPathName(currentNode, connNode);
			visitedPaths.push(path);
			getAllPossible(connNode, visitedPaths);
			wasAbleToContinue = true;
		}
	});
	if (!wasAbleToContinue) {
		possible.push(visitedPaths);
	}
}

function run() {
	getAllPossible();
	possible.forEach(pos => {
		var txt = pos.map(v => v.path.join()).join(' => ');
		console.log(txt);
	});
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
}

function draw() {
	background(0);
	noFill();
	stroke(255);
	cx = windowWidth / 2;
	cy = windowHeight / 2;
	for (var i = 0; i < nodes.length; i++) {
		var angle = i * (360 / nodes.length);
		ellipse(cx + cos(angle) * rad, cy + sin(angle) * rad, 10, 10);
		nodes[i].conn.forEach(conn => {
			var idx = 0;
			nodes.forEach((c, i) => idx = c.name == conn ? i : idx);
			var angle2 = idx * (360 / nodes.length);
			line(
				cx + cos(angle) * rad,
				cy + sin(angle) * rad,
				cx + cos(angle2) * rad,
				cy + sin(angle2) * rad
			);
		});
	}
}