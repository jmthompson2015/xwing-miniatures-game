import Logger from "../../utility/Logger.js";

import Faction from "../../artifact/Faction.js";

import AgentSquadAction from "../../model/AgentSquadAction.js";
import AgentSquadReducer from "../../model/AgentSquadReducer.js";
import Reducer from "../../model/Reducer.js";

import Select from "../../view/Select.js";

import SquadBuilderContainer from "../../controller/SquadBuilderContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../../../src/resource/";
let faction = Faction.properties[Faction.IMPERIAL];
const store = Redux.createStore(AgentSquadReducer.root);
const delegateStore = Redux.createStore(Reducer.root);
store.dispatch(AgentSquadAction.setDelegateStore(delegateStore));

ReactDOM.render(createFactionSelect(), document.getElementById("factionSelect"));

function createFactionSelect()
{
   const factionValues = [Faction.IMPERIAL, Faction.REBEL, Faction.SCUM];
   const factionLabelFunction = function(value)
   {
      let answer = Faction.properties[value].name;
      const friend = Faction.friend(value);
      if (friend)
      {
         answer += " + " + Faction.properties[friend].name;
      }
      return answer;
   };

   return React.createElement(Select,
   {
      values: factionValues,
      labelFunction: factionLabelFunction,
      initialSelectedValue: faction.key,
      onChange: handleFactionChange,
   });
}

function handleFactionChange(event)
{
   const factionKey = event.currentTarget.value;
   faction = Faction.properties[factionKey];
   store.dispatch(AgentSquadAction.reset());
   renderSquadBuilderContainer();
}

function renderSquadBuilderContainer()
{
   const element = React.createElement(ReactRedux.Provider,
   {
      store: store,
   }, React.createElement(SquadBuilderContainer,
   {
      faction: faction,
      resourceBase: resourceBase,
      store: store,
   }));
   ReactDOM.render(element, document.getElementById("squadBuilderPanel"));
}

renderSquadBuilderContainer();