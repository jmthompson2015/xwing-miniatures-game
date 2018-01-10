"use strict";

define(["immutable", "common/js/ArrayUtilities", "common/js/InputValidator", "artifact/js/Event", "artifact/js/Phase",
  "model/js/Action", "model/js/AgentAction", "model/js/AgentReducer", "model/js/CardAction", "model/js/CardReducer", "model/js/EnvironmentAction", "model/js/EnvironmentReducer", "model/js/InitialState"],
   function(Immutable, ArrayUtilities, InputValidator, Event, Phase,
      Action, AgentAction, AgentReducer, CardAction, CardReducer, EnvironmentAction, EnvironmentReducer, InitialState)
   {
      var Reducer = {};

      Reducer.targetLocks = function(state, action)
      {
         LOGGER.debug("targetLocks() type = " + action.type);

         var newTargetLocks;

         switch (action.type)
         {
            case Action.ADD_TARGET_LOCK:
               newTargetLocks = state.push(action.targetLock);
               return newTargetLocks;
            case Action.REMOVE_TARGET_LOCK:
               var index = state.indexOf(action.targetLock);
               newTargetLocks = (index >= 0 ? state.delete(index) : state);
               return newTargetLocks;
            default:
               LOGGER.warn("Reducer.targetLocks: Unhandled action type: " + action.type);
               return state;
         }
      };

      Reducer.tokenIdToArray = function(state, actionType, actionTokenId, actionData)
      {
         InputValidator.validateNotNull("state", state);
         InputValidator.validateNotNull("actionType", actionType);
         InputValidator.validateIsNumber("actionTokenId", actionTokenId);
         // actionData optional.

         LOGGER.debug("Reducer.tokenIdToArray() type = " + actionType);

         var newTokenIdToArray, newArray, oldArray;

         if (actionType.startsWith("add"))
         {
            oldArray = state[actionTokenId];
            newArray = oldArray.slice();
            newArray.push(actionData);
            newTokenIdToArray = Object.assign(
            {}, state);
            newTokenIdToArray[actionTokenId] = newArray;
            return newTokenIdToArray;
         }
         else if (actionType.startsWith("clear"))
         {
            newTokenIdToArray = Object.assign(
            {}, state);
            newTokenIdToArray[actionTokenId] = [];
            return newTokenIdToArray;
         }
         else if (actionType.startsWith("remove"))
         {
            oldArray = state[actionTokenId];
            newArray = oldArray.slice();
            ArrayUtilities.remove(newArray, actionData);
            newTokenIdToArray = Object.assign(
            {}, state);
            newTokenIdToArray[actionTokenId] = newArray;
            return newTokenIdToArray;
         }
         else
         {
            LOGGER.warn("Reducer.tokenIdToArray: Unhandled action type: " + actionType);
            return state;
         }
      };

      Reducer.tokenIdToData = function(state, type, actionType, actionTokenId, actionData)
      {
         LOGGER.debug("tokenIdToData() type = " + actionType);

         switch (actionType)
         {
            case type:
               return state.set(actionTokenId, actionData);
            default:
               LOGGER.warn("Reducer.tokenIdToData: Unhandled action type: " + actionType);
               return state;
         }
      };

      Reducer.root = function(state, action)
      {
         LOGGER.debug("root() type = " + action.type);

         if (typeof state === 'undefined')
         {
            return new InitialState();
         }

         var newEventData, newEventQueue, newPhaseData, newPhaseQueue, newTokenIdToData, newTokenIdToValues;

         if (isAgentAction(action))
         {
            return AgentReducer.reduce(state, action);
         }
         else if (isCardAction(action))
         {
            return CardReducer.reduce(state, action);
         }
         else if (isEnvironmentAction(action))
         {
            return EnvironmentReducer.reduce(state, action);
         }
         else
         {
            switch (action.type)
            {
               case Action.ADD_AGENT:
                  return Object.assign(
                  {}, state,
                  {
                     agents: state.agents.set(action.id, action.values),
                  });
               case Action.ADD_PILOT_TO_MANEUVER:
                  return Object.assign(
                  {}, state,
                  {
                     pilotToManeuver: state.pilotToManeuver.merge(action.pilotToManeuver),
                  });
               case Action.ADD_TARGET_LOCK:
               case Action.REMOVE_TARGET_LOCK:
                  return Object.assign(
                  {}, state,
                  {
                     targetLocks: Reducer.targetLocks(state.targetLocks, action),
                  });
               case Action.CLEAR_EVENT:
                  // LOGGER.info("Event: (cleared)");
                  return Object.assign(
                  {}, state,
                  {
                     eventData: undefined,
                  });
               case Action.CLEAR_PHASE:
                  // LOGGER.info("Phase: (cleared)");
                  return Object.assign(
                  {}, state,
                  {
                     phaseData: undefined,
                  });
               case Action.CLEAR_PILOT_TO_MANEUVER:
                  return Object.assign(
                  {}, state,
                  {
                     pilotToManeuver: Immutable.Map(),
                  });
               case Action.DEQUEUE_EVENT:
                  // LOGGER.info("EventQueue: (dequeue)");
                  newEventData = state.eventQueue.first();
                  newEventQueue = state.eventQueue.shift();
                  return Object.assign(
                  {}, state,
                  {
                     eventData: newEventData,
                     eventQueue: newEventQueue,
                  });
               case Action.DEQUEUE_PHASE:
                  // LOGGER.info("PhaseQueue: (dequeue)");
                  newPhaseData = state.phaseQueue.first();
                  newPhaseQueue = state.phaseQueue.shift();
                  return Object.assign(
                  {}, state,
                  {
                     phaseData: newPhaseData,
                     phaseKey: newPhaseData.get("phaseKey"),
                     phaseQueue: newPhaseQueue,
                  });
               case Action.ENQUEUE_EVENT:
                  LOGGER.info("EventQueue: " + Event.properties[action.eventKey].name + ", token = " + action.eventToken + ", context = " + JSON.stringify(action.eventContext));
                  newEventData = createEventData(action.eventKey, action.eventToken, action.eventCallback, action.eventContext);
                  newEventQueue = state.eventQueue.push(newEventData);
                  return Object.assign(
                  {}, state,
                  {
                     eventQueue: newEventQueue,
                  });
               case Action.ENQUEUE_PHASE:
                  LOGGER.info("PhaseQueue: " + Phase.properties[action.phaseKey].name + ", token = " + action.phaseToken + ", callback " + (action.phaseCallback === undefined ? " === undefined" : " !== undefined") + ", context = " + JSON.stringify(action.phaseContext));
                  newPhaseData = createPhaseData(action.phaseKey, action.phaseToken, action.phaseCallback, action.phaseContext);
                  newPhaseQueue = state.phaseQueue.push(newPhaseData);
                  return Object.assign(
                  {}, state,
                  {
                     phaseQueue: newPhaseQueue,
                  });
               case Action.INCREMENT_NEXT_TARGET_LOCK_ID:
                  var newNextTargetLockId = state.nextTargetLockId + 1;
                  if (newNextTargetLockId > 51)
                  {
                     newNextTargetLockId = 0;
                  }
                  return Object.assign(
                  {}, state,
                  {
                     nextTargetLockId: newNextTargetLockId,
                  });
               case Action.SET_ADJUDICATOR:
                  return Object.assign(
                  {}, state,
                  {
                     adjudicator: action.adjudicator,
                  });
               case Action.SET_DELAY:
                  return Object.assign(
                  {}, state,
                  {
                     delay: action.delay,
                  });
               case Action.SET_ENVIRONMENT:
                  return Object.assign(
                  {}, state,
                  {
                     environment: action.environment,
                  });
               case Action.SET_GAME_OVER:
                  return Object.assign(
                  {}, state,
                  {
                     isGameOver: true,
                     winner: action.winner,
                  });
                  //  case Action.SET_PHASE:
                  //     LOGGER.info("Phase: " + Phase.properties[action.phaseKey].name);
                  //     return Object.assign(
                  //     {}, state,
                  //     {
                  //        phaseKey: action.phaseKey,
                  //     });
               case Action.SET_RESOURCE_BASE:
                  return Object.assign(
                  {}, state,
                  {
                     resourceBase: action.resourceBase,
                  });
               case Action.SET_TOKEN_ACTIVATION_ACTION:
                  newTokenIdToData = Reducer.tokenIdToData(state.cardActivationAction, Action.SET_TOKEN_ACTIVATION_ACTION, action.type, action.tokenId, action.activationActionValues);
                  return Object.assign(
                  {}, state,
                  {
                     cardActivationAction: newTokenIdToData,
                  });
               case Action.SET_TOKEN_ATTACK_DICE:
                  // LOGGER.info("Reducer.root() SET_TOKEN_ATTACK_DICE action.tokenId = " + action.tokenId + " action.attackDiceValues = " + action.attackDiceValues);
                  newTokenIdToData = Reducer.tokenIdToData(state.cardAttackDice, Action.SET_TOKEN_ATTACK_DICE, action.type, action.tokenId, action.attackDiceValues);
                  return Object.assign(
                  {}, state,
                  {
                     cardAttackDice: newTokenIdToData,
                  });
               case Action.SET_TOKEN_COMBAT_ACTION:
                  newTokenIdToData = Reducer.tokenIdToData(state.cardCombatAction, Action.SET_TOKEN_COMBAT_ACTION, action.type, action.token.id(), action.combatAction);
                  return Object.assign(
                  {}, state,
                  {
                     cardCombatAction: newTokenIdToData,
                  });
               case Action.SET_TOKEN_DAMAGE_DEALER:
                  newTokenIdToData = Reducer.tokenIdToData(state.cardDamageDealer, Action.SET_TOKEN_DAMAGE_DEALER, action.type, action.token.id(), action.damageDealer);
                  return Object.assign(
                  {}, state,
                  {
                     cardDamageDealer: newTokenIdToData,
                  });
               case Action.SET_TOKEN_DEFENDER_HIT:
                  newTokenIdToData = Reducer.tokenIdToData(state.cardIsDefenderHit, Action.SET_TOKEN_DEFENDER_HIT, action.type, action.token.id(), action.isDefenderHit);
                  return Object.assign(
                  {}, state,
                  {
                     cardIsDefenderHit: newTokenIdToData,
                  });
               case Action.SET_TOKEN_DEFENSE_DICE:
                  newTokenIdToData = Reducer.tokenIdToData(state.cardDefenseDice, Action.SET_TOKEN_DEFENSE_DICE, action.type, action.tokenId, action.defenseDiceValues);
                  return Object.assign(
                  {}, state,
                  {
                     cardDefenseDice: newTokenIdToData,
                  });
               case Action.SET_TOKEN_IN_FIRING_ARC:
                  newTokenIdToData = Reducer.tokenIdToData(state.cardIsInFiringArc, Action.SET_TOKEN_IN_FIRING_ARC, action.type, action.token.id(), action.isInFiringArc);
                  return Object.assign(
                  {}, state,
                  {
                     cardIsInFiringArc: newTokenIdToData,
                  });
               case Action.SET_TOKEN_MANEUVER:
                  newTokenIdToData = Reducer.tokenIdToData(state.cardManeuver, Action.SET_TOKEN_MANEUVER, action.type, action.token.id(), action.maneuver);
                  return Object.assign(
                  {}, state,
                  {
                     cardManeuver: newTokenIdToData,
                  });
               case Action.SET_TOKEN_MANEUVER_ACTION:
                  newTokenIdToData = Reducer.tokenIdToData(state.cardManeuverAction, Action.SET_TOKEN_MANEUVER_ACTION, action.type, action.tokenId, action.maneuverActionValues);
                  return Object.assign(
                  {}, state,
                  {
                     cardManeuverAction: newTokenIdToData,
                  });
               case Action.SET_TOKEN_RANGE:
                  newTokenIdToData = Reducer.tokenIdToData(state.cardRange, Action.SET_TOKEN_RANGE, action.type, action.token.id(), action.rangeKey);
                  return Object.assign(
                  {}, state,
                  {
                     cardRange: newTokenIdToData,
                  });
               case Action.SET_USER_MESSAGE:
                  return Object.assign(
                  {}, state,
                  {
                     userMessage: action.userMessage,
                  });
               case Action.SET_VALUE:
                  newTokenIdToValues = Reducer.tokenIdToValues(state.tokenIdToValues, action);
                  return Object.assign(
                  {}, state,
                  {
                     tokenIdToValues: newTokenIdToValues,
                  });
               default:
                  LOGGER.warn("Reducer.root: Unhandled action type: " + action.type);
                  return state;
            }
         }
      };

      function createEventData(eventKey, eventToken, eventCallback, eventContext)
      {
         InputValidator.validateNotNull("eventKey", eventKey);
         InputValidator.validateNotNull("eventToken", eventToken);
         // eventCallback optional.
         // eventContext optional.

         return Immutable.Map(
         {
            eventKey: eventKey,
            eventToken: eventToken,
            eventCallback: eventCallback,
            eventContext: eventContext,
         });
      }

      function createPhaseData(phaseKey, phaseToken, phaseCallback, phaseContext)
      {
         InputValidator.validateNotNull("phaseKey", phaseKey);
         // phaseToken optional.
         // phaseCallback optional.
         // phaseContext optional.

         return Immutable.Map(
         {
            phaseKey: phaseKey,
            phaseToken: phaseToken,
            phaseCallback: phaseCallback,
            phaseContext: phaseContext,
         });
      }

      function isAgentAction(action)
      {
         return AgentAction[action.type] !== undefined;
      }

      function isCardAction(action)
      {
         return CardAction[action.type] !== undefined;
      }

      function isEnvironmentAction(action)
      {
         return EnvironmentAction[action.type] !== undefined;
      }

      if (Object.freeze)
      {
         Object.freeze(Reducer);
      }

      return Reducer;
   });
