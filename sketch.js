function setup() {
  createCanvas(1366, 768);
  frameRate(20);
  background('rgb(5,5,5)');
  numrows = 10;
  numcols = 32;
  squareres = 12;
  radius = 62;

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
      if (random(1)<0.2) {
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

function draw() {

  //clear();

  background('rgba(5,5,5,0.05)');

  for (let i = 0, len = currentMatrix.length; i < len; i++) {
    for (let j = 0, len2 = currentMatrix[i].length; j < len2; j++) {
      neiboughboursCount = countNeighbours(currentMatrix, i,j);

      nextMatrix[i][j] = 0;

      if (neiboughboursCount == 3 || neiboughboursCount == 7) {
        nextMatrix[i][j] = 1;
      };

      if ((neiboughboursCount == 1 || neiboughboursCount == 2 || neiboughboursCount == 3|| neiboughboursCount == 4 ) && (currentMatrix[i][j] == 1)) {
        nextMatrix[i][j]=1;
      }





      if (currentMatrix[i][j] == 1) {
        fill(0);
      } else {
        fill(255);
      };
      //rect(squareres*i, squareres*j, squareres, squareres);

      noFill();
      stroke(230 + random(25));
      //strokeWeight(20/sqrt(i+1));
      strokeWeight(10/sqrt(i+1) + random_strokes[i]);

      if (currentMatrix[i][j] == 1) {
        arc(682, 359, radius*(i+1) + random_radiuses[i], radius*(i+1) + random_radiuses[i], (j+0.1)*2*PI/numcols + random_rotations[i], (j+0.9)*2*PI/numcols + random_rotations[i]);
      }
    }
  }

  for (let i = 0, len = numrows; i < len; i++) {
    arrayCopy(nextMatrix[i], currentMatrix[i]);
  }

  for (let i = 0, len = numrows; i < len; i++) {
    random_rotations[i]+= random((i/5)*2*PI/(512*numrows));
  }


}
