function setup() {

  // Library setup
  createCanvas(1376, 778);
  frameRate(10);
  colorMode(HSB);

  // Global image setup
  background('rgb(5,5,5)');


  // Game of life display setup
  numrows = 30;
  numcols = 128;
  // squareres = 12; // Used for classic matrix display; currently not maintained
  radius = 62;

  // Default config; can be overrided later by a named, or custom config
  startDensity = 0.0005;
  backgroundFade = '0.1';
  refreshColor = `rgba(5,5,5,${backgroundFade})`;
  RANDOM_CENTER_DISPLACEMENT_X=10;
  RANDOM_CENTER_DISPLACEMENT_Y=10;


  // CONFIGS

  // Classic configs
  Classic = { startDensity: 0.2, genesisRule: [3], survivalRule: [2,3] };
  DiscoCrystal = { startDensity : 0.002, genesisRule: [1], survivalRule: [1] };

  // Experimental configs
  MasseImpact5 = { genesisRule: [0,4,5], survivalRule: [0,1,2,3] };
  MasseImpact1 = { genesisRule: [0,4,1], survivalRule: [0,1,2,3] };
  MasseImpact2 = { genesisRule: [0,4,2], survivalRule: [0,1,2,3] };

  Assimilation = { startDensity: 0.02, genesisRule: [2,5], survivalRule: [2,3,6] };
  Dissilation = { startDensity: 0.0002, backgroundFade: '0.5', genesisRule: [1], survivalRule: [2,3,4] };

  Reject = { startDensity: 0.18, genesisRule: [3,4,5], survivalRule: [4,5,6,7] };
  Experiment626 = { startDensity : 0.008, genesisRule: [1,4], survivalRule: [2] };

  configs = { DiscoCrystal, Classic, Experiment626, Reject, Assimilation, Dissilation, MasseImpact5, MasseImpact1, MasseImpact2 };
  currentConfig = "Classic";
  currentConfig = "DiscoCrystal";

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

  random_centers =[];
  for (let i = 0, len = numrows; i < len; i++) {
    random_centers.push( { x: random(RANDOM_CENTER_DISPLACEMENT_X)-RANDOM_CENTER_DISPLACEMENT_X, y: random(RANDOM_CENTER_DISPLACEMENT_Y)-RANDOM_CENTER_DISPLACEMENT_Y } );
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
  for (let i = 0, len5 = numrows; i < len5; i++) {
    nextMatrix.push([]);
    for (let j = 0, len6 = numcols; j < len6; j++) {
      nextMatrix[i].push(0);
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
    trial = trial || (neighboursCount == genesisRule[k]);
  }
  return trial;
}


function draw() {

  //clear();
  //if(frameCount > 20) {
  //  loadConfig('DiscoCrystal');
  //}

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
      cellSaturation = int(random(10, 60));
      cellBrightness = int(random(2, 120));
      cellAlpha = int(random(2, 10));

      // strokeColor = `rgba(${cellHue},${cellSaturation},${cellBrightness},${backgroundFade})`;
      // stroke(strokeColor);
      stroke(cellHue, cellSaturation, cellBrightness, cellAlpha);
      //
      //strokeWeight(20/sqrt(i+1));
      strokeWeight(10/sqrt(i+1) + random_strokes[i]);

      if (currentMatrix[i][j] == 1) {
        arc(682+random_centers[i].x, 359+random_centers[i].y, radius*(i+1) + random_radiuses[i], radius*(i+1) + random_radiuses[i], (j+0.1)*2*PI/numcols + random_rotations[i], (j+0.9)*2*PI/numcols + random_rotations[i]);
      }
    }
  }

  for (let i = 0, len = numrows; i < len; i++) {
    arrayCopy(nextMatrix[i], currentMatrix[i]);
  }

  for (let i = 0, len = numrows; i < len; i++) {
    random_rotations[i]+= random((i/5)*2*PI/(512*numrows));
  }

  for (let i = 0, len = numrows; i < len; i++) {
    random_centers[i].x+= random(0.2* RANDOM_CENTER_DISPLACEMENT_X) - 0.1 * RANDOM_CENTER_DISPLACEMENT_X;
    random_centers[i].y+= random(0.2* RANDOM_CENTER_DISPLACEMENT_Y) - 0.1 * RANDOM_CENTER_DISPLACEMENT_Y;
  }


}
