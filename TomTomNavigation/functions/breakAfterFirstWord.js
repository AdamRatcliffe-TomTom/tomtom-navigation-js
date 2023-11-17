export default function breakAfterFirstWord(text) {
  const words = text.split(/\s/);
  return (
    <span>
      {words.map((word, i) => (
        <>
          {word}
          {i === 0 ? <br /> : " "}
        </>
      ))}
    </span>
  );
}
