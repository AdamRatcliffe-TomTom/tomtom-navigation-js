import React from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { withMap } from "react-tomtom-maps";

class MapControl extends React.Component {
  constructor(props) {
    super(props);

    this._container = this.createContainer();

    this.state = {
      onMap: false
    };
  }

  componentDidMount() {
    const { map, position } = this.props;

    map.addControl(this, position);

    this.setState({ onMap: true });
  }

  componentWillUnmount() {
    const { map } = this.props;

    map.removeControl(this);

    this.setState({ onMap: false });
  }

  createContainer() {
    const { style } = this.props;
    const container = document.createElement("div");
    container.className = "mapboxgl-ctrl";

    if (style) {
      Object.assign(container.style, style);
    }

    return container;
  }

  onAdd() {
    return this._container;
  }

  onRemove() {
    const { onMap } = this.state;

    if (onMap && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }

  render() {
    const { children } = this.props;
    const { onMap } = this.state;

    return onMap
      ? createPortal(
          <>
            {React.Children.map(children, (child) => React.cloneElement(child))}
          </>,
          this._container
        )
      : null;
  }
}

MapControl.propTypes = {
  position: PropTypes.string,
  style: PropTypes.object
};

MapControl.defaultProps = {
  position: "bottom-right"
};

export default withMap(MapControl);
