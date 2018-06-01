/*
 * Provides pilot abilities for the Activation Phase.
 */
import InputValidator from "../utility/InputValidator.js";

import Bearing from "../artifact/Bearing.js";
import Maneuver from "../artifact/Maneuver.js";
import Phase from "../artifact/Phase.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Action from "./Action.js";
import ActivationAction from "./ActivationAction.js";

var PilotAbility2 = {};

////////////////////////////////////////////////////////////////////////
PilotAbility2[Phase.ACTIVATION_REVEAL_DIAL] = {};

PilotAbility2[Phase.ACTIVATION_REVEAL_DIAL][PilotCard.COUNTESS_RYAD] = {
   // When you reveal a Straight maneuver, you may treat it as a K-Turn maneuver.
   condition: function(store, token)
   {
      var activeToken = getActiveCardInstance(store);
      var maneuver = getManeuver(activeToken);
      return isActiveCardInstance(store, token) && maneuver.bearingKey === Bearing.STRAIGHT;
   },
   consequent: function(store, token, callback)
   {
      var oldManeuver = getManeuver(token);
      var newManeuverKey = Maneuver.find(Bearing.KOIOGRAN_TURN, oldManeuver.speed, oldManeuver.difficultyKey);
      if (newManeuverKey === undefined)
      {
         throw "Can't find K-Turn maneuver for oldManeuver = " + oldManeuver.bearingKey + " " + oldManeuver.speed + " " + oldManeuver.difficultyKey;
      }
      var newManeuver = Maneuver.properties[newManeuverKey];
      store.dispatch(Action.setTokenManeuver(token, newManeuver));
      callback();
   },
};

PilotAbility2[Phase.ACTIVATION_REVEAL_DIAL][UpgradeCard.BOBA_FETT_IMPERIAL] = {
   // When you reveal a bank maneuver, you may rotate your dial to the other bank maneuver of the same speed.
   condition: function(store, token)
   {
      var activeToken = getActiveCardInstance(store);
      var maneuver = getManeuver(activeToken);
      return isActiveCardInstance(store, token) && [Bearing.BANK_LEFT, Bearing.BANK_RIGHT].includes(maneuver.bearingKey);
   },
   consequent: function(store, token, callback)
   {
      var oldManeuver = getManeuver(token);
      var newBearingKey;
      switch (oldManeuver.bearingKey)
      {
         case Bearing.BANK_LEFT:
            newBearingKey = Bearing.BANK_RIGHT;
            break;
         case Bearing.BANK_RIGHT:
            newBearingKey = Bearing.BANK_LEFT;
            break;
      }
      var newManeuverKey = findManeuverByBearingSpeed(token, newBearingKey, oldManeuver.speed);
      var newManeuver = Maneuver.properties[newManeuverKey];
      store.dispatch(Action.setTokenManeuver(token, newManeuver));
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
function findManeuverByBearingSpeed(token, bearing, speed)
{
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("bearing", bearing);
   InputValidator.validateNotNull("speed", speed);

   var answer;
   var maneuverKeys = token.card().shipFaction.ship.maneuverKeys;

   for (var i = 0; i < maneuverKeys.length; i++)
   {
      var maneuverKey = maneuverKeys[i];
      var maneuver = Maneuver.properties[maneuverKey];

      if (maneuver.bearingKey === bearing && maneuver.speed === speed)
      {
         answer = maneuverKey;
         break;
      }
   }

   return answer;
}

function getActivationAction(token)
{
   InputValidator.validateNotNull("token", token);

   return ActivationAction.get(token.store(), token.id());
}

function getActiveCardInstance(store)
{
   InputValidator.validateNotNull("store", store);

   var environment = store.getState().environment;

   return environment.activeCardInstance();
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

   var activationAction = getActivationAction(token);
   return (activationAction ? activationAction.maneuverKey() : undefined);
}

function isActiveCardInstance(store, token)
{
   var activeToken = getActiveCardInstance(store);

   return token.equals(activeToken);
}

PilotAbility2.toString = function()
{
   return "model/PilotAbility2";
};

if (Object.freeze)
{
   Object.freeze(PilotAbility2);
}

export default PilotAbility2;