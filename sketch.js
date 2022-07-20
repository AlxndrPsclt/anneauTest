function setup() {

  // Library setup
  createCanvas( window.screen.width * window.devicePixelRatio, window.screen.height* window.devicePixelRatio);
  frameRate(10);
  colorMode(HSB);

  // Global image setup
  background('rgb(5,5,5)');
  ROTATE_CONFIG = true;


  // Game of life display setup
  numrows = 20;
  numcols = 64;
  // squareres = 12; // Used for classic matrix display; currently not maintained
  //radius = 82;
  radius = max(window.screen.width* window.devicePixelRatio, window.screen.height * window.devicePixelRatio) / numrows;
  CENTER_X = window.screen.width * window.devicePixelRatio / 2;
  CENTER_Y = window.screen.height * window.devicePixelRatio / 2;

  // Default config; can be overrided later by a named, or custom config
  startDensity = 0.0005;
  backgroundFade = '0.2';
  refreshColor = `rgba(2,2,2,${backgroundFade})`;
  RANDOM_CENTER_DISPLACEMENT_X=30;
  RANDOM_CENTER_DISPLACEMENT_Y=30;


  // CONFIGS

  // Classic configs
  Classic = { startDensity: 0.2, genesisRule: [3], survivalRule: [2,3] };
  DiscoCrystal = { startDensity : 0.002, genesisRule: [1], survivalRule: [1] };

  // Experimental configs
  MasseImpact5 = { genesisRule: [0,4,5], survivalRule: [0,1,2,3] };
  MasseImpact1 = { genesisRule: [0,4,1], survivalRule: [0,1,2,3] };
  MasseImpact2 = { genesisRule: [0,4,2], survivalRule: [0,1,2,3] };

  Assimilation = { startDensity: 0.02, genesisRule: [2,5], survivalRule: [2,3,6] };
  Dissimilation = { startDensity: 0.000000000002, backgroundFade: '0.5', genesisRule: [1], survivalRule: [2,3,4] };

  Reject = { startDensity: 0.18, genesisRule: [3,4,5], survivalRule: [4,5,6,7] };
  Experiment626 = { startDensity : 0.008, genesisRule: [1,4], survivalRule: [2] };

  configs = { DiscoCrystal, Classic, Reject, Assimilation };
  currentConfig = "DiscoCrystal";
  currentConfig = "Reject";
  currentConfig = "Classic";

  loadConfig(currentConfig);

  // Randomness arrays generation
  random_radiuses =[];
  for (let i = 0, len = numrows; i < len; i++) {
    random_radiuses.push(random(10)+random(log(100000*i)));
  }

  random_strokes =[];
  for (let i = 0, len = numrows; i < len; i++) {
    random_strokes.push(random(2.5*i));
  }

  random_rotations =[];
  for (let i = 0, len = numrows; i < len; i++) {
    random_rotations.push(random(2*i*PI/(8*numrows)));
  }

  rotating_centers =[];
  for (let i = 0, len = numrows; i < len; i++) {
    rotating_centers.push( { x: 0, y: 0 } );
    //rotating_centers.push( { x: random(RANDOM_CENTER_DISPLACEMENT_X)-RANDOM_CENTER_DISPLACEMENT_X, y: random(RANDOM_CENTER_DISPLACEMENT_Y)-RANDOM_CENTER_DISPLACEMENT_Y } );
  }

  // Initialise to random matrix
  currentMatrix = [];
  for (let i = 0, len = numrows; i < len; i++) {
    currentMatrix.push([]);
    for (let j = 0, len2 = numcols; j < len2; j++) {
      if (random(1)<startDensity) {
        currentMatrix[i].push(1);
      } else {
        currentMatrix[i].push(0);
      }
    } 
  };

  nextMatrix = [];
  for (let i = 0, len = numrows; i < len; i++) {
    nextMatrix.push([]);
    for (let j = 0, len2 = numcols; j < len2; j++) {
      nextMatrix[i].push(0);
    } 
  };

  prevMatrix = [];
  for (let i = 0, len = numrows; i < len; i++) {
    prevMatrix.push([]);
    for (let j = 0, len2 = numcols; j < len2; j++) {
      prevMatrix[i].push(0);
    } 
  };
}

