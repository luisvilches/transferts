"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");

function engine() {
    return function (filePath, options, callback) {
        try {
            let func = _1.parse(filePath);
            let html = func(options);
            callback(null, html);
        }
        catch (e) {
            let stack = (e.fileStack || []).map(([file, line]) => (line > 0) ? `${file}:${line}` : file);
            if (stack.length > 0)
                e.stack = e.message + '\n  ' + stack.join('\n  ');
            callback(e, null);
        }
    };
}
exports.engine = engine;
