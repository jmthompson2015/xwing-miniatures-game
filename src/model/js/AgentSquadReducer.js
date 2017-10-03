"use strict";

define(["immutable", "model/js/AgentSquadAction", "model/js/AgentSquadInitialState"],
   function(Immutable, AgentSquadAction, AgentSquadInitialState)
   {
      var AgentSquadReducer = {};

      AgentSquadReducer.root = function(state, action)
      {
         LOGGER.debug("root() type = " + action.type);

         if (typeof state === 'undefined')
         {
            return new AgentSquadInitialState();
         }

         var newAgent, newPilotIndexToUpgrades, newPilots, newShips, newUpgrades;

         switch (action.type)
         {
            case AgentSquadAction.SET_AGENT:
               return Object.assign(
               {}, state,
               {
                  agent: action.agent,
               });
            case AgentSquadAction.SET_AGENT_NAME:
               newAgent = new state.agentType(action.agentName, state.faction.key, state.inputAreaId, state.resourceBase);
               return Object.assign(
               {}, state,
               {
                  agent: newAgent,
                  agentName: action.agentName,
               });
            case AgentSquadAction.SET_AGENT_TYPE:
               newAgent = new action.agentType(state.agentName, state.faction.key, state.inputAreaId, state.resourceBase);
               return Object.assign(
               {}, state,
               {
                  agent: newAgent,
                  agentType: action.agentType,
               });
            case AgentSquadAction.SET_FACTION:
               newAgent = new state.agentType(state.agentName, action.faction.key, state.inputAreaId, state.resourceBase);
               return Object.assign(
               {}, state,
               {
                  agent: newAgent,
                  faction: action.faction,
               });
            case AgentSquadAction.SET_INPUT_AREA_ID:
               newAgent = new state.agentType(state.agentName, state.faction.key, action.inputAreaId, state.resourceBase);
               return Object.assign(
               {}, state,
               {
                  agent: newAgent,
                  inputAreaId: action.inputAreaId,
               });
            case AgentSquadAction.SET_RESOURCE_BASE:
               newAgent = new state.agentType(state.agentName, state.faction.key, state.inputAreaId, action.resourceBase);
               return Object.assign(
               {}, state,
               {
                  agent: newAgent,
                  resourceBase: action.resourceBase,
               });
            case AgentSquadAction.SET_SQUAD_BUILDER_TYPE:
               return Object.assign(
               {}, state,
               {
                  squadBuilderType: action.squadBuilderType,
               });

               // SquadBuilderUI
            case AgentSquadAction.RESET:
               var delegateStore = state.delegateStore;
               var newState = new AgentSquadInitialState();
               return Object.assign(
               {}, newState,
               {
                  delegateStore: delegateStore,
               });
            case AgentSquadAction.SET_DELEGATE_STORE:
               return Object.assign(
               {}, state,
               {
                  delegateStore: action.delegateStore,
               });
            case AgentSquadAction.SET_DISPLAY_ITEM:
               LOGGER.debug("SET_DISPLAY_ITEM displayItem = " + action.displayItem);
               return Object.assign(
               {}, state,
               {
                  displayItem: action.displayItem,
               });
            case AgentSquadAction.SET_PILOT:
               LOGGER.debug("SET_PILOT pilot = " + action.pilot + " " + (action.pilot ? action.pilot.key : undefined) + " index = " + action.index);
               newPilots = state.pilots.set(action.index, action.pilot);
               if (action.pilot)
               {
                  newPilotIndexToUpgrades = state.pilotIndexToUpgrades.set(action.index, new Immutable.List());
               }
               else
               {
                  newPilotIndexToUpgrades = state.pilotIndexToUpgrades;
               }
               return Object.assign(
               {}, state,
               {
                  displayItem: action.pilot,
                  pilots: newPilots,
                  pilotIndexToUpgrades: newPilotIndexToUpgrades,
               });
            case AgentSquadAction.SET_PILOT_UPGRADE:
               LOGGER.debug("SET_PILOT_UPGRADE pilotIndex = " + action.pilotIndex + " upgrade = " + (action.upgrade ? action.upgrade.key : undefined) + " upgradeIndex = " + action.upgradeIndex);
               newUpgrades = state.pilotIndexToUpgrades.get(action.pilotIndex);
               newUpgrades = newUpgrades.set(action.upgradeIndex, action.upgrade);
               newPilotIndexToUpgrades = state.pilotIndexToUpgrades.set(action.pilotIndex, newUpgrades);
               return Object.assign(
               {}, state,
               {
                  displayItem: action.upgrade,
                  pilotIndexToUpgrades: newPilotIndexToUpgrades,
               });
            case AgentSquadAction.SET_SHIP:
               LOGGER.debug("SET_SHIP ship = " + action.ship + " " + (action.ship ? action.ship.key : undefined) + " index = " + action.index);
               newShips = state.ships.set(action.index, action.ship);
               return Object.assign(
               {}, state,
               {
                  displayItem: action.ship,
                  ships: newShips,
               });
            case AgentSquadAction.SET_SQUAD:
               LOGGER.debug("SET_SQUAD squad = " + action.squad);
               return Object.assign(
               {}, state,
               {
                  squad: action.squad,
               });

            default:
               LOGGER.warn("AgentSquadReducer.root: Unhandled action type: " + action.type);
               return state;
         }
      };

      if (Object.freeze)
      {
         Object.freeze(AgentSquadReducer);
      }

      return AgentSquadReducer;
   });
