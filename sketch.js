let oscillator1, oscillator2, oscillator3;
let isPlaying = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("Click or touch the screen to play sound", width / 2, height / 2);
  startOscillators();
}

function startOscillators() {
  let audioContext = getAudioContext();
  oscillator1 = new p5.Oscillator();
  oscillator1.setType('sine');
  oscillator1.amp(0);
  oscillator1.freq(240);
  oscillator1.start();

  oscillator2 = new p5.Oscillator();
  oscillator2.setType('sine');
  oscillator2.amp(0);
  oscillator2.freq(360);
  oscillator2.start();

  oscillator3 = new p5.Oscillator();
  oscillator3.setType('sine');
  oscillator3.amp(0);
  oscillator3.freq(480);
  oscillator3.start();
}

function draw() {
  if (isPlaying) {
    console.log("It's playing");
    let x = map(rotationX, -180, 180, 0, 1);
    let y = map(rotationY, -180, 180, 0, 1);
    let z = map(rotationZ, -180, 180, 0, 1);
    console.log(rotationX);
    console.log(x);
    oscillator1.freq(x * 1000);
    oscillator2.freq(y * 1000);
    oscillator3.freq(z * 1000);
  }
}

function touchStarted() {
  console.log("touch started");
  isPlaying = true;
  oscillator1.amp(0.3, 0.1);
  oscillator2.amp(0.3, 0.1);
  oscillator3.amp(0.3, 0.1);
  return false;
}

function touchEnded() {
  isPlaying = false;
  oscillator1.amp(0, 0.1);
  oscillator2.amp(0, 0.1);
  oscillator3.amp(0, 0.1);
}

function mousePressed() {
  isPlaying = true;
}

function mouseReleased() {
  isPlaying = false;
  oscillator1.amp(0, 0.1);
  oscillator2.amp(0, 0.1);
  oscillator3.amp(0, 0.1);
}

document.addEventListener('touchstart', function(){
  getAudioContext().resume().then(function(){
    console.log('Audio context resumed successfully');
  });
});

document.addEventListener('mousedown', function(){
  getAudioContext().resume().then(function(){
    console.log('Audio context resumed successfully');
  });
});

