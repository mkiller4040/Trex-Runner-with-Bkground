var trex,trexRunning,trexCollided;

var ground,invisGround,groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var cloudsGroup, cloudImage;

var score;

var PLAY = 1, END = 0, gameState = PLAY;

var gameOver, restart, gameOverImage, restartImage

var checkpointSound, deathSound, jumpSound;

var backgroundImg;

function preload()
{
  trexRunning = loadAnimation("trex1.png","trex3.png","trex4.png");
  
  trexCollided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  checkpointSound = loadSound('checkPoint.mp3');
  jumpSound = loadSound('jump.mp3');
  deathSound = loadSound('die.mp3');

  backgroundImg = loadImage('mountain_landscape.png')
}

  
function setup() 
{ 
  checkpointSound = loadSound('checkPoint.mp3');
  jumpSound = loadSound('jump.mp3');
  deathSound = loadSound('die.mp3');
  
  createCanvas(displayWidth, displayHeight/3);
  
  score = 0;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running",trexRunning);
  trex.addAnimation("collided",trexCollided);
  trex.scale = 0.45;
  
  ground = createSprite(200,displayHeight/3,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/4;
  
  invisGround = createSprite(200,displayHeight/3 + 10,400,10);
  invisGround.visible = false;
  
  gameOver = createSprite(300,displayHeight/3 - 80);
  restart = createSprite(300,displayHeight/3 - 40);
  
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  restart.addImage(restartImage);
  restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
}

function draw() 
{
  background(backgroundImg);
  
  console.log(trex.y);

  camera.position.x = trex.x;
  camera.position.y = displayHeight/3;

  text ("Score:" + score, 500,displayHeight/3 - 80);
  
  if(gameState === PLAY)
{
  score = score + Math.round(getFrameRate()/60);
  trex.collide(invisGround);
  trex.velocityY = trex.velocityY + 1;
   
  ground.velocityX = -(6 + score/100*3);
  
  if(keyDown("space") && trex.y > 224)
  {
    trex.velocityY = -12.5;
    jumpSound.play();
  }   
  
  if(ground.x < 0)
  {
    ground.x = ground.width/4;
  }
  
  spawnObstacles();
  
  spawnClouds();
  
  if(score % 100 === 0 && score > 0) 
   {
     checkpointSound.play();
   }
  
  if(obstaclesGroup.isTouching(trex))
{
  gameState = END  
  deathSound.play();
}
  
}
  else if(gameState === END)
  {
  gameOver.visible = true;
  restart.visible = true;
    
  ground.velocityX = 0;
  trex.velocityY = 0;
  obstaclesGroup.setVelocityXEach(0);
  cloudsGroup.setVelocityXEach(0);
    
  trex.changeAnimation("collided",trexCollided);
    
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
  
  if(mousePressedOver(restart)) 
  {
    reset();
  }
  
}
  
  drawSprites();
}

function spawnObstacles() 
{
  if(frameCount % 60 === 0) 
  {
    var obstacle = createSprite(600,displayHeight/3 - 15,10,40);
    obstacle.velocityX = -(6 + score/100*3);
    
    var rand = Math.round(random(1,6));
              
    switch(rand)
    {
      case 1: obstacle.addImage("obstacle1", obstacle1);
      break;
        
      case 2: obstacle.addImage("obstacle2", obstacle2); 
      break;
      
      case 3: obstacle.addImage("obstacle3", obstacle4); 
      break;
      
      case 4: obstacle.addImage("obstacle4", obstacle4); 
      break;
      
      case 5: obstacle.addImage("obstacle5", obstacle5); 
      break;
      
      case 6: obstacle.addImage("obstacle6", obstacle6); 
      break;
      
      
      default: break;
    }
    
    obstacle.scale = 0.5;
    obstacle.lifetime = 150;
    
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() 
{
  if (frameCount % 140 === 0) 
  {
    var cloud = createSprite(600,displayHeight/3 - 60,40,10);
    cloud.y = Math.round(random(displayHeight/3 - 100,displayHeight/3 - 50));
    cloud.addImage("cloud",cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 450;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
  
}

function reset()
{
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trexRunning);
  
  score = 0;
}
