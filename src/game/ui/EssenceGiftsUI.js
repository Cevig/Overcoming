import React from 'react';

export class EssenceGiftsUI extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.render = this.render.bind(this);
  }

  render() {
    return (
      <g style={{transform: `scale(0.015) translate(35px, 25px)`}} className={'non-pointer'}
         id={this.props.id + 10}>
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round"
           strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M31.9 30.3V62S45 52.8 54.2 50.1c0 0 .4-19.6 6.1-29.4l-28.4 9.6"
                fill="#076170"></path>
          <path
            d="M40.1 57.2s.5-28.1 1.5-29.5c1-1.5 9.6-3 9.6-3s-3.5 26.3-2.7 28c.1-.1-3.5 1.4-8.4 4.5"
            fill="#b3690e"></path>
          <path d="M31.9 62s-9.2-7.8-23.5-11.9c0 0 1.1-16.1-4.1-28.4l27.6 8.6V62z"
                fill="#3baacf"></path>
          <path
            d="M14.2 52.7s8.4 3.4 9 4.5s.6-28.3.6-28.3s-11.5-3.2-12.5-3.2c0 0 3.5 11.9 2.9 27"
            fill="#e9c243"></path>
          <path d="M31.9 30.3v5.3l25.7-8.8c.7-2.2 1.6-4.3 2.6-6.1l-28.3 9.6"
                opacity=".3" fill="#000000"></path>
          <path d="M6.1 27.2c-.5-1.9-1.1-3.7-1.9-5.5l27.6 8.6v5.3L6.1 27.2"
                opacity=".3" fill="#000000"></path>
          <path fill="#4fc7e8" d="M2 18.9l28.5 6.3L62 17.6l-30.9-1.7z"></path>
          <path fill="#3baacf" d="M2 18.9l2.3 6.3l26.2 7.4v-7.4z"></path>
          <path d="M30.5 32.6s23.8-8.8 29.7-9.2c0 0 .4-3.5 1.8-5.7l-31.5 7.5v7.4"
                fill="#076170"></path>
          <g fill="#f0ae11">
            <path
              d="M10.5 20.8l5.8 5.5l6.4-2.9l9.3-2.8L43.6 22l6.1 1.2l4.9-3.8z"></path>
            <path d="M22.7 23.4l9.3-2.8L43.6 22l11-2.6l-23.2-2.2l-20.9 3.6z"></path>
          </g>
          <path fill="#f8d048" d="M10.5 20.8v7L22.2 31l.5-7.6z"></path>
          <path fill="#c47116" d="M43.6 22l.2 6.7l10-3l.8-6.3z"></path>
          <path
            d="M37.3 17.3s0-7 6.8-13.1c0 0-4.1 1.5-6.1 1.1c-2.4-.4-3.2-3.3-3.2-3.3S29 14.6 30.7 16.2c1.7 1.7 6.6 1.1 6.6 1.1"
            fill="#ea9f07"></path>
          <path
            d="M28.4 21.4s-3.9-8-12.2-12.2c0 0 6.5-.6 8-1.4c1.9-.9 3-3.4 3-3.4s7.2 12.6 6.6 14.5s-5.4 2.5-5.4 2.5"
            fill="#f8d048"></path>
          <path
            d="M32.6 20.5s-6.1 2.4-13.9 2.4C2.3 22.8 0 11 16.2 12.1c13.3 1 16.4 8.4 16.4 8.4"
            fill="#ea9f07"></path>
          <path
            d="M31.5 20.4s7.2.6 13.9-1.1c14-3.6 8.8-14.2-4.4-9.7c-10.8 3.7-9.5 10.8-9.5 10.8"
            fill="#f0ae11"></path>
          <g fill="#824000">
            <path
              d="M32.6 20.5S28.8 22 23.9 22c-10.2 0-11.7-7.4-1.6-6.7c8.3.6 10.3 5.2 10.3 5.2"></path>
            <path
              d="M32.6 20.5s5 .4 9.7-.8c9.8-2.5 6.1-9.9-3-6.8c-7.6 2.6-6.7 7.6-6.7 7.6"></path>
          </g>
        </g>
      </g>
    )
  }
}
