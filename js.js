const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

let player = {
    score: 0,
};
let keys = {
    ArrowUp: false
    , ArrowDown: false
    , ArrowRight: false
    , ArrowLeft: false
};
let speed = 10;
startScreen.addEventListener("click", start);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

function moveLines() {
    let lines = document.querySelectorAll(".line");
    lines.forEach(function (item) {
        if (item.y >= 1500) {
            item.y -= 1500;
        }
        item.y += speed;
        item.style.top = item.y + "px";
    })
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        (aRect.bottom < bRect.top) || (aRect.top > bRect.bottom) || (aRect.right < bRect.left) || (aRect.left > bRect.right))
}

function moveEnemy(car) {
    let ele = document.querySelectorAll(".enemy");
    ele.forEach(function (item) {
        if (isCollide(car, item)) {
            console.log("HIT");
            endGame();
        }
        if (item.y >= 1500) {
            item.y = -600;
            item.style.left = Math.floor(Math.random() * 150) + "px";
            item.style.backgroundColor = randomColor();
        }
        item.y += speed;
        item.style.top = item.y + "px";
    })
}

function playGame() {
    let car = document.querySelector(".car");
    moveLines();
    moveEnemy(car);
    speed = 10;
    let road = gameArea.getBoundingClientRect();
    if (player.start) {
        if (keys.ArrowUp && player.y > road.top) {
            player.y -= speed;
        }
        if (keys.ArrowDown && player.y < road.bottom) {
            player.y += speed;
        }
        if (keys.ArrowLeft && player.x > 0) {
            player.x -= speed;
        }
        if (keys.ArrowRight && player.x < (road.width - 50)) {
            player.x += speed;
        }
        car.style.left = player.x + 'px';
        car.style.top = player.y + 'px';
        window.requestAnimationFrame(playGame);
        if(player.score>1500) speed = 25;
        player.score++;
        score.innerText = `Level ${player.score>1500? 2 : 1}
         Wynik:   ${player.score} `;
    }
}

function pressOn(e) {
    e.preventDefault();
    keys[e.key] = true;
}

function pressOff(e) {
    e.preventDefault();
    keys[e.key] = false;
}

function endGame() {
    player.start = false;
    score.innerHTML = "Koniec gry <br>Wynik końcowy: " + player.score;
    startScreen.classList.remove("hide");
}

function start() {
    startScreen.classList.add("hide");
    
    gameArea.innerHTML = "";
    player.start = true;
    player.score = 0;
    for (let x = 0; x < 10; x++) {
        let div = document.createElement("div");
        div.classList.add("line");
        div.y = x * 150;
        div.style.top = (x * 150) + "px";
        gameArea.appendChild(div);
    }
    window.requestAnimationFrame(playGame);
    let car = document.createElement("div");
    //car.innerText = "Car";
    car.setAttribute("class", "car");
    gameArea.appendChild(car);
    player.x = car.offsetLeft;
    player.y = car.offsetTop;
    for (let x = 0; x < 3; x++) {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.innerHTML = "<br>" + (x + 1);
        enemy.y = ((x + 1) * 600) * -1;
        enemy.style.top = enemy.y + "px";
        enemy.style.left = Math.floor(Math.random() * 150) + "px";
        enemy.style.backgroundColor = randomColor();
        gameArea.appendChild(enemy);
    }
}

function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + String(hex)).substr(-2)
    }
    return "#" + c() + c() + c();
}