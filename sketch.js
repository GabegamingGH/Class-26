const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world;
var canvas, angle, tower, ground, cannon;
var boats = []
var balls = []




function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");

}

function setup() {
  canvas = createCanvas(1200,600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(150, 350, 160, 310);
  cannon = new Cannon(180, 110, 100, 50, angle);


}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  

  Engine.update(engine);
  ground.display();
  

  cannon.display();
  tower.display();
  showBoats()
  for(var i = 0; i<balls.length; i++) {
    showCannonball(balls[i], i)
    collisionWithBoat(i)
  }
}

function showBoats() {
  if (boats.length>0) {
     if (boats[boats.length - 1]===undefined||boats[boats.length - 1].body.position.x<width - 300){
       var positions = [- 40, - 60, - 70, - 20]
       var position = random(positions)
       var boat = new Boat(width, height - 100, 170, 170, position)
       boats.push(boat)
     }
     for(var i = 0; i<boats.length; i++) {
       if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {x:-0.9, y:0})
        boats[i].display();
       }
     }
  }
  else {
    var boat = new Boat(width, height - 60, 170, 170, - 60)
    boats.push(boat)
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = []
    Matter.Body.setAngle(cannonBall.body,cannon.angle)
    balls.push(cannonBall)
  }
}

function showCannonball(ball, index) {
  if (ball) {
    ball.display()
    if (ball.body.position.x>=width||ball.body.position>=height-50) {
      ball.remove(index)
    }
  }
}


function keyReleased() {
  if (keyCode === DOWN_ARROW) {
balls[balls.length - 1].shoot()
  }
}

function collisionWithBoat(index) {
  for (var i = 0; i < boats.length; i++) {
    if (balls[index] !== undefined && boats[i] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body)
      if (collision.collided) {
        boats[i].remove(i)
        Matter.World.remove(world, balls[index].body)
        delete balls[index]
      }
    }
  }
}