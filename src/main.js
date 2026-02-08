import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// ============ SCENE SETUP ============
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue
scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

// ============ CAMERA SETUP ============
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(15, 2, 15);

// ============ RENDERER SETUP ============
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// ============ CONTROLS ============
const controls = new PointerLockControls(camera, document.body);

const blocker = document.getElementById('blocker');
const info = document.getElementById('info');

blocker.addEventListener('click', () => {
  controls.lock();
});

controls.addEventListener('lock', () => {
  blocker.style.display = 'none';
  info.style.display = 'block';
});

controls.addEventListener('unlock', () => {
  blocker.style.display = 'flex';
});

scene.add(controls.getObject());

// Movement
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let isRunning = false;

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW': moveForward = true; break;
    case 'KeyS': moveBackward = true; break;
    case 'KeyA': moveLeft = true; break;
    case 'KeyD': moveRight = true; break;
    case 'Space':
      if (canJump) velocity.y = 8;
      canJump = false;
      break;
    case 'ShiftLeft': isRunning = true; break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW': moveForward = false; break;
    case 'KeyS': moveBackward = false; break;
    case 'KeyA': moveLeft = false; break;
    case 'KeyD': moveRight = false; break;
    case 'ShiftLeft': isRunning = false; break;
  }
});

// ============ LIGHTING ============
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Sun light
const sunLight = new THREE.DirectionalLight(0xfffacd, 1.2);
sunLight.position.set(50, 100, 50);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 200;
sunLight.shadow.camera.left = -50;
sunLight.shadow.camera.right = 50;
sunLight.shadow.camera.top = 50;
sunLight.shadow.camera.bottom = -50;
scene.add(sunLight);

// Hemisphere light for natural sky lighting
const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x556B2F, 0.6);
scene.add(hemiLight);

// ============ GROUND ============
const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x3d8c40,
  roughness: 0.9,
  metalness: 0.1,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ============ FOUNTAIN ============
function createFountain() {
  const fountain = new THREE.Group();

  // Base pool (large circular basin)
  const poolGeometry = new THREE.CylinderGeometry(6, 7, 1, 32);
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B8B83,
    roughness: 0.8,
    metalness: 0.1,
  });
  const pool = new THREE.Mesh(poolGeometry, stoneMaterial);
  pool.position.y = 0.5;
  pool.castShadow = true;
  pool.receiveShadow = true;
  fountain.add(pool);

  // Water in pool
  const waterGeometry = new THREE.CylinderGeometry(5.5, 5.5, 0.8, 32);
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x40E0D0,
    transparent: true,
    opacity: 0.7,
    roughness: 0.1,
    metalness: 0.3,
  });
  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.position.y = 0.6;
  fountain.add(water);

  // Inner rim
  const rimGeometry = new THREE.TorusGeometry(5.5, 0.3, 8, 32);
  const rim = new THREE.Mesh(rimGeometry, stoneMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 1;
  rim.castShadow = true;
  fountain.add(rim);

  // Central pillar
  const pillarGeometry = new THREE.CylinderGeometry(0.8, 1, 4, 16);
  const pillar = new THREE.Mesh(pillarGeometry, stoneMaterial);
  pillar.position.y = 2.5;
  pillar.castShadow = true;
  fountain.add(pillar);

  // Middle bowl
  const bowlGeometry = new THREE.CylinderGeometry(2, 1.5, 0.8, 16);
  const bowl = new THREE.Mesh(bowlGeometry, stoneMaterial);
  bowl.position.y = 4.5;
  bowl.castShadow = true;
  fountain.add(bowl);

  // Middle bowl water
  const bowlWaterGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.5, 16);
  const bowlWater = new THREE.Mesh(bowlWaterGeometry, waterMaterial);
  bowlWater.position.y = 4.7;
  fountain.add(bowlWater);

  // Top pillar
  const topPillarGeometry = new THREE.CylinderGeometry(0.4, 0.6, 2, 12);
  const topPillar = new THREE.Mesh(topPillarGeometry, stoneMaterial);
  topPillar.position.y = 5.9;
  topPillar.castShadow = true;
  fountain.add(topPillar);

  // Top ornament (sphere)
  const topOrnamentGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const topOrnament = new THREE.Mesh(topOrnamentGeometry, stoneMaterial);
  topOrnament.position.y = 7.2;
  topOrnament.castShadow = true;
  fountain.add(topOrnament);

  // Decorative statues around the base
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const x = Math.cos(angle) * 5;
    const z = Math.sin(angle) * 5;

    const statueBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.2, 0.8),
      stoneMaterial
    );
    statueBase.position.set(x, 1.6, z);
    statueBase.castShadow = true;
    fountain.add(statueBase);

    const statue = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1, 8),
      stoneMaterial
    );
    statue.position.set(x, 2.7, z);
    statue.castShadow = true;
    fountain.add(statue);
  }

  return fountain;
}

const fountain = createFountain();
scene.add(fountain);

