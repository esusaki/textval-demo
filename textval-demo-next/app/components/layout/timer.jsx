"use client"

import "@/app/style.css";
import { useState, useEffect, useRef } from "react";
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

// 通知を送る関数を作成
const sendRestNotification = () => {
  if (Notification.permission === 'granted') {
    new Notification('お疲れ様でごぜぇやす！🏮', {
      body: 'そろそろ休憩しねぇ？👘',
      icon: 'images/happy-happi-last.png'
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('お疲れ様でごぜぇやす！🏮', {
          body: 'そろそろ休憩しねぇ？👘',
          icon: 'images/happy-happi-last.png'
        });
      }
    });
  }
};

// 通知を送る関数を作成
const sendWorkNotification = () => {
  if (Notification.permission === 'granted') {
    new Notification('作業時間でい！🏮', {
      body: '調子はどうでごぜぇやすか？🎆',
      icon: 'images/happy-happi-first.png'
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('作業時間でい！🏮', {
          body: '調子はどうでごぜぇやすか？🎆',
          icon: 'images/happy-happi-first.png'
        });
      }
    });
  }
};

export default function Timer(){
  const [startTime, setStartTime] = useState(25);
  const [stopTime, setStopTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(startTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPeriod, setIsWorkPeriod] = useState(true);

  const [omikoshiUrl, setOmikoshiUrl] = useState("");
  const [omikoshiDescription, setOmikoshiDescription] = useState("");

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // setTimeLeft(isWorkPeriod ? stopTime * 60 : startTime * 60);
      if (isWorkPeriod) {
        setTimeLeft(stopTime > 0 ? stopTime * 60 : 1); // 休憩時間が0秒の場合は1秒に設定
      } else {
        setTimeLeft(startTime > 0 ? startTime * 60 : 1); // 作業時間が0秒の場合は1秒に設定
      }
      setIsWorkPeriod(!isWorkPeriod);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, startTime, stopTime]);

  // 前回のisWorkPeriodの状態を保持するためのrefを作成
  const prevIsWorkPeriod = useRef();

  useEffect(() => {
    // isWorkPeriodがtrueに変化したときに一度だけ通知を送る
    if (isWorkPeriod) {
      removeBackgroundImage();
      if (isRunning && prevIsWorkPeriod.current !== isWorkPeriod){
        sendWorkNotification();
      }
      const sounds = document.getElementById('sounds');
      if (sounds) {
        sounds.pause();
        sounds.currentTime = 0;
      }
    } else if (!isWorkPeriod) {
      addBackgroundImage();
      if (isRunning && prevIsWorkPeriod.current !== isWorkPeriod){
        sendRestNotification(); 
      }
      const sounds = document.getElementById('sounds');
      if (sounds) {
        sounds.pause();
        sounds.currentTime = 0;
        sounds.volume = 0.3;
        sounds.play();
      }
    }
    updateOmikoshiInfo();

    // 現在のisWorkPeriodの状態をrefに保存
    prevIsWorkPeriod.current = isWorkPeriod;
  }, [isWorkPeriod]);

  const weightedRandom = (items, weights) => {
    const cumulativeWeights = [];
    for (let i = 0; i < weights.length; i++) {
      cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
    }
    const random = Math.random() * cumulativeWeights[cumulativeWeights.length - 1];
    for (let i = 0; i < cumulativeWeights.length; i++) {
      if (random < cumulativeWeights[i]) {
        return items[i];
      }
    }
  };

  const updateOmikoshiInfo = () => {
    const seasonInfo = getSeason();
    let url;
    let description;

    if (seasonInfo.season == "Normal"){
      url = "images/omikoshi_walking-long.gif";
      description = "お祭りでい";
    } else if (seasonInfo.season == "NewYear_snake"){
      url = "images/NewYear_snake.gif";
      if (seasonInfo.daysUntilEvent === 0) {
        description = `1/1 元旦<br>------------------------<br>今日はお正月🎍`;
      } else {
        description = `1/1 元旦<br>------------------------<br>あと ${seasonInfo.daysUntilEvent}日`;
      }
    } else {
      const christmasImg = ['images/Christmas.gif', 'images/Christmas_south.gif'];
      const weights = [0.75, 0.25]; // 'images/Christmas.gif'の確率75%、'images/Christmas_south.gif'の確率25%
      url = weightedRandom(christmasImg, weights);
      if (seasonInfo.daysUntilEvent === 0) {
        description = `12/25 クリスマス<br>------------------------<br>今日はクリスマス🎄`;
      } else {
        description = `12/25 クリスマス<br>------------------------<br>あと ${seasonInfo.daysUntilEvent}日`;
      }
    }

    setOmikoshiUrl(url);
    setOmikoshiDescription(description);
  };

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
        <p style={{ fontSize: '18px', letterSpacing: '6px', color: 'white' }}>ポモドーロタイマーでい</p>

        <div style={{ fontSize: '20px' }} id="timeFormContainer">
          <div className="timeForm"> 💻作業 
            <input 
              type="number"
              value={startTime}
              id="sagyouTimeInput"
              onChange={(e) => { setStartTime(e.target.value); setTimeLeft(e.target.value * 60); }}
              style={{ textAlign: 'center', margin: '5px', borderRadius: '5px', backgroundColor: 'white', border: 'none', fontSize: '26px', width: '60px', color: '#555' }}
            />
                分
          </div>
          <div className="timeForm"> 🏮休憩 
            <input 
              type="number"
              value={stopTime}
              id="kyukeiTimeInput"
              onChange={(e) => { setStopTime(e.target.value) }}
              style={{ textAlign: 'center', margin: '5px', borderRadius: '5px', backgroundColor: 'white', border: 'none', fontSize: '26px', width: '60px', color: '#555' }}
            />
              分
          </div>
        </div>

        <div id="showTimer">
          <div style={{ marginTop: '12px', color: 'white' }}>
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
