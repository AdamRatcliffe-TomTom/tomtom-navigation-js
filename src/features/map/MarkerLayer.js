import { useEffect, useState, useMemo } from "react";
import _capitalize from "lodash.capitalize";
import { GeoJsonLayer } from "@deck.gl/layers";
import { v4 as uuid } from "uuid";
import { featureCollection } from "@turf/helpers";
import { useLayers } from "./hooks/LayersContext";
import tinycolor from "tinycolor2";

const parseColor = (color) => {
  const { r, g, b, a } = tinycolor(color).toRgb();
  return [r, g, b, Math.round(a * 255)];
};

const MarkerLayer = ({
  data = featureCollection([]),
  before,
  labelColor = "rgb(251, 99, 9)"
}) => {
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
            const { properties } = feature;

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

  const memoizedLayers = useMemo(() => {
    if (!processedData || processedData.length === 0) return null;

    const labelFeatures = processedData.features.filter(
      (f) => !!f.properties.label
    );

    const layers = [
      new GeoJsonLayer({
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
      })
    ];

    if (labelFeatures.length) {
      layers.push(
        new GeoJsonLayer({
          id: `${id}-Text`,
          beforeId: before,
          data: labelFeatures,
          pointType: "text",
          getText: (f) => _capitalize(f.properties.label),
          getTextColor: [255, 255, 255, 255],
          getTextSize: 15,
          getTextAnchor: "middle",
          getTextPixelOffset: (f) => {
            const { height } = f.properties.icon;
            return [0, (height + 15) * -1];
          },
          textFontFamily: "Noto Sans",
          textFontWeight: 400,
          textOutlineColor: parseColor(labelColor),
          textOutlineWidth: 4,
          textFontSettings: {
            sdf: true
          },
          parameters: {
            depthTest: false
          }
        })
      );
    }

    return layers;
  }, [processedData, id, before, labelColor]);

  useEffect(() => {
    if (memoizedLayers) {
      addLayer(memoizedLayers);
    }

    return () => {
      if (memoizedLayers) {
        const layerIds = memoizedLayers.map((layer) => layer.id);
        removeLayer(layerIds);
      }
    };
  }, [memoizedLayers, addLayer, removeLayer, id]);

  return null;
};

export default MarkerLayer;