// ============ BILL - FRIENDLY OLDER MAN ============
function createBill() {
  const bill = new THREE.Group();

  // Skin tone for older gentleman
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xE8BEAC,
    roughness: 0.8,
    metalness: 0.1,
  });

  // Clothing colors - friendly, approachable outfit
  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A90A4, // Friendly blue cardigan
    roughness: 0.9,
  });

  const pantsMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A4A4A, // Dark gray slacks
    roughness: 0.9,
  });

  const shoeMaterial = new THREE.MeshStandardMaterial({
    color: 0x3D2817, // Brown shoes
    roughness: 0.8,
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0xCCCCCC, // Gray/white hair
    roughness: 0.9,
  });

  // Feet/Shoes
  const leftShoe = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.15, 0.4),
    shoeMaterial
  );
  leftShoe.position.set(-0.15, 0.075, 0.05);
  leftShoe.castShadow = true;
  bill.add(leftShoe);

  const rightShoe = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.15, 0.4),
    shoeMaterial
  );
  rightShoe.position.set(0.15, 0.075, 0.05);
  rightShoe.castShadow = true;
  bill.add(rightShoe);

  // Legs
  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.1, 0.9, 8),
    pantsMaterial
  );
  leftLeg.position.set(-0.15, 0.6, 0);
  leftLeg.castShadow = true;
  bill.add(leftLeg);

  const rightLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.1, 0.9, 8),
    pantsMaterial
  );
  rightLeg.position.set(0.15, 0.6, 0);
  rightLeg.castShadow = true;
  bill.add(rightLeg);

  // Torso/Body - slightly portly, friendly build
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.3, 0.8, 8),
    shirtMaterial
  );
  torso.position.set(0, 1.45, 0);
  torso.castShadow = true;
  bill.add(torso);

  // Belly - gives him a friendly, approachable look
  const belly = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 12, 12),
    shirtMaterial
  );
  belly.position.set(0, 1.3, 0.1);
  belly.scale.set(1, 0.8, 0.8);
  belly.castShadow = true;
  bill.add(belly);

  // Arms
  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.07, 0.6, 8),
    shirtMaterial
  );
  leftArm.position.set(-0.4, 1.5, 0);
  leftArm.rotation.z = 0.3;
  leftArm.castShadow = true;
  bill.add(leftArm);

  const rightArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.07, 0.6, 8),
    shirtMaterial
  );
  rightArm.position.set(0.4, 1.5, 0);
  rightArm.rotation.z = -0.3;
  rightArm.castShadow = true;
  bill.add(rightArm);

  // Hands
  const leftHand = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    skinMaterial
  );
  leftHand.position.set(-0.52, 1.25, 0);
  leftHand.castShadow = true;
  bill.add(leftHand);

  const rightHand = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    skinMaterial
  );
  rightHand.position.set(0.52, 1.25, 0);
  rightHand.castShadow = true;
  bill.add(rightHand);

  // Neck
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.12, 0.15, 8),
    skinMaterial
  );
  neck.position.set(0, 1.92, 0);
  neck.castShadow = true;
  bill.add(neck);

  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 16),
    skinMaterial
  );
  head.position.set(0, 2.25, 0);
  head.scale.set(1, 1.1, 1);
  head.castShadow = true;
  bill.add(head);

  // Gray hair (back and sides - balding on top)
  const hairBack = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 12, 12, 0, Math.PI * 2, 0.3, 1.2),
    hairMaterial
  );
  hairBack.position.set(0, 2.28, -0.05);
  hairBack.rotation.x = 0.2;
  bill.add(hairBack);

  // Side hair tufts
  const leftHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    hairMaterial
  );
  leftHair.position.set(-0.25, 2.3, 0);
  leftHair.scale.set(0.5, 0.8, 0.8);
  bill.add(leftHair);

  const rightHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    hairMaterial
  );
  rightHair.position.set(0.25, 2.3, 0);
  rightHair.scale.set(0.5, 0.8, 0.8);
  bill.add(rightHair);

  // Friendly face features
  // Eyes - warm and kind
  const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.3,
  });
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A6B8A, // Friendly blue eyes
    roughness: 0.3,
  });
  const pupilMaterial = new THREE.MeshStandardMaterial({
    color: 0x1A1A1A,
    roughness: 0.3,
  });

  // Left eye
  const leftEyeWhite = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 8),
    eyeWhiteMaterial
  );
  leftEyeWhite.position.set(-0.1, 2.28, 0.24);
  bill.add(leftEyeWhite);

  const leftEye = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 8, 8),
    eyeMaterial
  );
  leftEye.position.set(-0.1, 2.28, 0.27);
  bill.add(leftEye);

  const leftPupil = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 6, 6),
    pupilMaterial
  );
  leftPupil.position.set(-0.1, 2.28, 0.29);
  bill.add(leftPupil);

  // Right eye
  const rightEyeWhite = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 8),
    eyeWhiteMaterial
  );
  rightEyeWhite.position.set(0.1, 2.28, 0.24);
  bill.add(rightEyeWhite);

  const rightEye = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 8, 8),
    eyeMaterial
  );
  rightEye.position.set(0.1, 2.28, 0.27);
  bill.add(rightEye);

  const rightPupil = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 6, 6),
    pupilMaterial
  );
  rightPupil.position.set(0.1, 2.28, 0.29);
  bill.add(rightPupil);

  // Eyebrows - friendly, slightly raised
  const eyebrowMaterial = new THREE.MeshStandardMaterial({
    color: 0xAAAAAA, // Gray eyebrows
    roughness: 0.9,
  });

  const leftEyebrow = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.02, 0.03),
    eyebrowMaterial
  );
  leftEyebrow.position.set(-0.1, 2.36, 0.25);
  leftEyebrow.rotation.z = 0.1;
  bill.add(leftEyebrow);

  const rightEyebrow = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.02, 0.03),
    eyebrowMaterial
  );
  rightEyebrow.position.set(0.1, 2.36, 0.25);
  rightEyebrow.rotation.z = -0.1;
  bill.add(rightEyebrow);

  // Nose
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.04, 0.1, 8),
    skinMaterial
  );
  nose.position.set(0, 2.2, 0.28);
  nose.rotation.x = Math.PI / 2;
  bill.add(nose);

  // Friendly smile
  const smileMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    roughness: 0.5,
  });
  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.06, 0.015, 8, 12, Math.PI),
    smileMaterial
  );
  smile.position.set(0, 2.12, 0.24);
  smile.rotation.x = Math.PI;
  smile.rotation.z = Math.PI;
  bill.add(smile);

  // Glasses - round, friendly style
  const glassesMaterial = new THREE.MeshStandardMaterial({
    color: 0x2F2F2F,
    metalness: 0.5,
    roughness: 0.3,
  });

  const leftLens = new THREE.Mesh(
    new THREE.TorusGeometry(0.07, 0.01, 6, 16),
    glassesMaterial
  );
  leftLens.position.set(-0.1, 2.28, 0.23);
  bill.add(leftLens);

  const rightLens = new THREE.Mesh(
    new THREE.TorusGeometry(0.07, 0.01, 6, 16),
    glassesMaterial
  );
  rightLens.position.set(0.1, 2.28, 0.23);
  bill.add(rightLens);

  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.01, 0.01),
    glassesMaterial
  );
  bridge.position.set(0, 2.28, 0.28);
  bill.add(bridge);

  // Mustache - friendly, well-groomed
  const mustache = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.03, 0.03),
    hairMaterial
  );
  mustache.position.set(0, 2.15, 0.26);
  bill.add(mustache);

  // Position Bill near the fountain, facing it
  bill.position.set(8, 0, 3);
  bill.rotation.y = -Math.PI / 3; // Facing towards fountain

  return bill;
}

