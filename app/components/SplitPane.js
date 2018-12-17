import React, { useState } from 'react'
import usePointerDrag from '../utils/usePointerDrag'

import styled from 'astroturf'
const Grid = styled('div')`
  display: grid;
  height: 100%;

  &.split-vertical {
    grid-template-columns: 1fr 1px 1fr;
  }

  &.split-horizontal {
    grid-template-rows: 1fr 1px 1fr;
  }
`

const Resizer = styled('div')`
  background: #000;
  opacity: 0.5;
  z-index: 1;
  user-select: none;
  background-clip: padding-box;

  &:hover {
    transition: all 1s ease;
  }
  &.split-vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;

    &:hover {
      border-left: 5px solid rgba(0, 0, 0, 0.5);
      border-right: 5px solid rgba(0, 0, 0, 0.5);
    }
  }

  &.split-horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;

    &:hover {
      border-top: 5px solid rgba(0, 0, 0, 0.5);
      border-bottom: 5px solid rgba(0, 0, 0, 0.5);
    }
  }
`

const propTypes = {}

function SplitPane({ children, split }) {
  const [_, spec] = usePointerDrag((event, { position, delta }) => {
    if (split === 'horizontal') event.target.style.top = delta
    console.log(event.target, delta)
  })

  const [first, second] = React.Children.toArray(children).filter(
    React.isValidElement
  )

  return (
    <Grid split={split}>
      {first}
      <Resizer split={split} draggable={false} {...spec} />
      {second}
    </Grid>
  )
}

SplitPane.propTypes = propTypes

export default SplitPane
