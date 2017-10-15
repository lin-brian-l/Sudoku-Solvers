board_string = "1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--"

def subtract_lists(a, b):
    for x in b:
        if x in a:
            a.remove(x)

# Cell class with row, column, grid, and possible values
class Cell(object):
    # Initializer (aka constructor)
    def __init__(self, row, col, grid, poss):
        self.row = row
        self.col = col
        self.grid = grid
        if poss == "-":
            self.poss = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        else:
            self.poss = [int(poss)]

# Board class with many cells
class Board(object):
    def __init__(self, cells):
        self.cells = cells
        self.cells = cells

    # Find all cells in the same row
    def cells_in_row(self, row):
        same_row = []
        for i in range(0, len(self.cells)):
            if self.cells[i].row == row:
                same_row.append(self.cells[i])
        return same_row

    # Find all cells in the same column
    def cells_in_col(self, col):
        same_col = []
        for i in range(0, len(self.cells)):
            if self.cells[i].col == col:
                same_col.append(self.cells[i])
        return same_col

    # Find all cells in the same grid
    def cells_in_grid(self, grid):
        same_grid = []
        for i in range(0, len(self.cells)):
            if self.cells[i].grid == grid:
                same_grid.append(self.cells[i])
        return same_grid

    # Find all known values in the same parameter
    def knowns(self, cells):
        knowns = []
        for i in range(0, len(cells)):
            if len(cells[i].poss) == 1:
                knowns.append(cells[i].poss[0])
        return knowns

    # Subtract row_knowns from poss for cells_in_row
    def remove_knowns_from_poss_row(self, row):
        cells = self.cells_in_row(row)
        knowns = self.knowns(cells)
        for i in range(0, len(cells)):
            if len(cells[i].poss) > 1:
                subtract_lists(cells[i].poss, knowns)

    # Subtract col_knowns from poss for cells_in_col
    def remove_knowns_from_poss_col(self, col):
        cells = self.cells_in_col(col)
        knowns = self.knowns(cells)
        for i in range(0, len(cells)):
            if len(cells[i].poss) > 1:
                subtract_lists(cells[i].poss, knowns)

    # Subtract grid_knowns from poss for cells_in_grid
    def remove_knowns_from_poss_grid(self, grid):
        cells = self.cells_in_grid(grid)
        knowns = self.knowns(cells)
        for i in range(0, len(cells)):
            if len(cells[i].poss) > 1:
                subtract_lists(cells[i].poss, knowns)

    # Subtract all knowns for a cell
    def remove_all_knowns(self, cell):
        self.remove_knowns_from_poss_col(cell.col)
        self.remove_knowns_from_poss_grid(cell.grid)
        self.remove_knowns_from_poss_row(cell.row)

    # Print entire board
    def display_board(self):
        print(self.create_board_list())

    # Create board list with all rows
    def create_board_list(self):
        board = []
        for i in range(0, 9):
            board.append(self.create_row_list(i))
        return board

    # Create row list with cells in that row
    def create_row_list(self, row):
        row_list = []
        cells = self.cells_in_row(row)
        for i in range(0, len(cells)):
            if len(cells[i].poss) == 1:
                row_list.append(cells[i].poss[0])
            else:
                row_list.append("-")
        return row_list

# Method to find cell's row based on index
def find_row(index):
    return index // 9

# Method to find cell's column based on index
def find_col(index):
    return index % 9

# Method to find cell's grid based on index
def find_grid(index):
    # Grid hash (dictionary in python) with row and column coordinates as keys for grid value
    grid_dictionary = {
        (0, 0): 0,
        (0, 1): 1,
        (0, 2): 2,
        (1, 0): 3,
        (1, 1): 4,
        (1, 2): 5,
        (2, 0): 6,
        (2, 1): 7,
        (2, 2): 8
    }
    row_coord = find_row(index) // 3
    col_coord = find_col(index) // 3
    return grid_dictionary[(row_coord, col_coord)]

# Declaring 81 cell objects
cells = []
for i in range(0,len(board_string)):
    cell = Cell(find_row(i), find_col(i), find_grid(i), board_string[i])
    cells.append(cell)

board = Board(cells)

print(board)
# print(len(board.cells))
# print(board.cells[4].poss)
# # board.remove_knowns_from_poss_col(4)
# # # print(board.knowns(board.cells_in_col(4)))
# # # print(board.cells[4].poss)
# # # print(board.knowns(board.cells_in_row(0)))
# # board.remove_knowns_from_poss_row(0)
# # # print(board.cells[4].poss)
# # # print(board.knowns(board.cells_in_grid(1)))
# # board.remove_knowns_from_poss_grid(1)
# board.remove_all_knowns(board.cells[4])
# print(board.cells[4].poss)
board.display_board()





