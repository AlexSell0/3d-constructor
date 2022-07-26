import {ScenePlayer} from "./ScenePlayer";
import {MeshStandardMaterial} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Colors} from "./config";

export class Model extends ScenePlayer{
    constructor() {
        super();

        this.initModel()

        //Устанавливаем размер 3d контейнера
        this.setSize(600, 600)

        this.setModelElements('cushions')

    }

    setSize(w, h) {
        this.render.setPixelRatio(window.devicePixelRatio);
        this.render.setSize(w, h);
        this.camera.aspect = w / h;
    }

    setMaterial(color) {
        return new MeshStandardMaterial({
            color: parseInt('0x' + color),
            emissive: parseInt('0x' + color),
            specular: 0xbcbcbc,
            metalness: 0.3,
            roughness: 0.5,
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

    setModelElements(value){
        console.log('aaa')
        this.modelElements = value
    }

    getModelElements(){
        return ['back','base','cushions','legs','supports'];
    }

    selectSwatch(color) {
        let new_mtl;
        new_mtl = this.setMaterial(color)

        this.setMaterialModel(this.theModel, this.modelElements, new_mtl);
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
}

global.Model = Model;
