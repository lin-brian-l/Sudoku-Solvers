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