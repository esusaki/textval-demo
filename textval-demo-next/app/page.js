"use client"

import { useState } from "react";
import Timer from "./components/layout/timer";
import Omatsuri from "./components/layout/omatsuri";
import Header from "./components/layout/header";
// import Link from "next/link";
import "./style.css"

export default function Home() {
  const [showTimer, setShowTimer] = useState(false);

  const handleToggle = () => {
    setShowTimer(prevShowTimer => !prevShowTimer);
  };
  return (
    <html id="textval-demo">
      <head>
        <meta property = "og:title" content = "textval demo" />
        <meta property = "og:description" content = "お祭り翻訳の拡張機能textvalのデモページ" />
        <meta property = "og:image" content = "https://demo-textval.vercel.app/images/top-page-ogp.png"/>

        <meta name="twitter:title" content="textval" />
        <meta name = "twitter:card" content = "summary_large_image" />
      </head>
      <body>
        <Header />
        {/* <header>
          <nav>
            <div id='headerRebbon'>
              <a 
                href="https://chromewebstore.google.com/detail/textval/edhdcmcmaiakchhcembkhonndipcmeob?hl=ja&utm_source=ext_sidebar"
                target="blank_"
              >
                拡張機能はこちら
              </a>
            </div>
          </nav>
          <h2 className="flex-container">
            <Link href="/" target="blank_">
              <img src="images/odango.gif" width="300px" />
            </Link>
            <div id="kirikae-button">
              <img 
                src="images/kirikae-button.png" 
                alt="切り替えボタン" 
                width="30px" 
                id="switch-button" 
                onClick={handleToggle}
              />
            </div>
          </h2>
        </header> */}
        <div className="flex-container">
          <div id="kirikae-button">
            <img 
              src="images/kirikae-button.png" 
              alt="切り替えボタン" 
              width="30px" 
              id="switch-button" 
              onClick={handleToggle}
            />
          </div>
          {showTimer ? <Timer /> : <Omatsuri />}
        </div>
      </body>
    </html>
  );
}
