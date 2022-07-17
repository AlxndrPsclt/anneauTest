function setup() {
  createCanvas(800, 800);
  //frameRate(1);
  numrows = 50;
  numcols = 50;
  squareres = 12;
  currentMatrix = [];
  for (let i = 0, len3 = numrows; i < len3; i++) {
    currentMatrix.push([]);
    for (let j = 0, len4 = numcols; j < len4; j++) {
      currentMatrix[i].push(random([0,1]));
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

  for (let i = 0, len = currentMatrix.length; i < len; i++) {
    for (let j = 0, len2 = currentMatrix[i].length; j < len2; j++) {
      neiboughboursCount = countNeighbours(currentMatrix, i,j);

      nextMatrix[i][j] = 0;

      if (neiboughboursCount == 3) {
        nextMatrix[i][j] = 1;
      };

      if (neiboughboursCount == 2 && (currentMatrix[i][j] == 1)) {
        nextMatrix[i][j]=1;
      }





      if (currentMatrix[i][j] == 1) {
        fill(0);
      } else {
        fill(255);
      };
      rect(squareres*i, squareres*j, squareres, squareres);
    }
  }

  for (let i = 0, len = numrows; i < len; i++) {
    arrayCopy(nextMatrix[i], currentMatrix[i]);
  }


}
