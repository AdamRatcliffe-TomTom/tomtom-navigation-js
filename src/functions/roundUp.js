export default function roundUp(value, precision) {
  value = parseFloat(value);

  if (!precision) return value;

  return Math.ceil(value / precision) * precision;
}
