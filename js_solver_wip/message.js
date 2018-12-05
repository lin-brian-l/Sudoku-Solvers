function Message(messageType, player) {
  this.player = player;
  this.message = this.setMessage(messageType);
};

Message.prototype.setMessage = function(messageType) {
  if (messageType === "turn") {
    return "It's Player " + this.player + "'s turn.";
  } else if (messageType === "win") {
    return "Player " + this.player + " wins!";
  } else if (messageType === "draw") {
    return "It's a draw!";
  } else if (messageType === "invalidMove") {
    return "That space is already taken. Try again!";
  };
};

Message.prototype.update = function(messageType, player) {
  this.player = player
  this.message = this.setMessage(messageType)
}


