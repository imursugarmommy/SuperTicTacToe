Super TicTacToe

This is a more complex way of playing TicTacToe.
The original 9x9 grid is still in place, but now there are 9x9 grids in each one of those fields.
So, 1st player chooses a field to play in, where he'll put his player symbol in any of its containing 9x9 grid. The index of the field played within the smaller grid is saved and used to detect where player 2 will have to play in the big grid.

e.g. player 1 chooses to play in the bottom left corner of the big 9x9, where he'll place his symbol (X) in the top left corner.
Now player 2 has to play in the top left corner of the big grid. If he'll choose to place his symbol (O) in the middle middle now, player 1 has to place his symbol (X) somewhere within the middle middle field of the big grid.

The goal is obvious to get 3 in a row in one of those smaller grids. If you do win one, you win the field in the big grid. And if you won 3 in a row on the big grid, you win and get a point.
