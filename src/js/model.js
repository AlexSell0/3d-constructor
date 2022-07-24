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
    CameraHelper
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

export class Model{
    constructor() {
        const THREE = require('three');

        //инициализируем сцену
        this.scene = new Scene()

        //инициализируем камеру
        this.camera = new PerspectiveCamera(45, 1, 1, 1000);
        this.camera.position.set(10, 5, -15);
        this.camera.updateProjectionMatrix();

        //Инициализируем рендер
        this.render = new WebGLRenderer({ antialias: true });

        //Задаем размеры сцены и ее цвет и добавляем сцену в body
        this.scene.background = new THREE.Color(0xffffff);
        this.render.setPixelRatio(window.devicePixelRatio)
        this.render.shadowMap.enabled = true;
        document.body.appendChild(this.render.domElement)

        this.setSize(600,600)

        //Подключаем свет
        this.initLights()

        // Подключаем пол
        this.initFloor()

        //Подключаем модель
        this.initModel()

        this.initControls()


        //Запускаем анимацию
        this.onAnimate = this.animate.bind(this);
        this.onAnimate();
    }

    setSize(w, h) {
        this.render.setPixelRatio(window.devicePixelRatio);
        this.render.setSize(w, h);
        this.camera.aspect = w / h;
    }

    initLights(){
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

    initFloor(){
        // Добавим пол
        this.floorGeometry = new PlaneGeometry(5000, 5000, 1, 1);
        this.floorMaterial = new MeshPhongMaterial({
            //Цвет пола
            color: 0xffffff,
            shininess: 1 //блеск бликов
        });
        this.floor = new Mesh(this.floorGeometry, this.floorMaterial);
        this.floor.rotation.x = -0.5 * Math.PI;
        this.floor.receiveShadow = true;
        this.floor.position.set(0,-3,0);
        this.scene.add(this.floor);
    }

    initModel(){
        this.loader = new GLTFLoader();

        this.loader.load( './model/headphones.glb', (gltf)=> {
            this.theModel = gltf.scene;
            // Установить начальный масштаб отображения модели
            this.theModel.scale.set(0.8, 0.8, 0.8);
            this.theModel.position.set(0,1,0);

            this.theModel.traverse((o) => {
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                    // if (o instanceof THREE.Mesh) {
                    //     // Удаляем оригинальный material.map
                    //     // o.material.map = null;
                    // }
                }

            });

            this.scene.add( this.theModel );

        }, undefined, function ( error ) {

            console.error( error );

        } );

    }

    initControls(){
        //Orbit Controls
        this.controls = new OrbitControls(this.camera, this.render.domElement)
        this.controls.update();
        this.controls.enableDamping = true;
        this.controls.minDistance = 15;
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

global.Model = Model;
