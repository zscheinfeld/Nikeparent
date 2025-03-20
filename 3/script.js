let particle1, particle2, particle3;
let activeParticles = []; // Array to hold active particles

// Speed multiplier (default to 1x)
let speedMultiplier = 1;

// Clear button highlights
function clearButtonHighlights(container) {
  let buttons = document.querySelectorAll(`.${container} button`);
  buttons.forEach((btn) => {
    btn.classList.remove('active', 'runner1-active', 'runner2-active', 'runner3-active');
  });
}

// Toggle visibility of a particle
function toggleParticle(particle) {
  let index = activeParticles.indexOf(particle);
  if (index === -1) {
    activeParticles.push(particle); // Add particle if not in activeParticles
  } else {
    activeParticles.splice(index, 1); // Remove particle if already active
  }
}

// Handle runner selection and restart all runners
// Handle runner selection and restart all runners
// Handle runner selection and restart all runners
function switchRunner(runner) {
    resetAllParticles(); // Always reset particles before changing selection
  
    // Clear previous highlights
    clearButtonHighlights('runner-buttons');
  
    if (runner === "runner1") {
      toggleParticle(particle1);
      highlightButton(runner, 'runner1-active');
    } else if (runner === "runner2") {
      toggleParticle(particle2);
      highlightButton(runner, 'runner2-active');
    } else if (runner === "runner3") {
      toggleParticle(particle3);
      highlightButton(runner, 'runner3-active');
    }
  
    // After updating runners, restart all particles
    restartAllParticles();
  }
  
// Updated highlightButton to toggle button correctly
function highlightButton(runner, activeClass) {
    let button = document.querySelector(`button[onclick="switchRunner('${runner}')"]`);
    if (button) {
      if (button.classList.contains(activeClass)) {
        button.classList.remove(activeClass); // Turn off if already active
      } else {
        button.classList.add(activeClass); // Turn on if not active
      }
    }
  }
  
  
  // Reset all particles to restart their lap
  function resetAllParticles() {
    let particles = [particle1, particle2, particle3];
    for (let particle of particles) {
      particle.t = 0; // Reset particle position
      particle.tail = []; // Clear previous trail
      particle.isWaiting = false;
      particle.waitStartTime = 0;
    }
  }
  
  // Restart active particles
  function restartAllParticles() {
    for (let particle of activeParticles) {
      particle.t = 0; // Restart particle position
      particle.tail = []; // Clear previous trail
    }
  }
  
  
  // Toggle button highlight
  function toggleButtonHighlight(button, activeClass) {
    if (button.classList.contains(activeClass)) {
      button.classList.remove(activeClass); // Turn off color
    } else {
      button.classList.add(activeClass); // Turn on color
    }
  }
  

// Reset all particles to restart their lap
function resetAllParticles() {
  let particles = [particle1, particle2, particle3];
  for (let particle of particles) {
    particle.t = 0; // Reset particle position
    particle.tail = []; // Clear previous tail
    particle.isWaiting = false;
    particle.waitStartTime = 0;
  }
}

// Speed change handler
// Speed change handler
function switchSpeed(multiplier) {
    // Remove active class from all speed buttons
    let speedButtons = document.querySelectorAll(".outer-button-container:nth-child(4) .buttons-container button");
    speedButtons.forEach((btn) => btn.classList.remove("active"));
  
    // Set the new speed
    speedMultiplier = multiplier;
  
    // Add active class to the selected speed button
    let activeButton = document.querySelector(`button[onclick="switchSpeed(${multiplier})"]`);
    activeButton.classList.add("active");
  }
  

let cam;
let targetView = { x: 0, y: 0, z: 600 }; // Initial camera target
let targetZoom = 600; // Initial zoom level

// Switch between different views
// Switch between different views
function switchView(view) {
    // Remove active class from all view buttons
    let viewButtons = document.querySelectorAll(".outer-button-container:nth-child(2) .buttons-container button");
    viewButtons.forEach((btn) => btn.classList.remove("active"));
  
    // Set the target view and zoom
    if (view === "top") {
      targetView = { x: 0, y: 0, z: 600 }; // Top view
      targetZoom = 800;
    } else if (view === "side") {
      targetView = { x: 0, y: 800, z: 0 }; // Side view
      targetZoom = 0;
    } else if (view === "perspective") {
      targetView = { x: 0, y: 700, z: 500 }; // Perspective view
      targetZoom = 500;
    }
  
    // Add active class to the clicked button
    let activeButton = document.querySelector(`button[onclick="switchView('${view}')"]`);
    activeButton.classList.add("active");
  }

  // Find the furthest runner based on the highest t value
function getFurthestParticle() {
  let furthest = null;
  let maxT = -1;

  for (let particle of activeParticles) {
    if (particle.t > maxT) {
      maxT = particle.t;
      furthest = particle;
    }
  }
  return furthest;
}

  

// Particle class definition
class Particle {
  constructor(config) {
    this.mileTime = config.mileTime || 240; // Time to complete a mile in seconds
    this.speed = (TWO_PI * 4) / (this.mileTime * 60); // Speed adjusted for 4 laps
    this.easing = config.easing || 0.05;
    this.color = config.color || [255, 255, 255];
    this.tailLength = config.tailLength || 50;
    this.thickness = config.thickness || 4; // Thickness of the tail
    this.restartDelay = config.restartDelay || 0;
    this.t = 0;
    this.tail = [];
    this.isWaiting = false;
    this.waitStartTime = 0;
  }

