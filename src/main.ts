// Import everything from Three.js and make it available through THREE
import * as THREE from 'three';

// ====================
// VARIABLES
// ====================
let sunSwing = 0; // variable to track the swing of the sun
let sunSwingVelocity = 0;
const scene = new THREE.Scene();

//raycaster to sense mouse movement
const raycaster = new THREE.Raycaster();

//Store the mouse position
const mouse = new THREE.Vector2();

// ====================
// BACKGROUND
// ====================

//create the geomety for our background
//(with, height),  plane geometry is a flat surface that 
//can be used to create backgrounds or other flat objects in 3D space.

const backgroundGeometry = new THREE.PlaneGeometry(20, 12); 

//give the background a color
// anything with "material" is giving the object a color or texture, 
//and "basic" means it won't be affected by lights in the scene.

const backgroundMaterial = new THREE.MeshStandardMaterial({

  color: 0x87CEEB, // light blue color

})

//compainthe geometry and material to create a mesh,
//which is the actual object that will be rendered in the scene.

const background = new THREE.Mesh(
  backgroundGeometry,
  backgroundMaterial
)

background.receiveShadow = true; //allow the background to receive shadows from other objects

// ====================
// CARDBOARD HILL
// ====================

// Create the shape of the hill
const hillShape = new THREE.Shape();

hillShape.moveTo(-10, 0);       // bottom left
hillShape.lineTo(-10, 1);       // left side
hillShape.quadraticCurveTo(
  0, 5,                           // control point
  9, 2                            // end point
);
hillShape.lineTo(10, 0);        // bottom right
hillShape.lineTo(-10, 0);       // close the shape

// Turn the hill shape into 3D geometry
// Give the hill cardboard-like depth
const hillGeometry = new THREE.ExtrudeGeometry(
  hillShape,
  {
    depth: 0.1,      // thickness of the cardboard
    bevelEnabled: false
  }
);

// Give the hill a green cardboard color
const hillMaterial = new THREE.MeshStandardMaterial({
  color: 0x82ab6c
});

// Create the hill mesh
const hill = new THREE.Mesh(
  hillGeometry,
  hillMaterial
);

hill.position.set(0, -4, 0.6);

// ====================
// COTTON CLOUD
// ====================

//making a function so we can generate random cloud puff shapes
function createCloudPuff() {

  const cloudPuffGeometry = new THREE.SphereGeometry(
    0.6, // radius
    16, // width segments
    16 // height segments
  )

  //trying to make the speres irragular so they look more like cotton balls
  // Make the sphere slightly irregular like a cotton ball
  const position = cloudPuffGeometry.attributes.position;

  for (let i = 0; i < position.count; i++) {

    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);

    // Small random amount of bumpiness
    const bump = 1 + (Math.random() - 0.5) * 0.15;

    position.setXYZ(
      i,
      x * bump,
      y * bump,
      z * bump
    );
  }

  position.needsUpdate = true;
  cloudPuffGeometry.computeVertexNormals();

  const cloudPuffMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF, // white color
  })
  
  return new THREE.Mesh(
    cloudPuffGeometry,
    cloudPuffMaterial
  )

};

//group the puffs together to make a cloud
const cloud = createCloudPuff();

// Create more cotton-ball puffs
const puff2 = createCloudPuff();
const puff3 = createCloudPuff();
const puff4 = createCloudPuff();
const puff5 = createCloudPuff();

//(x, y, z) position of the cloud in the scene
cloud.position.set(1, 1.5, 0.5); 
puff2.position.set(-1, .5, 0);
puff3.position.set(0.7, .5, 0);
puff4.position.set(-0.35, 0.45, 0);


cloud.add(
  puff2,
  puff3,
  puff4,
  puff5
);


// ====================
// RAINING SPARKLES
// ====================

const sparkleGeometry = new THREE.OctahedronGeometry(
  0.08
);

const sparkleMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  emissive: 0xFFFFFF,
  emissiveIntensity: 0.1
});

const sparkles: {
  mesh: THREE.Mesh;
  drift: number;
}[] = [];

for (let i = 0; i < 15; i++) {

  const sparkle = new THREE.Mesh(
    sparkleGeometry,
    sparkleMaterial
  );

  sparkle.position.set(
    1 + (Math.random() - 0.5) * 2,
    1.5 + (Math.random() - 0.5) * 1,
    .09
  );

  scene.add(sparkle);

  sparkles.push({
    mesh: sparkle,
    drift: Math.random() * Math.PI * 2
  });

}

// ====================
// SUN
// ====================

//Create the geometry for the sun using Cylinder for cardboard depth
const sunGeometry = new THREE.CylinderGeometry(
  1, // radius top
  1, // radius bottom
  0.08, // height(or thickness) of the cylinder
  20 // segments (determines how smooth the cylinder will be, more segments = smoother)
); 


//using mesh Standasrd se we get a shadown on the background
const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFD700, // gold color
})

