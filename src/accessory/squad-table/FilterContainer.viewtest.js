import Logger from "../../utility/Logger.js";

import FilterContainer from "./FilterContainer.js";
import Reducer from "./Reducer.js";

// require(["react", "react-dom", "react-redux", "redux", "utility/Logger",
// 		"accessory/squad-table/FilterContainer", "accessory/squad-table/Reducer"
// 	],
// 	function(React, ReactDOM, ReactRedux, Redux, Logger, FilterContainer, Reducer)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";
var store = Redux.createStore(Reducer.root);

var element = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(FilterContainer,
{
   resourceBase: resourceBase,
}));
ReactDOM.render(element, document.getElementById("panel"));