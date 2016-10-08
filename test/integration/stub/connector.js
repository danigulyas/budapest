import {injectable} from "../../../app";

@injectable("httpConnector", ["logger"])
export default function instantiateConnector(log) {
    log.info("suparb service!");
}