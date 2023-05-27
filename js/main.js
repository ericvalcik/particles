const PARTICLE_SIZE = 7;
const RESOLUTION = 7;
const MAX_FORCE = 10;
const MIN_FORCE = 0;
const EFFECT_DISTANCE = 50;

let imgUrl = '/../img/red-star-final.png';
let img;
let particles = [];

function preload() {
  img = loadImage(imgUrl);
}

function setup() {
  const size = Math.min(windowWidth, windowHeight) * 0.8;
  let cnv = createCanvas(size, size);
  cnv.style("display", "block");
  cnv.style("position", "absolute");
  cnv.style("inset", 0);
  cnv.style("margin", "auto");
  cnv.style("z-index", -1);
  spawnParticles();
}

function draw() {
  background(255);
  //image(img, 0, 0, width, height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
}

function spawnParticles() {
  for (let i = 0; i < width; i += RESOLUTION) {
    for (let j = 0; j < height; j += RESOLUTION) {
      let x = (i / width) * img.width;
      let y = (j / height) * img.height;
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
    let mouseVector = createVector(mouseX, mouseY);
    let currentVector = createVector(this.x, this.y);
    let targetVector = createVector(this.targetX, this.targetY);

    // calculate vector from mouse to particle and its magnitude (distance)
    let fromMouseToParticle = p5.Vector.sub(currentVector, mouseVector);
    let distanceToMouse = fromMouseToParticle.mag();

    // calculate vector from particle to target and its magnitude
    let fromParticleToTarget = p5.Vector.sub(targetVector, currentVector);
    let distanceToTarget = fromParticleToTarget.mag();

    let totalForce = createVector(0, 0);

    // if mouse is within 100 pixels, calculate a repulsive force

    if (distanceToMouse < EFFECT_DISTANCE) {
      let respulsionForce = map(distanceToMouse, 0, EFFECT_DISTANCE, MAX_FORCE, MIN_FORCE);
      fromMouseToParticle.setMag(respulsionForce);
      totalForce.add(fromMouseToParticle);
    }

    // if particle is not at tartget, calculate an attractive force
    if (distanceToMouse > 0) {
      let attractionForce = map(distanceToTarget, 0, EFFECT_DISTANCE, MIN_FORCE, MAX_FORCE);
      fromParticleToTarget.setMag(attractionForce);
      totalForce.add(fromParticleToTarget);
    }

    // add the forces to the position
    this.x += totalForce.x;
    this.y += totalForce.y;
  }

  draw() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, PARTICLE_SIZE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  particles = [];
  spawnParticles();
  draw();
}
