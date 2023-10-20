import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { makeStyles, Text } from "@fluentui/react";
import Map, { withMap } from "react-tomtom-maps";
import { useAppContext } from "../../app/AppContext";

const useStyles = makeStyles((theme) => ({
  control: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "80px",
    height: "80px",
    padding: "4px 4px 0",
    borderRadius: "8px",
    background: theme.palette.white,
    boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.075)",
    cursor: "pointer",
    userSelect: "none",
    "& .mapboxgl-map": {
      borderRadius: "8px"
    },
    "& .mapboxgl-ctrl-attrib": {
      display: "none"
    }
  },
  text: {
    fontWeight: 600
  }
}));

const MapSwitcher = ({
  map,
  selected = "street",
  onSelected = () => {},
  ...otherProps
}) => {
  const classes = useStyles();
  const [styleName, setStyleName] = useState(
    selected === "street" ? "satellite" : "street"
  );
  const { apiKey, mapStyles, theme } = useAppContext();
  const [mapStyle, setMapStyle] = useState(mapStyles[styleName]);
  const [bounds, setBounds] = useState(map?.getBounds().toArray());

  useEffect(() => {
    setMapStyle(mapStyles[styleName]);
  }, [theme]);

  useEffect(() => {
    map && map.on("moveend", handleMapViewChange);
    return () => map && map.off("moveend", handleMapViewChange);
  }, [map]);

  useEffect(() => {
    console.log("selected: ", selected);

    const styleName = selected === "street" ? "satellite" : "street";
    const mapStyle = mapStyles[styleName];
    setStyleName(styleName);
    setMapStyle(mapStyle);
  }, [selected]);

  const handleStyleData = (map) => {
    map.__om.style.stylesheet.layers.forEach((layer) => {
      if (
        layer.type === "symbol" ||
        (styleName === "satellite" && layer.type === "line")
      ) {
        map.getLayer(layer.id) && map.removeLayer(layer.id);
      }
    });
  };

  const handleClick = () => {
    const newSelected = selected === "street" ? "satellite" : "street";
    onSelected(newSelected);
  };

  const handleMapViewChange = () => {
    setBounds(map?.getBounds().toArray());
  };

  return (
    <div className={classes.control} onClick={handleClick} {...otherProps}>
      <Map
        apiKey={apiKey}
        mapStyle={mapStyle.style}
        containerStyle={{ width: "72px", height: "52px" }}
        mapOptions={{
          interactive: false
        }}
        movingMethod="jumpTo"
        fitBoundsOptions={{
          animate: false
        }}
        bounds={bounds}
        onStyleData={handleStyleData}
      ></Map>
      <Text className={classes.text} variant="small">
        {mapStyle.label}
      </Text>
    </div>
  );
};

class MapSwitcherControl extends React.Component {
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
    const container = document.createElement("div");
    container.className = "mapboxgl-ctrl";
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
    const { position, ...otherProps } = this.props;
    const { onMap } = this.state;

    return onMap
      ? createPortal(<MapSwitcher {...otherProps} />, this._container)
      : null;
  }
}

MapSwitcherControl.propTypes = {
  position: PropTypes.string
};

MapSwitcherControl.defaultProps = {
  position: "bottom-left"
};

export default withMap(MapSwitcherControl);
