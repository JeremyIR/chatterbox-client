// YOUR CODE HERE:
$(document).ready(function() {

  var app = {
    friends: [],
    server: 'https://api.parse.com/1/classes/messages',
    currentRoom: 'lobby',
    chatRooms: {'create a new room': true}
  };

  app.addFriend = function(friend) {
    app.friends.push(friend);
  };

  app.init = function() {
    app.fetch();

    // TODO: Make this not necessary.
    app.changeRoom(); // this shouldn't need to be called here!

    // form selectors
    var $send = $('#send');
    var $username = $('#username');
    var $roomSelect = $('#roomSelect');

    $send.on('submit', function(event) {
      event.preventDefault();
      app.handleSubmit.call(this, event);
    }); 

    $username
      .text(decodeURIComponent ( document.location.search.split('=')[1] ))
      .on('click', function(event) {
        $(this).attr('contentEditable', 'true');
      })
      .on('keypress', function(event) {
        // 13 is enter
        if (event.keyCode === 13) { 
          document.location.search = '?username=' + $(this).text();
          $(this).attr('contentEditable', 'false');
        }
      });

    $roomSelect.change(function(event) {
      if (event.target.selectedIndex === 1) {
        $(this).after(
          $('<input type="text" />')
            .on('keypress', function(event) {
              // 13 is enter
              if (event.keyCode === 13) {
                app.addRoom($(this).context.value);
                console.log($(this).context.value);
                $(this).remove();
              }
            })
          );
      }
    });


    setInterval(app.fetch, 5000);
    console.log('initialized');
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
        app.fetch();
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
      // data: JSON.stringify(message), // ? is this right?
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Messages recieved', data);
        app.clearMessages();
    
        $.each(data.results, function(index, item) {
          var msg = item.text || ' ';
          var usr = item.username || ' ';
          var rmn = item.roomname || ' ';
          var messageObject = {text: msg, username: usr, roomname: rmn};
          
          var lowerCaseRoomName = JSON.stringify(rmn.toLowerCase()); 


          if (rmn) { 
            if (app.chatRooms[lowerCaseRoomName] !== true ) {
              app.chatRooms[lowerCaseRoomName] = true; 
              app.addRoom(rmn);
            }
          }

          if (lowerCaseRoomName && msg && usr && rmn === app.currentRoom) { 
            app.addMessage(messageObject);
          }
        });


      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to recieve messages', data);
      }
    });
    // console.log(jqxhr);
  };


  app.changeRoom = function() {
  // console.log("outside jquery");
    $('#roomSelect').on('change', function(event) {
      app.currentRoom = event.target[event.target.selectedIndex].value;
      app.fetch();
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

  app.handleSubmit = function(event) {
  // app.send(message);
    var messageObject = {
      username: decodeURIComponent ( document.location.search.split('=')[1] ),
      text: event.target[0].value,
      roomname: app.currentRoom
    };
    app.send(messageObject);
    console.log('SUBMIT HANDLED', event.target[0].value, decodeURIComponent( document.location.search.split('=')[1] ));
  };



  app.addRoom = function(roomName) {
    $('#roomSelect')
      .append(
        $('<option/>')
          .val(roomName)
          .text(roomName)
    );
  // app.send({roomname: roomName});
  // $("#roomSelect").val(roomName).trigger("change");
  // app.fetch();
  };


  app.init();
});
