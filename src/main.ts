import p5 from "p5";

const p5Instance = new p5((s) => {
  const PARTICLE_SIZE = 25;
  const RESOLUTION = 25; // was 12
  const MAX_FORCE = 10;
  const MIN_FORCE = 0;
  const EFFECT_DISTANCE = 50;

  let imgUrl = "/blurred-a.jpg";
  let img;
  let particles: Particle[] = [];
  let doubleClicked = false;

  s.preload = () => {
    img = s.loadImage(imgUrl);
  };

  s.setup = () => {
    let cnv = s.createCanvas(s.windowWidth, s.windowHeight);
    cnv.style("display", "block");
    cnv.style("position", "absolute");
    cnv.style("inset", 0);
    cnv.style("margin", "auto");
    cnv.style("z-index", -1);
    spawnParticles();
  };

  s.draw = () => {
    s.background(255);
    //image(static, 0, 0, width, height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
  };

  const spawnParticles = () => {
    particles.push(new Particle(s.width / 2, s.height / 2, [0, 0, 0]));
  };

  class Particle {
    private readonly targetX: number;
    private readonly targetY: number;
    private readonly color: number[];
    private y: number;
    private x: number;
    public velX: number;
    public velY: number;
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.targetX = x;
      this.targetY = y;
      this.velX = 0;
      this.velY = 0;
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

      // if mouse is within EFFECT_DISTANCE, calculate a repulsive force
      if (distanceToMouse < EFFECT_DISTANCE) {
        let repulsionForce = s.map(
          distanceToMouse,
          0,
          EFFECT_DISTANCE,
          MAX_FORCE,
          MIN_FORCE,
        );
        fromMouseToParticle.setMag(repulsionForce);
        totalForce.add(fromMouseToParticle);
      }

      // if particle is not at target + binding to target is enabled (doubleClicked), calculate an attractive force
      if (distanceToMouse > 0 && !doubleClicked) {
        this.velX = 0;
        this.velY = 0;
        let attractionForce = s.map(
          distanceToTarget,
          0,
          EFFECT_DISTANCE,
          MIN_FORCE,
          MAX_FORCE,
        );
        fromParticleToTarget.setMag(attractionForce);
        totalForce.add(fromParticleToTarget);
      }

      // add gravity
      totalForce.add(s.createVector(0, 0.4));

      // diminish velocity
      this.velX *= 0.99;
      this.velY *= 0.99;

      // add the forces to the velocity
      this.velX += totalForce.x;
      this.velY += totalForce.y;

      // add velocity to position
      this.x += this.velX;
      this.y += this.velY;

      // bounce off bottom edge
      if (this.y > s.height - PARTICLE_SIZE / 2) {
        this.y = s.height - PARTICLE_SIZE / 2;
        this.velY *= -1;
      }
      // bounce off top edge
      if (this.y < PARTICLE_SIZE / 2) {
        this.y = PARTICLE_SIZE / 2;
        this.velY *= -1;
      }
      // bounce off right edge
      if (this.x > s.width - PARTICLE_SIZE / 2) {
        this.x = s.width - PARTICLE_SIZE / 2;
        this.velX *= -1;
      }
      // bounce off left edge
      if (this.x < PARTICLE_SIZE / 2) {
        this.x = PARTICLE_SIZE / 2;
        this.velX *= -1;
      }
    }

    draw() {
      s.fill(this.color);
      s.noStroke();
      s.ellipse(this.x, this.y, PARTICLE_SIZE);
    }
  }

  // s.windowResized = () => {
  //   const size = Math.min(s.windowWidth, s.windowHeight) * 0.8;
  //   s.resizeCanvas(size, size)
  //   particles = [];
  //   spawnParticles();
  //   s.draw();
  // }
  setTimeout(() => {
    doubleClicked = true;
  }, 3000);

  s.doubleClicked = () => {
    doubleClicked = !doubleClicked;
  };
});

export default p5Instance;
