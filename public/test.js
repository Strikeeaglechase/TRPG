String.prototype.reverse = function() {
	return this.split('').reverse().join('');
}
String.prototype.hasDupe = function() {
	var text = this.split('');
	return text.some(function(v, i, a) {
		return a[i - 1] == v;
	});
}
Array.prototype.clone = function() {
	return JSON.parse(JSON.stringify(this));
}
const NAME_SIZE = 1;
const MAX_CONNS = 3;
const MAX_SAFE_REC = 10000;
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
var funcCalls = 0;
var nodes = [ //
	{
		name: 'a',
		conn: 'bce'
	},
	{
		name: 'b',
		conn: 'ad'
	},
	{
		name: 'c',
		conn: 'ade'
	},
	{
		name: 'd',
		conn: 'bc'
	},
	{
		name: 'e',
		conn: 'ac'
	}
];
nodes.forEach(n => n.conn = n.conn.split(''));

function numToLetter(val) {
	var let1Mult = Math.floor(val / 26);
	return LETTERS[let1Mult] + LETTERS[val - (let1Mult * 26)];
}

function makeRandomNodes(num) {
	nodes = [];
	for (var i = 0; i < num; i++) {
		nodes.push({
			name: numToLetter(i),
			conn: []
		});
	}
	nodes.forEach(node => {
		var numConns = Math.max(1, Math.floor(Math.random() * MAX_CONNS));
		for (var i = 0; i < numConns; i++) {
			var otherNode = nodes[Math.floor(Math.random() * nodes.length)];
			if (otherNode.name != node.name && !node.conn.includes(otherNode.name)) {
				node.conn.push(otherNode.name);
				otherNode.conn.push(node.name);
			}
		}
	});
}

// makeRandomNodes(5);

var cx = 0;
var cy = 0;
var rad = 200;

var possible = [];
var allEdges = [];

function visited(path, paths) {
	return paths.some(p => compare(p, path));
}

function countLets(str) {
	var counts = {};
	LETTERS.forEach(letter => counts[letter] = 0);
	str.split('').forEach(letter => counts[letter]++);
	return counts;
}

function compare(p1, p2) {
	var c1 = countLets(p1);
	var c2 = countLets(p2);
	var hasDif = false;
	for (letter in c1) {
		if (c1[letter] != c2[letter]) {
			hasDif = true;
		}
	}
	return !hasDif;
}

function getAllPossible(startingNode, visitedPaths) {
	funcCalls++;
	if (funcCalls > MAX_SAFE_REC) {
		console.log('Tree terminated..');
		return;
	}
	if (!visitedPaths) {
		nodes.forEach((node, idx) => {
			getAllPossible(node, []);
		});
		return;
	}
	var wasAbleToContinue = false;
	var node = startingNode || nodes.find(n => {
		var p = visitedPaths[visitedPaths.length - 1]
		return n.name == p.substring(NAME_SIZE);
	});
	node.conn.forEach((connection, idx) => {
		var connNode = nodes.find(n => n.name == connection);
		var path = node.name + '' + connNode.name;
		if (!visited(path, visitedPaths)) {
			// console.log(node.name + ' -> ' + connection);
			visitedPaths.push(path);
			getAllPossible(undefined, visitedPaths.clone());
			wasAbleToContinue = true;
		}
	});
	if (!wasAbleToContinue) {
		// console.log('--- Path ended with len %s ---', visitedPaths.length);
		possible.push(visitedPaths);
	}
}

function isECirc(paths) {
	return paths[0].substring(0, NAME_SIZE) == paths[paths.length - 1].substring(NAME_SIZE) && paths.length == allEdges.length;
}

function isEPath(paths) {
	return paths[0][0] != paths[paths.length - 1][1] && paths.length == allEdges.length;
}

function getECircs() {
	var aval = possible.filter(p => isECirc(p));
	return aval.map(path => formatPath(path));
}

function getEPaths() {
	var aval = possible.filter(p => isEPath(p));
	return aval.map(path => formatPath(path));
}

function formatPath(path) {
	if (!path || path.length == 0) {
		return '';
	}
	var txt = '';
	path.forEach(node => {
		txt += node[0];
	});
	var lastNode = path[path.length - 1];
	txt += lastNode.substring(NAME_SIZE);
	return txt;
}

function getName() {
	var txt = '';
	nodes.forEach(node => {
		txt += node.name.toUpperCase() + node.conn.length;
	});
	return txt;
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	textSize(24);
	nodes.forEach(node => {
		node.conn.forEach(c => {
			var path = node.name + c;
			if (!visited(path, allEdges)) {
				allEdges.push(path);
			}
		});
	});
	console.log('Init done');
	console.log('Starting calulation');
	var d = Date.now();
	getAllPossible();
	console.log('Calculation done in %sms', Date.now() - d);
	possible = possible.filter(p => {
		return !formatPath(p).hasDupe()
	});
}

// C B A E F B F G C D H G

function draw() {
	background(0);
	text(getName(), 10, 20);
	var y = 0;
	text('Circs: ', 10, y += 60);
	getECircs().forEach(c => text(c, 10, y += 30));
	text('Paths: ', 10, y += 50);
	getEPaths().forEach(c => text(c, 10, y += 30));

	cx = windowWidth / 2;
	cy = windowHeight / 2;
	for (var i = 0; i < nodes.length; i++) {
		var angle = i * (360 / nodes.length);
		noFill();
		stroke(255);
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
		noStroke();
		fill(255);
		text(nodes[i].name, cx + cos(angle) * rad, cy + sin(angle) * rad - 24)
	}
}