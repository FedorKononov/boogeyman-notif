var io = require('socket.io').listen(8080);
var udp_receiver = require('./receiver').receiver;
udp_receiver.init().listen(8081);
/**
 * Конфиг
 */
//io.enable('browser client minification');  // send minified client
//io.enable('browser client etag');          // apply etag caching logic based on version number
//io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging
io.set('transports', [                     // enable all transports except flash socket
  'xhr-polling',
  'jsonp-polling'
]);

io.set("polling duration", 10);

io.sockets.on('connection', function (socket) {
  // добавляем клиента
  udp_receiver.client_add(socket);

  io.settings.logger.log('warn', 'User connected');

  socket.on('disconnect', function() {
    // удаляем клиента
    udp_receiver.client_remove(this);
    this.log.warn('User disconnect');
  });
});

// Каждые 25 сек смотрим память
setInterval(function () {
  mem = process.memoryUsage()
  io.settings.logger.warn('Memory usage: '+ Math.ceil(mem.rss / 1024 / 1024) +' mb');
  io.settings.logger.warn('Server connections: '+ io.server.connections);
}, 25000);
