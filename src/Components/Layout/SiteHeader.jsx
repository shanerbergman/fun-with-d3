import React from "react";

const SiteHeader = () => (
  <header className="site-header">
    <div className="wrap site-header__inner">
      <div className="wordmark">
        <span className="wordmark__name">Fun with D3</span>
        <span className="wordmark__tag">React + D3 sketchbook</span>
      </div>
      <nav className="site-nav">
        <a href="#toys">Toys</a>
        <a href="#charts">Charts</a>
        <a href="#maps">Maps</a>
        <a href="#colophon">About</a>
        <a
          className="btn"
          href="https://shanebergman.com"
          target="_blank"
          rel="noreferrer"
        >
          shanebergman.com
        </a>
      </nav>
    </div>
  </header>
);

export default SiteHeader;
