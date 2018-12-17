import db from './db'
import store from 'store/dist/store.modern'
import * as Defaults from './defaults'

export default async () => {
  // const general = await db.repositories.get('@@default')
  const config = store.get('last-config') || {
    respositoryId: null,
  }

  const repo = config.respositoryId
    ? await db.repositories.get(config.respositoryId)
    : await Defaults.repository()

  return {
    repo,
  }
}
