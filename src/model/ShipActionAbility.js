/*
 * Provides ship action abilities.
 */
import InputValidator from "../utility/InputValidator.js";

import Event from "../artifact/Event.js";
import ShipAction from "../artifact/ShipAction.js";

import Action from "./Action.js";
import CardAction from "./CardAction.js";
import ManeuverAction from "./ManeuverAction.js";
import TargetLock from "./TargetLock.js";

const ShipActionAbility = {};

ShipActionAbility.ABILITY_KEY = "shipAction";

////////////////////////////////////////////////////////////////////////
ShipActionAbility[ShipActionAbility.ABILITY_KEY] = {};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.BARREL_ROLL] = {
   // Perform the barrel roll action to move laterally and adjust their position.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, token, callback, context)
   {
      const maneuverKey = context.maneuverKey;
      const maneuverAction = new ManeuverAction(store, token.id(), maneuverKey);
      maneuverAction.doIt();
      notifyEvent(store, token, callback, ShipAction.BARREL_ROLL);
   },
};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.BOOST] = {
   // Perform the boost action to adjust their position.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, token, callback, context)
   {
      const maneuverKey = context.maneuverKey;
      const maneuverAction = new ManeuverAction(store, token.id(), maneuverKey);
      maneuverAction.doIt();
      notifyEvent(store, token, callback, ShipAction.BOOST);
   },
};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.CLOAK] = {
   // Assign one cloak token to that ship.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      store.dispatch(CardAction.addCloakCount(token));
      notifyEvent(store, token, callback, ShipAction.CLOAK);
   },
};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.COORDINATE] = {
   // Choose another friendly ship at Range 1-2. That ship may immediately perform one free action.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      LOGGER.warn("ShipActionAbility Coordinate not yet implemented.");
      notifyEvent(store, token, callback, ShipAction.COORDINATE);
   },
};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.DECLOAK] = {
   // Spend a cloak token to decloak.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, token, callback, context)
   {
      const maneuverKey = context.maneuverKey;
      const maneuverAction = new ManeuverAction(store, token.id(), maneuverKey);
      maneuverAction.doIt();
      store.dispatch(CardAction.addCloakCount(token, -1));
      notifyEvent(store, token, callback, ShipAction.DECLOAK);
   },
};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.EVADE] = {
   // Assign one evade token to the ship.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      store.dispatch(CardAction.addEvadeCount(token));
      notifyEvent(store, token, callback, ShipAction.EVADE);
   },
};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.FOCUS] = {
   // Assign one focus token to the ship.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      token.receiveFocus();
      notifyEvent(store, token, callback, ShipAction.FOCUS);
   },
};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.JAM] = {
   // Choose one enemy ship at Range 1-2 and assign Stress tokens until the ship has 2 total stress tokens.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, token, callback, context)
   {
      const defender = context.defender;
      if (defender.stressCount() < 2)
      {
         defender.receiveStress();
      }
      if (defender.stressCount() < 2)
      {
         defender.receiveStress();
      }
      notifyEvent(store, token, callback, ShipAction.JAM);
   },
};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.RECOVER] = {
   // Remove all energy tokens from the corresponding ship card. For each energy token removed, the ship recovers one shield, up to its maximum shield value.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      LOGGER.warn("ShipActionAbility Recover not yet implemented.");
      notifyEvent(store, token, callback, ShipAction.RECOVER);
   },
};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.REINFORCE] = {
   // Choose either the fore or aft side of a double-sided reinforce token and place the token with that side faceup near its ship token.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      store.dispatch(CardAction.addReinforceCount(token));
      notifyEvent(store, token, callback, ShipAction.REINFORCE);
   },
};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.SLAM] = {
   // Perform a SLAM (SubLight Acceleration Motor) action.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, token, callback, context)
   {
      const maneuverKey = context.maneuverKey;
      const maneuverAction = new ManeuverAction(store, token.id(), maneuverKey);
      maneuverAction.doIt();
      store.dispatch(CardAction.addWeaponsDisabledCount(token));
      notifyEvent(store, token, callback, ShipAction.SLAM);
   },
};

ShipActionAbility[ShipActionAbility.ABILITY_KEY][ShipAction.TARGET_LOCK] = {
   // Acquire a target lock on an enemy ship.
   condition: function(store, token)
   {
      return isActiveToken(store, token);
   },
   consequent: function(store, attacker, callback, context)
   {
      const oldTargetLocks = TargetLock.getByAttacker(store, attacker);
      if (oldTargetLocks.length > 0)
      {
         oldTargetLocks[0].delete();
      }
      const defender = context.defender;
      TargetLock.newInstance(store, attacker, defender);
      notifyEvent(store, attacker, callback, ShipAction.TARGET_LOCK);
   },
};

////////////////////////////////////////////////////////////////////////
function getActiveToken(store)
{
   InputValidator.validateNotNull("store", store);

   const environment = store.getState().environment;

   return environment.activeCardInstance();
}

function isActiveToken(store, token)
{
   const activeToken = getActiveToken(store);

   return token.equals(activeToken);
}

ShipActionAbility.toString = function()
{
   return "model/ShipActionAbility";
};

function notifyEvent(store, eventToken, eventCallback, shipActionKey)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("eventToken", eventToken);
   InputValidator.validateNotNull("eventCallback", eventCallback);
   InputValidator.validateNotNull("shipActionKey", shipActionKey);

   // Issue event.
   const eventKey = Event.SHIP_ACTION_PERFORMED;
   const eventContext = {
      shipActionKey: shipActionKey,
   };
   store.dispatch(Action.enqueueEvent(eventKey, eventToken, eventCallback, eventContext));
}

if (Object.freeze)
{
   Object.freeze(ShipActionAbility);
}

export default ShipActionAbility;