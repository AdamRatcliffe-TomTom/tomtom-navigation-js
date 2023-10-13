import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { withMap } from "react-tomtom-maps";

const StyledControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  width: 40px;
  height: 40px;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.075);
  border-radius: 50%;
  overflow: hidden;
  transition: opacity 0.3s ease-out;
  cursor: pointer;
`;

const Icon = styled.div`
  display: inline-block;
  height: 28px;
  width: 28px;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiICAgdmVyc2lvbj0iMS4xIiAgIHg9IjAiICAgeT0iMCIgICB3aWR0aD0iNiIgICBoZWlnaHQ9IjI0IiAgIHZpZXdCb3g9IjAgMCA2IDI0IiAgIGlkPSJzdmcxNiIgICBzb2RpcG9kaTpkb2NuYW1lPSJjb21wYXNzLXN0YW5kYWxvbmUuc3ZnIiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTIuMiA1YzNlODBkLCAyMDE3LTA4LTA2Ij4gIDxtZXRhZGF0YSAgICAgaWQ9Im1ldGFkYXRhMjIiPiAgICA8cmRmOlJERj4gICAgICA8Y2M6V29yayAgICAgICAgIHJkZjphYm91dD0iIj4gICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PiAgICAgICAgPGRjOnR5cGUgICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+ICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4gICAgICA8L2NjOldvcms+ICAgIDwvcmRmOlJERj4gIDwvbWV0YWRhdGE+ICA8ZGVmcyAgICAgaWQ9ImRlZnMyMCIgLz4gIDxzb2RpcG9kaTpuYW1lZHZpZXcgICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIgICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IiAgICAgYm9yZGVyb3BhY2l0eT0iMSIgICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiICAgICBncmlkdG9sZXJhbmNlPSIxMCIgICAgIGd1aWRldG9sZXJhbmNlPSIxMCIgICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIgICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTMxNSIgICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjY5NiIgICAgIGlkPSJuYW1lZHZpZXcxOCIgICAgIHNob3dncmlkPSJ0cnVlIiAgICAgZml0LW1hcmdpbi10b3A9IjAiICAgICBmaXQtbWFyZ2luLWxlZnQ9IjAiICAgICBmaXQtbWFyZ2luLXJpZ2h0PSIwIiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiICAgICBpbmtzY2FwZTp6b29tPSI2Ljk0MTE3NjUiICAgICBpbmtzY2FwZTpjeD0iMyIgICAgIGlua3NjYXBlOmN5PSIxMiIgICAgIGlua3NjYXBlOndpbmRvdy14PSIwIiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMTYiPiAgICA8aW5rc2NhcGU6Z3JpZCAgICAgICB0eXBlPSJ4eWdyaWQiICAgICAgIGlkPSJncmlkNDUyNyIgICAgICAgb3JpZ2lueD0iLTE0IiAgICAgICBvcmlnaW55PSItNSIgLz4gIDwvc29kaXBvZGk6bmFtZWR2aWV3PiAgPGcgICAgIGlkPSJnNiIgICAgIHN0eWxlPSJvcGFjaXR5OjAuMyIgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNCwtNSkiPiAgICA8cGF0aCAgICAgICBkPSJNIDE3LDIgQyAyNS4zLDIgMzIsOC43IDMyLDE3IDMyLDI1LjMgMjUuMywzMiAxNywzMiA4LjcsMzIgMiwyNS4zIDIsMTcgMiw4LjcgOC43LDIgMTcsMiBNIDE3LDAgQyA3LjYsMCAwLDcuNiAwLDE3IDAsMjYuNCA3LjYsMzQgMTcsMzQgMjYuNCwzNCAzNCwyNi40IDM0LDE3IDM0LDcuNiAyNi40LDAgMTcsMCBaIiAgICAgICBpZD0icGF0aDQiICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiICAgICAgIHN0eWxlPSJmaWxsOiNkZWRlZGUiIC8+ICA8L2c+ICA8ZyAgICAgaWQ9Imc0NTMxIiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0LC01KSI+ICAgIDxwYXRoICAgICAgIGQ9Im0gMTcsNSAzLDEyIGggLTYgeiIgICAgICAgaWQ9IlJlY3RhbmdsZS0xMSIgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgICAgICAgc3R5bGU9ImZpbGw6I2ZmMTQwMCIgLz4gICAgPHBhdGggICAgICAgZD0iTSAxNywyOSAyMCwxNyBIIDE0IFoiICAgICAgIGlkPSJSZWN0YW5nbGUtMTFfMV8iICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiICAgICAgIHN0eWxlPSJmaWxsOiNkZWRlZGUiIC8+ICA8L2c+PC9zdmc+);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  transition: 0.1s;
`;

class CompassControl extends Component {
  state = {
    bearing: 0
  };

  constructor(props) {
    super(props);
    this.createContainer();
  }

  createContainer() {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl";
  }

  componentDidMount() {
    this.addControlToMap();
  }

  componentWillUnmount() {
    const { map } = this.props;
    map.removeControl(this);
  }

  addControlToMap() {
    const { map, position } = this.props;
    map.addControl(this, position);
  }

  onAdd() {
    const { map } = this.props;
    map.on("rotate", this.onMapRotate);
    return this.container;
  }

  onRemove() {
    const { map } = this.props;
    map.off("rotate", this.onMapRotate);
    map.off("pitchend", this.onMapPitchEnd);
    this.container.parentNode &&
      this.container.parentNode.removeChild(this.container);
  }

  render() {
    const { onClick } = this.props;
    const { bearing } = this.state;
    const iconStyle = {
      transform: `rotate(${bearing * -1}deg)`
    };

    return ReactDOM.createPortal(
      <StyledControl onClick={onClick}>
        <Icon style={iconStyle} />
      </StyledControl>,
      this.container
    );
  }

  onMapRotate = (e) => {
    const bearing = e.target.getBearing();
    this.setState({ bearing });
  };
}

CompassControl.propTypes = {
  map: PropTypes.object,
  position: PropTypes.string,
  onClick: PropTypes.func
};

CompassControl.defaultProps = {
  position: "top-right"
};

export default withMap(CompassControl);
