function Game() {
	this.board = [[null, null, null], [null, null, null], [null, null, null]]
	this.player1 = "X"
	this.player2 = "O"
	this.turnCount = 1
}

Game.prototype.currentPlayer = function() {
	if (this.turnCount % 2 === 1) {
		return this.player1
	} else {
		return this.player2
	}
}

Game.prototype.placeMove = function(spaceIndex) {
	var rowNum = Math.floor(spaceIndex / 3);
	var columnNum = Math.floor(spaceIndex % 3);
	this.board[rowNum][columnNum] = this.currentPlayer();
}

Game.prototype.validMove = function(spaceIndex) {
	var rowNum = Math.floor(spaceIndex / 3);
	var columnNum = Math.floor(spaceIndex % 3);
	return !this.board[rowNum][columnNum]
}

Game.prototype.rowWin = function() {
	var that = this;
	return that.board.some(function(row) {
		return that.checkRow(row) === true
	});
}

Game.prototype.columnWin = function() {
	var that = this;
	var transposedBoard = that.transposeBoard();
	return transposedBoard.some(function(row) {
		return that.checkRow(row) === true
	});
}

Game.prototype.diagonalWin = function() {
	if (this.checkUpLeft()) {
		return true;
	} else if (this.checkDownLeft()) {
		return true;
	} else {
		return false;
	}
}

Game.prototype.boardWin = function() {
	return this.diagonalWin() || this.columnWin() || this.rowWin();
}

Game.prototype.remainingMoves = function() {
	var flatBoard = this.board.reduce(function(a, b) {
		return a.concat(b);
	});
	return flatBoard.some(function(element) {
		return element === null;
	});
}

Game.prototype.over = function() {
	return this.boardWin() || !this.remainingMoves();
}

Game.prototype.reset = function() {
	this.board = [[null, null, null], [null, null, null], [null, null, null]]
	this.turnCount = 1
}

Game.prototype.checkUpLeft = function() {
	return (this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) && !!this.board[0][0]
}

Game.prototype.checkDownLeft = function() {
	return (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) && !!this.board[0][2]
}

Game.prototype.checkRow = function(array) {
	return (array[0] === array[1] && array[0] === array[2]) && !!array[0]
}

Game.prototype.status = function(spaceIndex) {
	if (this.validMove(spaceIndex)) {
		this.placeMove(spaceIndex)
		if (this.boardWin()) {
			return "win"
		} else if (this.remainingMoves()) {
			return "continue"
		} else {
			return "draw"
		}
	} else {
		return "invalid"
	}
}

Game.prototype.transposeBoard = function() {
	var that = this
	var transposedBoard = that.board[0].map(function(col, i) {
    var newRow = that.board.map(function(row) {
      return row[i]
    })
    return newRow
  })
  return transposedBoard;
}
