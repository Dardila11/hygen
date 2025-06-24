import newline from '../newline'
import type { RenderedAction } from '../types'

// A more specific type for the location attributes
type LocationAttributes = {
  at_line?: number
  prepend?: boolean
  append?: boolean
  before?: string
  after?: string
}

// A type for the action attributes we care about
type InjectorAttributes = LocationAttributes & {
  skip_if?: string
  eof_last?: boolean
  replace?: string
}

const EOLRegex = /\r?\n/

class ContentInjector {
  private readonly attributes: InjectorAttributes
  private readonly body: string
  private readonly content: string
  private readonly lines: string[]
  private readonly newlineChar: string

  constructor(action: RenderedAction, content: string) {
    this.attributes = action.attributes
    this.body = action.body || ''
    this.content = content
    this.newlineChar = newline(content)
    this.lines = content.split(this.newlineChar)
  }

  /**
   * Executes the injection process.
   * @returns The modified content string.
   */
  public execute(): string {
    if (this.shouldSkip()) {
      return this.content
    }

    const { replace } = this.attributes
    if (replace) {
      return this.performReplace()
    }

    const index = this.findIndex()
    if (index === -1) {
      // No location attribute found or pattern not found, return original content
      return this.content
    }

    const bodyToInsert = this.prepareBody()
    this.lines.splice(index, 0, bodyToInsert)

    return this.lines.join(this.newlineChar)
  }

  /**
   * Performs a find-and-replace operation on the content.
   */
  private performReplace(): string {
    const { replace } = this.attributes
    if (!replace) {
      return this.content
    }
    const pattern = new RegExp(replace, 'g')
    return this.content.replace(pattern, this.body)
  }

  /**
   * Determines if the injection should be skipped based on the 'skip_if' attribute.
   */
  private shouldSkip(): boolean {
    const { skip_if } = this.attributes
    // Use a multi-line regex to match skip_if against the whole content
    return !!(skip_if && this.content.match(new RegExp(skip_if, 'm')))
  }

  /**
   * Prepares the body for injection, handling the 'eof_last' attribute.
   */
  private prepareBody(): string {
    const { eof_last } = this.attributes
    const bodyHasNewline = EOLRegex.test(this.body)

    if (eof_last === false && bodyHasNewline) {
      return this.body.replace(EOLRegex, '')
    }

    if (eof_last === true && !bodyHasNewline) {
      return `${this.body}${this.newlineChar}`
    }

    return this.body
  }

  /**
   * Finds the injection line number based on location attributes.
   */
  private findIndex(): number {
    const { attributes } = this

    if (attributes.at_line) return attributes.at_line
    if (attributes.prepend) return 0
    if (attributes.append) return this.lines.length - 1
    if (attributes.before)
      return this.findPragmaticIndex(attributes.before, true)
    if (attributes.after)
      return this.findPragmaticIndex(attributes.after, false)

    return -1 // No location attribute found
  }

  /**
   * Finds a pattern that may span multiple lines and returns the correct
   * line number for injection.
   * @param pattern - The regex pattern to find.
   * @param isBefore - True to get the line number before the match, false for after.
   */
  private findPragmaticIndex(pattern: string, isBefore: boolean): number {
    // First, try a simple, fast, single-line match
    const oneLineMatchIndex = this.lines.findIndex((line) =>
      line.match(pattern),
    )

    if (oneLineMatchIndex >= 0) {
      return oneLineMatchIndex + (isBefore ? 0 : 1)
    }

    // If not found, perform a more expensive multi-line match
    const fullText = this.lines.join('\n') // Use \n for consistent regex matching
    const fullMatch = fullText.match(new RegExp(pattern, 'm'))

    if (fullMatch?.length && fullMatch.index !== undefined) {
      if (isBefore) {
        const textBeforeMatch = fullText.substring(0, fullMatch.index)
        // Count newlines before the match to find the line number
        return (textBeforeMatch.match(new RegExp(EOLRegex, 'g')) || []).length
      }
      // For 'after', find the end of the match
      const matchEndIndex = fullMatch.index + fullMatch[0].length
      const textUntilMatchEnd = fullText.substring(0, matchEndIndex)
      // Count newlines up to the end of the match
      return (textUntilMatchEnd.match(new RegExp(EOLRegex, 'g')) || []).length
    }

    return -1
  }
}

/**
 * Injects a body of text into a string of content.
 * This is the public API that uses the ContentInjector class internally.
 *
 * @param action - The rendered action with attributes and body.
 * @param content - The source content to be modified.
 * @returns The modified content.
 */
const injectorV2 = (action: RenderedAction, content: string): string => {
  const injectorInstance = new ContentInjector(action, content)
  return injectorInstance.execute()
}

export default injectorV2
