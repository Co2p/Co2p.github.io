'use strict';

var http = require('http'),
    url = require('url'),
    winston = require('winston'),
    uuid = require('node-uuid'),
    sockjs = require('sockjs'),
    GameLobby = require('./GameLobby'),
    redis = require("redis"),
    client = redis.createClient(),
    gamersHashMap = {},
    gamesBeingPlayed = 0,
    gameStats = JSON.stringify({numPlayers: 0, numGames: 0}),
    channelHashMap = {},
    channelId,
    startLocations;

var CROSS_ORIGIN_HEADERS = {};
CROSS_ORIGIN_HEADERS['Content-Type'] = 'text/plain';
CROSS_ORIGIN_HEADERS['Access-Control-Allow-Origin'] = '*';
CROSS_ORIGIN_HEADERS['Access-Control-Allow-Headers'] = 'X-Requested-With';
var sockjsServer = sockjs.createServer();
sockjsServer.setMaxListeners(0);
var GRID_SIZE = 4;

var cleanup = function (channelId) {
	if (channelHashMap[channelId]) {
		winston.info('===Game Cleanup===');
		winston.info('channelId:', channelId);
		winston.info('channelHashMap[channelId].gamer1.id:', channelHashMap[channelId].gamer1.id);
		winston.info('channelHashMap[channelId].gamer2.id:', channelHashMap[channelId].gamer2.id);
		gamersHashMap[channelHashMap[channelId].gamer1.id] = void 0;
	  gamersHashMap[channelHashMap[channelId].gamer2.id] = void 0;
	  channelHashMap[channelId] = void 0;
	  gamesBeingPlayed--;
	}
};

sockjsServer.on('connection', function(io) {
  client.lpush('gamers', io.id);
  io.on('close', function() {
  	client.lrem('gamers', 0, io.id, function (err, count) {
  		if (err) winston.log('err', err);
  		winston.info('Removed gamer from waiting queue');
  	});
  });
  gamersHashMap[io.id] = io;
});

var startCellLocations = function (numLocations, size) {
  var unique = function (arr, obj) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i].x === obj.x && arr[i].y === obj.y) 
        return false;
    }
    return true;
  };
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  
  
  var loc = [];
  for (var i = 0; i < numLocations; i++) {
    var obj = {x: getRandomInt(0, size - 1), y: getRandomInt(0, size - 1), value: (Math.random() < 0.9 ? 2 : 4)};
    if (unique(loc, obj)) loc.push(obj);
    else --i;
  }
  return loc;
};

setInterval(function () {
  client.llen('gamers', function (err, len) {
    if (err) winston.log('err', err);
    if (len >= 2) {
      client.lpop('gamers', function (err1, gamer1) {
        if (err1) winston.log('err', err1);
        client.lpop('gamers', function (err2, gamer2) {
          if (err2) winston.log('err', err2);
          winston.info('===New Game===');
          winston.info('channelId:',  channelId);
          winston.info('gamer1:', gamer1);
          winston.info('gamer2:', gamer2);
          channelId = uuid.v4();
          startLocations = startCellLocations (2, GRID_SIZE);
          gamesBeingPlayed++;
          channelHashMap[channelId] = new GameLobby (channelId, gamersHashMap[gamer1], gamersHashMap[gamer2], startLocations, GRID_SIZE, cleanup);
        });
      });
    }
  })
}, 500);

setInterval(function () {
	client.llen('gamers', function(err, listSize) {
    if (err) winston.log('err', err);
    winston.info('Number of current players: ' + (listSize + gamesBeingPlayed * 2));
    winston.info('Number of current games: ' + gamesBeingPlayed);
    gameStats = JSON.stringify({numPlayers: (listSize + gamesBeingPlayed * 2), numGames: gamesBeingPlayed});
  });
}, 1000);

var server = http.createServer(function (req, res) {
  if (url.parse(req.url).pathname === '/game/players') {
    res.writeHead(200, CROSS_ORIGIN_HEADERS);
    res.write(gameStats);
    res.end();
  }
  else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Go away <3');
  }
});

sockjsServer.installHandlers(server, {prefix:'/game/sockets'});
server.listen(3000);
