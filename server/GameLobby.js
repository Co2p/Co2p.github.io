'use strict';


/* 
	GameLobby constructs a new game lobby
	id - uuid of game loby
	gamer1 -  a SockJS connection instance of a gamer 
	gamer2 - a connection instance of a gamer
	gamer3 - a connection instance of a gamer
*/
function GameLobby (id, gamer1, gamer2, startCells, size, cleanup) {
	this.id = id;
	this.gamer1 = gamer1;
	this.gamer2 = gamer2;
	this.gamer3 = gamer3;
	this.startCells = startCells;
	this.size = size;
	this.cleanup = cleanup;

	this.setup(gamer1, 1);
	this.setup(gamer2, 2);
	this.setup(gamer3, 3);
}

GameLobby.prototype.setup = function(gamer, playerNum) {
    var self = this;
    gamer.write(JSON.stringify({player: playerNum, startCells: this.startCells, size: this.size, start: true}));
    
    gamer.on('data', function(data) {
        self.emit(data);
    });
    gamer.on('close', function() {
        gamer.write(JSON.stringify({player: 0, dead: true}));
        self.gamer1.close();
		self.gamer2.close();
			self.gamer3.close();	
			self.cleanup(self.id);
    });
};

GameLobby.prototype.emit = function(msg) {
	this.gamer1.write(msg);
	this.gamer2.write(msg);
	this.gamer3.write(msg);
	if (msg.gameEnd) {
		this.gamer1.close();
		this.gamer2.close();
		this.gamer3.close();
		this.cleanup(this.id);
	}
};

module.exports = GameLobby;
