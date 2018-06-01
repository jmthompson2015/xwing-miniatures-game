/*
 * Provides pilot abilities for Events.
 */
import InputValidator from "../utility/InputValidator.js";

import AttackDiceValue from "../artifact/AttackDiceValue.js";
import Difficulty from "../artifact/Difficulty.js";
import Event from "../artifact/Event.js";
import Maneuver from "../artifact/Maneuver.js";
import PilotCard from "../artifact/PilotCard.js";
import ShipAction from "../artifact/ShipAction.js";

import Ability from "./Ability.js";
import ActivationAction from "./ActivationAction.js";
import AttackDice from "./AttackDice.js";
import CardAction from "./CardAction.js";
import Selector from "./Selector.js";
import ShipActionAbility from "./ShipActionAbility.js";

var PilotAbility0 = {};

////////////////////////////////////////////////////////////////////////
PilotAbility0[Event.AFTER_EXECUTE_MANEUVER] = {};

PilotAbility0[Event.AFTER_EXECUTE_MANEUVER][PilotCard.CAPTAIN_OICUNN] = {
   // After executing a maneuver, each enemy ship you are touching suffers 1 damage.
   condition: function(store, pilotInstance)
   {
      var pilotInstances = pilotInstance.unfriendlyPilotInstancesTouching();
      return isEventToken(store, pilotInstance) && pilotInstances.length > 0;
   },
   consequent: function(store, pilotInstance, callback)
   {
      var pilotInstances = pilotInstance.unfriendlyPilotInstancesTouching();
      pilotInstances.forEach(function(pilotInstance)
      {
         pilotInstance.sufferDamage(1, 0);
      });
      callback();
   },
};

PilotAbility0[Event.AFTER_EXECUTE_MANEUVER][PilotCard.NIGHT_BEAST] = {
   // After executing a green maneuver, you may perform a free focus action.
   condition: function(store, token)
   {
      var maneuver = getManeuver(token);
      return isEventToken(store, token) && maneuver !== undefined && maneuver.difficultyKey === Difficulty.EASY;
   },
   consequent: function(store, token, callback)
   {
      var ability = new Ability(ShipAction, ShipAction.FOCUS, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
      ability.consequent(store, token, callback);
   },
};

////////////////////////////////////////////////////////////////////////
PilotAbility0[Event.RECEIVE_STRESS] = {};

PilotAbility0[Event.RECEIVE_STRESS][PilotCard.JEK_PORKINS] = {
   // When you receive a stress token, you may remove it and roll 1 attack die. On a Hit result, deal 1 facedown Damage card to this ship.
   condition: function(store, token)
   {
      return isEventToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      var environment = getEnvironment(store);
      token.removeStress();
      if (AttackDice.rollRandomValue() === AttackDiceValue.HIT)
      {
         token.receiveDamage(environment.drawDamage());
      }
      callback();
   },
};

PilotAbility0[Event.RECEIVE_STRESS][PilotCard.SOONTIR_FEL] = {
   // When you receive a stress token, you may assign 1 focus token to your ship.
   condition: function(store, token)
   {
      return isEventToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      token.receiveFocus(1, callback);
   },
};

////////////////////////////////////////////////////////////////////////
PilotAbility0[Event.REMOVE_SHIELD] = {};

PilotAbility0[Event.REMOVE_SHIELD][PilotCard.RED_ACE] = {
   // The first time you remove a shield token from your ship each round, assign 1 evade token to your ship.
   condition: function(store, token)
   {
      var pilotKey = PilotCard.RED_ACE;
      return isEventToken(store, token) && !token.isPerRoundAbilityUsed(PilotCard, pilotKey);
   },
   consequent: function(store, token, callback)
   {
      store.dispatch(CardAction.addEvadeCount(token));
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
function getActivationAction(token)
{
   InputValidator.validateNotNull("token", token);

   var store = token.store();

   return ActivationAction.get(store, token.id());
}

function getEventData(store)
{
   InputValidator.validateNotNull("store", store);

   return store.getState().eventData;
}

function getEventToken(store)
{
   InputValidator.validateNotNull("store", store);

   var eventData = getEventData(store);

   return (eventData !== undefined ? eventData.get("eventToken") : undefined);
}

function getEnvironment(store)
{
   InputValidator.validateNotNull("store", store);

   return Selector.environment(store.getState());
}

function getManeuver(token)
{
   InputValidator.validateNotNull("token", token);

   var maneuverKey = getManeuverKey(token);
   return Maneuver.properties[maneuverKey];
}

function getManeuverKey(token)
{
   InputValidator.validateNotNull("token", token);

   var answer;
   var activationAction = getActivationAction(token);

   if (activationAction)
   {
      answer = activationAction.maneuverKey();
   }

   return answer;
}

function isEventToken(store, token)
{
   var eventToken = getEventToken(store);

   return token.equals(eventToken);
}

PilotAbility0.toString = function()
{
   return "model/PilotAbility0";
};

if (Object.freeze)
{
   Object.freeze(PilotAbility0);
}

export default PilotAbility0;