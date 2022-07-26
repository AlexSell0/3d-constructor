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
    constructor(canvas) {
        const THREE = require('three');
        this.theModel = null;
        this.canvas = document.getElementById(canvas);

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
        //Подключаем модель
        this.initModel()
        //Подключаем управление
        this.initControls()

        //Устанавливаем размер 3d контейнера
        this.setSize(600, 600)

        this.onAnimate = this.animate.bind(this);
        this.onAnimate();

    }

    setSize(w, h) {
        this.render.setPixelRatio(window.devicePixelRatio);
        this.render.setSize(w, h);
        this.camera.aspect = w / h;
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

    setMaterial(color) {
        return new MeshStandardMaterial({
            color: parseInt('0x' + color),
            emissive: parseInt('0x' + color),
            specular: 0xbcbcbc,
            metalness: 0.3,
            roughness: 0,
        });
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

    initModel() {
        this.loader = new GLTFLoader();

        this.loader.load('./model/model.glb',
            (object) => {
                this.theModel = object.scene;
                // Установить начальный масштаб отображения модели
                this.theModel.scale.set(1, 1, 1);
                this.theModel.position.set(0, 0.3, 0);


                // Инициализируем новый материал
                const initMap = [
                    {childID: "back", mtl: this.setMaterial('341803')},
                    {childID: "base", mtl: this.setMaterial('341803')},
                    {childID: "cushions", mtl: this.setMaterial('66533C')},
                    {childID: "legs", mtl: this.setMaterial('341803')},
                    {childID: "supports", mtl: this.setMaterial('341803')},
                ];

                // Установим начальные значения для текстур деталей
                for (let object of initMap) {
                    this.initColor(this.theModel, object.childID, object.mtl);
                }

                this.colorPalette()

                this.scene.add(this.theModel);

            },
            (xhr) => {
                // called while loading is progressing
                // console.log(`${(Math.round(xhr.loaded / xhr.total * 100))} % loaded`);
            },
            (error) => {
                // called when loading has errors
                console.error('An error happened', error);
            }
        )
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

    selectSwatch(color) {
        let new_mtl;
        new_mtl = this.setMaterial(color)
        let modelElements = 'cushions';

        this.setMaterialModel(this.theModel, modelElements, new_mtl);
    }

    setMaterialModel(parent, type, mtl) {
        parent.traverse((o) => {
            if (o.isMesh && o.nameID != null) {
                if (o.nameID == type) {
                    o.material = mtl;
                }
            }
        });
    }

    colorPalette(){
        this.settingsContainer = document.getElementById('settings')
        let wrapper = document.createElement('div');
        wrapper.classList.add('wrapper')

        for (let [key, value] of Object.entries(Colors)) {
            let elem = document.createElement('div')
            elem.classList.add('color-palette');
            elem.style.background = '#' + value;
            elem.dataset.color = key
            elem.addEventListener('click', ()=>{
                this.selectSwatch(value)
            })
            wrapper.appendChild(elem)
        }

        this.settingsContainer.appendChild(wrapper)
    }

}

global.ScenePlayer = ScenePlayer;
