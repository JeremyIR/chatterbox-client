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
  // function detox(str){
  //   var re = /\%2F/gm; 
  //   var m;
     
  //   while ((m = re.exec(str)) !== null) {
  //       if (m.index === re.lastIndex) {
  //           re.lastIndex++;
  //       }
  //       // View your result using the m-variable.
  //       // eg m[0] etc.
  //     console.log(m);
  //   }
  //   return m;
  // }
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
    console.log(data);
    $.each(data.results, function(index, item) {
      var msg = item.text;
      var usr = item.username;
      var rmn = item.roomname;
      // console.log(usr, "\t\t" ,rmn, "\t\t", msg);
      if (rmn && msg && usr) { 
        app.addMessage({text: msg, username: usr, roomname: rmn});
      }
    });
  });
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