//function translate(){
 //   text_area = document.getElementById('text_area');
 //   const word = text_area.value;
 //   alert(word);
//}

const ok_button = document.getElementById('ok_button');
var result = document.getElementById('result');

const bgm_area = document.getElementById('bgm_area');

ok_button.addEventListener(
    "click",function(){
        const text_area = document.getElementById('text_area');
        var w = text_area.value;

        result.innerHTML = '<div style="text-align:center;color: aliceblue;"><br>ローディングしていやす...<br><br><img src="image.gif" width="300px"></div>'

        bgm_area.innerHTML += '<audio src="maou_bgm_ethnic09.mp3" autoplay loop></audio>'
        const au = document.getElementsByTagName('audio')[0];
        au.volume = 0.3;

        // const body = document.getElementsByTagName('body')[0];
        // body.style = "text-align: center;background-color: rgb(44, 48, 57, 0.84);"

        kuromoji.builder({ dicPath: "dict" }).build(function (err, tokenizer) {
            var path = tokenizer.tokenize(w);
            // console.log(path);
            omatsurify(path);
         });
    }
)

function norn_first_asshi(surface_form){
    const norn_first = [
      '私', 'わたし', 'ワタシ', 'わたくし', 'ワタクシ', 'あたし', 'アタシ',
      '俺', 'おれ', 'オレ', '僕', 'ぼく', 'ボク', 
      'おら', 'オラ', 'おいら', 'オイラ',
      'わい', 'ワイ', 'わし', 'ワシ',
    ];
    if (norn_first.includes(surface_form)) {
      return 1;
    }
  }
  // 二人称→おめえ、おめえさん、てめえ
  function norn_second_omee(surface_form){
    const norn_second = [
      'あなた', 'アナタ',
      '君', 'きみ', 'キミ', 
      'お前', 'おまえ', 'オマエ',
    ];
    if (norn_second.includes(surface_form)) {
      return 1;
    }
  }
  // 五段活用の連用形
  function verb_whitch(basic_form){
    const verb_godan_basic = ["く", "ぐ", "す", "つ", "ぬ", "ぶ", "む", "る", "う"];
    const verb_godan_renyou = ["き", "ぎ", "し", "ち", "に", "び", "み", "り", "い"];
    return verb_godan_renyou[verb_godan_basic.indexOf(basic_form.slice(-1))]
  }

