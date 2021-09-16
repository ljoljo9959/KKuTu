var KKuTu = require("./kkutu")
var Bot = require("./bot")

exports.yell = (value,id,name) => {
   KKuTu.publish('yell', { value: value });
   Bot.notice(value,id,name);
};
