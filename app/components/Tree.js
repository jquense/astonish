import React from 'react'
import Layout from 'react-tackle-box/Layout'

import styled from 'astroturf'
import useUncontrolled from '../utils/useUncontrolled'

const Arrow = styled('span')`
  position: absolute;
  font: inherit;
  cursor: pointer;
  left: -1.1em;
  top: 0;
  display: block;
  user-select: none;

  &:after {
    content: '▾';
  }

  &.collapsed {
    transform: rotate(-90deg);
  }
`

const propTypes = {}

function Tree({ children, collapsible, renderLabel, ...props }) {
  const { expanded, onToggle } = useUncontrolled(props, 'expanded', 'onToggle')

  let hasChildren = !!React.Children.toArray(children).filter(Boolean).length

  const arrow = <Arrow collapsed={!expanded} />

  return (
    <>
      <Layout
        pad="2"
        onClick={() => onToggle(!expanded)}
        align="flex-start"
        style={{ position: 'relative' }}
      >
        {collapsible && hasChildren && arrow}

        {renderLabel(expanded)}
      </Layout>
      {hasChildren && ((!collapsible || expanded) && children)}
    </>
  )
}

Tree.propTypes = propTypes

export default Tree
