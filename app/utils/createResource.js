import { unstable_createResource } from 'react-cache'

export default function createResource(arg) {
  const { read, preload } = unstable_createResource(arg)
  read.preload = preload
  return read
}
