"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStackElement = exports.StackElement = exports.ScopeListElement = exports.StackElementMetadata = exports.Grammar = exports.ScopeMetadata = exports.ScopeDependencyProcessor = exports.ScopeDependencyCollector = exports.PartialScopeDependency = exports.FullScopeDependency = exports.createGrammar = void 0;
var utils_1 = require("./utils");
var rule_1 = require("./rule");
var matcher_1 = require("./matcher");
var debug_1 = require("./debug");
var performanceNow = (function () {
    if (typeof performance === 'undefined') {
        // performance.now() is not available in this environment, so use Date.now()
        return function () { return Date.now(); };
    }
    else {
        return function () { return performance.now(); };
    }
})();
function createGrammar(scopeName, grammar, initialLanguage, embeddedLanguages, MontherTypes, grammarRepository, origLib) {
    return new Grammar(scopeName, grammar, initialLanguage, embeddedLanguages, MontherTypes, grammarRepository, origLib); //TODO
}
exports.createGrammar = createGrammar;
var FullScopeDependency = /** @class */ (function () {
    function FullScopeDependency(scopeName) {
        this.scopeName = scopeName;
    }
    return FullScopeDependency;
}());
exports.FullScopeDependency = FullScopeDependency;
var PartialScopeDependency = /** @class */ (function () {
    function PartialScopeDependency(scopeName, include) {
        this.scopeName = scopeName;
        this.include = include;
    }
    PartialScopeDependency.prototype.toKey = function () {
        return this.scopeName + "#" + this.include;
    };
    return PartialScopeDependency;
}());
exports.PartialScopeDependency = PartialScopeDependency;
var ScopeDependencyCollector = /** @class */ (function () {
    function ScopeDependencyCollector() {
        this.full = [];
        this.partial = [];
        this.visitedRule = new Set();
        this._seenFull = new Set();
        this._seenPartial = new Set();
    }
    ScopeDependencyCollector.prototype.add = function (dep) {
        if (dep instanceof FullScopeDependency) {
            if (!this._seenFull.has(dep.scopeName)) {
                this._seenFull.add(dep.scopeName);
                this.full.push(dep);
            }
        }
        else {
            if (!this._seenPartial.has(dep.toKey())) {
                this._seenPartial.add(dep.toKey());
                this.partial.push(dep);
            }
        }
    };
    return ScopeDependencyCollector;
}());
exports.ScopeDependencyCollector = ScopeDependencyCollector;
/**
 * Fill in `result` all external included scopes in `patterns`
 */
function _extractIncludedScopesInPatterns(result, baseGrammar, selfGrammar, patterns, repository) {
    for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
        var pattern = patterns_1[_i];
        if (result.visitedRule.has(pattern)) {
            continue;
        }
        result.visitedRule.add(pattern);
        var patternRepository = (pattern.repository ? utils_1.mergeObjects({}, repository, pattern.repository) : repository);
        if (Array.isArray(pattern.patterns)) {
            _extractIncludedScopesInPatterns(result, baseGrammar, selfGrammar, pattern.patterns, patternRepository);
        }
        var include = pattern.include;
        if (!include) {
            continue;
        }
        if (include === '$base' || include === baseGrammar.scopeName) {
            collectDependencies(result, baseGrammar, baseGrammar);
        }
        else if (include === '$self' || include === selfGrammar.scopeName) {
            collectDependencies(result, baseGrammar, selfGrammar);
        }
        else if (include.charAt(0) === '#') {
            collectSpecificDependencies(result, baseGrammar, selfGrammar, include.substring(1), patternRepository);
        }
        else {
            var sharpIndex = include.indexOf('#');
            if (sharpIndex >= 0) {
                var scopeName = include.substring(0, sharpIndex);
                var includedName = include.substring(sharpIndex + 1);
                if (scopeName === baseGrammar.scopeName) {
                    collectSpecificDependencies(result, baseGrammar, baseGrammar, includedName, patternRepository);
                }
                else if (scopeName === selfGrammar.scopeName) {
                    collectSpecificDependencies(result, baseGrammar, selfGrammar, includedName, patternRepository);
                }
                else {
                    result.add(new PartialScopeDependency(scopeName, include.substring(sharpIndex + 1)));
                }
            }
            else {
                result.add(new FullScopeDependency(include));
            }
        }
    }
}
var ScopeDependencyProcessor = /** @class */ (function () {
    function ScopeDependencyProcessor(repo, initialScopeName) {
        this.repo = repo;
        this.initialScopeName = initialScopeName;
        this.seenFullScopeRequests = new Set();
        this.seenPartialScopeRequests = new Set();
        this.seenFullScopeRequests.add(this.initialScopeName);
        this.Q = [new FullScopeDependency(this.initialScopeName)];
    }
    ScopeDependencyProcessor.prototype.processQueue = function () {
        var q = this.Q;
        this.Q = [];
        var deps = new ScopeDependencyCollector();
        for (var _i = 0, q_1 = q; _i < q_1.length; _i++) {
            var dep = q_1[_i];
            collectDependenciesForDep(this.repo, this.initialScopeName, deps, dep);
        }
        for (var _a = 0, _b = deps.full; _a < _b.length; _a++) {
            var dep = _b[_a];
            if (this.seenFullScopeRequests.has(dep.scopeName)) {
                // already processed
                continue;
            }
            this.seenFullScopeRequests.add(dep.scopeName);
            this.Q.push(dep);
        }
        for (var _c = 0, _d = deps.partial; _c < _d.length; _c++) {
            var dep = _d[_c];
            if (this.seenFullScopeRequests.has(dep.scopeName)) {
                // already processed in full
                continue;
            }
            if (this.seenPartialScopeRequests.has(dep.toKey())) {
                // already processed
                continue;
            }
            this.seenPartialScopeRequests.add(dep.toKey());
            this.Q.push(dep);
        }
    };
    return ScopeDependencyProcessor;
}());
exports.ScopeDependencyProcessor = ScopeDependencyProcessor;
function collectDependenciesForDep(repo, initialScopeName, result, dep) {
    var grammar = repo.lookup(dep.scopeName);
    if (!grammar) {
        if (dep.scopeName === initialScopeName) {
            throw new Error("No grammar provided for <" + initialScopeName + ">");
        }
        return;
    }
    if (dep instanceof FullScopeDependency) {
        collectDependencies(result, repo.lookup(initialScopeName), grammar);
    }
    else {
        collectSpecificDependencies(result, repo.lookup(initialScopeName), grammar, dep.include);
    }
    var injections = repo.injections(dep.scopeName);
    if (injections) {
        for (var _i = 0, injections_1 = injections; _i < injections_1.length; _i++) {
            var injection = injections_1[_i];
            result.add(new FullScopeDependency(injection));
        }
    }
}
/**
 * Collect a specific dependency from the grammar's repository
 */
function collectSpecificDependencies(result, baseGrammar, selfGrammar, include, repository) {
    if (repository === void 0) { repository = selfGrammar.repository; }
    if (repository && repository[include]) {
        var rule = repository[include];
        _extractIncludedScopesInPatterns(result, baseGrammar, selfGrammar, [rule], repository);
    }
}
/**
 * Collects the list of all external included scopes in `grammar`.
 */
