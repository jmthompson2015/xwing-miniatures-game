import ArrayUtilities from "../utility/ArrayUtilities.js";
import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";

import Agent from "../model/Agent.js";
import Reducer from "../model/Reducer.js";
import SquadBuilder from "../model/SquadBuilder.js";

import SquadChooser from "./SquadChooser.js";

// require(["react", "react-dom", "react-dom-factories", "redux", "utility/ArrayUtilities", "utility/Logger",
// 		"model/Agent", "model/Reducer", "model/SquadBuilder", "artifact/Faction",
// 		"view/SquadChooser"
// 	],
// 	function(React, ReactDOM, ReactDOMFactories, Redux, ArrayUtilities, Logger, Agent, Reducer, SquadBuilder, Faction, SquadChooser)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var store = Redux.createStore(Reducer.root);
var resourceBase = "../resource/";
var faction = ArrayUtilities.randomElement([Faction.IMPERIAL, Faction.REBEL, Faction.SCUM]);
var agent = new Agent(store, "Placeholder");
var squadBuilders = SquadBuilder.findByFaction(faction);

var element = React.createElement(SquadChooser,
{
   agent: agent,
   resourceBase: resourceBase,
   squadBuilders: squadBuilders,
   onChange: myOnChange,
});
ReactDOM.render(element, document.getElementById("inputArea"));

function myOnChange(squadBuilder)
{
   LOGGER.info("myOnChange() squadBuilder = " + squadBuilder);
}