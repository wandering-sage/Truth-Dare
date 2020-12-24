const truthQues = [
	"What are your top three turn-ons?",
	"What is your deepest darkest fear?",
	"What is the biggest lie you have ever told?",
	"What is the most expensive thing you have stolen?",
	"What is the most embarrassing thing your parents have caught you doing?",
	"Why did you break up with your last boyfriend or girlfriend?",
	"What is the most embarrassing nickname you have ever had?",
	"Tell us something you don’t want us to know.",
	"Do you have any fetishes?",
	"What's the most drunk you've ever been?",
	"Have you ever stayed friends with someone because it benefitted you beyond just the friendship?",
];
const dareQues = [
	"Show the last five people you texted and what the messages said",
	"Say something dirty to the person on your left",
	"Keep your eyes closed until it's your go again",
	"Pole dance with an imaginary pole",
	"Talk in an accent for the next 3 rounds.",
	"Attempt to do a magic trick.",
	"Give someone your phone and let them send one text to anyone in your contacts.",
	"Write or draw something embarrassing somewhere on your body with a permanent marker.",
	"Let the person to your left draw on your face with a pen.",
	"Seduce a member of the same gender in the group.",
	"Send a sext to the last person in your phonebook",
	"Choose someone from the group to give you a spanking.",
];
var players = [];

// declaring variables
var wheelRadius = 250;
var pi = Math.PI;
var startAngle = 0;
var angle = 0;
var spinAngleStart = 0;
var spinTimeTotal = 0;
var spinTime = 0;
var spinTimeout;
var arc = 0;
var ctx;
const canvas = document.querySelector(".wheel");

addPlayers();
drawWheel();

const addBtn = document.querySelector(".btn-add");
addBtn.addEventListener("click", addPlayers);

const spinBtn = document.querySelector(".btn-spin");
spinBtn.addEventListener("click", spin);

// **************************Functions***************************************
// **************************************************************************

function addPlayers() {
	// openPopup returns a destructor function
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

	// *****************Functions******************

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

	// openPopup returns a destructor function
	let closePopup = openPopup();
	let popup = document.querySelector(".popup");

	popup.appendChild(createEl("h2", `${person}'s Turn`));
	popup.appendChild(createEl("p", "Choose one:"));

	let TruthBtn = document.createElement("button", HTMLButtonElement);
	TruthBtn.innerText = "Truth!";
	TruthBtn.className = "btn btn-truth";
	TruthBtn.onclick = showQues("Truth");
	popup.appendChild(TruthBtn);

	let DareBtn = document.createElement("button", HTMLButtonElement);
	DareBtn.innerText = "Dare!";
	DareBtn.className = "btn btn-dare";
	DareBtn.onclick = showQues("Dare");
	popup.appendChild(DareBtn);

	// *****************Functions*****************

	function showQues(type) {
		function ret() {
			closePopup();
			// openPopup returns a destructor function
			let closeIt = openPopup();
			let popup = document.querySelector(".popup");

			popup.appendChild(createEl("h2", `${type}`));

			// checks which ques to put in the current popup
			popup.appendChild(
				createEl(
					"p",
					`${
						type == "Dare"
							? shuffle(dareQues)[
									Math.floor(Math.random() * dareQues.length)
							  ]
							: shuffle(truthQues)[
									Math.floor(Math.random() * truthQues.length)
							  ]
					}`
				)
			);

			let doneBtn = document.createElement("button", HTMLButtonElement);
			doneBtn.innerText = "Done";
			doneBtn.className = "btn btn-done";
			doneBtn.onclick = closeIt;
			popup.appendChild(doneBtn);
		}
		return ret;
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

	// a loop to draw equal sectors for each player on the wheel
	for (let i = 0; i < l; i++) {
		var text = players[i];
		angle = startAngle + i * arc;

		if (i == l - 1 && (l % 3) - 1 == 0) {
			i++;
		}
		ctx.fillStyle = wheelColors[i % 3];

		ctx.beginPath();
		ctx.arc(260, 260, wheelRadius, angle, angle + arc, false);
		ctx.lineTo(260, 260);
		ctx.fill();

		// to write the name of the player on that sector
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

	// to draw circle outlining the wheel
	ctx.beginPath();
	ctx.arc(260, 260, wheelRadius, 0, 2 * pi);
	ctx.lineWidth = 3;
	ctx.stroke();

	// to draw triangle on right side of wheel
	ctx.fillStyle = "rgba(255, 251, 0, 0.4)";
	ctx.beginPath();
	ctx.moveTo(260 + wheelRadius - 40, 260);
	ctx.lineTo(260 + wheelRadius + 40, 260 - 20);
	ctx.lineTo(260 + wheelRadius + 40, 260 + 20);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
}

function spin() {
	// so that user cant press spin button twice or more
	spinBtn.disabled = true;

	spinAngleStart = Math.random() * 10 + 10;
	spinTime = 0;

	// total spin time comes b/w 3sec to 5sec
	spinTimeTotal = Math.random() * 2000 + 3 * 1000;
	rotateWheel();
}

// this function will run in loop till spinTime exceeds total spin time
function rotateWheel() {
	spinTime += 10;
	if (spinTime >= spinTimeTotal) {
		stopWheelAndGetPlayer();
		return;
	}
	// to slow down the wheel near end by reducing the angle of rotation per loop
	var spinAngle =
		spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
	startAngle += (spinAngle * pi) / 180;
	drawWheel();
	spinTimeout = setTimeout("rotateWheel()", 10);
}

function stopWheelAndGetPlayer() {
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

function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}
