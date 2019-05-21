// IFT1015 - Programmation 1
// Devoir 1: Conway's Game of Life
// Alex Paul et Vincent Beaulieu

// Largeur et hauteur initial
var width = 40;
var height = 40;

// Cells est le tableau de référence pour le programme. La fonction updateGrid réplique sur la grille le tableau cells.
var cells = new Array(width); // Besoin d'un tableau 2D de 40x40 ici pour gérer la grille, on a ici un tableau simple mais chaque élément du tableau contiendra un tableau.

var couleurs = {
  black: "#000000",
  darkBlue: "#00008B"
}; // Structure pour les couleurs.

var initialiseCells = function() {
  // On remplit chaque élément du tableau par un nouveau tableau et chaque élément
  for (var y = 0; y < height; y++) {
    cells[y] = new Array(width);

    for (var x = 0; x < width; x++) {
      cells[y][x] = {
        etat: 0,
        aNaitre: 0,
        aMourir: 0
      }; // Etat de la cellule et action a prendre à la prochaine étape.
    }
  }
};

var changeState = function(x, y) {
  // Change l'etat des cellules

  cells[y][x].etat = cells[y][x].etat == 0 ? 1 : 0;
  cells[y][x].aMourir = 0;
  cells[y][x].aNaitre = 0;

  updateGrid();
};

var step = function() {
  // Identifier les cellules qui doit mourir et naitre a la prochaine generation

  for (var y = 0; x < height; y++) {
    for (var x = 0; x < width; x++) {
      // Compte le nombre de voisin mort et vivant

      var voisinsVivants = compterVoisinsVivants(x, y);
      var vosinsMorts = 8 - voisinsVivants;
      var estVivant = cells[y][x].etat;

      if (voisinsVivants < 2 && estVivant) {
        // Si moins de 2 voisins vivants et est vivante, la cellule va mourir
        cells[y][x].aMourir = 1;
      } else if (voisinsVivants > 3 && estVivant) {
        // Si plus que 3 voisins vivants et qu'elle est vivante, la cellule va mourir
        cells[y][x].aMourir = 1;
      } else if (voisinsVivants == 3 && !estVivant) {
        // Si 3 voisins vivants et que la cellule est morte, elle va naitre
        cells[y][x].aNaitre = 1;
      }
    }
  }

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      if (cells[y][x].aMourir || cells[y][x].aNaitre) {
        // Si la cellule doit naitre ou mourir, on change son etat
        changeState(x, y);
      }
    }
  }

  updateGrid();
};

var compterVoisinsVivants = function(x, y) {
  // Compte le nombre de cellule vivante autour de la cellule (x,y)

  var nbVoisins = 0; // Initialise la valeur qui compte le nombre de voisin vivant

  for (var i = y - 1; i <= y + 1; i++) {
    for (var j = x - 1; j <= x + 1; j++) {
      if (i != y || j != x) {
        // On ne compte pas la cellule centrale

        if (cells[(i + width) % width][(j + height) % height].etat == 1) {
          // Le modulo sert a faire la boucle sur la grille.
          // ie: la cellule en bas à droite est voisine avec celle en haut à gauche.
          nbVoisins += 1;
        }
      }
    }
  }

  return nbVoisins; // Retourne le nombre de voisin
};

var randomGrid = function(percent) {
  // Remplit la grille de cellule vivante aléatoirement

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      if (100 * Math.random() <= percent) {
        // Utilise la fontion 'random' pour generer une valeur entre 0 et 100 (exclusivement)
        cells[y][x].etat = 1;
      } else {
        cells[y][x].etat = 0;
      }
    }
  }

  updateGrid();
};

var resetGrid = function() {
  // Remet la grille a neuf

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      cells[y][x].etat = 0;
      cells[y][x].aNaitre = 0;
      cells[y][x].aMourir = 0;
    }
  }
  updateGrid();
};

var resizeGrid = function(newWidth, newHeight) {
  // Reajuste la grille avec les nouvelles dimensions

  if (newWidth > width) {
    // Si la nouvelle hauteur est plus grande que l'ancienne
    for (var i = 1; i <= newWidth - width; i++) {
      // On doit ajouter (newWidth - width) nouvelle colonne

      var newArr = new Array(height); // On crée une nouvelle colonne

      for (var j = 0; j < height; j++) {
        // Initialise la nouvelle colonne avec des cellules vides

        newArr[j] = {
          etat: 0,
          aNaitre: 0,
          aMourir: 0
        };
      }

      cells.push(newArr); // On rajoute la colonne vide a notre grille
    }
  } else if (newWidth < width) {
    // Si la nouvelle hauteur est plus petite que l'ancienne

    for (var i = 1; i <= width - newWidth; i++) {
      // On retire les lignes de 'trop'
      cells.pop();
    }
  }

  if (newHeight > height) {
    // Si la nouvelle hauteur est plus grande que l'ancienne
    for (var i = 0; i < newWidth; i++) {
      for (j = 1; j <= newHeight - height; j++) {
        cells[i].push({
          // On rajoute directement une cellule vide a chaque ligne
          etat: 0,
          aNaitre: 0,
          aMourir: 0
        });
      }
    }
  } else if (newHeight < height) {
    for (var i = 0; i < newWidth; i++) {
      for (j = 1; j <= height - newHeight; j++) {
        cells[i].pop(); // On retire les cellules de trop a chaque ligne
      }
    }
  }

  Grid.create(newWidth, newHeight); // On recrée notre nouvelle grille
  width = newWidth;
  height = newHeight;
  updateGrid();
};

var updateGrid = function() {
  // Met la grille a jour selon le tableau cells et selon l'état de chaque cellule

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      if (cells[x][y].etat == 0) {
        Grid.colorCell(x, y, couleurs.black); // Si 'etat' est 0, la cellule est morte et sera noire.
      } else {
        Grid.colorCell(x, y, couleurs.darkBlue); // Sinon elle sera vivante et bleue
      }
    }
  }
};

// Crée la grille initiale
Grid.create(20, 20);
initialiseCells();
randomGrid(25);

// Tests de certains paterns connus que nous appelerons dans la console du navigateur
var testOscillateur = function() {
  resizeGrid(5, 5);
  resetGrid();
  for (var i = 1; i <= 3; i++) {
    cells[i][2].etat = 1;
  }
  updateGrid();
};
var testPlanneur = function() {
  resizeGrid(30, 30);
  resetGrid();
  cells[13][13].etat = 1;
  cells[13][15].etat = 1;
  cells[14][13].etat = 1;
  cells[14][14].etat = 1;
  cells[15][14].etat = 1;
  updateGrid();
};
var testStillLife1 = function() {
  resizeGrid(6, 6);
  resetGrid();
  cells[2][2].etat = 1;
  cells[2][3].etat = 1;
  cells[3][2].etat = 1;
  cells[3][3].etat = 1;
  updateGrid();
};
var testStillLife2 = function() {
  resizeGrid(5, 5);
  resetGrid();
  cells[1][2].etat = 1;
  cells[3][2].etat = 1;
  cells[2][1].etat = 1;
  cells[2][3].etat = 1;
  updateGrid();
};