const bill = createBill();
scene.add(bill);

// ============ BILL'S SPEECH BUBBLE ============
function createSpeechBubble(message) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 256;

  // Draw speech bubble background
  context.fillStyle = 'white';
  context.strokeStyle = '#333333';
  context.lineWidth = 4;
  
  // Rounded rectangle for bubble
  const bubbleX = 20;
  const bubbleY = 20;
  const bubbleWidth = 472;
  const bubbleHeight = 160;
  const cornerRadius = 25;
  
  context.beginPath();
  context.moveTo(bubbleX + cornerRadius, bubbleY);
  context.lineTo(bubbleX + bubbleWidth - cornerRadius, bubbleY);
  context.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + cornerRadius);
  context.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - cornerRadius);
  context.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - cornerRadius, bubbleY + bubbleHeight);
  context.lineTo(bubbleX + cornerRadius, bubbleY + bubbleHeight);
  context.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - cornerRadius);
  context.lineTo(bubbleX, bubbleY + cornerRadius);
  context.quadraticCurveTo(bubbleX, bubbleY, bubbleX + cornerRadius, bubbleY);
  context.closePath();
  context.fill();
  context.stroke();
  
  // Draw pointer/tail of speech bubble
  context.fillStyle = 'white';
  context.beginPath();
  context.moveTo(canvas.width / 2 - 30, bubbleY + bubbleHeight);
  context.lineTo(canvas.width / 2, bubbleY + bubbleHeight + 50);
  context.lineTo(canvas.width / 2 + 30, bubbleY + bubbleHeight);
  context.closePath();
  context.fill();
  context.stroke();
  
  // Cover the stroke inside the bubble for the tail
  context.fillStyle = 'white';
  context.fillRect(canvas.width / 2 - 28, bubbleY + bubbleHeight - 2, 56, 6);

  // Draw text
  context.fillStyle = '#333333';
  context.font = 'bold 48px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(message, canvas.width / 2, bubbleY + bubbleHeight / 2);

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  // Create sprite material
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });

  // Create sprite
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(3, 1.5, 1);
  
  return sprite;
}

const speechBubble = createSpeechBubble("Hi, I'm bi11bot!");
speechBubble.position.set(8, 4, 3); // Position above Bill's head
scene.add(speechBubble);

// Animate Bill slightly (gentle idle animation)
let billTime = 0;

// ============ WATER PARTICLES ============
const particleCount = 500;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const velocities = [];

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = 0;
  positions[i * 3 + 1] = 7.5;
  positions[i * 3 + 2] = 0;
  
  velocities.push({
    x: (Math.random() - 0.5) * 0.15,
    y: Math.random() * 0.3 + 0.2,
    z: (Math.random() - 0.5) * 0.15,
    life: Math.random() * 100
  });
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
  color: 0x40E0D0,
  size: 0.15,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
});

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// ============ TREES ============
function createTree(x, z, scale = 1) {
  const tree = new THREE.Group();

  // Trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.3 * scale, 0.5 * scale, 3 * scale, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a3728,
    roughness: 0.9,
  });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 1.5 * scale;
  trunk.castShadow = true;
  tree.add(trunk);

  // Foliage layers
  const foliageMaterial = new THREE.MeshStandardMaterial({
    color: 0x228B22,
    roughness: 0.8,
  });

  const foliage1 = new THREE.Mesh(
    new THREE.ConeGeometry(2.5 * scale, 3 * scale, 8),
    foliageMaterial
  );
  foliage1.position.y = 4 * scale;
  foliage1.castShadow = true;
  tree.add(foliage1);

  const foliage2 = new THREE.Mesh(
    new THREE.ConeGeometry(2 * scale, 2.5 * scale, 8),
    foliageMaterial
  );
  foliage2.position.y = 5.5 * scale;
  foliage2.castShadow = true;
  tree.add(foliage2);

  const foliage3 = new THREE.Mesh(
    new THREE.ConeGeometry(1.5 * scale, 2 * scale, 8),
    foliageMaterial
  );
  foliage3.position.y = 6.8 * scale;
  foliage3.castShadow = true;
  tree.add(foliage3);

  tree.position.set(x, 0, z);
  return tree;
}