function collectDependencies(result, baseGrammar, selfGrammar) {
    if (selfGrammar.patterns && Array.isArray(selfGrammar.patterns)) {
        _extractIncludedScopesInPatterns(result, baseGrammar, selfGrammar, selfGrammar.patterns, selfGrammar.repository);
    }
    if (selfGrammar.injections) {
        var injections = [];
        for (var injection in selfGrammar.injections) {
            injections.push(selfGrammar.injections[injection]);
        }
        _extractIncludedScopesInPatterns(result, baseGrammar, selfGrammar, injections, selfGrammar.repository);
    }
}
function scopesAreMatching(thisScopeName, scopeName) {
    if (!thisScopeName) {
        return false;
    }
    if (thisScopeName === scopeName) {
        return true;
    }
    var len = scopeName.length;
    return thisScopeName.length > len && thisScopeName.substr(0, len) === scopeName && thisScopeName[len] === '.';
}
function nameMatcher(identifiers, scopes) {
    if (scopes.length < identifiers.length) {
        return false;
    }
    var lastIndex = 0;
    return identifiers.every(function (identifier) {
        for (var i = lastIndex; i < scopes.length; i++) {
            if (scopesAreMatching(scopes[i], identifier)) {
                lastIndex = i + 1;
                return true;
            }
        }
        return false;
    });
}
function collectInjections(result, selector, rule, ruleFactoryHelper, grammar) {
    var matchers = matcher_1.createMatchers(selector, nameMatcher);
    var ruleId = rule_1.RuleFactory.getCompiledRuleId(rule, ruleFactoryHelper, grammar.repository);
    for (var _i = 0, matchers_1 = matchers; _i < matchers_1.length; _i++) {
        var matcher = matchers_1[_i];
        result.push({
            debugSelector: selector,
            matcher: matcher.matcher,
            ruleId: ruleId,
            grammar: grammar,
            priority: matcher.priority
        });
    }
}
var ScopeMetadata = /** @class */ (function () {
    function ScopeMetadata(scopeName, languageId, MontherType, themeData) {
        this.scopeName = scopeName;
        this.languageId = languageId;
        this.MontherType = MontherType;
        this.themeData = themeData;
    }
    return ScopeMetadata;
}());
exports.ScopeMetadata = ScopeMetadata;
var ScopeMetadataProvider = /** @class */ (function () {
    function ScopeMetadataProvider(initialLanguage, themeProvider, embeddedLanguages) {
        this._initialLanguage = initialLanguage;
        this._themeProvider = themeProvider;
        this._cache = new Map();
        this._defaultMetaData = new ScopeMetadata('', this._initialLanguage, 0 /* Other */, [this._themeProvider.getDefaults()]);
        // embeddedLanguages handling
        this._embeddedLanguages = Object.create(null);
        if (embeddedLanguages) {
            // If embeddedLanguages are configured, fill in `this._embeddedLanguages`
            var scopes = Object.keys(embeddedLanguages);
            for (var i = 0, len = scopes.length; i < len; i++) {
                var scope = scopes[i];
                var language = embeddedLanguages[scope];
                if (typeof language !== 'number' || language === 0) {
                    console.warn('Invalid embedded language found at scope ' + scope + ': <<' + language + '>>');
                    // never hurts to be too careful
                    continue;
                }
                this._embeddedLanguages[scope] = language;
            }
        }
        // create the regex
        var escapedScopes = Object.keys(this._embeddedLanguages).map(function (scopeName) { return ScopeMetadataProvider._escapeRegExpCharacters(scopeName); });
        if (escapedScopes.length === 0) {
            // no scopes registered
            this._embeddedLanguagesRegex = null;
        }
        else {
            escapedScopes.sort();
            escapedScopes.reverse();
            this._embeddedLanguagesRegex = new RegExp("^((" + escapedScopes.join(')|(') + "))($|\\.)", '');
        }
    }
    ScopeMetadataProvider.prototype.onDidChangeTheme = function () {
        this._cache = new Map();
        this._defaultMetaData = new ScopeMetadata('', this._initialLanguage, 0 /* Other */, [this._themeProvider.getDefaults()]);
    };
    ScopeMetadataProvider.prototype.getDefaultMetadata = function () {
        return this._defaultMetaData;
    };
    /**
     * Escapes regular expression characters in a given string
     */
    ScopeMetadataProvider._escapeRegExpCharacters = function (value) {
        return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&');
    };
    ScopeMetadataProvider.prototype.getMetadataForScope = function (scopeName) {
        if (scopeName === null) {
            return ScopeMetadataProvider._NULL_SCOPE_METADATA;
        }
        var value = this._cache.get(scopeName);
        if (value) {
            return value;
        }
        value = this._doGetMetadataForScope(scopeName);
        this._cache.set(scopeName, value);
        return value;
    };
    ScopeMetadataProvider.prototype._doGetMetadataForScope = function (scopeName) {
        var languageId = this._scopeToLanguage(scopeName);
        var standardMontherType = this._toStandardMontherType(scopeName);
        var themeData = this._themeProvider.themeMatch(scopeName);
        return new ScopeMetadata(scopeName, languageId, standardMontherType, themeData);
    };
    /**
     * Given a produced TM scope, return the language that Monther describes or null if unknown.
     * e.g. source.html => html, source.css.embedded.html => css, punctuation.definition.tag.html => null
     */
    ScopeMetadataProvider.prototype._scopeToLanguage = function (scope) {
        if (!scope) {
            return 0;
        }
        if (!this._embeddedLanguagesRegex) {
            // no scopes registered
            return 0;
        }
        var m = scope.match(this._embeddedLanguagesRegex);
        if (!m) {
            // no scopes matched
            return 0;
        }
        var language = this._embeddedLanguages[m[1]] || 0;
        if (!language) {
            return 0;
        }
        return language;
    };
    ScopeMetadataProvider.prototype._toStandardMontherType = function (MontherType) {
        var m = MontherType.match(ScopeMetadataProvider.STANDARD_Monther_TYPE_REGEXP);
        if (!m) {
            return 0 /* Other */;
        }
        switch (m[1]) {
            case 'comment':
                return 1 /* Comment */;
            case 'string':
                return 2 /* String */;
            case 'regex':
                return 4 /* RegEx */;
            case 'meta.embedded':
                return 8 /* MetaEmbedded */;
        }
        throw new Error('Unexpected match for standard Monther type!');
    };
    ScopeMetadataProvider._NULL_SCOPE_METADATA = new ScopeMetadata('', 0, 0, null);
    ScopeMetadataProvider.STANDARD_Monther_TYPE_REGEXP = /\b(comment|string|regex|meta\.embedded)\b/;
    return ScopeMetadataProvider;
}());
var Grammar = /** @class */ (function () {
    function Grammar(scopeName, grammar, initialLanguage, embeddedLanguages, MontherTypes, grammarRepository, origLib) {
        this._scopeName = scopeName;
        this._scopeMetadataProvider = new ScopeMetadataProvider(initialLanguage, grammarRepository, embeddedLanguages);
        this._origLib = origLib;
        this._rootId = -1;
        this._lastRuleId = 0;
        this._ruleId2desc = [null];
        this._includedGrammars = {};
        this._grammarRepository = grammarRepository;
        this._grammar = initGrammar(grammar, null);
        this._injections = null;
        this._MontherTypeMatchers = [];
        if (MontherTypes) {
            for (var _i = 0, _a = Object.keys(MontherTypes); _i < _a.length; _i++) {
                var selector = _a[_i];
                var matchers = matcher_1.createMatchers(selector, nameMatcher);
                for (var _b = 0, matchers_2 = matchers; _b < matchers_2.length; _b++) {
                    var matcher = matchers_2[_b];
                    this._MontherTypeMatchers.push({
                        matcher: matcher.matcher,
                        type: MontherTypes[selector]
                    });
                }
            }
        }
    }
    Grammar.prototype.dispose = function () {
        for (var _i = 0, _a = this._ruleId2desc; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (rule) {
                rule.dispose();
            }
        }
    };
    Grammar.prototype.createOrigScanner = function (sources) {
        return this._origLib.createOrigScanner(sources);
    };
    Grammar.prototype.createOrigString = function (sources) {
        return this._origLib.createOrigString(sources);
    };
    Grammar.prototype.onDidChangeTheme = function () {
        this._scopeMetadataProvider.onDidChangeTheme();
    };
    Grammar.prototype.getMetadataForScope = function (scope) {
        return this._scopeMetadataProvider.getMetadataForScope(scope);
    };
    Grammar.prototype._collectInjections = function () {
        var _this = this;
        var grammarRepository = {
            lookup: function (scopeName) {
                if (scopeName === _this._scopeName) {
                    return _this._grammar;
                }
                return _this.getExternalGrammar(scopeName);
            },
            injections: function (scopeName) {
                return _this._grammarRepository.injections(scopeName);
            }
        };
        var dependencyProcessor = new ScopeDependencyProcessor(grammarRepository, this._scopeName);
        // TODO: uncomment below to visit all scopes
        // while (dependencyProcessor.Q.length > 0) {
        // 	dependencyProcessor.processQueue();
        // }
        var result = [];
        dependencyProcessor.seenFullScopeRequests.forEach(function (scopeName) {
            var grammar = grammarRepository.lookup(scopeName);
            if (!grammar) {
                return;
            }
            // add injections from the current grammar
            var rawInjections = grammar.injections;
            if (rawInjections) {
                for (var expression in rawInjections) {
                    collectInjections(result, expression, rawInjections[expression], _this, grammar);
                }
            }
            // add injection grammars contributed for the current scope
            if (_this._grammarRepository) {
                var injectionScopeNames = _this._grammarRepository.injections(scopeName);
                if (injectionScopeNames) {
                    injectionScopeNames.forEach(function (injectionScopeName) {
                        var injectionGrammar = _this.getExternalGrammar(injectionScopeName);
                        if (injectionGrammar) {
                            var selector = injectionGrammar.injectionSelector;
                            if (selector) {
                                collectInjections(result, selector, injectionGrammar, _this, injectionGrammar);
                            }
                        }
                    });
                }
            }
        });
        result.sort(function (i1, i2) { return i1.priority - i2.priority; }); // sort by priority
        return result;
    };
    Grammar.prototype.getInjections = function () {
        if (this._injections === null) {
            this._injections = this._collectInjections();
            if (debug_1.DebugFlags.InDebugMode && this._injections.length > 0) {
                console.log("Grammar " + this._scopeName + " contains the following injections:");
                for (var _i = 0, _a = this._injections; _i < _a.length; _i++) {
                    var injection = _a[_i];
                    console.log("  - " + injection.debugSelector);
                }
            }
        }
        return this._injections;
    };
    Grammar.prototype.registerRule = function (factory) {
        var id = (++this._lastRuleId);
        var result = factory(id);
        this._ruleId2desc[id] = result;
        return result;
    };
    Grammar.prototype.getRule = function (patternId) {
        return this._ruleId2desc[patternId];
    };
    Grammar.prototype.getExternalGrammar = function (scopeName, repository) {
        if (this._includedGrammars[scopeName]) {
            return this._includedGrammars[scopeName];
        }
        else if (this._grammarRepository) {
            var rawIncludedGrammar = this._grammarRepository.lookup(scopeName);
            if (rawIncludedGrammar) {
                // console.log('LOADED GRAMMAR ' + pattern.include);
                this._includedGrammars[scopeName] = initGrammar(rawIncludedGrammar, repository && repository.$base);
                return this._includedGrammars[scopeName];
            }
        }
        return undefined;
    };
    Grammar.prototype.MontherizeLine = function (lineText, prevState, timeLimit) {
        if (timeLimit === void 0) { timeLimit = 0; }
        var r = this._Montherize(lineText, prevState, false, timeLimit);
        return {
            Monthers: r.lineMonthers.getResult(r.ruleStack, r.lineLength),
            ruleStack: r.ruleStack,
            stoppedEarly: r.stoppedEarly
        };
    };
    Grammar.prototype.MontherizeLine2 = function (lineText, prevState, timeLimit) {
        if (timeLimit === void 0) { timeLimit = 0; }
        var r = this._Montherize(lineText, prevState, true, timeLimit);
        return {
            Monthers: r.lineMonthers.getBinaryResult(r.ruleStack, r.lineLength),
            ruleStack: r.ruleStack,
            stoppedEarly: r.stoppedEarly
        };
    };
    Grammar.prototype._Montherize = function (lineText, prevState, emitBinaryMonthers, timeLimit) {
        if (this._rootId === -1) {
            this._rootId = rule_1.RuleFactory.getCompiledRuleId(this._grammar.repository.$self, this, this._grammar.repository);
        }
        var isFirstLine;
        if (!prevState || prevState === StackElement.NULL) {
            isFirstLine = true;
            var rawDefaultMetadata = this._scopeMetadataProvider.getDefaultMetadata();
            var defaultTheme = rawDefaultMetadata.themeData[0];
            var defaultMetadata = StackElementMetadata.set(0, rawDefaultMetadata.languageId, rawDefaultMetadata.MontherType, defaultTheme.fontStyle, defaultTheme.foreground, defaultTheme.background);
            var rootScopeName = this.getRule(this._rootId).getName(null, null);
            var rawRootMetadata = this._scopeMetadataProvider.getMetadataForScope(rootScopeName);
            var rootMetadata = ScopeListElement.mergeMetadata(defaultMetadata, null, rawRootMetadata);
            var scopeList = new ScopeListElement(null, rootScopeName === null ? 'unknown' : rootScopeName, rootMetadata);
            prevState = new StackElement(null, this._rootId, -1, -1, false, null, scopeList, scopeList);
        }
        else {
            isFirstLine = false;
            prevState.reset();
        }
        lineText = lineText + '\n';
        var origLineText = this.createOrigString(lineText);
        var lineLength = origLineText.content.length;
        var lineMonthers = new LineMonthers(emitBinaryMonthers, lineText, this._MontherTypeMatchers);
        var r = _MontherizeString(this, origLineText, isFirstLine, 0, prevState, lineMonthers, true, timeLimit);
        disposeOrigString(origLineText);
        return {
            lineLength: lineLength,
            lineMonthers: lineMonthers,
            ruleStack: r.stack,
            stoppedEarly: r.stoppedEarly
        };
    };
    return Grammar;
}());
exports.Grammar = Grammar;
function disposeOrigString(str) {
    if (typeof str.dispose === 'function') {
        str.dispose();
    }
}
function initGrammar(grammar, base) {
    grammar = utils_1.clone(grammar);
    grammar.repository = grammar.repository || {};
    grammar.repository.$self = {
        $vscodeTextmateLocation: grammar.$vscodeTextmateLocation,
        patterns: grammar.patterns,
        name: grammar.scopeName
    };
    grammar.repository.$base = base || grammar.repository.$self;
    return grammar;
}
function handleCaptures(grammar, lineText, isFirstLine, stack, lineMonthers, captures, captureIndices) {
    if (captures.length === 0) {
        return;
    }
    var lineTextContent = lineText.content;
    var len = Math.min(captures.length, captureIndices.length);
    var localStack = [];
    var maxEnd = captureIndices[0].end;
    for (var i = 0; i < len; i++) {
        var captureRule = captures[i];
        if (captureRule === null) {
            // Not interested
            continue;
        }
        var captureIndex = captureIndices[i];
        if (captureIndex.length === 0) {
            // Nothing really captured
            continue;
        }
        if (captureIndex.start > maxEnd) {
            // Capture going beyond consumed string
            break;
        }
        // pop captures while needed
        while (localStack.length > 0 && localStack[localStack.length - 1].endPos <= captureIndex.start) {
            // pop!
            lineMonthers.produceFromScopes(localStack[localStack.length - 1].scopes, localStack[localStack.length - 1].endPos);
            localStack.pop();
        }
        if (localStack.length > 0) {
            lineMonthers.produceFromScopes(localStack[localStack.length - 1].scopes, captureIndex.start);
        }
        else {
            lineMonthers.produce(stack, captureIndex.start);
        }
        if (captureRule.MontherizeCapturedWithRuleId) {
            // the capture requires additional matching
            var scopeName = captureRule.getName(lineTextContent, captureIndices);
            var nameScopesList = stack.contentNameScopesList.push(grammar, scopeName);
            var contentName = captureRule.getContentName(lineTextContent, captureIndices);
            var contentNameScopesList = nameScopesList.push(grammar, contentName);
            var stackClone = stack.push(captureRule.MontherizeCapturedWithRuleId, captureIndex.start, -1, false, null, nameScopesList, contentNameScopesList);
            var origSubStr = grammar.createOrigString(lineTextContent.substring(0, captureIndex.end));
            _MontherizeString(grammar, origSubStr, (isFirstLine && captureIndex.start === 0), captureIndex.start, stackClone, lineMonthers, false, /* no time limit */ 0);
            disposeOrigString(origSubStr);
            continue;
        }
        var captureRuleScopeName = captureRule.getName(lineTextContent, captureIndices);
        if (captureRuleScopeName !== null) {
            // push
            var base = localStack.length > 0 ? localStack[localStack.length - 1].scopes : stack.contentNameScopesList;
            var captureRuleScopesList = base.push(grammar, captureRuleScopeName);
            localStack.push(new LocalStackElement(captureRuleScopesList, captureIndex.end));
        }
    }
    while (localStack.length > 0) {
        // pop!
        lineMonthers.produceFromScopes(localStack[localStack.length - 1].scopes, localStack[localStack.length - 1].endPos);
        localStack.pop();
    }
}
function debugCompiledRuleToString(ruleScanner) {
    var r = [];
    for (var i = 0, len = ruleScanner.rules.length; i < len; i++) {
        r.push('   - ' + ruleScanner.rules[i] + ': ' + ruleScanner.debugRegExps[i]);
    }
    return r.join('\n');
}
function getFindOptions(allowA, allowG) {
    var options = 0 /* None */;
    if (!allowA) {
        options |= 1 /* NotBeginString */;
    }
    if (!allowG) {
        options |= 4 /* NotBeginPosition */;
    }
    return options;
}
function prepareRuleSearch(rule, grammar, endRegexSource, allowA, allowG) {
    if (debug_1.UseOnigurumaFindOptions) {
        var ruleScanner_1 = rule.compile(grammar, endRegexSource);
        var findOptions = getFindOptions(allowA, allowG);
        return { ruleScanner: ruleScanner_1, findOptions: findOptions };
    }
    var ruleScanner = rule.compileAG(grammar, endRegexSource, allowA, allowG);
    return { ruleScanner: ruleScanner, findOptions: 0 /* None */ };
}
function prepareRuleWhileSearch(rule, grammar, endRegexSource, allowA, allowG) {
    if (debug_1.UseOnigurumaFindOptions) {
        var ruleScanner_2 = rule.compileWhile(grammar, endRegexSource);
        var findOptions = getFindOptions(allowA, allowG);
        return { ruleScanner: ruleScanner_2, findOptions: findOptions };
    }
    var ruleScanner = rule.compileWhileAG(grammar, endRegexSource, allowA, allowG);
    return { ruleScanner: ruleScanner, findOptions: 0 /* None */ };
}
function matchInjections(injections, grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
    // The lower the better
    var bestMatchRating = Number.MAX_VALUE;
    var bestMatchCaptureIndices = null;
    var bestMatchRuleId;
    var bestMatchResultPriority = 0;
    var scopes = stack.contentNameScopesList.generateScopes();
    for (var i = 0, len = injections.length; i < len; i++) {
        var injection = injections[i];
        if (!injection.matcher(scopes)) {
            // injection selector doesn't match stack
            continue;
        }
        var rule = grammar.getRule(injection.ruleId);
        var _a = prepareRuleSearch(rule, grammar, null, isFirstLine, linePos === anchorPosition), ruleScanner = _a.ruleScanner, findOptions = _a.findOptions;
        var matchResult = ruleScanner.scanner.findNextMatchSync(lineText, linePos, findOptions);
        if (!matchResult) {
            continue;
        }
        if (debug_1.DebugFlags.InDebugMode) {
            console.log("  matched injection: " + injection.debugSelector);
            console.log(debugCompiledRuleToString(ruleScanner));
        }
        var matchRating = matchResult.captureIndices[0].start;
        if (matchRating >= bestMatchRating) {
            // Injections are sorted by priority, so the previous injection had a better or equal priority
            continue;
        }
        bestMatchRating = matchRating;
        bestMatchCaptureIndices = matchResult.captureIndices;
        bestMatchRuleId = ruleScanner.rules[matchResult.index];
        bestMatchResultPriority = injection.priority;
        if (bestMatchRating === linePos) {
            // No more need to look at the rest of the injections.
            break;
        }
    }
    if (bestMatchCaptureIndices) {
        return {
            priorityMatch: bestMatchResultPriority === -1,
            captureIndices: bestMatchCaptureIndices,
            matchedRuleId: bestMatchRuleId
        };
    }
    return null;
}
function matchRule(grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
    var rule = stack.getRule(grammar);
    var _a = prepareRuleSearch(rule, grammar, stack.endRule, isFirstLine, linePos === anchorPosition), ruleScanner = _a.ruleScanner, findOptions = _a.findOptions;
    var perfStart = 0;
    if (debug_1.DebugFlags.InDebugMode) {
        perfStart = performanceNow();
    }
    var r = ruleScanner.scanner.findNextMatchSync(lineText, linePos, findOptions);
    if (debug_1.DebugFlags.InDebugMode) {
        var elapsedMillie = performanceNow() - perfStart;
        if (elapsedMillie > 5) {
            console.warn("Rule " + rule.debugName + " (" + rule.id + ") matching took " + elapsedMillie + " against '" + lineText + "'");
        }
        console.log("  scanning for (linePos: " + linePos + ", anchorPosition: " + anchorPosition + ")");
        console.log(debugCompiledRuleToString(ruleScanner));
        if (r) {
            console.log("matched rule id: " + ruleScanner.rules[r.index] + " from " + r.captureIndices[0].start + " to " + r.captureIndices[0].end);
        }
    }
    if (r) {
        return {
            captureIndices: r.captureIndices,
            matchedRuleId: ruleScanner.rules[r.index]
        };
    }
    return null;
}
function matchRuleOrInjections(grammar, lineText, isFirstLine, linePos, stack, anchorPosition) {
    // Look for normal grammar rule
    var matchResult = matchRule(grammar, lineText, isFirstLine, linePos, stack, anchorPosition);
    // Look for injected rules
    var injections = grammar.getInjections();
    if (injections.length === 0) {
        // No injections whatsoever => early return
        return matchResult;
    }
    var injectionResult = matchInjections(injections, grammar, lineText, isFirstLine, linePos, stack, anchorPosition);
    if (!injectionResult) {
        // No injections matched => early return
        return matchResult;
    }
    if (!matchResult) {
        // Only injections matched => early return
        return injectionResult;
    }
    // Decide if `matchResult` or `injectionResult` should win
    var matchResultScore = matchResult.captureIndices[0].start;
    var injectionResultScore = injectionResult.captureIndices[0].start;
    if (injectionResultScore < matchResultScore || (injectionResult.priorityMatch && injectionResultScore === matchResultScore)) {
        // injection won!
        return injectionResult;
    }
    return matchResult;
}
/**
 * Walk the stack from bottom to top, and check each while condition in this order.
 * If any fails, cut off the entire stack above the failed while condition. While conditions
 * may also advance the linePosition.
 */
