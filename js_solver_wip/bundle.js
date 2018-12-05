require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"Board":[function(require,module,exports){
const Cell = require("./cell.js");

class Board {
  constructor(boardString) {

    let boardArray = boardString.split("");

    this.cells = boardArray.map((cellValue, cellPosition) => {
      let cellRow = this.determineRow(cellPosition);
      let cellColumn = this.determineColumn(cellPosition);
      let cellGrid = this.determineGrid(cellPosition);
      return new Cell(cellRow, cellColumn, cellGrid, cellValue);
    });

    this.logicOptions = {
      checkRepeatingOption: false,
      row: false,
      column: false,
      grid: false
    };

  };

  determineRow(cellPosition) {
    return Math.floor(cellPosition / 9);
  };

  determineColumn(cellPosition) {
    return Math.floor(cellPosition % 9);
  };

  determineGrid(cellPosition) {
    return Math.floor(this.determineRow(cellPosition) / 3) * 3 + Math.floor(this.determineColumn(cellPosition) / 3);
  };

  cellArrayFromParameter(parameter, value) {
    return this.cells.filter(cell => {
      return cell[parameter] === value;
    });
  };

  makeKnownArray(cellArray) {
    return cellArray.reduce((knownArray, cell) => {
      if (cell.values.length === 1) knownArray.push(cell.values[0]);
      return knownArray;
    }, [])
  };

  subtractKnowns(knownArray, cell) {
    return cell.values.filter(value => {
      return knownArray.indexOf(value) < 0;
    });
  };

  subtractParameterKnowns(cellArray, valueCountBefore = null) {
    if (!valueCountBefore) valueCountBefore = this.countValues(cellArray);
    let knownArray = this.makeKnownArray(cellArray);    
    cellArray.forEach(cell => {
      if (cell.values.length > 1) {
        cell.values = this.subtractKnowns(knownArray, cell);
      };
    });
    let valueCountAfter = this.countValues(cellArray);
    if (valueCountAfter !== valueCountBefore) {
      return this.subtractParameterKnowns(cellArray, valueCountAfter);
    } else {
      return;
    }
  };

  subtractAllParameterKnowns(parameter) {
    for (var paramNumber = 0; paramNumber < 9; paramNumber++) {
      if (this.logicOptions[parameter]) {
        let preSubtractCells = this.cellArrayFromParameter(parameter, paramNumber);
        this.subtractParameterKnowns(preSubtractCells);
      }
      if (this.logicOptions.checkRepeatingOption) {
        let updatedParamArray = this.cellArrayFromParameter(parameter, paramNumber);
        this.checkForRepeatingValues(updatedParamArray);
      }
    }
  }

  checkForRepeatingValues(cellArray) {
    let checkedValues = [];
    let unsolvedCells = this.createUnsolvedCellsArray(cellArray);
    unsolvedCells.forEach((cell, cellIndex) => {
      cell.values.forEach(value => {
        if (checkedValues.indexOf(value) < 0) {
          checkedValues.push(value);
          if (!this.checkRepeatedValue(unsolvedCells, cellIndex, value)) {
            cell.values = [value];
          }
        }
      });
    });
    return cellArray;
  }

  checkRepeatedValue(unsolvedCells, checkIndex, checkValue) {
    return unsolvedCells.some((cell, cellIndex) => {
      let foundValueCheck;
      if (cellIndex !== checkIndex) {
        foundValueCheck = cell.values.some(value => {
          return value === checkValue;
        });
      }; 
      return foundValueCheck;
    });
  }

  createUnsolvedCellsArray(cellArray) {
    return cellArray.reduce((unsolvedCells, cell) => {
      if (cell.values.length > 1) unsolvedCells.push(cell);
      return unsolvedCells;
    }, []);
  };

  subtractAllKnowns() {
    ['row', 'column', 'grid'].forEach(parameter => {
      this.subtractAllParameterKnowns(parameter);
    });
  }

  checkSolved() {
    return this.cells.every((cell) => {
      return cell.values.length == 1;
    });
  };

  solveBoard(startingValues = null) {
    if (!startingValues) startingValues = this.countValues(this.cells);
    this.subtractAllKnowns();
    let endingValues = this.countValues(this.cells);
    if (!this.checkSolved()) {
      if (startingValues !== endingValues) {
        return this.solveBoard(endingValues);
      } else {
        return false;
      }
    } 
    return true;
  };

  printBoardString() {
    let filterCellValues = function(cell) {
      if (cell.values.length === 1) {
        return cell.values[0];
      }
      return "-";
    }
    return this.cells.map(filterCellValues).join('');
  }

  countValues(cellArray) {
    return cellArray.reduce((count, cell) => {
      return count += cell.values.length;
    }, 0);
  }

};

module.exports = Board;

// browserify -r ./models/board.js:Board > bundle.js

/* 
Puzzles: 
Solved:
1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--
--5-3--819-285--6-6----4-5---74-283-34976---5--83--49-15--87--2-9----6---26-495-3
29-5----77-----4----4738-129-2--3-648---5--7-5---672--3-9--4--5----8-7---87--51-9
-8--2-----4-5--32--2-3-9-466---9---4---64-5-1134-5-7--36---4--24-723-6-----7--45-
6-873----2-----46-----6482--8---57-19--618--4-31----8-86-2---39-5----1--1--4562--
---6891--8------2915------84-3----5-2----5----9-24-8-1-847--91-5------6--6-41----
-3-5--8-45-42---1---8--9---79-8-61-3-----54---5------78-----7-2---7-46--61-3--5--
-96-4---11---6---45-481-39---795--43-3--8----4-5-23-18-1-63--59-59-7-83---359---7
----754----------8-8-19----3----1-6--------34----6817-2-4---6-39------2-53-2-----
3---------5-7-3--8----28-7-7------43-----------39-41-54--3--8--1---4----968---2--

Unsolved: 
3-26-9--55--73----------9-----94----------1-9----57-6---85----6--------3-19-82-4-
-2-5----48-5--------48-9-2------5-73-9-----6-25-9------3-6-18--------4-71----4-9-
--7--8------2---6-65--79----7----3-5-83---67-2-1----8----71--38-2---5------4--2--
----------2-65-------18--4--9----6-4-3---57-------------------73------9----------
---------------------------------------------------------------------------------
*/
},{"./cell.js":1}],1:[function(require,module,exports){
class Cell {
	constructor(row, column, grid, value) {
		this.row = row;
		this.column = column;
		this.grid = grid;
		this.values = this.checkValue(value);
	};

	checkValue(value) {
		if (value === "-") {
			return [1, 2, 3, 4, 5, 6, 7, 8, 9];
		};
		return [parseInt(value)];
	};
};

module.exports = Cell;
},{}]},{},[]);
