export default class InjectableLoaderError extends Error {
    /**
     * Registers an error for describing errors during the execution of loader function.
     * @param {Injectable} injectable Injectable instance.
     * @param {Error} error Error which generated during executing loader function.
     */
    constructor(injectable, error) {
        let message = `Error happened during executing the loader function of injectable "${injectable.name}".`;
        super(message);
        this.message = message;
        this.stack = error.stack;
        this.name = this.constructor.name;
        this.loaderError = error;
    }
}