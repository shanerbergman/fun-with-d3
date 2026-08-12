import React from "react";

const SiteFooter = () => (
  <footer className="site-footer">
    <div className="wrap site-footer__inner">
      <span>© {new Date().getFullYear()} Shane Bergman</span>
      <span>d3.shanebergman.com</span>
    </div>
  </footer>
);

export default SiteFooter;
