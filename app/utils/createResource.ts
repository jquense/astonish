import { unstable_createResource } from 'react-cache'

interface Resource<TInput = any, TValue = {}> {
  (key?: TInput): TValue
  preload(key?: TInput): void
}

function createResource<TValue, TInput>(
  arg: (input: TInput) => PromiseLike<TValue>
): Resource<TInput, TValue> {
  const { read, preload } = unstable_createResource<TInput, TValue>(arg) as any
  read.preload = preload
  return read
}

export default createResource
