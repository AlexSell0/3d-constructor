import THREE, {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    HemisphereLight,
    AmbientLight,
    PointLight,
    PlaneGeometry,
    MeshPhongMaterial,
    Mesh,
    Color,
    MeshStandardMaterial,
    CameraHelper
} from 'three';

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Colors} from "./config";

export class ScenePlayer {
    constructor() {
        const THREE = require('three');
        this.theModel = null;
        this.canvas = document.getElementById('canvas');

        //инициализируем сцену
        this.initScene()
        //инициализируем камеру
        this.initCamera()
        //Инициализируем рендер
        this.initRender()

        //Подключаем свет
        this.initLights()
        // Подключаем пол
        this.initFloor()

        //Подключаем управление
        this.initControls()

        this.onAnimate = this.animate.bind(this);
        this.onAnimate();

    }

    initScene(){
        this.scene = new Scene()
        this.scene.background = new Color(0xffffff);
    }

    initCamera(){
        this.camera = new PerspectiveCamera(7, 1, 1, 1000);
        this.camera.position.set(0, 0, -5);
        this.camera.updateProjectionMatrix();
    }

    initRender(){
        this.render = new WebGLRenderer({antialias: true});
        //Задаем размеры сцены и ее цвет и добавляем сцену в body
        this.render.setPixelRatio(window.devicePixelRatio)
        this.render.shadowMap.enabled = true;
        this.canvas.appendChild(this.render.domElement)
    }

    initLights() {
        this.ambient = new AmbientLight(0xFFFFFF, 0.9);
        this.ambient.position.set(-40, 50, -22);
        this.scene.add(this.ambient);
        // this.scene.add(this.point);

        this.light = new DirectionalLight(0xffffff, 1);
        this.light.position.set(-40, 50, -22);
        this.light.target.position.set(50, 40, 0);
        this.light.shadow.camera.near = 0.5;
        this.light.shadow.camera.far = 500;
        this.light.shadow.camera.left = -20;
        this.light.shadow.camera.bottom = -10;
        this.light.shadow.camera.right = 20;
        this.light.shadow.camera.top = 20;

        this.light.castShadow = true;
        this.scene.add(this.light);
        // this.helper = new CameraHelper( this.light.shadow.camera );
        // this.scene.add(this.helper);
    }

    initFloor() {
        // Добавим пол
        this.floorGeometry = new PlaneGeometry(5000, 5000, 1, 1);
        this.floorMaterial = new MeshPhongMaterial({
            //Цвет пола
            color: 0xd9d9d9,
            shininess: 1 //блеск бликов
        });
        this.floor = new Mesh(this.floorGeometry, this.floorMaterial);
        this.floor.rotation.x = -0.5 * Math.PI;
        this.floor.receiveShadow = true;
        this.floor.position.set(0, -0.5, 0);
        this.scene.add(this.floor);
    }

    // функция добавляет в модель текстуры
    initColor(parent, type, mtl) {
        parent.traverse((o) => {
            if (o.isMesh) {
                if (o.name.includes(type)) {
                    o.material = mtl;
                    o.nameID = type; // Set a new property to identify this object
                }
            }
        });
    }

    // Включаем управление мышью
    initControls() {
        //Orbit Controls
        this.controls = new OrbitControls(this.camera, this.render.domElement)
        this.controls.update();
        this.controls.enableDamping = true;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 70;
        //Добавляем вращение
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = -1.0;
    }

    //Настраиваем анимацию
    animate() {
        requestAnimationFrame(this.onAnimate)
        this.controls.update()
        this.render.render(this.scene, this.camera)
    }

}

global.ScenePlayer = ScenePlayer;