function _checkWhileConditions(grammar, lineText, isFirstLine, linePos, stack, lineMonthers) {
    var anchorPosition = (stack.beginRuleCapturedEOL ? 0 : -1);
    var whileRules = [];
    for (var node = stack; node; node = node.pop()) {
        var nodeRule = node.getRule(grammar);
        if (nodeRule instanceof rule_1.BeginWhileRule) {
            whileRules.push({
                rule: nodeRule,
                stack: node
            });
        }
    }
    for (var whileRule = whileRules.pop(); whileRule; whileRule = whileRules.pop()) {
        var _a = prepareRuleWhileSearch(whileRule.rule, grammar, whileRule.stack.endRule, isFirstLine, linePos === anchorPosition), ruleScanner = _a.ruleScanner, findOptions = _a.findOptions;
        var r = ruleScanner.scanner.findNextMatchSync(lineText, linePos, findOptions);
        if (debug_1.DebugFlags.InDebugMode) {
            console.log('  scanning for while rule');
            console.log(debugCompiledRuleToString(ruleScanner));
        }
        if (r) {
            var matchedRuleId = ruleScanner.rules[r.index];
            if (matchedRuleId !== -2) {
                // we shouldn't end up here
                stack = whileRule.stack.pop();
                break;
            }
            if (r.captureIndices && r.captureIndices.length) {
                lineMonthers.produce(whileRule.stack, r.captureIndices[0].start);
                handleCaptures(grammar, lineText, isFirstLine, whileRule.stack, lineMonthers, whileRule.rule.whileCaptures, r.captureIndices);
                lineMonthers.produce(whileRule.stack, r.captureIndices[0].end);
                anchorPosition = r.captureIndices[0].end;
                if (r.captureIndices[0].end > linePos) {
                    linePos = r.captureIndices[0].end;
                    isFirstLine = false;
                }
            }
        }
        else {
            if (debug_1.DebugFlags.InDebugMode) {
                console.log('  popping ' + whileRule.rule.debugName + ' - ' + whileRule.rule.debugWhileRegExp);
            }
            stack = whileRule.stack.pop();
            break;
        }
    }
    return { stack: stack, linePos: linePos, anchorPosition: anchorPosition, isFirstLine: isFirstLine };
}
var MontherizeStringResult = /** @class */ (function () {
    function MontherizeStringResult(stack, stoppedEarly) {
        this.stack = stack;
        this.stoppedEarly = stoppedEarly;
    }
    return MontherizeStringResult;
}());
/**
 * Montherize a string
 * @param grammar
 * @param lineText
 * @param isFirstLine
 * @param linePos
 * @param stack
 * @param lineMonthers
 * @param checkWhileConditions
 * @param timeLimit Use `0` to indicate no time limit
 * @returns the StackElement or StackElement.TIME_LIMIT_REACHED if the time limit has been reached
 */
