import {Model} from "./model";
import {Colors} from "./config"
import {MeshStandardMaterial} from "three";

export class ControlModel{
    constructor(canvas) {
        this.app = new Model(canvas).successLoad()

        this.colorPalette();

    }


    selectSwatch(color) {
        let new_mtl;
        new_mtl = this.setMaterial(color)
        let modelElements = 'f1';

        this.setMaterialModel(this.app.theModel, modelElements, new_mtl);
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
            console.log(`${key}: ${value}`);
            let elem = document.createElement('div')
            elem.classList.add('color-palette');
            elem.style.background = '#' + value;
            elem.dataset.color = key
            elem.addEventListener('click', this.selectSwatch(value))
            wrapper.appendChild(elem)
        }

        this.settingsContainer.appendChild(wrapper)
    }
}

global.ControlModel = ControlModel;
