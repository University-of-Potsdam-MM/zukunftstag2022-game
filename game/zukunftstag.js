let maxSpriteCount = 20;

let spriteCount = 0;
var sprites = [];

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
app.ticker.add((delta) => {
  for (i = 0; i < sprites.length; i++) {
    moveSprite(sprites[i]);
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

  sprite.anchor.y = 0.5;
  sprite.anchor.x = 0.5;
  sprite.scale.set(0.5 + Math.random() * 0.5);
  sprite.rotation = Math.random() - 0.5;

  sprites.push(sprite);

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

  if (sprite.position.x > window.innerWidth - 50) {
    sprite.speedX *= -1;
    sprite.position.x = window.innerWidth - 50;
  } else if (sprite.position.x < 50) {
    sprite.speedX *= -1;
    sprite.position.x = 50;
  }

  if (sprite.position.y > window.innerHeight - 50) {
    sprite.speedY *= -0.85;
    sprite.position.y = window.innerHeight - 50;
    sprite.spin = (Math.random() - 0.5) * 0.2;
  } else if (sprite.position.y < 50) {
    sprite.speedY *= -0.85;
    sprite.position.y = 50;
  }
}
