/*
 * Provides upgrade abilities for the Activation Phase.
 */
import InputValidator from "../utility/InputValidator.js";

import Bearing from "../artifact/Bearing.js";
import Difficulty from "../artifact/Difficulty.js";
import Maneuver from "../artifact/Maneuver.js";
import Phase from "../artifact/Phase.js";
import ShipAction from "../artifact/ShipAction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Ability from "./Ability.js";
import Action from "./Action.js";
import ActivationAction from "./ActivationAction.js";
import CardAction from "./CardAction.js";
import DefenseDice from "./DefenseDice.js";
import ManeuverAction from "./ManeuverAction.js";
import Position from "./Position.js";
import ShipActionAbility from "./ShipActionAbility.js";
import TargetLock from "./TargetLock.js";

const UpgradeAbility2 = {};

////////////////////////////////////////////////////////////////////////
UpgradeAbility2[Phase.ACTIVATION_REVEAL_DIAL] = {};

UpgradeAbility2[Phase.ACTIVATION_REVEAL_DIAL][UpgradeCard.ADRENALINE_RUSH] = {
   // When you reveal a red maneuver, you may discard this card to treat that maneuver as a white maneuver until the end of the Activation phase.
   condition: function(store, token)
   {
      const maneuver = getManeuver(token);
      return isActiveCardInstance(store, token) && maneuver.difficultyKey === Difficulty.HARD;
   },
   consequent: function(store, token, callback)
   {
      const upgradeInstance = token.upgrade(UpgradeCard.ADRENALINE_RUSH);
      discardUpgrade(token, upgradeInstance);

      const oldManeuver = getManeuver(token);
      const newManeuverKey = Maneuver.find(oldManeuver.bearingKey, oldManeuver.speed, Difficulty.STANDARD);
      if (newManeuverKey === undefined)
      {
         throw "Can't find white maneuver for oldManeuver = " + oldManeuver;
      }
      const newManeuver = Maneuver.properties[newManeuverKey];
      store.dispatch(Action.setTokenManeuver(token, newManeuver));
      callback();
   },
};

