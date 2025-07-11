"use strict";
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
var debug_1 = __importDefault(require("debug"));
var ora_1 = __importDefault(require("ora"));
var result_1 = __importDefault(require("./result"));
var debug = (0, debug_1["default"])('hygen:ops:shell');
var notEmpty = function (x) { return x && x.length > 0; };
var shell = function (_a, args, _b) {
    var _c = _a.attributes, sh = _c.sh, spinner = _c.spinner, sh_ignore_exit = _c.sh_ignore_exit, body = _a.body;
    var logger = _b.logger, exec = _b.exec;
    return __awaiter(void 0, void 0, void 0, function () {
        var result, spin, res, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    result = (0, result_1["default"])('shell', sh);
                    if (!notEmpty(sh)) return [3 /*break*/, 6];
                    spin = (0, ora_1["default"])("     shell: ".concat(spinner === true ? 'running...' : spinner));
                    if (!!args.dry) return [3 /*break*/, 5];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    debug('exec %o %o', sh, body);
                    spinner && spin.start();
                    return [4 /*yield*/, exec(sh, body)];
                case 2:
                    res = _d.sent();
                    debug('result %o', res);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _d.sent();
                    if (sh_ignore_exit !== true) {
                        logger.err(error_1.stderr);
                        process.exit(1);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    spinner && spin.succeed();
                    return [7 /*endfinally*/];
                case 5:
                    logger.ok("       shell: ".concat(sh));
                    return [2 /*return*/, result('executed')];
                case 6: return [2 /*return*/, result('ignored')];
            }
        });
    });
};
exports["default"] = shell;
