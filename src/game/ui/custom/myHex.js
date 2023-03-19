(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types')) :
      (factory((global.UI = {}),global.React,global.PropTypes));
}(this, (function (exports,React,PropTypes) {

  function __$styleInject (css, returnValue) {
    if (typeof document === 'undefined') {
      return returnValue;
    }
    css = css || '';
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    head.appendChild(style);

    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    return returnValue;
  }

  React = React && React.hasOwnProperty('default') ? React['default'] : React;
  PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

  /*
   * Copyright 2018 The boardgame.io Authors
   *
   * Use of this source code is governed by a MIT-style
   * license that can be found in the LICENSE file or at
   * https://opensource.org/licenses/MIT.
   */

  var Logo = function Logo(_ref) {
    var width = _ref.width,
      height = _ref.height;
    return React.createElement(
      'svg',
      {
        width: width || 128,
        height: height || 128,
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 128 128'
      },
      React.createElement('path', {
        d: 'M64,120.37,15.27,92.28V35.91L64,7.82l48.73,28.09V92.28Z',
        fill: '#373748'
      }),
      React.createElement('path', {
        fill: '#000',
        d: 'M64,124,12,94V34L64,4l52,30V94ZM18.33,90.37,64,116.74l45.67-26.37V37.63L64,11.26,18.33,37.63Z'
      }),
      React.createElement('path', {
        d: 'M81.77,43.17c5.92,0,10.51,1.72,13.57,5.16,3.25,3.44,4.77,8.41,4.77,14.71q0,10.32-5.15,16.06c-3.44,3.82-8.22,5.73-14.53,5.73-5.92,0-10.51-1.72-13.56-5.35-3.25-3.63-4.78-8.6-4.78-15.29s1.72-12,5.16-15.67S75.46,43.17,81.77,43.17Zm-.57,5.16c-4.4,0-7.45,1.15-9.56,3.63s-3,6.31-3,11.66c0,5.73,1,9.74,3,12.42,2.11,2.48,5.16,3.82,9.56,3.82s7.64-1.34,9.74-3.82,3.25-6.5,3.25-11.85c0-5.54-1.15-9.55-3.25-12C88.65,49.48,85.59,48.33,81.2,48.33Z',
        fill: '#fff'
      }),
      React.createElement('path', {
        d: 'M39.35,71.45l.19,12.8H33.43L33.62,72l-.19-28.48h6.11l-.19,27.9Z',
        fill: '#fff'
      })
    );
  };

  Logo.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string
  };

  __$styleInject("/*\n * Copyright 2017 The boardgame.io Authors\n *\n * Use of this source code is governed by a MIT-style\n * license that can be found in the LICENSE file or at\n * https://opensource.org/licenses/MIT.\n */\n\n.bgio-card {\n  display: flex;\n  user-select: none;\n  font-family: monospace;\n  font-weight: bold;\n  font-size: 18px;\n  color: #ababab;\n  text-align: center;\n  flex-direction: column;\n  justify-content: center;\n  cursor: pointer;\n  background: #fff;\n  border-radius: 6px;\n  border: 1px solid #cdcdcd;\n  width: 100px;\n  height: 140px;\n  transition: all 0.1s;\n  overflow: hidden;\n}\n\n.bgio-card:not(.no-hover):hover {\n  transform: scale(1.2);\n}\n\n.bgio-card__front,\n.bgio-card__back {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  overflow: hidden;\n}\n\n.bgio-card__back {\n  background-image: url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%23ababab' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\");\n  background-position: 2px 2px;\n  outline: 8px solid #eee;\n  outline-offset: -20px;\n}\n", undefined);





  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();







  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };



  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };









  var objectWithoutProperties = function (obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };



















  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  /*
   * Copyright 2017 The boardgame.io Authors
   *
   * Use of this source code is governed by a MIT-style
   * license that can be found in the LICENSE file or at
   * https://opensource.org/licenses/MIT.
   */

  var Card = function Card(_ref) {
    var back = _ref.back,
      canHover = _ref.canHover,
      className = _ref.className,
      front = _ref.front,
      isFaceUp = _ref.isFaceUp,
      rest = objectWithoutProperties(_ref, ['back', 'canHover', 'className', 'front', 'isFaceUp']);

    var classNames = ['bgio-card'];
    if (!canHover) classNames.push('no-hover');
    if (className) classNames.push(className);

    return React.createElement(
      'div',
      _extends({ className: classNames.join(' ') }, rest),
      isFaceUp ? front : back
    );
  };

  Card.propTypes = {
    back: PropTypes.node,
    canHover: PropTypes.bool,
    className: PropTypes.string,
    front: PropTypes.node,
    isFaceUp: PropTypes.bool
  };

  Card.defaultProps = {
    back: React.createElement(
      'div',
      { className: 'bgio-card__back' },
      React.createElement(Logo, { width: '48' })
    ),
    canHover: true,
    front: React.createElement(
      'div',
      { className: 'bgio-card__front' },
      'Card'
    ),
    isFaceUp: false
  };

  __$styleInject("/*\n * Copyright 2017 The boardgame.io Authors\n *\n * Use of this source code is governed by a MIT-style\n * license that can be found in the LICENSE file or at\n * https://opensource.org/licenses/MIT.\n */\n\n.bgio-deck {\n  position: relative;\n  display: inline-flex;\n  z-index: 1;\n}\n", undefined);

  /*
   * Copyright 2018 The boardgame.io Authors
   *
   * Use of this source code is governed by a MIT-style
   * license that can be found in the LICENSE file or at
   * https://opensource.org/licenses/MIT.
   */

  var Deck = function (_React$Component) {
    inherits(Deck, _React$Component);

    function Deck(props) {
      classCallCheck(this, Deck);

      var _this = possibleConstructorReturn(this, (Deck.__proto__ || Object.getPrototypeOf(Deck)).call(this, props));

      _this.onClick = function () {
        var cards = [].concat(toConsumableArray(_this.state.cards));
        var topCard = cards.shift();

        if (_this.props.onClick) {
          _this.props.onClick(topCard);
        }

        _this.setState({
          cards: cards
        });
      };

      _this.state = {
        cards: props.cards
      };
      return _this;
    }

    createClass(Deck, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (this.props.cards.length !== nextProps.cards.length) {
          this.setState({ cards: nextProps.cards });
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
          className = _props.className,
          splayWidth = _props.splayWidth,
          rest = objectWithoutProperties(_props, ['className', 'splayWidth']);
        var cards = this.state.cards;

        var classNames = ['bgio-deck'];
        if (className) classNames.push(className);

        return React.createElement(
          'div',
          _extends({ className: classNames.join(' ') }, rest, { onClick: this.onClick }),
          cards.map(function (card, i) {
            return React.cloneElement(card, {
              key: i,
              canHover: i === 0, // Only the top card should apply a css hover effect
              isFaceUp: i === 0, // Only the top card should ever be face up
              style: {
                position: i ? 'absolute' : 'inherit',
                left: i * splayWidth,
                zIndex: -i
              }
            });
          })
        );
      }
    }]);
    return Deck;
  }(React.Component);

  Deck.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.node),
    className: PropTypes.string,
    onClick: PropTypes.func,
    splayWidth: PropTypes.number
  };

  Deck.defaultProps = {
    cards: [],
    splayWidth: 3
  };

  /*
   * Copyright 2018 The boardgame.io Authors
   *
   * Use of this source code is governed by a MIT-style
   * license that can be found in the LICENSE file or at
   * https://opensource.org/licenses/MIT.
   */

  /**
   * Grid
   *
   * Component that will show children on a cartesian regular grid.
   *
   * Props:
   *   rows       - Number of rows (height) of the grid.
   *   cols       - Number of columns (width) of the grid.
   *   style      - CSS style of the Grid HTML element.
   *   colorMap   - A map from 'x,y' => color.
   *   onClick    - (x, y) => {}
   *                Called when a square is clicked.
   *   onMouseOver    - (x, y) => {}
   *                Called when a square is mouse over.
   *   onMouseOut    - (x, y) => {}
   *                Called when a square is mouse out.
   *
   * Usage:
   *
   * <Grid rows={8} cols={8}>
   *   <Token x={1} y={2}/>
   * </Grid>
   */
  var Grid = function (_React$Component) {
    inherits(Grid, _React$Component);

    function Grid() {
      var _ref;

      var _temp, _this, _ret;

      classCallCheck(this, Grid);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // eslint-disable-next-line
      return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Grid.__proto__ || Object.getPrototypeOf(Grid)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), possibleConstructorReturn(_this, _ret);
    }

    createClass(Grid, [{
      key: '_getCellColor',
      value: function _getCellColor(x, y) {
        var key = x + ',' + y;
        var color = 'white';
        if (key in this.props.colorMap) {
          color = this.props.colorMap[key];
        }
        return color;
      }
    }, {
      key: '_getGrid',
      value: function _getGrid() {
        if (!this.props.outline) {
          return null;
        }

        var squares = [];
        for (var x = 0; x < this.props.cols; x++) {
          for (var y = 0; y < this.props.rows; y++) {
            squares.push(React.createElement(Square, {
              key: this.props.cols * y + x,
              style: { fill: this._getCellColor(x, y) },
              x: x,
              y: y,
              size: this.props.cellSize,
              onClick: this.onClick,
              onMouseOver: this.onMouseOver,
              onMouseOut: this.onMouseOut
            }));
          }
        }
        return squares;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var tokens = React.Children.map(this.props.children, function (child) {
          return React.cloneElement(child, {
            template: Square,
            onClick: _this2.onClick,
            onMouseOver: _this2.onMouseOver,
            onMouseOut: _this2.onMouseOut
          });
        });

        return React.createElement(
          'svg',
          {
            viewBox: '0 0 ' + this.props.cols + ' ' + this.props.rows,
            style: this.props.style
          },
          React.createElement(
            'g',
            null,
            this._getGrid()
          ),
          tokens
        );
      }
    }]);
    return Grid;
  }(React.Component);

  /**
   * Square
   *
   * Component that renders a square inside a Grid.
   *
   * Props:
   *   x       - X coordinate on grid coordinates.
   *   y       - Y coordinate on grid coordinates.
   *   size    - Square size.
   *   style   - Custom styling.
   *   onClick - Invoked when a Square is clicked.
   *   onMouseOver - Invoked when a Square is mouse over.
   *   onMouseOut - Invoked when a Square is mouse out.
   *
   * Not meant to be used by the end user directly (use Token).
   * Also not exposed in the NPM.
   */
  Grid.propTypes = {
    rows: PropTypes.number.isRequired,
    cols: PropTypes.number.isRequired,
    outline: PropTypes.bool,
    style: PropTypes.object,
    colorMap: PropTypes.object,
    cellSize: PropTypes.number,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
  };
  Grid.defaultProps = {
    colorMap: {},
    outline: true,
    cellSize: 1
  };

  var _initialiseProps = function _initialiseProps() {
    var _this4 = this;

    this.onClick = function (args) {
      if (_this4.props.onClick) {
        _this4.props.onClick(args);
      }
    };

    this.onMouseOver = function (args) {
      if (_this4.props.onMouseOver) {
        _this4.props.onMouseOver(args);
      }
    };

    this.onMouseOut = function (args) {
      if (_this4.props.onMouseOut) {
        _this4.props.onMouseOut(args);
      }
    };
  };

  var Square = function (_React$Component2) {
    inherits(Square, _React$Component2);

    function Square() {
      var _ref2;

      var _temp2, _this3, _ret2;

      classCallCheck(this, Square);

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _ret2 = (_temp2 = (_this3 = possibleConstructorReturn(this, (_ref2 = Square.__proto__ || Object.getPrototypeOf(Square)).call.apply(_ref2, [this].concat(args))), _this3), _this3.onClick = function () {
        _this3.props.onClick({
          x: _this3.props.x,
          y: _this3.props.y
        });
      }, _this3.onMouseOver = function () {
        _this3.props.onMouseOver({
          x: _this3.props.x,
          y: _this3.props.y
        });
      }, _this3.onMouseOut = function () {
        _this3.props.onMouseOut({
          x: _this3.props.x,
          y: _this3.props.y
        });
        // eslint-disable-next-line
      }, _temp2), possibleConstructorReturn(_this3, _ret2);
    }

    createClass(Square, [{
      key: 'render',
      value: function render() {
        var tx = this.props.x * this.props.size;
        var ty = this.props.y * this.props.size;

        // If a child is passed, render child.
        if (this.props.children) {
          return React.createElement(
            'g',
            {
              onClick: this.onClick,
              onMouseOver: this.onMouseOver,
              onMouseOut: this.onMouseOut,
              transform: 'translate(' + tx + ', ' + ty + ')'
            },
            this.props.children
          );
        }

        // If no child, render a square.
        return React.createElement(
          'g',
          {
            onClick: this.onClick,
            onMouseOver: this.onMouseOver,
            onMouseOut: this.onMouseOut,
            transform: 'translate(' + tx + ', ' + ty + ')'
          },
          React.createElement('rect', {
            style: this.props.style,
            width: this.props.size,
            height: this.props.size,
            x: 0,
            y: 0
          })
        );
      }
    }]);
    return Square;
  }(React.Component);
  Square.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    size: PropTypes.number,
    style: PropTypes.any,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    children: PropTypes.element
  };
  Square.defaultProps = {
    size: 1,
    x: 0,
    y: 0,
    style: { fill: '#fff' }
  };

  /*
   * Copyright 2018 The boardgame.io Authors
   *
   * Use of this source code is governed by a MIT-style
   * license that can be found in the LICENSE file or at
   * https://opensource.org/licenses/MIT.
   */

  /**
   * HexGrid
   *
   * Component to display a hex grid.
   * Reference: https://www.redblobgames.com/grids/hexagons/.
   *
   * We use cube co-ordinates (see reference).
   *
   * Props:
   *   levels     - The number of levels around the central hex.
   *   style      - CSS style of the HTML element.
   *
   * Usage:
   *
   * <HexGrid levels={5}>
   *   <Token x={0} y={0} z={0}/>
   * </HexGrid>
   */
  var HexGrid = function (_React$Component) {
    inherits(HexGrid, _React$Component);

    function HexGrid() {
      var _ref;

      var _temp, _this, _ret;

      classCallCheck(this, HexGrid);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // eslint-disable-next-line
      return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = HexGrid.__proto__ || Object.getPrototypeOf(HexGrid)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps$1.call(_this), _temp), possibleConstructorReturn(_this, _ret);
    }

    createClass(HexGrid, [{
      key: '_getCellColor',
      value: function _getCellColor(x, y, z) {
        var key = x + ',' + y + ',' + z;
        var color = 'white';
        if (key in this.props.colorMap) {
          color = this.props.colorMap[key];
        }
        return color;
      }
    }, {
      key: '_getGrid',
      value: function _getGrid() {
        if (!this.props.outline) {
          return null;
        }

        var hexes = [];
        var r = this.props.levels;
        for (var x = -r; x <= r; x++) {
          for (var y = -r; y <= r-1; y++) {
            var z = -x - y;
            if (Math.abs(z) > r) continue;
            if (z === -r) continue;
            hexes.push(React.createElement(Hex, {
              key: x + ':' + y + ':' + z,
              style: { fill: this._getCellColor(x, y, z) },
              x: x,
              y: y,
              z: z,
              size: this.props.cellSize,
              onClick: this.onClick,
              onMouseOver: this.onMouseOver,
              onMouseOut: this.onMouseOut
            }));
          }
        }
        return hexes;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var tokens = React.Children.map(this.props.children, function (child) {
          return React.cloneElement(child, {
            template: Hex,
            onClick: _this2.onClick,
            onMouseOver: _this2.onMouseOver,
            onMouseOut: _this2.onMouseOut
          });
        });

        var t = this.props.cellSize * this.props.levels * 2;
        return React.createElement(
          'svg',
          {
            viewBox: (-t+0.9) + ' ' + (-t+0.9) + ' ' + 2 * (t-0.9) + ' ' + 2 * (t-0.9),
            style: this.props.style
          },
          React.createElement(
            'g',
            {transform: "translate(0, -1)"},
            this._getGrid()
          ),
          tokens
        );
      }
    }]);
    return HexGrid;
  }(React.Component);

  /**
   * Hex (flat-topped).
   *
   * Component that renders a hexagon inside a HexGrid.
   *
   * Props:
   *   x       - X coordinate (cube coordinates).
   *   y       - Y coordinate (cube coordinates).
   *   z       - Z coordinate (cube coordinates).
   *   size    - Hex size.
   *   style   - Custom styling.
   *   onClick - Invoked when a Hex is clicked.
   *   onMouseOver - Invoked when a Hex is mouse over.
   *   onMouseOut - Invoked when a Hex is mouse out.
   *
   * Not meant to be used by the end user directly (use Token).
   * Also not exposed in the NPM.
   */
  HexGrid.propTypes = {
    levels: PropTypes.number.isRequired,
    outline: PropTypes.bool,
    style: PropTypes.object,
    colorMap: PropTypes.object,
    cellSize: PropTypes.number,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
  };
  HexGrid.defaultProps = {
    levels: 5,
    colorMap: {},
    outline: true,
    cellSize: 1
  };

  var _initialiseProps$1 = function _initialiseProps() {
    var _this4 = this;

    this.onClick = function (args) {
      if (_this4.props.onClick) {
        _this4.props.onClick(args);
      }
    };

    this.onMouseOver = function (args) {
      if (_this4.props.onMouseOver) {
        _this4.props.onMouseOver(args);
      }
    };

    this.onMouseOut = function (args) {
      if (_this4.props.onMouseOut) {
        _this4.props.onMouseOut(args);
      }
    };
  };

  var Hex = function (_React$Component2) {
    inherits(Hex, _React$Component2);

    function Hex(props) {
      classCallCheck(this, Hex);

      var _this3 = possibleConstructorReturn(this, (Hex.__proto__ || Object.getPrototypeOf(Hex)).call(this, props));

      _this3.onClick = function () {
        _this3.props.onClick({
          x: _this3.props.x,
          y: _this3.props.y,
          z: _this3.props.z
        });
      };

      _this3.onMouseOver = function () {
        _this3.props.onMouseOver({
          x: _this3.props.x,
          y: _this3.props.y,
          z: _this3.props.z
        });
      };

      _this3.onMouseOut = function () {
        _this3.props.onMouseOut({
          x: _this3.props.x,
          y: _this3.props.y,
          z: _this3.props.z
        });
      };

      return _this3;
    }

    createClass(Hex, [{
      key: 'render',
      value: function render() {
        var tx = this.center.x;
        var ty = this.center.y;

        // If a child is passed, render child.
        if (this.props.children) {
          return React.createElement(
            'g',
            {
              onClick: this.onClick,
              onMouseOver: this.onMouseOver,
              onMouseOut: this.onMouseOut,
              transform: 'translate(' + (tx-1.015) + ', ' + (ty-1.87) + ')'
            },
            this.props.children
          );
        }

        // If no child, render a hex.
        return React.createElement(
          'g',
          {
            onClick: this.onClick,
            onMouseOver: this.onMouseOver,
            onMouseOut: this.onMouseOut,
            transform: 'translate(' + tx + ', ' + ty + ')'
          },
          React.createElement('polygon', {
            style: this.props.style,
            points: this.points,
            stroke: '#000',
            strokeWidth: 0.01
          }),
          React.createElement('text', {
            style: {fill: "black", fontSize: 0.5, position: "relative", left: "-10px", cursor: "default"},
            x: -0.6,
            y: 0.2
          }, this.props.x+':'+this.props.y+':'+this.props.z)
        );
      }
    }, {
      key: 'width',
      get: function get$$1() {
        return this.props.size * 2;
      }
    }, {
      key: 'height',
      get: function get$$1() {
        return (Math.sqrt(3) / 2 * this.width).toFixed(3);
      }

      /**
       * Get the co-ordinates of the hex center.
       */

    }, {
      key: 'center',
      get: function get$$1() {
        var q = this.props.x;
        var r = this.props.z;
        var x = this.props.size * 3 * q / 2.0;
        var y = this.props.size * Math.sqrt(3) * (r + q / 2.0);
        return { x: x, y: y };
      }

      /**
       * Get the points of the vertices.
       */

    }, {
      key: 'points',
      get: function get$$1() {
        //   b____c
        //   /    \
        // a/      \d
        //  \      /
        //   \____/
        //   f    e

        var s = this.props.size;
        var h = this.height;

        var xa = -s;
        var xb = -s / 2.0;
        var xc = +s / 2.0;
        var xd = +s;
        var xe = xc;
        var xf = xb;

        var ya = 0.0;
        var yb = h / 2.0;
        var yc = yb;
        var yd = ya;
        var ye = -h / 2.0;
        var yf = ye;

        var flatTop = [xa + ',' + ya, xb + ',' + yb, xc + ',' + yc, xd + ',' + yd, xe + ',' + ye, xf + ',' + yf];

        return flatTop.join(' ');
      }
    }]);
    return Hex;
  }(React.Component);
  Hex.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
    size: PropTypes.number,
    style: PropTypes.any,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    children: PropTypes.element
  };
  Hex.defaultProps = {
    size: 1,
    x: 0,
    y: 0,
    z: 0,
    style: { fill: '#fff' }
  };

  /*
   * Copyright 2018 The boardgame.io Authors
   *
   * Use of this source code is governed by a MIT-syle
   * license that can be found in the LICENSE file or at
   * https://opensource.org/licenses/MIT.
   */

  /**
   * Token
   *
   * Component that represents a board game piece (or token).
   * Can be used by itself or with one of the grid systems
   * provided (Grid or HexGrid).
   *
   * A token renders as a square inside a Grid and a
   * hexagon inside a HexGrid. Additionally, you can pass
   * it a child if you want any other custom rendering.
   *
   * Props:
   *   x       - X coordinate on grid / hex grid.
   *   y       - Y coordinate on grid / hex grid.
   *   z       - Z coordinate on hex grid.
   *   animate - Changes in position are animated if true.
   *   animationDuration - Length of animation.
   *   onClick - Called when the token is clicked.
   *   onMouseOver - Called when the token is mouse over.
   *   onMouseOut - Called when the token is mouse out.
   *
   * Usage:
   *
   * <Grid rows={8} cols={8}>
   *   <Token x={1} y={2}/>
   * </Grid>
   *
   * <HexGrid>
   *   <Token x={1} y={2} z={-3}/>
   * </HexGrid>
   *
   * <Grid rows={8} cols={8}>
   *   <Token x={1} y={2}>
   *     <Knight color="white"/>
   *   </Token>
   * </Grid>
   */

  var Token = function (_React$Component) {
    inherits(Token, _React$Component);

    function Token() {
      classCallCheck(this, Token);
      return possibleConstructorReturn(this, (Token.__proto__ || Object.getPrototypeOf(Token)).apply(this, arguments));
    }

    createClass(Token, [{
      key: 'componentWillMount',


      /**
       * Sets the x and y of the state on creation.
       */
      value: function componentWillMount() {
        this.setState(this.getCoords());
      }

      /**
       * If there is a change in props, saves old x/y,
       * and current time. Starts animation.
       * @param {Object} nextProps Next props.
       */

    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var oldCoord = this.getCoords();
        var newCoord = this.getCoords(nextProps);

        // Debounce.
        if (oldCoord.x === newCoord.x && oldCoord.y === newCoord.y) {
          return;
        }

        this.setState(_extends({}, this.state, {
          originTime: Date.now(),
          originX: oldCoord.x,
          originY: oldCoord.y,
          originZ: oldCoord.z
        }));

        requestAnimationFrame(this._animate(Date.now()));
      }

      /**
       * Recursively animates x and y.
       * @param {number} now Unix timestamp when this was called.
       */

    }, {
      key: '_animate',
      value: function _animate(now) {
        var _this2 = this;

        return function () {
          var elapsed = now - _this2.state.originTime;
          var svgCoord = _this2.getCoords();
          if (elapsed < _this2.props.animationDuration && _this2.props.animate) {
            var percentage = _this2._easeInOutCubic(elapsed, 0, 1, _this2.props.animationDuration);

            _this2.setState(_extends({}, _this2.state, {
              x: (svgCoord.x - _this2.state.originX) * percentage + _this2.state.originX,
              y: (svgCoord.y - _this2.state.originY) * percentage + _this2.state.originY,
              z: (svgCoord.z - _this2.state.originZ) * percentage + _this2.state.originZ
            }));

            requestAnimationFrame(_this2._animate(Date.now()));
          } else {
            _this2.setState(_extends({}, _this2.state, {
              x: svgCoord.x,
              y: svgCoord.y,
              z: svgCoord.z
            }));
          }
        }
      }

      /**
       * Gets SVG x/y/z coordinates.
       * @param {Object} props Props object to get coordinates from.
       * @return {Object} Object with x, y and z parameters.
       */

    }, {
      key: 'getCoords',
      value: function getCoords() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

        return { x: props.x, y: props.y, z: props.z };
      }

      /**
       * Returns animation easing value. See http://easings.net/#easeInOutCubic.
       * @param {number} t Current time.
       * @param {number} b Beginning value.
       * @param {number} c Final value.
       * @param {number} d Duration.
       */

    }, {
      key: '_easeInOutCubic',
      value: function _easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
      }
    }, {
      key: 'render',
      value: function render() {
        var Component = this.props.template;

        return React.createElement(
          Component,
          {
            x: this.state.x,
            y: this.state.y,
            z: this.state.z,
            style: this.props.style,
            onClick: this.props.onClick,
            onMouseOver: this.props.onMouseOver,
            onMouseOut: this.props.onMouseOut
          },
          this.props.children
        );
      }
    }]);
    return Token;
  }(React.Component);

  Token.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
    template: PropTypes.any,
    style: PropTypes.any,
    animate: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    children: PropTypes.element,
    animationDuration: PropTypes.number
  };
  Token.defaultProps = {
    animationDuration: 750,
    template: Square
  };

  /*
   * Copyright 2017 The boardgame.io Authors
   *
   * Use of this source code is governed by a MIT-style
   * license that can be found in the LICENSE file or at
   * https://opensource.org/licenses/MIT.
   */

  exports.Card = Card;
  exports.Deck = Deck;
  exports.Grid = Grid;
  exports.HexGrid = HexGrid;
  exports.Token = Token;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
