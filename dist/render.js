"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var ejs_1 = __importDefault(require("ejs"));
var front_matter_1 = __importDefault(require("front-matter"));
var ignore_walk_1 = __importDefault(require("ignore-walk"));
var debug_1 = __importDefault(require("debug"));
var context_1 = __importDefault(require("./context"));
var debug = (0, debug_1["default"])('hygen:render');
// for some reason lodash/fp takes 90ms to load.
// inline what we use here with the regular lodash.
var map = function (f) { return function (arr) { return arr.map(f); }; };
var filter = function (f) { return function (arr) { return arr.filter(f); }; };
var ignores = [
    'prompt.js',
    'index.js',
    'prompt.ts',
    'index.ts',
    '.hygenignore',
    '.DS_Store',
    '.Spotlight-V100',
    '.Trashes',
    'ehthumbs.db',
    'Thumbs.db',
];
var renderTemplate = function (tmpl, locals, config) {
    return typeof tmpl === 'string' ? ejs_1["default"].render(tmpl, (0, context_1["default"])(locals, config)) : tmpl;
};
function getFiles(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            files = ignore_walk_1["default"]
                .sync({ path: dir, ignoreFiles: ['.hygenignore'] })
                .map(function (f) { return path_1["default"].join(dir, f); });
            return [2 /*return*/, files];
        });
    });
}
var render = function (args, config) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, getFiles(args.actionfolder)
                .then(function (things) { return things.sort(function (a, b) { return a.localeCompare(b); }); }) // TODO: add a test to verify this sort
                .then(filter(function (f) { return !ignores.find(function (ig) { return f.endsWith(ig); }); })) // TODO: add a
                // test for ignoring prompt.js and index.js
                .then(filter(function (file) {
                return args.subaction
                    ? file.replace(args.actionfolder, '').match(args.subaction)
                    : true;
            }))
                .then(map(function (file) {
                return fs_extra_1["default"].readFile(file).then(function (text) { return ({ file: file, text: text.toString() }); });
            }))
                .then(function (_) { return Promise.all(_); })
                .then(map(function (_a) {
                var file = _a.file, text = _a.text;
                debug('Pre-formatting file: %o', file);
                return __assign({ file: file }, (0, front_matter_1["default"])(text, { allowUnsafe: true }));
            }))
                .then(map(function (_a) {
                var file = _a.file, attributes = _a.attributes, body = _a.body;
                var renderedAttrs = Object.entries(attributes).reduce(function (obj, _a) {
                    var _b;
                    var key = _a[0], value = _a[1];
                    return __assign(__assign({}, obj), (_b = {}, _b[key] = renderTemplate(value, args, config), _b));
                }, {});
                debug('Rendering file: %o', file);
                return {
                    file: file,
                    attributes: renderedAttrs,
                    body: renderTemplate(body, __assign(__assign({}, args), { attributes: renderedAttrs }), config)
                };
            }))];
    });
}); };
exports["default"] = render;
