import PropTypes from 'prop-types'
import React from 'react'

export default function CompactValue({ isArray, value }) {
  if (isArray) {
    return value.length ? (
      <span>
        [{value.length} {value.length > 1 ? 'elements' : 'element'}]
      </span>
    ) : (
      '[ ]'
    )
  }

  let keys = Object.keys(value)
  if (keys.length === 0) return '{ }'

  if (keys.length > 5)
    keys = keys.slice(0, 5).concat([`... +${keys.length - 5}`])

  return (
    <span>
      {'{'}
      {keys.join(', ')}
      {'}'}
    </span>
  )
}
