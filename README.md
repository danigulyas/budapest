# Budapest
Annotation driven DI in an IoC fashion for javascript.

So, you want to use proper DI and IoC, but you don't want to write hand-typed configurations and such, neither do shady tricks, welcome to the club.

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
```javascript
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
```javascript
import {container} from "budapest";

container.create("logger");
```

Inside the package there's a singleton container and and annotation exposed,
by calling the annotation on a class it analyzes it's arguments
based on their name in the constructor function (this is overrideable by passing them
in at the annotation, eg `@injectable("logger", ["configuration"])`).

Sadly, currently there's no option to annotate functions, which could be in fact,
really helpful with instantiating things, instead of the java-ish configuration classes.

### Proposal of API, main parts

This is just a brief synopsis of the main api parts, please check the code for more in-depth details.

#### Container

##### `.create(injectableName)` - Create an instance out of an injectable (done)
Recursively creates the dependencies of the injectable and returns the instance of the injectable itself (see loader at Injectable, it's what the class constructor returns now basically).

##### `.registerInjectable(Injectable)` - Registers an injectable in the container. (done)

#### Annotations

##### `@injectable(name, dependencies, options)` - Registers an injectable in the container via the annotation (partially done).
There's a bit of a work to be done, also there's await for annotations for functions and a finalised transpiler plugin.


### What else?

Well, it would be really nice to create an async di, so one can create components async,
with promises maybe, but these are ideas only. :)

### Ideas and all
Please, open an issue / drop me a line at [hello@danielgulyas.me](hello@danielgulyas.me).

Cheers, have a nice day!:)