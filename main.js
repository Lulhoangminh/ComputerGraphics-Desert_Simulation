import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Thiết lập Scene
let scene = new THREE.Scene();

// Thiết lập Camera
let camera = new THREE.PerspectiveCamera( 
    75, 
    window.innerWidth / window.innerHeight, 
    0.01, 
    1000
);
// Tọa độ Cam
camera.position.z = 10;
camera.position.y = 0.5;
camera.position.x = 0.5;
camera.lookAt(scene.position);

// Thiết lập Render
let renderer = new THREE.WebGLRenderer(
    {
        antialias: true
    }
);
renderer.setPixelRatio(window.devicePixelRatio);// bề mặt pyramid nét hơn
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xAAAAAA, 1.0);
renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Adjust shadow map type
renderer.outputColorSpace = THREE.SRGBColorSpace; // Adjust color space
document.body.appendChild( renderer.domElement );

// Trục tọa độ
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

//Nền
// var background = new THREE.TextureLoader().load( "./assets/background.png" );
// scene.background = background

// Mặt đất
var groundSurface = new THREE.TextureLoader().load( "./assets/sand.jpg" );
var planeGeometry = new THREE.PlaneGeometry(30, 30, 1, 1);
var planeMaterial = new THREE.MeshLambertMaterial({
    map: groundSurface
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

plane.rotation.x = (-0.5 * Math.PI);
plane.position.y = 0; // Set the ground at y level 0
scene.add(plane);

// Kim tự tháp
const texture = new THREE.TextureLoader().load( "./assets/pyramid.jpg" );// vân của kim tự tháp
const geometry = new THREE.ConeGeometry( 1.3, 2, 4 ); // bề rộng của đáy, độ cao, số mặt bên
const material = new THREE.MeshBasicMaterial( {map: texture} ); //dán hình lên bề mặt
const cone = new THREE.Mesh( geometry, material );
cone.material.metalness = 0;
cone.castShadow = true;
cone.position.set(-1, 1, 2);
scene.add( cone );

const geometry2 = new THREE.ConeGeometry( 2.3, 2.5, 4 );
const material2 = new THREE.MeshBasicMaterial( {map: texture} );
const cone2 = new THREE.Mesh( geometry2, material2 );
cone2.material.metalness = 0;
cone2.castShadow = true;
cone2.position.set(0, 1.25, -2);
scene.add( cone2 );

const geometry3 = new THREE.ConeGeometry( 1.3, 2, 4 );
const material3 = new THREE.MeshBasicMaterial( {map: texture} );
const cone3 = new THREE.Mesh( geometry3, material3 );
cone3.material.metalness = 0;
cone3.castShadow = true;
cone3.position.set(2, 1, -6);
scene.add( cone3 );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

//Rọi đèn để thấy màu của mặt đất
var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
// hemiLight.position.set( 0, 300, 0 );
// scene.add( hemiLight );

// var dirLight = new THREE.DirectionalLight( 0xffffff );
// dirLight.position.set( 75, 300, -75 );
// scene.add( dirLight );

//Sương mù
// scene.fog = new THREE.Fog( 0xefd1b5, 1, 25 );

// Day and night cycle
const clock = new THREE.Clock();
const dayDuration = 60; // 1 minute cycle

// Sun
const sunTexture = new THREE.TextureLoader().load('./assets/sun.jpg');
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32); // Adjusted sun size
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 15, 0); // Adjusted sun position
scene.add(sun);

// Sunlight
const sunlight = new THREE.PointLight(0xf0d084,1000); // Intensity can be adjusted
sunlight.position.copy(sun.position); // Set light position to sun's position
sunlight.castShadow = true;
scene.add(sunlight);

// Moon
const moonTexture = new THREE.TextureLoader().load('./assets/moon.jpg');
const moonGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(0, 15, 0);
scene.add(moon);

// Moonlight
const moonlight = new THREE.PointLight(0x6779B9, 200); // Adjust intensity as needed
moonlight.position.copy(moon.position); // Set light position to sun's position
moonlight.castShadow = true;
scene.add(moonlight);

// Stars
const starsTexture = new THREE.TextureLoader().load('./assets/stars.jpg');
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    map: starsTexture,
    size: 1.3, // Adjusted point size for glow effect
    opacity: 0.8,
    transparent: true,
    blending: THREE.AdditiveBlending, // Use AdditiveBlending for a glowing effect
    depthTest: false // Disable depth testing to make sure the stars always appear on top
  });

const starsVertices = [];
starsVertices.push(cone.position.x, cone.position.y + 5, cone.position.z);
starsVertices.push(cone2.position.x, cone2.position.y + 6, cone2.position.z);
starsVertices.push(cone3.position.x, cone3.position.y + 7, cone3.position.z);

const starsOpacity = [30, 40 ,50];
// for (let i = 0; i < 3; i++) {
//     const opacity = Math.random(); // Initial opacity
//     starsOpacity.push(opacity);
//   }

// starsMaterial.opacity = new THREE.BufferAttribute(new Float32Array(starsOpacity), 1);



starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);



function animate() { 
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime() % dayDuration;

  // Update controls in each animation frame
  controls.update();

  // Day and night cycle
  const ambientIntensity = 0.2 + Math.abs(Math.sin((elapsedTime / dayDuration) * Math.PI * 2)) * 0.8;
  ambientLight.intensity = ambientIntensity;

  // Update moon and sun positions based on the day and night cycle
  const angle = (elapsedTime / dayDuration) * Math.PI * 5;
  const distance_sun = 20;
  const distance_moon = 20;
  moon.position.set(0, Math.cos(angle) * distance_moon, Math.sin(angle) * distance_moon);
  sun.position.set(0, Math.cos(angle + Math.PI) * distance_sun, Math.sin(angle + Math.PI) * distance_sun);

  // Update sunlight position
  sunlight.position.copy(sun.position);
  moonlight.position.copy(moon.position);
//   sunlightNight.position.copy(moon.position);

  // Determine the active light source (sunlight or moonlight)
  const activeLight = (sun.position.y > moon.position.y) ? sunlight : moonlight;

  // Set ambient light color to match the active light source color
  ambientLight.color.copy(activeLight.color);
  cone.material.color.copy(activeLight.color);
  cone2.material.color.copy(activeLight.color);
  cone3.material.color.copy(activeLight.color);  

  stars.visible = (sun.position.y < 0); // Hide stars during the day

//   for (let i = 0; i < stars.geometry.attributes.opacity.count; i++) {
//     stars.geometry.attributes.opacity.array[i] = Math.abs(Math.sin(elapsedTime * 5 + i * 0.1)) * 0.5 + 0.5;
//   }
//   stars.geometry.attributes.opacity.needsUpdate = true;


  renderer.render( scene, camera );
}

animate();

