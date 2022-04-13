// These should be modifiable by the player
let maxIconCount = 20;
let accelerationFactor = 1;
let iconURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/bee.svg";

// Create the application helper and add its render target to the page
let app = new PIXI.Application({
  backgroundColor: 0xffffff,
  resizeTo: window,
});
document.body.appendChild(app.view);

let iconCount = 0;
var icons = [];
var isIconShrinking = [];

// Create the texture
let texture = new PIXI.Texture.from(iconURL);
addNewIcon();

// Add a ticker callback to move the icons
app.ticker.add(() => {
  for (i = 0; i < icons.length; i++) {
    moveIcon(icons[i]);
    changeIconSize(icons[i], i);
  }

  if (iconCount < maxIconCount) {
    addNewIcon();
  }
});

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
    icon.parent.removeChild(icon);
    iconCount--;
  });

  icons.push(icon);
  isIconShrinking.push(false);

  setTimeout(() => {
    app.stage.addChild(icon);
  }, Math.floor(Math.random() * 1000 * iconCount++));
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