function omatsurify(tokens){
    const backgroundUrl = "matsuri-background.png";

    // 背景を変更するスタイルを作成
    const backgroundStyleContent = `
    body {
      background-image: url('${backgroundUrl}') !important;
      background-size: cover !important;
      background-repeat: no-repeat !important;
      background-attachment: fixed !important;
      background-size: 100% auto;
      background-color:rgba(255,255,255,0.1);
      background-blend-mode:lighten;
    }
    `;
    // 背景用のスタイル要素を作成してページに追加
    const backgroundStyleElement = document.createElement('style');
    backgroundStyleElement.textContent = backgroundStyleContent;
    document.head.appendChild(backgroundStyleElement);

    // GIF画像用のスタイル要素を作成してページに追加
    const omikoshiUrl = "omikoshi_walking-long.gif";
    const omikoshiImage = document.createElement('img');
    omikoshiImage.src = omikoshiUrl;
    omikoshiImage.style.position = 'fixed';
    omikoshiImage.style.top = '67%';
    omikoshiImage.style.left = '0%';
    omikoshiImage.style.width = '100%'; // 幅を百分率で指定
    omikoshiImage.style.height = 'auto'; // 高さを自動調整
    omikoshiImage.style.zIndex = '1000'; // 他の要素の上に表示するためのスタイル
    omikoshiImage.style.pointerEvents = 'none'; // 画像がクリックを妨げないようにする
    document.body.appendChild(omikoshiImage);

    var newtokens = [];

    for (let i = 0; i < tokens.length; i++) {
        // console.log(tokens[i]);
        if (tokens[i] === undefined || tokens[i].surface_form === ''){
          break;
        // }else if (tokens[i] === undefined || tokens[i+1] === undefined || tokens[i+2] === undefined){
        }else if (!tokens[i+1] || tokens[i+1] === undefined){
          tokens.push({surface_form: ''});
        }else if (!tokens[i+2] ||tokens[i+2] === undefined){
          tokens.push({surface_form: ''});
        }
        if (tokens[i].word_type !== "KNOWN"){
          newtokens.push(tokens[i].surface_form);
        }else if (norn_first_asshi(tokens[i].surface_form)){
          // 一人称→あっし
          newtokens.push('あっし');
        }else if (norn_second_omee(tokens[i].surface_form)){
          // 二人称→おめえ、おめえさん、てめえ
          newtokens.push('おめえ');
        }else if (tokens[i].pos_detail_3 === "姓" && tokens[i+1].pos_detail_1 === "接尾"){
          // 三人称→◯◯の旦那
          newtokens.push(tokens[i].surface_form);
          newtokens.push('の');
          newtokens.push('旦那');
          i += 1;
        }else if (tokens[i].surface_form === 'て' && tokens[i].pos_detail_1 === '接続助詞'){
          // 〜ています→〜とります
          if (tokens[i+1].basic_form === 'ます' && tokens[i+1].pos === '助動詞'){
            newtokens.push('と');
            newtokens.push('り');
            if (tokens[i+1].surface_form === 'ます' && tokens[i+1].pos === '助動詞'){
              newtokens.push('やす');
            }else if (tokens[i+1].surface_form === 'まし' && tokens[i+1].pos === '助動詞'){
              // 〜ました→〜やした
              newtokens.push('やし');
            }else if (tokens[i+1].surface_form === 'ませ' && tokens[i+1].pos === '助動詞'){
              // 〜ません→〜やせん
              newtokens.push('やせ');
            } else {
              newtokens.push(tokens[i+1].surface_form);
            }
            i += 1;
          } else if (tokens[i+1].surface_form === 'い' && tokens[i+1].pos === '動詞'){
            if (tokens[i+2].basic_form === 'ます' && tokens[i+2].pos === '助動詞'){
              newtokens.push('と');
              newtokens.push('り');
              if (tokens[i+2].surface_form === 'ます' && tokens[i+2].pos === '助動詞'){
                newtokens.push('やす');
              }else if (tokens[i+2].surface_form === 'まし' && tokens[i+2].pos === '助動詞'){
                // 〜ました→〜やした
                newtokens.push('やし');
              }else if (tokens[i+2].surface_form === 'ませ' && tokens[i+2].pos === '助動詞'){
                // 〜ません→〜やせん
                newtokens.push('やせ');
              } else {
                newtokens.push(tokens[i+2].surface_form);
              }
              i += 2;
            }else {
              newtokens.push(tokens[i].surface_form);
              newtokens.push(tokens[i+1].surface_form);
              i += 1;
            }
          }else if (tokens[i+1].surface_form === 'しまう' && tokens[i+1].pos === '動詞'){
            // 〜てしまう、〜ちゃう→〜ちまう、〜やがる
            // // 動詞かつ　基本形が「ちゃう」→「ちゃ」を「ちま」に置き換え
            // // 助詞「て」＋（動詞かつ　基本形が「しまう」）→「しま」を「ちま」に置き換え
            newtokens.push('ちまう');
            i += 1;
          }else if (tokens[i+1].surface_form === 'しま' && tokens[i+1].pos === '動詞'){
            newtokens.push("ちま");
            i += 1;
          }else if (tokens[i+1].surface_form === 'しまっ' && tokens[i+1].pos === '動詞'){
            newtokens.push("ちまっ");
            i += 1;
          }else if (tokens[i+1].surface_form === 'しまい' && tokens[i+1].pos === '動詞'){
            newtokens.push("ちまい");
            i += 1;
          }else{
            newtokens.push(tokens[i].surface_form);
          }
        }else if (tokens[i].pos === '動詞' && tokens[i+1].surface_form === 'ちゃっ' && tokens[i+1].pos === '動詞'){
          newtokens.push(tokens[i].surface_form);
          newtokens.push("ちまっ");
          i += 1;
        }else if (tokens[i].pos === '動詞' && tokens[i+1].surface_form === 'ちゃ' && tokens[i+1].pos === '動詞'){
          newtokens.push(tokens[i].surface_form);
          newtokens.push("ちま");
          i += 1;
        }else if (tokens[i].pos === '動詞' && tokens[i+1].surface_form === 'ちゃい' && tokens[i+1].pos === '動詞'){
          newtokens.push(tokens[i].surface_form);
          newtokens.push("ちまい");
          i += 1;
        }else if (tokens[i].surface_form === 'で' && tokens[i].pos_detail_1 === '接続助詞'){
          // 〜でいます→〜どります
          if (tokens[i+1].basic_form === 'ます' && tokens[i+1].pos === '助動詞'){
            newtokens.push('ど');
            newtokens.push('り');
            if (tokens[i+1].surface_form === 'ます' && tokens[i+1].pos === '助動詞'){
              newtokens.push('やす');
            }else if (tokens[i+1].surface_form === 'まし' && tokens[i+1].pos === '助動詞'){
              // 〜ました→〜やした
              newtokens.push('やし');
            }else if (tokens[i+1].surface_form === 'ませ' && tokens[i+1].pos === '助動詞'){
              // 〜ません→〜やせん
              newtokens.push('やせ');
            } else {
              newtokens.push(tokens[i+1].surface_form);
            }
            i += 1;
          } else if (tokens[i+1].surface_form === 'い' && tokens[i+1].pos === '動詞'){
            if (tokens[i+2].basic_form === 'ます' && tokens[i+2].pos === '助動詞'){
              newtokens.push('ど');
              newtokens.push('り');
              if (tokens[i+2].surface_form === 'ます' && tokens[i+2].pos === '助動詞'){
                newtokens.push('やす');
              }else if (tokens[i+2].surface_form === 'まし' && tokens[i+2].pos === '助動詞'){
                // 〜ました→〜やした
                newtokens.push('やし');
              }else if (tokens[i+2].surface_form === 'ませ' && tokens[i+2].pos === '助動詞'){
                // 〜ません→〜やせん
                newtokens.push('やせ');
              } else {
                newtokens.push(tokens[i+2].surface_form);
              }
              i += 2;
            } else {
              newtokens.push(tokens[i].surface_form);
              newtokens.push(tokens[i+1].surface_form);
              i += 1;
            }
          }else{
            newtokens.push(tokens[i].surface_form);
          }
        }else if (tokens[i].surface_form === 'ます' && tokens[i].pos === '助動詞'){
          // 〜ます→〜やす
          newtokens.push('やす');
        }else if (tokens[i].surface_form === 'まし' && tokens[i].pos === '助動詞'){
          // 〜ました→〜やした
          newtokens.push('やし');
        }else if (tokens[i].surface_form === 'ませ' && tokens[i].pos === '助動詞'){
          // 〜ません→〜やせん
          newtokens.push('やせ');
        }else if ((tokens[i].surface_form === 'ない' || tokens[i].reading === 'ナイ') && (tokens[i].pos === '助動詞' || tokens[i].pos === '形容詞')){
          // 〜ない→〜ねぇ
          newtokens.push('ねぇ');
        }else if (tokens[i].surface_form === 'ください' || tokens[i].reading === 'クダサイ'){
          // 〜ください→〜くだせぇ
          // // 動詞かつ読み方が「クダサイ」→「くだせぇ」に置き換え
          newtokens.push('くだせぇ');
        }else if (tokens[i].surface_form === 'という' && tokens[i].pos === '助詞') {
          // 助詞「という」→「ってぇ」
          newtokens.push('ってぇ');
        } else if (tokens[i].surface_form === 'と' && tokens[i].pos === '助詞' && tokens[i + 1].surface_form === 'の' && tokens[i + 1].pos === '助詞') {
          // 引用の助詞「と」＋助詞「の」→「ってぇ」
          newtokens.push('っ');
          newtokens.push('てぇ');
          i += 1;
        } else if (tokens[i].surface_form === 'を' && tokens[i].pos === '助詞' && tokens[i + 1].surface_form === '、' && tokens[i + 1].pos === '記号') {
          // 助詞「を」＋記号「、」→「をだな、」
          newtokens.push('をだな');
          newtokens.push('、');
          i += 1;
        } else if (tokens[i].pos === '動詞' && tokens[i + 1].surface_form === 'たい' && tokens[i + 1].pos === '助動詞') {
          // 動詞＋助動詞「たい」→動詞＋「てぇ」
          newtokens.push(tokens[i].surface_form);
          newtokens.push('てぇ');
          i += 1;
        }else if (tokens[i].surface_form === 'ござい' && tokens[i].pos === '助動詞') {
          // 助動詞「ござい」→「ごぜぇ」
          newtokens.push('ごぜぇ');
        } else if (tokens[i].surface_form === 'たく' && tokens[i].pos === '助動詞' && tokens[i + 1].surface_form === 'ない' && tokens[i + 1].pos === '助動詞') {
          // 助動詞「たく」＋助動詞「ない」→「たかぁねぇ」
          newtokens.push('たかぁ');
          newtokens.push('ねぇ');
          i += 1;
        } else if (tokens[i].surface_form === 'ござい' && tokens[i].pos === '助動詞') {
          // 助動詞「ござい」→「ごぜぇ」
          newtokens.push('ごぜぇ');
        } else if (tokens[i].surface_form === 'たく' && tokens[i].pos === '助動詞' && tokens[i + 1].surface_form === 'ない' && tokens[i + 1].pos === '助動詞') {
          // 助動詞「たく」＋助動詞「ない」→「たかぁねぇ」
          newtokens.push('たかぁ');
          newtokens.push('ねぇ');
          i += 1;
        } else if (tokens[i].pos === '名詞' && 
                   (tokens[i + 1].surface_form === 'だ' || tokens[i + 1].surface_form === 'です') && 
                   tokens[i + 1].pos === '助動詞'
                  ) {
          // 名詞 + 助動詞「だ」「です」→ 名詞 + 「でい」
          // if (tokens[i + 2] && (tokens[i + 2].surface_form === '！' || tokens[i + 2].surface_form === '。' || tokens[i + 2].surface_form === '\n' || tokens[i + 2].surface_form === '')) {
          if (tokens[i + 2] && (tokens[i + 2].surface_form === '！' || tokens[i + 2].surface_form === '。' || tokens[i + 2].surface_form === '\n')) {
            newtokens.push(tokens[i].surface_form); 
            newtokens.push('でい');
            i += 1; 
          } else if (tokens[i + 2] && tokens[i + 2].pos === '終助詞') {
            // 助動詞「だ」「です」＋終助詞の場合も「でい」に変換
            newtokens.push(tokens[i].surface_form);
            newtokens.push('でい');
            i += 2;  
          } else {
            newtokens.push(tokens[i].surface_form);
            newtokens.push(tokens[i + 1].surface_form);
            i += 1;
          }
        }else if (tokens[i].pos === "名詞" && (tokens[i + 1].surface_form === '！' || tokens[i + 1].surface_form === '。' || tokens[i + 1].surface_form === '\n' || tokens[i + 1].surface_form === '')){
          // 文末かつ（名詞）→（名詞）でい
          newtokens.push(tokens[i].surface_form);
          newtokens.push('でい');
        }else if (tokens[i].pos === "助動詞" && tokens[i].basic_form === "です" && 
          (!(tokens[i + 1].surface_form === '！' || tokens[i + 1].surface_form === '。' || tokens[i + 1].surface_form === '\n' || tokens[i + 1].surface_form === '') ||
          !(tokens[i + 2].surface_form === '！' || tokens[i + 2].surface_form === '。' || tokens[i + 2].surface_form === '\n' || tokens[i + 2].surface_form === '') ||
          (tokens[i + 3]  && !(tokens[i + 3].surface_form === '！' || tokens[i + 3].surface_form === '。' || tokens[i + 3].surface_form === '\n' || tokens[i + 3].surface_form === '')))
        ){
          // （文末ではない）かつ　助動詞　かつ　基本形＝「です」→「で」を「でごぜぇま」に置き換え
          if (tokens[i].surface_form === 'です'){
            newtokens.push('でごぜぇやす');
          }else if (tokens[i].surface_form === 'でし'){
            newtokens.push('でごぜぇやし');
          }else if (tokens[i].surface_form === 'でしょ'){
            newtokens.push('でごぜぇやしょ');
          }else {
            newtokens.push(tokens[i].surface_form);
          }
        }else if (
          tokens[i].pos === "動詞" && (tokens[i].conjugated_type === "一段" || tokens[i].conjugated_type === "サ変・スル") &&
          tokens[i + 1].basic_form === "た" && tokens[i + 1].pos === "助動詞" && 
          (tokens[i + 2].surface_form === '！' || tokens[i + 2].surface_form === '。' || tokens[i + 2].surface_form === '\n' || tokens[i + 2].surface_form === '')
        ){
          // 文末　かつ　（動詞　かつ　一段活用）＋（助動詞「た」）→「た」を「やした」に置き換え
          newtokens.push(tokens[i].surface_form);
          newtokens.push('やし');
        }else if (
          tokens[i].pos === "動詞" && tokens[i].conjugated_type.slice(0, 2) === "五段" &&
          tokens[i + 1].basic_form === "た" && tokens[i + 1].pos === "助動詞" && 
          (tokens[i + 2].surface_form === '！' || tokens[i + 2].surface_form === '。' || tokens[i + 2].surface_form === '\n' || tokens[i + 2].surface_form === '')
        ){
          // 文末 かつ（動詞　かつ　五段活用◯行）＋（助動詞「た」）→ 動詞の最後の１文字を（◯行のイ段の１文字）で置き換える ＋「た」を「やした」に置き換る
          newtokens.push(tokens[i].surface_form.slice(0, -1));
          newtokens.push(verb_whitch(tokens[i].basic_form));
          newtokens.push('やし');
        }else if (
          tokens[i].pos === "動詞" && tokens[i].conjugated_type === "一段" && (tokens[i].basic_form === tokens[i].surface_form) &&
          ((tokens[i + 1].surface_form === '！' || tokens[i + 1].surface_form === '。' || tokens[i + 1].surface_form === '\n' || tokens[i + 1].surface_form === ''))
        ){
          // 文末　かつ　（一段活用の動詞）→ 動詞の最後の１文字を「やす」で置き換え
          newtokens.push(tokens[i].surface_form.slice(0, -1));
          newtokens.push('やす');
        }else if (
          tokens[i].pos === "動詞" && tokens[i].conjugated_type.slice(0, 2) === "五段" && (tokens[i].basic_form === tokens[i].surface_form) &&
          (tokens[i + 1].surface_form === '！' || tokens[i + 1].surface_form === '。' || tokens[i + 1].surface_form === '\n' || tokens[i + 1].surface_form === '')
        ){
          // 文末　かつ　（動詞　かつ　一段活用）→（動詞）を（動詞）やすに置き換え
          newtokens.push(tokens[i].surface_form.slice(0, -1));
          newtokens.push(verb_whitch(tokens[i].basic_form));
          newtokens.push('やす');
        }else if (tokens[i].pos === "形容詞" && 
          (tokens[i + 1].surface_form === '！' || tokens[i + 1].surface_form === '。' || tokens[i + 1].surface_form === '\n' || tokens[i + 1].surface_form === '')
        ){
          // 文末の（形容詞）→（形容詞）でごぜぇやす
          newtokens.push(tokens[i].surface_form);
          newtokens.push('でごぜぇやす');
        }else if (tokens[i].pos === "形容詞" &&
          ((tokens[i + 1].surface_form === "です" && tokens[i + 1].pos === "助動詞") || tokens[i + 1].pos_detail_1 === "終助詞") &&
          (tokens[i + 2].surface_form === '！' || tokens[i + 2].surface_form === '。' || tokens[i + 2].surface_form === '\n' || tokens[i + 2].surface_form === '')
        ){
          // 文末の（形容詞）＋助動詞「です」→（形容詞）でごぜぇやす
          newtokens.push(tokens[i].surface_form);
          newtokens.push('でごぜぇやす');
          // 文末の（形容詞）＋（任意の終助詞１つ）→（形容詞）を（形容詞）でごぜぇやすに置き換え
          // 文末の（形容詞）＋助動詞「です」＋（任意の終助詞１つ）→（形容詞）を（形容詞）でごぜぇやすに置き換え
          if (tokens[i + 1].pos_detail_1 === "終助詞"){
            newtokens.push(tokens[i + 1].surface_form);
          }
          i += 1;
        }else {
          newtokens.push(tokens[i].surface_form);
        }
    }
    // ここから追加したコード
    // 文末にお祭りっぽい絵文字を追加
    const festivalEmojis = ['👘', '🎆', '🏮'];
    const sentenceEndingPunctuation = ['。', '！', '？', '!', '?'];

    for (let i = 0; i < newtokens.length; i++) {
        if (sentenceEndingPunctuation.includes(newtokens[i])) {
          const randomEmoji = festivalEmojis[Math.floor(Math.random() * festivalEmojis.length)];
          newtokens.splice(i + 1, 0, randomEmoji);
          i++; // 絵文字を追加したのでインデックスを進める
        }
    }
    // 追加部分ここまで

    result.innerHTML = (newtokens.join(''))
    result.style = "width: 30%; text-align: center; font-size: 2em; color:white; font-weight: bold; margin-top: 20px;"
}