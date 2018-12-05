
$(document).ready(() => {
	createBoard();
	var currentBoardCount = 0;
	var previousBoardCount = 0;

	console.log('CBC ready: ' + currentBoardCount);

	$('input').keypress(validateInput);

	$('#solve-button').click(() => {
		initiateSolveBoard(currentBoardCount, previousBoardCount);
	});

	$('#input-button').click(() => {
		console.log('CBC before function: ' + currentBoardCount);
		initiateFillBoard(currentBoardCount);
	});
})

let validateInput = (event) => {
	let targetClass = $(event.target).attr('class');
	let regexTest = targetClass === 'cell-input' ? /[1-9]/ : /[0-9]|[-]|[ ]/;
	let text = String.fromCharCode(event.which);
	return regexTest.test(text);	
}

let createBoard = () => {
	for (var cell = 0; cell < 81; cell++) {
		let divClass = 'cell';
		if (rightBoldedCheck(cell)) divClass += ' right-bold';
		if (bottomBoldedCheck(cell)) divClass += ' bottom-bold';
		let inputElement = `<input class='cell-input' type='text' name='input${cell}' maxlength='1'>`;
		let divElement = `<div id='${cell}' class='${divClass}'>${inputElement}</div>`;
		$(".board").append(divElement);	
	}
}

let rightBoldedCheck = (cell) => {
	return (cell + 1) % 3 === 0 && (cell + 1) % 9 !== 0;
}

let bottomBoldedCheck = (cell) => {
	return Math.ceil((cell + 1) / 9 ) % 3 === 0 && Math.ceil((cell + 1) / 9 ) < 9;
}

let initiateSolveBoard = (currentBoardCount, previousBoardCount) => {
	console.log("currentBoardCount: " + currentBoardCount + "  previousBoardCount: " + previousBoardCount);
	let boardString = createBoardString();
	let board = new Board(boardString);
	setLogicOptions(board);
	board.solveBoard();
	let solvedBoard = board.printBoardString();
	fillBoard(solvedBoard);
}

let setLogicOptions = (board) => {
	$('.checkbox').each((index, checkbox) => {
		let checked = $(checkbox).prop('checked');
		let option = $(checkbox).attr('value');
		board.logicOptions[option] = checked;
	});
}

let createBoardString = () => {
	let boardString = "";
	$('.cell-input').each((index, input) => {
		boardString += $(input).val() || "-";
	});
	return boardString;
}

let initiateFillBoard = (currentBoardCount) => {
	let boardString = $('.board-input').val();
	fillBoard(boardString);
	currentBoardCount += 1;
	console.dir(currentBoardCount);
	console.log("CBC in initiateFillBoard: " + currentBoardCount);
}

let fillBoard = (solvedBoard) => {
	$('.cell-input').each((index, input) => {
		let inputValue = /[1-9]/.test(solvedBoard[index]) ? solvedBoard[index] : "";
		$(input).val(inputValue);
	});
}
