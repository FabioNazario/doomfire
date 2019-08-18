const fireWidth = 60;
const fireHeight = 60;
const pixelSize = 5;

const debug = false;
const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]

//Standard values
flameIntensity = 35;
volumeControl = 0;
decayIntensity = 2;
windPowerIntensity = 2;
delay = 30;

fireArraySize = fireWidth * fireHeight;
fireArray = new Array(fireArraySize);

async function run(){
    loadStandardValues();
    prepareFire();
    renderFire();
    setFlameIntensity(flameIntensity);
    
    while(1){
        burn();
        flameSoundControl();
        playFireSound();
        await sleep(delay);
    }
   
}

function playFireSound(){
    let audio = document.getElementById("flameAudio");
    //audio.removeAttribute("muted");
    audio.play();
}

function flameSoundControl(){
    let flameAudio = document.getElementById("flameAudio");
    if (volumeControl > flameIntensity){
        volumeControl--;
    }
    if (volumeControl < flameIntensity){
        volumeControl++;
    }
       
    let volume = 1/35 * volumeControl;
    flameAudio.volume = volume;
}

function setFlameIntensity(intensity){
    for ( let i=fireArraySize-fireWidth;i < fireArraySize; i++){
        fireArray[i] = intensity;
        document.getElementById(i).style.backgroundColor = getPixelColor(i);    
    }
    flameIntensity = intensity;
    

}

function setDecayIntensity(intensity){
    decayIntensity = intensity;     
}

function setWindPowerIntensity(intensity){
    windPowerIntensity = intensity;     
}

function setDelay(value){
    delay = value;     
}


function loadStandardValues(){

    flameIntensityRange = document.getElementById("flameIntensityRange");
    decayIntensityRange = document.getElementById("decayIntensityRange");
    windPowerRange      = document.getElementById("windPowerRange");
    delayRange          = document.getElementById("delayRange");

    flameIntensityRange.value = flameIntensity;
    decayIntensityRange.value = decayIntensity;
    windPowerRange.value      = windPowerIntensity;
    delayRange.value          = delay;
}

function raiseFlameIntensity(){
    flameIntensity++;
    
    if(flameIntensity > 35){
        flameIntensity = 35
    }
    setFlameIntensity(Intensity);
}


function reduceFlameIntensity(){
    flameIntensity--;

    if (flameIntensity < 1){
        flameIntensity = 1
    }
    setFlameIntensity(Intensity);
}


function getPixelColor(pixelPosition){
    const pixelIntensity = fireArray[pixelPosition];
    const color = fireColorsPalette[pixelIntensity];
    const colorString = `rgb(${color.r},${color.g},${color.b})`;
    return colorString;
}

function pixelFactory(pixelPosition){
    colorString = getPixelColor(pixelPosition);
    htmlPixel = '';
    if (debug){
        htmlPixel += '<td class="debugOn"style="background-color:'+colorString+'; width: '+pixelSize+'px; height:'+pixelSize+'px;" id='+pixelPosition+'>'+fireArray[pixelPosition]+'</td>'; 
        //htmlPixel += '<td class="debugOn" id='+pixelPosition+'><div style="background-color:'+colorString+'; width: '+pixelSize+'px; height:'+pixelSize+'px;" id='+pixelPosition+'>'+fireArray[pixelPosition]+'</div></td>'; 
    }else{
        htmlPixel += '<td style="background-color:'+colorString+'; width: '+pixelSize+'px; height:'+pixelSize+'px;" id='+pixelPosition+'></td>';
    }

    return htmlPixel;
}

function prepareFire(){
    for ( let i = 0;i < fireArraySize; i++){
        fireArray[i] = 0;    
    }    
}


function renderFire(){
    fireHtml = '<table cellspacing=0 ><tr id="line0">';
    for ( let i = 0;i < fireArraySize; i++){
        if (i % fireWidth == 0 && i > 0 ){
            fireHtml += '</tr><tr>' 
        }

        fireHtml += pixelFactory(i);
    }
    fireHtml += '</tr></table>';


    document.getElementById('fire').innerHTML = fireHtml;
}

function burn(){

    for ( let i = 0;i < fireArraySize - fireWidth; i++){
        randomNum = Math.random();
        decay = Math.floor(randomNum * decayIntensity);
        windPower = Math.floor(randomNum * windPowerIntensity);
        fireArray[i - windPower] = fireArray[i + fireWidth] - decay;
        if (fireArray[i] < 0){
            fireArray[i] = 0;
        }
        
        document.getElementById(i).style.backgroundColor = getPixelColor(i);
        
        if(debug){
            document.getElementById(i).textContent = fireArray[i];
        }

    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  