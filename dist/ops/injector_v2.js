"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var newline_1 = __importDefault(require("../newline"));
var EOLRegex = /\r?\n/;
var ContentInjector = /** @class */ (function () {
    function ContentInjector(action, content) {
        this.attributes = action.attributes;
        this.body = action.body || '';
        this.content = content;
        this.newlineChar = (0, newline_1["default"])(content);
        this.lines = content.split(this.newlineChar);
    }
    /**
     * Executes the injection process.
     * @returns The modified content string.
     */
    ContentInjector.prototype.execute = function () {
        if (this.shouldSkip()) {
            return this.content;
        }
        var replace = this.attributes.replace;
        if (replace) {
            return this.performReplace();
        }
        var index = this.findIndex();
        if (index === -1) {
            // No location attribute found or pattern not found, return original content
            return this.content;
        }
        var bodyToInsert = this.prepareBody();
        this.lines.splice(index, 0, bodyToInsert);
        return this.lines.join(this.newlineChar);
    };
    /**
     * Performs a find-and-replace operation on the content.
     */
    ContentInjector.prototype.performReplace = function () {
        var replace = this.attributes.replace;
        if (!replace) {
            return this.content;
        }
        var pattern = new RegExp(replace, 'g');
        return this.content.replace(pattern, this.body);
    };
    /**
     * Determines if the injection should be skipped based on the 'skip_if' attribute.
     */
    ContentInjector.prototype.shouldSkip = function () {
        var skip_if = this.attributes.skip_if;
        // Use a multi-line regex to match skip_if against the whole content
        return !!(skip_if && this.content.match(new RegExp(skip_if, 'm')));
    };
    /**
     * Prepares the body for injection, handling the 'eof_last' attribute.
     */
    ContentInjector.prototype.prepareBody = function () {
        var eof_last = this.attributes.eof_last;
        var bodyHasNewline = EOLRegex.test(this.body);
        if (eof_last === false && bodyHasNewline) {
            return this.body.replace(EOLRegex, '');
        }
        if (eof_last === true && !bodyHasNewline) {
            return "".concat(this.body).concat(this.newlineChar);
        }
        return this.body;
    };
    /**
     * Finds the injection line number based on location attributes.
     */
    ContentInjector.prototype.findIndex = function () {
        var attributes = this.attributes;
        if (attributes.at_line)
            return attributes.at_line;
        if (attributes.prepend)
            return 0;
        if (attributes.append)
            return this.lines.length - 1;
        if (attributes.before)
            return this.findPragmaticIndex(attributes.before, true);
        if (attributes.after)
            return this.findPragmaticIndex(attributes.after, false);
        return -1; // No location attribute found
    };
    /**
     * Finds a pattern that may span multiple lines and returns the correct
     * line number for injection.
     * @param pattern - The regex pattern to find.
     * @param isBefore - True to get the line number before the match, false for after.
     */
    ContentInjector.prototype.findPragmaticIndex = function (pattern, isBefore) {
        // First, try a simple, fast, single-line match
        var oneLineMatchIndex = this.lines.findIndex(function (line) {
            return line.match(pattern);
        });
        if (oneLineMatchIndex >= 0) {
            return oneLineMatchIndex + (isBefore ? 0 : 1);
        }
        // If not found, perform a more expensive multi-line match
        var fullText = this.lines.join('\n'); // Use \n for consistent regex matching
        var fullMatch = fullText.match(new RegExp(pattern, 'm'));
        if ((fullMatch === null || fullMatch === void 0 ? void 0 : fullMatch.length) && fullMatch.index !== undefined) {
            if (isBefore) {
                var textBeforeMatch = fullText.substring(0, fullMatch.index);
                // Count newlines before the match to find the line number
                return (textBeforeMatch.match(new RegExp(EOLRegex, 'g')) || []).length;
            }
            // For 'after', find the end of the match
            var matchEndIndex = fullMatch.index + fullMatch[0].length;
            var textUntilMatchEnd = fullText.substring(0, matchEndIndex);
            // Count newlines up to the end of the match
            return (textUntilMatchEnd.match(new RegExp(EOLRegex, 'g')) || []).length;
        }
        return -1;
    };
    return ContentInjector;
}());
/**
 * Injects a body of text into a string of content.
 * This is the public API that uses the ContentInjector class internally.
 *
 * @param action - The rendered action with attributes and body.
 * @param content - The source content to be modified.
 * @returns The modified content.
 */
var injectorV2 = function (action, content) {
    var injectorInstance = new ContentInjector(action, content);
    return injectorInstance.execute();
};
exports["default"] = injectorV2;
