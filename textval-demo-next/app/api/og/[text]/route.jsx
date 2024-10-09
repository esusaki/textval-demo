import { ImageResponse } from 'next/og';
import fs from "fs";
import path from 'path';
// App router includes @vercel/og.
// No need to install it.

export async function GET(req, {params}) {
  var {text} = params;

  if (text.length > 90){
    text = text.slice(0,90);
    text = text + "...";  
  }

const fontPath = path.join(process.cwd(), 'app', 'fonts', 'KouzanBrushFont.ttf');
const fontData = fs.readFileSync(fontPath);

  return new ImageResponse(
    (
      <div
        style={{
          backgroundImage: "url(localhost:3000/ogp_background.png)",
          color: 'white',
          background: 'black',
          width: '100%',
          height: '100%',
          padding: '20px 30px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily:'"Kouzan"',
          fontSize: 60
        }}
      >
        {text}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts : [
        {
          name : "KouzanBrushFont",
          data : fontData
        }
      ]
    },
  );
}