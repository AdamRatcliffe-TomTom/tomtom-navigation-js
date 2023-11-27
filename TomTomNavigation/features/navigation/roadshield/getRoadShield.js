import React from "react";
import SpriteImage from "./SpriteImage";
import sprite from "./sprite.json";

export default function getRoadShield(name, text) {
  const asset = lookupAsset(name, text);

  if (asset) {
    const {
      x,
      y,
      width,
      height,
      "font-size": fontSize,
      "text-color": textColor
    } = asset;
    return (
      <SpriteImage
        className="RoadShield"
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          transform: "scale(0.75)",
          transformOrigin: "top left",
          marginRight: height * -0.25,
          marginBottom: height * -0.25
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            fontSize: `${fontSize}px`,
            lineHeight: 1,
            fontFamily: "Noto Sans",
            fontWeight: 500,
            color: textColor
          }}
        >
          {text}
        </div>
      </SpriteImage>
    );
  }
  return null;
}

function lookupAsset(name, text) {
  const { assets } = sprite;
  const { variants } = assets.find((asset) => asset.names.includes(name));
  const textLen = String(text.length);
  return variants.find((variant) => variant["text-length"].includes(textLen));
}
