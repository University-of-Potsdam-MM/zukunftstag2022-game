let maxSpriteCount = 20;

let spriteCount = 0;
var sprites = [];
var isSpriteShrinking = [];

// Create the application helper and add its render target to the page
let app = new PIXI.Application({
  backgroundColor: 0xffffff,
  resizeTo: window,
});
document.body.appendChild(app.view);

// Create the texture
let svgUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/bee.svg";
let svgTexture = new PIXI.Texture.from(svgUrl);
addSprite();

// Add a ticker callback to move the sprites
app.ticker.add(() => {
  for (i = 0; i < sprites.length; i++) {
    moveSprite(sprites[i]);
    changeSpriteSize(sprites[i], i);
  }

  if (spriteCount < maxSpriteCount) {
    addSprite();
  }
});

// Create a new sprite with randomized properties
function addSprite() {
  var sprite = new PIXI.Sprite(svgTexture);
  sprite.position.x = Math.random() * window.innerWidth;
  sprite.position.y = Math.random() * window.innerHeight;
  sprite.speedX = (Math.random() - 0.5) * 10;
  sprite.speedY = (Math.random() - 0.5) * 10;

  sprite.accX = (Math.random() - 0.5) * 0.1;
  sprite.accY = (Math.random() - 0.5) * 0.1;

  sprite.anchor.set(0.5);
  sprite.scale.set(0.5 + Math.random() * 0.5);
  sprite.rotation = Math.random() - 0.5;

  sprites.push(sprite);
  isSpriteShrinking.push(false);

  setTimeout(() => {
    app.stage.addChild(sprite);
  }, Math.floor(Math.random() * 1000 * spriteCount++));
}

// Define movement of the sprites
function moveSprite(sprite) {
  sprite.position.x += sprite.speedX;
  sprite.position.y += sprite.speedY;
  sprite.speedX += sprite.accX;
  sprite.speedY += sprite.accY;
  sprite.accX += (Math.random() - 0.5) * 0.001;
  sprite.accY += (Math.random() - 0.5) * 0.001;

  if (sprite.position.x > window.innerWidth - 25) {
    sprite.speedX *= -1;
    sprite.position.x = window.innerWidth - 25;
  } else if (sprite.position.x < 25) {
    sprite.speedX *= -1;
    sprite.position.x = 25;
  }

  if (sprite.position.y > window.innerHeight - 25) {
    sprite.speedY *= -1;
    sprite.position.y = window.innerHeight - 25;
    sprite.spin = (Math.random() - 0.5) * 0.2;
  } else if (sprite.position.y < 25) {
    sprite.speedY *= -1;
    sprite.position.y = 25;
  }
}

function changeSpriteSize(sprite, i) {
  sizeDifference = Math.random() * 0.01;
  if (isSpriteShrinking[i]) {
    sprite.scale.x -= sizeDifference;
    sprite.scale.y -= sizeDifference;

    if (sprite.scale.x < 0.5) {
      isSpriteShrinking[i] = false;
    }
  } else {
    sprite.scale.x += sizeDifference;
    sprite.scale.y += sizeDifference;

    if (sprite.scale.x > 1.5) {
      isSpriteShrinking[i] = true;
    }
  }
}
