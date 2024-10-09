"use client"

import { useState } from "react";
import convertText from "./convert";
import "./style.css"

export default function Home() {

  const [userInput, setUserInput] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function buttonClicked() {
    setIsLoading(true);

    const inputText = userInput;
    setUserInput("");
    const result = await convertText(inputText);
    await setDisplayText(result);
    setIsLoading(false);
  }

  return (
    <div style={{"textAlign":"center","padding":"10px"}}>
      <header>
        <h2>
          <a href="https://chromewebstore.google.com/detail/textval/edhdcmcmaiakchhcembkhonndipcmeob?hl=ja&utm_source=ext_sidebar" target="blank_">
            <img src="images/odango.gif" width="300px" />
          </a>
        </h2>
      </header>

      <main>
        <span id="bgm_area"></span>

        <textarea rows = "5" id = "textInput" value={userInput} onChange={(e) => { setUserInput(e.target.value) }}></textarea>
        <button onClick={() => { buttonClicked() }} id="ok_button">OKでい</button>

        {isLoading ? <div style={{"text-align":"center"}}>ローディングしていやす...<br/><img src="images/loading.gif" width="300px"/></div> : ""}

        {displayText === "" ?
          // 結果がなかったら何も表示しない
          ""
          // 結果があったら表示する
          : <div style={{ "width": "50%","margin":"auto", "text-align": "center", "font-size": "2em", "color": "white", "font-weight": "bold", "margin-top": "20px" }}>
            {displayText}
              <div>
                <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-text={'textvalでお祭り翻訳しました！'} data-url={encodeURI("https://ogp-test-omega.vercel.app/show-ogp/" + displayText)} data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
              </div>
          </div>
        }
      </main>
    </div>
  );
}
