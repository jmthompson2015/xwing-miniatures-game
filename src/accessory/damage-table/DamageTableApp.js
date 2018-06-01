import Logger from "../../utility/Logger.js";

import AbilityCountContainer from "../../controller/AbilityCountContainer.js";

import DamageTableContainer from "./DamageTableContainer.js";
import Reducer from "./Reducer.js";

// require(["react", "react-dom", "react-redux", "redux", "utility/Logger", "utility/MathUtilities", "artifact/DamageCard",
//     "controller/AbilityCountContainer", "accessory/damage-table/DamageTableContainer", "accessory/damage-table/Reducer"
//   ],
//   function(React, ReactDOM, ReactRedux, Redux, Logger, MathUtilities, DamageCard, AbilityCountContainer, DamageTableContainer, Reducer)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../../../src/resource/";
var store = Redux.createStore(Reducer.root);

var element0 = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(AbilityCountContainer));

ReactDOM.render(element0, document.getElementById("implementedStatistics"));

var element1 = React.createElement(ReactRedux.Provider,
{
   store: store,
}, React.createElement(DamageTableContainer,
{
   resourceBase: resourceBase,
}));

ReactDOM.render(element1, document.getElementById("tableContainer"));