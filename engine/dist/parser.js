"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5 = require("md5-file");
const fs = require("fs");
const path = require("path");
const parse5 = require("parse5");
const s_func_1 = require("./s-func");
const createTemplateFunction = require('./../js-utils/utils');
let cache = {};
const NODE_DOCUMENT = 'directive';
const NODE_TEXT = 'text';
const NODE_ROOT = 'root';
const NODE_COMMENT = 'comment';
const AUTO_CLOSE_TAGS = [
    'area', 'base', 'br', 'col', 'command', 'embed', 'img', 'hr', 'keygen',
    'link', 'meta', 'param', 'source', 'track', 'input', 'wbr'
];

// const HI_ATTRS = ['s-if', 's-else', 's-for', 's-show', 's-hide'];
const HI_ATTRS = ['if', 'else', 'each', 'show', 'hide'];

function sRequire(filepath, linkpath, data) {
    let destFullPath = path.join(path.dirname(filepath), linkpath);
    return parse(destFullPath)(data);
}

function template2js(html) {

    function getLine(location, attrName) {
        if (!location)
            return 0;
        if (location.startTag)
            location = location.startTag;
        if (attrName && location.attrs && location.attrs[attrName])
            location = location.attrs[attrName];
        return location ? location.line : 0;
    }

    function lineHtml(line) {
        return '${(()=>{$$_error_line = ' + line + '; return "";})()}';
    }

    function replaceValuePut(str, line) {
        return str.replace(/\{\{([\s\S]+?)\}\}/g, (substr, matchstr, pos) => {
            for (let i = 0; line > 0 && i < Math.min(str.length, pos); i++)
                if (str[i] == '\n')
                    line++;
            return lineHtml(line) + '${' + matchstr + '}';
        });
    }

    function parseAttr(attrs, node) {
        let sysAttrs = {};
        let attrString = '';
        if (attrs)
            attrString = Object.keys(attrs).map(key => {
                let value = attrs[key];
                let result = '';
                if (HI_ATTRS.indexOf(key) >= 0)
                    sysAttrs[key] = value;
                else
                    result = `${key}="${replaceValuePut(value, getLine(node.__location, key))}"`;
                return result;
            }).filter(s => !!s).join(' ');

        return {
            tags: sysAttrs,
            string: attrString
        };
    }

    function funcHtml(html) {
        return '(()=>{let ifResult={}; return `' + html + '`})()';
    }

    function parseFor(forVal) {

        let varName = '';
        let dataName = '';
        let _; 
        if (/^\s*\(\s*\S+\s*,\s*\S+\s*\)/.test(forVal)) {
            [_, varName, dataName] = forVal.match(/^\s*(\(\s*\S+\s*,\s*\S+\s*\))\s+in\s+([\s\S]+)$/) || [];
        }
        else {
            [_, varName, dataName] = forVal.match(/^\s*(\S+)\s+in\s+([\s\S]+)$/) || [];
        }

        return {
            varName,
            dataName,
        };
    }

    function parseNode(node, depth = 0) {
        let nodeName = node.name || '';
        let result = '';

        if (node.type == NODE_DOCUMENT)
            result = '<' + node.data + '>\n';
        else if (node.type == NODE_COMMENT)
            result = '<!--' + node.data + '-->';
        else if (node.type == NODE_TEXT)
            result = replaceValuePut(node.data, getLine(node.__location));
        else if (nodeName == 'require')
            result = '${$$_s_require($$_filepath, "' + node.attribs.path + '", $$_options)}';
        else {

            let { string: attrString, tags } = parseAttr(node.attribs, node);

            if (AUTO_CLOSE_TAGS.indexOf(nodeName) >= 0 && node.children.length <= 0) {
                result = `<${nodeName}${attrString ? ' ' : ''}${attrString}>`;
            }
            else {
                result = node.children.map((node) => parseNode(node, depth + 1)).join('');
                if (node.type != NODE_ROOT)
                    result = `<${nodeName}${attrString ? ' ' : ''}${attrString}>${result}</${nodeName}>`;
            }

            if (Object.keys(tags).length > 0) {

                if (tags['if'] !== undefined) {
                    result = '${$$_s.if(' + (tags['if'] || 'true') + ', ifResult, ' + funcHtml(result) + ')}';
                }
                else if (tags['else'] !== undefined) {
                    result = '${$$_s.else(' + (tags['else'] || 'true') + ', ifResult, ' + funcHtml(result) + ')}';
                }
                else if (tags['show'] !== undefined) {
                    result = '${$$_s.show(' + (tags['show'] || 'null') + ', ' + funcHtml(result) + ')}';
                }
                else if (tags['hide'] !== undefined) {
                    result = '${$$_s.hide(' + (tags['hide'] || 'null') + ', ' + funcHtml(result) + ')}';
                }

                if (tags['each'] !== undefined) {
                    let { varName, dataName } = parseFor(tags['each']);
                    if (!varName || !dataName){

                    } else {
                        result = '${$$_s.forIn(' + dataName + ', ' + varName + ' => ' + funcHtml(result) + ' ).join("")}';
                    }
                }
            }

        }

        return lineHtml(getLine(node.__location)) + result;
    }

    html = html.replace(/<require ([\s\S]+?)\/>/g, '<require $1></require>');

    let document = parse5[(/^\s*<!DOCTYPE/.test(html)) ? 'parse' : 'parseFragment'](html, {
        treeAdapter: parse5.treeAdapters.htmlparser2,
        locationInfo: true
    });
    let parseResult = parseNode(document);

    return funcHtml(parseResult);
}

function parse(template) {
    let md5str = md5.sync(template);

    if (cache[template] && cache[template].md5 == md5str)
        return cache[template].func;

    let html = fs.readFileSync(template) + '';

    let code = template2js(html);

    let func = createTemplateFunction(sRequire, template, s_func_1.s, code);

    cache[template] = { md5: md5str, func };

    return func;
}
exports.parse = parse;
