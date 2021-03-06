import React, { useRef } from 'react'
import cn from 'classnames'
import { Tab } from 'react-bootstrap'
import useBoundingRect from '../utils/useBoundingRect'
import { usePaneActions } from './Content'
import { useDragTarget } from './TabDnD'

import styled, { css } from 'astroturf'

const styles = css`
  .body {
    width: 100%;
    position: relative;
    height: calc(100% - 40px);
    background-color: #eee;
  }
`

const DropPad = styled('div')`
  position: absolute;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.3);
  transition: all 0.5s ease-in;

  &.position-full {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
  &.position-right {
    top: 0;
    bottom: 0;
    right: 0;
    width: 50%;
  }
  &.position-left {
    top: 0;
    bottom: 0;
    left: 0;
    width: 50%;
  }
  &.position-top {
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
  }
  &.position-bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
  }
`

const propTypes = {}

function getPosition(pos, bounds) {
  const sliceX = Math.max(bounds.width * 0.1, 20)
  const sliceY = Math.max(bounds.height * 0.1, 20)
  // console.log(pos, bounds.right, bounds.right - sliceX)
  if (pos.x > bounds.right - sliceX) return 'right'
  if (pos.x < bounds.left + sliceX) return 'left'
  if (pos.y > bounds.bottom - sliceY) return 'bottom'
  if (pos.y < bounds.top + sliceY) return 'top'
  return 'full'
}

function PaneBody({ children, ...props }) {
  const ref = useRef()
  const actions = usePaneActions()

  const bounds = useBoundingRect(ref)

  const [position, posSpec] = useDragTarget({
    onDrop(data, position) {
      const quadrant = getPosition(position, bounds)
      actions.move(data.path, props.path, quadrant)
    },
  })

  return (
    <Tab.Content
      ref={ref}
      {...props}
      {...posSpec}
      className={cn(styles.body, posSpec.className)}
    >
      {children}
      {position && <DropPad position={getPosition(position, bounds)} />}
    </Tab.Content>
  )
}

PaneBody.propTypes = propTypes

export default PaneBody
