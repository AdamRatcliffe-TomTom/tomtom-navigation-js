import { Component } from "react";
import PropTypes from "prop-types";
import { simulate, setSpeed, util } from "guidance-sim";
import { withMap } from "react-tomtom-maps";

class Simulator extends Component {
  state = {
    options: null
  };

  componentWillMount() {
    this.initialize();
  }

  componentWillUnmount() {
    this.unbind();
  }

  componentDidUpdate(prevProps) {
    const { route, speed, paused } = this.props;
    const speedChanged = prevProps.speed !== speed;
    const restarted = prevProps.paused && !paused;

    if (prevProps.route !== route) {
      this.unbind();
      this.initialize();
    } else if (route && (speedChanged || restarted)) {
      const frequency = 1000;
      const newSpeed = frequency / Number(speed.slice(0, speed.indexOf("x")));

      this.simulator.interval = setSpeed(
        this.simulator,
        this.simulator.interval,
        newSpeed,
        this.state.options
      );
    }

    if (paused && !prevProps.paused) {
      util.clearRequestInterval(this.simulator.interval);
    }
  }

  initialize() {
    const { map, route, onUpdate, onEnd, ...otherProps } = this.props;

    if (map && route) {
      this.simulator = simulate(map, { route, ...otherProps });
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
    this.setState({ options: data.options });
    this.props.onUpdate(data);
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
  onUpdate: PropTypes.func,
  onEnd: PropTypes.func
};

Simulator.defaultProps = {
  zoom: 17,
  pitch: 60,
  time: "00mm00ss",
  speed: "1x",
  spacing: "constant",
  paused: false,
  onUpdate: () => {},
  onEnd: () => {}
};

export default withMap(Simulator);
