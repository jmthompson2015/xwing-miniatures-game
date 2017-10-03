# X-Wing Miniatures Game
Play the game:
* [X-Wing Miniatures Game](https://rawgit.com/jmthompson2015/xwing-miniatures-game/master/src/index.html)

## Built With
* [Immutable](https://facebook.github.io/immutable-js/) - Immutable collections for JavaScript.
* [QUnit](https://qunitjs.com/) - JavaScript unit testing.
* [React](http://facebook.github.io/react/) - A JavaScript library for building user interfaces.
* [ReactRedux](https://github.com/reactjs/react-redux) - Official React bindings for Redux.
* [Redux](https://redux.js.org/) - A predictable state container for JavaScript apps.
* [Require.js](http://requirejs.org/) - A JavaScript file and module loader.
* [xwing-data](https://github.com/guidokessels/xwing-data/) - An easy-to-use collection of data and images from X-Wing: The Miniatures Game by Fantasy Flight Games.

## Architecture
![Web Application Diagram](doc/WebApplicationDiagram.png)

#### Common
Contains generic utilities and JavaScript extensions. (e.g. Logger, InputValidator, etc.)

#### Artifact
Contains game data implemented as constant enumerations. (e.g. Ship, PilotCard, UpgradeCard, etc.)

#### Model
Provides the data model and processes using Redux.

#### View
Provides the GUI components using React.

#### Controller
Provides integration between the model and the view. Data changes are propagated to the view components, and user actions are transmitted to the model.

#### Accessory
Contains accessory applications.

## License
X-Wing Miniatures Game is released under the terms of the [MIT License](https://github.com/jmthompson2015/xwing-miniatures-game/blob/master/LICENSE.txt).

***
Star Wars, X-Wing: Miniatures Game and all related properties, images and text are owned by Fantasy Flight Games, Lucasfilm Ltd., and/or Disney.