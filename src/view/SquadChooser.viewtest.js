import ArrayUtilities from "../utility/ArrayUtilities.js";
import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";

import Agent from "../model/Agent.js";
import Reducer from "../model/Reducer.js";
import SquadBuilder from "../model/SquadBuilder.js";

import SquadChooser from "./SquadChooser.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const store = Redux.createStore(Reducer.root);
const resourceBase = "../resource/";
const faction = ArrayUtilities.randomElement([Faction.IMPERIAL, Faction.REBEL, Faction.SCUM]);
const agent = new Agent(store, "Placeholder");
const squadBuilders = SquadBuilder.findByFaction(faction);

const element = React.createElement(SquadChooser,
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