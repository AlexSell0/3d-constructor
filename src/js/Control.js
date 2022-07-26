import {Colors} from "./config";

export class Control{
    constructor(model) {
        this.settingsContainer = document.getElementById('settings')
        this.model = model
        this.modelElements = model.getModelElements()

        this.addModelElementsList()
        this.addColorPalette()
    }

    addModelElementsList(){
        let wrapper = document.createElement('div');
        wrapper.classList.add('wrapper')
        wrapper.classList.add('model-elements')

        this.modelElements.forEach((item)=>{
            let elem = document.createElement('div')
            elem.classList.add('model-element');
            elem.innerText = item
            elem.dataset.element = item
            elem.addEventListener('click', ()=>{
                this.model.setModelElements(elem.dataset.element)
            })
            wrapper.appendChild(elem)
        })

        this.settingsContainer.appendChild(wrapper)
    }

    addColorPalette(){

        let wrapper = document.createElement('div');
        wrapper.classList.add('wrapper')
        wrapper.classList.add('palette')

        for (let [key, value] of Object.entries(Colors)) {
            let elem = document.createElement('div')
            elem.classList.add('color-palette');
            elem.style.background = '#' + value;
            elem.dataset.color = key
            elem.addEventListener('click', ()=>{
                this.model.selectSwatch(value)
            })
            wrapper.appendChild(elem)
        }

        this.settingsContainer.appendChild(wrapper)
    }
}

global.Control = Control;
