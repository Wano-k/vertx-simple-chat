# A simple chat using Vert.x-web-js and sockJS

----
The server and the client are both written in JavaScript.

----
## Running with Eclipse IDE

### Configuration:

* File > Import... > Existing Maven Project...
* In the navigator, right-click on the project:
   * Run As > Maven clean
   * Run As > Maven install
   * Run As > Run configurations...
       * Select Java application
       * In `Main` tab, select the project, and the main class `io.vertx.core.Launcher`
       * In `Arguments` tab, complete program arguments with `run src/main/js/main.js`

   * Click on run to test if all is OK

### Run:

Click on Run on the toolbar.

----
## Running with command lines

### Configuration:

Download Vert.x 3.3.2 [here](https://bintray.com/vertx/downloads/distribution/3.3.2) and set your PATH. 

[**Note:** Due to the [#2054](https://github.com/eclipse/vert.x/issues/2054) issue, we recommand downloading this older version of Vert.x for now.]

### Run:

    vertx run src/main/js/main.js