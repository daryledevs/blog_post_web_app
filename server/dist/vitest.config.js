"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_tsconfig_paths_1 = __importDefault(require("vite-tsconfig-paths"));
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
    },
    plugins: [(0, vite_tsconfig_paths_1.default)()],
});
