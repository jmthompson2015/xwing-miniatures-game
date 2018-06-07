import InputValidator from "../utility/InputValidator.js";

import Agent from "../model/Agent.js";
import AgentSquadAction from "../model/AgentSquadAction.js";
import CardInstance from "../model/CardInstance.js";
import Squad from "../model/Squad.js";

import SquadBuilderUI from "../view/SquadBuilderUI.js";

function mapStateToProps(state, ownProps)
{
   return (
   {
      displayItem: state.displayItem,
      faction: ownProps.faction,
      pilotIndexToUpgrades: state.pilotIndexToUpgrades,
      pilots: state.pilots,
      resourceBase: ownProps.resourceBase,
      ships: state.ships,
      squad: state.squad,
   });
}

function mapDispatchToProps(dispatch, ownProps)
{
   InputValidator.validateNotNull("store", ownProps.store);
   InputValidator.validateNotNull("faction", ownProps.faction);

   const store = ownProps.store;
   const factionKey = ownProps.faction.key;
   const computePilotIndexFore = SquadBuilderUI.computePilotIndexFore;
   const computePilotIndexAft = SquadBuilderUI.computePilotIndexAft;

   return (
   {
      displayItemChanged: function(displayItem)
      {
         dispatch(AgentSquadAction.setDisplayItem(displayItem));
      },
      pilotChanged: function(pilot, index)
      {
         dispatch(AgentSquadAction.setPilot(pilot, index));

         if (pilot.fore)
         {
            dispatch(AgentSquadAction.setPilot(pilot.fore, computePilotIndexFore(index)));
            dispatch(AgentSquadAction.setPilot(pilot.aft, computePilotIndexAft(index)));
         }

         const squad = createSquad(store, factionKey);
         dispatch(AgentSquadAction.setSquad(squad));
      },
      pilotUpgradeChanged: function(pilotIndex, upgrade, upgradeIndex)
      {
         dispatch(AgentSquadAction.setPilotUpgrade(pilotIndex, upgrade, upgradeIndex));
         const squad = createSquad(store, factionKey);
         dispatch(AgentSquadAction.setSquad(squad));
      },
      shipChanged: function(ship, index)
      {
         dispatch(AgentSquadAction.setShip(ship, index));
         const squad = createSquad(store, factionKey);
         dispatch(AgentSquadAction.setSquad(squad));
      },
   });
}

function createSquad(store, factionKey)
{
   const name = "name";
   const year = 2017;
   const description = "description";
   const pilots = store.getState().pilots;
   const tokens = [];

   if (pilots.size > 0)
   {
      const delegateStore = store.getState().delegateStore;
      const mockAgent = new Agent(delegateStore, "mockAgent");

      pilots.forEach(function(pilot, i)
      {
         // Ignore child pilots.
         if (pilot && !pilot.parent)
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

            tokens.push(new CardInstance(delegateStore, pilot.key, mockAgent, upgradeKeys, upgradeKeysAft));
         }
      });
   }

   return new Squad(factionKey, name, year, description, tokens);
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(SquadBuilderUI);