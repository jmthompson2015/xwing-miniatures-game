import InputValidator from "../utility/InputValidator.js";

import Phase from "../artifact/Phase.js";
import PilotCard from "../artifact/PilotCard.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Action from "./Action.js";
import AttackDice from "./AttackDice.js";
import CardAction from "./CardAction.js";
import DamageDealer from "./DamageDealer.js";
import DefenseDice from "./DefenseDice.js";
import RangeRuler from "./RangeRuler.js";
import Selector from "./Selector.js";
import ShipDestroyedAction from "./ShipDestroyedAction.js";

function CombatAction(store, attacker, weapon, defender, callback, attackDiceClassIn, defenseDiceClassIn)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("weapon", weapon);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateNotNull("callback", callback);
   // attackDiceClassIn optional.
   // defenseDiceClassIn optional.

   if (attacker === defender)
   {
      throw "ERROR: attacker === defender when creating CombatAction " + attacker;
   }

   const attackDiceClass = (attackDiceClassIn ? attackDiceClassIn : AttackDice);
   const defenseDiceClass = (defenseDiceClassIn ? defenseDiceClassIn : DefenseDice);

   this.store = function()
   {
      return store;
   };

   this.attacker = function()
   {
      return attacker;
   };

   this.weapon = function()
   {
      return weapon;
   };

   this.defender = function()
   {
      return defender;
   };

   this.callback = function()
   {
      return callback;
   };

   this.attackDiceClass = function()
   {
      return attackDiceClass;
   };

   this.defenseDiceClass = function()
   {
      return defenseDiceClass;
   };

   let executionCount = 0;

   this.executionCount = function(value)
   {
      if (value !== undefined)
      {
         executionCount = value;
      }

      return executionCount;
   };
}

//////////////////////////////////////////////////////////////////////////
// Accessor methods.

CombatAction.prototype.PERFORM_ATTACK_TWICE_UPGRADES = [UpgradeCard.CLUSTER_MISSILES, UpgradeCard.TWIN_LASER_TURRET];

CombatAction.prototype.adjudicator = function()
{
   const store = this.store();
   return Selector.adjudicator(store.getState());
};

CombatAction.prototype.attackerPosition = function()
{
   const environment = this.environment();
   const attacker = this.attacker();
   return environment.getPositionFor(attacker);
};

CombatAction.prototype.defenderPosition = function()
{
   const environment = this.environment();
   const defender = this.defender();
   return environment.getPositionFor(defender);
};

CombatAction.prototype.delay = function()
{
   const store = this.store();

   return store.getState().delay;
};

CombatAction.prototype.environment = function()
{
   const store = this.store();
   return Selector.environment(store.getState());
};

//////////////////////////////////////////////////////////////////////////
// Behavior methods.

CombatAction.prototype.doIt = function()
{
   LOGGER.trace("CombatAction.doIt() start");

   this.executionCount(this.executionCount() + 1);
   const store = this.store();
   const attacker = this.attacker();
   store.dispatch(Action.setTokenCombatAction(attacker, this));

   this.declareTarget();

   LOGGER.trace("CombatAction.doIt() end");
};

CombatAction.prototype.declareTarget = function()
{
   LOGGER.trace("CombatAction.declareTarget() start");

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.COMBAT_DECLARE_TARGET, this.attacker(), this.finishDeclareTarget.bind(this)));

   LOGGER.trace("CombatAction.declareTarget() end");
};

CombatAction.prototype.finishDeclareTarget = function()
{
   LOGGER.trace("CombatAction.finishDeclareTarget() start");

   const store = this.store();
   const attacker = this.attacker();
   const attackerPosition = this.attackerPosition();
   const weapon = this.weapon();
   const defender = this.defender();
   const defenderPosition = this.defenderPosition();

   const rangeKey = RangeRuler.getRange(attacker, attackerPosition, defender, defenderPosition);
   if (rangeKey === undefined)
   {
      throw "Defender out of range. attacker: " + attacker + " defender: " + defender;
   }
   store.dispatch(Action.setTokenRange(attacker, rangeKey));

   const firingArc = weapon.primaryFiringArc();
   const isInFiringArc = weapon.isDefenderInFiringArc(attackerPosition, firingArc, defender, defenderPosition);
   store.dispatch(Action.setTokenInFiringArc(attacker, isInFiringArc));

   this.rollAttackDice();

   LOGGER.trace("CombatAction.finishDeclareTarget() end");
};

