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

var request = require("request");

var ko = require("../Web/lang/ko_KR.json");

var load = require("./load");

var Bot = new Discord.Client();
var fs = require("fs")

exports.dbready = () => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send("```끄투 마스터 준비 끝```")
}

// 채팅시 발행한다
exports.chat = (text, id, name, channelId) => {
   if (!Bot.channels.cache.get("835829185367900191")) return JLog.warn("채팅 안됨");
   if (!name) name = "GUEST"
   Bot.channels.cache.get("835829185367900191").send(text + `\n(${id}),{${channelId}}`)
}
// 지금은 안되지만 언젠간 될 kill 명령어 시 발행한다.
exports.ban = (id,reason,at) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return JLog.warn("kill 안됨")
   if (!reason) reason = "kill";
   if (!at) at = "kill";
   var embed = new Discord.MessageEmbed()
   .setTitle("차단")
   .setDescription("")
   .addFields(
      { name : "ID" , value : id},
      { name : "이유", value : reason},
      { name : "시간", value : at}
   )
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(embed)
}
exports.word = (word,theme) => {
   var themeword = require("../Web/lang/ko_KR.json");
   var themes = themeword.kkutu[`theme_${theme}`]
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.word_Channel)) return JLog.warn("word 안됨")
   var embed = new Discord.MessageEmbed()
   .setTitle("단어 목록")
   .setDescription(`주제 : ${themes} \n\n ${word}`)
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.word_Channel).send(embed);
}


