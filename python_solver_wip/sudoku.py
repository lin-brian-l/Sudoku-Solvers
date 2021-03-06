# board_string = "1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--"
# board_string = "--5-3--819-285--6-6----4-5---74-283-34976---5--83--49-15--87--2-9----6---26-495-3"
# board_string = "29-5----77-----4----4738-129-2--3-648---5--7-5---672--3-9--4--5----8-7---87--51-9"
# board_string = "-8--2-----4-5--32--2-3-9-466---9---4---64-5-1134-5-7--36---4--24-723-6-----7--45-"
# board_string = "6-873----2-----46-----6482--8---57-19--618--4-31----8-86-2---39-5----1--1--4562--"
# board_string = "---6891--8------2915------84-3----5-2----5----9-24-8-1-847--91-5------6--6-41----"
# board_string = "-3-5--8-45-42---1---8--9---79-8-61-3-----54---5------78-----7-2---7-46--61-3--5--"
# board_string = "-96-4---11---6---45-481-39---795--43-3--8----4-5-23-18-1-63--59-59-7-83---359---7"
# board_string = "----754----------8-8-19----3----1-6--------34----6817-2-4---6-39------2-53-2-----"
# board_string = "3---------5-7-3--8----28-7-7------43-----------39-41-54--3--8--1---4----968---2--"
# board_string = "3-26-9--55--73----------9-----94----------1-9----57-6---85----6--------3-19-82-4-"
board_string = "-2-5----48-5--------48-9-2------5-73-9-----6-25-9------3-6-18--------4-71----4-9-"
# board_string = "--7--8------2---6-65--79----7----3-5-83---67-2-1----8----71--38-2---5------4--2--" ####
# board_string = "----------2-65-------18--4--9----6-4-3---57-------------------73------9----------" ####
# board_string = "---------------------------------------------------------------------------------" ####

import copy

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
    def __init__(self, cells, dupe = None):
        self.cells = cells
        self.dupe = dupe

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

    # Subtract all knowns from poss for a cell
    def remove_all_knowns(self, cell):
        self.remove_knowns_from_poss_col(cell.col)
        self.remove_knowns_from_poss_grid(cell.grid)
        self.remove_knowns_from_poss_row(cell.row)

    # Cycle through cells and remove all knowns from all poss
    def check_all_cells(self):
        for i in range(0, len(self.cells)):
            self.remove_all_knowns(self.cells[i])

    # Check whether board is solved
    def is_solved(self):
        for i in range(0, len(self.cells)):
            if len(self.cells[i].poss) != 1:
                return False
        return True

    # Cycle through cells until solved
    def solve(self):
        initial_count = None
        final_count = False
        # print "before the board reaches stuck tests: ", self.display_board()
        while self.is_stuck(final_count, initial_count) == False:
            initial_count = self.poss_total()
            self.check_all_cells()
            final_count = self.poss_total()
            # print("Trying logic to see if it's stuck")
            # print(self.is_stuck(final_count, initial_count))
        # print "after the board gets stuck: ", self.display_board()
        if self.is_solved() == True:
            self.display_board()
            return True
        # print "Broken?", self.is_broken()
        # print "This is the broken board: ", self.display_board()
        if self.is_broken():
            # print("Am I here?")
            return False
        # print "this is the self:               ", self.display_board()
        dupe = copy.deepcopy(self)
        # print "this is the dupe after copying: ", dupe.display_board()
        self.dupe = dupe
        # print "this is the dupe after cloning: ", self.dupe.display_board()
        self.dupe.sub_first_value(self.dupe.first_unsolved())
        # print "this is the self after editing:       ", self.display_board()
        # print "this is the dupe after editing:       ", self.dupe.display_board()
        need_to_sub = self.dupe.solve()
        # print("Am I being hit?")
        # print(need_to_sub)
        if need_to_sub == False or need_to_sub == None:
            # print("i should be getting run since the board is broken")
            # print "self looks like this: ", self.display_board()
            self.remove_first_value(self.first_unsolved())
            # print "self after removing the first value: ", self.display_board()
            dupe = copy.deepcopy(self)
            self.dupe = dupe
            # print "self.dupe after assign :             ", self.dupe.display_board()
            self.dupe.solve()
        # else:
            # self.display_board()
    def get_solved_board(self):
        while self.is_solved() == False:
            self.solve()
        self.display_board()

    # Get total number of possible values
    def poss_total(self):
        total = 0
        for i in range(0, len(self.cells)):
            total += len(self.cells[i].poss)
        return total

    # Check if stuck based on total number of possible values
    def is_stuck(self, final, initial):
        if final == initial:
            return True
        return False

    # Find first unsovled cell
    def first_unsolved(self):
        for i in range(0, len(self.cells)):
            if len(self.cells[i].poss) > 1:
                return self.cells[i]

    # Substitute first value for unsolved cell
    def sub_first_value(self, cell):
        cell.poss = [cell.poss[0]]

    # Check whether puzzle is broken
    def is_broken(self):
        for i in range(0, len(self.cells)):
            if len(self.cells[i].poss) == 0:
                return True
        return False

    # Removes first value for unsolved cell
    def remove_first_value(self, cell):
        del cell.poss[0]

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
            row_list.append(cells[i].poss)
            # if len(cells[i].poss) == 1:
            #     row_list.append(cells[i].poss[0])
            # else:
            #     row_list.append("-")
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

# print(board)
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
# board.display_board()
# board.display_board()
# board.check_all_cells()
# board.display_board()
# board.check_all_cells()
# board.display_board()
# board.check_all_cells()
# board.display_board()
# print(board.cells[1].poss)
# print(board.cells[7].poss)
# print(board.cells[8].poss)
# board.solve()
# print(board.first_unsolved().poss)
# print(board.sub_first_value(board.first_unsolved()).poss)
board.get_solved_board()