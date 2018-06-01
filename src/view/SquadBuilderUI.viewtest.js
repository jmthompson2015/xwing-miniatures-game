import Logger from "../utility/Logger.js";

import Faction from "../artifact/Faction.js";

import Agent from "../model/Agent.js";
import AgentSquadAction from "../model/AgentSquadAction.js";
import AgentSquadReducer from "../model/AgentSquadReducer.js";
import CardInstance from "../model/CardInstance.js";
import Reducer from "../model/Reducer.js";
import Squad from "../model/Squad.js";

import Select from "./Select.js";
import SquadBuilderUI from "./SquadBuilderUI.js";

// require(["react", "react-dom", "redux", "utility/Logger", "artifact/Faction",
//     "model/Reducer", "model/Squad", "model/AgentSquadAction", "model/AgentSquadReducer", "model/CardInstance",
//     "view/Select", "view/SquadBuilderUI"
//   ],
//   function(React, ReactDOM, Redux, Logger, Faction,
//     DelegateReducer, Squad, AgentSquadAction, AgentSquadReducer, CardInstance, Select, SquadBuilderUI)

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

var resourceBase = "../resource/";
var faction = Faction.properties[Faction.IMPERIAL];
var store = Redux.createStore(AgentSquadReducer.root);
var delegateStore = Redux.createStore(Reducer.root);
var agent = new Agent(delegateStore, "Placeholder");

var displayItemChanged = function(displayItem)
{
   store.dispatch(AgentSquadAction.setDisplayItem(displayItem));
   renderSquadBuilderUI();
};
var pilotChanged = function(pilot, index)
{
   store.dispatch(AgentSquadAction.setPilot(pilot, index));

   if (pilot.fore)
   {
      store.dispatch(AgentSquadAction.setPilot(pilot.fore, this.computePilotIndexFore(index)));
      store.dispatch(AgentSquadAction.setPilot(pilot.aft, this.computePilotIndexAft(index)));
   }

   var squad = createSquad();
   store.dispatch(AgentSquadAction.setSquad(squad));
   renderSquadBuilderUI();
};
var pilotUpgradeChanged = function(pilotIndex, upgrade, upgradeIndex)
{
   store.dispatch(AgentSquadAction.setPilotUpgrade(pilotIndex, upgrade, upgradeIndex));
   var squad = createSquad();
   store.dispatch(AgentSquadAction.setSquad(squad));
   renderSquadBuilderUI();
};
var shipChanged = function(ship, index)
{
   store.dispatch(AgentSquadAction.setShip(ship, index));
   var squad = createSquad();
   store.dispatch(AgentSquadAction.setSquad(squad));
   renderSquadBuilderUI();
};

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

function createSquad()
{
   var factionKey = faction.key;
   var name = "name";
   var year = 2017;
   var description = "description";
   var pilots = store.getState().pilots;
   var tokens = [];

   if (pilots.size > 0)
   {
      // var agent = new Agent();

      pilots.forEach(function(pilot, i)
      {
         if (pilot)
         {
            // Ignore child pilots.
            if (!pilot.parent)
            {
               var myPilot = (pilot.fore ? pilot.fore : pilot);
               var upgrades = store.getState().pilotIndexToUpgrades.get(i);
               var upgradeKeys = [];
               upgrades.forEach(function(upgrade)
               {
                  if (upgrade)
                  {
                     upgradeKeys.push(upgrade.key);
                  }
               });

               var upgradeKeysAft;
               myPilot = (pilot.aft ? pilot.aft : undefined);

               if (myPilot)
               {
                  upgrades = store.getState().pilotIndexToUpgrades.get(i);
                  upgradeKeysAft = [];
                  upgrades.forEach(function(upgrade)
                  {
                     if (upgrade)
                     {
                        upgradeKeysAft.push(upgrade.key);
                     }
                  });
               }

               tokens.push(new CardInstance(delegateStore, pilot.key, agent, upgradeKeys, upgradeKeysAft));
            }
         }
      }, this);
   }

   return new Squad(factionKey, name, year, description, tokens);
}

function handleFactionChange(event)
{
   var factionKey = event.currentTarget.value;
   faction = Faction.properties[factionKey];
   store = Redux.createStore(AgentSquadReducer.root);
   renderSquadBuilderUI();
}

function renderSquadBuilderUI()
{
   var element = React.createElement(SquadBuilderUI,
   {
      delegateStore: delegateStore,
      displayItem: store.getState().displayItem,
      faction: faction,
      pilotIndexToUpgrades: store.getState().pilotIndexToUpgrades,
      pilots: store.getState().pilots,
      resourceBase: resourceBase,
      ships: store.getState().ships,
      squad: store.getState().squad,
      squadBuilderAction: AgentSquadAction,
      squadClass: Squad,
      tokenFactory: CardInstance,

      displayItemChanged: displayItemChanged,
      pilotChanged: pilotChanged,
      pilotUpgradeChanged: pilotUpgradeChanged,
      shipChanged: shipChanged,
   });
   ReactDOM.render(element, document.getElementById("squadBuilderPanel"));
}

renderSquadBuilderUI();