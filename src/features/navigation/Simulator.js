import { Component } from "react";
import PropTypes from "prop-types";
import { simulate, setSpeed, stepsTaken, util } from "guidance-sim";
import { withMap } from "react-tomtom-maps";

class Simulator extends Component {
  state = {
    options: {
      updateCamera: true
    }
  };

  componentWillMount() {
    this.initialize();
  }

  componentWillUnmount() {
    this.unbind();
  }

  componentDidUpdate(prevProps) {
    const { route, speed, seek, paused } = this.props;
    const speedChanged = prevProps.speed !== speed;
    const seekChanged = prevProps.seek !== seek;
    const restarted = prevProps.paused && !paused;

    if (prevProps.route !== route) {
      this.unbind();
      this.initialize();
    } else if (route && (speedChanged || restarted)) {
      const newSpeed = 1000 / Number(speed.slice(0, speed.indexOf("x")));

      this.simulator.interval = setSpeed(
        this.simulator,
        this.simulator.interval,
        newSpeed,
        { ...this.state.options }
      );
    }

    if (seek && seekChanged) {
      const { emitter } = this.state.options;

      if (emitter) {
        stepsTaken(emitter, seek);
      }
    }

    if (paused && !prevProps.paused) {
      util.clearRequestInterval(this.simulator.interval);
    }
  }

  initialize() {
    const { map, route, onUpdate, onEnd, ...otherProps } = this.props;

    if (map && route) {
      this.simulator = simulate(map, {
        route,
        ...otherProps
      });
      this.simulator.on("update", this.handleUpdate);
      this.simulator.on("end", onEnd);
    }
  }

  unbind() {
    if (this.simulator) {
      util.clearRequestInterval(this.simulator.interval);

      this.simulator.removeAllListeners();
    }
  }

  handleUpdate = (data) => {
    const { speed } = this.props;
    const duration = (1000 / Number(speed.slice(0, speed.indexOf("x")))) * 1.5;

    this.setState({ options: data.options });
    this.props.onUpdate({ duration, ...data });
  };

  render() {
    return null;
  }
}

Simulator.propTypes = {
  map: PropTypes.object,
  route: PropTypes.object,
  zoom: PropTypes.number,
  pitch: PropTypes.number,
  speed: PropTypes.string,
  spacing: PropTypes.string,
  maneuvers: PropTypes.array,
  seek: PropTypes.number,
  updateCamera: PropTypes.bool,
  onUpdate: PropTypes.func,
  onEnd: PropTypes.func
};

Simulator.defaultProps = {
  zoom: 17,
  pitch: 60,
  time: "00mm00ss",
  speed: "1x",
  spacing: "constant",
  updateCamera: true,
  paused: false,
  onUpdate: () => {},
  onEnd: () => {}
};

export default withMap(Simulator);