// Add trees around the area
const treePositions = [
  [-20, -20], [-25, 10], [-15, 25], [20, -25], [25, 15],
  [-30, -10], [30, -20], [-10, 30], [10, -30], [28, 28],
  [-28, 28], [-28, -28], [28, -28], [-35, 0], [35, 0],
  [0, 35], [0, -35], [-18, -35], [18, 35], [-40, 20]
];

treePositions.forEach(([x, z]) => {
  const scale = 0.8 + Math.random() * 0.6;
  scene.add(createTree(x, z, scale));
});

// ============ BENCHES ============
function createBench(x, z, rotation = 0) {
  const bench = new THREE.Group();
  
  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    roughness: 0.7,
  });

  // Seat
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.1, 0.6),
    woodMaterial
  );
  seat.position.y = 0.5;
  seat.castShadow = true;
  bench.add(seat);

  // Backrest
  const backrest = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.6, 0.1),
    woodMaterial
  );
  backrest.position.set(0, 0.8, -0.25);
  backrest.castShadow = true;
  bench.add(backrest);

  // Legs
  const legMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.5,
  });

  for (let i = -0.7; i <= 0.7; i += 1.4) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.5, 0.5),
      legMaterial
    );
    leg.position.set(i, 0.25, 0);
    leg.castShadow = true;
    bench.add(leg);
  }

  bench.position.set(x, 0, z);
  bench.rotation.y = rotation;
  return bench;
}

// Add benches around the fountain
scene.add(createBench(10, 0, Math.PI / 2));
scene.add(createBench(-10, 0, -Math.PI / 2));
scene.add(createBench(0, 10, 0));
scene.add(createBench(0, -10, Math.PI));

// ============ FLOWER BEDS ============
function createFlowerBed(x, z, radius = 2) {
  const flowerBed = new THREE.Group();

  // Bed base
  const bedGeometry = new THREE.CylinderGeometry(radius, radius, 0.2, 16);
  const dirtMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d2817,
    roughness: 1,
  });
  const bed = new THREE.Mesh(bedGeometry, dirtMaterial);
  bed.position.y = 0.1;
  bed.receiveShadow = true;
  flowerBed.add(bed);

  // Flowers
  const flowerColors = [0xFF69B4, 0xFFD700, 0xFF6347, 0x9370DB, 0xFF4500];
  
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * (radius - 0.3);
    const fx = Math.cos(angle) * r;
    const fz = Math.sin(angle) * r;

    // Stem
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4),
      new THREE.MeshStandardMaterial({ color: 0x228B22 })
    );
    stem.position.set(fx, 0.35, fz);
    flowerBed.add(stem);

    // Flower head
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshStandardMaterial({
        color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
      })
    );
    flower.position.set(fx, 0.5, fz);
    flowerBed.add(flower);
  }

  flowerBed.position.set(x, 0, z);
  return flowerBed;
}

// Add flower beds
scene.add(createFlowerBed(8, 8));
scene.add(createFlowerBed(-8, 8));
scene.add(createFlowerBed(8, -8));
scene.add(createFlowerBed(-8, -8));

// ============ STONE PATH ============
function createPath() {
  const pathGroup = new THREE.Group();
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x696969,
    roughness: 0.9,
  });

  // Circular path around fountain
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const x = Math.cos(angle) * 9;
    const z = Math.sin(angle) * 9;

    const stone = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.1, 1),
      stoneMaterial
    );
    stone.position.set(x, 0.05, z);
    stone.rotation.y = angle + Math.PI / 2;
    stone.receiveShadow = true;
    pathGroup.add(stone);
  }

  // Paths leading outward
  const directions = [
    { x: 1, z: 0 },
    { x: -1, z: 0 },
    { x: 0, z: 1 },
    { x: 0, z: -1 }
  ];

  directions.forEach(dir => {
    for (let i = 10; i < 30; i += 2) {
      const stone = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.1, 1.5),
        stoneMaterial
      );
      stone.position.set(dir.x * i, 0.05, dir.z * i);
      stone.rotation.y = dir.z !== 0 ? Math.PI / 2 : 0;
      stone.receiveShadow = true;
      pathGroup.add(stone);
    }
  });

  return pathGroup;
}

scene.add(createPath());

