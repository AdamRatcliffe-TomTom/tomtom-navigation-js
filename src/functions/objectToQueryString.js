export default (obj) => {
  return Object.keys(obj)
    .map((k) => {
      let val = obj[k];
      val = Array.isArray(val) ? val : [val];
      return val
        .map((v) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
    })
    .join("&");
};
