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

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

const resourceBase = "../resource/";
let faction = Faction.properties[Faction.IMPERIAL];
let store = Redux.createStore(AgentSquadReducer.root);
const delegateStore = Redux.createStore(Reducer.root);
const agent = new Agent(delegateStore, "Placeholder");

const displayItemChanged = function(displayItem)
{
   store.dispatch(AgentSquadAction.setDisplayItem(displayItem));
   renderSquadBuilderUI();
};
const pilotChanged = function(pilot, index)
{
   store.dispatch(AgentSquadAction.setPilot(pilot, index));

   if (pilot.fore)
   {
      store.dispatch(AgentSquadAction.setPilot(pilot.fore, this.computePilotIndexFore(index)));
      store.dispatch(AgentSquadAction.setPilot(pilot.aft, this.computePilotIndexAft(index)));
   }

   const squad = createSquad();
   store.dispatch(AgentSquadAction.setSquad(squad));
   renderSquadBuilderUI();
};
const pilotUpgradeChanged = function(pilotIndex, upgrade, upgradeIndex)
{
   store.dispatch(AgentSquadAction.setPilotUpgrade(pilotIndex, upgrade, upgradeIndex));
   const squad = createSquad();
   store.dispatch(AgentSquadAction.setSquad(squad));
   renderSquadBuilderUI();
};
const shipChanged = function(ship, index)
{
   store.dispatch(AgentSquadAction.setShip(ship, index));
   const squad = createSquad();
   store.dispatch(AgentSquadAction.setSquad(squad));
   renderSquadBuilderUI();
};

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

function createSquad()
{
   const factionKey = faction.key;
   const name = "name";
   const year = 2017;
   const description = "description";
   const pilots = store.getState().pilots;
   const tokens = [];

   if (pilots.size > 0)
   {
      // const agent = new Agent();

      pilots.forEach(function(pilot, i)
      {
         if (pilot)
         {
            // Ignore child pilots.
            if (!pilot.parent)
            {
               let myPilot = (pilot.fore ? pilot.fore : pilot);
               let upgrades = store.getState().pilotIndexToUpgrades.get(i);
               const upgradeKeys = [];
               upgrades.forEach(function(upgrade)
               {
                  if (upgrade)
                  {
                     upgradeKeys.push(upgrade.key);
                  }
               });

               let upgradeKeysAft;
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
   const factionKey = event.currentTarget.value;
   faction = Faction.properties[factionKey];
   store = Redux.createStore(AgentSquadReducer.root);
   renderSquadBuilderUI();
}

function renderSquadBuilderUI()
{
   const element = React.createElement(SquadBuilderUI,
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