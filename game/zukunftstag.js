// These should be modifiable by the player
let maxIconCount = 20;
let accelerationFactor = 1;
let countdown = 30;
let iconURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/bee.svg";

// Create the application helper and add its render target to the page
let app = new PIXI.Application({
  backgroundColor: 0xffffff,
  resizeTo: window,
});
document.body.appendChild(app.view);

let iconCount = 0;
let highscore = 0;
var icons = [];
var isIconShrinking = [];

// Create the texture
let texture = new PIXI.Texture.from(iconURL);

// Add a ticker callback to move the icons
let ticker = PIXI.Ticker.shared;
ticker.autoStart = false;
ticker.add(() => {
  for (i = 0; i < icons.length; i++) {
    moveIcon(icons[i]);
    changeIconSize(icons[i], i);
  }

  if (iconCount < maxIconCount) {
    setTimeout(() => {
      if (ticker.started && container.children.length < maxIconCount) {
        addNewIcon();
      }
    }, Math.floor(Math.random() * 1000 * iconCount++));
  }
});

startNewGame();

// Resets score and starts a new game
function startNewGame() {
  iconCount = 0;
  highscore = 0;
  icons = [];
  isIconShrinking = [];

  container = new PIXI.Container();
  app.stage.addChild(container);
  addCountdownTimer();
  ticker.start();
}

// Create a new icon with randomized properties
function addNewIcon() {
  var icon = new PIXI.Sprite(texture);
  icon.position.x = Math.random() * window.innerWidth;
  icon.position.y = Math.random() * window.innerHeight;
  icon.speedX = (Math.random() - 0.5) * 2;
  icon.speedY = (Math.random() - 0.5) * 2;

  icon.accX = (Math.random() - 0.5) * 0.001 * accelerationFactor;
  icon.accY = (Math.random() - 0.5) * 0.001 * accelerationFactor;

  icon.anchor.set(0.5);
  icon.scale.set(0.5 + Math.random() * 0.5);
  icon.rotation = Math.random() - 0.5;

  icon.interactive = true;
  icon.buttonMode = true;
  // Remove the icon when it is clicked
  icon.on("click", (_) => {
    if (ticker.started) {
      icon.parent.removeChild(icon);
      iconCount--;
      highscore++;
    }
  });

  icons.push(icon);
  isIconShrinking.push(false);
  container.addChild(icon);
}

// Define movement of the icons
function moveIcon(icon) {
  icon.position.x += icon.speedX;
  icon.position.y += icon.speedY;
  icon.speedX += icon.accX;
  icon.speedY += icon.accY;
  icon.accX += (Math.random() - 0.5) * 0.001 * accelerationFactor;
  icon.accY += (Math.random() - 0.5) * 0.001 * accelerationFactor;

  if (icon.position.x > window.innerWidth - 25) {
    icon.speedX *= -1;
    icon.position.x = window.innerWidth - 25;
  } else if (icon.position.x < 25) {
    icon.speedX *= -1;
    icon.position.x = 25;
  }

  if (icon.position.y > window.innerHeight - 25) {
    icon.speedY *= -1;
    icon.position.y = window.innerHeight - 25;
    icon.spin = (Math.random() - 0.5) * 0.2;
  } else if (icon.position.y < 25) {
    icon.speedY *= -1;
    icon.position.y = 25;
  }
}

// Define growth and shrinkage of icons
function changeIconSize(icon, i) {
  sizeDifference = Math.random() * 0.01;
  if (isIconShrinking[i]) {
    icon.scale.x -= sizeDifference;
    icon.scale.y -= sizeDifference;

    if (icon.scale.x < 0.5) {
      isIconShrinking[i] = false;
    }
  } else {
    icon.scale.x += sizeDifference;
    icon.scale.y += sizeDifference;

    if (icon.scale.x > 1.5) {
      isIconShrinking[i] = true;
    }
  }
}

// Add countdown timer that stops the game
function addCountdownTimer() {
  const txt = new PIXI.Text("Verbleibende Zeit: " + countdown, {
    fontSize: 25,
  });
  txt.anchor.set(0.5);
  container.addChild(txt);
  txt.position.set(txt.width - 100, 15);

  var seconds = countdown - 1;
  let timer = setInterval(function () {
    if (seconds >= 0) {
      txt.text = "Verbleibende Zeit: " + seconds--;
    } else {
      // if the time is up, end the game
      ticker.stop();

      // save the score if its higher than the previous highscore
      const highscoreUntilNow = localStorage.getItem("highscore");
      if (!highscoreUntilNow || highscore > highscoreUntilNow) {
        localStorage.setItem("highscore", highscore);
      }
      addGameEndOverlay();
      clearInterval(timer);
    }
  }, 1000);
}

// Creates overlay saying that the time is up and a button to restart the game
function addGameEndOverlay() {
  const rect = new PIXI.Graphics();
  const rectWidth = app.screen.width / 4 > 400 ? app.screen.width / 4 : 400;
  rect.beginFill(0x20214f).drawRect(0, 0, rectWidth, 300).endFill();
  rect.position.set(
    app.screen.width / 2 - rectWidth / 2,
    app.screen.height / 2 - 100
  );
  app.stage.addChild(rect);

  const timeUp = new PIXI.Text("Zeit abgelaufen!", {
    fontSize: 35,
    fill: 0xffffff,
  });
  timeUp.anchor.set(0.5);
  app.stage.addChild(timeUp);
  timeUp.position.set(app.screen.width / 2, app.screen.height / 2 - 50);

  const score = new PIXI.Text("Aktueller Score: " + String(highscore), {
    fontSize: 25,
    fill: 0xffffff,
  });
  score.anchor.set(0.5);
  app.stage.addChild(score);
  score.position.set(app.screen.width / 2, app.screen.height / 2);

  const highscoreUntilNow = localStorage.getItem("highscore");
  const highestScore = new PIXI.Text(
    "Highscore: " + String(highscoreUntilNow),
    {
      fontSize: 25,
      fill: 0xffffff,
    }
  );
  highestScore.anchor.set(0.5);
  app.stage.addChild(highestScore);
  highestScore.position.set(app.screen.width / 2, app.screen.height / 2 + 50);

  if (highscore > highscoreUntilNow) {
    const newRecord = new PIXI.Text("Neuer Rekord!", {
      fontSize: 25,
      fill: 0x19e619,
    });
    newRecord.anchor.set(0.5);
    app.stage.addChild(newRecord);
    newRecord.position.set(app.screen.width / 2, app.screen.height / 2 + 100);
  }

  const playAgain = new PIXI.Text("Neu starten", {
    fontSize: 25,
    fill: 0xffffff,
  });
  playAgain.anchor.set(0.5);
  playAgain.interactive = true;
  playAgain.buttonMode = true;
  playAgain.on("click", (_) => {
    playAgain.parent.removeChild(playAgain);
    timeUp.parent.removeChild(timeUp);
    score.parent.removeChild(score);
    highestScore.parent.removeChild(highestScore);
    if (highscore > highscoreUntilNow) {
      newRecord.parent.removeChild(newRecord);
    }
    rect.parent.removeChild(rect);
    container.destroy();
    startNewGame();
  });

  app.stage.addChild(playAgain);
  playAgain.position.set(app.screen.width / 2, app.screen.height / 2 + 150);
}
