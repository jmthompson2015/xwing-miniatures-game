"use strict";

define(["react-redux", "utility/InputValidator", "model/Agent", "model/AgentSquadAction", "model/CardInstance", "model/Squad", "view/SquadBuilderUI"],
   function(ReactRedux, InputValidator, Agent, AgentSquadAction, CardInstance, Squad, SquadBuilderUI)
   {
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

         var store = ownProps.store;
         var factionKey = ownProps.faction.key;
         var computePilotIndexFore = SquadBuilderUI.computePilotIndexFore;
         var computePilotIndexAft = SquadBuilderUI.computePilotIndexAft;

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

               var squad = createSquad(store, factionKey);
               dispatch(AgentSquadAction.setSquad(squad));
            },
            pilotUpgradeChanged: function(pilotIndex, upgrade, upgradeIndex)
            {
               dispatch(AgentSquadAction.setPilotUpgrade(pilotIndex, upgrade, upgradeIndex));
               var squad = createSquad(store, factionKey);
               dispatch(AgentSquadAction.setSquad(squad));
            },
            shipChanged: function(ship, index)
            {
               dispatch(AgentSquadAction.setShip(ship, index));
               var squad = createSquad(store, factionKey);
               dispatch(AgentSquadAction.setSquad(squad));
            },
         });
      }

      function createSquad(store, factionKey)
      {
         var name = "name";
         var year = 2017;
         var description = "description";
         var pilots = store.getState().pilots;
         var tokens = [];

         if (pilots.size > 0)
         {
            var delegateStore = store.getState().delegateStore;
            var mockAgent = new Agent(delegateStore, "mockAgent");

            pilots.forEach(function(pilot, i)
            {
               // Ignore child pilots.
               if (pilot && !pilot.parent)
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

                  tokens.push(new CardInstance(delegateStore, pilot.key, mockAgent, upgradeKeys, upgradeKeysAft));
               }
            });
         }

         return new Squad(factionKey, name, year, description, tokens);
      }

      return ReactRedux.connect(mapStateToProps, mapDispatchToProps)(SquadBuilderUI);
   });