  // Update particle position
  update(turns, radius) {
    if (this.t >= turns) {
      if (!this.isWaiting) {
        this.isWaiting = true;
        this.waitStartTime = millis();
        this.tail = [];
      }

      if (millis() - this.waitStartTime >= this.restartDelay) {
        this.t = 0;
        this.isWaiting = false;
      }
      return;
    }

    // Apply speed multiplier for fast-forwarding
    this.t += this.speed * speedMultiplier;

    let easedT = this.t;
    let x = radius * cos(easedT);
    let y = radius * sin(easedT);
    let z = map(easedT, 0, turns, -300, 300);

    this.tail.push(createVector(x, y, z));

    while (this.tail.length > this.tailLength) {
      this.tail.shift();
    }
  }

  // Display particle trail and sphere
 // Updated show() method to create ribbon effect
// Updated show() method with zOffset applied
show() {
  blendMode(SCREEN); // Optional: Try different blend modes for vibrant results
  noFill();
  noStroke();

  let zOffset = 5 * activeParticles.indexOf(this);

  for (let i = 1; i < this.tail.length; i++) {
    let posA = this.tail[i - 1];
    let posB = this.tail[i];

    // Calculate direction vector and normalize
    let dir = p5.Vector.sub(posB, posA);
    dir.normalize();

    // Create perpendicular vector to give ribbon thickness
    let perp = createVector(-dir.y, dir.x, dir.z).mult(this.thickness);

    // ✅ Add height offset based on particle index to prevent overlap
    let zOffset = 5 * activeParticles.indexOf(this); // Slight height offset per particle
    let zA = posA.z + zOffset;
    let zB = posB.z + zOffset;

    // Define the four corners of the ribbon quad with z-offset applied
    let p1 = createVector(posA.x + perp.x, posA.y + perp.y, zA);
    let p2 = createVector(posA.x - perp.x, posA.y - perp.y, zA);
    let p3 = createVector(posB.x - perp.x, posB.y - perp.y, zB);
    let p4 = createVector(posB.x + perp.x, posB.y + perp.y, zB);

    fill(this.color); // Solid color for ribbons

    // Draw ribbon quad with gradient and zOffset
    beginShape();
    fill(this.color); // Use solid fill for all vertices
    vertex(p1.x, p1.y, p1.z);
    vertex(p2.x, p2.y, p2.z);
    vertex(p3.x, p3.y, p3.z);
    vertex(p4.x, p4.y, p4.z);
    endShape(CLOSE);
    // Densify trail by interpolating intermediate points
let steps = 3; // Increase steps for denser ribbon
for (let j = 0; j < steps; j++) {
  let interpX = lerp(posA.x, posB.x, j / steps);
  let interpY = lerp(posA.y, posB.y, j / steps);
  let interpZ = lerp(zA, zB, j / steps);
  let interpPos = createVector(interpX, interpY, interpZ);
  vertex(interpPos.x, interpPos.y, interpPos.z);
}
  }

  // Draw the particle sphere at the end of the tail
  if (this.tail.length > 0) {
    let pos = this.tail[this.tail.length - 1];
    push();
    translate(pos.x, pos.y, pos.z + zOffset); // Apply same zOffset to sphere
    fill(this.color);
    noStroke();
    // sphere(5);
    pop();
  }

  blendMode(BLEND); // Restore default blending at the end
}




}

// p5.js setup function
// p5.js setup function
function setup() {
    createCanvas(600, 600, WEBGL);
    pixelDensity(1);
    cam = createCamera();
    perspective(PI / 4, width / height, 0.1, 1000);
  
    // Runner 1 (Red, 240s Mile Time, Medium Thickness)
    particle3 = new Particle({
      mileTime: 240, // 4 minutes per mile
      easing: 0.1,
      color: [255, 0, 100], // Red
      tailLength: 200,
      restartDelay: 2000,
      thickness: 30,
    });
  
    // Runner 2 (Blue, 300s Mile Time)
    particle2 = new Particle({
      mileTime: 277, // 5 minutes per mile
      easing: 0.07,
      color: [0, 100, 255], // Blue
      tailLength: 300,
      restartDelay: 1500,
      thickness: 15,
    });
  
    // Runner 3 (Yellow, 360s Mile Time)
    particle1 = new Particle({
      mileTime: 373, // 6 minutes per mile
      easing: 0.05,
      color: [255, 255, 0], // Yellow
      tailLength: 400,
      restartDelay: 1000,
      thickness: 20,
    });
  
    // Start with runner1 (Elizabeth Atkinson) selected by default
    activeParticles = [particle1];
  
    // ✅ Mark runner1's button as active by default
    let runner1Button = document.querySelector("button[onclick=\"switchRunner('runner1')\"]");
    runner1Button.classList.add('runner1-active');
  }
  

// p5.js draw function
function draw() {
  background(0);
  orbitControl();

  // Smooth camera transition
  let lerpSpeed = 0.05;
  cam.setPosition(
    lerp(cam.eyeX, targetView.x, lerpSpeed),
    lerp(cam.eyeY, targetView.y, lerpSpeed),
    lerp(cam.eyeZ, targetZoom, lerpSpeed)
  );
  cam.lookAt(0, 0, 0);

  drawHelixAndParticles();
}

// Draw the helix and active particles
function drawHelixAndParticles() {
  let coils = 4; // 4 laps make 1 mile
  let radius = 200;
  let pointsPerTurn = 100;
  let turns = coils * TWO_PI;

  stroke(255);
  strokeWeight(2);
  noFill();

  // Draw the helix coil
  beginShape();
  for (let t = 0; t < turns; t += TWO_PI / pointsPerTurn) {
    let x = radius * cos(t);
    let y = radius * sin(t);
    let z = map(t, 0, turns, -300, 300);
    vertex(x, y, z);
  }
  endShape();

  

  // Draw only the selected runner(s)
  for (let particle of activeParticles) {
    particle.update(turns, radius);
    particle.show();
  }
}