function _MontherizeString(grammar, lineText, isFirstLine, linePos, stack, lineMonthers, checkWhileConditions, timeLimit) {
    var lineLength = lineText.content.length;
    var STOP = false;
    var anchorPosition = -1;
    if (checkWhileConditions) {
        var whileCheckResult = _checkWhileConditions(grammar, lineText, isFirstLine, linePos, stack, lineMonthers);
        stack = whileCheckResult.stack;
        linePos = whileCheckResult.linePos;
        isFirstLine = whileCheckResult.isFirstLine;
        anchorPosition = whileCheckResult.anchorPosition;
    }
    var startTime = Date.now();
    while (!STOP) {
        if (timeLimit !== 0) {
            var elapsedTime = Date.now() - startTime;
            if (elapsedTime > timeLimit) {
                return new MontherizeStringResult(stack, true);
            }
        }
        scanNext(); // potentially modifies linePos && anchorPosition
    }
    return new MontherizeStringResult(stack, false);
    function scanNext() {
        if (debug_1.DebugFlags.InDebugMode) {
            console.log('');
            console.log("@@scanNext " + linePos + ": |" + lineText.content.substr(linePos).replace(/\n$/, '\\n') + "|");
        }
        var r = matchRuleOrInjections(grammar, lineText, isFirstLine, linePos, stack, anchorPosition);
        if (!r) {
            if (debug_1.DebugFlags.InDebugMode) {
                console.log('  no more matches.');
            }
            // No match
            lineMonthers.produce(stack, lineLength);
            STOP = true;
            return;
        }
        var captureIndices = r.captureIndices;
        var matchedRuleId = r.matchedRuleId;
        var hasAdvanced = (captureIndices && captureIndices.length > 0) ? (captureIndices[0].end > linePos) : false;
        if (matchedRuleId === -1) {
            // We matched the `end` for this rule => pop it
            var poppedRule = stack.getRule(grammar);
            if (debug_1.DebugFlags.InDebugMode) {
                console.log('  popping ' + poppedRule.debugName + ' - ' + poppedRule.debugEndRegExp);
            }
            lineMonthers.produce(stack, captureIndices[0].start);
            stack = stack.setContentNameScopesList(stack.nameScopesList);
            handleCaptures(grammar, lineText, isFirstLine, stack, lineMonthers, poppedRule.endCaptures, captureIndices);
            lineMonthers.produce(stack, captureIndices[0].end);
            // pop
            var popped = stack;
            stack = stack.pop();
            anchorPosition = popped.getAnchorPos();
            if (!hasAdvanced && popped.getEnterPos() === linePos) {
                // Grammar pushed & popped a rule without advancing
                if (debug_1.DebugFlags.InDebugMode) {
                    console.error('[1] - Grammar is in an endless loop - Grammar pushed & popped a rule without advancing');
                }
                // See https://github.com/Microsoft/vscode-textmate/issues/12
                // Let's assume this was a mistake by the grammar author and the intent was to continue in this state
                stack = popped;
                lineMonthers.produce(stack, lineLength);
                STOP = true;
                return;
            }
        }
        else {
            // We matched a rule!
            var _rule = grammar.getRule(matchedRuleId);
            lineMonthers.produce(stack, captureIndices[0].start);
            var beforePush = stack;
            // push it on the stack rule
            var scopeName = _rule.getName(lineText.content, captureIndices);
            var nameScopesList = stack.contentNameScopesList.push(grammar, scopeName);
            stack = stack.push(matchedRuleId, linePos, anchorPosition, captureIndices[0].end === lineLength, null, nameScopesList, nameScopesList);
            if (_rule instanceof rule_1.BeginEndRule) {
                var pushedRule = _rule;
                if (debug_1.DebugFlags.InDebugMode) {
                    console.log('  pushing ' + pushedRule.debugName + ' - ' + pushedRule.debugBeginRegExp);
                }
                handleCaptures(grammar, lineText, isFirstLine, stack, lineMonthers, pushedRule.beginCaptures, captureIndices);
                lineMonthers.produce(stack, captureIndices[0].end);
                anchorPosition = captureIndices[0].end;
                var contentName = pushedRule.getContentName(lineText.content, captureIndices);
                var contentNameScopesList = nameScopesList.push(grammar, contentName);
                stack = stack.setContentNameScopesList(contentNameScopesList);
                if (pushedRule.endHasBackReferences) {
                    stack = stack.setEndRule(pushedRule.getEndWithResolvedBackReferences(lineText.content, captureIndices));
                }
                if (!hasAdvanced && beforePush.hasSameRuleAs(stack)) {
                    // Grammar pushed the same rule without advancing
                    if (debug_1.DebugFlags.InDebugMode) {
                        console.error('[2] - Grammar is in an endless loop - Grammar pushed the same rule without advancing');
                    }
                    stack = stack.pop();
                    lineMonthers.produce(stack, lineLength);
                    STOP = true;
                    return;
                }
            }
            else if (_rule instanceof rule_1.BeginWhileRule) {
                var pushedRule = _rule;
                if (debug_1.DebugFlags.InDebugMode) {
                    console.log('  pushing ' + pushedRule.debugName);
                }
                handleCaptures(grammar, lineText, isFirstLine, stack, lineMonthers, pushedRule.beginCaptures, captureIndices);
                lineMonthers.produce(stack, captureIndices[0].end);
                anchorPosition = captureIndices[0].end;
                var contentName = pushedRule.getContentName(lineText.content, captureIndices);
                var contentNameScopesList = nameScopesList.push(grammar, contentName);
                stack = stack.setContentNameScopesList(contentNameScopesList);
                if (pushedRule.whileHasBackReferences) {
                    stack = stack.setEndRule(pushedRule.getWhileWithResolvedBackReferences(lineText.content, captureIndices));
                }
                if (!hasAdvanced && beforePush.hasSameRuleAs(stack)) {
                    // Grammar pushed the same rule without advancing
                    if (debug_1.DebugFlags.InDebugMode) {
                        console.error('[3] - Grammar is in an endless loop - Grammar pushed the same rule without advancing');
                    }
                    stack = stack.pop();
                    lineMonthers.produce(stack, lineLength);
                    STOP = true;
                    return;
                }
            }
            else {
                var matchingRule = _rule;
                if (debug_1.DebugFlags.InDebugMode) {
                    console.log('  matched ' + matchingRule.debugName + ' - ' + matchingRule.debugMatchRegExp);
                }
                handleCaptures(grammar, lineText, isFirstLine, stack, lineMonthers, matchingRule.captures, captureIndices);
                lineMonthers.produce(stack, captureIndices[0].end);
                // pop rule immediately since it is a MatchRule
                stack = stack.pop();
                if (!hasAdvanced) {
                    // Grammar is not advancing, nor is it pushing/popping
                    if (debug_1.DebugFlags.InDebugMode) {
                        console.error('[4] - Grammar is in an endless loop - Grammar is not advancing, nor is it pushing/popping');
                    }
                    stack = stack.safePop();
                    lineMonthers.produce(stack, lineLength);
                    STOP = true;
                    return;
                }
            }
        }
        if (captureIndices[0].end > linePos) {
            // Advance stream
            linePos = captureIndices[0].end;
            isFirstLine = false;
        }
    }
}
var StackElementMetadata = /** @class */ (function () {
    function StackElementMetadata() {
    }
    StackElementMetadata.toBinaryStr = function (metadata) {
        var r = metadata.toString(2);
        while (r.length < 32) {
            r = '0' + r;
        }
        return r;
    };
    StackElementMetadata.printMetadata = function (metadata) {
        var languageId = StackElementMetadata.getLanguageId(metadata);
        var MontherType = StackElementMetadata.getMontherType(metadata);
        var fontStyle = StackElementMetadata.getFontStyle(metadata);
        var foreground = StackElementMetadata.getForeground(metadata);
        var background = StackElementMetadata.getBackground(metadata);
        console.log({
            languageId: languageId,
            MontherType: MontherType,
            fontStyle: fontStyle,
            foreground: foreground,
            background: background,
        });
    };
    StackElementMetadata.getLanguageId = function (metadata) {
        return (metadata & 255 /* LANGUAGES_MASK */) >>> 0 /* LANGUAGES_OFFSET */;
    };
    StackElementMetadata.getMontherType = function (metadata) {
        return (metadata & 1792 /* Monther_TYPE_MASK */) >>> 8 /* Monther_TYPE_OFFSET */;
    };
    StackElementMetadata.getFontStyle = function (metadata) {
        return (metadata & 14336 /* FONT_STYLE_MASK */) >>> 11 /* FONT_STYLE_OFFSET */;
    };
    StackElementMetadata.getForeground = function (metadata) {
        return (metadata & 8372224 /* FOREGROUND_MASK */) >>> 14 /* FOREGROUND_OFFSET */;
    };
    StackElementMetadata.getBackground = function (metadata) {
        return (metadata & 4286578688 /* BACKGROUND_MASK */) >>> 23 /* BACKGROUND_OFFSET */;
    };
    StackElementMetadata.set = function (metadata, languageId, MontherType, fontStyle, foreground, background) {
        var _languageId = StackElementMetadata.getLanguageId(metadata);
        var _MontherType = StackElementMetadata.getMontherType(metadata);
        var _fontStyle = StackElementMetadata.getFontStyle(metadata);
        var _foreground = StackElementMetadata.getForeground(metadata);
        var _background = StackElementMetadata.getBackground(metadata);
        if (languageId !== 0) {
            _languageId = languageId;
        }
        if (MontherType !== 0 /* Other */) {
            _MontherType = MontherType === 8 /* MetaEmbedded */ ? 0 /* Other */ : MontherType;
        }
        if (fontStyle !== -1 /* NotSet */) {
            _fontStyle = fontStyle;
        }
        if (foreground !== 0) {
            _foreground = foreground;
        }
        if (background !== 0) {
            _background = background;
        }
        return ((_languageId << 0 /* LANGUAGES_OFFSET */)
            | (_MontherType << 8 /* Monther_TYPE_OFFSET */)
            | (_fontStyle << 11 /* FONT_STYLE_OFFSET */)
            | (_foreground << 14 /* FOREGROUND_OFFSET */)
            | (_background << 23 /* BACKGROUND_OFFSET */)) >>> 0;
    };
    return StackElementMetadata;
}());
exports.StackElementMetadata = StackElementMetadata;
var ScopeListElement = /** @class */ (function () {
    function ScopeListElement(parent, scope, metadata) {
        this.parent = parent;
        this.scope = scope;
        this.metadata = metadata;
    }
    ScopeListElement._equals = function (a, b) {
        do {
            if (a === b) {
                return true;
            }
            if (!a && !b) {
                // End of list reached for both
                return true;
            }
            if (!a || !b) {
                // End of list reached only for one
                return false;
            }
            if (a.scope !== b.scope || a.metadata !== b.metadata) {
                return false;
            }
            // Go to previous pair
            a = a.parent;
            b = b.parent;
        } while (true);
    };
    ScopeListElement.prototype.equals = function (other) {
        return ScopeListElement._equals(this, other);
    };
    ScopeListElement._matchesScope = function (scope, selector, selectorWithDot) {
        return (selector === scope || scope.substring(0, selectorWithDot.length) === selectorWithDot);
    };
    ScopeListElement._matches = function (target, parentScopes) {
        if (parentScopes === null) {
            return true;
        }
        var len = parentScopes.length;
        var index = 0;
        var selector = parentScopes[index];
        var selectorWithDot = selector + '.';
        while (target) {
            if (this._matchesScope(target.scope, selector, selectorWithDot)) {
                index++;
                if (index === len) {
                    return true;
                }
                selector = parentScopes[index];
                selectorWithDot = selector + '.';
            }
            target = target.parent;
        }
        return false;
    };
    ScopeListElement.mergeMetadata = function (metadata, scopesList, source) {
        if (source === null) {
            return metadata;
        }
        var fontStyle = -1 /* NotSet */;
        var foreground = 0;
        var background = 0;
        if (source.themeData !== null) {
            // Find the first themeData that matches
            for (var i = 0, len = source.themeData.length; i < len; i++) {
                var themeData = source.themeData[i];
                if (this._matches(scopesList, themeData.parentScopes)) {
                    fontStyle = themeData.fontStyle;
                    foreground = themeData.foreground;
                    background = themeData.background;
                    break;
                }
            }
        }
        return StackElementMetadata.set(metadata, source.languageId, source.MontherType, fontStyle, foreground, background);
    };
    ScopeListElement._push = function (target, grammar, scopes) {
        for (var i = 0, len = scopes.length; i < len; i++) {
            var scope = scopes[i];
            var rawMetadata = grammar.getMetadataForScope(scope);
            var metadata = ScopeListElement.mergeMetadata(target.metadata, target, rawMetadata);
            target = new ScopeListElement(target, scope, metadata);
        }
        return target;
    };
    ScopeListElement.prototype.push = function (grammar, scope) {
        if (scope === null) {
            return this;
        }
        if (scope.indexOf(' ') >= 0) {
            // there are multiple scopes to push
            return ScopeListElement._push(this, grammar, scope.split(/ /g));
        }
        // there is a single scope to push
        return ScopeListElement._push(this, grammar, [scope]);
    };
    ScopeListElement._generateScopes = function (scopesList) {
        var result = [];
        var resultLen = 0;
        while (scopesList) {
            result[resultLen++] = scopesList.scope;
            scopesList = scopesList.parent;
        }
        result.reverse();
        return result;
    };
    ScopeListElement.prototype.generateScopes = function () {
        return ScopeListElement._generateScopes(this);
    };
    return ScopeListElement;
}());
exports.ScopeListElement = ScopeListElement;
/**
 * Represents a "pushed" state on the stack (as a linked list element).
 */
