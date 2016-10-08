import chai from "chai";
import sinon from "sinon";
chai.use(require("sinon-chai"));
const {expect} = chai;

import Container from "../../app/component/container";
import Injectable from "../../app/component/injectable";
import InvalidArgumentError from "../../app/util";

const INJECTABLE_NAME = "component";
const INEXISTENT_INJECTABLE_NAME = "garbage";
var containerInstance, injectableInstance;

beforeEach(() => {
    containerInstance = new Container();
    injectableInstance = new Injectable(INJECTABLE_NAME, () => {return true;});
})

describe("Container", () => {
    it("should construct without an error", () => {
        expect(containerInstance).to.be.an.instanceOf(Container);
    });

    it("should throw error when not an injectable is registered", () => {
        expect(() => containerInstance.registerInjectable({}))
            .to.throw(InvalidArgumentError);

        expect(() => containerInstance.registerInjectable(null))
            .to.throw(InvalidArgumentError);
    });

    it("should register valid injectables without error", () => {
        expect(() => containerInstance.registerInjectable(injectableInstance))
            .to.not.throw();

        expect(containerInstance.injectables.has(INJECTABLE_NAME)).to.equal(true);
        expect(containerInstance.injectables.get(INJECTABLE_NAME)).to.equal(injectableInstance);
    });

    it("should throw error when creating inexistent injectables", () => {
        expect(() => containerInstance.create(INEXISTENT_INJECTABLE_NAME))
            .to.throw(InvalidArgumentError);
    });

    it("should execute the loader function upon creating an injectable", () => {
        const SPY_INSTANCE_NAME = "bond";
        let spy = sinon.spy(exampleFactory);
        let spyInjectableInstance = new Injectable(SPY_INSTANCE_NAME, spy);

        var resultOfCreateCall;
        expect(() => containerInstance.registerInjectable(spyInjectableInstance)).to.not.throw();
        expect(() => resultOfCreateCall = containerInstance.create(SPY_INSTANCE_NAME)).to.not.throw();
        expect(resultOfCreateCall).to.deep.equal(factoryResult);
        expect(spy).to.have.callCount(1);
    });
});

const factoryResult = new Object();
function exampleFactory() {
    return factoryResult;
}