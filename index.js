const fs = require("fs");

const keitaiso = fs.readFileSync("./data/keitaiso.txt", "utf8").split(",");

let call = (serchWord)=>{
  let ayayaSay = (serchWord)=>{

    let ayaya = [serchWord];
    if (!serchWord) {
      serchWord = " ";
    }
    let noDataFlag = true;
    while (true) {
      let indexofStart = -1;
      let wordNumberList = [];
      while (true) {
        indexofStart += 1;
        indexofStart = keitaiso.indexOf(serchWord, indexofStart);
        if(indexofStart=== -1 && noDataFlag) return ["nothit","ごめんなさい、わからないわ。"];
        noDataFlag = false;
        if (indexofStart === -1 || indexofStart === keitaiso.length - 1) {
          indexofStart = null;
          break;
        };
        wordNumberList.push(indexofStart + 1);
      };
      let wordNumber = wordNumberList[Math.floor(Math.random() * (wordNumberList.length) )];
      indexofStart = null;
      wordNumberList = null;
      if (keitaiso[wordNumber] === " ") {
        break;
      } else {
        serchWord = keitaiso[wordNumber];
        ayaya.push(keitaiso[wordNumber]);
        console.log(keitaiso[wordNumber])
        if(ayaya.length>100)break;
      }
      wordNumber = null
    }
    serchWord = null;
    ayaya = ayaya.join("");
    return [null,ayaya];
    ayaya = null;
}

let ans = ayayaSay(serchWord)[1]+""
return ans


/*
  while (true) {
    let ayaya = ayayaSay(serchWord);
    if(ayaya[0]) return ayaya[1]
    ayaya = ayaya[1]
    if (!ayaya.match(/しね$/) && ayaya.length > 25) {
      return ayaya;
      ayaya = null;
      break;
    } else {
      ayaya = null;
      continue;
    }
  }
*/
}
console.log(call("綾"))
//テストコード twitterを殺してから実行すること

let num = 0;
for(let i=0;i<3;i++){
  let tmp = call("陽子");
  num += tmp.length
  console.log(`${tmp}${i}`)
//  console.log(process.memoryUsage().heapUsed + "/" +process.memoryUsage().heapTotal)
}
//console.log("aaa"+keitaiso[2043]+"aaa")


/*
setInterval(()=>{
  console.log(new Date + process.memoryUsage().heapUsed + "/" +process.memoryUsage().heapTotal)
},10000)
*/

/*
const twitter = require("twitter");
const cron = require('cron').CronJob;
require('dotenv').config();
const key = new twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
});

key.get("account/verify_credentials", function (error, data) {
  let mydata = JSON.stringify(data)
  mydata = JSON.parse(mydata)
  //console.log(mydata)
  console.log("認証アカウント")
  console.log("@" + mydata.screen_name)
  console.log(mydata.name)
  console.log("\n")
  mydata = null;
})

const posttweet = () =>{
  key.post('statuses/update',
  { status: call() },
  (error, tweet, response) => {
  })
}


const cronAyaya = new cron({
    cronTime: '0 0,10,20,30,40,50 * * * *',
//    cronTime: '* * * * * *',
    onTick:  () => {
        posttweet()
    },
    start: false,
    timeZone: 'Asia/Tokyo'
});
cronAyaya.start();
posttweet()
*/
/*
setInterval(()=>{
    posttweet()
},600000)
*/

const tweetDeckStream = require("tweetdeckstream");
tweetDeckStream.write = (data)=>{
  console.log(data);
}