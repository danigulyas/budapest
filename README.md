# budapest
Annotation driven DI in an IoC fashion for javascript.

So, you want to use proper DI and IoC, but you don't want to write hand-typed configurations and such, welcome to the club.

### How it would look like?
From the code aspect it's pretty much a simple, naive IoC container, from the end-user aspect it would look like this:

`configuration.js`
```javascript
import {injectable} from "budapest";

@injectable("configuration")
class Configuration {
    constructor() { return new MyConfiguration(); }
}

export default LoggerConfiguration;
```

`logger.js`
```
import {injectable} from "budapest";

@injectable("logger")
class ConfigureLogger {
    constructor(configuration) { 
        return new MyLogger(configuration.loglevel);
    }
}

export default ConfigureLogger
```

`index.js`
```
import {container} from "budapest";

container.create("logger");
```

Inside the package there's a singleton container and and annotation exposed,
by calling the annotation on a function or class it analyzes it's arguments
based on their name in the function header (this is overrideable by passing them
in at the annotation, eg `@injectable("logger", ["configuration"]`)).

Sadly, currently there's no option to annotate functions, which could be in fact,
really helpful with instantiating things, instead of the java-ish configuration classes.

### Proposal of API main parts

This is just a brief synopsis of the main api part, please check the code for in-depth details.

#### Container

##### `.create(injectableName)` - Create an Injectable (done)
Recursively creates the dependencies of the injectable and returns the instance of the injectable itself.

##### `.registerInjectable(Injectable)` - Registers an injectable in hte container. (done)

#### Annotations

##### `@injectable(name, dependencies, options)` - Registers an injectable in the container via the annotation (partially done).
There's a bit of a work to be done, also there's await for an annotation babel plugin.