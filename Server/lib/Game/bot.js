/**
 * cherrykkutu bot 입니다
 * 저작권은 체리보린한테 있으며
 * 무단으로 코드를 복사하거나, 2차 복제에 대해 제지 할것이다.
 * 감사하다(?).
 */
// 모듈 불러온다.
// 디스코드 봇 돌리기 위해 모듈을 불러온다.

const discord = require("discord.js");

const JLog = require("../sub/jjlog");

const GLOBAL = require("../sub/global.json");

const MainDB = require("../Web/db");


const moment = require("moment");

var Bot = new discord.Client();
const fs = require("fs")


Bot.on("message" || "messageUpdate", async(message) =>{
      if (message.content.startsWith("'search")) {
         message.channel.startTyping();
         var m = message.content.slice("'search ".length);
         if (m.length <= 5)
            return message.channel.stopTyping();
         setTimeout(() => {
            // 끄투 데이터 베이스 가져오기.
            MainDB.users.findOne(['_id', m]).on(function (data) {
               if (!data)
                  return message.channel.send(new discord.MessageEmbed().setTitle("Not Data."));
               var embed = new discord.MessageEmbed()
                  .setTitle(`${data.nickname}'s Profile`)
                  .setDescription("")
                  .addFields(
                     { name: "ID", value: data._id },
                     { name: "KKuTu", value: data.kkutu }
                  );
               message.channel.stopTyping();
               message.channel.send(embed);
            }, 3 * 1000);
         });
      };
      if (message.content.startsWith("'ping")){
         message.channel.startTyping(); //타이핑 시작.
         setTimeout(() => {
            var i = Bot.ws.ping;
            
            message.channel.stopTyping();
            var embed = new discord.MessageEmbed()
            .setTitle("🏓 Ping!")
            .setDescription(`${i}ms`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }));
         }, 2 * 1000);
      }
   })


// 봇 로그인
Bot.login(GLOBAL.BOT_SETTING.BOT_TOKEN); // 봇을 이제 로그인 한다. 토큰이 필요하믈 글로벌.json 에서 토큰을 넣어야 한다 안넣으면 망한다. 꼭 넣자. 안넣으면 그냥 명령어 잇어도 안돌아간다.
// 토큰 얻는 법은 : discord.com/developers 에 들어가서 자신의 봇을 누르고 Bot 메뉴에 들어간다. 그러면 자신의 봇 이름 아래 Token 이라는 것이 있을거다 그러면 copy 하면 토큰이 복사 되었다 꼭 노출되면 안된다 노출 되면 디스코드에서 감지되어 자동으로 토큰을 변경하는 시스템이 있기에 그냥 노출 하지 말고 global 에 token 을 잘 집어 넣어 사용 하도록 하자.
//
