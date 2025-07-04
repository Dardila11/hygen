"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.ShowHelpError = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var params_1 = __importDefault(require("./params"));
var ShowHelpError = /** @class */ (function (_super) {
    __extends(ShowHelpError, _super);
    function ShowHelpError(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, ShowHelpError.prototype);
        return _this;
    }
    return ShowHelpError;
}(Error));
exports.ShowHelpError = ShowHelpError;
var engine = function (argv, config) { return __awaiter(void 0, void 0, void 0, function () {
    var cwd, templates, logger, args, _a, _b, generator, action, actionfolder, execute, render, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                cwd = config.cwd, templates = config.templates, logger = config.logger;
                _b = (_a = Object).assign;
                return [4 /*yield*/, (0, params_1["default"])(config, argv)];
            case 1:
                args = _b.apply(_a, [_d.sent(), { cwd: cwd }]);
                generator = args.generator, action = args.action, actionfolder = args.actionfolder;
                if (['-h', '--help'].includes(argv[0])) {
                    logger.log("\nUsage:\n  hygen [option] GENERATOR ACTION [--name NAME] [data-options]\n\nOptions:\n  -h, --help # Show this message and quit\n  --dry      # Perform a dry run.  Files will be generated but not saved.");
                    process.exit(0);
                }
                logger.log(args.dry ? '(dry mode)' : '');
                if (!generator) {
                    throw new ShowHelpError('please specify a generator.');
                }
                if (!action) {
                    throw new ShowHelpError("please specify an action for ".concat(generator, "."));
                }
                logger.log("Loaded templates: ".concat(templates.replace("".concat(cwd, "/"), '')));
                return [4 /*yield*/, fs_extra_1["default"].exists(actionfolder)];
            case 2:
                if (!(_d.sent())) {
                    throw new ShowHelpError("I can't find action '".concat(action, "' for generator '").concat(generator, "'.\n\n      You can try:\n      1. 'hygen init self' to initialize your project, and\n      2. 'hygen generator new --name ").concat(generator, "' to build the generator you wanted.\n\n      Check out the quickstart for more: https://hygen.io/docs/quick-start\n      "));
                }
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('./execute')); })];
            case 3:
                execute = (_d.sent())["default"];
                return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('./render')); })];
            case 4:
                render = (_d.sent())["default"];
                _c = execute;
                return [4 /*yield*/, render(args, config)];
            case 5: return [2 /*return*/, _c.apply(void 0, [_d.sent(), args, config])];
        }
    });
}); };
exports["default"] = engine;
