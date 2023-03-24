var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restimg = loadImage("restart.png")
  over = loadImage("gameOver.png")

  point=loadSound("checkpoint.mp3")
  die=loadSound("die.mp3")
  jump=loadSound("jump.mp3")
}

function setup() {
  createCanvas(windowWidth, 200);

  overimg = createSprite(windowWidth/2,70)
  overimg.addImage(over)
  overimg.scale=0.5
  reset= createSprite(windowWidth/2,100);
  reset.addImage(restimg)
  reset.scale=0.4
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,50)
 

  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  ground.scale= 1.05

  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background(255);
  text("Score: "+ score, windowWidth-300,50);
 
  

  if(gameState === PLAY){
    if(score>0 && score%2000===0){
      point.play()
    }

    overimg.visible=false
    reset.visible=false
     score = score + Math.round(frameCount/300);
     if(keyDown("space")&& trex.y >= 150) {
      trex.velocityY = -13;
    jump.play()
  
    }
    
    trex.velocityY = trex.velocityY + 0.8
     spawnClouds();
     //gere obstáculos no solo
     spawnObstacles();
    //mover o solo
    ground.velocityX = -(6+1*score/120);
    if (obstaclesGroup.isTouching(trex)){
     gameState=END 
    die.play();
  
    }
  }
  else if(gameState === END){
    overimg.visible=true
    reset.visible=true
trex.changeAnimation("collided" , trex_collided)
obstaclesGroup.setVelocityXEach(0)
trex.velocityY=0

if(mousePressedOver(reset)){
gameState=PLAY
obstaclesGroup.destroyEach()
cloudsGroup.destroyEach()
trex.changeAnimation("running",trex_running)
score=0
}
    //parar o solo
    ground.velocityX = 0;
  cloudsGroup.setVelocityXEach(0)
  obstaclesGroup.setLifetimeEach(-1)
  cloudsGroup.setLifetimeEach(-1)
  }
  
  
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  trex.collide(invisibleGround);
  
  //gere as nuvens
  
 
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth,165,10,40);
   obstacle.velocityX = -(6+1*score/120);

   
    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = windowWidth;
   
   //adicione cada obstáculo ao grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(windowWidth,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir vida útil à variável
    cloud.lifetime = windowWidth;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
  }
  
}
