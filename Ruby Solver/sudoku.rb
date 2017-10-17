# Takes a board as a string in the format
# you see in the puzzle file. Returns
# something representing a board after
# your solver has tried to solve it.
# How you represent your board is up to you!
def convert(board_string)
  board = []
  board_array = board_string.chars
  9.times do
    board << board_array.slice!(0..8)
  end
  board
end

def set_possible_values(board)
  board.each do |set|
    set.map! do |values|
      if values == "-"
        values = (1..9).to_a
      else
        knowns = []
        knowns << values.to_i
      end
    end
  end
end

# Returns a boolean indicating whether
# or not the provided board is solved.
# The input board will be in whatever
# form `solve` returns.

def solve(board)
  sudoku_board = convert(board)
  sudoku_board = set_possible_values(sudoku_board)
  until solved?(sudoku_board)
    sudoku_board = logic_guess_loop(sudoku_board)
    solved?(sudoku_board)
  end
  sudoku_board
end

def sub_1_guess_throughout(puzzle)
  do_once = false
  puzzle.each do |row|
    if !do_once
      initial_length = count_length(row)
      row = sub_guess(row)
      final_length = count_length(row)
      do_once = true if find_answer?(final_length, initial_length)
    else
      row = row
    end
  end
end

def sub_guess(row)
  do_once = false
  row.map! do |value|
    if value.length > 1 && !do_once
      do_once = true
      guess = []
      guess << value[0]
      value = guess
    else
      value = value
    end
  end
end

def elim_1_guess_throughout(puzzle)
  do_once = false
  puzzle.each do |row|
    if !do_once
      initial_length = count_length(row)
      row = elim_guesses(row)
      final_length = count_length(row)
      do_once = true if find_answer?(final_length, initial_length)
    else
      value = value
    end
  end
  puzzle
end

def elim_guesses(row)
  do_once = false
  row.map! do |value|
    if value.length > 1 && !do_once
      do_once = true
      value.delete_at(0)
      value = value
    else
      value = value
    end
  end
  row
end

def logic_guess_loop(puzzle)
  return puzzle if solved?(puzzle)

  final_length = nil
  initial_length = false

  until !find_answer?(final_length, initial_length)
    initial_length = count_all_length(puzzle)
    puzzle = logic_tests(puzzle)
    final_length = count_all_length(puzzle)
    find_answer?(final_length, initial_length)
  end

  puzzle = elim_1_guess_throughout(puzzle) if all_check_empty?(puzzle)
  puzzle = sub_1_guess_throughout(puzzle)

  logic_guess_loop(puzzle)
end

def logic_tests(puzzle)
  puzzle = check_row(puzzle)
  puzzle = check_column(puzzle)
  puzzle = check_row(create_large_grid(puzzle))
  puzzle = create_large_grid(puzzle)
  puzzle = check_chunks(puzzle)
  puzzle = check_column_chunks(puzzle)
  puzzle = check_grid_chunks(puzzle)
  puzzle = check_only_all(puzzle)
end

def solved?(array)
  array.all? { |row| row.all? { |value| value.length == 1 } }
end

def create_temp_array(array)
  temp_array = []
  array.each do |value|
    if value.length == 1
      temp_array << value[0]
    end
  end
  temp_array
end

def delete_knowns(array, temp)
  array.map! do |value|
    if value.length > 1
      value -= temp
    else
      value
    end
  end
end

def transpose_board(array)
  temp = array.transpose
  temp.each { |cell| create_temp_array }
end

def check_row(array)
  array.map! do |rows|
    temp = create_temp_array(rows)
    delete_knowns(rows, temp)
  end
end

def create_large_grid(array)
  array_1 = break_up_array(array, 0, 2)
  grid_1 = create_grid(array_1)
  array_2 = break_up_array(array, 3, 5)
  grid_2 = create_grid(array_2)
  array_3 = break_up_array(array, 6, 8)
  grid_3 = create_grid(array_3)
  large_grid = grid_1 + grid_2 + grid_3
end

def break_up_array(array, low, high)
  grid = array[low..high]
end

def check_column(array)
  column = array.transpose
  check_row(column)
  array = column.transpose
end

def create_grid(array)
  grid = Array.new(3) {[]}
  array.each do |row|
    row.each_with_index do |value, index_value|
      grid[(index_value / 3)] << value
    end
  end
  grid
end

def check_chunks(puzzle)
  puzzle.map! do |row|
    chunks = create_chunks(row)
    chunk_location = create_temp_chunks(chunks)
    row = delete_chunks(row, chunk_location)
    chunks = find_chunks(row)
    row = delete_found_chunks(row, chunks)
  end
end

def check_column_chunks(puzzle)
  column = puzzle.transpose
  # puts "The puzzle looks like this when transposed: \n #{column}"
  column = check_chunks(column)
  puzzle = column.transpose
end

def check_grid_chunks(puzzle)
  puzzle = create_large_grid(puzzle)
  puzzle = check_chunks(puzzle)
  puzzle = create_large_grid(puzzle)
