class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    //dist from the Boarders of Road
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }
  // checking if boarders and sensor LOS intersect
  #getReading(ray, roadBorders, traffic) {
    let touches = [];
    // going through all borders 2 in this case
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        // start 2 are ray segment
        // last 2 are border segment
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      if (touch) {
        touches.push(touch);
      }
    }
    // this is if the sensor detects the car
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );
        if (value) {
          touches.push(value);
        }
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      // getting it from return statement of getIntersection
      const offsets = touches.map((e) => e.offset);
      // we want the border/obstruction thats the closest to car
      const minOffset = Math.min(...offsets);
      //return touch of min offset
      return touches.find((e) => e.offset == minOffset);
    }
  }

  #castRays() {
    this.rays = [];
    // populating rays
    for (let i = 0; i < this.rayCount; i++) {
      // Calculate ray angle using linear interpolation
      const rayAngle =
        lerp(
          this.raySpread / 2, // Starting angle of the spread
          -this.raySpread / 2, // Ending angle of the spread
          // edge case where ray count 1 it doesnt show as i/0 condition arises
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1) // Interpolation parameter to distribute rays evenly
        ) + this.car.angle;

      // Define starting and ending points for each ray
      const start = { x: this.car.x, y: this.car.y }; // Current position of the car
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength, // Calculate x component based on angle
        y: this.car.y - Math.cos(rayAngle) * this.rayLength, // Calculate y component based on angle
      };

      // Pushiing the ray (represented as a line segment) to the rays array
      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    // Drawing the rays
    for (let i = 0; i < this.rayCount; i++) {
      // Check if this.rays[i] is defined before attempting to access its properties
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // seeing where it Collides
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      // ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
