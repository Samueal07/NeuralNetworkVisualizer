class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    // making this because we are getting speed>3 when going diagonally
    this.angle = 0;
    // making an instance of class Sensor
    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  update(roadBoarders) {
    this.#move();
    this.sensor.update(roadBoarders);
  }

  #move() {
    if (this.controls.forward) {
      // on windows y value increases downwards
      //   this.y -= 2;
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      //   this.y += 2;
      this.speed -= this.acceleration;
    }
    // capping the maximum speed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    //for reverse speed
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
    // checking if speed is greater than 0
    // adding basic friction mechanics
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        //   this.x -= 2;
        //   this.angle -= 0.03;
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        //   this.x += 2;
        //   this.angle += 0.03;
        this.angle -= 0.03 * flip;
      }
    }
    // when we tilt our car and then press down or top we want car to go in that direction
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.restore();
    this.sensor.draw(ctx);
  }
}
