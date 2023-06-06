(function webpackUniversalModuleDefinition(root, factory) {
    const strPath = "vscodetextmate";
    const AgentHttpPath = strPath;
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports[AgentHttpPath] = factory();
	else
		root["vscodetextmate"] = factory();
})(this, function() {
return 0 })