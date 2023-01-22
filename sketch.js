function setup() {

  // Library setup
  createCanvas( window.screen.width * window.devicePixelRatio, window.screen.height* window.devicePixelRatio);
  noCursor();
  frameRate(10);
  colorMode(HSB);

  // Global image setup
  ROTATE_CONFIG = true;
  CONFIG_CHANGE_RANDOM_PERIOD = 200;
  ELEMENT_PERTUBATEUR = true;
  PERTURBATION_DENSITY = 0.02;
  PERTURBATION_PERIOD= 20;

  SQUARE_SIZE = 40;


  // Game of life display setup
  //numrows = 20;
  //numcols = 32;

  numrows = window.screen.height * window.devicePixelRatio / SQUARE_SIZE;
  numcols = window.screen.width * window.devicePixelRatio / SQUARE_SIZE;
  console.log(numrows);
  console.log(numcols);


  // squareres = 12; // Used for classic matrix display; currently not maintained
  //radius = 82;
  radius = max(window.screen.width* window.devicePixelRatio, window.screen.height * window.devicePixelRatio) / numrows;
  CENTER_X = window.screen.width * window.devicePixelRatio / 2;
  CENTER_Y = window.screen.height * window.devicePixelRatio / 2;
  // Default config; can be overrided later by a named, or custom config
  startDensity = 0.0005;
  BACKGROUND_FADE = '0.05';
  refreshColor = `rgba(0,0,0,${BACKGROUND_FADE})`;
  RANDOM_CENTER_DISPLACEMENT_X=20;
  RANDOM_CENTER_DISPLACEMENT_Y=20;

  background(refreshColor);

  // CONFIGS

  // Classic configs
  Classic = { startDensity: 0.2, genesisRule: [3], survivalRule: [2,3] };
  DiscoCrystal = { startDensity : 0.002, genesisRule: [1], survivalRule: [1] };

  // Experimental configs
  MasseImpact5 = { genesisRule: [0,4,5], survivalRule: [0,1,2,3] };
  MasseImpact1 = { genesisRule: [0,4,1], survivalRule: [0,1,2,3] };
  MasseImpact2 = { genesisRule: [0,4,2], survivalRule: [0,1,2,3] };

  Assimilation = { startDensity: 0.02, genesisRule: [2,5], survivalRule: [2,3,6] };
  Dissimilation = { startDensity: 0.000000000002, genesisRule: [1], survivalRule: [2,3,4] };

  Reject = { startDensity: 0.18, genesisRule: [3,4,5], survivalRule: [4,5,6,7] };
  Experiment626 = { startDensity : 0.008, genesisRule: [1,4], survivalRule: [2] };

  configs = { DiscoCrystal, Classic, Dissimilation };
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

  circles_rotations =[];
  for (let i = 0, len = numrows; i < len; i++) {
    circles_rotations.push({ direction: random([-1,1]), value: random(2*i*PI/(8*numrows))});
  }

  centers_rotations =[];
  for (let i = 0, len = numrows; i < len; i++) {
    centers_rotations.push( { x: 0, y: 0, direction: random([-1, 1]) } );
    //centers_rotations.push( { x: random(RANDOM_CENTER_DISPLACEMENT_X)-RANDOM_CENTER_DISPLACEMENT_X, y: random(RANDOM_CENTER_DISPLACEMENT_Y)-RANDOM_CENTER_DISPLACEMENT_Y } );
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
    if(frameCount % int(random(CONFIG_CHANGE_RANDOM_PERIOD)) == 0) {
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

      cellHue = int(random(160, 280));
      cellSaturation = int(random(20, 140));
      cellBrightness = int(random(2, 140));
      cellAlpha = random(0.5);

      // s+5)trokeColor = `rgba(${cellHue},${cellSaturation},${cellBrightness},${BACKGROUND_FADE})`;
      // stroke(strokeColor);
      if (currentMatrix[i][j] == 1 && prevMatrix[i][j] == 0) {
        stroke(cellHue, cellSaturation, cellBrightness, cellAlpha);
      } else {
        stroke(10, cellSaturation, max(20, cellBrightness), cellAlpha / 8);
      };

      if (ELEMENT_PERTUBATEUR) {
        if (frameCount % PERTURBATION_PERIOD == 0) {
          if (random(1) < PERTURBATION_DENSITY) {
            currentMatrix[i][j] = 1;
            console.log("Pertubation!");
            stroke(334, 83, 75, 0.8);
          }
        } 
      };
 
      //
      //strokeWeight(20/sqrt(i+1));
      strokeWeight(random(30));

      if (currentMatrix[i][j] == 1) {
        //arc(CENTER_X+centers_rotations[i].x, CENTER_Y+centers_rotations[i].y, radius*(i+1) + random_radiuses[i], radius*(i+1) + random_radiuses[i], (j+0.1)*2*PI/numcols + circles_rotations[i].value, (j+0.9)*2*PI/numcols + circles_rotations[i].value);

        square(i*(SQUARE_SIZE+32), j*SQUARE_SIZE, SQUARE_SIZE);

        //arc(CENTER_X+centers_rotations[i].x, CENTER_Y+centers_rotations[i].y, radius*(i+1) + random_radiuses[i], radius*(i+1) + random_radiuses[i], (j+0.1)*2*PI/numcols + circles_rotations[i].value, (j+0.9)*2*PI/numcols + circles_rotations[i].value);
      }
    }
  }

  for (let i = 0, len = numrows; i < len; i++) {
    arrayCopy(currentMatrix[i], prevMatrix[i]);
    arrayCopy(nextMatrix[i], currentMatrix[i]);
  }

  for (let i = 0, len = numrows; i < len; i++) {
    circles_rotations[i].value+= circles_rotations[i].direction * random(i*2*PI/(512*numrows));
  }

  for (let i = 0, len = numrows; i < len; i++) {
    // centers_rotations[i].x+= 0.2 * random(RANDOM_CENTER_DISPLACEMENT_X) - 0.1 * RANDOM_CENTER_DISPLACEMENT_X;
    // centers_rotations[i].y+= 0.2 * random(RANDOM_CENTER_DISPLACEMENT_Y) - 0.1 * RANDOM_CENTER_DISPLACEMENT_Y;
    centers_rotations[i].x= sin(centers_rotations[i].direction * (frameCount + 10 * i) * PI/128)*RANDOM_CENTER_DISPLACEMENT_X;
    centers_rotations[i].y= cos(centers_rotations[i].direction * (frameCount + 10 * i) * PI/128)*RANDOM_CENTER_DISPLACEMENT_Y;
  }



}
