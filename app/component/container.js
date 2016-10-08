import Injectable from "./injectable";
import InvalidArgumentError from "../error/InvalidArgumentError";

/**
 * Basic IoC container.
 */
class Container {
    constructor(injectables = {}) {
        this.injectables = injectables;
    }

    /**
     * Register an injectable to the container.
     * @param {Injectable} injectable
     */
    registerInjectable(injectable) {
        if(injectable.constructor !== Injectable)
            throw new InvalidArgumentError("Injectable must be an instance of Injectable.");

        if(injectable.name in this.injectables)
            throw new InvalidArgumentError(`An injectable with the name "${injectable.name}" is already registered.`);

        this.injectables[injectable.name] = injectable;
    }

    /**
     * Create an injectable and return it.
     * @param injectableName Name of the injectable.
     * @return {Object} Returns the result of the injectable's loader function.
     */
    create(injectableName) {
        if(!(injectableName in this.injectables))
            throw new InvalidArgumentError(`Couldn't find "${injectableName}" as a registered injectable in the container.`);

        let injectable = this.injectables[injectableName];
        let dependenciesOfInjectable = injectable.dependencies;

        dependenciesOfInjectable.map((injectable) => create(injectable.name));

        injectable.registerInstance(injectable.loader(...dependenciesOfInjectable));

        this.injectables[injectableName] = injectable;
        return injectable.getInstance();
    }
}