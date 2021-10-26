const discord = require("discord.js");

const JLog = require("../sub/jjlog");

const GLOBAL = require("../sub/global.json");


const moment = require("moment");

var Bot = new discord.Client();
const fs = require("fs");



exports.ban = (Type,id,reason,at) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.BAN_CHANNEL)) return JLog.warn("kill 안됨");
   require("../Web/db").users.findOne([ '_id', id]).on(function(data){
      
      var stringid = String(id); // string 변환
      if (!reason) reason = "없음"; // reason (이유) 가 없다면 없음이라고 선언
      if (!at) at = "없음"; // 28줄과 같은 방식
      if (stringid.startsWith("discord")){ // 만일 discord가 포함되어있다면 
         var stringid = `<@${id.split("discord-").join("")}>` // <@${id}> 로 변환한다. (디스코드 태그 방식)
      };
      setTimeout(() => {   var embed = new discord.MessageEmbed() // 임베드 선언
      .setTitle("체리끄투 || 차단")
      .setDescription("") // 그냥 냅두자.
      .addFields(                // 삼항 조건문  데이터가 참 이라면       거짓이라면
         { name : "ID" , value : `${stringid}(${data ? data.nickname : "없음"})`},
         { name : "이유", value : reason},
         { name : "일수", value : Type + "(" + at + ")"}
      )
      .setColor(0xffff00) // 임배드 컬러 선언

      .setTimestamp(); // 시간 선언 (어떤 타입일까?)
      Bot.channels.cache.get(GLOBAL.BOT_SETTING.BAN_CHANNEL).send(embed);
   }, 3000) // global.json 에 있는 BAN_CHANNEL 로 보낸다.
   }) // 괄호 끝.
} // exports.ban 괄호 끝.
exports.word = (type,word,theme) => {
   var themes = require("../Web/lang/ko_KR.json").kkutu[`theme_${theme}`]; // 주제 뜻을 선언한다
   if (!themes) var themes = require("../Web/lang/ko_KR.json").GLOBAL.NONE; // 주제가 없다면 NONE 을 선언한다
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.word_Channel)) return JLog.warn("word 안됨"); // 만일 채널 아이디로 채널이 없다면 리턴한다 (오류 방지.)
   var embed = new discord.MessageEmbed() // 임배드를 선언한다.
   .setTitle("단어 " + type +" 목록") // type 은 추가냐 수정이냐 삭제냐 따라 달라진다.
   .setDescription(`주제 : ${themes}(${theme}) \n\n ${word}`); // theme 은 코드이다.
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.word_Channel).send(embed); // 44줄 처럼 보낸다.
}
exports.wordplus = (id,word,theme) => { // 47~55줄과 같은 방식
   var themes = require("../Web/lang/ko_KR.json").kkutu[`theme_${theme}`]; // 주제 이름은 선언한다.
   if (!themes) var themes = require("../Web/lang/ko_KR.json").GLOBAL.NONE; // 주제 코드에 맞는 이름이 없다면 NONE 을 선언한다.
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.wordplus_Channel)) return JLog.warn("wordplus 안됨"); // 50줄과 같은 방식이다.
   var embed = new discord.MessageEmbed() // 임배드 선언
   .setTitle("단어 요청 목록")
   .setDescription(`요청 아이디 : ${id} \n주제 : ${themes}(${theme}) \n\n ${word}`); // 53줄과 같은 방식.
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.wordplus_Channel).send(embed); //  = 54
}

exports.report = (reportid,id,reason) => { // 신고 시스템
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.report_Channel)) return JLog.warn("신고 접수 안됨(bot.js)") // =59
   var embed = new discord.MessageEmbed() // 임베드 선언.
   .setTitle("신고 접수")
   .setDescription("")
   .addFields(
      { name : "ID", value : id},
      { name : "REPORTID" , value : reportid},
      { name : "REASON", value : reason},
   )
   .setTimestamp();
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.report_Channel).send(embed); // 임베드와 함께 전송.
}
// kkutu 진입시 채널에알린다. ~~근데 m_은 따로 안막았다 왜냐하면 체리끄투는 모바일을 막았기 때문이다.~~~~
exports.page = (ip, guest, page) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.ip_Channel)) return;
   const thisDate = moment().format("MM-DD|HH:mm:ss");
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.ip_Channel).send(`${ip},${guest},${page}`);
   fs.appendFileSync('../log/all_ip.log', `\n(${thisDate})${ip},${guest},${page}`);
}
// 공지시 발송한다. yell.yell 방식으로 !kn 으로 처리하니 꼭 구별 하도록 하자!
exports.notice = (text, id, name) => {
   var i;
   if (!name) name = "끄투 전송";
   if (!text) return JLog.warn("메시지 부족");
   i = new discord.MessageEmbed()
      .setTitle("끄투 공지")
      .setDescription(`**${text}**`)
      .setFooter(`${id},[${name}]`);
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.notice_Channel)) return;
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.notice_Channel).send(i);
}

// 디스코드 메시지를 수집해 명령문을 내린다.


// 봇 로그인
Bot.login(GLOBAL.BOT_SETTING.BOT_TOKEN); // 봇을 이제 로그인 한다. 토큰이 필요하믈 글로벌.json 에서 토큰을 넣어야 한다 안넣으면 망한다. 꼭 넣자. 안넣으면 그냥 명령어 잇어도 안돌아간다.
// 토큰 얻는 법은 : discord.com/developers 에 들어가서 자신의 봇을 누르고 Bot 메뉴에 들어간다. 그러면 자신의 봇 이름 아래 Token 이라는 것이 있을거다 그러면 copy 하면 토큰이 복사 되었다 꼭 노출되면 안된다 노출 되면 디스코드에서 감지되어 자동으로 토큰을 변경하는 시스템이 있기에 그냥 노출 하지 말고 global 에 token 을 잘 집어 넣어 사용 하도록 하자.
//
