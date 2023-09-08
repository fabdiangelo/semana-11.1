const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0'
const DRAGON_URL = 'https://pokeapi.co/api/v2/type/16/'

const up = document.getElementById('top')
const left = document.getElementById('left')
const bottom = document.getElementById('bottom')
const right = document.getElementById('right')
const aButton = document.getElementById('a')
const bButton = document.getElementById('b')
const startButton = document.getElementById('start-button')
const selectButton = document.getElementById('select-button')


const card = document.getElementById('window')

let index;

fetch(API_URL).then((response) => response.json()).then((data)=> {ready(data)})

function ready (data){
    getRandomPokemon()

    aButton.addEventListener('click', getRandomPokemon)
    bButton.addEventListener('click', getRandomDragon)
    bottom.addEventListener('click',  getPreviusPokemon)
    left.addEventListener('click',  getPreviusPokemon)
    up.addEventListener('click', getNextPokemon)
    right.addEventListener('click', getNextPokemon)
    selectButton.addEventListener('click', changeToShiny)
    startButton.addEventListener('click', changeImages)

    function getRandomDragon (){
        fetch(DRAGON_URL).then(res => res.json()).then((dragonData)=>{
            const dragons = dragonData.pokemon
            let randomIndex = Math.round(Math.random() * dragons.length)
            let dragonName = dragons[randomIndex].pokemon.name
            let dragonIndex = data.results.findLastIndex((elem)=> elem.name == dragonName)
            index = dragonIndex
            printPokemon(dragonIndex)
        })
    }

    function getRandomPokemon(){
        let randomIndex = Math.round(Math.random() * data.count)
        index = randomIndex
        printPokemon(randomIndex)
    }

    function getNextPokemon(){
        if(index == data.count){
            index = 0
        }else{
            index ++
        }
        printPokemon(index)
    }

    function getPreviusPokemon(){
        if(index == 0){
            index = data.count
        }else{
            index --
        }
        printPokemon(index)
    }

    function printPokemon(index){
        const POKE__URL = data.results[index].url

        fetch(POKE__URL)
            .then((res)=> res.json())
            .then((pokeData) => {
                card.innerHTML = ''

                const animatedURL = pokeData.sprites.versions['generation-v']['black-white'].animated.front_default
                const officialURL = pokeData.sprites.other['official-artwork'].front_default
                const defaultURL = pokeData.sprites.front_default
                const pokeballURL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pokebola-pokeball-png-0.png/800px-Pokebola-pokeball-png-0.png'

                const artWork = document.createElement('img')
                artWork.alt = 'Pokemon Image'
                artWork.id = 'pokemon-picture'
                if(officialURL != null){
                    artWork.src = officialURL
                }else{
                    artWork.src = pokeballURL
                }
                card.appendChild(artWork)

                const sprit = document.createElement('img')
                sprit.alt = 'Pokemon Sprit Image'
                sprit.id = 'pokemon-sprit-right'
                if(animatedURL != null){
                    sprit.src = animatedURL
                    card.appendChild(sprit)
                }else if(defaultURL != null){
                    sprit.src = defaultURL
                    card.appendChild(sprit)
                }else if( artWork.src != pokeballURL){
                    sprit.src = pokeballURL
                    sprit.alt = 'This pokemon doesn\'t have a sprit'
                    card.appendChild(sprit)
                }

                const num = document.createElement('em')
                num.innerHTML = pokeData.id
                num.id = 'pokemon-num'
                card.appendChild(num)

                const name = document.createElement('h2')
                name.innerHTML = pokeData.name.replace(/-/g, ' ')
                name.id = 'pokemon-name'
                card.appendChild(name)

                const types = document.createElement('div')
                types.id = 'pokemon-types'
                pokeData.types.forEach(element => {
                    const type = document.createElement('p')
                    type.classList = 'type'
                    type.id = element.type.name
                    type.innerHTML = element.type.name
                    types.appendChild(type)
                });
                card.appendChild(types)
            })
    }

    function changeImages (){
        const images = card.getElementsByTagName('img')

        if(images[0].id == 'pokemon-picture'){
            images[0].id = 'pokemon-sprit-left'
            images[1].id = 'pokemon-picture'
        }else{
            images[0].id = 'pokemon-picture'
            images[1].id = 'pokemon-sprit-right'
        }
    }

    function changeToShiny (){
        const images = card.getElementsByTagName('img')
        if(/shiny\/\d+\.png$/.test(images[0].src)){
            images[0].src = images[0].src.replace(/shiny\/(\d+\.png|\d+\.gif)$/, '$1')
            images[1].src = images[1].src.replace(/shiny\/(\d+\.png|\d+\.gif)$/, '$1')
        }else{
            images[0].src = images[0].src.replace(/(\/\d+\.png|\/\d+\.gif)$/, '\/shiny$1')
            images[1].src = images[1].src.replace(/(\/\d+\.png|\/\d+\.gif)$/, '\/shiny$1')
        }
    }
}
