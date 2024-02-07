const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;

// getting a 2d context for making car
const ctx = canvas.getContext("2d");
// Car Class and draw method in Car.js
const car = new Car(100, 100, 30, 50);
car.draw(ctx);

animate();
function animate() {
  // calling it again and again so that it rerenders its position
  car.update();

  canvas.height = window.innerHeight;
  car.draw(ctx);

  requestAnimationFrame(animate);
}
