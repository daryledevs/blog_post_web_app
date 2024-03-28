"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_tsconfig_paths_1 = __importDefault(require("vite-tsconfig-paths"));
const defineConfig = import("vitest/config").then((mod) => mod.defineConfig);
exports.default = (await defineConfig)({
    test: {
        globals: true,
    },
    plugins: [(0, vite_tsconfig_paths_1.default)()],
});
