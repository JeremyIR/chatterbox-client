// YOUR CODE HERE:

var app = {
  friends: [],
  server: 'https://api.parse.com/1/classes/messages'
};

app.addFriend = function(friend) {
  app.friends.push(friend);
};

app.init = function() {
  console.log('initialized');
  // $('#send .submit').trigger('submit');
  $('#send').on('submit', app.handleSubmit.bind(this)); 
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.addMessage = function(message) {
  var $messageBox = $('<div></div>');
  var $username = $('<span class = "username">' + message.username + '</span>')
    .on('click', function(event) {
      app.addFriend();
    });

  var $text = $('<span class = "message">' + message.text + '</span>');
  var $roomname = $('<span class = "roomname">' + message.roomname + '</span>');
  $messageBox.append([$username, $text, $roomname]);
  $('#chats').append($messageBox);
};

app.handleSubmit = function() {

};



app.addRoom = function(roomName) {
  $('#roomSelect').append('<a>' + roomName + '</a>');
};

// function escape() {};
// do ^^ this to vvv that
// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };