import getParser from '../parser'

export const repository = async () => {
  const parserModule = '@astonish/parser-babel'
  const parser = await getParser(parserModule)

  return {
    parserModule,
    repositoryId: null,
    input: parser.example,
  }
}
