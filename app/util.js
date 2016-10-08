var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
export function getFunctionArgumentNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}

/**
 * NoInstance is a class made to enable ability to match initial (null) instances and values returned by factories.
 * Since the factory (loader function) might return null without throwing error, we have to be sure that it's already instantiated,
 * and that it's not our initial null passed to the property.
 */
export class NoInstance {}