import React from 'react';
import PropTypes from 'prop-types';
import {createPoint} from "../helpers/Constants";
import {isSame} from "../helpers/Utils";
import {useHoverLift} from "./hooks/useHoverLift";

/**
 * HexGrid
 *
 * Displays a hexagon grid using cube coordinates.
 */
export const HexGrid = (props) => {
  const {
    levels,
    players,
    outline,
    style,
    colorMap,
    cellSize,
    onClick,
    onMouseOver,
    onMouseOut,
    children,
  } = props;
  const { bindHover, HoverOverlay } = useHoverLift();

  // Returns the fill color from the colorMap.
  const getCellColor = (x, y, z, colorMap) => {
    // Default behavior: try to get the color by coordinate key.
    const key = `${x},${y},${z}`;
    let color = (colorMap && colorMap[key]) || 'white';

    // If the default is white, run your custom logic.
    if (color === 'white' && colorMap) {
      const point = createPoint(x, y, z);
      for (const playerColor in colorMap) {
        const points = colorMap[playerColor];
        if (Array.isArray(points)) {
          const found = points.find(isSame(point));
          if (found !== undefined && isSame(found)(point)) {
            color = playerColor;
            break;
          }
        }
      }
    }
    return color;
  };

  const r = levels;
  const hexes = [];

  if (outline) {
    const pushHex = (x, y, z) => {
      const id = `hex-${x}|${y}|${z}`;
      hexes.push(
        <Hex
          key={`${x}:${y}:${z}`}
          id={id}
          style={{ fill: getCellColor(x, y, z, colorMap) }}
          x={x}
          y={y}
          z={z}
          size={cellSize}
          onClick={() => onClick && onClick({ x, y, z })}
          onMouseOver={() => onMouseOver && onMouseOver({ x, y, z })}
          onMouseOut={() => onMouseOut && onMouseOut({ x, y, z })}
          {...bindHover(id)}
        />
      );
    };

    if (players === 3) {
      for (let x = -r; x <= r - 1; x++) {
        for (let y = -r; y <= r - 1; y++) {
          const z = -x - y;
          if (Math.abs(z) > r) continue;
          if (z === -r) continue;
          pushHex(x, y, z);
        }
      }
    } else if (players === 2) {
      for (let x = -r; x <= r; x++) {
        for (let y = -r; y <= r; y++) {
          const z = -x - y;
          if (Math.abs(z) > r) continue;
          if (z === -r - 1) continue;
          pushHex(x, y, z);
        }
      }
    } else {
      for (let x = -r; x <= r; x++) {
        for (let y = -r; y <= r - 1; y++) {
          const z = -x - y;
          if (Math.abs(z) > r) continue;
          if (z === -r) continue;
          pushHex(x, y, z);
        }
      }
    }
  }

  // Pass extra props (such as the default template) to any children.
  const tokens = React.Children.map(children, (child) =>
    React.cloneElement(child, {
      template: Hex,
      onClick,
      onMouseOver,
      onMouseOut,
    })
  );

  // Calculate viewBox based on cellSize and levels.
  const t = cellSize * levels * 2 + (4 - levels);
  let viewBox;
  if (players === 2) {
    viewBox = `${-t + 0.8} ${-t - 0.2} ${2 * t - 1.5} ${2 * t - 1.5}`;
  } else if (players === 3) {
    viewBox = `${-t + 0.3} ${-t + 0.8} ${2 * (t - 0.9)} ${2 * (t - 0.9)}`;
  } else {
    viewBox = `${-t + 1} ${-t + 0.9} ${2 * (t - 1)} ${2 * (t - 1)}`;
  }

  return (
    <svg viewBox={viewBox} style={style} className="board-svg">
      <defs>
        <pattern id="runePattern" patternUnits="userSpaceOnUse" width={2} height={2}>
          <image href="/assets/rune-hex.png" x={0} y={0} width={2} height={2} />
        </pattern>
      </defs>
      <g transform="translate(0, -1)">{hexes}<HoverOverlay /></g>
      {tokens}
    </svg>
  );
};

HexGrid.propTypes = {
  levels: PropTypes.number.isRequired,
  players: PropTypes.number,
  outline: PropTypes.bool,
  style: PropTypes.object,
  colorMap: PropTypes.object,
  cellSize: PropTypes.number,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  children: PropTypes.node,
};

