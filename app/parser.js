import createResource from './utils/createResource'

async function getParser(parser) {
  return global.require(parser)
}

getParser.resource = createResource(getParser)

export default getParser
