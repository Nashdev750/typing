// You can add JavaScript functionality here.
let strokes = 0
let lineEnds = []
let running = false
let time = 60000

const text = `Since this principle that the contents of lines in ancient MSS., apart from certain disturbing causes, which will be dealt with later on, were very uniform, is the foundation of much of the reasoning to be found in this work, I propose to illustrate it by a number of examples. My excuse for so doing must be that there is not in existence, so far as I know, any similar collection of evidence. In several cases I give statistics concerning the number of letters in columns, pages, and folios of MSS. It was the rule! in ancient MSS. for every page to contain the same number of lines. It follows, therefore, that the contents of columns, pages, and folios constantly agree, like the smaller units of which they are composed.

Since we have no Latin documents which approach in antiquity some of the Greek papyri, I select as my first example a Greek Papyrus written in the third century B.C.

Hibeh 26, ’Pnropixy mpos "AréEavdpov. I take 20 lines from col. x. Here and elsewhere I use, for the sake of convenience, minuscules instead of capitals, and separate the words. I retain orthographical peculiarities.`
let position = 0
let isContinue = true
const testdiv = document.getElementById('test')
document.addEventListener('keyup',trackTest)

const startTest = ()=>{
      let index = 0
      let words = 1
      for(let word of text.split(' ')){
        const worddiv = document.createElement('div')
        worddiv.classList.add('word')
        for (let chr of word) {
            const chrdiv = document.createElement('div')
            chrdiv.classList.add('letter')
            if(index==0) chrdiv.classList.add('letter-active')
            chrdiv.innerHTML = chr
            chrdiv.setAttribute('data-word', words)
            worddiv.appendChild(chrdiv)
            index++
        }
        const chrdiv = document.createElement('div')
        chrdiv.classList.add('letter')
        chrdiv.innerHTML = '&nbsp'
        chrdiv.setAttribute('data-word', words)
        worddiv.appendChild(chrdiv)
        testdiv.appendChild(worddiv)
        words++
      }
}
const setActive = (index,correct)=>{
    const letters = document.querySelectorAll('.letter')
    const status = correct ? 'is-correct' : 'is-wrong'
    letters[index-1].classList.add(status)
    letters.forEach((chr, i)=>{
        if(i<position){
           
           chr.classList.add('is-correct')
        } 
        chr.classList.remove('letter-active')
        if(i==index) chr.classList.add('letter-active')
    })
}
const handlebackSpace = ()=>{
    isContinue = true
    if(position == 0) return
    playkey()
    position--
    const letters = document.querySelectorAll('.letter')
    letters.forEach((chr, i)=>{
        if(i >= position){
            chr.classList.remove('letter-active','is-correct','is-wrong')
        } 
        if(i==position) chr.classList.add('letter-active')
    })
    trackLines(position, true)
}
let canAdd = true
let canshake = true
let pt = undefined
const handleShake = (chr)=>{
    pt = position
    const letters = document.querySelectorAll('.letter')
    const ochr = letters[position].innerHTML
    if(canshake) letters[position].classList.add('shake','shake-style')
    if(canAdd){
        const wrongletter = document.createElement('div')
        wrongletter.innerHTML = chr
        letters[position].appendChild(wrongletter)
        wrongletter.classList.add('error-letter', 'shake-style', 'drop','shake-error')  
    }
    playerror()
    if(canshake){
        setTimeout(() => {
            letters[pt].classList.remove('shake','shake-style')
            canshake = true
        }, 201);
        canshake = false
    }
    if(canAdd){
        setTimeout(() => {
            // letters[pt].innerHTML = ochr
            canAdd = true
        }, 1000);
        canAdd = false
    }
    
}
const checkLineEnd = (index)=>{
    return lineEnds.includes(index)
}
function trackTest(e) {
    if(position==0) startCountdown(60)
    console.log(e.key)
    if(position >= text.length){
        
        return handleFinish()
    }
    strokes++
    console.log(e.key, text[position])
    if(e.key=='Backspace') return handlebackSpace()
    if (!/^[a-zA-Z0-9 !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]$/.test(e.key) && e.key != 'Enter') return playerror()
    const islineEnd = checkLineEnd(position) 
    
    let ltr = e.key     
    if(islineEnd && e.code == 'Enter') ltr = ' '  
    if(ltr == text[position]){
        playkey()
        position++
        setActive(position, true)
        isContinue = true
    }else{
        if(!isContinue) return handleShake(ltr)
        playerror()
        position++
        setActive(position, false)
        isContinue = false
        // if (e.key.length === 1)
    }
    trackLines(position)
}


startTest()

window.addEventListener('resize', updateLineIndicators);
updateLineIndicators()
function updateLineIndicators() {
    lineEnds = [] 
    const testdiv = document.getElementById('test')
    const existingIndicators = document.querySelectorAll('.line');
    existingIndicators.forEach(indicator => indicator.remove());
    // Get all letters inside the container
    const letters = document.querySelectorAll('.letter');
    if (letters.length === 0) return;
    console.log(letters[0].offsetLeft)
    let lastOffsetLeft = letters[0].offsetLeft;

    // Iterate through each letter to find line breaks
    letters.forEach((letter, index) => {
        const currentOffsetLeft = letter.offsetLeft;
        if(currentOffsetLeft==lastOffsetLeft && index != 0){
            const line = document.createElement('div')
            line.classList.add('line')
            testdiv.insertBefore(line, letter.parentNode)
            if(!lineEnds.includes(index-1))lineEnds.push(index-1)
        }
    });
}

const trackLines = (index, back = false)=>{
     let lines = 0
     for (let i = 0; i < lineEnds.length; i++) {
        const end = lineEnds[i]
        if(end >= index) break
        lines++
     }
     if(lineEnds.includes(index-1) || back){
        const letters = document.querySelectorAll('.letter');
        const testdiv = document.getElementById('test')
        const translateY = -(lines * testdiv.offsetHeight/(lineEnds.length+1));
        testdiv.style.transform = `translateY(${translateY}px)`;
        console.log('lines ',translateY, testdiv.offsetHeight)
        console.log(lineEnds)
     }
}

function handleFinish() {
    document.removeEventListener('keyup',trackTest)
    document.querySelector('#test').style.pointerEvents = 'none'
    const correct = document.querySelectorAll('.is-correct').length
    const wrong = document.querySelectorAll('.is-wrong').length
    const letters = document.querySelectorAll('.letter');
    const words = Number(letters[position].dataset.word)
    const accuracy = correct/strokes * 100
    testdiv.style.transform = `translateY(${0}px)`;
    document.querySelector('.modal').classList.add('show')
    document.getElementById('speed').innerText = words+' W/M'
    document.getElementById('accuracy').innerText = accuracy.toFixed(2)+'%'
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}


// Countdown function
function startCountdown(duration) {
    let timeRemaining = duration;
    const counterElement = document.querySelector('.counter strong');
    if (timeRemaining > 0) {
        timeRemaining--; // Decrease time by 1 second
        counterElement.textContent = formatTime(timeRemaining);
    }
    
    const intervalId = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--; // Decrease time by 1 second
            counterElement.textContent = formatTime(timeRemaining);
        } else {
            clearInterval(intervalId); // Stop the interval
            handleFinish(); // Trigger the end function
        }
    }, 1000); // Repeat every 1 second
}

function playerror() {
    const audio = new Audio('/js/key.mp3');
    audio.play();
}
function playkey() {
    const audio = new Audio('/js/key.mp3');
    audio.play();
}