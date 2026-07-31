import * as THREE from 'three';

let jumping = false;
let landing = false;
let velocity = 0;

let targetX = 0;
let targetZ = 0;

const gravity = -0.02;

const droplets: {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
}[] = [];

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Raycasting (click detection)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


// Create character
const character = new THREE.Group();
scene.add(character);

const bodyGeometry = new THREE.CylinderGeometry(
  0.30,  // top radius
  0.45,  // bottom radius
  .75,     // height
  15
);

const bodyMaterial = new THREE.MeshStandardMaterial({
  color: 0xf0a3e5
});

const body = new THREE.Mesh(
  bodyGeometry,
  bodyMaterial
);

body.position.y = 0.5;

character.add(body);

//add a head
const headGeometry = new THREE.SphereGeometry(
  0.30,
  32,
  32
);

const headMaterial = new THREE.MeshStandardMaterial({
  color: 0xf0a3e5
});

const head = new THREE.Mesh(
  headGeometry,
  headMaterial
);

head.position.y = 1.2;

character.add(head);


// Create floor
const floorGeometry = new THREE.PlaneGeometry(10, 10);

const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x87ceeb,
  side: THREE.DoubleSide
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.rotation.x = -Math.PI / 2;

scene.add(floor);

// Floor receives shadows
floor.receiveShadow = true;


// Create renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.shadowMap.enabled = true;

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

document.body.appendChild(renderer.domElement);
renderer.domElement.style.touchAction = "none";

// Camera position
camera.position.z = 5;
camera.position.y = 3;

camera.lookAt(character.position);


// Lighting
const light = new THREE.DirectionalLight(
  0xffffff,
  2
);

light.position.set(3, 5, 2);
light.castShadow = true;

scene.add(light);


// Click interaction
function handleInteraction(event: MouseEvent | TouchEvent) {

  // Get the touch/click location
  let clientX: number;
  let clientY: number;

  if (event instanceof TouchEvent) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  // Convert screen coordinates to Three.js coordinates
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;


  // Shoot ray from camera
  raycaster.setFromCamera(mouse, camera);


  // Check what was clicked
  const intersects = raycaster.intersectObjects(
    scene.children,
    true
  );


  if (intersects.length > 0) {

    const clickedObject = intersects[0].object;


    // Check if we clicked the character
    if (clickedObject.parent === character && !jumping) {

      jumping = true;
      velocity = 0.3;


      // Pick random landing position
      targetX = (Math.random() - 0.5) * 6;
      targetZ = (Math.random() - 0.5) * 6;


      // Squash before jumping
      character.scale.set(
        1.3,
        0.7,
        1.3
      );

    }

  }

}


// Mouse click
window.addEventListener(
  "click",
  handleInteraction
);


// Touch screen tap
window.addEventListener(
  "touchstart",
  handleInteraction
);

//add a splash effect 
function createSplash() {

  for (let i = 0; i < 250; i++) {

    const geometry = new THREE.CapsuleGeometry(
      0.03,
      0.05,
      4,
      8
    );

    const material = new THREE.MeshBasicMaterial({
      color: 0x87ceeb
    });

    const droplet = new THREE.Mesh(
      geometry,
      material
    );

    droplet.scale.y = 1.5;

    droplet.rotation.x = Math.random() * Math.PI;
    droplet.rotation.z = Math.random() * Math.PI;


    droplet.position.set(
      character.position.x,
      0.05,
      character.position.z
    );


    const direction = new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      Math.random() * 0.15 + 0.05,
      (Math.random() - 0.5) * 0.1
    );


    droplets.push({
      mesh: droplet,
      velocity: direction
    });


    scene.add(droplet);

  }

}


// Animation loop
function animation() {

  requestAnimationFrame(animation);


  // Jumping
  if (jumping) {

    character.position.y += velocity;

    character.position.x += (targetX - character.position.x) * 0.05;
    character.position.z += (targetZ - character.position.z) * 0.05;

    velocity += gravity;


    // Stretch while going upward
    if (velocity > 0) {

      character.scale.set(
        0.8,
        1.3,
        0.8
      );

    }


    // Landing
    if (character.position.y <= 0.5) {

      character.position.y = 0.5;

      jumping = false;
      landing = true;

      velocity = 0;


      // Landing squash
      character.scale.set(
        1.3,
        0.7,
        1.3
      );

      createSplash();


      // Reset rotation
      character.rotation.set(0, 0, 0);

    }

  }


  // Recover from landing squash
  if (landing) {

    character.scale.x += (1 - character.scale.x) * 0.1;
    character.scale.y += (1 - character.scale.y) * 0.1;
    character.scale.z += (1 - character.scale.z) * 0.1;


    if (
      Math.abs(character.scale.x - 1) < 0.01 &&
      Math.abs(character.scale.y - 1) < 0.01
    ) {

      character.scale.set(1, 1, 1);

      landing = false;

    }

  }

  //droplets animation
  droplets.forEach((droplet) => {

    droplet.mesh.position.add(
      droplet.velocity
    );
  
    droplet.velocity.y -= 0.01;
  
  });



  renderer.render(scene, camera);

}


animation();