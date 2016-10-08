import Injectable from "./injectable";
import InvalidArgumentError from "../error/InvalidArgumentError";
import InjectableLoaderError from "../error/InjectableLoaderError";

const EXCLUDED_ARGUMENT_NAMES = ["sp", "exampleFactor"]; //sinon spy

/**
 * Basic IoC container.
 */
export default class Container {
    constructor() {
        this.injectables = new Map();
    }

    /**
     * Register an injectable to the container.
     * @param {Injectable} injectable
     */
    registerInjectable(injectable = {}) {
        if(injectable.constructor !== Injectable)
            throw new InvalidArgumentError("Injectable must be an instance of Injectable.");

        if(this.injectables.has(injectable.name))
            throw new InvalidArgumentError(`An injectable with the name "${injectable.name}" is already registered.`);

        this.injectables.set(injectable.name, injectable);
    }

    /**
     * Returns a filtered list of dependencies of injectable.
     * @param {Injectable} injectable
     * @return {String|Array} filtered dependencies
     */
    getFilteredDependenciesOfInjectable(injectable) {
        return injectable.dependencies
            .filter((argumentName) => !EXCLUDED_ARGUMENT_NAMES.includes(argumentName));
    }

    /**
     * Creates dependencies of injectable.
     * @param {Injectable} injectable
     * @return {Array} Instances of dependencies.
     */
    createDependenciesOfInjectable(injectable) {
        return this.getFilteredDependenciesOfInjectable(injectable)
            .map((nameOfInjectableDependency) => this.create(nameOfInjectableDependency));
    }

    /**
     * Create an injectable and return it.
     * @param injectableName Name of the injectable.
     * @return {Object} Returns the result of the injectable's loader function.
     */
    create(injectableName) {
        if(!this.injectables.has(injectableName))
            throw new InvalidArgumentError(`Couldn't find "${injectableName}" as a registered injectable in the container.`);

        let injectable = this.injectables.get(injectableName);
        if(injectable.isSingleton() && injectable.hasInstance()) return injectable.getInstance();

        var dependenciesOfInjectable = this.createDependenciesOfInjectable(injectable);

        try {
            var instance = injectable.loader(...dependenciesOfInjectable);
        } catch(exception) {
            throw new InjectableLoaderError(exception);
        }

        injectable.registerInstance(instance);
        return injectable.getInstance();
    }
}