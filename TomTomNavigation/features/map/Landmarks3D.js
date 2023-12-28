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

          const scale = 3.3;
          const options = {
            obj: "https://cpmdemos.blob.core.windows.net/$web/power-apps-3d-landmarks/empire_state_building.glb",
            type: "glb",
            units: "meters",
            scale: { x: scale, y: scale, z: scale },
            anchor: "center",
            adjustment: { x: 0.38, y: -0.165, z: 0 },
            rotation: { x: 90, y: -90, z: 0 }
          };

          tb.loadObj(options, (model) => {
            model.setCoords([-73.98593606508359, 40.74823644616225]);
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
