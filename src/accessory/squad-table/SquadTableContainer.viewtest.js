import Logger from "../../utility/Logger.js";

import Reducer from "./Reducer.js";
import SquadTableContainer from "./SquadTableContainer.js";

// require(["react", "react-dom", "react-redux", "redux", "utility/Logger",
// 		"accessory/squad-table/Reducer", "accessory/squad-table/SquadTableContainer"
// 	],
// 	function(React, ReactDOM, ReactRedux, Redux, Logger, Reducer, SquadTableContainer)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";
var store = Redux.createStore(Reducer.root);

var element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(SquadTableContainer,
{
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));