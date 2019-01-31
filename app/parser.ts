import createResource from './utils/createResource'
import Parser from '@astonish/ast-parser/src'
import { string } from 'prop-types'

async function getParser(parser: string): Promise<Parser> {
  // @ts-ignore
  return global.require(parser)
}

getParser.resource = createResource(getParser)

export default getParser
