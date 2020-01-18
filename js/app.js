const GLOW = document.querySelector('#effect');


document.addEventListener('mousemove' , e => {
    let cursorX = e.clientX;
    let cursorY = e.clientY;
    let calculation = calculate(cursorX, cursorY);
    
    calculate(cursorX, cursorY);    
    light(cursorX, cursorY, calculation);    
    shadow(cursorX, calculation);   
});

function calculate(cursorX, cursorY) {
    
    //Viewport info
    const viewWidth = window.innerWidth;
    const viewWidthCenter = viewWidth / 2;
    const viewHeight = window.innerHeight;
    const viewHeightCenter = viewHeight / 2;
    const ratio = viewWidth / viewHeight;

    //Word & Letter Info
    const letterCount = document.querySelector('#word').childElementCount;
    const wordWidth = document.querySelector('#word').offsetWidth;
    const letterWidth = wordWidth / letterCount;
    
    //Cursor location from center
    let cursorLocationX = viewWidth - cursorX - viewWidthCenter;
    let cursorLocationY = viewHeight - cursorY - viewHeightCenter;
    
    //Creates array for letter positions from center on x-axis
    const letterPosX = [];
    
    for(let i = 0; i < letterCount; i++) {
        let letter = wordWidth / letterCount * (i + 1) - viewWidthCenter;
        letterPosX.push(letter);
    }

    return {
        locX : cursorLocationX,
        locY : cursorLocationY,
        cursorLocXAbsolute : Math.abs(cursorLocationX),
        cursorLocYAbsolute : Math.abs(cursorLocationY),
        viewHeightCenter,
        viewWidthCenter,
        letterPosX,
        letterWidth,
        letterCount,
        ratio
    }
}

function light(cursorX, cursorY, calculation) {

    // Light position //
    GLOW.style.left = `${cursorX}px`;
    GLOW.style.top = `${cursorY}px`;

    // Light diameter calculations //
    const glowDiameterMax = 400;
    let glowDiameter = glowDiameterMax - ((calculation.cursorLocXAbsolute / calculation.ratio / 8)+(calculation.cursorLocYAbsolute / 2));
    
    GLOW.style.width = `${glowDiameter}px`;
    GLOW.style.height = `${glowDiameter}px`;

    // Light fade calculations //
    const glowFadeMin = 0.2;
    let glowFadeCalc = (1 - ((calculation.cursorLocXAbsolute + calculation.cursorLocYAbsolute) / (calculation.viewWidthCenter + calculation.viewHeightCenter)));
    let glowFade = glowFadeCalc <= glowFadeMin ? glowFadeMin : glowFadeCalc;
    
    GLOW.style.backgroundImage = `radial-gradient(rgba(255, 255, 240, ${glowFade}), rgba(0, 0, 0, 0 ))`;
    GLOW.style.boxShadow = `0 0 50px 10px rgba(255, 255, 240,${glowFade / 2})`;
}

function shadow(cursorX, calculation) {

    for(let i = 0; i < calculation.letterCount; i++) {
        let letter = document.getElementById(`${i+1}`);
        let xAxis = (calculation.locX + calculation.letterPosX[i]) / 14;
        let yAxis = calculation.locY / 10;
        let blur = Math.abs((cursorX - calculation.letterWidth * i) / 50);
        let fade = 1 - (((calculation.cursorLocXAbsolute + ((cursorX - (calculation.letterWidth * i)) /20)) + calculation.cursorLocYAbsolute) / (calculation.viewWidthCenter + calculation.viewHeightCenter));

        letter.style.textShadow = `${xAxis}px ${yAxis}px ${blur}px rgba(0,0,0,${fade})`;
    }    
}