UpgradeAbility2[Phase.ACTIVATION_REVEAL_DIAL][UpgradeCard.BB_8] = {
   // When you reveal a green maneuver, you may perform a free barrel roll action.
   condition: function(store, token)
   {
      const maneuver = getManeuver(token);
      return isActiveCardInstance(store, token) && maneuver.difficultyKey === Difficulty.EASY;
   },
   consequent: function(store, token, callback)
   {
      const agent = token.agent();
      const shipActions0 = [ShipAction.BARREL_ROLL];
      const that = this;
      const finishCallback = function(shipActionAbility)
      {
         that.finishConsequent(store, token, shipActionAbility, callback);
      };
      agent.getShipAction(token, finishCallback, shipActions0);

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

UpgradeAbility2[Phase.ACTIVATION_REVEAL_DIAL][UpgradeCard.INERTIAL_DAMPENERS] = {
   // When you reveal your maneuver, you may discard this card to instead perform a white Stationary 0 maneuver. Then receive 1 stress token.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isUpgradedWith(UpgradeCard.INERTIAL_DAMPENERS);
   },
   consequent: function(store, token, callback)
   {
      const upgradeInstance = token.upgrade(UpgradeCard.INERTIAL_DAMPENERS);
      discardUpgrade(token, upgradeInstance);

      const newManeuver = Maneuver.properties[Maneuver.STATIONARY_0_STANDARD];
      store.dispatch(Action.setTokenManeuver(token, newManeuver));
      token.receiveStress(1, callback);
   },
};

UpgradeAbility2[Phase.ACTIVATION_REVEAL_DIAL][UpgradeCard.MANEUVERING_FINS] = {
   // When you reveal a turn maneuver (left or right), you may rotate your dial to the corresponding bank maneuver (left or right) of the same speed.
   condition: function(store, token)
   {
      const maneuver = getManeuver(token);
      return isActiveCardInstance(store, token) && [Bearing.TURN_LEFT, Bearing.TURN_RIGHT].includes(maneuver.bearingKey);
   },
   consequent: function(store, token, callback)
   {
      const oldManeuver = getManeuver(token);
      let newBearingKey;
      switch (oldManeuver.bearingKey)
      {
         case Bearing.TURN_LEFT:
            newBearingKey = Bearing.BANK_LEFT;
            break;
         case Bearing.TURN_RIGHT:
            newBearingKey = Bearing.BANK_RIGHT;
            break;
      }
      const newManeuverKey = findManeuverByBearingSpeed(token, newBearingKey, oldManeuver.speed);
      const newManeuver = Maneuver.properties[newManeuverKey];
      store.dispatch(Action.setTokenManeuver(token, newManeuver));
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility2[Phase.ACTIVATION_CLEAN_UP] = {};

UpgradeAbility2[Phase.ACTIVATION_CLEAN_UP][UpgradeCard.LIGHTNING_REFLEXES] = {
   // After you execute a white or green maneuver on your dial, you may discard this card to rotate your ship 180˚. Then receive 1 stress token after the "Check Pilot Stress" step.
   condition: function(store, token)
   {
      const maneuver = getManeuver(token);
      const difficultyKey = (maneuver ? maneuver.difficultyKey : undefined);
      return isActiveCardInstance(store, token) && token.isUpgradedWith(UpgradeCard.LIGHTNING_REFLEXES) && [Difficulty.STANDARD, Difficulty.EASY].includes(difficultyKey);
   },
   consequent: function(store, token, callback)
   {
      const upgradeInstance = token.upgrade(UpgradeCard.LIGHTNING_REFLEXES);
      discardUpgrade(token, upgradeInstance);

      const environment = store.getState().environment;
      const fromPosition = environment.getPositionFor(token);
      const toPosition = new Position(fromPosition.x(), fromPosition.y(), fromPosition.heading() + 180);
      environment.moveToken(fromPosition, toPosition);
      token.receiveStress(1, callback);
   },
};

UpgradeAbility2[Phase.ACTIVATION_CLEAN_UP][UpgradeCard.TARGETING_ASTROMECH] = {
   // After you execute a red maneuver, you may acquire a target lock.
   condition: function(store, token)
   {
      const maneuver = getManeuver(token);
      const environment = store.getState().environment;
      const defenders = environment.getDefendersInRange(token);
      return isActiveCardInstance(store, token) && maneuver !== undefined && maneuver.difficultyKey === Difficulty.HARD && defenders !== undefined && defenders.length > 0;
   },
   consequent: function(store, token, callback)
   {
      const agent = token.agent();
      const shipActions0 = [ShipAction.TARGET_LOCK];
      const that = this;
      const finishCallback = function(shipActionAbility)
      {
         that.finishConsequent(store, token, shipActionAbility, callback);
      };
      agent.getShipAction(token, finishCallback, shipActions0);

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

UpgradeAbility2[Phase.ACTIVATION_CLEAN_UP][UpgradeCard.TIE_X7] = {
   // Your upgrade bar loses the Cannon and Missile upgrade icons. After executing a 3-, 4-, or 5-speed maneuver, you may assign 1 evade token to your ship.
   condition: function(store, token)
   {
      const maneuver = getManeuver(token);
      const speed = (maneuver ? maneuver.speed : undefined);
      return isActiveCardInstance(store, token) && [3, 4, 5].includes(speed);
   },
   consequent: function(store, token, callback)
   {
      store.dispatch(CardAction.addEvadeCount(token));
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility2[Phase.ACTIVATION_GAIN_ENERGY] = {};

UpgradeAbility2[Phase.ACTIVATION_GAIN_ENERGY][UpgradeCard.ENGINEERING_TEAM] = {
   // During the Activation phase, when you reveal a Straight maneuver, gain 1 additional energy during the "Gain Energy" step.
   condition: function(store, token)
   {
      const maneuver = getManeuver(token);
      return isActiveCardInstance(store, token) && maneuver !== undefined && maneuver.bearingKey === Bearing.STRAIGHT;
   },
   consequent: function(store, token, callback)
   {
      store.dispatch(CardAction.addEnergyCount(token));
      callback();
   },
};

UpgradeAbility2[Phase.ACTIVATION_GAIN_ENERGY][UpgradeCard.TIBANNA_GAS_SUPPLIES] = {
   // You may discard this card to gain 3 energy.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isUpgradedWith(UpgradeCard.TIBANNA_GAS_SUPPLIES);
   },
   consequent: function(store, token, callback)
   {
      const upgradeInstance = token.upgrade(UpgradeCard.TIBANNA_GAS_SUPPLIES);
      discardUpgrade(token, upgradeInstance);

      store.dispatch(CardAction.addEnergyCount(token, 3));
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility2[Phase.ACTIVATION_PERFORM_ACTION] = {};

UpgradeAbility2[Phase.ACTIVATION_PERFORM_ACTION][UpgradeCard.CLOAKING_DEVICE] = {
   // Action: Until the end of the round, increase your primary weapon value by 1 and decrease your agility value by 1.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token);
   },
   consequent: function(store, token, callback)
   {
      const ability = new Ability(ShipAction, ShipAction.CLOAK, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
      ability.consequent(store, token, callback);
   },
};

UpgradeAbility2[Phase.ACTIVATION_PERFORM_ACTION][UpgradeCard.EXPERT_HANDLING] = {
   // Action: Perform a free barrel roll action. If you do not have the Barrel Roll action icon, receive 1 stress token. You may then remove 1 enemy Target Lock from your ship.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token);
   },
   consequent: function(store, token, callback)
   {
      const agent = token.agent();
      const shipActions0 = [ShipAction.BARREL_ROLL];
      const that = this;
      const finishCallback = function(shipActionAbility)
      {
         that.finishConsequent(store, token, shipActionAbility, callback);
      };
      agent.getShipAction(token, finishCallback, shipActions0);

      // Wait for agent to respond.
   },
   finishConsequent: function(store, token, shipActionAbility, callback)
   {
      const hasBarrelRoll = token.shipActions().includes(ShipAction.BARREL_ROLL);
      if (!hasBarrelRoll)
      {
         token.receiveStress();
      }
      // FIXME: removing the *first* enemy target lock.
      const defenderTargetLocks = TargetLock.getByDefender(token.store(), token);
      if (defenderTargetLocks.length > 0)
      {
         defenderTargetLocks[0].delete();
      }
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

UpgradeAbility2[Phase.ACTIVATION_PERFORM_ACTION][UpgradeCard.EXPOSE] = {
   // Action: Until the end of the round, increase your primary weapon value by 1 and decrease your agility value by 1.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token);
   },
   consequent: function(store, token, callback)
   {
      callback();
   },
};

UpgradeAbility2[Phase.ACTIVATION_PERFORM_ACTION][UpgradeCard.LANDO_CALRISSIAN] = {
   // Action: Roll 2 defense dice. For each Focus result, assign 1 Focus token to your ship. For each Evade result, assign 1 Evade token to your ship.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token);
   },
   consequent: function(store, token, callback)
   {
      const defenseDice = new DefenseDice(store, token.id(), 2);
      if (defenseDice.focusCount() > 0)
      {
         token.receiveFocus(defenseDice.focusCount(), callback);
      }
      if (defenseDice.evadeCount() > 0)
      {
         store.dispatch(CardAction.addEvadeCount(token, defenseDice.evadeCount()));
      }
      callback();
   },
};

UpgradeAbility2[Phase.ACTIVATION_PERFORM_ACTION][UpgradeCard.LEEBO] = {
   // Action: Perform a free boost action. Then receive 1 ion token.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token);
   },
   consequent: function(store, token, callback)
   {
      const agent = token.agent();
      const shipActions0 = [ShipAction.BOOST];
      const that = this;
      const finishCallback = function(shipActionAbility)
      {
         that.finishConsequent(store, token, shipActionAbility, callback);
      };
      agent.getShipAction(token, finishCallback, shipActions0);

      // Wait for agent to respond.
   },
   finishConsequent: function(store, token, shipActionAbility, callback)
   {
      store.dispatch(CardAction.addIonCount(token));
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

UpgradeAbility2[Phase.ACTIVATION_PERFORM_ACTION][UpgradeCard.MARKSMANSHIP] = {
   // Action: When attacking this round, you may change 1 of your Focus results to a Critical Hit result and all of your other Focus results to Hit results.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token);
   },
   consequent: function(store, token, callback)
   {
      callback();
   },
};

UpgradeAbility2[Phase.ACTIVATION_PERFORM_ACTION][UpgradeCard.R2_F2] = {
   // Action: Increase your agility value by 1 until the end of this game round.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token);
   },
   consequent: function(store, token, callback)
   {
      callback();
   },
};

UpgradeAbility2[Phase.ACTIVATION_PERFORM_ACTION][UpgradeCard.R5_D8] = {
   // Action: Roll 1 defense die. On an Evade or Focus result, discard 1 of your facedown Damage cards.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.damageKeys().size > 0;
   },
   consequent: function(store, token, callback)
   {
      const defenseDice = new DefenseDice(1);
      if (defenseDice.evadeCount() === 1 || defenseDice.focusCount() === 1)
      {
         const damageKey = token.damageKeys().get(0);
         store.dispatch(CardAction.removeDamage(token.id(), damageKey));
      }
      callback();
   },
};

UpgradeAbility2[Phase.ACTIVATION_PERFORM_ACTION][UpgradeCard.RAGE] = {
   // Action: Assign 1 focus token to your ship and receive 2 stress tokens. Until the end of the round, when attacking, you may reroll up to 3 attack dice.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token);
   },
   consequent: function(store, token, callback)
   {
      token.receiveFocus();
      token.receiveStress(2, callback);
   },
};

UpgradeAbility2[Phase.ACTIVATION_PERFORM_ACTION][UpgradeCard.REAR_ADMIRAL_CHIRANEAU] = {
   // Action: Execute a white (1 forward) maneuver.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token);
   },
   consequent: function(store, token, callback)
   {
      const environment = store.getState().environment;
      const maneuverKey = Maneuver.STRAIGHT_1_STANDARD;
      const maneuverAction = new ManeuverAction(environment.store(), token.id(), maneuverKey);
      maneuverAction.doIt();
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
function discardUpgrade(token, upgradeInstance)
{
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("upgradeInstance", upgradeInstance);

   token.discardUpgrade(upgradeInstance);
}

function findManeuverByBearingSpeed(token, bearing, speed)
{
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("bearing", bearing);
   InputValidator.validateNotNull("speed", speed);

   let answer;
   const maneuverKeys = token.card().shipFaction.ship.maneuverKeys;

   for (let i = 0; i < maneuverKeys.length; i++)
   {
      const maneuverKey = maneuverKeys[i];
      const maneuver = Maneuver.properties[maneuverKey];

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

   const environment = store.getState().environment;

   return environment.activeCardInstance();
}

function getManeuver(token)
{
   InputValidator.validateNotNull("token", token);

   const activationAction = getActivationAction(token);
   return (activationAction !== undefined ? activationAction.maneuver() : undefined);
}

function isActiveCardInstance(store, token)
{
   const activeToken = getActiveCardInstance(store);

   return token.equals(activeToken);
}

UpgradeAbility2.toString = function()
{
   return "model/UpgradeAbility2";
};

if (Object.freeze)
{
   Object.freeze(UpgradeAbility2);
}

export default UpgradeAbility2;