// ============ STONE RING WALL ============
function createStoneWall() {
  const wallGroup = new THREE.Group();
  const wallRadius = 45; // Distance from center
  const wallHeight = 3;
  const wallThickness = 1.5;
  const numSegments = 500; // Number of wall segments

  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x6B6B6B,
    roughness: 0.9,
    metalness: 0.1,
  });

  const darkStoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A4A4A,
    roughness: 0.85,
    metalness: 0.1,
  });

  // Create wall segments in a circle
  for (let i = 0; i < numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const nextAngle = ((i + 1) / numSegments) * Math.PI * 2;
    
    // Skip segments for gate openings (4 gates at cardinal directions)
    const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const isGate = 
      (normalizedAngle > -0.1 && normalizedAngle < 0.15) || // East gate
      (normalizedAngle > Math.PI / 2 - 0.1 && normalizedAngle < Math.PI / 2 + 0.15) || // North gate
      (normalizedAngle > Math.PI - 0.1 && normalizedAngle < Math.PI + 0.15) || // West gate
      (normalizedAngle > Math.PI * 1.5 - 0.1 && normalizedAngle < Math.PI * 1.5 + 0.15); // South gate

    if (isGate) continue;

    const x = Math.cos(angle) * wallRadius;
    const z = Math.sin(angle) * wallRadius;

    // Main wall block
    const wallBlock = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, 3),
      stoneMaterial
    );
    wallBlock.position.set(x, wallHeight / 2, z);
    wallBlock.rotation.y = -angle + Math.PI / 2;
    wallBlock.castShadow = true;
    wallBlock.receiveShadow = true;
    wallGroup.add(wallBlock);

    // Add stone texture variation with smaller blocks
    if (i % 3 === 0) {
      const detailBlock = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness + 0.1, 0.4, 2.8),
        darkStoneMaterial
      );
      detailBlock.position.set(x, wallHeight - 0.2, z);
      detailBlock.rotation.y = -angle + Math.PI / 2;
      detailBlock.castShadow = true;
      wallGroup.add(detailBlock);
    }
  }

  // Add pillar columns at regular intervals
  const numPillars = 12;
  for (let i = 0; i < numPillars; i++) {
    const angle = (i / numPillars) * Math.PI * 2;
    
    // Skip pillars at gate positions
    const isGatePosition = 
      Math.abs(angle) < 0.2 ||
      Math.abs(angle - Math.PI / 2) < 0.2 ||
      Math.abs(angle - Math.PI) < 0.2 ||
      Math.abs(angle - Math.PI * 1.5) < 0.2;

    if (isGatePosition) continue;

    const x = Math.cos(angle) * wallRadius;
    const z = Math.sin(angle) * wallRadius;

    // Pillar base
    const pillarBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.5, 2.2),
      darkStoneMaterial
    );
    pillarBase.position.set(x, 0.25, z);
    pillarBase.castShadow = true;
    wallGroup.add(pillarBase);

    // Main pillar
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, wallHeight + 1.5, 1.8),
      stoneMaterial
    );
    pillar.position.set(x, (wallHeight + 1.5) / 2, z);
    pillar.castShadow = true;
    wallGroup.add(pillar);

    // Pillar cap
    const pillarCap = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.4, 2.2),
      darkStoneMaterial
    );
    pillarCap.position.set(x, wallHeight + 1.5 + 0.2, z);
    pillarCap.castShadow = true;
    wallGroup.add(pillarCap);

    // Decorative sphere on top
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 12, 12),
      stoneMaterial
    );
    sphere.position.set(x, wallHeight + 2.2, z);
    sphere.castShadow = true;
    wallGroup.add(sphere);
  }

  // Create gate pillars at entrances
  const gateAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
  gateAngles.forEach(angle => {
    const gateWidth = 4;
    
    // Left pillar
    const leftOffset = 2.5;
    const leftAngle = angle - leftOffset / wallRadius;
    const leftX = Math.cos(leftAngle) * wallRadius;
    const leftZ = Math.sin(leftAngle) * wallRadius;

    const leftPillar = new THREE.Mesh(
      new THREE.BoxGeometry(2, wallHeight + 2, 2),
      stoneMaterial
    );
    leftPillar.position.set(leftX, (wallHeight + 2) / 2, leftZ);
    leftPillar.castShadow = true;
    wallGroup.add(leftPillar);

    const leftCap = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.5, 2.4),
      darkStoneMaterial
    );
    leftCap.position.set(leftX, wallHeight + 2 + 0.25, leftZ);
    leftCap.castShadow = true;
    wallGroup.add(leftCap);

    // Right pillar
    const rightAngle = angle + leftOffset / wallRadius;
    const rightX = Math.cos(rightAngle) * wallRadius;
    const rightZ = Math.sin(rightAngle) * wallRadius;

    const rightPillar = new THREE.Mesh(
      new THREE.BoxGeometry(2, wallHeight + 2, 2),
      stoneMaterial
    );
    rightPillar.position.set(rightX, (wallHeight + 2) / 2, rightZ);
    rightPillar.castShadow = true;
    wallGroup.add(rightPillar);

    const rightCap = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.5, 2.4),
      darkStoneMaterial
    );
    rightCap.position.set(rightX, wallHeight + 2 + 0.25, rightZ);
    rightCap.castShadow = true;
    wallGroup.add(rightCap);

    // Gate arch
    const archX = Math.cos(angle) * wallRadius;
    const archZ = Math.sin(angle) * wallRadius;
    
    const arch = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 5),
      darkStoneMaterial
    );
    arch.position.set(archX, wallHeight + 2, archZ);
    arch.rotation.y = -angle + Math.PI / 2;
    arch.castShadow = true;
    wallGroup.add(arch);
  });

  return wallGroup;
}

