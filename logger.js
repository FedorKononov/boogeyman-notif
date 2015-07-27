/**
 * Типы лога
 */
var levels = ['error', 'warn', 'info', 'debug', 'notif'];

/**
 * Цвета для лога
 */
var colors = [31, 33, 36, 90, 33];

/**
 * Паддинг чтобы все сообщения в лог были на одном уровне
 */
function pad (str) {
  var max = 0;

  for (var i = 0, l = levels.length; i < l; i++)
    max = Math.max(max, levels[i].length);

  if (str.length < max)
    return str + new Array(max - str.length + 1).join(' ');

  return str;
};

/**
 * Запись лога
 */
exports.write = function (type, str) {
  var index = levels.indexOf(type);

  console.log.apply(console, [colors[index] ? '   \033['+ colors[index] +'m'+ pad(type) +' -\033[39m' : type +':'].concat(str));

  return this;
};