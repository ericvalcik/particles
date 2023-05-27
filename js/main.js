import p5 from 'p5';

const p5Instance = new p5(s => {
  const PARTICLE_SIZE = 7;
  const RESOLUTION = 7;
  const MAX_FORCE = 10;
  const MIN_FORCE = 0;
  const EFFECT_DISTANCE = 50;

  let imgUrl = '/red-star-final.png';
  let img;
  let particles = [];

  s.preload = () => {
    img = s.loadImage(imgUrl);
  }

  s.setup = () => {
    const size = Math.min(s.windowWidth, s.windowHeight) * 0.8;
    let cnv = s.createCanvas(size, size);
    cnv.style("display", "block");
    cnv.style("position", "absolute");
    cnv.style("inset", 0);
    cnv.style("margin", "auto");
    cnv.style("z-index", -1);
    s.spawnParticles();
  }

  s.draw = () => {
    s.background(255);
    //image(static, 0, 0, width, height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
  }

  s.spawnParticles = () => {
    for (let i = 0; i < s.width; i += RESOLUTION) {
      for (let j = 0; j < s.height; j += RESOLUTION) {
        let x = (i / s.width) * img.width;
        let y = (j / s.height) * img.height;
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
      let mouseVector = s.createVector(s.mouseX, s.mouseY);
      let currentVector = s.createVector(this.x, this.y);
      let targetVector = s.createVector(this.targetX, this.targetY);

      // calculate vector from mouse to particle and its magnitude (distance)
      let fromMouseToParticle = p5.Vector.sub(currentVector, mouseVector);
      let distanceToMouse = fromMouseToParticle.mag();

      // calculate vector from particle to target and its magnitude
      let fromParticleToTarget = p5.Vector.sub(targetVector, currentVector);
      let distanceToTarget = fromParticleToTarget.mag();

      let totalForce = s.createVector(0, 0);

      // if mouse is within 100 pixels, calculate a repulsive force

      if (distanceToMouse < EFFECT_DISTANCE) {
        let repulsionForce = s.map(distanceToMouse, 0, EFFECT_DISTANCE, MAX_FORCE, MIN_FORCE);
        fromMouseToParticle.setMag(repulsionForce);
        totalForce.add(fromMouseToParticle);
      }

      // if particle is not at tartget, calculate an attractive force
      if (distanceToMouse > 0) {
        let attractionForce = s.map(distanceToTarget, 0, EFFECT_DISTANCE, MIN_FORCE, MAX_FORCE);
        fromParticleToTarget.setMag(attractionForce);
        totalForce.add(fromParticleToTarget);
      }

      // add the forces to the position
      this.x += totalForce.x;
      this.y += totalForce.y;
    }

    draw() {
      s.fill(this.color);
      s.noStroke();
      s.ellipse(this.x, this.y, PARTICLE_SIZE);
    }
  }

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight)
    particles = [];
    s.spawnParticles();
    s.draw();
  }
});

export default p5Instance;