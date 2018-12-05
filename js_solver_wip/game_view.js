var coordinates;

function currentPlayerColor(player) {
  if (player === "X") {
    return "red"
  } else if (player === "O") {
    return "blue"
  }
}

function renderMove(spaceIndex, player) {
  $(".turn").eq(spaceIndex).html(player)
  $(".turn").eq(spaceIndex).css("background-color", currentPlayerColor(player))
}

function colorWin(coordinates) {
  coordinates.forEach(function(element) {
    $(".turn").eq(element).css("background-color", "green");
  });
}

function renderRowWin(game) {
  game.board.forEach(function(row) {
    if (game.checkRow(row)) {
      spaceIndex = game.board.indexOf(row) * 3
      colorWin([spaceIndex, spaceIndex + 1, spaceIndex + 2])
    }
  });
}

function renderColumnWin(game) {
  var transposedBoard = game.transposeBoard();
  transposedBoard.forEach(function(column) {
    if (game.checkRow(column)) {
      spaceIndex = transposedBoard.indexOf(column)
      colorWin([spaceIndex, spaceIndex + 3, spaceIndex + 6])
    }
  });
}

function renderDiagonalWin(game) {
  if (game.checkUpLeft()) {
    coordinates = [0, 4, 8]
  } else if (game.checkDownLeft()) {
    coordinates = [2, 4, 6]
  }
  colorWin(coordinates);
}

function renderWin(game) {
  if (game.diagonalWin()) {
    renderDiagonalWin(game);
  } else if (game.rowWin()) {
    renderRowWin(game);
  } else if (game.columnWin()) {
    renderColumnWin(game);
  };
  $(".replay").toggle();
};

function resetBoard(game) {
  $(".turn").empty();
  $(".turn").css("background-color", "white");
  $(".replay").toggle();
}