end

def find_chunks(array)
  chunk = []
  chunk << array.detect{|value| array.count(value) == value.length && value.length > 1 }
end

def create_chunks(array)
  number_tracker = Array.new(9) {[]}
  array.each_with_index do |value, value_index|
    value.each do |poss_value|
      number_tracker[poss_value - 1] << value_index
    end
  end
  number_tracker
end

def only_spot_check(row, number_tracker)
  number_tracker.each do |location|
    if location.length == 1
      row[location[0]] = [number_tracker.index(location) + 1]
    end
  end
  row
end

def check_only_row(array)
  array.map! do |rows|
    locations = create_chunks(rows)
    only_spot_check(rows, locations)
  end
end

def check_only_column(array)
  columns = array.transpose
  columns = check_only_row(columns)
  array = columns.transpose
end

def check_only_grid(array)
  array = create_large_grid(array)
  array = check_only_row(array)
  array = create_large_grid(array)
end

def check_only_all(array)
  array = check_only_row(array)
  array = check_only_column(array)
  array = check_only_grid(array)
end

def create_temp_chunks(array)
  dup_array = array.dup
  temp_array = []
  array.each do |num_locations|
    locations = num_locations.length
    if locations > 1
      location_matches = array.find_all {|poss_locations| poss_locations == num_locations }
    end
    if location_matches != nil && location_matches.length == locations
      temp_array << dup_array.each_index.select{ |index| dup_array[index] == num_locations}
    end
  end
  temp_array.uniq!.each {|chunk| chunk.map!{|values| values += 1 }  } if temp_array if !temp_array.empty?
end

def delete_found_chunks(array, temp_array)
  return array if temp_array == nil
  temp_array.each do |chunk|
    return array if chunk == nil
    array.map! do |values|
      if values.length == 1 || values == chunk
        values = values
      elsif (values - chunk).length != values.length
        values -= chunk
      else
        values = values
      end
    end
  end
  array
end

def delete_chunks(array, temp_array)
  return array if temp_array == nil
  temp_array.each do |chunk|
    return array if chunk == nil
    array.map! do |values|
      if values.length == 1 || values == chunk
        values = values
      elsif (values - chunk).length != values.length
        values = chunk
      else
        values = values
      end
    end
  end
  array
end

def check_empty?(array)
  array.any? {|element| element.empty? }
end

def find_answer?(final, initial)
  final == initial ? false : true
end

def count_length(row)
  count = 0
  row.each { |value| count += value.length }
  count
end

def count_all_length(puzzle)
  count = 0
  puzzle.each { |row| count += count_length(row) }
  count
end

def all_check_empty?(puzzle)
  puzzle.any? {|row| check_empty?(row) }
end

def solved?(array)
  array.all? { |row| row.all? { |value| value.length == 1 } }
end

# Takes in a board in some form and
# returns a _String_ that's well formatted
# for output to the screen. No `puts` here!
# The input board will be in whatever
# form `solve` returns.
def pretty_board(board)
  board_string = ""
  board.each { |row| board_string += row.join("  ") + "\n" }
  board_string
end

# SOLVED puzzle6 ---6891--8------2915------84-3----5-2----5----9-24-8-1-847--91-5------6--6-41----
# SOLVED puzzle7 -3-5--8-45-42---1---8--9---79-8-61-3-----54---5------78-----7-2---7-46--61-3--5--
# SOLVED puzzle8 -96-4---11---6---45-481-39---795--43-3--8----4-5-23-18-1-63--59-59-7-83---359---7
# SOLVED puzzle9 ----754----------8-8-19----3----1-6--------34----6817-2-4---6-39------2-53-2-----
# SOLVED puzzle10 3---------5-7-3--8----28-7-7------43-----------39-41-54--3--8--1---4----968---2--


# puzzle11 3-26-9--55--73----------9-----94----------1-9----57-6---85----6--------3-19-82-4-
# -2-5----48-5--------48-9-2------5-73-9-----6-25-9------3-6-18--------4-71----4-9-
# --7--8------2---6-65--79----7----3-5-83---67-2-1----8----71--38-2---5------4--2--
# ----------2-65-------18--4--9----6-4-3---57-------------------73------9----------
# ---------------------------------------------------------------------------------

# array = [
#   [[2], [3], [2, 3, 4]],
#   [[2, 3, 5, 6],[1]]
# ]


# p all_check_empty?(array)
# p count_all_length(array)
# p sub_guess(array)
# p array
# p sub_guess(array)
# p sub_1_guess_throughout(array)
# p elim_1_guess_throughout(array, true)
# p elim_1_guess_throughout(array, true)
# p elim_1_guess_throughout(array, true)
# p elim_1_guess_throughout(array, true)
# p elim_1_guess_throughout(array, true)
# p elim_1_guess_throughout(array, true)

# p all_check_empty?(array)
# p array = elim_guesses(array, false)
# p array = elim_guesses(array, false)
# p array = elim_guesses(array, false)
# p array = elim_guesses(array, false)
