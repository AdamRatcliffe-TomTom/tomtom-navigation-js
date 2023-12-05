import { PureComponent } from "react";
import PropTypes from "prop-types";
import _isNil from "lodash.isnil";
import { withMap } from "react-tomtom-maps";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import { PathStyleExtension } from "@deck.gl/extensions";
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
    let { data, progress, walkingLeg, before } = this.props;

    if (!data) return null;

    const layers = [
      new GeoJsonLayer({
        id: `${this.id}--Casing`,
        beforeId: before,
        data,
        filled: true,
        stroked: true,
        getLineColor: [5, 104, 168, 255],
        getLineWidth: 9,
        lineWidthMinPixels: 9,
        lineWidthMaxPixels: 16,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true
      }),
      new GeoJsonLayer({
        id: `${this.id}--Line`,
        beforeId: before,
        data,
        filled: true,
        stroked: true,
        getLineColor: this.getLineColor,
        getLineWidth: 6,
        lineWidthMinPixels: 6,
        lineWidthMaxPixels: 13,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true
      }),
      new GeoJsonLayer({
        id: `${this.id}--Progress_Casing`,
        beforeId: before,
        data: progress,
        filled: true,
        stroked: true,
        getLineColor: [33, 75, 100, 255],
        getLineWidth: 9,
        lineWidthMinPixels: 9,
        lineWidthMaxPixels: 16,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true
      }),
      new GeoJsonLayer({
        id: `${this.id}--Progress_Line`,
        beforeId: before,
        data: progress,
        filled: true,
        stroked: true,
        getLineColor: [33, 75, 100, 255],
        getLineWidth: 6,
        lineWidthMinPixels: 6,
        lineWidthMaxPixels: 13,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true
      }),
      new GeoJsonLayer({
        id: `${this.id}--Walking_Leg`,
        data: walkingLeg,
        filled: true,
        stroked: true,
        getLineColor: [59, 174, 227, 255],
        getLineWidth: 8,
        lineWidthMinPixels: 8,
        lineWidthMaxPixels: 12,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true,
        getDashArray: [0.2, 4],
        dashJustified: true,
        extensions: [new PathStyleExtension({ dash: true })]
      })
    ];

    return layers;
  }

  getLineColor(feature) {
    const {
      properties: { magnitudeOfDelay }
    } = feature;

    switch (magnitudeOfDelay) {
      case 1:
        return [241, 191, 64, 255];
      case 2:
        return [241, 130, 55, 255];
      case 3:
        return [231, 7, 4, 255];
      default:
        return [59, 174, 227, 255];
    }
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
  remainingRoute: PropTypes.object,
  animationDuration: PropTypes.number,
  before: PropTypes.string
};

Route.defaultProps = {
  animationDuration: 2000
};

export default withMap(Route);
