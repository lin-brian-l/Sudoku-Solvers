function renderMessage(message, messageType, player) {
  message.update(messageType, player);
  $(".notice").html(message.message);
}
