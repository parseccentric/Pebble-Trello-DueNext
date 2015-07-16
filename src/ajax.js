var xhrRequest = function (url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

// Listen for when an AppMessage is received
Pebble.addEventListener('appmessage',
  function(e) {
    console.log('AppMessage received!');
  }          
);    

// Listen for when the watchface is opened
Pebble.addEventListener('ready', 
  function(e) {
    console.log('PebbleKit JS ready!');
    getCards();
  }
);


// Listen for when the watchface is opened
Pebble.addEventListener('appmessage', 
  function(e) {
    console.log('AppMessage Received.');
    getCards();
  }
);

function getCards() {
  // Construct URL
  var url = 'https://trello.com/1/members/my/cards?key=' +
      'f9bee48c183a4acbeaa96f8b16ca9fe8' + '&token=' +
      '7cf5e086aac9a4d225645c84c6b497c910dbc748ce3d6a9ace45934af6a9471b';

  // Send request to Trello
  xhrRequest(url, 'GET', 
    function(responseText) {
      // responseText contains a JSON object with info
      var data = JSON.parse(responseText);

      console.log(data[0].name);
      //get number of cards
      var quantity = data.length();
      
      //declare card attribute arrays
      var ids = [], names = [], boards = [], lists = [], dueDates = [];
      
      for(var i=0; i<quantity; i++) {
        ids[i] = data[i].id;
        names[i] = data[i].name;
        boards[i] = data[i].idBoard;
        lists[i] = data[i].list;
        dueDates[i] = data[i].due;
      }
      
      // Assemble dictionary using our keys
      var dictionary = {
        'CARD_IDS': ids,
        'CARD_NAMES': names,
        'CARD_BOARDS': boards,
        'CARD_LISTS': lists,
        'CARD_DUE_DATES': dueDates,
        'CARD_QUANTITY': quantity
      };
      
      // Send to Pebble
      Pebble.sendAppMessage(dictionary,
        function(e) {
          console.log('Data sent to Pebble successfully!');
        },
        function(e) {
          console.log('Error sending data to Pebble!');
        }
      );
    }      
  );
}

   