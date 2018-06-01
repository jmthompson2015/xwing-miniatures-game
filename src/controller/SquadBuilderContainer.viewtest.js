import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";

import AgentSquadAction from "../model/AgentSquadAction.js";
import AgentSquadReducer from "../model/AgentSquadReducer.js";
import Reducer from "../model/Reducer.js";

import Select from "../view/Select.js";

import SquadBuilderContainer from "./SquadBuilderContainer.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var faction = Faction.properties[Faction.IMPERIAL];
var store = Redux.createStore(AgentSquadReducer.root);
var delegateStore = Redux.createStore(Reducer.root);
store.dispatch(AgentSquadAction.setDelegateStore(delegateStore));

ReactDOM.render(createFactionSelect(), document.getElementById("factionSelect"));

function createFactionSelect()
{
   var factionValues = [Faction.IMPERIAL, Faction.REBEL, Faction.SCUM];
   var factionLabelFunction = function(value)
   {
      var answer = Faction.properties[value].name;
      var friend = Faction.friend(value);
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
   var factionKey = event.currentTarget.value;
   faction = Faction.properties[factionKey];
   store.dispatch(AgentSquadAction.reset());
   renderSquadBuilderContainer();
}

function renderSquadBuilderContainer()
{
   var element = React.createElement(ReactRedux.Provider,
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