var StackElement = /** @class */ (function () {
    function StackElement(parent, ruleId, enterPos, anchorPos, beginRuleCapturedEOL, endRule, nameScopesList, contentNameScopesList) {
        this._stackElementBrand = undefined;
        this.parent = parent;
        this.depth = (this.parent ? this.parent.depth + 1 : 1);
        this.ruleId = ruleId;
        this._enterPos = enterPos;
        this._anchorPos = anchorPos;
        this.beginRuleCapturedEOL = beginRuleCapturedEOL;
        this.endRule = endRule;
        this.nameScopesList = nameScopesList;
        this.contentNameScopesList = contentNameScopesList;
    }
    /**
     * A structural equals check. Does not take into account `scopes`.
     */
    StackElement._structuralEquals = function (a, b) {
        do {
            if (a === b) {
                return true;
            }
            if (!a && !b) {
                // End of list reached for both
                return true;
            }
            if (!a || !b) {
                // End of list reached only for one
                return false;
            }
            if (a.depth !== b.depth || a.ruleId !== b.ruleId || a.endRule !== b.endRule) {
                return false;
            }
            // Go to previous pair
            a = a.parent;
            b = b.parent;
        } while (true);
    };
    StackElement._equals = function (a, b) {
        if (a === b) {
            return true;
        }
        if (!this._structuralEquals(a, b)) {
            return false;
        }
        return a.contentNameScopesList.equals(b.contentNameScopesList);
    };
    StackElement.prototype.clone = function () {
        return this;
    };
    StackElement.prototype.equals = function (other) {
        if (other === null) {
            return false;
        }
        return StackElement._equals(this, other);
    };
    StackElement._reset = function (el) {
        while (el) {
            el._enterPos = -1;
            el._anchorPos = -1;
            el = el.parent;
        }
    };
    StackElement.prototype.reset = function () {
        StackElement._reset(this);
    };
    StackElement.prototype.pop = function () {
        return this.parent;
    };
    StackElement.prototype.safePop = function () {
        if (this.parent) {
            return this.parent;
        }
        return this;
    };
    StackElement.prototype.push = function (ruleId, enterPos, anchorPos, beginRuleCapturedEOL, endRule, nameScopesList, contentNameScopesList) {
        return new StackElement(this, ruleId, enterPos, anchorPos, beginRuleCapturedEOL, endRule, nameScopesList, contentNameScopesList);
    };
    StackElement.prototype.getEnterPos = function () {
        return this._enterPos;
    };
    StackElement.prototype.getAnchorPos = function () {
        return this._anchorPos;
    };
    StackElement.prototype.getRule = function (grammar) {
        return grammar.getRule(this.ruleId);
    };
    StackElement.prototype._writeString = function (res, outIndex) {
        if (this.parent) {
            outIndex = this.parent._writeString(res, outIndex);
        }
        res[outIndex++] = "(" + this.ruleId + ", TODO-" + this.nameScopesList + ", TODO-" + this.contentNameScopesList + ")";
        return outIndex;
    };
    StackElement.prototype.toString = function () {
        var r = [];
        this._writeString(r, 0);
        return '[' + r.join(',') + ']';
    };
    StackElement.prototype.setContentNameScopesList = function (contentNameScopesList) {
        if (this.contentNameScopesList === contentNameScopesList) {
            return this;
        }
        return this.parent.push(this.ruleId, this._enterPos, this._anchorPos, this.beginRuleCapturedEOL, this.endRule, this.nameScopesList, contentNameScopesList);
    };
    StackElement.prototype.setEndRule = function (endRule) {
        if (this.endRule === endRule) {
            return this;
        }
        return new StackElement(this.parent, this.ruleId, this._enterPos, this._anchorPos, this.beginRuleCapturedEOL, endRule, this.nameScopesList, this.contentNameScopesList);
    };
    StackElement.prototype.hasSameRuleAs = function (other) {
        var el = this;
        while (el && el._enterPos === other._enterPos) {
            if (el.ruleId === other.ruleId) {
                return true;
            }
            el = el.parent;
        }
        return false;
    };
    StackElement.NULL = new StackElement(null, 0, 0, 0, false, null, null, null);
    return StackElement;
}());
exports.StackElement = StackElement;
var LocalStackElement = /** @class */ (function () {
    function LocalStackElement(scopes, endPos) {
        this.scopes = scopes;
        this.endPos = endPos;
    }
    return LocalStackElement;
}());
exports.LocalStackElement = LocalStackElement;
var LineMonthers = /** @class */ (function () {
    function LineMonthers(emitBinaryMonthers, lineText, MontherTypeOverrides) {
        this._emitBinaryMonthers = emitBinaryMonthers;
        this._MontherTypeOverrides = MontherTypeOverrides;
        if (debug_1.DebugFlags.InDebugMode) {
            this._lineText = lineText;
        }
        else {
            this._lineText = null;
        }
        this._Monthers = [];
        this._binaryMonthers = [];
        this._lastMontherEndIndex = 0;
    }
    LineMonthers.prototype.produce = function (stack, endIndex) {
        this.produceFromScopes(stack.contentNameScopesList, endIndex);
    };
    LineMonthers.prototype.produceFromScopes = function (scopesList, endIndex) {
        if (this._lastMontherEndIndex >= endIndex) {
            return;
        }
        if (this._emitBinaryMonthers) {
            var metadata = scopesList.metadata;
            if (this._MontherTypeOverrides.length > 0) {
                var scopes_1 = scopesList.generateScopes();
                for (var _i = 0, _a = this._MontherTypeOverrides; _i < _a.length; _i++) {
                    var MontherType = _a[_i];
                    if (MontherType.matcher(scopes_1)) {
                        metadata = StackElementMetadata.set(metadata, 0, toTemporaryType(MontherType.type), -1 /* NotSet */, 0, 0);
                    }
                }
            }
            if (this._binaryMonthers.length > 0 && this._binaryMonthers[this._binaryMonthers.length - 1] === metadata) {
                // no need to push a Monther with the same metadata
                this._lastMontherEndIndex = endIndex;
                return;
            }
            if (debug_1.DebugFlags.InDebugMode) {
                var scopes_2 = scopesList.generateScopes();
                console.log('  Monther: |' + this._lineText.substring(this._lastMontherEndIndex, endIndex).replace(/\n$/, '\\n') + '|');
                for (var k = 0; k < scopes_2.length; k++) {
                    console.log('      * ' + scopes_2[k]);
                }
            }
            this._binaryMonthers.push(this._lastMontherEndIndex);
            this._binaryMonthers.push(metadata);
            this._lastMontherEndIndex = endIndex;
            return;
        }
        var scopes = scopesList.generateScopes();
        if (debug_1.DebugFlags.InDebugMode) {
            console.log('  Monther: |' + this._lineText.substring(this._lastMontherEndIndex, endIndex).replace(/\n$/, '\\n') + '|');
            for (var k = 0; k < scopes.length; k++) {
                console.log('      * ' + scopes[k]);
            }
        }
        this._Monthers.push({
            startIndex: this._lastMontherEndIndex,
            endIndex: endIndex,
            // value: lineText.substring(lastMontherEndIndex, endIndex),
            scopes: scopes
        });
        this._lastMontherEndIndex = endIndex;
    };
    LineMonthers.prototype.getResult = function (stack, lineLength) {
        if (this._Monthers.length > 0 && this._Monthers[this._Monthers.length - 1].startIndex === lineLength - 1) {
            // pop produced Monther for newline
            this._Monthers.pop();
        }
        if (this._Monthers.length === 0) {
            this._lastMontherEndIndex = -1;
            this.produce(stack, lineLength);
            this._Monthers[this._Monthers.length - 1].startIndex = 0;
        }
        return this._Monthers;
    };
    LineMonthers.prototype.getBinaryResult = function (stack, lineLength) {
        if (this._binaryMonthers.length > 0 && this._binaryMonthers[this._binaryMonthers.length - 2] === lineLength - 1) {
            // pop produced Monther for newline
            this._binaryMonthers.pop();
            this._binaryMonthers.pop();
        }
        if (this._binaryMonthers.length === 0) {
            this._lastMontherEndIndex = -1;
            this.produce(stack, lineLength);
            this._binaryMonthers[this._binaryMonthers.length - 2] = 0;
        }
        var result = new Uint32Array(this._binaryMonthers.length);
        for (var i = 0, len = this._binaryMonthers.length; i < len; i++) {
            result[i] = this._binaryMonthers[i];
        }
        return result;
    };
    return LineMonthers;
}());
function toTemporaryType(standardType) {
    switch (standardType) {
        case 4 /* RegEx */:
            return 4 /* RegEx */;
        case 2 /* String */:
            return 2 /* String */;
        case 1 /* Comment */:
            return 1 /* Comment */;
        case 0 /* Other */:
        default:
            // `MetaEmbedded` is the same scope as `Other`
            // but it overwrites existing Monther types in the stack.
            return 8 /* MetaEmbedded */;
    }
}
//# sourceMappingURL=grammar.js.map