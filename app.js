const canvas = document.getElementById('canvas1');  
const ctx = canvas.getContext('2d');    
canvas.width = window.innerWidth;;  
canvas.height = window.innerHeight; 

console.log(ctx);
ctx.fillStyle = 'red';
ctx.strokeStyle = 'red';
ctx.lineWidth = 1;
// ctx.lineCap = 'round';
// ctx.arc(300, 200, 100, 0, Math.PI *2)
// ctx.arc(300, 200, 400, 0, Math.PI *2)

// ctx.fill()

// ctx.beginPath()
// ctx.moveTo(100, 200)
// ctx.lineTo(400, 500)
// ctx.stroke()

class Particle{
    constructor(effect){
        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.speedX;
        this.speedY;
        this.speedModifier = Math.floor(Math.random() * 5 + 1)
        this.history = [{x: this.x, y: this.y}]
        this.maxLength =Math.floor(Math.random() * 300 + 50);
        this.angle = 5
    }
    draw(context){
        // context.fillRect(this.x, this.y, 10, 10);
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length; i++){
            context.lineTo(this.history[i].x, this.history[i].y);
        }

        context.stroke()
    }
    update(context){
        let x = Math.floor( this.x / this.effect.cellSize)
        let y = Math.floor( this.y / this.effect.cellSize)
        let index = y * this.effect.cols + x;
        this.angle += this.effect.flowField[index]

            this.speedX = Math.cos(this.angle);
            this.speedY = Math.sin(this.angle);
        this.x += this.speedX * this.speedModifier;
        this.y += this.speedY * this.speedModifier;


        // this.x += this.speedX + Math.sin(this.angle) * 10;
        // this.y += this.speedY + Math.cos(this.angle) * 7;
        this.history .push({x:this.x, y:this.y});
        if(this.history.length > this.maxLength){
            this.history.shift()
        }
    }

}

class Effect{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.particles = [];
        this.numberOfParticles =300;
        this.cellSize = 20;
        this.rows;
        this.cols;
        this.flowField = [];
        this.curve = 0.8;
        this.zoom = 0.2;
        this.init()

    }
    init(){
        this.rows = Math.floor(this.height / this.cellSize)
        this.cols = Math.floor(this.width / this.cellSize)
        this.flowField = [];
        for(let y=0; y<this.rows; y++){
            for(let x = 0; x < this.cols; x++){ 
                let angle = Math.cos(x * this.zoom) + Math.sin(y * this.zoom) * this.curve;
                this.flowField.push(angle)
            }
        }
        for(let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this));

        }
    }
    render(context){
        this.particles.forEach(particle =>{
            particle.draw(context);
            particle.update()
        })
    }
}

const effect = new Effect(canvas.width, canvas.height)
// effect.init();
console.log(effect);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.render(ctx);
    requestAnimationFrame(animate) 
}
animate()
