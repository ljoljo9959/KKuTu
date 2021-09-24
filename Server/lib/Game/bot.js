/**
 * cherrykkutu bot 입니다
 * 저작권은 체리보린한테 있으며
 * 무단으로 코드를 복사하거나, 2차 복제에 대해 제지 할것이다.
 * 감사하다(?).
 */
// 모듈 불러온다.
// 디스코드 봇 돌리기 위해 모듈을 불러온다.

var Discord = require("discord.js");

var JLog = require("../sub/jjlog");

var GLOBAL = require("../sub/global.json");



var load = require("./load");

var moment = require("moment");

var Bot = new Discord.Client();
var fs = require("fs")


exports.ban = (Type,id,reason,at) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.BAN_CHANNEL)) return JLog.warn("kill 안됨");
   if (!reason) reason = "없음";
   if (!at) at = "없음";
   var embed = new Discord.MessageEmbed()
   .setTitle("체리끄투 || 차단")
   .setDescription("")
   .addFields(
      { name : "ID" , value : id},
      { name : "이유", value : reason},
      { name : "일수", value : Type + "(" + at + ")"}
   )
   .setColor("ff0000")
   .setTimestamp();
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.BAN_CHANNEL).send(embed);
};
exports.word = (type,word,theme) => {
   var theme = Number(theme);
   var themeword = require("../Web/lang/ko_KR.json");
   var themes = themeword.kkutu[`theme_${theme}`];
   if (!themes) var themes = themeword.GLOBAL.NONE;
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.word_Channel)) return JLog.warn("word 안됨");
   var embed = new Discord.MessageEmbed()
   .setTitle("단어 " + type +" 목록")
   .setDescription(`주제 : ${themes} \n\n ${word}`);
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.word_Channel).send(embed);
};



// kkutu 진입시 채널에알린다. ~~근데 m_은 따로 안막았다 왜냐하면 체리끄투는 모바일을 막았기 때문이다.~~~~
exports.page = (ip, guest, page) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.ip_Channel)) return;
   const thisDate = moment().format("MM-DD|HH:mm:ss");
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.ip_Channel).send(`${ip},${guest},${page}`);
   fs.appendFileSync('../log/all_ip.log', `\n(${thisDate})${ip},${guest},${page}`);
   if(page === "m_kkutu" || page == "kkutu"){
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(`${ip.split(".").slice(0, 2).join(".") + ".xx.xx"},${page}`);
   };
};
// 공지시 발송한다. yell.yell 방식으로 !kn 으로 처리하니 꼭 구별 하도록 하자!
exports.notice = (text, id, name) => {
   var i;
   if (!name) name = "끄투 전송";
   if (!text) return JLog.warn("메시지 부족");
   i = new Discord.MessageEmbed()
      .setTitle("끄투 공지")
      .setDescription(`**${text}**`)
      .setFooter(`${id},[${name}]`);
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.notice_Channel)) return;
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.notice_Channel).send(i);
};

// 디스코드 메시지를 수집해 명령문을 내린다.
Bot.on("message", async (message) => {
   var BAD = new RegExp([ "느으*[^가-힣]*금마?", "니[^가-힣]*(엄|앰|엠)", "(ㅄ|ㅅㅂ|ㅂㅅ)", "미친(년|놈)?", "(병|븅|빙)[^가-힣]*신", "보[^가-힣]*지", "(새|섀|쌔|썌)[^가-힣]*(기|끼)", "섹[^가-힣]*스", "(시|씨|쉬|쒸)이*입?[^가-힣]*(발|빨|벌|뻘|팔|펄)", "십[^가-힣]*새", "씹", "(애|에)[^가-힣]*미", "자[^가-힣]*지", "존[^가-힣]*나", "좆|죶", "지랄", "창[^가-힣]*(녀|년|놈)", "fuck", "sex" ].join('|'), "g");
   // 끄투 검열 사용;
   var badWords = BAD.test(message.content);
   if (badWords){
   message.delete(); 
   message.reply("욕설 감지! **욕설을 자제해주세요!**");
   return;}
   // !kn , !kkutunotice (내용) 을 하면 Discord Send : (내용) 으로 끄투 공지로 출력한다.근데 !kkutunotice 는 지울 전망이다 엇갈린다.
   if (message.content.startsWith("!kn")) {
      var text = message.content.slice(3);

      if (GLOBAL.BOT_SETTING.admin_yell_id.includes(message.author.id)) {
         load.yell("Discord : " + text, message.author.id, message.author.username); // 처리 방법 변경함.
      } else { // 위에 5516.. 체리끄투 관리자가 라면 공지가 되지만 아니라면 권한이 없다고 한다 근데 권한 없다고 3번이 뜬다 이유를 모른다.
         message.reply("권한 없음");
         return; // 그러고선 리턴을 해버린다 필요없긴 하지만.
      };
   };

  if (message.content.startsWith("!end")){
     if (GLOBAL.BOT_SETTING.admin_yell_id.indexOf(message.author.id) === -1) return;
     var args = message.content.slice("/end".length);

     var [id,imageURL] = args.split(",");

     var users = message.mentions.users.first();

     users.send(`<@${users.id}>(${users.username})님에게 ` + "체리끄투 부서 해고 통보가 날라왔습니다.").then((sentMessage) => {

      setTimeout(() => {
         var time = moment().format("YYYY년 MM월 DD일");

         var embed = new Discord.MessageEmbed()
         .setTitle(`${users.username}님의 해고 통지서`)
         .setDescription(time + " 해고 되었습니다. \n 정확하게 이미지를 확인하여 주세요.")
         .setImage(imageURL)
         .setTimestamp()
         .setFooter(`${message.author.username}`, message.author.displayAvatarURL({ dynamic : true}));
         sentMessage.edit(embed)
      }, 6 * 1000);
        
     });

     
  };
}); // 여기서 이제 Bot.on 의 괄호가 끝난다.



// 봇 로그인
Bot.login(GLOBAL.BOT_SETTING.BOT_TOKEN); // 봇을 이제 로그인 한다. 토큰이 필요하믈 글로벌.json 에서 토큰을 넣어야 한다 안넣으면 망한다. 꼭 넣자. 안넣으면 그냥 명령어 잇어도 안돌아간다.
// 토큰 얻는 법은 : discord.com/developers 에 들어가서 자신의 봇을 누르고 Bot 메뉴에 들어간다. 그러면 자신의 봇 이름 아래 Token 이라는 것이 있을거다 그러면 copy 하면 토큰이 복사 되었다 꼭 노출되면 안된다 노출 되면 디스코드에서 감지되어 자동으로 토큰을 변경하는 시스템이 있기에 그냥 노출 하지 말고 global 에 token 을 잘 집어 넣어 사용 하도록 하자.
//
