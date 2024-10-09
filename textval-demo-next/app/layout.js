export const metadata = {
  title: "textval-demo",
  description: "お祭り翻訳の拡張機能「textval」のデモページ",
};

export default function RootLayout({ children }) {
  return (
     <html lang="ja">
      <body style={{"margin":"0px"}}>
        {children}
      </body>
    </html>
  );
}
