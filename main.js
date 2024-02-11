const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;

// getting a 2d context for making car
const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
// Car Class and draw method in Car.js
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
// to check if the car comes in middle of lane
// const car = new Car(road.getLaneCenter(2), 100, 30, 50);

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)];
car.draw(ctx);

animate();
function animate() {
  // calling it again and again so that it rerenders its position
  // prop dirlling till sensor.js main->car->sensor->castRays
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);

  canvas.height = window.innerHeight;

  // camera view for a moving car
  ctx.save();
  // ctx.translate(0, -car.y);
  ctx.translate(0, -car.y + canvas.height * 0.7);
  road.draw(ctx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx, "red");
  }
  car.draw(ctx, "blue");

  ctx.restore();
  requestAnimationFrame(animate);
}
