var xhrRequest = function (url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

function posInArray(arrayToCheck, object) {
  for(var i=0; i<arrayToCheck.length; i++) {
    if(arrayToCheck[i] == object) {
      return i;
    }
  }
  return -1;
}

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
      var quantity = data.length;
      
      //declare card attribute arrays
      var ids = new Array(quantity), 
          names = new Array(quantity), 
          idBoards = new Array(quantity), 
          nameBoards = new Array(quantity), 
          idLists = new Array(quantity), 
          nameLists = new Array(quantity), 
          dueDates = new Array(quantity);
      //declare card cache arrays
      var idBoardsCache = [], idListsCache = [], nameBoardsCache = [], nameListsCache = [];
      
      //populate card attribute arrays
      for(var i=0; i<quantity; i++) {
        ids[i] = data[i].id;
        names[i] = data[i].name;
        idBoards[i] = data[i].idBoard;
        idLists[i] = data[i].idList;
        dueDates[i] = data[i].due;
      }
      
      var getBoardNameCallback = function(responseText) {
        var data = JSON.parse(responseText);
        nameBoards[i] = data._value;
        nameBoardsCache[i] += data._value;
      };
      var getListNameCallback = function(responseText) {
        var data = JSON.parse(responseText);
        nameLists[i] = data._value;
        nameListsCache[i] += data._value;
      };
      
      //populate card board, list names
      for(i=0; i<60 && i<quantity; i++) {
        
        //populate card board names
        var posInCache = posInArray(idBoardsCache, idBoards[i]);
        if(posInCache > -1) {
          nameBoards[i] = nameBoardsCache[posInCache];
        } else {
          // Construct URL
          var url = 'https://trello.com/1/boards/' + idBoards[i] + '/name/' +
              '?key=' + 'f9bee48c183a4acbeaa96f8b16ca9fe8' + 
              '&token=' + '7cf5e086aac9a4d225645c84c6b497c910dbc748ce3d6a9ace45934af6a9471b';
        
          // Send request to Trello
          xhrRequest(url, 'GET', getBoardNameCallback(responseText));
        }
        
        //populate card list names
        posInCache = posInArray(idListsCache, idLists[i]);
        if(posInCache > -1) {
          nameBoards[i] = nameBoardsCache[posInCache];
        } else {
          // Construct URL
          var url = 'https://trello.com/1/lists/' + idLists[i] + '/name/' + 
              '?key=' + 'f9bee48c183a4acbeaa96f8b16ca9fe8' + 
              '&token=' + '7cf5e086aac9a4d225645c84c6b497c910dbc748ce3d6a9ace45934af6a9471b';
        
          // Send request to Trello
          xhrRequest(url, 'GET', getListNameCallback(responseText));
        }
        
      }
       
      // Assemble dictionary using our keys
      var dictionary = {
        'CARD_IDS': ids,
        'CARD_NAMES': names,
        'CARD_ID_BOARDS': idBoards,
        'CARD_NAME_BOARDS': nameBoards,
        'CARD_ID_LISTS': idLists,
        'CARD_NAME_LISTS': nameLists,
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

   