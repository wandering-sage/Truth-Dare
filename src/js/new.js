var players = [];
addPlayers();

var outsideRadius = 250;
var pi = Math.PI;
let startAngle = 0;
let angle = 0;
var arc = 0;
var ctx;

const addBtn = document.querySelector(".btn-add");
addBtn.addEventListener("click", addPlayers);

const canvas = document.querySelector(".wheel");
drawWheel();

const spinBtn = document.querySelector(".btn-spin");
spinBtn.addEventListener("click", spin);

function addPlayers() {
	let closePopup = openPopup();
	let popup = document.querySelector(".popup");
	popup.appendChild(createEl("h2", "Add Players (Atleast 2)"));

	let plrList = document.createElement("ul", HTMLUListElement);
	plrList.className = "playerList";
	popup.appendChild(plrList);
	players.forEach((player) => {
		plrList.innerHTML += listElement(player);
	});

	popup.appendChild(createEl("label", "Name: "));
	let inp = document.createElement("input", HTMLInputElement);
	inp.type = "text";
	inp.className = "inp-name";
	popup.appendChild(inp);

	let startBtn = document.createElement("button", HTMLButtonElement);
	startBtn.innerText = "Start!";
	startBtn.className = "btn btn-start";
	startBtn.onclick = closeAndDraw;
	if (players.length < 2) {
		startBtn.disabled = true;
		startBtn.style.pointerEvents = "none";
	}
	popup.appendChild(startBtn);

	inp.addEventListener("keyup", (e) => {
		if (e.key == "Enter") {
			players.push(e.target.value);
			plrList.innerHTML += listElement(e.target.value);
			e.target.value = "";
			if (players.length > 1) {
				startBtn.disabled = false;
				startBtn.style.pointerEvents = "auto";
			}
		}
	});

	function closeAndDraw() {
		closePopup();
		drawWheel();
	}

	function listElement(name) {
		return `<li>${name}<button class="btn removePlr" onclick="removePlayer()">X</button>
        </li>`;
	}
}

function tdPopup(person) {
	spinBtn.disabled = false;

	let closePopup = openPopup();
	let popup = document.querySelector(".popup");

	popup.appendChild(createEl("h2", `${person}'s Turn`));
	popup.appendChild(createEl("p", "Choose one:"));

	let TruthBtn = document.createElement("button", HTMLButtonElement);
	TruthBtn.innerText = "Truth!";
	TruthBtn.className = "btn btn-truth";
	TruthBtn.onclick = showTruth;
	popup.appendChild(TruthBtn);

	let DareBtn = document.createElement("button", HTMLButtonElement);
	DareBtn.innerText = "Dare!";
	DareBtn.className = "btn btn-dare";
	DareBtn.onclick = showDare;
	popup.appendChild(DareBtn);

	function showTruth() {
		closePopup();
		let closeIt = openPopup();
		let popup = document.querySelector(".popup");

		popup.appendChild(createEl("h2", `Truth`));
		popup.appendChild(createEl("p", "Here's a truth Ques"));

		let doneBtn = document.createElement("button", HTMLButtonElement);
		doneBtn.innerText = "Done";
		doneBtn.className = "btn btn-done";
		doneBtn.onclick = closeIt;
		popup.appendChild(doneBtn);
	}

	function showDare() {
		closePopup();
		let closeIt = openPopup();
		let popup = document.querySelector(".popup");

		popup.appendChild(createEl("h2", `Dare`));
		popup.appendChild(createEl("p", "Here's a dare Ques"));

		let doneBtn = document.createElement("button", HTMLButtonElement);
		doneBtn.innerText = "Done";
		doneBtn.className = "btn btn-done";
		doneBtn.onclick = closeIt;
		popup.appendChild(doneBtn);
	}
}

function openPopup() {
	let blurScr = document.createElement("div");
	blurScr.classList.add("blur-bg");
	document.body.appendChild(blurScr);

	let popup = document.createElement("div");
	popup.classList.add("popup");
	document.body.appendChild(popup);

	return closePopup;

	function closePopup() {
		blurScr.remove();
		popup.remove();
	}
}

function createEl(tagName, text) {
	let el = document.createElement(tagName);
	el.innerText = text;
	return el;
}

function removePlayer() {
	let item = event.target.parentElement;
	let s = String(item.textContent).trim().slice(0, -1);
	players.splice(players.indexOf(s), 1);
	item.remove();
	if (players.length < 2) {
		let btn = document.querySelector(".btn-start");
		btn.disabled = true;
		btn.style.pointerEvents = "none";
	}
}

function drawWheel() {
	ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, 500, 500);
	ctx.strokeStyle = "black";
	ctx.lineWidth = 3;

	let l = players.length;
	let wheelColors = ["#FF9900", "#006666", "#990066"];
	arc = (2 * pi) / l;
	let textRadius = 170;

	for (let i = 0; i < l; i++) {
		var text = players[i];
		angle = startAngle + i * arc;

		if (i == l - 1 && (l % 3) - 1 == 0) {
			i++;
		}
		ctx.fillStyle = wheelColors[i % 3];

		ctx.beginPath();
		ctx.arc(260, 260, outsideRadius, angle, angle + arc, false);
		ctx.lineTo(260, 260);
		ctx.fill();

		ctx.save();
		ctx.fillStyle = wheelColors[(i + 1) % 3];
		ctx.translate(
			250 + Math.cos(angle + arc / 2) * textRadius,
			250 + Math.sin(angle + arc / 2) * textRadius
		);
		ctx.rotate(angle + arc / 2 + Math.PI / 2 + 80);
		ctx.font = "bold 20px Arial";
		ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
		ctx.restore();
	}

	// to draw circle
	ctx.beginPath();
	ctx.arc(260, 260, outsideRadius, 0, 2 * pi);
	ctx.lineWidth = 3;
	ctx.stroke();

	// to draw triangle
	ctx.fillStyle = "rgba(255, 251, 0, 0.4)";
	ctx.beginPath();
	ctx.moveTo(260 + outsideRadius - 40, 260);
	ctx.lineTo(260 + outsideRadius + 40, 260 - 20);
	ctx.lineTo(260 + outsideRadius + 40, 260 + 20);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
}

function spin() {
	spinBtn.disabled = true;
	spinAngleStart = Math.random() * 10 + 10;
	spinTime = 0;
	spinTimeTotal = Math.random() * 2000 + 3 * 1000;
	rotateWheel();
}

function rotateWheel() {
	spinTime += 10;
	if (spinTime >= spinTimeTotal) {
		stopRotateWheel();
		return;
	}
	var spinAngle =
		spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
	startAngle += (spinAngle * pi) / 180;
	drawWheel();
	spinTimeout = setTimeout("rotateWheel()", 10);
}

function stopRotateWheel() {
	clearTimeout(spinTimeout);
	var degrees = (startAngle * 180) / pi;
	var arcd = (arc * 180) / pi;
	var index = Math.floor((360 - (degrees % 360)) / arcd);
	tdPopup(players[index]);
}

function easeOut(t, b, c, d) {
	var ts = (t /= d) * t;
	var tc = ts * t;
	return b + c * (tc + -3 * ts + 3 * t);
}