CombatAction.prototype.rollAttackDice = function()
{
   LOGGER.trace("CombatAction.rollAttackDice() start");

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.COMBAT_ROLL_ATTACK_DICE, this.attacker(), this.finishRollAttackDice.bind(this)));

   LOGGER.trace("CombatAction.rollAttackDice() end");
};

CombatAction.prototype.finishRollAttackDice = function()
{
   LOGGER.trace("CombatAction.finishRollAttackDice() start");

   const store = this.store();
   const environment = this.environment();
   const attacker = this.attacker();
   const defender = this.defender();
   const weapon = this.weapon();
   const rangeKey = Selector.rangeKey(store.getState(), attacker);
   const attackDiceCount = attacker.computeAttackDiceCount(environment, weapon, defender, rangeKey);
   const attackDiceClass = this.attackDiceClass();
   const attackDice = new attackDiceClass(store, attacker.id(), attackDiceCount);

   const phaseContext = {
      defender: defender,
   };
   store.dispatch(Action.enqueuePhase(Phase.COMBAT_MODIFY_ATTACK_DICE, attacker, this.rollDefenseDice.bind(this), phaseContext));

   LOGGER.trace("CombatAction.finishRollAttackDice() end");
};

CombatAction.prototype.rollDefenseDice = function()
{
   LOGGER.trace("CombatAction.rollDefenseDice() start");

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.COMBAT_ROLL_DEFENSE_DICE, this.attacker(), this.finishRollDefenseDice.bind(this)));

   LOGGER.trace("CombatAction.rollDefenseDice() end");
};

CombatAction.prototype.finishRollDefenseDice = function()
{
   LOGGER.trace("CombatAction.finishRollDefenseDice() start");

   const store = this.store();
   const attacker = this.attacker();
   const defender = this.defender();
   const weapon = this.weapon();
   const rangeKey = Selector.rangeKey(store.getState(), attacker);
   const defenderDiceCount = defender.computeDefenseDiceCount(this.environment(), attacker, weapon, rangeKey);
   const defenseDiceClass = this.defenseDiceClass();
   const defenseDice = new defenseDiceClass(store, attacker.id(), defenderDiceCount);

   this.modifyDefenseDice();

   LOGGER.trace("CombatAction.finishRollDefenseDice() end");
};

CombatAction.prototype.modifyDefenseDice = function()
{
   LOGGER.trace("CombatAction.modifyDefenseDice() start");

   const store = this.store();
   const defender = this.defender();
   const phaseContext = {
      defender: defender,
   };
   store.dispatch(Action.enqueuePhase(Phase.COMBAT_MODIFY_DEFENSE_DICE, this.attacker(), this.compareResults.bind(this), phaseContext));

   LOGGER.trace("CombatAction.modifyDefenseDice() end");
};

CombatAction.prototype.compareResults = function()
{
   LOGGER.trace("CombatAction.compareResults() start");

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.COMBAT_COMPARE_RESULTS, this.attacker(), this.finishCompareResults.bind(this)));

   LOGGER.trace("CombatAction.compareResults() end");
};

CombatAction.prototype.finishCompareResults = function()
{
   LOGGER.trace("CombatAction.finishCompareResults() start");

   const store = this.store();
   const environment = this.environment();
   const attacker = this.attacker();
   const defender = this.defender();
   const attackDice = AttackDice.get(store, attacker.id());
   const defenseDice = DefenseDice.get(store, attacker.id());
   const damageDealer = new DamageDealer(environment, attackDice.hitCount(), attackDice.criticalHitCount(), defender, defenseDice.evadeCount());
   store.dispatch(Action.setTokenDamageDealer(attacker, damageDealer));
   let isDefenderHit = (damageDealer.hits() + damageDealer.criticalHits() > 0);
   if (attacker.card().key === PilotCard.LIEUTENANT_BLOUNT)
   {
      isDefenderHit = true;
   }
   store.dispatch(Action.setTokenDefenderHit(attacker, isDefenderHit));

   this.notifyDamage();

   LOGGER.trace("CombatAction.finishCompareResults() end");
};

CombatAction.prototype.notifyDamage = function()
{
   LOGGER.trace("CombatAction.dealDamage() start");

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.COMBAT_NOTIFY_DAMAGE, this.attacker(), this.finishNotifyDamage.bind(this)));
};