scene.add(createStoneWall());

// ============ OUTER STONE RING WALL ============
function createOuterStoneWall() {
  const wallGroup = new THREE.Group();
  const wallRadius = 70; // Outer ring - further out
  const wallHeight = 4; // Slightly taller
  const wallThickness = 2;
  const numSegments = 500; // Number of wall segments

  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x5A5A5A, // Slightly darker stone
    roughness: 0.95,
    metalness: 0.05,
  });

  const darkStoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x3A3A3A,
    roughness: 0.9,
    metalness: 0.05,
  });

  const mossyStoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A5A4A, // Greenish tint - older, mossy stone
    roughness: 0.95,
    metalness: 0.05,
  });

  // Create wall segments in a circle
  for (let i = 0; i < numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    
    // Skip segments for gate openings (4 gates at cardinal directions)
    const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const isGate = 
      (normalizedAngle > -0.08 && normalizedAngle < 0.12) || // East gate
      (normalizedAngle > Math.PI / 2 - 0.08 && normalizedAngle < Math.PI / 2 + 0.12) || // North gate
      (normalizedAngle > Math.PI - 0.08 && normalizedAngle < Math.PI + 0.12) || // West gate
      (normalizedAngle > Math.PI * 1.5 - 0.08 && normalizedAngle < Math.PI * 1.5 + 0.12); // South gate

    if (isGate) continue;

    const x = Math.cos(angle) * wallRadius;
    const z = Math.sin(angle) * wallRadius;

    // Use mossy stone randomly for aged look
    const material = Math.random() > 0.7 ? mossyStoneMaterial : stoneMaterial;

    // Main wall block
    const wallBlock = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, 4),
      material
    );
    wallBlock.position.set(x, wallHeight / 2, z);
    wallBlock.rotation.y = -angle + Math.PI / 2;
    wallBlock.castShadow = true;
    wallBlock.receiveShadow = true;
    wallGroup.add(wallBlock);

    // Add crenellations (battlements) on top
    if (i % 2 === 0) {
      const merlon = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, 1, 1.5),
        darkStoneMaterial
      );
      merlon.position.set(x, wallHeight + 0.5, z);
      merlon.rotation.y = -angle + Math.PI / 2;
      merlon.castShadow = true;
      wallGroup.add(merlon);
    }
  }

  // Add tower pillars at regular intervals
  const numTowers = 8;
  for (let i = 0; i < numTowers; i++) {
    const angle = (i / numTowers) * Math.PI * 2;
    
    // Skip towers at gate positions
    const isGatePosition = 
      Math.abs(angle) < 0.15 ||
      Math.abs(angle - Math.PI / 2) < 0.15 ||
      Math.abs(angle - Math.PI) < 0.15 ||
      Math.abs(angle - Math.PI * 1.5) < 0.15;

    if (isGatePosition) continue;

    const x = Math.cos(angle) * wallRadius;
    const z = Math.sin(angle) * wallRadius;

    // Tower base
    const towerBase = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 3, 1, 12),
      darkStoneMaterial
    );
    towerBase.position.set(x, 0.5, z);
    towerBase.castShadow = true;
    wallGroup.add(towerBase);

    // Main tower
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.5, wallHeight + 3, 12),
      stoneMaterial
    );
    tower.position.set(x, (wallHeight + 3) / 2 + 0.5, z);
    tower.castShadow = true;
    wallGroup.add(tower);

    // Tower roof (cone)
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(2.8, 2.5, 12),
      darkStoneMaterial
    );
    roof.position.set(x, wallHeight + 4.75, z);
    roof.castShadow = true;
    wallGroup.add(roof);

    // Tower windows
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x1A1A2E,
      roughness: 0.5,
    });
    
    for (let w = 0; w < 4; w++) {
      const windowAngle = (w / 4) * Math.PI * 2;
      const wx = x + Math.cos(windowAngle) * 2.3;
      const wz = z + Math.sin(windowAngle) * 2.3;
      
      const window = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 1.2, 0.2),
        windowMaterial
      );
      window.position.set(wx, wallHeight + 2, wz);
      window.rotation.y = -windowAngle;
      wallGroup.add(window);
    }
  }

  // Create gate towers at entrances
  const gateAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
  gateAngles.forEach(angle => {
    // Left tower
    const leftOffset = 4;
    const leftAngle = angle - leftOffset / wallRadius;
    const leftX = Math.cos(leftAngle) * wallRadius;
    const leftZ = Math.sin(leftAngle) * wallRadius;

    const leftTower = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2.2, wallHeight + 4, 12),
      stoneMaterial
    );
    leftTower.position.set(leftX, (wallHeight + 4) / 2, leftZ);
    leftTower.castShadow = true;
    wallGroup.add(leftTower);

    const leftRoof = new THREE.Mesh(
      new THREE.ConeGeometry(2.5, 2, 12),
      darkStoneMaterial
    );
    leftRoof.position.set(leftX, wallHeight + 5, leftZ);
    leftRoof.castShadow = true;
    wallGroup.add(leftRoof);

    // Right tower
    const rightAngle = angle + leftOffset / wallRadius;
    const rightX = Math.cos(rightAngle) * wallRadius;
    const rightZ = Math.sin(rightAngle) * wallRadius;

    const rightTower = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2.2, wallHeight + 4, 12),
      stoneMaterial
    );
    rightTower.position.set(rightX, (wallHeight + 4) / 2, rightZ);
    rightTower.castShadow = true;
    wallGroup.add(rightTower);

    const rightRoof = new THREE.Mesh(
      new THREE.ConeGeometry(2.5, 2, 12),
      darkStoneMaterial
    );
    rightRoof.position.set(rightX, wallHeight + 5, rightZ);
    rightRoof.castShadow = true;
    wallGroup.add(rightRoof);

    // Gate arch connecting towers
    const archX = Math.cos(angle) * wallRadius;
    const archZ = Math.sin(angle) * wallRadius;
    
    const arch = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.5, 8),
      darkStoneMaterial
    );
    arch.position.set(archX, wallHeight + 3, archZ);
    arch.rotation.y = -angle + Math.PI / 2;
    arch.castShadow = true;
    wallGroup.add(arch);
  });

  return wallGroup;
}

