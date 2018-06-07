/*
 * Provides upgrade abilities for Events.
 */
import InputValidator from "../utility/InputValidator.js";

import AttackDiceValue from "../artifact/AttackDiceValue.js";
import Difficulty from "../artifact/Difficulty.js";
import Event from "../artifact/Event.js";
import Faction from "../artifact/Faction.js";
import Maneuver from "../artifact/Maneuver.js";
import ShipAction from "../artifact/ShipAction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Ability from "./Ability.js";
import ActivationAction from "./ActivationAction.js";
import AttackDice from "./AttackDice.js";
import CardAction from "./CardAction.js";
import EnvironmentAction from "./EnvironmentAction.js";
import ShipActionAbility from "./ShipActionAbility.js";

const UpgradeAbility0 = {};

////////////////////////////////////////////////////////////////////////
UpgradeAbility0[Event.AFTER_EXECUTE_MANEUVER] = {};

UpgradeAbility0[Event.AFTER_EXECUTE_MANEUVER][UpgradeCard.ION_PROJECTOR] = {
   // After an enemy ship executes a maneuver that causes it to overlap your ship, roll 1 attack die. On a HIT or CRITICAL HIT result, the enemy ship receives 1 ion token.
   condition: function(store, pilotInstance)
   {
      const toucher = getActiveCardInstance(store);
      const isEnemy = (toucher !== undefined ? !Faction.isFriendly(toucher.card().shipFaction.factionKey, pilotInstance.card().shipFaction.factionKey) : false);
      const isTouching = (toucher !== undefined ? toucher.isTouching(pilotInstance) : false);
      return isEnemy && isTouching;
   },
   consequent: function(store, pilotInstance, callback)
   {
      if ([AttackDiceValue.HIT, AttackDiceValue.CRITICAL_HIT].includes(AttackDice.rollRandomValue()))
      {
         const enemy = getActiveCardInstance(store);
         store.dispatch(CardAction.addIonCount(enemy));
      }
      callback();
   },
};

UpgradeAbility0[Event.AFTER_EXECUTE_MANEUVER][UpgradeCard.K4_SECURITY_DROID] = {
   // After executing a green maneuver, you may acquire a Target Lock.
   condition: function(store, token)
   {
      const maneuver = getManeuver(token);
      const environment = store.getState().environment;
      const defenders = environment.getDefendersInRange(token);
      return isEventToken(store, token) && maneuver !== undefined && maneuver.difficultyKey === Difficulty.EASY && defenders !== undefined && defenders.length > 0;
   },
   consequent: function(store, token, callback)
   {
      const agent = token.agent();
      const shipActionKeys0 = [ShipAction.TARGET_LOCK];
      const that = this;
      const finishCallback = function(shipActionAbility)
      {
         that.finishConsequent(store, token, shipActionAbility, callback);
      };
      agent.getShipAction(token, finishCallback, shipActionKeys0);

      // Wait for agent to respond.
   },
   finishConsequent: function(store, token, shipActionAbility, callback)
   {
      if (shipActionAbility)
      {
         const consequent = shipActionAbility.consequent();
         consequent(store, token, callback, shipActionAbility.context());
      }
      else
      {
         callback();
      }
   },
};

UpgradeAbility0[Event.AFTER_EXECUTE_MANEUVER][UpgradeCard.OUTLAW_TECH] = {
   // After you execute a red maneuver, you may assign 1 Focus token to your ship.
   condition: function(store, token)
   {
      const maneuver = getManeuver(token);
      return isEventToken(store, token) && maneuver !== undefined && maneuver.difficultyKey === Difficulty.HARD;
   },
   consequent: function(store, token, callback)
   {
      token.receiveFocus(1, callback);
   },
};

