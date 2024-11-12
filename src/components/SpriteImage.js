import React from "react";

const SpriteImage = ({
  className,
  image,
  x,
  y,
  width,
  height,
  style,
  children
}) => {
  style = {
    position: "relative",
    backgroundImage: `url(${image})`,
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
