var ip = 'http://192.168.43.96';

$('#ip').val(ip)

$('#set-ip').click(() => {
  ip = $('#ip').val();
  console.log(ip);
})

$('body').keypress(function( event ) {
  ide();
});

$('#ide').click(() => {
  ide();
})

$('#on').click(() => {
  ideSound();
  on();
})

$('#off').click(() => {
  off();
})

function ide() {
  ideSound();
  on(200);
  off(1500);
}

function ideSound() {
  if ($('#sound-toggl').is(":checked")) {
    var playPromise = document.querySelector('audio').play();
    // In browsers that don’t yet support this functionality,
    // playPromise won’t be defined.
    if (playPromise !== undefined) {
      playPromise.then(function() {
        // Automatic playback started!
      }).catch(function(error) {
        // Automatic playback failed.
        // Show a UI element to let the user manually start playback.
        console.log(error);
      });
    }
  }
}

function on(time) {
  window.setTimeout(function(){
    httpGet(ip + '/on');
  }, time);
}

function off(time) {
  window.setTimeout(function(){
    httpGet(ip + '/off');
  }, time);
}

function httpGet(theUrl){
  console.log(theUrl);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    //if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
    //callback(xmlHttp.responseText);
    //}
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}
