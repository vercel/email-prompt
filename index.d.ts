/// <reference types="node" />

interface IOptions {
  start?: string,
  domains?: Set<string>,
  forceLowerCase?: boolean,
  suggestionColor?: string,
  autoCompleteChars?: Set<string>,
  resolveChars?: Set<string>,
  abortChars?: Set<string>,
  allowInvalidChars?: boolean,
}

declare function emailPrompt(options: IOptions): Promise<string>

export = emailPrompt
