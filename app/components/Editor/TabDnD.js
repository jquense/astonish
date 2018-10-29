import createDragAndDrop from '../DragAndDrop'

const {
  DragAndDropProvider,
  useDragSource,
  useDragTarget,
} = createDragAndDrop()

export { useDragSource, useDragTarget }

export default DragAndDropProvider
