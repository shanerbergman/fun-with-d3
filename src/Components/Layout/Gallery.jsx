import React from "react";
import SectionHeading from "./SectionHeading";
import VizCard from "./VizCard";
import sections from "../D3Visualisations/vizManifest";

const Gallery = () => (
  <div className="wrap gallery">
    {sections.map((section, index) => (
      <React.Fragment key={section.id}>
        <SectionHeading
          id={section.id}
          title={section.title}
          meta={section.meta}
          spaced={index > 0}
        />
        <div className={`card-grid card-grid--${section.layout}`}>
          {section.items.map((item) => (
            <VizCard
              key={item.id}
              eyebrow={item.eyebrow}
              title={item.title}
              tag={item.tag}
              stats={item.stats}
              wide={item.wide}
            >
              {item.render()}
            </VizCard>
          ))}
        </div>
      </React.Fragment>
    ))}
  </div>
);

export default Gallery;
