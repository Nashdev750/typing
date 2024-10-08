new Audio('/js/key.mp3');
new Audio('/js/error.mp3');
(async function mainFunction() {
    const response = await fetch('/text');
    const text = await response.text();
    
    let strokes = 0
    let duration = 60
    let lineEnds = []
    let position = 0
    let isContinue = true
    const testdiv = document.getElementById('test')
    document.addEventListener('keyup',trackTest)
    document.querySelectorAll('.option').forEach(ele=>ele.addEventListener('click',updateDuration))

    function updateDuration(e) {
        duration = Number(this.dataset.min) * 60
        document.querySelector('.selected').innerText = this.dataset.min+' min'
        document.querySelector('.counter').innerText = '0'+this.dataset.min+':00'
    }
    
    const startTest = ()=>{
          let index = 0
          let words = 1
          for(let word of text.split(' ')){
            const worddiv = document.createElement('div')
            worddiv.classList.add('word')
            for (let chr of word) {
                const chrdiv = document.createElement('div')
                chrdiv.classList.add('letter')
                if(index==0){
                    const tooltip = `<div id="tooltip" class="tooltip">
                                        Start typing!
                                        <div class="tooltip-arrow"></div> <!-- Arrow element -->
                                    </div>`
                    chrdiv.innerHTML = tooltip
                    chrdiv.classList.add('letter-active')
                } 
                chrdiv.innerHTML = chrdiv.innerHTML+chr
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
        if(position == 0){
            try {
                document.getElementById('tooltip').style.display='inline-block'
                document.querySelector('.col-60').style.overflow = ''
            } catch (error) {
                
            }
        }
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
        e.preventDefault();
        if(position==0) startCountdown()
        if(position >= text.length){
            
            return handleFinish()
        }
        strokes++
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
            // playerror()
            return handleShake(ltr)
            // position++
            // setActive(position, false)
            // isContinue = false
            // if (e.key.length === 1)
        }
        trackLines(position)
        if(position>0){
            try {
                document.getElementById('tooltip').style.display='none'
                document.querySelector('.col-60').style.overflow = 'hidden'
                document.querySelector('body').style.overflow = 'hidden'
            } catch (error) {
                
            }
        }
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
        let lastOffsetLeft = letters[0].offsetLeft;
    
        // Iterate through each letter to find line breaks
        letters.forEach((letter, index) => {
            const currentOffsetLeft = letter.offsetLeft;
            if(currentOffsetLeft==lastOffsetLeft && index != 0){
                // const line = document.createElement('div')
                // line.classList.add('line')
                // testdiv.insertBefore(line, letter.parentNode)
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
            const testdiv = document.getElementById('test')
            const translateY = -(lines * testdiv.offsetHeight/(lineEnds.length+1));
            testdiv.style.transform = `translateY(${translateY}px)`;
         }
    }
    
    function handleFinish() {
        document.removeEventListener('keyup',trackTest)
        document.querySelector('#test').style.pointerEvents = 'none'
        const correct = document.querySelectorAll('.is-correct').length
        const wrong = document.querySelectorAll('.is-wrong').length
        const letters = document.querySelectorAll('.letter');
        const words = Math.floor(Number(letters[position].dataset.word)/(duration/60))
        const accuracy = correct/strokes * 100
        const results = getResults(Math.floor(accuracy),strokes - position, words)
        document.getElementById('test-content').innerHTML = results
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    
    // Countdown function
    function startCountdown() {
        let timeRemaining = duration;
        const counterElement = document.querySelector('.counter');
      
        
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
        const audio = new Audio('/js/error.mp3');
        audio.play();
    }
    function playkey() {
        const audio = new Audio('/js/key.mp3');
        audio.play();
    }

})()

function getResults(accuracy,mistakes,speed) {
    return `<div class="row">
    <div class="results">
        <div class="result">
            <h4>Accuracy</h4>
            <div>
                <span>${accuracy} <small>%</small></span>
            </div>
        </div>
        <div class="result">
            <h4>Mistakes</h4>
            <div>
                <span>${mistakes}</span>
            </div>
        </div>
        <div class="result">
            <h4>Speed</h4>
            <div>
                <span>${speed} <small>Words/Min</small></span>
            </div>
        </div>
    </div>
    <div class="try-again">
        <a href="/typing-test"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
          </svg> Try again</a>
    </div>
</div>`
}