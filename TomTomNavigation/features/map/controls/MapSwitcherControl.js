import React, { useState, useEffect } from "react";
import { makeStyles, Text } from "@fluentui/react";
import Map, { withMap } from "react-tomtom-maps";
import MapControl from "./MapControl";
import { useAppContext } from "../../../app/AppContext";

const useStyles = makeStyles((theme) => ({
  control: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 88,
    height: 88,
    padding: "4px 4px 0",
    borderRadius: 8,
    background: theme.palette.white,
    boxShadow: "0 0 35px 0 rgba(0, 0, 0, 0.25)",
    cursor: "pointer",
    userSelect: "none",
    "& .mapboxgl-map": {
      borderRadius: 8
    },
    "& .mapboxgl-ctrl-attrib": {
      display: "none"
    }
  },
  text: {
    fontFamily: "Noto Sans",
    fontWeight: 500
  }
}));

const getMapStyleName = (selected) =>
  selected === "street" ? "satellite" : "street";

const MapSwitcher = ({
  map,
  selected = "street",
  onSelected = () => {},
  ...otherProps
}) => {
  const classes = useStyles();
  const { apiKey, mapStyles, theme, language } = useAppContext();
  const [state, setState] = useState({
    styleName: getMapStyleName(selected),
    mapStyle: mapStyles[getMapStyleName(selected)],
    bounds: map?.getBounds().toArray()
  });
  const { styleName, mapStyle, bounds } = state;

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      mapStyle: mapStyles[styleName]
    }));
  }, [theme, language]);

  useEffect(() => {
    map && map.on("moveend", handleMapViewChange);
    return () => map && map.off("moveend", handleMapViewChange);
  }, [map]);

  useEffect(() => {
    const styleName = getMapStyleName(selected);
    const mapStyle = mapStyles[styleName];

    setState((prev) => ({
      ...prev,
      styleName,
      mapStyle
    }));
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
    const styleName = getMapStyleName(selected);
    onSelected(styleName);
  };

  const handleMapViewChange = () => {
    setState((prev) => ({
      ...prev,
      bounds: map?.getBounds().toArray()
    }));
  };

  return (
    <div className={classes.control} onClick={handleClick} {...otherProps}>
      <Map
        apiKey={apiKey}
        mapStyle={mapStyle.style}
        containerStyle={{ width: 80, height: 60 }}
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

const MapSwitcherControl = ({ position, ...otherProps }) => (
  <MapControl position={position}>
    <MapSwitcher {...otherProps} />
  </MapControl>
);

export default withMap(MapSwitcherControl);