scene.add(createOuterStoneWall());

// ============ LAMP POSTS ============
function createLampPost(x, z) {
  const lampPost = new THREE.Group();

  // Pole
  const poleMaterial = new THREE.MeshStandardMaterial({
    color: 0x2F2F2F,
    metalness: 0.7,
    roughness: 0.3,
  });
  
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.15, 4, 8),
    poleMaterial
  );
  pole.position.y = 2;
  pole.castShadow = true;
  lampPost.add(pole);

  // Lamp housing
  const housing = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.3, 0.5),
    poleMaterial
  );
  housing.position.y = 4.1;
  lampPost.add(housing);

  // Light bulb (emissive)
  const bulbMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFAA,
    emissive: 0xFFFFAA,
    emissiveIntensity: 0.5,
  });
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 8, 8),
    bulbMaterial
  );
  bulb.position.y = 3.9;
  lampPost.add(bulb);

  // Add point light
  const light = new THREE.PointLight(0xFFFFAA, 0.5, 15);
  light.position.y = 3.9;
  lampPost.add(light);

  lampPost.position.set(x, 0, z);
  return lampPost;
}

// Add lamp posts
scene.add(createLampPost(12, 12));
scene.add(createLampPost(-12, 12));
scene.add(createLampPost(12, -12));
scene.add(createLampPost(-12, -12));

// ============ SKYBOX - Simple clouds ============
function createClouds() {
  const cloudGroup = new THREE.Group();
  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  });

  for (let i = 0; i < 20; i++) {
    const cloud = new THREE.Group();
    const numSpheres = 3 + Math.floor(Math.random() * 4);

    for (let j = 0; j < numSpheres; j++) {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2 + Math.random() * 3, 8, 8),
        cloudMaterial
      );
      sphere.position.set(
        j * 2 - numSpheres,
        Math.random() * 1.5,
        Math.random() * 2
      );
      cloud.add(sphere);
    }

    cloud.position.set(
      (Math.random() - 0.5) * 150,
      30 + Math.random() * 20,
      (Math.random() - 0.5) * 150
    );
    cloudGroup.add(cloud);
  }

  return cloudGroup;
}

const clouds = createClouds();
scene.add(clouds);

// ============ BILL CLICK DETECTION & CHAT ============
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const chatBox = document.getElementById('chatBox');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendMessage');
const closeChat = document.getElementById('closeChat');
const clickHint = document.getElementById('clickHint');

let isChatOpen = false;

// Grok API configuration
const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
console.log('API Key loaded:', XAI_API_KEY ? `${XAI_API_KEY.substring(0, 6)}...` : 'MISSING');
const GROK_API_ENDPOINT = '/api/grok/chat/completions';
console.log('API Endpoint:', GROK_API_ENDPOINT);

// Chat history for context
let chatHistory = [
  { role: 'system', content: 'You are bi11bot, a friendly older gentleman who stands by a fountain in a beautiful garden. You are helpful, warm, wise, and have a great sense of humor. You love talking about the garden, nature, and helping visitors. Keep responses concise but friendly - usually 1-3 sentences.' }
];

// Function to add a message to the chat
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
  
  const senderSpan = document.createElement('span');
  senderSpan.className = 'sender';
  senderSpan.textContent = isUser ? 'You' : 'bi11bot';
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'bubble';
  bubbleDiv.textContent = text;
  
  messageDiv.appendChild(senderSpan);
  messageDiv.appendChild(bubbleDiv);
  chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot';
  typingDiv.id = 'typingIndicator';
  
  const senderSpan = document.createElement('span');
  senderSpan.className = 'sender';
  senderSpan.textContent = 'bi11bot';
  
  const indicatorDiv = document.createElement('div');
  indicatorDiv.className = 'bubble typing-indicator';
  indicatorDiv.innerHTML = '<span></span><span></span><span></span>';
  
  typingDiv.appendChild(senderSpan);
  typingDiv.appendChild(indicatorDiv);
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to remove typing indicator
function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

