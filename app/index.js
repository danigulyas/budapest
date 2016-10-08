import Container from "./component/container";
import Injectable from "./component/injectable";

export let container = new Container();

export default function injectable(name, options) {
    return (target) => {
        container.registerInjectable(new Injectable(name, target, options));
    }
}