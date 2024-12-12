"use client"

import "@/app/style.css";
import { useState, useEffect } from "react";
import { getSeason } from "@/app/components/layout/omatsuri";;

function addBackgroundImage() {
  const backgroundUrl = "images/matsuri-background.png";

  // 背景を変更するスタイルを作成
  const backgroundStyleContent = `
  body {
    background-image: url('${backgroundUrl}') !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
    background-size: 100% auto;
    background-blend-mode:lighten;
    background-position: 0 98px; 
  }
  `;

  // 背景用のスタイル要素を作成してページに追加
  const backgroundStyleElement = document.createElement('style');
  backgroundStyleElement.id = 'backgroundStyle';
  backgroundStyleElement.textContent = backgroundStyleContent;
  backgroundStyleElement.style.position = 'relative';
  document.head.appendChild(backgroundStyleElement);
}

function removeBackgroundImage() {
  const backgroundStyleElement = document.getElementById('backgroundStyle');
  if (backgroundStyleElement) {
    backgroundStyleElement.remove(); // スタイル要素を削除
    // console.log("Background image removed");
  } else {
    // console.log("No background image found to remove");
  }
} 

export default function Timer(){
  const [startTime, setStartTime] = useState(25);
  const [stopTime, setStopTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(startTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPeriod, setIsWorkPeriod] = useState(true);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsWorkPeriod(!isWorkPeriod);
      setTimeLeft(isWorkPeriod ? stopTime * 60 : startTime * 60);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, startTime, stopTime]);

  useEffect(() => {
    if (!isWorkPeriod) {
      addBackgroundImage();
      const sounds = document.getElementById('sounds');
      if (sounds) {
        sounds.pause();
        sounds.currentTime = 0;
        sounds.volume = 0.3;
        sounds.play();
      }
    } else {
      removeBackgroundImage();
      const sounds = document.getElementById('sounds');
      if (sounds) {
        sounds.pause();
        sounds.currentTime = 0;
      }
    }
  }, [isWorkPeriod]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(startTime * 60);
    setIsWorkPeriod(true);
    setIsRunning(false);
    // console.log("Reset button clicked");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

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
      {/* <div id="tab_pomodoro" style={{ display: 'none' }}> */}
      <div id="tab_pomodoro">
        <p style={{ fontSize: '14px', letterSpacing: '2px', color: 'white' }}>ポモドーロタイマーでい</p>

        <div style={{ fontSize: '16px' }} id="timeFormContainer">
          <div className="timeForm"> 💻作業 
            <input 
              type="number"
              value={startTime}
              id="sagyouTimeInput"
              onChange={(e) => { setStartTime(e.target.value); setTimeLeft(e.target.value * 60); }}
              style={{ textAlign: 'center', margin: '5px', borderRadius: '5px', backgroundColor: 'white', border: 'none', fontSize: '22px', width: '60px', color: '#555' }}
            />
                分
          </div>
          <div className="timeForm"> 🏮休憩 
            <input 
              type="number"
              value={stopTime}
              id="kyukeiTimeInput"
              onChange={(e) => { setStopTime(e.target.value) }}
              style={{ textAlign: 'center', margin: '5px', borderRadius: '5px', backgroundColor: 'white', border: 'none', fontSize: '22px', width: '60px', color: '#555' }}
            />
              分
          </div>
        </div>

        <div id="showTimer">
          <div style={{ margin: '5px', color: 'white' }}>
            <span id="periodLabel">{isWorkPeriod ? '💻作業' : '🏮休憩'}</span> 
            <span className="timer">{formatTime(timeLeft)}</span>
          </div>
        </div>
        {
          isRunning ? (
            <button className="pomodoro_buttons" style={{ backgroundColor: 'rgb(50, 138, 173)' }} id="stopButton" onClick={handleStop} disabled={!isRunning}>⏸︎ 停止</button>
          ) : (
            <button className="pomodoro_buttons" style={{ backgroundColor: '#884' }} id="startButton" onClick={handleStart} disabled={isRunning}>▶ 開始</button>
          )
        }
        <button className="pomodoro_buttons" style={{ backgroundColor: '#e77' }} id="resetButton" onClick={handleReset}>■ 終了</button>
        <audio id="sounds" src="maou_bgm_ethnic09.mp3" preload="auto"></audio>
      </div>
      {
        isWorkPeriod ? (
        // 結果がなかったら何も表示しない
          ""
        // 結果があったら表示する
        ) : (
          <>
            <div className="omikoshiImage" onMouseMove={handleMouseMove}>
              <img src={omikoshiUrl} id="omikoshi" alt="Omikoshi"></img>
              <div
                className="omikoshiText"
                style={tooltipStyle}
                dangerouslySetInnerHTML={{
                  __html: omikoshiDescription,
                }}
              >
              </div>
            </div>
          </>          
        )
      }
    </main>
  )
}
