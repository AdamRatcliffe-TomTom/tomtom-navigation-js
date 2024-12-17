import React from "react";
import SpriteImage from "../../../components/SpriteImage";

export default function getRoadShield(name, text, spriteImageUrl, spriteJson) {
  const asset = spriteJson[name];

  if (asset) {
    const { x, y, width, height } = asset;
    const color = name.includes("-black-") ? "black" : "white";

    return (
      <SpriteImage
        className="RoadShield"
        image={spriteImageUrl}
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          transform: "scale(0.8)",
          transformOrigin: "top left",
          marginRight: height * -0.2,
          marginBottom: height * -0.2
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            fontSize: "16px",
            lineHeight: 1,
            fontFamily: "Noto Sans",
            fontWeight: 600,
            color
          }}
        >
          {text}
        </div>
      </SpriteImage>
    );
  }
  return null;
}
