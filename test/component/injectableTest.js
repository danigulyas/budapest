import {expect} from "chai";
import Injectable from "../../app/component/injectable";
import InvalidArgumentError from "../../app/util";

const VALID_NAME = "component";
const VALID_LOADER = (dependencyOne, dependencyTwo) => true;
const VALID_OPTIONS = {singleton: true};

const VALID_LOADER_ARGUMENT_LIST = ["dependencyOne", "dependencyTwo"];

describe("Injectable", () => {
    it("should not construct with empty name", () => {
        expect(() => new Injectable(null, VALID_LOADER)).to.throw(InvalidArgumentError);
        expect(() => new Injectable(undefined, VALID_LOADER)).to.throw(InvalidArgumentError);
        expect(() => new Injectable("", VALID_LOADER)).to.throw(InvalidArgumentError);
        expect(() => new Injectable(VALID_NAME, VALID_LOADER)).to.not.throw();
    });

    it("should not construct without function", () => {
        expect(() => new Injectable(VALID_NAME, null)).to.throw(InvalidArgumentError);
        expect(() => new Injectable(VALID_NAME, undefined)).to.throw(InvalidArgumentError);
        expect(() => new Injectable(VALID_NAME, {})).to.throw(InvalidArgumentError);
        expect(() => new Injectable(VALID_NAME, VALID_LOADER)).to.not.throw();
    });

    it("should not construct with invalid options", () => {
        const INVALID_OPTIONS = {something: "blabla"};
        expect(() => new Injectable(VALID_NAME, VALID_LOADER, null)).to.throw(InvalidArgumentError);
        expect(() => new Injectable(VALID_NAME, VALID_LOADER, "")).to.throw(InvalidArgumentError);
        expect(() => new Injectable(VALID_NAME, VALID_LOADER, VALID_OPTIONS)).to.not.throw();
    });

    it("should construct with valid arguments", () => {
        var injectableInstance;
        expect(() => injectableInstance = new Injectable(VALID_NAME, VALID_LOADER, VALID_OPTIONS)).to.not.throw();
        expect(injectableInstance.name).to.be.equal(VALID_NAME);
        expect(injectableInstance.options).to.be.equal(VALID_OPTIONS);
        expect(injectableInstance.loader).to.be.equal(VALID_LOADER);
    });

    describe("parseFunctionArguments()", () => {
        it("should parse arguments correctly", () => {
            let injectableInstance = new Injectable(VALID_NAME, VALID_LOADER, VALID_OPTIONS);

            expect(() => injectableInstance.parseFunctionArguments(VALID_LOADER)).to.not.throw();
            expect(injectableInstance.parseFunctionArguments(VALID_LOADER)).to.be.deep.equal(VALID_LOADER_ARGUMENT_LIST);
        });

        it("should prioritize @require higher and argument names", () => {
            let validFnWithRequire = (some, other, args) => true;
            validFnWithRequire["@require"] = VALID_LOADER_ARGUMENT_LIST;

            let injectableInstance = new Injectable(VALID_NAME, validFnWithRequire);

            expect(injectableInstance.parseFunctionArguments(validFnWithRequire))
                .to.be.deep.equal(VALID_LOADER_ARGUMENT_LIST);
        });

        it("should throw error when invalid @require", () => {
            let validFnWithInvalidRequire = (some, other, args) => true;
            validFnWithInvalidRequire["@require"] = null;

            expect(() => {
                injectableInstance.parseFunctionArguments(validFnWithInvalidRequire);
            }).to.throw(InvalidArgumentError);
        });
    });
});
