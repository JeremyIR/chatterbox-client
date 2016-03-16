// YOUR CODE HERE:
var app = {
  friends: {},
  server: 'https://api.parse.com/1/classes/messages',
  currentRoom: 'lobby',
  chatRooms: {'create a new room': true}
};

$(document).ready(function() {


  app.addFriend = function(friend) {
    app.friends[friend] = friend;
    for (var frnd in app.friends) {
      console.log('in for loop');
      $('.chat > .username[__data__=' + friend + ']')
        .on('click', function(event) {
          console.log('setting click handler?', event, $(this));
          $(this).toggleClass('highlighted'); 
        });
    }
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
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Messages recieved', data);
        app.clearMessages();
        $('#roomSelect').children().remove();
    
        $.each(data.results, function(index, item) {
          var msg = item.text || ' ';
          var usr = item.username || ' ';
          var rmn = item.roomname || ' ';
          var messageObject = {text: msg, username: usr, roomname: rmn};
          
          var lowerCaseRoomName = JSON.stringify(rmn.toLowerCase()); 


          if (rmn) { 
            // there could be:
              //[ ] a chatRoom we haven't stored and that we haven't appended to the page
              //[ ] a chatRoom we haven't stored and that we have appended to the page
              //[x] a chatRoom we have stored and that have appended to the page
              //[ ] a chatRoom we have stored and that we haven't appended to the page

            // if there is no existing chatRoom with the same name in storage:
            if ( app.chatRooms[lowerCaseRoomName] === undefined ) {
              // create the chatRoom key in storage
              app.chatRooms[lowerCaseRoomName] = true; 
            }

            
            // there is no check about whether it's on the page
            if (app.chatRooms[lowerCaseRoomName] === true) {
              app.addRoom(rmn);
              app.chatRooms[lowerCaseRoomName] = false; 
            }
            // otherwise, if there already exists chatRoom with the same name in storage:
              // append chatRoom name only once to the list
            // then reset to true  .... this is awful.

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
        console.log(event);
        app.addFriend(event.currentTarget.textContent);
      })
      .attr('__data__', message.username);
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
    console.log('called addRoom');
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
