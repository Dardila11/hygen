import type { RenderedAction } from '../types';
/**
 * Injects a body of text into a string of content.
 * This is the public API that uses the ContentInjector class internally.
 *
 * @param action - The rendered action with attributes and body.
 * @param content - The source content to be modified.
 * @returns The modified content.
 */
declare const injectorV2: (action: RenderedAction, content: string) => string;
export default injectorV2;
