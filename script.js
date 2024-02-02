const grid = document.querySelector(".grid");
const result = document.querySelector(".result");
const width = 15;
const aliensRemoved = [];
let currentshooterIndex = 202;
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;
let isGameOver = false;

for (let i = 0; i < width * width; i++) {
  const square = document.createElement("div");

  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

const numberOfRandomNumbers = 27; // Define the number of random numbers you want in the array
const min = 0; // Minimum value
const max = 39; // Maximum value
const alienInvaders = [];

// Generate random numbers and push them into the array
for (let i = 0; i < numberOfRandomNumbers; i++) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  alienInvaders.push(randomNumber);
}

// const alienInvaders=[0,1,2,3,4,5,6,7,8,9,15,16,17,18,19,20,21,22,23,24,30,31,32,33,34,35,36,37,38,39];
function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add("invader");
    }
  }
}

draw();

squares[currentshooterIndex].classList.add("shooter");

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove("invader");
  }
}

function moveShooter(e) {
  squares[currentshooterIndex].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
      if (currentshooterIndex % width !== 0) currentshooterIndex -= 1;
      break;

    case "ArrowRight":
      if (currentshooterIndex % width < width - 1) currentshooterIndex += 1;
      break;
  }
  squares[currentshooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();

  if (rightEdge && isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      isGoingRight = false;
    }
  }
  if (leftEdge && !isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      isGoingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }

  draw();
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].classList.contains("shooter")) {
      for (let j = 0; j < alienInvaders.length; j++) {
        if (squares[i].classList.contains("invader")) {
          isGameOver = true;
          break;
        }
      }
    }
  }
  if (isGameOver) {
    results = "GAME OVER";
    result.innerHTML = results;

    clearInterval(invadersId);
  }
  if (aliensRemoved.length === alienInvaders.length) {
    results = "YOU WIN";
    result.textContent = results;
    clearInterval(invadersId);
    setTimeout(function () {
      var response = confirm("Do you want to play again?");
      if (response == true) {
        location.reload(true);
        console.log("User wants to proceed.");
      } else {
        console.log("User does not want to proceed.");
      }
    }, 2000);
  }
}

invadersId = setInterval(moveInvaders, 600);

function shoot(e) {
  let laserid;
  let currentLaserIndex = currentshooterIndex;
  function moveLaser() {
    squares[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;

    squares[currentLaserIndex].classList.add("laser");
    if (squares[currentLaserIndex].classList.contains("invader")) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.add("boom");

      setTimeout(
        () => squares[currentLaserIndex].classList.remove("boom"),
        300
      );
      clearInterval(laserid);
      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      results++;
      result.textContent = results;
      console.log(aliensRemoved);
    }
  }
  if (e.key === "ArrowUp") {
    laserid = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);
