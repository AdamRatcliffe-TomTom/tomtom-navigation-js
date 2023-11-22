export default function breakAfterFirstWord(text) {
  const words = text.split(/\s/);
  return words.map((word, i) => (
    <span key={i}>
      {word}
      {i === 0 ? <br /> : " "}
    </span>
  ));
}
