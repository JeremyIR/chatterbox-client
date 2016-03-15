// YOUR CODE HERE:

var app = {
  friends: [],
  server: 'https://api.parse.com/1/classes/messages',
  currentRoom: 'lobby',
  chatRooms: []
};

app.addFriend = function(friend) {
  app.friends.push(friend);
};

app.init = function() {
  console.log('initialized');
  $('#send').on('submit', function(event) {
    event.preventDefault();
    app.handleSubmit.call(this, event);
  }); 
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
  }).then(function() {
    app.fetch();
  });
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    // data: JSON.stringify(message), // ? is this right?
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Messages recieved', data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to recieve messages', data);
    }
  }).then(function(data) {
    
    app.clearMessages();
    
    $.each(data.results, function(index, item) {
      var msg = item.text;
      var usr = item.username;
      var rmn = item.roomname;
      var messageObject = {text: msg, username: usr, roomname: rmn};



      // if(JSON.stringify(rmn) + "%20") { 
      //   app.chatRooms.push(JSON.stringify(rmn)); 
      // }
      app.addRoom(JSON.stringify(rmn));
      if (JSON.stringify(rmn) && msg && usr && rmn === app.currentRoom) { 
        app.addMessage(messageObject);
      }
    });
  });
  // console.log(jqxhr);
};


app.changeRoom = function() {
  // $(document);
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.addMessage = function(message) {
  var $messageBox = $('<div class="chat"></div>');
  var $username = $('<div class = "username"></div>').text(message.username)
    .on('click', function(event) {
      app.addFriend();
    });

  var $text = $('<span class = "message"></span>').text(message.text);
  var $roomname = $('<span class = "roomname"></span>').text(message.roomname);
  $messageBox.append([$username, $text, $roomname]);
  console.log($messageBox.text());
  $('#chats').append($messageBox);
};

app.handleSubmit = function(event) {
  // app.send(message);
  var messageObject = {
    username: document.location.search.split('=')[1],
    text: event.target[0].value,
    roomname: 'lobby'
  };
  app.send(messageObject);
  console.log("SUBMIT HANDLED", event.target[0].value, document.location.search.split("=")[1]);
};



app.addRoom = function(roomName) {
  $('#roomSelect').append('<option></option>').text(roomName);
};

$(document).ready(function(){
  app.init();
});