function loadConfig(configName) {
  if (configName in configs) {
    Object.keys(configs[configName]).forEach(key => {
      window[key] = configs[configName][key];
      console.log(`Loading config ${key}.`);
    })
  }
}

function countNeighbours(matrix, x, y) {
  return (matrix[((x -1 + numrows) % numrows)][((y - 1 + numcols) % numcols)] + matrix[((x -1 +numrows) % numrows)][y]+ matrix[((x -1 +numrows) % numrows)][((y + 1) % numcols)]+ matrix[x][((y - 1 + numcols) % numcols)]+ matrix[x][((y + 1) % numcols)]+ matrix[((x +1) % numrows)][((y - 1 +numcols) % numcols)]+ matrix[((x +1) % numrows)][y]+ matrix[((x +1) % numrows)][((y + 1) % numcols)])
}

function checkRules(neighboursCount, rules) {
  trial = false;
  for (let k = 0, len = rules.length; k < len; k++) {
    trial = trial || (neighboursCount == rules[k]);
  }
  return trial;
}

var randomPropertyName = function (obj) {
  var keys = Object.keys(obj);
  return keys[ keys.length * Math.random() << 0];
};

function draw() {

  //clear();
  if (ROTATE_CONFIG) {
    if(frameCount % 50 == 0) {
      newConfig=randomPropertyName(configs);
      loadConfig(newConfig);
      console.log(`Loaded a new config: ${newConfig}.`);
      console.log(newConfig);
    }
  };

  background(refreshColor);
  noFill();

  for (let i = 0, len = currentMatrix.length; i < len; i++) {
    for (let j = 0, len2 = currentMatrix[i].length; j < len2; j++) {

      neighboursCount = countNeighbours(currentMatrix, i,j);

      // Checking the Rules of life to create the nextMatrix
      nextMatrix[i][j] = 0;

      if (currentMatrix[i][j] == 0) {
        if (checkRules(neighboursCount, genesisRule)) {
          nextMatrix[i][j] = 1;
        };
      };
      if (currentMatrix[i][j] == 1) {
        if (checkRules(neighboursCount, survivalRule)) {
          nextMatrix[i][j] = 1;
        };
      };

      //stroke(230 + random(25));

      cellHue = int(random(10, 230));
      cellSaturation = int(random(20, 140));
      cellBrightness = int(random(2, 140));
      cellAlpha = int(random(2, 10));

      // strokeColor = `rgba(${cellHue},${cellSaturation},${cellBrightness},${backgroundFade})`;
      // stroke(strokeColor);
      if (currentMatrix[i][j] == 1 && prevMatrix[i][j] == 0) {
        stroke(cellHue, cellSaturation, cellBrightness, cellAlpha);
      } else {
        stroke(10, cellSaturation / 8, max(50, cellBrightness / 2), cellAlpha / 4);
      };
      //
      //strokeWeight(20/sqrt(i+1));
      strokeWeight(10/sqrt(i+1) + random_strokes[i]);

      if (currentMatrix[i][j] == 1) {
        arc(CENTER_X+rotating_centers[i].x, CENTER_Y+rotating_centers[i].y, radius*(i+1) + random_radiuses[i], radius*(i+1) + random_radiuses[i], (j+0.1)*2*PI/numcols + random_rotations[i], (j+0.9)*2*PI/numcols + random_rotations[i]);
      }
    }
  }

  for (let i = 0, len = numrows; i < len; i++) {
    arrayCopy(currentMatrix[i], prevMatrix[i]);
    arrayCopy(nextMatrix[i], currentMatrix[i]);
  }

  for (let i = 0, len = numrows; i < len; i++) {
    random_rotations[i]+= random((i/5)*2*PI/(512*numrows));
  }

  for (let i = 0, len = numrows; i < len; i++) {
    // rotating_centers[i].x+= 0.2 * random(RANDOM_CENTER_DISPLACEMENT_X) - 0.1 * RANDOM_CENTER_DISPLACEMENT_X;
    // rotating_centers[i].y+= 0.2 * random(RANDOM_CENTER_DISPLACEMENT_Y) - 0.1 * RANDOM_CENTER_DISPLACEMENT_Y;
    rotating_centers[i].x= sin(frameCount * PI/128)*RANDOM_CENTER_DISPLACEMENT_X;
    rotating_centers[i].y= cos(frameCount * PI/128)*RANDOM_CENTER_DISPLACEMENT_Y;
  }


}
