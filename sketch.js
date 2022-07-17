function setup() {
  createCanvas(1376, 778);
  frameRate(10);
  background('rgb(5,5,5)');
  numrows = 30;
  numcols = 128;
  squareres = 12;
  radius = 62;
  startDensity = 0.0005;
  backgroundFade = '0.3';
  RANDOM_CENTER_DISPLACEMENT_X=10;
  RANDOM_CENTER_DISPLACEMENT_Y=10;

  // Step
  survivalRule=[0,1,2,3];
  genesisRule= [0,4,5];

  // Step2
  survivalRule=[0,1,2,3];
  genesisRule= [0,4,1];

  // Step3
  survivalRule=[0,1,2,3];
  genesisRule= [0,4,2];

  // DiscoCrystal
  startDensity = 0.002;
  survivalRule=[1];
  genesisRule= [1];


  // Assimilation
  startDensity = 0.25;
  genesisRule= [3,4,5];
  survivalRule=[4,5,6,7];

  // Assimilation
  startDensity = 0.02;
  genesisRule= [2,5];
  survivalRule=[2,3,6];

  // Assimilation
  startDensity = 0.0002;
  backgroundFade = '0.5';
  genesisRule= [1];
  survivalRule=[2,3,4];


  // Classic
  startDensity = 0.2;
  genesisRule=[3];
  survivalRule= [2,3];

  // DiscoCrystal
  startDensity = 0.002;
  genesisRule= [1];
  survivalRule=[1];

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
  console.log(random_centers);

  currentMatrix = [];
  for (let i = 0, len3 = numrows; i < len3; i++) {
    currentMatrix.push([]);
    for (let j = 0, len4 = numcols; j < len4; j++) {
      currentMatrix[i].push(random([0,1]));
    } 
  }
  currentMatrix = [];
  for (let i = 0, len3 = numrows; i < len3; i++) {
    currentMatrix.push([]);
    for (let j = 0, len4 = numcols; j < len4; j++) {
      if (random(1)<startDensity) {
        currentMatrix[i].push(1);
      } else {
        currentMatrix[i].push(0);
      }
    } 
  }
  nextMatrix = [];
  for (let i = 0, len5 = numrows; i < len5; i++) {
    nextMatrix.push([]);
    for (let j = 0, len6 = numcols; j < len6; j++) {
      nextMatrix[i].push(0);
    } 
  }
}

function countNeighbours(matrix, x, y) {
  return (matrix[((x -1 + numrows) % numrows)][((y - 1 + numcols) % numcols)] + matrix[((x -1 +numrows) % numrows)][y]+ matrix[((x -1 +numrows) % numrows)][((y + 1) % numcols)]+ matrix[x][((y - 1 + numcols) % numcols)]+ matrix[x][((y + 1) % numcols)]+ matrix[((x +1) % numrows)][((y - 1 +numcols) % numcols)]+ matrix[((x +1) % numrows)][y]+ matrix[((x +1) % numrows)][((y + 1) % numcols)])
}

function checkGenesisRules(matrixElement, neiboughboursCount, genesisRule) {
  genesisTrial = false;
  for (let k = 0, len = genesisRule.length; k < len; k++) {
    genesisTrial = genesisTrial || (neiboughboursCount == genesisRule[k]);
  }
  return genesisTrial;
}

function checkSurvivalRules(matrixElement, neiboughboursCount, survivalRule) {
  survivalTrial = false;
  for (let l = 0, len = survivalRule.length; l < len; l++) {
    survivalTrial = survivalTrial || (neiboughboursCount == survivalRule[l]);
  }
  survivalTrial = (matrixElement == 1 && survivalTrial);
  return survivalTrial;
}

function draw() {

  //clear();

  cred = int(random(240, 255));
  cgreen = int(random(160));
  cblue = int(random(225, 255));
  currentcolor = `rgba(${cred},${cgreen},${cblue},${backgroundFade})`;
  currentcolor = `rgba(5,5,5,${backgroundFade})`;
  background(currentcolor);

  for (let i = 0, len = currentMatrix.length; i < len; i++) {
    for (let j = 0, len2 = currentMatrix[i].length; j < len2; j++) {
      neiboughboursCount = countNeighbours(currentMatrix, i,j);

      nextMatrix[i][j] = 0;

      if (checkGenesisRules(currentMatrix[i][j], neiboughboursCount, genesisRule)) {
        nextMatrix[i][j] = 1;
      };
      if (checkSurvivalRules(currentMatrix[i][j], neiboughboursCount, survivalRule)) {
        nextMatrix[i][j] = 1;
      };





//      if (currentMatrix[i][j] == 1) {
//        fill(0);
//      } else {
//        fill(255);
//      };
      //rect(squareres*i, squareres*j, squareres, squareres);

      noFill();
      stroke(230 + random(25));
      //strokeColor = `rgba(${cred},${cgreen},${cblue},${backgroundFade})`;
      //stroke(strokeColor);
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
