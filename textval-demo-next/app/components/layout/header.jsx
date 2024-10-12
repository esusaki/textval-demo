import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header>
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
      <h2>
        <Link href="/" target="blank_">
          <img src="images/odango.gif" width="300px" />
        </Link>
      </h2>
    </header>
  )
}

export default Header