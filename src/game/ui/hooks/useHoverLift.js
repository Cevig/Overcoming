// useHoverLift.js
import {useCallback, useState} from 'react';

export function useHoverLift() {
  const [hoveredId, setHoveredId] = useState(null);

  const bindHover = useCallback(
    (id) => ({
      onMouseOver: () => setHoveredId(id),
      onMouseOut: () => setHoveredId(null),
    }),
    []
  );

  const HoverOverlay = ({ className = 'hover-lift' }) => (
    hoveredId ? (
      <use
        href={`#${hoveredId}`}
        className={className}
        style={{ pointerEvents: 'none' }}
      />
    ) : null
  );

  return { bindHover, HoverOverlay };
}
