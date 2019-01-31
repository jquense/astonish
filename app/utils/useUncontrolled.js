import { useState, useRef } from 'react'
import * as Utils from 'uncontrollable/lib/utils'

export default function useUncontrolled(props, fieldName, handlerName) {
  const prevProps = useRef({})
  const defaultValue = props[Utils.defaultKey(fieldName)]
  const [stateValue, setState] = useState(defaultValue)
  const isProp = Utils.isProp(props, fieldName)
  const wasProp = Utils.isProp(prevProps.current, fieldName)

  prevProps.current = props

  /**
   * If a prop switches from controlled to Uncontrolled
   * reset its value to the defaultValue
   */
  if (!isProp && wasProp) {
    return setState(defaultValue)
  }

  const handler = (value, ...args) => {
    if (props[handlerName]) {
      props[handlerName](value, ...args)
    }
    setState(value)
  }

  return {
    [fieldName]: isProp ? props[fieldName] : stateValue,
    [handlerName]: handler,
  }
}
