import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({
  color: 0x6c63ff,
  metalness: 0.3,
  roughness: 0.4,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add a torus knot
const torusGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
const torusMaterial = new THREE.MeshStandardMaterial({
  color: 0xff6b6b,
  metalness: 0.5,
  roughness: 0.3,
});
const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
torusKnot.position.x = 3;
scene.add(torusKnot);

// Add a sphere
const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x4ecdc4,
  metalness: 0.2,
  roughness: 0.5,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = -3;
scene.add(sphere);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xff6b6b, 0.5);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Rotate the torus knot
  torusKnot.rotation.x += 0.02;
  torusKnot.rotation.y += 0.01;

  // Rotate the sphere
  sphere.rotation.y += 0.015;

  // Float animation
  const time = Date.now() * 0.001;
  cube.position.y = Math.sin(time) * 0.3;
  torusKnot.position.y = Math.sin(time + 1) * 0.3;
  sphere.position.y = Math.sin(time + 2) * 0.3;

  renderer.render(scene, camera);
}

animate();
