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
     * Create an injectable and return it.
     * @param injectableName Name of the injectable.
     * @return {Object} Returns the result of the injectable's loader function.
     */
    create(injectableName) {
        if(!this.injectables.has(injectableName))
            throw new InvalidArgumentError(`Couldn't find "${injectableName}" as a registered injectable in the container.`);

        let injectable = this.injectables.get(injectableName);
        let dependenciesOfInjectable = injectable.dependencies
            .filter((argumentName) => !EXCLUDED_ARGUMENT_NAMES.includes(argumentName));

        dependenciesOfInjectable.map((injectable) => this.create(injectable.name));

        try {
            var instance = injectable.loader(...dependenciesOfInjectable);
        } catch(exception) {
            throw new InjectableLoaderError(exception);
        }

        // this.injectables.set(injectableName, injectable);
        injectable.registerInstance(instance);
        return injectable.getInstance();
    }
}