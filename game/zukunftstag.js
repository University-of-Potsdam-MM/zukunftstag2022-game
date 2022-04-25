// These should be modifiable by the player
let maxIconCount = 20;
let accelerationFactor = 1;
let countdown = 30;

const color1 = 0x03045e;
const color2 = 0x0077b6;
const color3 = 0x0096c7;

const tableColors = [color2, color3]
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

// Create the texture
let textures = [new PIXI.Texture.from('/icons/bee.svg'), new PIXI.Texture.from('/icons/cat.svg')];
const settings_icon = new PIXI.Texture.from('/icons/settings.svg')


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

function createSettingSpirit() {
    const settingsSprite = new PIXI.Sprite(settings_icon);
    settingsSprite.scale.x *= .02;
    settingsSprite.scale.y *= .02;
    settingsSprite.anchor.set(1.0, 0);
    settingsSprite.x = window.innerWidth - 30;
    settingsSprite.y = 0;
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
    const randomNumber = Math.min(Math.round(Math.random() * textures.length - 1), textures.length - 1)
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

function createPlayAgainButton(timeUp, rect, text) {
    const fontSize = 25;
    const playAgain = new PIXI.Text(text, {
        fontSize: fontSize,
        fill: color_header,
    });
    playAgain.anchor.set(0.5);
    playAgain.interactive = true;
    playAgain.buttonMode = true;
    playAgain.on("click", (_) => {
        playAgain.parent.removeChild(playAgain);
        timeUp.parent.removeChild(timeUp);
        rect.parent.removeChild(rect);
        container.destroy();
        startNewGame();
    });

    rect.addChild(playAgain);
    playAgain.position.set(rect.width / 2, rect.height - (2 * fontSize));
    return playAgain;
}

// Creates overlay saying that the time is up and a button to restart the game
function addGameEndOverlay() {
    const rect = new PIXI.Graphics();
    const rectWidth = app.screen.width / 4 > 400 ? app.screen.width / 4 : 400;
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

    createPlayAgainButton(timeUp, rect, "Neu starten");
}

function createSettingsOverlay() {
    ticker.stop();
    const rect = new PIXI.Graphics();
    const rectWidth = app.screen.width > 400 ? app.screen.width : 400;
    const rectHeight = app.screen.height - 100;
    rect.beginFill(color1).drawRect(0, 0, rectWidth, rectHeight).endFill();
    rect.position.set(
        app.screen.width / 2 - rectWidth / 2,
        app.screen.height / 2 - rectHeight / 2
    );
    app.stage.addChild(rect);

    let fontSize = 35;
    const configDialogTitle = new PIXI.Text("Konfiguration der Elemente", {
        fontSize: fontSize,
        fill: color_header,
    });
    configDialogTitle.anchor.set(0.5);
    rect.addChild(configDialogTitle);
    configDialogTitle.position.set(rect.width / 2, fontSize);
    createPlayAgainButton(configDialogTitle, rect, "Spiel starten");

    for (let i = 0; i < textures.length; i++) {
        const row = new PIXI.Graphics();
        row.beginFill(tableColors[i % 2]).drawRect(0, i * 64, rectWidth, 64).endFill();
        row.position.set(
            rect.x,
            80
        );
        rect.addChild(row);
        const icon = new PIXI.Sprite(textures[i]);
        row.addChild(icon)
        icon.anchor.set(0, 0)
        icon.x = 0;
        icon.y = i * 64;
    }
}