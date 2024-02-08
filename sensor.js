class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 30;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;
    this.rays = [];
  }
  update() {
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
      if (this.rays[i]) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "yellow";
        ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
        ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
        ctx.stroke();
      }
    }
  }
}
