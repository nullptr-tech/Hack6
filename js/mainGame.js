// Code for performance monitor
(function() {
	var script = document.createElement("script");
	script.onload = function() {
		var stats = new Stats();
		document.body.appendChild(stats.dom);
		requestAnimationFrame(function loop() {
			stats.update();
			requestAnimationFrame(loop);
		});
	};
	script.src = "//rawgit.com/mrdoob/stats.js/master/build/stats.min.js";
	document.head.appendChild(script);
})();
var wantsToPlayMusic = true;
// Variables for bound boxes
var wallOneBound, floor;
// Menu buttons
var audio, playbtn, music, pausebtn, slectLevelBtn, iceyBtn, chemicalBtn;
// Audio
var gameAudio, mainMenuMusic, deathAudio, playDeath, mutebtn;
// Camera,controls and scene objects
var camera, scene, renderer, controls;
// Whether or not the game is paused
var gamePause;
// Stores bound boxes objects for the jumpy rocks, normal rocks and sinking rocks, respectively
var objects = [],
	objects2 = [],
	objects3 = [];
var raycaster;
var score = 0;
// Colors for ridges of the wall and the lava
var floorColour = 0xF8F8F8,
	floorColour2 = 0xF8F8F8,
	floorColour3 = 0xF8F8F8,
	wallColour = 0x000000;
var fogColour = 0xffffff,
    fogColour2 = 0xffffff;
var backgroundColour = 0xffffff;
// Elements of the menu screen
var blocker = document.getElementById("blocker");
var instructions = document.getElementById("instructions");
var selectMenu = document.getElementById("selectMenu");
var menuScreen = document.getElementById("menuScreen");
var pauseScreen = document.getElementById("pauseScreen");
var selectScreen = document.getElementById("selectScreen");
// Gets pointer lock
var defPointerLockElement = document.body;
var defPointerUnlockElement = document;
defPointerLockElement.requestPointerLock =
	defPointerLockElement.requestPointerLock ||
	defPointerLockElement.mozRequestPointerLock ||
	defPointerLockElement.webkitRequestPointerLock;

defPointerUnlockElement.exitPointerLock =
	defPointerUnlockElement.exitPointerLock ||
	defPointerUnlockElement.mozExitPointerLock ||
	defPointerUnlockElement.webkitExitPointerLock;


setTimeout(hideDiv, 6900);
function hideDiv() {
	document.getElementById("loadingScreen").style.display = "none";
}

// Remove key elements of enviroment, replace them with texturees in new style
function switchLevel(icey) {
	// Remove floor and remove lava
	scene.remove(floor);
	// Remove all four walls
	scene.remove(wall);
	// Sets colors depending on selection
	if (icey == true) {
		floorColour = 0xffffff;
		floorColour2 = 0xd7dbff;
		floorColour3 = 0xa8afe3;
		wallColour = 0x9eeefa;
		scene.background = new THREE.Color(0x032a30);
		scene.fog = new THREE.Fog(0x055361, 0, 200);
		fogColour2 = 0x38a1ff;
	} else {
		floorColour = 0xd6dbd6;
		floorColour2 = 0x000000;
		floorColour3 = 0x687a68;
		wallColour = 0x77b575;
		scene.background = new THREE.Color(0x242923);
		scene.fog = new THREE.Fog(0x485346, 0, 200);
		fogColour2 = 0x32e02c;
	}
	// Generate new floor geometry object
	floorGeometry = new THREE.PlaneGeometry(200, 200, 70, 70);
	floorGeometry.rotateX(-Math.PI / 2);
	for (var i = 0, l = floorGeometry.vertices.length; i < l; i++) {
		var vertex = floorGeometry.vertices[i];
		vertex.x += Math.random() * 15 - 10;
		vertex.y += Math.random() * 5;
		vertex.z += Math.random() * 15 - 10;
	}
	for (var i = 0, l = floorGeometry.faces.length; i < l; i++) {
		var face4 = floorGeometry.faces[i];
		face4.vertexColors[0] = new THREE.Color(floorColour);
		face4.vertexColors[1] = new THREE.Color(floorColour2);
		face4.vertexColors[2] = new THREE.Color(floorColour3);
	}
	var floorMaterial = new THREE.MeshBasicMaterial({
		vertexColors: THREE.VertexColors
	});
	floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.translateY(-70);
	scene.add(floor);
	// Generate new walls
	var wallMaterial = new THREE.MeshBasicMaterial({
		color: wallColour,
		specular: 0xffffff,
		flatShading: true
	});
	var wall = new THREE.Mesh(wallGeometry, wallMaterial);
	scene.add(wall);
}

