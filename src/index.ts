import { Application, Sprite, Texture } from "pixi.js";

const app = new Application<HTMLCanvasElement>({
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x6495ed,
  width: 640,
  height: 480,
});

document.body.appendChild(app.view);

const left = Texture.from("tenochan left.png");
const right = Texture.from("tenochan side.png");

// PNGファイルからスプライトを作成
const tenochan = new Sprite(right);

// スプライトの中心を定義
tenochan.anchor.x = 0.5;
tenochan.anchor.y = 0.5;

// キャンバスの中央に配置
tenochan.x = app.screen.width / 2;
tenochan.y = app.screen.height / 2;

tenochan.width = 50;
tenochan.height = 50;

app.stage.addChild(tenochan);

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "ArrowRight") {
    tenochan.x += 10;
    tenochan.texture = right;
  }
  if (e.key === "ArrowLeft") {
    tenochan.x -= 10;
    tenochan.texture = left;
  }
  if (e.key === "ArrowUp") tenochan.y -= 10;
  if (e.key === "ArrowDown") tenochan.y += 10;
};

document.addEventListener("keydown", onKeyDown);

// 左右バージョンの魚
const leftFish = Texture.from("fish.png");
const rightFish = Texture.from("fish right.png");
const food: Sprite = Sprite.from(leftFish);

food.anchor.set(0.5); // center of the sprite (0,0 is top left, 1,1 is bottom right)

food.x = app.screen.width - 100;
food.y = 0 + 50;

app.stage.addChild(food);

// Collision tester
const isColliding = (a: Sprite, b: Sprite) => {
  const ab = a.getBounds();
  const bb = b.getBounds();
  return (
    ab.x + ab.width > bb.x &&
    ab.x < bb.x + bb.width &&
    ab.y + ab.height > bb.y &&
    ab.y < bb.y + bb.height
  );
};

// 2つの間のランダムな数値を生成する関数
const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// 現在の魚の移動方向と速度、およびそれらを変更するための関数
let directionX = "left";
let directionY = "down";
let speed = randomIntFromInterval(1, 10);

const changeXDirection = () => {
  if (directionX === "left") directionX = "right";
  else directionX = "left";
};

const changeYDirection = () => {
  if (directionY === "down") directionY = "up";
  else directionY = "down";
};

const changeSpeed = () => {
  speed = randomIntFromInterval(1, 5);
};

const onGameOver = () => {
  app.ticker.stop();
  tenochan.width = 500;
  tenochan.height = 500;
  tenochan.x = app.screen.width / 2;
  tenochan.y = app.screen.height / 2;
  food.visible = false;
};

const onTenochanFeeding = () => {
  food.x = Math.random() * app.screen.width;
  food.y = 0;
  food.width = randomIntFromInterval(20, 80);
  food.height = food.width;
  // テノちゃんを太らせる 😂
  tenochan.width += 10;
  tenochan.height += 10;
  if (tenochan.width > 200) {
    onGameOver();
  }
};

// 魚をランダムに移動させるためのメイン関数。
// ランダムなタイミングで更新されるため、時々魚が停止することもあり、
// これは良いことです。
const randomlyMoveFish = () => {
  if (directionX === "left") {
    food.x -= Math.random() * speed;
    food.texture = leftFish;
  } else {
    food.x += Math.random() * speed;
    food.texture = rightFish;
  }
  if (directionY === "down") food.y += Math.random() * speed;
  else food.y -= Math.random() * speed;

  // 方向や速度をたまにしか変更しない
  if (randomIntFromInterval(1, 500) > 495) changeXDirection();
  if (randomIntFromInterval(1, 500) > 495) changeYDirection();
  if (randomIntFromInterval(1, 500) > 495) changeSpeed();
};

// キャンバス内に魚があることを確認する関数
const ensureFishInBounds = () => {
  if (food.y > app.screen.height - 40) food.y = app.screen.height - 40;
  if (food.y < 40) food.y = 40;
  if (food.x > app.screen.width - 100) food.x = app.screen.width - 100;
  if (food.x < 60) food.x = 60;
};

app.ticker.add(() => {
  if (isColliding(tenochan, food)) {
    onTenochanFeeding();
  } else {
    randomlyMoveFish();
    ensureFishInBounds();
  }
});