CombatAction.prototype.finishNotifyDamage = function()
{
   LOGGER.trace("CombatAction.finishNotifyDamage() start");

   const store = this.store();
   const attacker = this.attacker();
   const defender = this.defender();
   const attackerAgent = attacker.agent();
   const defenderAgent = defender.agent();
   const attackerIsComputerAgent = attackerAgent.isComputerAgent();
   const defenderIsComputerAgent = defenderAgent.isComputerAgent();
   const attackDice = AttackDice.get(store, attacker.id());
   const defenseDice = DefenseDice.get(store, attacker.id());
   const damageDealer = Selector.damageDealer(store.getState(), attacker);
   const callback = this.dealDamage.bind(this);

   // Four possibilities:
   // computer vs computer: call dealDamage() once
   // computer vs human: call dealDamage() once
   // human vs computer: call dealDamage() once
   // human vs human: call dealDamage() once

   if (attackerIsComputerAgent && defenderIsComputerAgent)
   {
      // Both computer agents.
      setTimeout(callback, this.delay());
   }
   else if (attackerIsComputerAgent && !defenderIsComputerAgent)
   {
      defenderAgent.dealDamage(attacker, attackDice, defender, defenseDice, damageDealer, callback);
   }
   else if (!attackerIsComputerAgent && defenderIsComputerAgent)
   {
      attackerAgent.dealDamage(attacker, attackDice, defender, defenseDice, damageDealer, callback);
   }
   else if (!attackerIsComputerAgent && !defenderIsComputerAgent)
   {
      // Both human agents.
      attackerAgent.dealDamage(attacker, attackDice, defender, defenseDice, damageDealer, callback);
   }

   LOGGER.trace("CombatAction.finishNotifyDamage() end");
};

CombatAction.prototype.dealDamage = function()
{
   LOGGER.trace("CombatAction.dealDamage() start");

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.COMBAT_DEAL_DAMAGE, this.attacker(), this.finishDealDamage.bind(this)));

   LOGGER.trace("CombatAction.dealDamage() end");
};

CombatAction.prototype.finishDealDamage = function()
{
   LOGGER.trace("CombatAction.finishDealDamage() start");

   const store = this.store();
   const attacker = this.attacker();
   const damageDealer = Selector.damageDealer(store.getState(), attacker);
   const weapon = this.weapon();
   const isDefenderHit = Selector.isDefenderHit(store.getState(), attacker);

   if (isDefenderHit)
   {
      if (!weapon.upgrade() || weapon.upgrade().cancelAllDiceResults !== true)
      {
         damageDealer.dealDamage();
      }
   }

   this.afterDealDamage();

   LOGGER.trace("CombatAction.finishDealDamage() end");
};

CombatAction.prototype.afterDealDamage = function()
{
   LOGGER.trace("CombatAction.afterDealDamage() start");

   const store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.COMBAT_AFTER_DEAL_DAMAGE, this.attacker(), this.finishAfterDealDamage.bind(this)));

   LOGGER.trace("CombatAction.afterDealDamage() end");
};

CombatAction.prototype.finishAfterDealDamage = function()
{
   LOGGER.trace("CombatAction.finishAfterDealDamage() start");

   const environment = this.environment();
   const attacker = this.attacker();
   const weapon = this.weapon();
   const defender = this.defender();
   const defenderPosition = this.defenderPosition();
   const callback = this.callback();
   let myDefender, myDefenderPosition;

   if (defender.idParent() !== undefined)
   {
      myDefender = environment.parentOf(defender);
      myDefenderPosition = environment.getPositionFor(myDefender);
   }
   else
   {
      myDefender = defender;
      myDefenderPosition = defenderPosition;
   }

   const store = this.store();
   store.dispatch(CardAction.clearUsedAbilities(attacker));
   store.dispatch(CardAction.clearUsedAbilities(defender));

   if (myDefender.isDestroyed())
   {
      const shipDestroyedAction = new ShipDestroyedAction(environment, myDefender, myDefenderPosition);
      shipDestroyedAction.doIt();
      const delay = 1.5 * this.delay();
      setTimeout(function()
      {
         callback();
      }, delay);
   }
   else
   {
      if (this.PERFORM_ATTACK_TWICE_UPGRADES.includes(weapon.upgradeKey()) && this.executionCount() < 2)
      {
         this.doIt();
      }
      else
      {
         callback();
      }
   }

   LOGGER.trace("CombatAction.finishAfterDealDamage() end");
};

export default CombatAction;