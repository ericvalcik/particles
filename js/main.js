import p5 from 'p5';

const PARTICLE_SIZE = 7;
const RESOLUTION = 7;
const MAX_FORCE = 10;
const MIN_FORCE = 0;
const EFFECT_DISTANCE = 50;

let imgUrl = '/red-star-final.png';
let img;
let particles = [];

p5.preload = () => {
  img = p5.loadImage(imgUrl);
}

p5.setup = () => {
  const size = Math.min(p5.windowWidth, p5.windowHeight) * 0.8;
  let cnv = p5.createCanvas(size, size);
  cnv.style("display", "block");
  cnv.style("position", "absolute");
  cnv.style("inset", 0);
  cnv.style("margin", "auto");
  cnv.style("z-index", -1);
  p5.spawnParticles();
}

p5.draw = () => {
  p5.background(255);
  //image(static, 0, 0, width, height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
}

p5.spawnParticles = () => {
  for (let i = 0; i < p5.width; i += RESOLUTION) {
    for (let j = 0; j < p5.height; j += RESOLUTION) {
      let x = (i / p5.width) * img.width;
      let y = (j / p5.height) * img.height;
      const color = img.get(x, y);
      if (color[0] + color[1] + color[2] > 255 * 3 - 50) continue;
      particles.push(
        new Particle(i + PARTICLE_SIZE / 2, j + PARTICLE_SIZE / 2, color)
      );
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.targetX = x;
    this.targetY = y;
  }

  update() {
    // get vectors for mouse, target, and current position
    let mouseVector = p5.createVector(p5.mouseX, p5.mouseY);
    let currentVector = p5.createVector(this.x, this.y);
    let targetVector = p5.createVector(this.targetX, this.targetY);

    // calculate vector from mouse to particle and its magnitude (distance)
    let fromMouseToParticle = p5.Vector.sub(currentVector, mouseVector);
    let distanceToMouse = fromMouseToParticle.mag();

    // calculate vector from particle to target and its magnitude
    let fromParticleToTarget = p5.Vector.sub(targetVector, currentVector);
    let distanceToTarget = fromParticleToTarget.mag();

    let totalForce = p5.createVector(0, 0);

    // if mouse is within 100 pixels, calculate a repulsive force

    if (distanceToMouse < EFFECT_DISTANCE) {
      let repulsionForce = p5.map(distanceToMouse, 0, EFFECT_DISTANCE, MAX_FORCE, MIN_FORCE);
      fromMouseToParticle.setMag(repulsionForce);
      totalForce.add(fromMouseToParticle);
    }

    // if particle is not at tartget, calculate an attractive force
    if (distanceToMouse > 0) {
      let attractionForce = p5.map(distanceToTarget, 0, EFFECT_DISTANCE, MIN_FORCE, MAX_FORCE);
      fromParticleToTarget.setMag(attractionForce);
      totalForce.add(fromParticleToTarget);
    }

    // add the forces to the position
    this.x += totalForce.x;
    this.y += totalForce.y;
  }

  draw() {
    p5.fill(this.color);
    p5.noStroke();
    p5.ellipse(this.x, this.y, PARTICLE_SIZE);
  }
}

p5.windowResized = () => {
  p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
  particles = [];
  p5.spawnParticles();
  p5.draw();
}