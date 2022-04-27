const texturePaths = [
  '/icons/bee.svg',
  '/icons/cat.svg',
  '/icons/test.svg',
];

// Modify these to create more icons or make them move faster/slower
let maxIconCount = 30;
let accelerationFactor = 1;

let countdown = 30;
const color1 = 0x283d58;
const color2 = 0x1c542d;
const color3 = 0x8d1d2c;

const tableColors = [color2, color3];
const white = 0xffffff;
const color_header = 0xcaf0f8;

// Create the application helper and add its render target to the page
let app = new PIXI.Application({
    backgroundColor: white,
    resizeTo: window,
});
document.body.appendChild(app.view);

let iconCount = 0;
let icons = [];
let isIconShrinking = [];

const settings_icon = new PIXI.Texture.from('/icons/settings.svg')

let timer;
let overlayIsOpen = false;
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

// Load the textures
let textures = [];
for (let i in texturePaths) {

  fetchAsync(texturePaths[i]).then(svgAsString => {
    // Make white elements transparent
    const svgWithTransparency = svgAsString.replaceAll('fill="#FFFFFF"', 'fill="#FFFFFF" fill-opacity="0.0"');

    // Encode string as base64 svg, so that PIXI.SVGResource can load it
    const b64string = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgWithTransparency)));
    textures.push(PIXI.Texture.from(new PIXI.SVGResource(b64string, { height: 64 })));

    // Start the game if all textures have been loaded
    if (Number(i) === (texturePaths.length - 1)) {
      createSettingsOverlay();
    }
  });
}

function createSettingSpirit() {
    const settingsSprite = new PIXI.Sprite(settings_icon);
    settingsSprite.scale.x *= .02;
    settingsSprite.scale.y *= .02;
    settingsSprite.anchor.set(1.0, 0);
    settingsSprite.x = window.innerWidth - 15;
    settingsSprite.y = 15;
    // Opt-in to interactivity
    settingsSprite.interactive = true;

    // Shows hand cursor
    settingsSprite.buttonMode = true;
    settingsSprite.on('click', createSettingsOverlay)
    return settingsSprite;
}

// Resets score and starts a new game
function startNewGame() {
    iconCount = 0;
    icons = [];
    isIconShrinking = [];

    container = new PIXI.Container();
    app.stage.addChild(container);
    const settingsSprite = createSettingSpirit();
    container.addChild(settingsSprite);
    addCountdownTimer();
    ticker.start();
}

// Create a new icon with randomized properties
function addNewIcon() {
    const randomNumber = getRandomInt(0, textures.length);
    const icon = new PIXI.Sprite(textures[randomNumber]);
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
            gameStatus = localStorage.getItem("gameStatus").split(',').map(Number);
            if (gameStatus[randomNumber] === 0) {
                console.log("Minuspunkt");
            } else {
                console.log("Pluspunkt");
            }
        }
    });

    icons.push(icon);
    isIconShrinking.push(false);
    container.addChild(icon);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
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
    txt.anchor.set(0, 0);
    container.addChild(txt);
    txt.position.set(15, 15);

    var seconds = countdown - 1;
    timer = setInterval(function () {
        if (!ticker.started) {
            return;
        }
        if (seconds >= 0) {
            txt.text = "Verbleibende Zeit: " + seconds--;
        } else {
            // if the time is up, end the game
            ticker.stop();
            addGameEndOverlay();
            clearInterval(timer);
        }
    }, 1000);
}

function createPlayAgainButton(rect, text) {
    const fontSize = 25;
    const playAgain = new PIXI.Text(text, {
        fontSize: fontSize,
        fill: color_header,
    });
    playAgain.anchor.set(1, 0);
    playAgain.interactive = true;
    playAgain.buttonMode = true;
    playAgain.on("click", (_) => {
        clearExistingOverlays();
        overlayIsOpen = false;
        startNewGame();
    });

    rect.addChild(playAgain);
    playAgain.position.set(rect.width / 2, rect.height - (2 * fontSize));
    return playAgain;
}

