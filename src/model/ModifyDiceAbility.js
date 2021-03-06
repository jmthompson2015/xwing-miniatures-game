import InputValidator from "../utility/InputValidator.js";

import DiceModification from "../artifact/DiceModification.js";

import AttackDice from "./AttackDice.js";
import CardAction from "./CardAction.js";
import DefenseDice from "./DefenseDice.js";
import Selector from "./Selector.js";
import TargetLock from "./TargetLock.js";

const ModifyDiceAbility = {};

ModifyDiceAbility.ATTACK_KEY = "modifyAttackDice";
ModifyDiceAbility.DEFENSE_KEY = "modifyDefenseDice";

////////////////////////////////////////////////////////////////////////
ModifyDiceAbility[ModifyDiceAbility.ATTACK_KEY] = {};

ModifyDiceAbility[ModifyDiceAbility.ATTACK_KEY][DiceModification.ATTACK_SPEND_FOCUS] = {
   // Spend a focus token to change all focus results to hit results on attack dice.
   condition: function(store, token)
   {
      const attacker = getActiveToken(store);
      const attackDice = getAttackDice(attacker);
      return isActiveToken(store, token) && token.focusCount() > 0 && attackDice.focusCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveToken(store);
      const attackDice = getAttackDice(attacker);
      attackDice.spendFocusToken();
      attacker.removeFocus(callback);
   },
};

ModifyDiceAbility[ModifyDiceAbility.ATTACK_KEY][DiceModification.ATTACK_SPEND_TARGET_LOCK] = {
   // Spend a target lock on the defender to reroll any number of attack dice.
   condition: function(store, token)
   {
      const attacker = getActiveToken(store);
      const defender = getDefender(attacker);
      const targetLock = (defender ? TargetLock.getFirst(store, attacker, defender) : undefined);
      return isActiveToken(store, token) && defender && targetLock !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveToken(store);
      const attackDice = getAttackDice(attacker);
      const defender = getDefender(attacker);
      attackDice.spendTargetLock();
      const targetLock = TargetLock.getFirst(store, attacker, defender);
      targetLock.delete();
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
ModifyDiceAbility[ModifyDiceAbility.DEFENSE_KEY] = {};

ModifyDiceAbility[ModifyDiceAbility.DEFENSE_KEY][DiceModification.DEFENSE_SPEND_EVADE] = {
   // Spend an evade token to add one additional evade result to defense dice.
   condition: function(store, token)
   {
      const attacker = getActiveToken(store);
      const defender = getDefender(attacker);
      return token.equals(defender) && token.evadeCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveToken(store);
      const defender = getDefender(attacker);
      const defenseDice = getDefenseDice(attacker);
      defenseDice.spendEvadeToken();
      store.dispatch(CardAction.addEvadeCount(defender, -1));
      callback();
   },
};

ModifyDiceAbility[ModifyDiceAbility.DEFENSE_KEY][DiceModification.DEFENSE_SPEND_FOCUS] = {
   // Spend a focus token to change all focus results to evade results on defense dice.
   condition: function(store, token)
   {
      const attacker = getActiveToken(store);
      const defender = getDefender(attacker);
      const defenseDice = getDefenseDice(attacker);
      return token.equals(defender) && token.focusCount() > 0 && defenseDice.focusCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveToken(store);
      const defender = getDefender(attacker);
      const defenseDice = getDefenseDice(attacker);
      defenseDice.spendFocusToken();
      if (defender !== undefined)
      {
         defender.removeFocus(callback);
      }
   },
};

////////////////////////////////////////////////////////////////////////
function getActiveToken(store)
{
   InputValidator.validateNotNull("store", store);

   const environment = store.getState().environment;

   return environment.activeCardInstance();
}

function getAttackDice(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const store = attacker.store();
   const combatAction = getCombatAction(attacker);
   const attackDiceClass = (combatAction ? combatAction.attackDiceClass() : AttackDice);

   return attackDiceClass.get(store, attacker.id());
}

function getCombatAction(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   return Selector.combatAction(attacker.store().getState(), attacker);
}

function getDefender(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const combatAction = getCombatAction(attacker);

   return (combatAction ? combatAction.defender() : undefined);
}

function getDefenseDice(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const store = attacker.store();
   const combatAction = getCombatAction(attacker);
   const defenseDiceClass = (combatAction ? combatAction.defenseDiceClass() : DefenseDice);

   return defenseDiceClass.get(store, attacker.id());
}

function isActiveToken(store, token)
{
   const activeToken = getActiveToken(store);

   return token.equals(activeToken);
}

ModifyDiceAbility.toString = function()
{
   return "ModifyDiceAbility";
};

export default ModifyDiceAbility;