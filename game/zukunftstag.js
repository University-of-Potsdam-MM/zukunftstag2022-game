// Create the application helper and add its render target to the page
let app = new PIXI.Application({ width: 640, height: 360 });
document.body.appendChild(app.view);

// Create the sprite and add it to the stage
var svgUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/bee.svg";
var svgTexture = new PIXI.Texture.from(svgUrl);
var svg = new PIXI.Sprite(svgTexture);
app.stage.addChild(svg);

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta;
  svg.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
});
