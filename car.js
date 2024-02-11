class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    // making this because we are getting speed>3 when going diagonally
    this.angle = 0;
    this.useBrain = controlType === "AI";

    if (controlType != "DUMMY") {
      // making an instance of class Sensor
      this.sensor = new Sensor(this);
      // first layer has neuron=no of sensor
      // 1 hidden layer with 6 neuron
      // 1 output layer with 4 nwuron left,right,top,down
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
    this.controls = new Controls(controlType);

    this.damaged = false;
  }

  update(roadBoarders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBoarders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBoarders, traffic);
      const offsets = this.sensor.readings.map(
        // if their isnt anything in way of sensor keep value as zero
        // else deduct the offset value from 1
        (s) => (s == null ? 0 : 1 - s.offsets)
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      console.log(outputs);
      // in console car.brain gives full info

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      // taking two poygon i.e car and the border lines of road(line segement)
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      // taking two poygon i.e car and the border lines of road(line segement)
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    //top right point of car
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    // top left point of car
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    //bottom left point of Car
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    //bottom right point of car
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
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

  draw(ctx, color) {
    // ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(-this.angle);

    // ctx.beginPath();
    // ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    // ctx.fill();

    // ctx.restore();

    // updated code to draw the car with drowing actual polygon to detect
    // collision as well

    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    if (this.polygon && this.polygon.length > 0) {
      ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
      for (let i = 1; i < this.polygon.length; i++) {
        ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
      }
      ctx.fill();
    }
    // only car controlled by us woudl have senosr
    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }
}
