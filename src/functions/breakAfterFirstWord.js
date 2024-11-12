import React from "react";

export default function breakAfterFirstWord(text = "") {
  const words = text.split(/\s/);
  return words.map((word, i) => (
    <React.Fragment key={i}>
      {word}
      {i === 0 ? <br /> : " "}
    </React.Fragment>
  ));
}