//create the sun mesh
const sun = new THREE.Mesh(
  sunGeometry,
  sunMaterial
)

//allow the sun to cast shadows onto other objects in the scene
sun.castShadow = true;

sun.rotation.x = Math.PI / 2;

//creating a sun and string group so we can pivot from one spot
const sunPivot = new THREE.Group();

//Position the pivot where the string is attached
sunPivot.position.set(-3, 4.15, 0.35); //(x, y, z) position of the pivot in the scene

//sun position in the scene
//-4 is the x witch moves left and right 
//2 is the y witch moves up and down
// 0.1 is the z witch controls depth
sun.position.set(0, -3, 0.05); 

// ====================
// SUN STRING
// ====================

//create a string for the sun 

const stringGeometry = new THREE.CylinderGeometry(
  0.02, // top radius
  0.02, // bottom radius
  2,    // length of the string
  8     // segments
)

//give th string a color
const stringMaterial = new THREE.MeshStandardMaterial({
  color: 0x8c876d, // dark gray color
});

const sunString = new THREE.Mesh(
  stringGeometry,
  stringMaterial
);  

sunString.position.set(0, -1, 0); //(x, y, z) position of the string in the scene

// ====================
// LIGHT
// ====================

//create a light source to illuminate the scene
const light = new THREE.DirectionalLight(
  0xFFFFFF, // white light
  3, // intensity
)

//add soft ambient light to the scene to make the shadows less harsh
const ambientLight = new THREE.AmbientLight(
  0xFFFFFF, // white light
  0.5, // intensity
)

light.position.set(0, 2, 5); // position the light in front of the sun for now (x, y, z)

//allow light to cast shadows onto other objects in the scene
light.castShadow = true;

// Improve the quality of the shadow
light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;

// Soften the shadow edges
light.shadow.radius = 10;

// ====================
// SCENE
// ====================

//creating a scene which is 
//the stage where all the objects will be placed and rendered.



//add to sunPivot
sunPivot.add(sun);
sunPivot.add(sunString);

//add to the scene
scene.add(background);
scene.add(sunPivot);
scene.add(cloud);
scene.add(hill);
scene.add(light);
scene.add(ambientLight);


//create a camera to view the scene
const camera = new THREE.PerspectiveCamera(
  50, // field of view
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near clipping plane
  1000 // far clipping plane
)

// Move the camera in front of the background
// camera.position.z = 5;
camera.position.set(0, 2, 8);

camera.lookAt(0, 0, 0);

//renderer is what will actually draw the scene onto the screen
//create a renderer and set its size to fill the window

const renderer = new THREE.WebGLRenderer({
  antialias: true, // smooth edges
  alpha: true, // allow transparency
});

// enable shadows
renderer.shadowMap.enabled = true; 

//set the size of the renderer to fill the window
renderer.setSize(
  window.innerWidth, 
  window.innerHeight
);

//add the renderer's canvas element to the website
document.body.appendChild(renderer.domElement);

//make the Three.js canvas fill the entire browser window
document.body.style.margin = '0';//no margin
document.body.style.overflow = 'hidden';//no scrollbars


window.addEventListener('click', (event) => {

  // Convert the mouse position to Three.js coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Shoot a ray from the camera through the mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check what the ray hit
  const intersects = raycaster.intersectObject(sun);

  if (intersects.length > 0) {

    // Give the sun a little tap
    sunSwingVelocity = 0.01;

  }

});

//draw the scene from the perspective of the camera
// renderer.render(scene, camera);

//changing the render to animate the scene
function animation() {

  requestAnimationFrame(animation);

  // Move each sparkle independently
  sparkles.forEach((sparkle) => {

    // Fall downward
    sparkle.mesh.position.y -= 0.01;

    // Gently drift side to side
    sparkle.mesh.position.x +=
      Math.sin(Date.now() * 0.002 + sparkle.drift) * 0.003;

    // Shift between pink and purple
    const hue =
      0.75 +
      Math.sin(Date.now() * 0.001 + sparkle.drift) * 0.091;

    sparkle.mesh.material.color.setHSL(
      hue,
      0.8,
      0.7
    );

    // Reset the sparkle when it falls off the scene
    if (sparkle.mesh.position.y < -4) {
      sparkle.mesh.position.y = 1.5;
    }

  });


  // Tiny natural movement for the sun
  const time = Date.now() * 0.009;

  const idleSwing = Math.sin(time) * 0.01;


  // Apply the swing velocity
  sunSwing += sunSwingVelocity;

  // Slowly reduce the velocity
  sunSwingVelocity *= 0.98;

  // Spring back toward center
  sunSwingVelocity -= sunSwing * 0.01;

  // Combine idle movement and tap movement
  sunPivot.rotation.z = idleSwing + sunSwing;


  // Draw the scene
  renderer.render(scene, camera);

}

animation();



animation();