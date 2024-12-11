import { useEffect, useState, useMemo } from "react";
import { IconLayer } from "@deck.gl/layers";
import { v4 as uuid } from "uuid";
import { useLayers } from "./hooks/LayersContext";

const MarkerLayer = ({ data = [], before }) => {
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
      const processed = await Promise.all(
        data.map(
          async ({ coordinates, icon: { url, width, height, anchor } }) => {
            const rasterizedUrl = url.endsWith(".svg")
              ? await rasterizeSVG(url, width, height)
              : url;
            return {
              position: coordinates,
              icon: {
                url: rasterizedUrl,
                width,
                height,
                anchor
              }
            };
          }
        )
      );
      setProcessedData(processed);
    };

    processIcons();
  }, [data]);

  const memoizedLayer = useMemo(() => {
    if (!processedData || processedData.length === 0) return null;
    return new IconLayer({
      id,
      beforeId: before,
      data: processedData,
      getPosition: (d) => d.position,
      getIcon: (d) => d.icon,
      getSize: (d) => d.icon.height,
      sizeMinPixels: (d) => d.icon.height,
      sizeMaxPixels: (d) => d.icon.height,
      getPixelOffset: (d) => {
        const { width, height, anchor } = d.icon;
        return calculateOffset(anchor, width, height);
      },
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
  }, [memoizedLayer, addLayer, removeLayer]);

  return null;
};

export default MarkerLayer;