// Creates overlay saying that the time is up and a button to restart the game
function addGameEndOverlay() {
    if (overlayIsOpen) {
        clearExistingOverlays();
    }

    overlayIsOpen = true;
    const rect = new PIXI.Graphics();
    const rectWidth = app.screen.width;
    rect.beginFill(color1).drawRect(0, 0, rectWidth, 200).endFill();
    rect.position.set(
        app.screen.width / 2 - rectWidth / 2,
        app.screen.height / 2 - 100
    );
    app.stage.addChild(rect);

    const timeUp = new PIXI.Text("Zeit abgelaufen!", {
        fontSize: 35,
        fill: color_header,
    });
    timeUp.anchor.set(0.5);
    app.stage.addChild(timeUp);
    timeUp.position.set(app.screen.width / 2, app.screen.height / 2 - 50);

    createPlayAgainButton(rect, "Neu starten");
}

function createSettingsOverlay() {
    if (overlayIsOpen) {
        clearExistingOverlays();
    }

    overlayIsOpen = true;
    ticker.stop();
    clearInterval(timer);
    const rect = new PIXI.Graphics();
    const rectWidth = app.screen.width;
    const rectHeight = app.screen.height / 2;
    rect.beginFill(color1).drawRect(0, 0, rectWidth, rectHeight).endFill();
    rect.position.set(
        app.screen.width / 2 - rectWidth / 2,
        app.screen.height / 2 - rectHeight / 2
    );
    app.stage.addChild(rect);

    let fontSize = 35;
    const configDialogTitle = new PIXI.Text("Spieleinstellungen", {
        fontSize: fontSize,
        fill: color_header,
    });
    configDialogTitle.anchor.set(1, 0);
    rect.addChild(configDialogTitle);
    configDialogTitle.position.set(rect.width / 2, fontSize);
    createPlayAgainButton(rect, "Spiel starten");

    const gameStatusDict = {
        0: "Leben lassen",
        1: "Abschießen"
    }

    savedGameStatus = localStorage.getItem("gameStatus");
    let gameStatus = savedGameStatus ? savedGameStatus.split(',').map(Number) : [];

    for (let i = 0; i < textures.length; i++) {
        const row = new PIXI.Graphics();
        const xPosition = (i+1) * 128;
        const yPosition = 64;

        if (i > (gameStatus.length-1)) {
            gameStatus[i] = i % 2;
        }

        row.beginFill(tableColors[gameStatus[i]]).drawCircle(xPosition, yPosition, 48).endFill();
        row.position.set(
            0,
            80
        );

        let rowText = new PIXI.Text(gameStatusDict[gameStatus[i]], {
            fontSize: 20,
            fill: color_header
        });
        rowText.anchor.set(0.5);
        row.addChild(rowText);
        rowText.position.set(xPosition, yPosition + 72);

        row.interactive = true;
        row.buttonMode = true;
        row.on("click", (_) => {
            gameStatus[i] = (gameStatus[i]+1) >= tableColors.length ? 0 : (gameStatus[i]+1);
            rowText.text = gameStatusDict[gameStatus[i]];
            localStorage.setItem("gameStatus", gameStatus);
            row.beginFill(tableColors[gameStatus[i]]).drawCircle(xPosition, yPosition, 48).endFill();
        });

        rect.addChild(row);
        const icon = new PIXI.Sprite(textures[i]);
        row.addChild(icon);
        icon.anchor.set(0.5);
        icon.position.set(xPosition, yPosition);
    }

    localStorage.setItem("gameStatus", gameStatus);
}

function clearExistingOverlays() {
    app.stage.removeChildren();
}

async function fetchAsync (url) {
  let response = await fetch(url);
  let data = await response.text();
  return data;
}
