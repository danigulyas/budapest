import InvalidArgumentError from "../error/InvalidArgumentError";
import {getFunctionArgumentNames, NoInstance} from "../util";
import _ from "lodash";

const DEFAULT_OPTIONS = {singleton: false};
const VALID_OPTIONS_PARAMETERS = ["singleton"];

/**
 * Internal representation of an injectable.
 * By injectable we usually mean a function which instantiates something then returns it.
 * An injectable can:
 * - Be a singleton
 * - Have dependencies
 *
 * An injectable must:
 * - Be a function / class constructor
 * - Have a name
 */
export default class Injectable {
    constructor(name = "", loader, dependencies = null, options = {}) {
        if(!name.length)
            throw new InvalidArgumentError("Argument 'name' must be a string and must have length.");
        if(!_.isFunction(loader))
            throw new InvalidArgumentError("Argument 'loader' must be a function.");
        if(options.constructor !== Object || options === undefined)
            throw new InvalidArgumentError("Argument 'options' must be an object.");

        let mergedOptions = Object.assign(DEFAULT_OPTIONS, options);
        this.validateOptionsObject(mergedOptions);

        this.name = name;
        this.loader = loader;
        this.options = options;
        this.instance = new NoInstance();

        if(dependencies !== null) {
            this.validateDependenciesArgument(dependencies);
            this.dependencies = dependencies;
        } else {
            this.dependencies = this.parseFunctionArguments(loader);
        }
    }

    /**
     * Parses the param names of a function and returns them as an array.
     * @param {function} func
     * @return {String|Array} Array of dependencies.
     */
    parseFunctionArguments(func) {
        return getFunctionArgumentNames(func);
    }

    validateDependenciesArgument(dependenciesArg) {
        if(!_.isArray(dependenciesArg))
            throw new InvalidArgumentError(`@require should be an array only at injectable "${this.name}".`);
    }

    /**
     * Validate options object, throw error in case it's invalid.
     * @param {Object} options
     */
    validateOptionsObject(options) {
        _.keys(options).forEach((key) => {
            if(VALID_OPTIONS_PARAMETERS.indexOf(key) === -1)
                throw new InvalidArgumentError(`Key "${key}" is not valid in the arguments.`);
        });
    }

    /**
     * Returns if an injectable should be treated as a singleton.
     * @return {boolean} Boolean indicating if injectable is a singleton.
     */
    isSingleton() {
        return this.options.singleton;
    }

    /**
     * Registers an instance of Injectable.
     * @param instance Instance
     */
    registerInstance(instance) {
        if(this.options.singleton && this.instance.constructor !== NoInstance)
            throw new Error(`Injectable ${this.name} is described as a singleton, changing it's instance isn't allowed.`);

        this.instance = instance;
    }

    /**
     * Returns the registered instance of Injectable.
     * @return Instance of the
     */
    getInstance() {
        if(this.instance.constructor === NoInstance)
            throw new Error(`Injectable ${this.name} is not initiated, but an instance is requested, please create it \
             first via the container.`);

        return this.instance;
    }

    hasInstance() {
        return this.instance.constructor !== NoInstance;
    }
}