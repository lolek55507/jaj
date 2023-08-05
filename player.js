import { Sitting, Running, Jumping, Falling } from './playerStates.js';

export class Player {
    constructor(game){
        this.game = game;
        this.widht = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = this.game.height - this.height - this.game.groundMargin;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimmer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this), new Running(this), new Jumping(this), new Falling(this)];
        this.currentState = this.states[0];
        this.currentState.enter();
    }
    update(input, deltaTime) {
        this.checkCollisions();
        this.currentState.handle(input);
        // horizontal movement
        this.x += this.speed;
       if (input.includes('ArrowRight')) this.speed = this.maxSpeed;
       else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
       else this.speed = 0;
       if (this.x < 0) this.x = 0;
       if (this.x > this.game.widht - this.widht) this.x = this.game.widht - this.widht;

       // vertical movement
      //  if (input.includes('ArrowUp') && this.onGround()) this.vy -= 30;
       this.y += this.vy;
       if (!this.onGround()) this.vy += this.weight;
       else this.vy = 0;
       // sprite animation
       if(this.frameTimmer > this.frameInterval) {
        this.frameTimmer = 0;
        if (this.frameX < this.maxFrame) this.frameX++;
         else this.frameX = 0;
       } else {
        this.frameTimmer += deltaTime;
       }
       
    }
    draw(context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.widht, this.height)
        context.drawImage(this.image, this.frameX * this.widht, this.frameY * this.height, this.widht, this.height, this.x, this.y, this.widht, this.height);
    }
    onGround() {
        return this.y >= this.game.height - this.height;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollisions() {
        this.game.enemies.forEach(enemy => {
            if(enemy.x < this.x + this.widht && 
                enemy.x + enemy.widht > this.x && 
                enemy.y < this.y + this.height && 
                enemy.y + enemy.height > this.y) {
                // collision detected
                enemy.markedForDeletion = true;
                this.game.score++;
            } else {
            // no collision
            }
        });
    }
}