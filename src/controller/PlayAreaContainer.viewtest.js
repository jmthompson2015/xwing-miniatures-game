import Logger from "../utility/Logger.js";

import EnvironmentFactory from "../model/EnvironmentFactory.js";
import Reducer from "../model/Reducer.js";

import PlayAreaContainer from "./PlayAreaContainer.js";

// require(["react", "react-dom", "react-redux", "redux", "utility/Logger",
// 		"model/Reducer", "model/EnvironmentFactory",
// 		"controller/PlayAreaContainer"
// 	],
// 	function(React, ReactDOM, ReactRedux, Redux, Logger, Reducer, EnvironmentFactory, PlayAreaContainer)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var store = Redux.createStore(Reducer.root);
var environment = EnvironmentFactory.createCoreSetEnvironment(store);

var element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(PlayAreaContainer,
{
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));