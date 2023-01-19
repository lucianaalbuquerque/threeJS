import { render } from 'react-dom';
import gsap from 'gsap'
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import './styles.scss'

const scene = new THREE.Scene();

//Geometry
const geometry = new THREE.SphereGeometry( 3, 64, 64 );
const material = new THREE.MeshStandardMaterial( { color: "#00ff83", roughness: 0.8 } );
const sphere = new THREE.Mesh( geometry, material );
scene.add(sphere);

//Sizes
const sizes = {
  width: window.innerWidth,
  heigth: window.innerHeight
}

//Ligth
const light = new THREE.PointLight(0xfffff, 1, 100);
light.position.set(0, 10, 18);
light.intensity = 1.25;
scene.add(light)
 
//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.heigth, 0.1, 100);
camera.position.z = 20;
//camera.position.x = 4;
scene.add(camera);

//Render
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.heigth)
renderer.setPixelRatio(2)
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

//resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.heigth = window.innerHeight
  camera.aspect = sizes.width / sizes.heigth
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.heigth)
})

const loop = () => {
  //sphere.position.x += 0.05
  controls.update();
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}

loop()

//Timeline magic
const tl= gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(sphere.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1},)
tl.fromTo(".title", {opacity: 0}, {opacity:1},)

//MouseEvent
let mouseDown = false;
let rgb = [12, 23, 55]
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))
window.addEventListener('mousemove', (e) => {
  if (mouseDown === true) {
    rgb = [
      Math.round((e.pageX / sizes.width * 255)),
      Math.round((e.pageY / sizes.heigth * 255)),
      150
    ]
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(sphere.material.color, { r: newColor.r, g: newColor.g, b: newColor.b})
  }
})