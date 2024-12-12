import React from 'react'
import { useState } from "react";
import convertText from '@/app/convert';
import "@/app/style.css";

// 季節を判定する関数
export function getSeason(){
  const now = new Date();
  const currentYear = now.getFullYear();

  const startChristmasMonth = 12;
  const startChristmasDay = 1;
  const endChristmasMonth = 12;
  const endChristmasDay = 25;

  const startChristmas = new Date(currentYear, startChristmasMonth - 1, startChristmasDay); // 12月1日の0時0分から
  const endChristmas = new Date(currentYear, endChristmasMonth - 1, endChristmasDay + 1); // 12月26日の0時0分まで

  const startNewYearMonth = 1;
  const startNewYearDay = 1;
  const endNewYearMonth = 1;
  const endNewYearDay = 7;

  const startNewYear = new Date(currentYear, startNewYearMonth - 1, startNewYearDay); // 1月1日の0時0分から
  const endNewYear = new Date(currentYear, endNewYearMonth - 1, endNewYearDay + 1); // 1月8日の0時0分まで

  if (now >= startChristmas && now <= endChristmas) {
    const daysUntilChristmas = Math.ceil((endChristmas - now) / (1000 * 60 * 60 * 24) - 1);
    return { season: "Christmas", daysUntilEvent: daysUntilChristmas };
  } else if (now >= startNewYear && now <= endNewYear && ((currentYear - 3) % 12 == 6)) {
    const daysUntilNewYear = Math.ceil((endNewYear - now) / (1000 * 60 * 60 * 24) - 1);
    return { season: "NewYear_snake", daysUntilEvent: daysUntilNewYear };
  } else {
    return { season: "None", daysUntilEvent: null };
  }
}

export default function omatsuri() {
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

  const seasonInfo = getSeason();
  var omikoshiUrl;
  var omikoshiDescription;

  if (seasonInfo.season == "Normal"){
    omikoshiUrl = "images/omikoshi_walking-long.gif";
    omikoshiDescription = "お祭りでい";
  } else if (seasonInfo.season == "NewYear_snake"){
    omikoshiUrl = "images/NewYear_snake.gif";
    omikoshiDescription = `1/1 元旦<br>------------------------<br>あと ${seasonInfo.daysUntilEvent}日`;
  }else {
    omikoshiUrl = "images/Christmas.gif";
    omikoshiDescription = `12/25 クリスマス<br>------------------------<br>あと ${seasonInfo.daysUntilEvent}日`;
  }

  const [tooltipStyle, setTooltipStyle] = useState({});

  const handleMouseMove = (e) => {
    const screenWidth = window.innerWidth;
    const tooltipWidth = 200; // ツールチップの幅を適切に設定してください
    let left = e.clientX + 10;
    let top = e.clientY - 20;

    if (e.clientX > screenWidth / 2) {
      left = e.clientX - tooltipWidth - 10;
    } else if (e.clientX < screenWidth / 2) {
      left = e.clientX + 10;
    }

    setTooltipStyle({
      left: left + 'px',
      top: top + 'px',
    });
  };

  return (
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
                  data-url={encodeURI("https://demo-textval.vercel.app/og/" + displayText)}
                  data-show-count="false"
                >
                    Tweet
                </a>
                {/* charSetは非推奨らしいが、一応エラーは消える */}
                <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
              </div>
          </div>
          <div className="omikoshiImage" onMouseMove={handleMouseMove}>
            <img src={omikoshiUrl} id="omikoshi" alt="Omikoshi"></img>
            <div
              className="omikoshiText"
              style={tooltipStyle}
              dangerouslySetInnerHTML={{
                __html: omikoshiDescription
              }}
            >
            </div>
          </div>
        </>
      }
    </main>
  )
}
