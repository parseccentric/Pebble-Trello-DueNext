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

function getCards() {
  // Construct URL
  var url = 'https://trello.com/1/members/my/cards?key=' +
      'f9bee48c183a4acbeaa96f8b16ca9fe8' + '&token=' +
      '7cf5e086aac9a4d225645c84c6b497c910dbc748ce3d6a9ace45934af6a9471b';

  // Send request to OpenWeatherMap
  xhrRequest(url, 'GET', 
    function(responseText) {
      // responseText contains a JSON object with info
      var data = JSON.parse(responseText);

      console.log(data[0].name);
    }      
  );
}

   