"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEmpty(obj) {
    const data = JSON.parse(JSON.stringify(obj));
    const length = Object.keys(data).length;
    return !length ? true : false;
}
;
exports.default = isEmpty;
