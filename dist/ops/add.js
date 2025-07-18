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
var chalk_1 = require("chalk");
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var result_1 = __importDefault(require("./result"));
var add = function (action, args, _a) {
    var logger = _a.logger, cwd = _a.cwd, createPrompter = _a.createPrompter;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, to, inject, unless_exists, force, from, skip_if, result, prompter, absTo, shouldNotOverwrite, fileExists, shouldSkip, from_path, file, pathToLog;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = action.attributes, to = _b.to, inject = _b.inject, unless_exists = _b.unless_exists, force = _b.force, from = _b.from, skip_if = _b.skip_if;
                    result = (0, result_1["default"])('add', to);
                    prompter = createPrompter();
                    if (!to || inject) {
                        return [2 /*return*/, result('ignored')];
                    }
                    absTo = path_1["default"].resolve(cwd, to);
                    shouldNotOverwrite = !force && unless_exists !== undefined && unless_exists === true;
                    return [4 /*yield*/, fs_extra_1["default"].exists(absTo)];
                case 1:
                    fileExists = _c.sent();
                    if (shouldNotOverwrite && fileExists) {
                        logger.warn("     skipped: ".concat(to));
                        return [2 /*return*/, result('skipped')];
                    }
                    if (!(!process.env.HYGEN_OVERWRITE && fileExists && !force)) return [3 /*break*/, 3];
                    return [4 /*yield*/, prompter
                            .prompt({
                            prefix: '',
                            type: 'confirm',
                            name: 'overwrite',
                            message: (0, chalk_1.red)("     exists: ".concat(to, ". Overwrite? (y/N): "))
                        })
                            .then(function (_a) {
                            var overwrite = _a.overwrite;
                            return overwrite;
                        })];
                case 2:
                    if (!(_c.sent())) {
                        logger.warn("     skipped: ".concat(to));
                        return [2 /*return*/, result('skipped')];
                    }
                    _c.label = 3;
                case 3:
                    shouldSkip = skip_if === 'true';
                    if (shouldSkip) {
                        return [2 /*return*/, result('skipped')];
                    }
                    if (from) {
                        from_path = path_1["default"].join(args.templates, from);
                        file = fs_extra_1["default"].readFileSync(from_path).toString();
                        action.body = file;
                    }
                    if (!!args.dry) return [3 /*break*/, 6];
                    return [4 /*yield*/, fs_extra_1["default"].ensureDir(path_1["default"].dirname(absTo))];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, fs_extra_1["default"].writeFile(absTo, action.body)];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6:
                    pathToLog = process.env.HYGEN_OUTPUT_ABS_PATH ? absTo : to;
                    logger.ok("       ".concat(force ? 'FORCED' : 'added', ": ").concat(pathToLog));
                    return [2 /*return*/, result('added')];
            }
        });
    });
};
exports["default"] = add;
