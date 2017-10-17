import copy

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

cell = Cell(1, 1, 1, "-")
print(cell)
dupe = copy.copy(cell)
dupe.row = 4
print(cell.row)