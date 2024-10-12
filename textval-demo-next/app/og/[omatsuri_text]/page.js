"use client"
import { useEffect } from "react";
import "../../style.css"

export default function showOGP({params}){
    useEffect(
        ()=>{
            setTimeout(
                ()=>{
                    if (typeof window !==undefined){
                        window.location.href = "/";
                    }
                }, 1
            )
        }
    )

    const {omatsuri_text}= params;

    return (
        <html>
            <head>
                <meta property = "og:title" content = "textval-demo"></meta>
                <meta property = "og:description" content = "お祭り翻訳の拡張機能textvalのデモページ"></meta>
                <meta property = "og:image" content = {`https://textval-demo.vercel.app/api/og/${omatsuri_text}`}></meta>

                <meta name="twitter:title" content="textval" />
                <meta name = "twitter:card" content = "summary_large_image" />
            </head>
            <body>
            </body>
        </html>
    )
}