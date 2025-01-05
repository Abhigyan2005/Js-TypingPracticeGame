const Allwords = [
    "apple", "banana", "cherry", "date", "elephant", "fig", "grape", "honeydew", "igloo", "jungle",
    "kite", "lemon", "mango", "nectar", "orange", "peach", "quilt", "raspberry", "strawberry", "tangerine",
    "umbrella", "violet", "watermelon", "yellow", "zebra", "acorn", "balloon", "cactus", "dolphin",
    "eagle", "forest", "guitar", "island", "jacket", "kangaroo", "lake", "mountain", "night", "ocean",
    "parrot", "rocket", "sunflower", "tiger", "unicorn", "vulture", "whale", "yoga", "zodiac",
    "airplane", "butterfly", "cupcake", "dragonfly", "firefly", "grizzly", "hermit", "insect", "jaguar",
    "koala", "leopard", "monkey", "owl", "penguin", "rabbit", "snake", "turtle", "walrus", "yeti",
    "atlas", "bermuda", "celestial", "delta", "echo", "galaxy", "horizon", "infinity", "lunar", "mars",
    "nebula", "orbit", "plasma", "quasar", "radiant", "starship", "terra", "uplift", "vortex", "whirlpool",
    "yellowstone", "zenith", "alpha", "beta", "gamma", "omega", "theta", "sigma", "epsilon", "phi", "rho",
    "pi", "chi", "lambda", "mu", "nu", "tau", "zeta", "raven", "serpent", "torch", "velvet", "aqua",
    "bronze", "cerulean", "chartreuse", "denim", "emerald", "fuchsia", "garnet", "hazel", "ivory", "jade",
    "khaki", "lavender", "mauve", "navy"
];

let gametime = 30*1000;
window.timer = null;
window.gameStart = null;

const words = document.querySelector(".words");

function addClass(el,name){
    el.classList.add(name);
}

function remClass(el,name){
    el.classList.remove(name)
}

function randomIndex(){
    let index = Math.floor(Math.random() * Allwords.length);
    return Allwords[index]
}

function formatWords(e){
    return `<div class="word"><span class="letter">${e.split('').join('</span><span class="letter">')}</span></div>` 
}

const timebtns = document.querySelectorAll('.timerinfo');

function gametiming(e){
    let time = parseInt((e.target.innerHTML),10);
    console.log(time)
    document.querySelector('.info').innerHTML = time;
    gametime = time*1000;
}

timebtns.forEach(e => {
    e.addEventListener("click", gametiming)
});

function InsertWords(){
    words.innerHTML = '';
    for (let i = 0; i < Allwords.length; i++) {
        words.innerHTML += formatWords(randomIndex());
    }
    addClass(document.querySelector(".word"), 'current')
    addClass(document.querySelector(".letter"), 'current')

    if(document.querySelector('.gameArea.over')){
        remClass(document.querySelector('.gameArea'), 'over')
    }

    document.addEventListener("keydown", handletyping);

    document.querySelector('.info').innerHTML = gametime/1000;
}

InsertWords()

