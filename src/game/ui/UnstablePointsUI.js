import React from 'react';

export class UnstablePointsUI extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.render = this.render.bind(this);
  }

  render() {
    return (
      <g transform="scale(.0029,.0029)" className={'non-pointer'}>
        <path stroke="#000" id={this.props.id+10000} d="m264.5,255.95878l41.45878,-41.45878l44.04102,44.04066l44.04102,-44.04066l41.45917,41.45878l-44.04103,44.04102l44.04103,44.04102l-41.45917,41.45917l-44.04102,-44.04103l-44.04102,44.04103l-41.45878,-41.45917l44.04066,-44.04102l-44.04066,-44.04102z" fill="#7f0000"/>
      </g>
    )
  }
}
