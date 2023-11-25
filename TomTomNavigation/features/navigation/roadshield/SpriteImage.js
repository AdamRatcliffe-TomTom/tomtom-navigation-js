import React from "react";
import sprite from "./sprite.json";

const SpriteImage = ({ className, x, y, width, height, style, children }) => {
  style = {
    position: "relative",
    backgroundImage: `url(${sprite.image})`,
    backgroundPosition: `${x * -1}px ${y * -1}px`,
    backgroundRepeat: "no-repeat",
    width,
    height,
    ...style
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export default SpriteImage;
