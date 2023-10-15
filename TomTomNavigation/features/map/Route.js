import { PureComponent } from "react";
import PropTypes from "prop-types";
import { withMap } from "react-tomtom-maps";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "deck.gl";
import { v4 as uuid } from "uuid";

class Route extends PureComponent {
  id = `Route-${uuid()}`;

  componentDidMount() {
    const { map } = this.props;

    this.control = new MapboxOverlay({
      interleaved: true,
      layers: this.createLayers()
    });

    map.addControl(this.control);
  }

  componentWillUnmount() {
    const { map } = this.props;

    try {
      map.removeControl(this.control);
      this.control = undefined;
    } catch (e) {
      // do nothing
    }
  }

  createLayers() {
    const { data, routeProgress, before } = this.props;

    if (!data) return null;

    const layers = [
      new GeoJsonLayer({
        id: `${this.id}--Casing`,
        beforeId: before,
        data: data,
        filled: true,
        stroked: true,
        getLineColor: [5, 104, 168, 255],
        getLineWidth: 9,
        lineWidthMinPixels: 8,
        lineWidthMaxPixels: 14,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true
      }),
      new GeoJsonLayer({
        id: `${this.id}--Line`,
        beforeId: before,
        data: data,
        filled: true,
        stroked: true,
        getLineColor: [59, 174, 227, 255],
        getLineWidth: 6,
        lineWidthMinPixels: 5,
        lineWidthMaxPixels: 12,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true
      }),
      new GeoJsonLayer({
        id: `${this.id}--Progress-Casing`,
        beforeId: before,
        data: routeProgress,
        filled: true,
        stroked: true,
        getLineColor: [135, 144, 152, 255],
        getLineWidth: 9,
        lineWidthMinPixels: 8,
        lineWidthMaxPixels: 14,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true
      }),
      new GeoJsonLayer({
        id: `${this.id}--Progress-Line`,
        beforeId: before,
        data: routeProgress,
        filled: true,
        stroked: true,
        getLineColor: [184, 187, 190, 255],
        getLineWidth: 6,
        lineWidthMinPixels: 6,
        lineWidthMaxPixels: 12,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true
      })
    ];

    return layers;
  }

  render() {
    if (!this.control) {
      return null;
    }

    this.control.setProps({
      layers: this.createLayers()
    });

    return null;
  }
}

Route.propTypes = {
  map: PropTypes.object,
  data: PropTypes.object,
  routeProgress: PropTypes.object,
  animationDuration: PropTypes.number,
  before: PropTypes.string
};

Route.defaultProps = {
  animationDuration: 2000
};

export default withMap(Route);
