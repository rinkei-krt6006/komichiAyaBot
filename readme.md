小路綾bot

きんいろモザイク原作1巻のアヤヤの発言を文字列化し、形態素解析を行いマルコフ連鎖により文字列を生成してツイートするプログラムです。  

著作権の都合上アヤヤのセリフは付属しません。   

keitaiso.jsで単語ごとに分割したファイルを生成、index.jsで再構成してtwitter.jsでツイートという役割分担になっています。  

keitaiso.jsで./dataの中にkeitaiso-(timestamp).txtを生成し、それをindex.jsで利用します。  

インストール、使用方法  

1 `$ git clone`します  

2 `$ npm install`します  

3 文字列を書き込んだファイル(改行区切りで別の文と認識します)を ./data/original に配置し、`$ node keitaiso.js`します。  

4 3により競合を防ぐためにtimestampをつけたファイルが ./data に生成されるので、適切にkeitaiso.txtとリネームします  

5 index.jsのtalk()で発言が取得できます。引数に文字列を渡すことでその単語から開始される発言の取得も可能です


6 ./.envにtwitterAPIkeyを適切に設定します  

7 `$ node twitter.js`すると10分ごとにツイートされます　 

更新履歴

2018.03.23  ｖ1.0.0  初回commit

2018.03.24  ｖ1.0.1  "しね"と発言する問題を解決

2018.04.11  ｖ1.0.2  短文投稿する問題を解決

2018.09.15  v1.0.3  綾誕おめでとうございます。バグ修正安定化

2018.09.28  v1.0.4  会話機能の追加

2018.10.03  v1.0.5  リファクタリング

2018.10.04  v1.0.6  talk機能とtwitter機能の分離

2018.10.11  v1.0.7  reply機能とtwitter機能の分離