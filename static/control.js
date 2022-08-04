const requestURL = window.location.protocol + '//' + window.location.host + "/config.json";

(async () => {
    let response = await fetch(requestURL);
    let config = await response.json();

class Control{
    constructor(model, config) {
        this.settingsContainer = document.getElementById('settings')
        this.model = model

        this.modelElements = model.getModelElements()

        //Переменная для хранения активного элемента 3d модели
        this.activeElement = null;

        this.config = config

        this.addModelElementsList()

        //Добавляем панель цветов
        this.addColorPalette()

        //Добавляем панель с древесиной
        this.addWoodsPalette()
    }

    addModelElementsList(){
        let wrapper = document.createElement('div');
        wrapper.classList.add('wrapper')
        wrapper.classList.add('model-elements')

        this.modelElements.forEach((item, num)=>{
            let elem = document.createElement('div')

            elem.classList.add('model-element');
            elem.innerText = item
            elem.dataset.element = item

            if(num == 0){
                this.activeElement = elem;
                elem.classList.add('active')
            }

            elem.addEventListener('click', (e)=>{
                this.model.setModelElements(elem.dataset.element)
                let element = e.target
                if(element.classList.contains('model-element') != true){
                    return false
                }
                this.activeElement.classList.remove('active')
                element.classList.add("active")
                this.activeElement = element
            })
            wrapper.appendChild(elem)
        })

        this.settingsContainer.appendChild(wrapper)
    }

    addColorPalette(){

        let wrapper = document.createElement('div');
        wrapper.classList.add('wrapper-palette')

        for (let [key, value] of Object.entries(this.config.colors)) {
            let elem = document.createElement('div')
            elem.innerHTML = `
            <div class="color" style="background-color: #${value.color}"></div><div class="text">${value.name}</div>
            `
            elem.classList.add('color-palette');
            elem.dataset.color = key
            elem.addEventListener('click', ()=>{
                this.model.selectSwatch(value.color)
            })
            wrapper.appendChild(elem)
        }

        this.settingsContainer.appendChild(wrapper)
    }

    addWoodsPalette(){
        let wrapper = document.createElement('div');
        wrapper.classList.add('wrapper-palette')

        for (let [key, value] of Object.entries(this.config.woods)) {
            let elem = document.createElement('div')
            elem.innerHTML = `
            <div class="wood" style="background-image: url('./${value.src}')"></div><div class="text">${value.name}</div>
            `
            elem.classList.add('wood-facture');
            elem.dataset.woodkey = key
            elem.dataset.woodsrc = value.src
            elem.addEventListener('click', ()=>{
                console.log(value.src)
                let item = this.activeElement.innerText.toLowerCase()
                if(item != 'cushions')
                this.model.setWoodTexture(item, `./${value.src}`)
            })
            wrapper.appendChild(elem)
        }

        this.settingsContainer.appendChild(wrapper)
    }
}


    let control = new Control(app, config)
})();
