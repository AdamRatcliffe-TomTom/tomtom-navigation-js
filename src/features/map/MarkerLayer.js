import { useEffect, useState, useMemo } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { v4 as uuid } from "uuid";
import { featureCollection } from "@turf/helpers";
import { useLayers } from "./hooks/LayersContext";

const MarkerLayer = ({ data = featureCollection([]), before }) => {
  const id = useMemo(() => `MarkerLayer-${uuid()}`, []);
  const { addLayer, removeLayer } = useLayers();
  const [processedData, setProcessedData] = useState([]);

  const calculateOffset = (anchor, iconWidth, iconHeight) => {
    const halfWidth = iconWidth / 2;
    const halfHeight = iconHeight / 2;

    const offsets = {
      center: [0, 0],
      top: [0, halfHeight],
      bottom: [0, -halfHeight],
      left: [halfWidth, 0],
      right: -[halfWidth, 0],
      "top-left": [halfWidth, halfHeight],
      "top-right": [-halfWidth, halfHeight],
      "bottom-left": [halfWidth, -halfHeight],
      "bottom-right": [-halfWidth, -halfHeight]
    };

    return offsets[anchor] || offsets.center;
  };

  const rasterizeSVG = (svgUrl, width, height) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
      img.onerror = reject;
      img.src = svgUrl;
    });
  };

  useEffect(() => {
    const processIcons = async () => {
      if (!data) return;

      const featureCollection =
        data.type === "FeatureCollection"
          ? data
          : { type: "FeatureCollection", features: data };

      const processedFeatures = await Promise.all(
        featureCollection.features
          .filter((feature) => feature.geometry.type === "Point")
          .map(async (feature) => {
            const { properties, geometry } = feature;

            const icon = properties?.icon;
            if (!icon) {
              return feature;
            }

            const { url, width, height, anchor } = icon;

            const rasterizedUrl = url?.endsWith(".svg")
              ? await rasterizeSVG(url, width, height)
              : url;

            return {
              ...feature,
              properties: {
                ...properties,
                icon: {
                  ...icon,
                  url: rasterizedUrl,
                  width,
                  height,
                  anchor
                }
              }
            };
          })
      );

      setProcessedData({
        type: "FeatureCollection",
        features: processedFeatures
      });
    };

    processIcons();
  }, [data]);

  const memoizedLayer = useMemo(() => {
    if (!processedData || processedData.length === 0) return null;

    return new GeoJsonLayer({
      id,
      beforeId: before,
      data: processedData,
      pointType: "icon",
      getIcon: (f) => f.properties.icon,
      getIconPixelOffset: (f) => {
        const { width, height, anchor } = f.properties.icon;
        return calculateOffset(anchor, width, height);
      },
      getIconSize: (f) => f.properties.icon.height,
      iconSizeMinPixels: (f) => f.properties.icon.height,
      iconSizeMaxPixels: (f) => f.properties.icon.height,
      parameters: {
        depthTest: false
      }
    });
  }, [processedData, id, before]);

  useEffect(() => {
    if (memoizedLayer) {
      addLayer(memoizedLayer);
    }

    return () => {
      if (memoizedLayer) {
        removeLayer([id]);
      }
    };
  }, [memoizedLayer, addLayer, removeLayer, id]);

  return null;
};

export default MarkerLayer;
