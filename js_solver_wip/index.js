$(document).ready(function() {
  var game = new Game();
  var message = new Message("turn", game.currentPlayer())
  $(".notice").html(message.message);

  $("li").on("click", function(event) {
    if (!game.over()) {
      var spaceIndex = parseInt($(this).attr("id"));
      var status = game.status(spaceIndex);
      if (status != "invalid") {
        renderMove(spaceIndex, game.currentPlayer());
        if (status === "win") {
          renderMessage(message, "win", game.currentPlayer())
          renderWin(game);
        } else if (status === "continue") {
          game.turnCount += 1
          renderMessage(message, "turn", game.currentPlayer());
        } else if (status === "draw") {
          renderMessage(message, "draw", null);
          $(".replay").toggle();
        }
      } else {
        renderMessage(message, "invalidMove", null);
      }
    }
  });

  $(".replay").on("click", function(event) {
    game.reset()
    resetBoard(game);
    renderMessage(message, "turn", game.currentPlayer())
  });

});
