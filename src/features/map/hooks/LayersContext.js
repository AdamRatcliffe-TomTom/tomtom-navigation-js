import React, { createContext, useState, useContext, useCallback } from "react";

export const LayersContext = createContext();

export const LayersProvider = ({ children }) => {
  const [layers, setLayers] = useState([]);

  const addLayer = useCallback((newLayers) => {
    const layersArray = Array.isArray(newLayers) ? newLayers : [newLayers];
    setLayers((prevLayers) => [...prevLayers, ...layersArray]);
  }, []);

  const removeLayer = useCallback((layerIds) => {
    const idsArray = Array.isArray(layerIds) ? layerIds : [layerIds];
    setLayers((prevLayers) =>
      prevLayers.filter((layer) => !idsArray.includes(layer.id))
    );
  }, []);

  return (
    <LayersContext.Provider value={{ layers, addLayer, removeLayer }}>
      {children}
    </LayersContext.Provider>
  );
};

export const useLayers = () => {
  const context = useContext(LayersContext);
  if (!context) {
    throw new Error("useLayers must be used within a LayersProvider");
  }
  return context;
};