HexGrid.defaultProps = {
  levels: 5,
  players: 4,
  colorMap: {},
  outline: true,
  cellSize: 1,
};

/**
 * Hex
 *
 * Renders a flat-topped hexagon. If children are provided, it offsets
 * the position slightly (useful for rendering tokens).
 */
export const Hex = (props) => {
  const { x, y, z, size, style, onClick, onMouseOver, onMouseOut, children } = props;

  // Calculate the center of the hexagon.
  const centerX = size * 3 * x / 2;
  const centerY = size * Math.sqrt(3) * (z + x / 2);

  // Calculate width and height.
  const width = size * 2;
  const height = (Math.sqrt(3) / 2) * width;
  const id = props.id || `token-${Math.random()}`;

  // Calculate the points of the hexagon.
  const points = [
    `${-size},0`,
    `${-size / 2},${height / 2}`,
    `${size / 2},${height / 2}`,
    `${size},0`,
    `${size / 2},${-height / 2}`,
    `${-size / 2},${-height / 2}`,
  ].join(' ');

  const handleClick = () => onClick && onClick({ x, y, z });
  const handleMouseOver = () => onMouseOver && onMouseOver({ x, y, z });
  const handleMouseOut = () => onMouseOut && onMouseOut({ x, y, z });

  if (children) {
    return (
      <g
        id={id}
        key={id}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        transform={`translate(${centerX - 1.015}, ${centerY - 1.87})`}
        className="token-g"
      >
        {children}
      </g>
    );
  }

  return (
    <g
      id={id}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      transform={`translate(${centerX}, ${centerY})`}
      className="tile-g"
    >
      <polygon style={style} points={points} text={`x:`+x+` | y:`+y+` | z:`+z} stroke="#1f2e38" strokeWidth="0.01" />
    </g>
  );
};

Hex.propTypes = {
  id: PropTypes.any,
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
  size: PropTypes.number,
  style: PropTypes.any,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  children: PropTypes.node,
};

Hex.defaultProps = {
  size: 1,
  x: 0,
  y: 0,
  z: 0,
  style: { fill: '#fff' },
};

/**
 * Token
 *
 * Represents a game piece that can be rendered inside a HexGrid.
 * It smoothly animates between coordinate updates.
 */
export const Token = (props) => {
  const {
    x,
    y,
    z,
    template: Template,
    style,
    animate,
    animationDuration,
    onClick,
    onMouseOver,
    onMouseOut,
    children,
  } = props;

  const [coords, setCoords] = React.useState({ x, y, z });
  const animationFrameRef = React.useRef(null);

  const easeInOutCubic = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  };

  React.useEffect(() => {
    if (
      x == null ||
      y == null ||
      z == null ||
      coords.x == null ||
      coords.y == null ||
      coords.z == null
    ) {
      setCoords({ x, y, z });
      return;
    }
    // If animation is disabled, jump to the new coords immediately.
    if (!animate) {
      setCoords({ x, y, z });
      return;
    }
    // If the coordinates are already current, do nothing.
    if (coords.x === x && coords.y === y && coords.z === z) return;

    const startTime = Date.now();
    const startCoords = { ...coords };

    const animateFrame = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      if (elapsed < animationDuration) {
        const percentage = easeInOutCubic(elapsed, 0, 1, animationDuration);
        setCoords({
          x: startCoords.x + (x - startCoords.x) * percentage,
          y: startCoords.y + (y - startCoords.y) * percentage,
          z: startCoords.z + (z - startCoords.z) * percentage,
        });
        animationFrameRef.current = requestAnimationFrame(animateFrame);
      } else {
        setCoords({ x, y, z });
      }
    };

    // Start the animation.
    animationFrameRef.current = requestAnimationFrame(animateFrame);

    // Cleanup: cancel any outstanding frame if the effect re-runs.
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [x, y, z, animate, animationDuration]); // re-run when these change

  return (
    <Template
      x={coords.x}
      y={coords.y}
      z={coords.z}
      style={style}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {children}
    </Template>
  );
};

Token.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
  template: PropTypes.elementType,
  style: PropTypes.any,
  animate: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  children: PropTypes.node,
  animationDuration: PropTypes.number,
};

Token.defaultProps = {
  animationDuration: 750,
  animate: true,
  template: Hex,
};
