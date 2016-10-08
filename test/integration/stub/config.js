import {injectable} from "../../../app";

@injectable("configuration")
class Configuration {
    constructor() {

    }

    get(param) {
        if(param === "log.level") return "info";
    }
}

export default Configuration;