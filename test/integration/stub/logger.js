import {injectable} from "../../../app";

@injectable("logger")
export default function instantiateLogger(configuration) {
    return {
        info: (msg) => {
            if(configuration.level === info) console.log(msg);
        }
    }
}