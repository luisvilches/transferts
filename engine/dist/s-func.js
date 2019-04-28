"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.s = {
    if: function (exp, obj, html) {

        if (exp) {
            obj.e_if = true;
            return html;
        }
        else {
            obj.e_if = false;
            return '';
        }
    },
    else: function (exp, obj, html) {

        if (obj.e_if)
            return '';

        return exports.s.if(exp, obj, html);
    },
    forIn: function (obj, cb) {
        let buffer = [];
        if (typeof obj == 'undefined' || typeof obj == 'boolean')
            return [];
        else if (typeof obj === 'string') {
            for (let i = 0; i < obj.length; i++)
                buffer.push(cb(obj[i], i));
        }
        else if (typeof obj == 'number') {
            if (obj > 0)
                for (let i = 0; i < obj; i++)
                    buffer.push(cb(i, i));
            else
                for (let i = 0; i > obj; i--)
                    buffer.push(cb(i, i));
        }
        else if (obj instanceof Array) {
            buffer = obj.map((item, N) => cb(item, N));
        }
        else {
            buffer = Object.keys(obj).map(key => cb(obj[key], key));
        }
        return buffer;
    },
    show: function (exp, html) {
        return exports.s.if(exp, {}, html);
    },
    hide: function (exp, html) {
        return exports.s.if(!exp, {}, html);
    },
    mkrange: function (from, to) {

        if (to === undefined) {
            to = from;
            from = 0;
        }

        from = parseInt(from);
        to = parseInt(to);
        if (isNaN(from) || isNaN(to) || from == to)
            return [];

        let calc = (num) => (from < to) ? (num + 1) : (num - 1);
        let buffer = [];
        for (let i = from; i != to; i = calc(i)) {
            buffer.push(i);
        }
        return buffer;
    },
    val: function (val) {
        return val;
    },
};