exports.close = (servernumber) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(`***서버 닫힘*** **서버 번호** **|${servernumber}|**`)
}
// 서버가 열리면 출력한다 (근대 이건 그냥 안된다 ㅋㅋ)
exports.serverready = (servernumber) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(`***서버 열림*** **서버 번호 |${servernumber}|`)
}
// kkutu 진입시 채널에알린다. ~~근데 m_은 따로 안막았다 왜냐하면 체리끄투는 모바일을 막았기 때문이다.~~~~
exports.page = (ip, guest, page) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.ip_Channel)) return;
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.ip_Channel).send(`${ip},${guest},${page}`);
   if(page === "m_kkutu" || page == "kkutu"){
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send(`${ip.split(".").slice(0, 2).join(".") + ".xx.xx"},${page}`)
   }
}
// 공지시 발송한다. yell.yell 방식으로 !kn 으로 처리하니 꼭 구별 하도록 하자!
exports.notice = (text, id, name) => {
   var i;
   if (!name) name = "끄투 전송"
   if (!text) return JLog.warn("메시지 부족")
   i = new Discord.MessageEmbed()
      .setTitle("끄투 공지")
      .setDescription(`**${text}**`)
      .setFooter(`${id},[${name}]`);
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.notice_Channel)) return;
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.notice_Channel).send(i)
}
// 끄투 채팅에서 변경시 호출한다.
exports.un = (text) => {
   var i;
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.un_Channel)) return;
   if (text)
   i = new Discord.MessageEmbed({
      title: "환율 변경",
      description: `**${text}**` + "/핑",
      color: "ff0000"
   })
   else i = "메시지가 없음."
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.un_Channel).send(i)
}
exports.start = (id) => {
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL)) return
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.SETTING_CHANNEL).send("끄투 접속 (id:" + id + ")")
}
// 182줄에서 쓴다.
function un(text) {
   var i;
   if (!Bot.channels.cache.get(GLOBAL.BOT_SETTING.un_Channel)) return;
   if (text)
   i = new Discord.MessageEmbed({
      title: "환율 변경",
      description: `**${text}**` + "/핑",
      color: "ff0000"
   })
   else i = "메시지가 없음."
   Bot.channels.cache.get(GLOBAL.BOT_SETTING.un_Channel).send(i)
}
// 디스코드 메시지를 수집해 명령문을 내린다.
Bot.on("message", async (m) => {
   // !kn , !kkutunotice (내용) 을 하면 Discord Send : (내용) 으로 끄투 공지로 출력한다.근데 !kkutunotice 는 지울 전망이다 엇갈린다.
   if (m.content.startsWith("!kn")) {
      var text = m.content.slice(3)

      if (GLOBAL.BOT_SETTING.admin_yell_id.includes(m.author.id)) {
         load.yell("Discord : " + text, m.author.id, m.author.username) // 처리 방법 변경함.
      } else { // 위에 5516.. 체리끄투 관리자가 라면 공지가 되지만 아니라면 권한이 없다고 한다 근데 권한 없다고 3번이 뜬다 이유를 모른다.
         m.reply("권한 없음");
         return; // 그러고선 리턴을 해버린다 필요없긴 하지만.
      }
   }
   // err,res 는 사용되지 않은 선언문이지만 지우지 말자 (그러면 body 안됨 )모듈상으로 .ㅠ
   if (m.content.startsWith("!list") || m.content.startsWith("!kkutulist")) {
      request.get({ url: "http://ck.k-r.pw/servers" }, function (error, res, body) { // error,res 는 지우지 말자 왜냐하면 모듈상으로 error,res,body 순이기 때문에 지워버리면 err 로 인식해버린다.
         m.channel.send(`**${body}**`) // 그러고선 채널에 전송한다 (3번씩이나.)
      })
   }

   if (m.content.startsWith("!ek")) { // 타 끄투 서버의 리스트를 불러오는 명령어이다.
      var text = m.content.slice("!ek".length); // text 를 불러온다
      // 편의성을 위해 체리끄투가 노가다 해서 만든것이다. !ek 끄투리오 하면 servers 요청 하여 나온다.
      if (text === " 끄투리오") { // 띄어쓰기는 절대 빼지 말자. 띄어쓰기를 빼려면 slice(4) 로 설정하면 띄어쓰기를 빼야 된다.
         text = "https://kkutu.io/" // 끄투리오라면 text 를 변환한다. 사이트로
      } else if (text === " 끄투코리아") {
         text = "https://kkutu.co.kr/"
      } else if (text === " 끄투닷넷") {
         text = "https://kkutu.xyz/"
      } else if (text === " BF끄투") {
         text = "https://bfkkutu.kr/"
      } else if (text === " RH끄투") {
         text = "https://kkutu.romanhue.xyz/"
      } else if (text === " 랜덤 스튜디오") {
         text = "http://randomstudio.kro.kr/"
      } else if (text === " 이름 없는 끄투") {
         text = "https://kkutu.org/"
      } else if (text === " 끄투블루") {
         text = "http://kkutu.blue/"
      } else if (text === " 지빵끄투") {
         text = "https://jgkkutu.kr/"
      } else if (text === " 투데이끄투") {
         text = "http://kkutu.today/"
      } else if (text === " 분홍끄투") {
         text = "https://kkutu.pinkflower.kro.kr/"
      } else if (text === " 벨투") {
         text = "https://veltu.kro.kr/"
      } else if (text === " 블루끄투") {
         text = "http://bluekkutu.com/"
      } else if (text === " 행성끄투") {
         text = "https://planetkt.kr/"
      } else if (text === " 끄투어스") {
         text = "https://kkutu.us/"
      } else if (text === " 저런닷컴") {
         text = "https://kkutu.top/"
      } else if (text === " 끄투민트") {
         text = "https://kkutumint.k-r.cc/"
      } else if (text === " 트꾸") {
         text = "https://kimustory.kro.kr/"
      } else if (text === " 디보이끄투") {
         text = "https://dboikkutu.kro.kr/"
      } else if (text === " 그레이끄투") {
         text = "https://graykkutu.kro.kr/"
      } else if (text === " 체리끄투") {
         text = "http://cherrykkutu.kro.kr/"
      } // 없는 것도 있다. 없으면 체리끄투 채팅에 없다고 알리자.
      // 만일 !ek ㅁㄴㅇㄹ 라고 하면 사이트가 ㅁㄴㅇㄹ 가 된다 저기 if 문에 없다면 사이트로도 가능하다.
      request.get({ url: text + "servers" }, function (e, r, b) { // 아까 120 줄에서 설명했다.
         if (!b) b = "해당 끄투 연결 안됨.";
         m.channel.send(`**${b}**`);
      })
   }
   // kill (강퇴) 기능이다 근데 이거 빠꾸(에러) 나오니 그냥 버리는게 좋다.
   /* if (m.content.startsWith("/kill")){
        var temp;
        let text = m.content.slice(6);
        try{
           if (temp = dic[text]){
              temp.socket.send('{"type":"error","code":410}');
              temp.socket.close();
           }
        } catch(e) {
           m.channel.send(e)
        }
     }
     */
   // 환율 기능이다. 저런닷컴과 체리끄투가 환전소로 거듭나 만든 기능이다.
   if (m.content.startsWith("/un")) { // !un 123 이라고 하면 환율을 수정한다 DB와 전혀 무관하다.
      var text = m.content.slice(3) // text 를 선언하고,
      un(text) // 84줄에 function un 이 있다. 수정할려면 84 줄 아래를 수정하면 된다.


   }
  if (m.content.startsWith("/word")) {
    var args = m.content.slice(6).split(",") // text 선언.
    request.get({ url : `http://cherrykkutu.k-r.pw/dict/${args[0]}?lang=${args[1]}`}, function(e,r,b){
    if (!b) b = "단어 없음.";
    m.channel.send(b);

    })
  }
}) // 여기서 이제 Bot.on 의 괄호가 끝난다.



// 봇 로그인
Bot.login(GLOBAL.BOT_SETTING.BOT_TOKEN); // 봇을 이제 로그인 한다. 토큰이 필요하믈 글로벌.json 에서 토큰을 넣어야 한다 안넣으면 망한다. 꼭 넣자. 안넣으면 그냥 명령어 잇어도 안돌아간다.
// 토큰 얻는 법은 : discord.com/developers 에 들어가서 자신의 봇을 누르고 Bot 메뉴에 들어간다. 그러면 자신의 봇 이름 아래 Token 이라는 것이 있을거다 그러면 copy 하면 토큰이 복사 되었다 꼭 노출되면 안된다 노출 되면 디스코드에서 감지되어 자동으로 토큰을 변경하는 시스템이 있기에 그냥 노출 하지 말고 global 에 token 을 잘 집어 넣어 사용 하도록 하자.
//
