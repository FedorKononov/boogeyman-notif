var dgram = require('dgram');
var logger = require('./logger');

var udp_receiver = {
	client_sockets: {},

	server: dgram.createSocket('udp4'),

	log: logger,

	init: function(){
		var self = this;

		this.server.on('message', function (msg, rinfo) {
			self.log.write('info','server got: ' + msg + ' from ' + rinfo.address + ':' + rinfo.port);
			item_obj = self.parse_msg(msg);
			// мы должны транслировать сообщение от демона бугимена всем клиентам
			for (var soc_id in self.client_sockets) {
                self.client_sockets[soc_id].manager.sockets.emit(item_obj.channel, item_obj);
				break;
			}
		});

		this.server.on("listening", function () {
			var address = self.server.address();
			self.log.write('info','udp server listening ' + address.address + ':' + address.port);
		});

		return this;
	},

	listen: function(port){
		this.server.bind(port);

		return this;
	},

	parse_msg: function(msg) {
		return JSON.parse(msg);
	},

	client_add: function(socket){
		this.client_sockets[socket.id] = socket;
	},

	client_remove: function(socket){
		//delete this.client_sockets[socket.id];
	},
}

exports.receiver = udp_receiver;