iceyBtn = document.getElementById("iceyBtn");
chemicalBtn = document.getElementById("chemicalBtn");
iceyBtn.addEventListener("click", switchTrack);
chemicalBtn.addEventListener("click", switchTrack);
quitbtn = document.getElementById("quitBtn");
quitbtn.addEventListener("click", switchTrack);

//----------------------------------------------------------------------------------------------------------------------------------------------------------

mainMenuMusic = new Audio();
mainMenuMusic.src = "audio/normalMusic.mp3";
mainMenuMusic.loop = true;
mainMenuMusic.play();

//----------------------------------------------------------------------------------------------------------------------------------------------------------
mutebtn = document.getElementById("muteBtn");
mutebtn.style.background = "url(images/speaker.png) no-repeat";
mutebtn.addEventListener("click", muteAudio);

function muteAudio() {
	var isMuted = mainMenuMusic.muted;
	if (isMuted === true) {
		mainMenuMusic.muted = !mainMenuMusic.muted;
		mutebtn.style.background = "";
		mutebtn.style.background = "url(images/speaker.png) no-repeat";
		wantsToPlayMusic = true;
	}

	if (isMuted === false) {
		mainMenuMusic.muted = !mainMenuMusic.muted;
		mutebtn.style.background = "";
		mutebtn.style.background = "url(images/muted.png) no-repeat";
		wantsToPlayMusic = false;
	}
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------------------------------------------
playbtn = document.getElementById("playBtn");

if (wantsToPlayMusic == true) {
	playbtn.addEventListener("click", switchTrack);
}

function switchTrack() {
	mainMenuMusic.muted = true;
	if (wantsToPlayMusic) {
		gameAudio = new Audio();
		gameAudio.src = "audio/normalMusic.mp3";
		gameAudio.loop = true;
		gameAudio.play();
	}
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------
function pauseGameplay() {
	gameAudio.muted = true;
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------

// Event listener for menu screen
document.addEventListener("click", e => {
	switch (e.target.id) {
		case "playBtn":
			defPointerLockElement.requestPointerLock();
			menuScreen.style.display = "none";
			break;
		case "slectLevelBtn":
			selectMenu.style.display = "block";
			menuScreen.style.display = "none";
			break;

		case "iceyBtn":
			defPointerLockElement.requestPointerLock();
			selectMenu.style.display = "none";
			switchLevel(true);
			break;

		case "chemicalBtn":
			defPointerLockElement.requestPointerLock();
			selectMenu.style.display = "none";
			switchLevel(false);
			break;

		case "helpBtn":
			instructions.style.display = "block";
			menuScreen.style.display = "none";
			break;
		case "backBtn":
			defPointerUnlockElement.exitPointerLock();
			menuScreen.style.display = "block";
			blocker.style.display = "block";
			pauseScreen.style.display = "none";
            break;

		case "continueBtn":
			defPointerLockElement.requestPointerLock();
			break;
		case "quitBtn":
			window.location.reload();
			defPointerUnlockElement.exitPointerLock();
			menuScreen.style.display = "block";
			blocker.style.display = "block";
			pauseScreen.style.display = "none";
	}
});
// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
var havePointerLock =
	"pointerLockElement" in document ||
	"mozPointerLockElement" in document ||
	"webkitPointerLockElement" in document;
if (havePointerLock) {
	var element = document.body;
	var pointerlockchange = function(event) {
		if (
			document.pointerLockElement === element ||
			document.mozPointerLockElement === element ||
			document.webkitPointerLockElement === element
		) {
			controlsEnabled = true;
			controls.enabled = true;
			blocker.style.display = "none";
			pauseScreen.style.display = "none";
		} else {
			controls.enabled = false;
			blocker.style.display = "block";
			instructions.style.display = "";
			selectMenu.style.display = "";
			pauseScreen.style.display = "block";
		}
	};
	var pointerlockerror = function(event) {
		instructions.style.display = "";
		selectMenu.style.display = "";
	};
	// Hook pointer lock state change events
	document.addEventListener("pointerlockchange", pointerlockchange, false);
	document.addEventListener("mozpointerlockchange", pointerlockchange, false);
	document.addEventListener(
		"webkitpointerlockchange",
		pointerlockchange,
		false
	);
	document.addEventListener("pointerlockerror", pointerlockerror, false);
	document.addEventListener("mozpointerlockerror", pointerlockerror, false);
	document.addEventListener("webkitpointerlockerror", pointerlockerror, false);
	instructions.addEventListener(
		"click",
		function(event) {
			instructions.style.display = "none";
			// Ask the browser to lock the pointer
			element.requestPointerLock =
				element.requestPointerLock ||
				element.mozRequestPointerLock ||
				element.webkitRequestPointerLock;
			element.requestPointerLock();
		},
		false
	);
} else {
	instructions.innerHTML =
		"Your browser doesn't seem to support Pointer Lock API";
}

var onProgress = function(xhr) {
	if (xhr.lengthComputable) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log(Math.round(percentComplete, 2) + "% downloaded");
	}
};
var onError = function(xhr) {};

init();

var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var floorGeometry;
var wallGeometry;

function init() {
	var mtlLoader = new THREE.MTLLoader();
	// Entire initialisation is ran inside callback, to prevent javascript not loading RockObject
	mtlLoader.load("models/Rock1.mtl", function(materials) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.load(
			"models/Rock1.obj",
			function(object) {
				camera = new THREE.PerspectiveCamera(
					75,
					window.innerWidth / window.innerHeight,
					1,
					350
				);
				scene = new THREE.Scene();
				scene.background = new THREE.Color(backgroundColour);
				scene.fog = new THREE.Fog(fogColour, 0, 200);
				var light = new THREE.HemisphereLight(0xeeeeff, 0x53535f, 0.75);
				light.position.set(0.5, 1, 0.75);
				scene.add(light);
				controls = new THREE.PointerLockControls(camera);
				scene.add(controls.getObject());
				var onKeyDown = function(event) {
					switch (event.keyCode) {
						case 38: // up
						case 87: // w
							moveForward = true;
							break;
						case 37: // left
						case 65: // a
							moveLeft = true;
							break;
						case 40: // down
						case 83: // s
							moveBackward = true;
							break;
						case 39: // right
						case 68: // d
							moveRight = true;
							break;
						case 32: // space
							if (canJump === true) velocity.y += 250;
							canJump = false;
							break;
					}
				};
				var onKeyUp = function(event) {
					switch (event.keyCode) {
						case 38: // up
						case 87: // w
							moveForward = false;
							break;
						case 37: // left
						case 65: // a
							moveLeft = false;
							break;
						case 40: // down
						case 83: // s
							moveBackward = false;
							break;
						case 39: // right
						case 68: // d
							moveRight = false;
							break;
					}
				};

				document.addEventListener("keydown", onKeyDown, false);
				document.addEventListener("keyup", onKeyUp, false);

				//----------------------------------------------------------------//
				// floor and cubes//
				//----------------------------------------------------------------//

				// Creates wall geometry
				wallGeometry = new THREE.PlaneGeometry(100, 100);
				wallGeometry.rotateY(-Math.PI);
				for (var i = 0, l = wallGeometry.vertices.length; i < l; i++) {
					var vertex = wallGeometry.vertices[i];
					vertex.x += 30 - 5;
					vertex.y += 3 + 40;
					vertex.z += 30 + 70;
				}

				// Creates floor geometry
				floorGeometry = new THREE.PlaneGeometry(200, 200, 70, 70);
				floorGeometry.rotateX(-Math.PI / 2);
				for (var i = 0, l = floorGeometry.vertices.length; i < l; i++) {
					var vertex = floorGeometry.vertices[i];
					vertex.x += Math.random() * 15 - 10;
					vertex.y += Math.random() * 5;
					vertex.z += Math.random() * 15 - 10;
				}
				for (var i = 0, l = floorGeometry.faces.length; i < l; i++) {
					var face4 = floorGeometry.faces[i];
					face4.vertexColors[0] = new THREE.Color(floorColour);
					face4.vertexColors[1] = new THREE.Color(floorColour2);
					face4.vertexColors[2] = new THREE.Color(floorColour3);
				}
				// Creates geometry for bound boxes

				const testBox = new THREE.BoxGeometry(1,1,1);

				var testBoxMaterials = [
					new THREE.MeshBasicMaterial({map: new THREE.TextureLoader( ).load("./test_img.jpg"), side:THREE.DoubleSide}),
					new THREE.MeshBasicMaterial({map: new THREE.TextureLoader( ).load("./test_img.jpg"), side:THREE.DoubleSide}),
					new THREE.MeshBasicMaterial({map: new THREE.TextureLoader( ).load("./test_img.jpg"), side:THREE.DoubleSide}),
					new THREE.MeshBasicMaterial({map: new THREE.TextureLoader( ).load("./test_img.jpg"), side:THREE.DoubleSide}),
					new THREE.MeshBasicMaterial({map: new THREE.TextureLoader( ).load("./test_img.jpg"), side:THREE.DoubleSide}),
					new THREE.MeshBasicMaterial({map: new THREE.TextureLoader( ).load("./test_img.jpg"), side:THREE.DoubleSide}),
				];

				//const testBoxMaterials = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

				const tMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
				const testCube = new THREE.Mesh( testBox, tMaterial);

				scene.add(testCube);


				var boxGeometry = new THREE.BoxGeometry(13, 0.01, 13);

				var boxGeometry2 = new THREE.BoxGeometry(16, 0.01, 16);

				var boxGeometry3 = new THREE.BoxGeometry(21, 0.01, 21);

				var wallMaterial = new THREE.MeshBasicMaterial({
					color: wallColour,
					specular: 0xFF0000,
					flatShading: true
				});
				var wall = new THREE.Mesh(wallGeometry, testBoxMaterials);
			
				scene.add(wall);

				// Creates bound boxes for the wall
				wallOneBound = new THREE.BoxHelper(wall, 0xffff00);
				wallOneBound.update(wall);
				scene.add(wallOneBound);
				raycaster = new THREE.Raycaster(
					new THREE.Vector3(),
					new THREE.Vector3(0, 1, 0),
					0,
					10
				);
				raycasterWall = new THREE.Raycaster(
					new THREE.Vector3(),
					new THREE.Vector3(0, 1, 0),
					0,
					0
				);

				// floor
				var floorMaterial = new THREE.MeshBasicMaterial({
					vertexColors: THREE.VertexColors
				});
				floor = new THREE.Mesh(floorGeometry, floorMaterial);
				floor.translateY(-70);
				scene.add(floor);
				//
				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setSize(window.innerWidth, window.innerHeight);
				document.body.appendChild(renderer.domElement);
				//
				window.addEventListener("resize", onWindowResize, false);
				animate();
			},
			onProgress,
			onError
		);
	});
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

playDeath = true;

function animate() {
	requestAnimationFrame(animate);
	if (controlsEnabled === true) {
		raycaster.ray.origin.copy(controls.getObject().position);
		raycaster.ray.origin.y -= 10;
		raycasterWall.ray.origin.copy(controls.getObject().position);
		raycasterWall.ray.origin.y -= 10;
		// Creates raycaster objects to detect intersections
		var intersections = raycaster.intersectObjects(objects);
		var intersections2 = raycaster.intersectObjects(objects2);
		var intersections3 = raycaster.intersectObjects(objects3);
		var intersections4 = raycasterWall.intersectObject(wallOneBound);
		var intersections8 = raycasterWall.intersectObject(floor);
		// Detects if player has made contact with a bound box
		var onObject = intersections.length > 0;
		var onObject2 = intersections2.length > 0;
		var onObject3 = intersections3.length > 0;
		var onObject4 = intersections4.length > 0;
		var onFloor = intersections8.length > 0;
		var time = performance.now();
		var delta = (time - prevTime) / 1000;
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		velocity.y -= 4 * 100.0 * delta; // 100.0 = mass
		direction.z = Number(moveForward) - Number(moveBackward);
		direction.x = Number(moveLeft) - Number(moveRight);
		// This ensures consistent movements in all directions
		direction.normalize();

		if (gamePause) {
			// stops game when you die, controls disabled
			defPointerUnlockElement.exitPointerLock();
			document.getElementById("continueBtn").style.display = "none";
		} else {
			if (moveForward || moveBackward)
				velocity.z -= direction.z * 400.0 * delta;
			if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
			if (camera.getWorldPosition().y > 20) {
				if (onObject != true || onObject2 != true || onObject3 != true) {
					canJump = false;
				}
			}
			if (onObject === true) {
				velocity.y = 350;
				canJump = false;
			}
			if (onObject2 === true) {
				velocity.y = Math.max(0, velocity.y);
				canJump = true;
			}
			// When you hit a sinking rock
			if (onObject3 === true) {
				velocity.y = Math.max(-7, velocity.y);
				canJump = false;
			}
			if (onObject4 === true) {
				if (moveForward == true) {
					velocity.z = 200;
				}
				if (moveBackward == true) {
					velocity.z = -200;
				}
				if (moveRight == true) {
					velocity.x = -200;
				}
				if (moveLeft == true) {
					velocity.x = 200;
				}
			}
		}
		if (onFloor) {
			scene.fog = new THREE.Fog(fogColour2, 0, 60);
			document.getElementById("scoreText").style.display = "none";
			gamePause = true;
		    displayScore();
		}

		controls.getObject().translateX(velocity.x * delta);
		controls.getObject().translateY(velocity.y * delta);
		controls.getObject().translateZ(velocity.z * delta);
		if (controls.getObject().position.y < 10) {
			velocity.y = 0;
			controls.getObject().position.y = 10;
			canJump = true;
		}

		prevTime = time;
	}
	currentScore = Math.round(camera.getWorldPosition().y - 10);
	if (currentScore > score) {
		score = currentScore;
	}
	document.getElementById("scoreText").innerHTML = "Score: ".concat(score);

	renderer.render(scene, camera);
}
function displayScore()
{
	document.getElementById("scoreContainer").innerHTML = '<p id = "finalScore"></p>';
	document.getElementById("scoreDisplay").innerHTML = score;
}