function handletyping(e){
    let keyPressed = e.key;
    const currentWord = document.querySelector(".word.current");
    const currentLetter = document.querySelector(".letter.current");
    const isSpace = keyPressed === " ";
    const isletter = (keyPressed.length === 1) != isSpace;
    const expected = currentLetter?.innerHTML || ' ';
    const isbackspace = keyPressed === "Backspace";
    const firstletter = currentLetter === currentWord.firstChild;
    console.log({keyPressed, expected})
    if(isletter){
        if(currentLetter){
            addClass(currentLetter, keyPressed === expected ? 'correct' : 'incorrect' );
            remClass(currentLetter, 'current')
          if(currentLetter.nextElementSibling){
             addClass(currentLetter.nextElementSibling, 'current')
           }
        }else{
            const incorrectword = document.createElement('span')
            incorrectword.innerHTML = keyPressed
            incorrectword.className = 'letter extra incorrect'
            currentWord.appendChild(incorrectword)
        }
    }

    if(isSpace){
        if(expected !== ' '){
            const invalidLetters = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            invalidLetters.forEach(e => {
                addClass(e, 'incorrect')
            });
        }
       
        remClass(currentWord, 'current');
        addClass(currentWord.nextElementSibling, 'current')
        if(currentLetter){
            remClass(currentLetter, 'current');
        }
        addClass(currentWord.nextElementSibling.firstChild, 'current')
    }

    //auto scroll
    if(currentWord.getBoundingClientRect().top > 320){
        const wordbox = document.querySelector(".words");
        wordbox.scrollTop +=35;
    }

    //timer
    if(!window.timer && isletter){
        window.timer = setInterval(()=>{
            if(!gameStart){
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const millipassed = currentTime - window.gameStart;
            const SecondsPassed = Math.round(millipassed/1000)
            const SecondsLeft = Math.round(gametime/1000 ) - SecondsPassed;
            if(SecondsLeft<=0){
                gameover()
                return;
            }
            document.querySelector('.info').innerHTML = SecondsLeft + '';
        },1000)
    }

    //cursor
    const nextword = document.querySelector('.word.current')
    const nextletter  = document.querySelector('.letter.current');
    const cursor = document.querySelector('.cursor')
    cursor.style.top = (nextletter || nextword).getBoundingClientRect().top + 2 + 'px';
    if(nextletter){
        cursor.style.top = nextletter.getBoundingClientRect().top + 2 + 'px';
        cursor.style.left = nextletter.getBoundingClientRect().left + 2 +'px';
    }else{
        cursor.style.top = nextword.getBoundingClientRect().top + 2 + 'px';
        cursor.style.left = nextword.getBoundingClientRect().right + 2 +'px';
    }

    if(isbackspace){
        const incorrectLetters = currentWord.querySelectorAll('.letter.extra.incorrect');
        if (incorrectLetters.length > 0) {
            const lastIncorrectLetter = incorrectLetters[incorrectLetters.length - 1];
            lastIncorrectLetter.remove(); 
        } else{
            if(currentLetter && firstletter && currentWord.previousElementSibling === null){
                return;
            }
            if(currentLetter && firstletter){
                remClass(currentLetter, 'current');
                remClass(currentWord, 'current')
                addClass(currentWord.previousElementSibling, 'current')
                addClass(currentWord.previousElementSibling.lastChild, 'current')
                remClass(currentWord.previousElementSibling.lastChild, 'correct')
                remClass(currentWord.previousElementSibling.lastChild, 'incorrect')
            }
            if(currentLetter && !firstletter){
                remClass(currentLetter, 'current')
                addClass(currentLetter.previousElementSibling, 'current')
                remClass(currentLetter.previousElementSibling, 'correct')
                remClass(currentLetter.previousElementSibling, 'incorrect')
            }
            if(!currentLetter){
                addClass(currentWord.lastChild, 'current')
                remClass(currentWord.lastChild, 'correct')
                remClass(currentWord.lastChild, 'incorrect')
            }
        }
    }
}

function wpm() {
    const wordss = [...document.querySelectorAll('.word')]
    const lastword = document.querySelector('.word.current')
    const lastwordIndex = wordss.indexOf(lastword) + 1;
    const wordstyped = wordss.slice(0,lastwordIndex)
    const correctwords = wordstyped.filter(word =>{
        const letters = [...word.children]
        const incorrect = letters.filter(letter => letter.className.includes('incorrect'))
        const correct = letters.filter(letter => letter.className.includes('correct'))
        return incorrect.length === 0 && correct.length === letters.length;
    })
    return correctwords.length/gametime * 60000;
}

function gameover(){
    clearInterval(window.timer)
    addClass(document.querySelector('.gameArea'), 'over')
    document.querySelector('.info').innerHTML = `Your Speed is: ${wpm()} words per minute`

    document.removeEventListener("keydown", handletyping)
}

