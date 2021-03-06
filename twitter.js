const speak = require("./index.js")
const fs = require("fs")
const twitterModule = require("twitter")
const cron = require('cron').CronJob
//require('dotenv').config()
//const twitter = new twitterModule({
//  consumer_key: process.env.consumer_key,
//  consumer_secret: process.env.consumer_secret,
//  access_token_key: process.env.access_token_key,
//  access_token_secret: process.env.access_token_secret
//})
const ignore = require('./ignore.js')
const twitter = new twitterModule({
  consumer_key: ignore.twitter.consumer_key,
  consumer_secret: ignore.twitter.consumer_secret,
  access_token_key: ignore.twitter.access_token_key,
  access_token_secret: ignore.twitter.access_token_secret
})
let Datastore = require('nedb')
let db = new Datastore({ 
    filename: 'speakLog.db',
    autoload: true
})
try{
  fs.readFileSync("./data/nextId.txt","utf8")
}catch(e){
  fs.writeFileSync("./data/nextId.txt",'1',"utf8")
}

let mydata
twitter.get("account/verify_credentials", function (error, data) {
  mydata = JSON.stringify(data)
  mydata = JSON.parse(mydata)
  console.log("認証アカウント")
  console.log("@" + mydata.screen_name)
  console.log(mydata.name)
  console.log("\n")
})

twitter.post('statuses/update',
{ status: `再起動しました\n${new Date}` },
(error, tweet, response) => {
})

const posttweet = () =>{
  twitter.post('statuses/update',
  { status: speak.talk() },
  (error, tweet, response) => {
  })
}


const cronTalk = new cron({
    cronTime: '0 0,10,20,30,40,50 * * * *',
//    cronTime: '* * * * * *',
    onTick:  () => {
        posttweet()
    },
    start: false,
    timeZone: 'Asia/Tokyo'
})
cronTalk.start()
posttweet()


//リプライ対応機能
const sendReply = (word,replyId)=>{
  let doc = {
    user: replyId.screenName,
    getText: replyId.getText,
    replyText: word
  }
  db.insert(doc)

  twitter.post('statuses/update',
  { status: `@${replyId.screenName} \n${word}`,
    in_reply_to_status_id : replyId.id
  },
  (error, tweet, response) => {
  })
}

const cronReply = new cron({
  cronTime: '0 * * * * *',
  onTick:  () => {
    let replyId = fs.readFileSync("./data/nextId.txt","utf8")
    twitter.get('statuses/mentions_timeline',
    { 
      count: 200,
      since_id :replyId
    },
    async (error, tweet, response) => {
      //console.log(tweet)
      if(tweet.errors)return
      if(tweet.length!=0)fs.writeFileSync("./data/nextId.txt",tweet[0].id_str,"utf8")
      for(let i=0;i<tweet.length;i++){
        if(tweet[i].user.screen_name === mydata.screen_name) continue
        let tmp = await speak.reply(tweet[i].text.replace(/@\w+|[!-@]|[\[-\`]|[\{-\~]/gi,""))
        sendReply(tmp,{"id":tweet[i].id_str,"screenName":tweet[i].user.screen_name,"getText":tweet[i].text.replace(/@\w+|[!-@]|[\[-\`]|[\{-\~]/gi,"")})
      }
    })

  },
  start: false,
  timeZone: 'Asia/Tokyo'
})
cronReply.start()

const autoFollowBack = (cursor=-1) => {
  twitter.get('followers/list',{
    'count':200,
    'cursor':cursor
  },(error, tweet, response) => {
    if(error){
      console.log(error)
      return
    }
    for(let i of JSON.parse(response.body).users){
      //console.log(`${i.screen_name} ${i.id_str} ${i.following}`)
        if(i.following===false){
        twitter.post('friendships/create',{
          'user_id':i.id_str,
          'follow':true
        },(error, tweet, response) => {
        })
        console.log(`follow ${i.screen_name}`)
      }
    }
    const nextCursor = JSON.parse(response.body).next_cursor_str
    if(nextCursor != 0){
      autoFollowBack(nextCursor)
    }
  })
}
autoFollowBack()

const cronAutoFollowBack = new cron({
  cronTime: '0 0,10,20,30,40,50 * * * *',
  onTick:  () => {
      autoFollowBack()
  },
  start: false,
  timeZone: 'Asia/Tokyo'
})
cronAutoFollowBack.start()