UpgradeAbility0[Event.AFTER_EXECUTE_MANEUVER][UpgradeCard.R2_D2_ASTROMECH] = {
   // After executing a green maneuver, you may recover 1 shield (up to your shield value).
   condition: function(store, token)
   {
      const maneuver = getManeuver(token);
      return isEventToken(store, token) && maneuver !== undefined && maneuver.difficultyKey === Difficulty.EASY;
   },
   consequent: function(store, token, callback)
   {
      token.recoverShield();
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility0[Event.RECEIVE_CRITICAL_DAMAGE] = {};

UpgradeAbility0[Event.RECEIVE_CRITICAL_DAMAGE][UpgradeCard.CHEWBACCA] = {
   // When you are dealt a Damage card, you may immediately discard that card and recover 1 shield. Then, discard this Upgrade card.
   condition: function(store, token)
   {
      return isEventToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      const criticalDamages = token.criticalDamages();
      const damageInstance = criticalDamages[criticalDamages.length - 1];
      store.dispatch(EnvironmentAction.discardDamage(damageInstance));
      token.recoverShield();
      const upgradeInstance = token.upgrade(UpgradeCard.CHEWBACCA);
      token.discardUpgrade(upgradeInstance);
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility0[Event.RECEIVE_DAMAGE] = {};

UpgradeAbility0[Event.RECEIVE_DAMAGE][UpgradeCard.CHEWBACCA] = {
   // When you are dealt a Damage card, you may immediately discard that card and recover 1 shield. Then, discard this Upgrade card.
   condition: function(store, token)
   {
      return isEventToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      const criticalDamages = token.criticalDamages();
      const damageInstance = criticalDamages[criticalDamages.length - 1];
      store.dispatch(EnvironmentAction.discardDamage(damageInstance));
      token.recoverShield();
      const upgradeInstance = token.upgrade(UpgradeCard.CHEWBACCA);
      token.discardUpgrade(upgradeInstance);
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility0[Event.RECEIVE_FOCUS] = {};

UpgradeAbility0[Event.RECEIVE_FOCUS][UpgradeCard.ATTANNI_MINDLINK] = {
   // Each time you are assigned a focus or stress token, each other friendly ship with Attanni Mindlink must also be assigned the same type of token if it does not already have one.
   condition: function(store, token)
   {
      return isEventToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      const agent = token.agent();
      agent.pilotInstances().forEach(function(pilotInstance)
      {
         if (pilotInstance.id() !== token.id() && pilotInstance.focusCount() === 0)
         {
            // Don't send another event.
            store.dispatch(CardAction.addFocusCount(pilotInstance));
         }
      });
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility0[Event.RECEIVE_STRESS] = {};

UpgradeAbility0[Event.RECEIVE_STRESS][UpgradeCard.ATTANNI_MINDLINK] = {
   // Each time you are assigned a focus or stress token, each other friendly ship with Attanni Mindlink must also be assigned the same type of token if it does not already have one.
   condition: function(store, token)
   {
      return isEventToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      const agent = token.agent();
      agent.pilotInstances().forEach(function(pilotInstance)
      {
         if (pilotInstance.id() !== token.id() && pilotInstance.stressCount() === 0)
         {
            // Don't send another event.
            store.dispatch(CardAction.addStressCount(pilotInstance));
         }
      });
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility0[Event.REMOVE_STRESS] = {};

UpgradeAbility0[Event.REMOVE_STRESS][UpgradeCard.KYLE_KATARN] = {
   // After you remove a stress token from your ship, you may assign a Focus token to your ship.
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
UpgradeAbility0[Event.SHIP_ACTION_PERFORMED] = {};

UpgradeAbility0[Event.SHIP_ACTION_PERFORMED][UpgradeCard.PUSH_THE_LIMIT] = {
   // Once per round, after you perform an action, you may perform 1 free action shown in your action bar. Then receive 1 stress token.
   condition: function(store, token)
   {
      const isUsed = token.isAbilityUsed(UpgradeCard, UpgradeCard.PUSH_THE_LIMIT);
      const adjudicator = store.getState().adjudicator;
      const canSelectShipAction = adjudicator.canSelectShipAction(token);
      return isEventToken(store, token) && !isUsed && canSelectShipAction;
   },
   consequent: function(store, token, callback)
   {
      const agent = token.agent();
      const shipActionKeys0 = token.ship().shipActionKeys;
      const that = this;
      const finishCallback = function(shipActionAbility)
      {
         that.finishConsequent(store, token, shipActionAbility, callback);
      };
      agent.getShipAction(token, finishCallback, shipActionKeys0);

      // Wait for agent to respond.
   },
   finishConsequent: function(store, token, shipActionAbility, callback)
   {
      if (shipActionAbility)
      {
         token.receiveStress();
         const consequent = shipActionAbility.consequent();
         consequent(store, token, callback, shipActionAbility.context());
      }
      else
      {
         callback();
      }
   },
};

UpgradeAbility0[Event.SHIP_ACTION_PERFORMED][UpgradeCard.RECON_SPECIALIST] = {
   // When you perform a Focus action, assign 1 additional Focus token to your ship.
   condition: function(store, token)
   {
      const eventShipActionKey = getEventShipActionKey(store);
      return isEventToken(store, token) && eventShipActionKey === ShipAction.FOCUS;
   },
   consequent: function(store, token, callback)
   {
      token.receiveFocus(1, callback);
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility0[Event.TARGET_LOCK_ACQUIRED] = {};

UpgradeAbility0[Event.TARGET_LOCK_ACQUIRED][UpgradeCard.TIE_V1] = {
   // After you acquire a target lock, you may perform a free evade action.
   condition: function(store, token)
   {
      return isEventToken(store, token);
   },
   consequent: function(store, token, callback)
   {
      const ability = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
      ability.consequent(store, token, callback);
   },
};

////////////////////////////////////////////////////////////////////////
function getActivationAction(token)
{
   InputValidator.validateNotNull("token", token);

   return ActivationAction.get(token.store(), token.id());
}

function getActiveCardInstance(store)
{
   InputValidator.validateNotNull("store", store);

   const environment = store.getState().environment;

   return environment.activeCardInstance();
}

function getEventContext(store)
{
   InputValidator.validateNotNull("store", store);

   const eventData = getEventData(store);

   return (eventData !== undefined ? eventData.get("eventContext") : undefined);
}

function getEventData(store)
{
   InputValidator.validateNotNull("store", store);

   return store.getState().eventData;
}

function getEventShipActionKey(store)
{
   InputValidator.validateNotNull("store", store);

   let answer;
   const eventContext = getEventContext(store);

   if (eventContext)
   {
      answer = eventContext.shipActionKey;
   }

   return answer;
}

function getEventToken(store)
{
   InputValidator.validateNotNull("store", store);

   const eventData = getEventData(store);

   return (eventData !== undefined ? eventData.get("eventToken") : undefined);
}

function getManeuver(token)
{
   InputValidator.validateNotNull("token", token);

   const maneuverKey = getManeuverKey(token);
   return Maneuver.properties[maneuverKey];
}

function getManeuverKey(token)
{
   InputValidator.validateNotNull("token", token);

   let answer;
   const activationAction = getActivationAction(token);

   if (activationAction)
   {
      answer = activationAction.maneuverKey();
   }

   return answer;
}

function isEventToken(store, token)
{
   const eventToken = getEventToken(store);

   return token.equals(eventToken);
}

UpgradeAbility0.toString = function()
{
   return "model/UpgradeAbility0";
};

if (Object.freeze)
{
   Object.freeze(UpgradeAbility0);
}

export default UpgradeAbility0;