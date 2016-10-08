require("./stub/config");
require("./stub/connector");
require("./stub/logger");

import {container} from "../../app";

container.create("httpConnector");