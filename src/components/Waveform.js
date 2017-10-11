import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Waveform extends Component {
  static defaultProps = {
    width: 500,
    height: 100,
    zoom: 1,
    color: 'black',
    onDone: null,
    renderingMode: 'canvas',
  }

  static propTypes = {
    datum: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    zoom: PropTypes.number,
    color: PropTypes.string,
    onDone: PropTypes.func,
    renderingMode: PropTypes.oneOf(['canvas', 'svg']),
  }

  componentDidMount() {
    const width = this.props.width * this.props.zoom;
    const middle = this.props.height / 2;

    const channelData = this.props.datum.getChannelData(0);
    const step = Math.ceil(channelData.length / width);

    if (this.canvas) {
      this.context2d = this.canvas.getContext('2d');
      this.context2d.fillStyle = this.props.color;
      this.draw(width, step, middle, channelData);
    }

    if (this.props.onDone) {
      this.props.onDone();
    }
  }

  draw(width, step, middle, data) {
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;

      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];

        if (datum < min) {
          min = datum;
        } else if (datum > max) {
          max = datum;
        }

        this.context2d.fillRect(i, (1 + min) * middle, 1, Math.max(1, (max - min) * middle));
      }
    }
  }

  render() {
    const { renderingMode, color } = this.props;
    return (
      renderingMode === 'canvas'
        ? <canvas
          ref={(element) => { this.canvas = element; }}
          width={this.props.width * this.props.zoom}
          height={this.props.height}
        />
        : <svg
          width={this.props.width * this.props.zoom}
          height={this.props.height}
        >
          <path
            fill="none"
            shapeRendering="crispEdges"
            stroke={color}
            style={{ opacity: 1 }}
            d={this.path()}
          />
        </svg>
    );
  }
}

export default Waveform;