// Function to send message to Grok API
async function sendToAPI(userMessage) {
  chatHistory.push({ role: 'user', content: userMessage });
  
  showTypingIndicator();
  sendButton.disabled = true;
  
  try {
    const requestBody = {
      model: 'grok-3-latest',
      messages: chatHistory,
      max_tokens: 200,
      temperature: 0.8
    };
    console.log('Sending request to:', GROK_API_ENDPOINT);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(GROK_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    const botMessage = data.choices?.[0]?.message?.content || "I'm having trouble responding right now.";
    
    chatHistory.push({ role: 'assistant', content: botMessage });
    
    removeTypingIndicator();
    addMessage(botMessage, false);
    
  } catch (error) {
    console.error('API Error:', error.message, error);
    removeTypingIndicator();
    
    // Fallback responses if API fails
    const fallbackResponses = [
      "Hello there, friend! It's a lovely day by the fountain, isn't it?",
      "Ah, welcome to the garden! I've been tending to this place for many years.",
      "The sound of the fountain always brings me peace. What brings you here today?",
      "I'm bi11bot! Feel free to ask me anything about the garden.",
      "The weather is quite nice today. Perfect for a stroll around the fountain!",
      "Have you seen the flowers? They're blooming beautifully this season.",
    ];
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    addMessage(randomResponse, false);
  }
  
  sendButton.disabled = false;
  chatInput.focus();
}

// Handle send message
function handleSendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;
  
  addMessage(message, true);
  chatInput.value = '';
  sendToAPI(message);
}

// Event listeners for chat
sendButton.addEventListener('click', handleSendMessage);

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSendMessage();
  }
});

closeChat.addEventListener('click', () => {
  chatBox.classList.remove('visible');
  isChatOpen = false;
  controls.lock(); // Re-lock controls when closing chat
});

// Click detection for Bill
function onMouseClick(event) {
  // Don't process if chat is open or controls are not locked
  if (isChatOpen) return;
  
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);
  
  // Get all objects that Bill is made of
  const billObjects = [];
  bill.traverse((child) => {
    if (child.isMesh) {
      billObjects.push(child);
    }
  });
  
  // Check for intersections with Bill
  const intersects = raycaster.intersectObjects(billObjects, true);
  
  if (intersects.length > 0) {
    // Clicked on Bill! Open the chat
    controls.unlock();
    chatBox.classList.add('visible');
    isChatOpen = true;
    chatInput.focus();
  }
}

// Add click event listener
document.addEventListener('click', onMouseClick);

// Show hint when looking at Bill
let isLookingAtBill = false;

function checkLookingAtBill() {
  if (isChatOpen || !controls.isLocked) {
    clickHint.style.display = 'none';
    return;
  }
  
  // Cast ray from center of screen
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  
  const billObjects = [];
  bill.traverse((child) => {
    if (child.isMesh) {
      billObjects.push(child);
    }
  });
  
  const intersects = raycaster.intersectObjects(billObjects, true);
  
  if (intersects.length > 0 && intersects[0].distance < 15) {
    clickHint.style.display = 'block';
    isLookingAtBill = true;
  } else {
    clickHint.style.display = 'none';
    isLookingAtBill = false;
  }
}

// ============ HANDLE RESIZE ============
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============ ANIMATION LOOP ============
let prevTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  // Update water particles
  const positions = particleSystem.geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const vel = velocities[i];
    vel.life += 1;

    if (vel.life > 100) {
      // Reset particle
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 7.5;
      positions[i * 3 + 2] = 0;
      vel.x = (Math.random() - 0.5) * 0.15;
      vel.y = Math.random() * 0.3 + 0.2;
      vel.z = (Math.random() - 0.5) * 0.15;
      vel.life = 0;
    } else {
      // Update position
      positions[i * 3] += vel.x;
      positions[i * 3 + 1] += vel.y;
      positions[i * 3 + 2] += vel.z;

      // Gravity
      vel.y -= 0.015;

      // Reset if below water level
      if (positions[i * 3 + 1] < 0.6) {
        vel.life = 100;
      }
    }
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;

  // Animate Bill - always look at the player
  billTime += delta;
  bill.position.y = Math.sin(billTime * 0.8) * 0.02; // Subtle breathing motion
  
  // Calculate angle to look at the player
  const dx = camera.position.x - bill.position.x;
  const dz = camera.position.z - bill.position.z;
  const targetAngle = Math.atan2(dx, dz);
  
  // Smoothly rotate Bill to face the player
  const currentAngle = bill.rotation.y;
  let angleDiff = targetAngle - currentAngle;
  
  // Normalize angle difference to -PI to PI
  while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
  while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
  
  // Smooth rotation (lerp)
  bill.rotation.y += angleDiff * 0.05;

  // Update speech bubble position to follow Bill
  speechBubble.position.set(bill.position.x, bill.position.y + 4, bill.position.z);

  // Animate clouds slowly
  clouds.children.forEach((cloud, i) => {
    cloud.position.x += 0.01 * (i % 2 === 0 ? 1 : -0.5);
    if (cloud.position.x > 80) cloud.position.x = -80;
    if (cloud.position.x < -80) cloud.position.x = 80;
  });

  // Player movement
  if (controls.isLocked) {
    const speed = isRunning ? 50 : 20;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 25 * delta; // Gravity

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    // Apply gravity and ground collision
    camera.position.y += velocity.y * delta;
    if (camera.position.y < 2) {
      velocity.y = 0;
      camera.position.y = 2;
      canJump = true;
    }

    // Keep player within bounds
    const bounds = 90;
    camera.position.x = Math.max(-bounds, Math.min(bounds, camera.position.x));
    camera.position.z = Math.max(-bounds, Math.min(bounds, camera.position.z));
  }

  // Check if player is looking at Bill
  checkLookingAtBill();

  prevTime = time;
  renderer.render(scene, camera);
}

animate();
