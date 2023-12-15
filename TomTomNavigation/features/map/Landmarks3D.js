import { useEffect } from "react";
import { Threebox } from "threebox-plugin";
import { withMap } from "react-tomtom-maps";

const Landmarks3D = ({ map }) => {
  useEffect(() => {
    map.once("styledata", () => {
      map.addLayer({
        id: "custom-threebox-model",
        type: "custom",
        renderingMode: "3d",
        onAdd: () => {
          const tb = (window.tb = new Threebox(
            map.__om,
            map.getCanvas().getContext("webgl"),
            {
              defaultLights: true
            }
          ));

          const options = {
            obj: "https://cpmdemos.blob.core.windows.net/$web/power-apps-3d-landmarks/usa_sac.glb",
            type: "glb",
            units: "meters"
          };

          tb.loadObj(options, (model) => {
            model.setCoords([-73.976799, 40.754145]);
            model.setRotation({ x: 0, y: 0, z: 241 });
            tb.add(model);
          });
        },

        render: () => {
          tb.update();
        }
      });
    });
  }, []);

  return null;
};

export default withMap(Landmarks3D);
