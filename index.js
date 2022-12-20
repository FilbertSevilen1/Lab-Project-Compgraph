import * as THREE from './three.js/build/three.module.js'
import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from './three.js/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from './three.js/examples/jsm/geometries/TextGeometry.js'
import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js'

let scene, camera, renderer, orbitControl;

function loadTexture(name){
    let loader = new THREE.TextureLoader();
    let texture = loader.load(name);

    return texture
}

function init(){
    scene = new THREE.Scene();

    let fov = 45;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspect = width/height;

    camera = new THREE.PerspectiveCamera(fov, aspect);
    camera.position.set(0,-50,70);
    
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setClearColor('skyblue');
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    orbitControl = new OrbitControls(camera,renderer.domElement)
    orbitControl.target = new THREE.Vector3(0,0,0)

    orbitControl.autoRotate = true;
    orbitControl.update();
    document.body.appendChild(renderer.domElement);
}

function createAmbientLight(){
    let light = new THREE.AmbientLight("#FFFFFF", 1);
    scene.add(light);
}

function createPointLight(){
    let light = new THREE.PointLight("#FFFFFF", 1);
    light.position.set(0,0,10);
    light.castShadow = true;
}

function render(){
    renderer.render(scene,camera);
    requestAnimationFrame(render);
}

function createGround(){
    let texture = loadTexture('./assets/texture/snowtexture.png');
    let geometry = new THREE.CircleGeometry(14.5, 40);
    let material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
    })
    let ground = new THREE.Mesh(geometry, material);
    return ground;
}

function createBase(){
    let geometry = new THREE.CylinderGeometry(15,20,4,8)
    let material = new THREE.MeshBasicMaterial({
        color:"#000000"
    })
    let base = new THREE.Mesh(geometry,material);
    base.position.set(0,0,-2.1);
    base.rotation.set(1.57,0,0)
    return base;
}

function addWinterHouse(){
    let loader = new GLTFLoader();
    loader.load('./assets/model/scene.gltf', function(model){
        let house = model.scene
        house.scale.set(20,20,20)
        house.position.x = -69
        house.position.y = 50
        house.position.z = -1

        house.rotation.x = 1.5766
        house.rotation.y = 0
        house.rotation.z = 0
        console.log(model.scene)
        scene.add(model.scene);
    });
}

function addText(text){
    let loader = new FontLoader();
    loader.load('./three.js/examples/fonts/droid/droid_sans_bold.typeface.json', function(font){
        let geometry = new TextGeometry(text,{
            font: font,
            size: 2,
            height: 0.5
        });
        let material = new THREE.MeshBasicMaterial({
            color: "#FFFFFF"
        });
        let textMesh = new THREE.Mesh(geometry,material);
        textMesh.position.set(2,-19,-2.5);
        textMesh.rotation.set(1, 0.37, 0.2)
        scene.add(textMesh);
    })
}

function createGlobe(){
    let geometry = new THREE.SphereGeometry(14.5, 32,16,0, 6.3, 1.1, 3)
    let material = new THREE.MeshLambertMaterial({
        color:"#FFFFFF",
        transparent: true,
        opacity:0.4
    });
    let globe = new THREE.Mesh(geometry,material);
    globe.rotateX(-(Math.PI/2))
    return globe;
}

window.onload = () => {
    init();
    createAmbientLight();
    createPointLight();

    let ground = createGround();
    scene.add(ground);

    let base = createBase();
    scene.add(base)

    let globe = createGlobe();
    scene.add(globe);

    addWinterHouse();
    addText("Snowball");

    render();
}

window.onresize = () =>{
    let w = innerWidth;
    let h = innerHeight;
    let aspect = w/h;
    renderer.setSize(w,h)
    camera.aspect = aspect
    camera.updateProjectMatrix() //kalo ada perubahan camera
}