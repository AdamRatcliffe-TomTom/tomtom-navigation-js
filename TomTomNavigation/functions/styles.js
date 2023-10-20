export function addStyleToDocument(id, cssRule) {
  if (document.getElementById(id)) {
    console.error("Style with the specified id already exists.");
    return;
  }

  var style = document.createElement("style");
  style.id = id;

  style.innerHTML = cssRule;

  document.head.appendChild(style);
}

export function removeStyleFromDocument(id) {
  var styleToRemove = document.getElementById(id);

  if (styleToRemove) {
    styleToRemove.parentNode.removeChild(styleToRemove);
  } else {
    console.error("Style with the specified id was not found.");
  }
}
