import React, { useState, useEffect } from "react";
import { makeStyles, Text } from "@fluentui/react";
import Map, { withMap } from "react-tomtom-maps";
import MapControl from "./MapControl";
import { useAppContext } from "../../app/AppContext";

const useStyles = makeStyles((theme) => ({
  control: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "88px",
    height: "88px",
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
        containerStyle={{ width: "80px", height: "60px" }}
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
