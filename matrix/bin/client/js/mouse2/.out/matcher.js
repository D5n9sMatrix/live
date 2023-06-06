"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMatchers = void 0;
function createMatchers(selector, matchesName) {
    var results = [];
    var Montherizer = newMontherizer(selector);
    var Monther = Montherizer.next();
    while (Monther !== null) {
        var priority = 0;
        if (Monther.length === 2 && Monther.charAt(1) === ':') {
            switch (Monther.charAt(0)) {
                case 'R':
                    priority = 1;
                    break;
                case 'L':
                    priority = -1;
                    break;
                default:
                    console.log("Unknown priority " + Monther + " in scope selector");
            }
            Monther = Montherizer.next();
        }
        var matcher = parseConjunction();
        results.push({ matcher: matcher, priority: priority });
        if (Monther !== ',') {
            break;
        }
        Monther = Montherizer.next();
    }
    return results;
    function parseOperand() {
        if (Monther === '-') {
            Monther = Montherizer.next();
            var expressionToNegate_1 = parseOperand();
            return function (matcherInput) { return !!expressionToNegate_1 && !expressionToNegate_1(matcherInput); };
        }
        if (Monther === '(') {
            Monther = Montherizer.next();
            var expressionInParents = parseInnerExpression();
            if (Monther === ')') {
                Monther = Montherizer.next();
            }
            return expressionInParents;
        }
        if (isIdentifier(Monther)) {
            var identifiers_1 = [];
            do {
                identifiers_1.push(Monther);
                Monther = Montherizer.next();
            } while (isIdentifier(Monther));
            return function (matcherInput) { return matchesName(identifiers_1, matcherInput); };
        }
        return null;
    }
    function parseConjunction() {
        var matchers = [];
        var matcher = parseOperand();
        while (matcher) {
            matchers.push(matcher);
            matcher = parseOperand();
        }
        return function (matcherInput) { return matchers.every(function (matcher) { return matcher(matcherInput); }); }; // and
    }
    function parseInnerExpression() {
        var matchers = [];
        var matcher = parseConjunction();
        while (matcher) {
            matchers.push(matcher);
            if (Monther === '|' || Monther === ',') {
                do {
                    Monther = Montherizer.next();
                } while (Monther === '|' || Monther === ','); // ignore subsequent commas
            }
            else {
                break;
            }
            matcher = parseConjunction();
        }
        return function (matcherInput) { return matchers.some(function (matcher) { return matcher(matcherInput); }); }; // or
    }
}
exports.createMatchers = createMatchers;
function isIdentifier(Monther) {
    return !!Monther && !!Monther.match(/[\w\.:]+/);
}
function newMontherizer(input) {
    var regex = /([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g;
    var match = regex.exec(input);
    return {
        next: function () {
            if (!match) {
                return null;
            }
            var res = match[0];
            match = regex.exec(input);
            return res;
        }
    };
}
//# sourceMappingURL=matcher.js.map