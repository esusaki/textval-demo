"use client"

import { useState } from "react";
import convertText from "./convert";
import Header from "./components/layout/header";
import "./style.css"

export default function Home() {

  const [userInput, setUserInput] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imgIce, setImgIce] = useState("images/ICE-v3-onoff-first.webp");

  async function buttonClicked() {
    setIsLoading(true);

    // 画像の変更処理
    // const image = document.getElementById('toggleImage');
    setImgIce('images/ICE-v3-onoff.gif');
    setImgIce('images/ICE-v3-onoff-last.webp');

    const inputText = userInput;
    setUserInput("");
    const result = await convertText(inputText);
    await setDisplayText(result);
    setIsLoading(false);
  }

  return (
    <html style={{"textAlign":"center","padding":"50px"}}>
      <head>
        <meta property = "og:title" content = "textval demo" />
        <meta property = "og:description" content = "お祭り翻訳の拡張機能textvalのデモページ" />
        <meta property = "og:image" content = "https://textval-demo.vercel.app/images/top-page-ogp.png"/>

        <meta name="twitter:title" content="textval" />
        <meta name = "twitter:card" content = "summary_large_image" />
      </head>
      <body>
        <Header />
        <main>
          <span id="bgm_area"></span>
          <textarea rows = "5" id = "textInput" value={userInput} onChange={(e) => { setUserInput(e.target.value) }}></textarea>
          {/* <button onClick={() => { buttonClicked() }} id="ok_button">OKでい</button> */}
          <img onClick={() => { buttonClicked() }} src={imgIce} alt="かきごおりのシロップ・スイッチ" width="120px"></img>
          {isLoading ? <div style={{"textAlign":"center","color":"white","fontSize":"2em","margin":"20px"}}>ローディングしていやす...<br/><img src="images/loading.gif" style={{"margin":"10px"}} id="kakigoriiKun"/></div> : ""}
          {displayText === "" ?
            // 結果がなかったら何も表示しない
            ""
            // 結果があったら表示する
            :
            <>
              <div style={{ "width": "50%","margin":"auto", "textAlign": "center", "fontSize": "2em", "color": "white", "fontWeight": "bold", "marginTop": "40px" }}>
                {displayText}
                  <div>
                    <a
                      href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                      className="twitter-share-button"
                      data-text={'textvalでお祭り翻訳しました！'}
                      data-url={encodeURI("https://textval-demo.vercel.app/og/" + displayText)}
                      data-show-count="false"
                    >
                        Tweet
                    </a>
                    {/* charSetは非推奨らしいが、一応エラーは消える */}
                    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
                  </div>
              </div>
              <img src="images/omikoshi_walking-long.gif" id="omikoshi" alt="おみこし"></img>
            </>
          }
        </main>
      </body>
    </html>
  );
}
