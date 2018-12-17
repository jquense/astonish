import Dexie from 'dexie'
import relationships from 'dexie-relationships'

const db = new Dexie('@astonish/app', { addons: [relationships] })

db.version(1).stores({
  workspaces: '++id, name',
  layouts: '++id',
  configs: '++id',
  repositories: `
    ++id,
    name,
    parserId,
    transformerId,
    workspaceId -> workspaces.id,
    layoutId -> layouts.id,
    config Id-> configs.id
  `,
})

export default db
