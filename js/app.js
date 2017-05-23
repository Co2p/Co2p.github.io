if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('https://co2p.github.io/sw.js')
  .then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}
