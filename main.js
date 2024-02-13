const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
// getting a 2d context for making car
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
// Car Class and draw method in Car.js
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];

// loading car from local Storage
if (localStorage.getItem("bestBrain")) {
  // parsing the JSON string we stored previously
  // looping thrihg all cars
  for (let i = 0; i < cars.length; i++) {
    // for each cars its brain will become to that of best brain
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    // for all other ones other that bestbrain mutate the brain's neural network
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.4);
    }
  }
}
// to check if the car comes in middle of lane
// const car = new Car(road.getLaneCenter(2), 100, 30, 50);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
];
// car.draw(carCtx);
animate();

// function to save the successful attempt on to local storage
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}
function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}
function animate(time) {
  // calling it again and again so that it rerenders its position
  // prop dirlling till sensor.js main->car->sensor->castRays
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  //updating all the N cars made by generate Cars
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  // finding the best car to follow
  // y inc downwards so one with min is aage
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  // camera view for a moving car
  carCtx.save();
  // ctx.translate(0, -car.y);
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  //drawing N-1 cars semiTransparent
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);
  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  // Visualizer.drawNetwork(networkCtx, cars[0].brain);
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
