// Import everything from Three.js and make it available through THREE
import * as THREE from 'three';

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
// SUN
// ====================

//Create the geometry for the sun using Cylinder for cardboard depth
const sunGeometry = new THREE.CylinderGeometry(
  1, // radius top
  1, // radius bottom
  0.03, // height(or thickness) of the cylinder
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

const scene = new THREE.Scene();

//add to sunPivot
sunPivot.add(sun);
sunPivot.add(sunString);

//add to the scene
scene.add(background);
scene.add(sunPivot);
scene.add(light);
scene.add(ambientLight);

//create a camera to view the scene
const camera = new THREE.PerspectiveCamera(
  75, // field of view
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near clipping plane
  1000 // far clipping plane
)

// Move the camera in front of the background
camera.position.z = 5;

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

//draw the scene from the perspective of the camera
// renderer.render(scene, camera);

//changing the render to animate the scene

function animation() {

  requestAnimationFrame(animation);

  sunPivot.rotation.z = 0.1;

  renderer.render(scene, camera);

}

animation();