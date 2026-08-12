import React from "react";
import SiteHeader from "./SiteHeader";
import Hero from "./Hero";
import Gallery from "./Gallery";
import Colophon from "./Colophon";
import SiteFooter from "./SiteFooter";

const AppLayout = () => (
  <div className="shell">
    <SiteHeader />
    <main>
      <Hero />
      <Gallery />
      <Colophon />
    </main>
    <SiteFooter />
  </div>
);

export default AppLayout;
