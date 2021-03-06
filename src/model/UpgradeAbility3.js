/*
 * Provides upgrade abilities for the Combat Phase.
 */
import InputValidator from "../utility/InputValidator.js";

import AttackDiceValue from "../artifact/AttackDiceValue.js";
import DefenseDiceValue from "../artifact/DefenseDiceValue.js";
import Faction from "../artifact/Faction.js";
import Phase from "../artifact/Phase.js";
import Range from "../artifact/Range.js";
import ShipAction from "../artifact/ShipAction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";
import UpgradeType from "../artifact/UpgradeType.js";

import Ability from "./Ability.js";
// import Action from "./Action.js";
import AttackDice from "./AttackDice.js";
import CardAction from "./CardAction.js";
import CombatAction from "./CombatAction.js";
import DefenseDice from "./DefenseDice.js";
import RangeRuler from "./RangeRuler.js";
import Selector from "./Selector.js";
import ShipActionAbility from "./ShipActionAbility.js";
import TargetLock from "./TargetLock.js";

const UpgradeAbility3 = {};

////////////////////////////////////////////////////////////////////////
UpgradeAbility3[Phase.COMBAT_START] = {};

UpgradeAbility3[Phase.COMBAT_START][UpgradeCard.YSANNE_ISARD] = {
   // At the start of the Combat phase, if you have no shields and at least 1 Damage card assigned to your ship, you may perform a free evade action.
   condition: function(store, token)
   {
      return token.shieldCount() === 0 && (token.damageCount() + token.criticalDamageCount() > 0);
   },
   consequent: function(store, token, callback)
   {
      const ability = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
      const consequent = ability.consequent();
      consequent(store, token, callback);
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility3[Phase.COMBAT_DECLARE_TARGET] = {};

UpgradeAbility3[Phase.COMBAT_DECLARE_TARGET][UpgradeCard.BLASTER_TURRET] = {
   // Spend 1 Focus token to perform this attack against 1 ship (even a ship outside your firing arc).
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.BLASTER_TURRET;
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      spendFocusToken(store, attacker);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_DECLARE_TARGET][UpgradeCard.HOT_SHOT_BLASTER] = {
   // Discard this card to attack 1 ship (even a ship outside your firing arc).
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.HOT_SHOT_BLASTER;
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      discardUpgrade(attacker);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_DECLARE_TARGET][UpgradeCard.R3_A2] = {
   // When you declare the target of your attack, if the defender is inside your firing arc, you may receive 1 stress token to cause the defender to receive 1 stress token.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const attackerPosition = getAttackerPosition(attacker);
      const firingArc = weapon.primaryFiringArc();
      const defender = getDefender(attacker);
      const defenderPosition = getDefenderPosition(attacker);
      const isDefenderInFiringArc = weapon.isDefenderInFiringArc(attackerPosition, firingArc, defender, defenderPosition);
      return isActiveCardInstance(store, token) && isDefenderInFiringArc;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      attacker.receiveStress();
      defender.receiveStress(1, callback);
   },
};

UpgradeAbility3[Phase.COMBAT_DECLARE_TARGET][UpgradeCard.REBEL_CAPTIVE] = {
   // Once per round, the first ship that declares you as the target of an attack immediately receives 1 stress token.
   condition: function(store, token)
   {
      const upgradeKey = UpgradeCard.REBEL_CAPTIVE;
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      return token.equals(defender) && !token.isPerRoundAbilityUsed(UpgradeCard, upgradeKey);
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      attacker.receiveStress(1, callback);
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE] = {};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.ADVANCED_PROTON_TORPEDOES] = {
   // Spend your Target Lock and discard this card to perform this attack. You may change up to 3 of your blank results to Focus results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.ADVANCED_PROTON_TORPEDOES;
      const defender = getDefender(attacker);
      const targetLock = TargetLock.getFirst(store, token, defender);
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey && targetLock !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      spendTargetLockAndDiscardUpgrade(store, attacker);
      const attackDice = getAttackDice(attacker);
      attackDice.changeOneToValue(AttackDiceValue.BLANK, AttackDiceValue.FOCUS);
      attackDice.changeOneToValue(AttackDiceValue.BLANK, AttackDiceValue.FOCUS);
      attackDice.changeOneToValue(AttackDiceValue.BLANK, AttackDiceValue.FOCUS);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.CALCULATION] = {
   // When attacking, you may spend a Focus token to change 1 of your Focus results to a Critical Hit result.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const attackDice = getAttackDice(attacker);
      return isActiveCardInstance(store, token) && token.focusCount() > 0 && attackDice.focusCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      spendFocusToken(store, token);
      const attackDice = getAttackDice(token);
      attackDice.changeOneToValue(AttackDiceValue.FOCUS, AttackDiceValue.CRITICAL_HIT);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.CLUSTER_MISSILES] = {
   // Spend your Target Lock and discard this card to perform this attack twice.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.CLUSTER_MISSILES;
      const defender = getDefender(attacker);
      const targetLock = TargetLock.getFirst(store, token, defender);
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey && targetLock !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      spendTargetLockAndDiscardUpgrade(store, attacker);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.CONCUSSION_MISSILES] = {
   // Spend your Target Lock and discard this card to perform this attack. You may change 1 of your blank results to a Hit result.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.CONCUSSION_MISSILES;
      const defender = getDefender(attacker);
      const targetLock = TargetLock.getFirst(store, token, defender);
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey && targetLock !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      spendTargetLockAndDiscardUpgrade(store, attacker);
      const attackDice = getAttackDice(attacker);
      attackDice.changeOneToValue(AttackDiceValue.BLANK, AttackDiceValue.HIT);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.DENGAR] = {
   // When attacking, you may reroll 1 attack die. If the defender is a unique pilot, you may instead reroll up to 2 attack dice.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token);
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      const defender = getDefender(token);
      const count = (defender.card().isUnique ? 2 : 1);
      attackDice.rerollBlankAndFocus(count);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.EXPERTISE] = {
   // When attacking, if you are not stressed, you may change all of your focus results to hit results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const attackDice = getAttackDice(attacker);
      return isActiveCardInstance(store, token) && !token.isStressed() && attackDice.focusCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      attackDice.changeAllToValue(AttackDiceValue.FOCUS, AttackDiceValue.HIT);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.EZRA_BRIDGER] = {
   // When attacking, if you are stressed, you may change 1 of your Focus results to a Critical Hit result.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const attackDice = getAttackDice(attacker);
      return isActiveCardInstance(store, token) && token.isStressed() && attackDice.focusCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      attackDice.changeOneToValue(AttackDiceValue.FOCUS, AttackDiceValue.CRITICAL_HIT);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.GUIDANCE_CHIPS] = {
   // Once per round, when attacking with a Torpedo or Missile secondary weapon, you may change 1 die result to a Hit result (or a Critical result if your primary weapon value is "3" or higher).
   condition: function(store, token)
   {
      const upgradeKey = UpgradeCard.GUIDANCE_CHIPS;
      const attacker = getActiveCardInstance(store);
      const attackDice = getAttackDice(attacker);
      const weapon = getWeapon(attacker);
      const isTorpedoOrMissile = (weapon.upgrade() !== undefined) && [UpgradeType.TORPEDO, UpgradeType.MISSILE].includes(weapon.upgrade().type);
      return isActiveCardInstance(store, token) && isTorpedoOrMissile && (attackDice.blankCount() > 0 || attackDice.focusCount() > 0) && !token.isPerRoundAbilityUsed(UpgradeCard, upgradeKey);
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      const weapon = getWeapon(token);
      const oldValue = (attackDice.blankCount() > 0 ? AttackDiceValue.BLANK : AttackDiceValue.FOCUS);
      const newValue = (weapon.weaponValue() >= 3 ? AttackDiceValue.CRITICAL_HIT : AttackDiceValue.HIT);
      attackDice.changeOneToValue(oldValue, newValue);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.GUNNERY_TEAM] = {
   // Once per round, when attacking with a secondary weapon, you may spend 1 energy to change 1 of your blank results to a Hit result.
   condition: function(store, token)
   {
      const upgradeKey = UpgradeCard.GUNNERY_TEAM;
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const attackDice = getAttackDice(attacker);
      return isActiveCardInstance(store, token) && !weapon.isPrimary() && token.energyCount() > 0 && attackDice.blankCount() > 0 && !token.isPerRoundAbilityUsed(UpgradeCard, upgradeKey);
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      attackDice.changeOneToValue(AttackDiceValue.BLANK, AttackDiceValue.HIT);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.HAN_SOLO] = {
   // When attacking, if you have a Target Lock on the defender, you may spend that Target Lock to change all of your Focus results to Hit results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      const targetLock = TargetLock.getFirst(store, token, defender);
      const attackDice = getAttackDice(attacker);
      return isActiveCardInstance(store, token) && targetLock !== undefined && attackDice.focusCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const defender = getDefender(token);
      spendTargetLock(store, token, defender);
      const attackDice = getAttackDice(token);
      attackDice.changeAllToValue(AttackDiceValue.FOCUS, AttackDiceValue.HIT);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.HEAVY_LASER_CANNON] = {
   // Attack 1 ship. Immediately after rolling your attack dice, you must change all of your Critical Hit results to Hit results.
   condition: function(store, token)
   {
      const weapon = getWeapon(token);
      const attackDice = getAttackDice(token);
      if (isActiveCardInstance(store, token) && weapon.upgradeKey() === UpgradeCard.HEAVY_LASER_CANNON && attackDice.criticalHitCount() > 0)
      {
         attackDice.changeAllToValue(AttackDiceValue.CRITICAL_HIT, AttackDiceValue.HIT);
      }
      return false;
   },
   consequent: function(store, token, callback)
   {
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.JESS_PAVA] = {
   // When attacking or defending, you may reroll 1 of your dice for each other friendly ship at Range 1.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const attackDice = getAttackDice(token);
      const environment = getEnvironment(store);
      const friendlyCount = environment.getFriendlyTokensAtRange(attacker, Range.ONE).length;
      return isActiveCardInstance(store, token) && (attackDice.blankCount() > 0 || attackDice.focusCount() > 0) && friendlyCount > 0;
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      const environment = getEnvironment(store);
      const friendlyCount = environment.getFriendlyTokensAtRange(token, Range.ONE).length;
      attackDice.rerollBlankAndFocus(friendlyCount);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.LONE_WOLF] = {
   // When attacking or defending, if there are no friendly ships at Range 1-2, you may reroll 1 of your blank results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const environment = store.getState().environment;
      const rangeOneTokens = environment.getFriendlyTokensAtRange(token, Range.ONE);
      const rangeTwoTokens = environment.getFriendlyTokensAtRange(token, Range.TWO);
      const attackDice = getAttackDice(attacker);
      return isActiveCardInstance(store, token) && rangeOneTokens.length === 0 && rangeTwoTokens === 0 && attackDice.blankCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      attackDice.rerollBlank();
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.MANGLER_CANNON] = {
   // Attack 1 ship. When attacking, you may change 1 of your Hit results to a Critical Hit result.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.MANGLER_CANNON;
      const attackDice = getAttackDice(attacker);
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey && attackDice.hitCount() > 0 && !attacker.isAbilityUsed(UpgradeCard, upgradeKey);
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const attackDice = getAttackDice(attacker);
      attackDice.changeOneToValue(AttackDiceValue.HIT, AttackDiceValue.CRITICAL_HIT);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.MARKSMANSHIP] = {
   // Action: When attacking this round, you may change 1 of your Focus results to a Critical Hit result and all of your other Focus results to Hit results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const attackDice = getAttackDice(token);
      return isActiveCardInstance(store, token) && attackDice.focusCount() > 0 && attacker.isPerRoundAbilityUsed(UpgradeCard, UpgradeCard.MARKSMANSHIP);
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      attackDice.changeOneToValue(AttackDiceValue.FOCUS, AttackDiceValue.CRITICAL_HIT);
      attackDice.changeAllToValue(AttackDiceValue.FOCUS, AttackDiceValue.HIT);
      callback();
   }
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.MERCENARY_COPILOT] = {
   // When attacking at Range 3, you may change 1 of your Hit results to a Critical Hit result.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const rangeKey = getRangeKey(attacker);
      const attackDice = getAttackDice(attacker);
      return isActiveCardInstance(store, token) && rangeKey === Range.THREE && attackDice.hitCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      attackDice.changeOneToValue(AttackDiceValue.HIT, AttackDiceValue.CRITICAL_HIT);
      callback();
   }
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.OPPORTUNIST] = {
   // When attacking, if the defender does not have any Focus or Evade tokens, you may receive 1 stress token to roll 1 additional attack die. You cannot use this ability if you have any stress tokens.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      return isActiveCardInstance(store, token) && token.stressCount() === 0 && defender.evadeCount() === 0 && defender.focusCount() === 0;
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      attackDice.addDie();
      token.receiveStress(1, callback);
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.PREDATOR] = {
   // When attacking, you may reroll 1 attack die. If the defender's pilot skill value is "2" or lower, you may instead reroll up to 2 attack dice.
   condition: function(store, token)
   {
      const upgradeKey = UpgradeCard.PREDATOR;
      const attacker = getActiveCardInstance(store);
      const attackDice = getAttackDice(token);
      return isActiveCardInstance(store, token) && (attackDice.blankCount() > 0 || attackDice.focusCount() > 0) && !attacker.isAbilityUsed(UpgradeCard, upgradeKey);
   },
   consequent: function(store, token, callback)
   {
      const defender = getDefender(token);
      const attackDice = getAttackDice(token);
      const count = (defender.pilotSkillValue() <= 2 ? 2 : 1);
      attackDice.rerollBlankAndFocus(count);
      callback();
   }
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.PROTON_ROCKETS] = {
   // Discard this card to perform this attack. You may roll additional attack dice equal to your agility value, to a maximum of 3 additional dice.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.PROTON_ROCKETS;
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey && token.upgradeKeys().includes(upgradeKey);
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      discardUpgrade(attacker);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.PROTON_TORPEDOES] = {
   // Spend your Target Lock and discard this card to perform this attack. You may change 1 of your Focus results to a Critical Hit result.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.PROTON_TORPEDOES;
      const defender = getDefender(attacker);
      const targetLock = (defender ? TargetLock.getFirst(store, token, defender) : undefined);
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey && defender && targetLock !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      spendTargetLockAndDiscardUpgrade(store, attacker);
      const attackDice = getAttackDice(attacker);
      attackDice.changeOneToValue(AttackDiceValue.FOCUS, AttackDiceValue.CRITICAL_HIT);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.RAGE] = {
   // Action: Assign 1 focus token to your ship and receive 2 stress tokens. Until the end of the round, when attacking, you may reroll up to 3 attack dice.
   condition: function(store, token)
   {
      const attackDice = getAttackDice(token);
      return isActiveCardInstance(store, token) && (attackDice.blankCount() + attackDice.focusCount() > 0);
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      const count = Math.min(3, attackDice.blankCount() + attackDice.focusCount());
      attackDice.rerollBlankAndFocus(count);
      callback();
   }
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.WEAPONS_GUIDANCE] = {
   // When attacking, you may spend a focus token to change 1 of your blank results to a Hit result.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const attackDice = getAttackDice(attacker);
      return isActiveCardInstance(store, token) && token.focusCount() > 0 && attackDice.blankCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      spendFocusToken(store, token);

      const attackDice = getAttackDice(token);
      attackDice.changeOneToValue(AttackDiceValue.BLANK, AttackDiceValue.HIT);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][UpgradeCard.WIRED] = {
   // When attacking or defending, if you are stressed, you may reroll 1 or more of your Focus results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const attackDice = getAttackDice(attacker);
      return isActiveCardInstance(store, token) && token.isStressed() && attackDice.focusCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attackDice = getAttackDice(token);
      attackDice.rerollAllFocus();
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE] = {};

UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][UpgradeCard.AUTOTHRUSTERS] = {
   // When defending, if you are beyond Range 2 or outside the attacker's firing arc, you may change 1 of your blank results to an Evade result. You can equip this card only if you have the Boost action icon.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      const rangeKey = getRangeKey(attacker);
      const defenseDice = getDefenseDice(attacker);
      const isBeyondRange2 = ![Range.ONE, Range.TWO].includes(rangeKey);
      const isOutsideFiringArc = !isInFiringArc(attacker);
      return token.equals(defender) && (isBeyondRange2 || isOutsideFiringArc) && defenseDice.blankCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const defenseDice = getDefenseDice(attacker);
      defenseDice.changeOneToValue(DefenseDiceValue.BLANK, DefenseDiceValue.EVADE);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][UpgradeCard.CONCORD_DAWN_PROTECTOR] = {
   // When defending, if you are inside the attacker's firing arc and at Range 1, and the attacker is inside your firing arc, add 1 Evade result.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      const isInFiringArcAttacker = isInFiringArc(attacker);
      const isRange1 = (getRangeKey(attacker) === Range.ONE);
      const weapon = defender.primaryWeapon();
      const environment = store.getState().environment;
      const attackerPosition = environment.getPositionFor(attacker);
      const defenderPosition = environment.getPositionFor(defender);
      const isInFiringArcDefender = weapon.isDefenderInFiringArc(defenderPosition, weapon.primaryFiringArc(), attacker, attackerPosition);
      return token.equals(defender) && isInFiringArcAttacker && isRange1 && isInFiringArcDefender;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const defenseDice = getDefenseDice(attacker);
      defenseDice.addDie(DefenseDiceValue.EVADE);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][UpgradeCard.CROSSFIRE_FORMATION] = {
   // When defending, if there is at least 1 other friendly Resistance ship at Range 1-2 of the attacker, you may add 1 Focus result to your roll.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      let defenders = [];

      if (token.equals(defender))
      {
         const environment = store.getState().environment;
         const attackerPosition = environment.getPositionFor(attacker);
         const ranges = [Range.ONE, Range.TWO];
         defenders = environment.getDefenders(attacker).filter(function(myDefender)
         {
            const isResistance = myDefender.card().shipFaction.factionKey === Faction.RESISTANCE;
            const myDefenderPosition = environment.getPositionFor(myDefender);
            const range = RangeRuler.getRange(attacker, attackerPosition, myDefender, myDefenderPosition);
            return myDefender !== defender && isResistance && ranges.includes(range);
         });
      }
      return token.equals(defender) && defenders.length > 0;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const defenseDice = getDefenseDice(attacker);
      defenseDice.addDie(DefenseDiceValue.FOCUS);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][UpgradeCard.FLIGHT_INSTRUCTOR] = {
   // When defending, you may reroll 1 of your Focus results. If the attacker's pilot skill value is "2" or lower, you may reroll 1 of your blank results instead.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const pilotSkill = attacker.pilotSkillValue();
      const defender = getDefender(attacker);
      const defenseDice = getDefenseDice(attacker);
      return token.equals(defender) && ((pilotSkill <= 2 && defenseDice.blankCount() > 0) || (pilotSkill > 2 && defenseDice.focusCount() > 0));
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const defenseDice = getDefenseDice(attacker);
      if (attacker.pilotSkillValue() <= 2)
      {
         defenseDice.rerollBlank();
      }
      else
      {
         defenseDice.rerollFocus();
      }
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][UpgradeCard.JESS_PAVA] = {
   // When attacking or defending, you may reroll 1 of your dice for each other friendly ship at Range 1.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      const defenseDice = getDefenseDice(attacker);
      const environment = getEnvironment(store);
      const friendlyCount = environment.getFriendlyTokensAtRange(defender, Range.ONE).length;
      return token.equals(defender) && (defenseDice.blankCount() > 0 || defenseDice.focusCount() > 0) && friendlyCount > 0;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const defenseDice = getDefenseDice(attacker);
      const environment = getEnvironment(store);
      const friendlyCount = environment.getFriendlyTokensAtRange(token, Range.ONE).length;
      defenseDice.rerollBlankAndFocus(friendlyCount);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][UpgradeCard.JUKE] = {
   // When attacking, if you have an Evade token, you may change 1 of the defender's Evade results to a Focus result.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defenseDice = getDefenseDice(attacker);
      return isActiveCardInstance(store, token) && token.evadeCount() > 0 && defenseDice.evadeCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const defenseDice = getDefenseDice(attacker);
      defenseDice.changeOneToValue(DefenseDiceValue.EVADE, DefenseDiceValue.FOCUS);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][UpgradeCard.LONE_WOLF] = {
   // When attacking or defending, if there are no friendly ships at Range 1-2, you may reroll 1 of your blank results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      const environment = store.getState().environment;
      const rangeOneTokens = environment.getFriendlyTokensAtRange(token, Range.ONE);
      const rangeTwoTokens = environment.getFriendlyTokensAtRange(token, Range.TWO);
      const defenseDice = getDefenseDice(attacker);
      return token.equals(defender) && rangeOneTokens.length === 0 && rangeTwoTokens.length === 0 && defenseDice.blankCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      const defenseDice = getDefenseDice(attacker);
      defenseDice.rerollBlank();
      store.dispatch(CardAction.addUsedAbility(defender, new Ability(UpgradeCard, UpgradeCard.LONE_WOLF, UpgradeAbility3, Phase.COMBAT_MODIFY_DEFENSE_DICE)));
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][UpgradeCard.SENSOR_JAMMER] = {
   // When defending, you may change 1 of the attacker's Hit results to a Focus result. The attacker cannot reroll the die with the changed result.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      const attackDice = getAttackDice(attacker);
      return token.equals(defender) && attackDice.hitCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const attackDice = getAttackDice(attacker);
      attackDice.changeOneToValue(AttackDiceValue.HIT, AttackDiceValue.FOCUS);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][UpgradeCard.WIRED] = {
   // When attacking or defending, if you are stressed, you may reroll 1 or more of your Focus results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      const defenseDice = getDefenseDice(attacker);
      return token.equals(defender) && token.isStressed() && defenseDice.focusCount() > 0;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const defenseDice = getDefenseDice(attacker);
      defenseDice.rerollAllFocus();
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility3[Phase.COMBAT_DEAL_DAMAGE] = {};

UpgradeAbility3[Phase.COMBAT_DEAL_DAMAGE][UpgradeCard.ADVANCED_HOMING_MISSILES] = {
   // Discard this card to perform this attack. If this attack hits, deal 1 faceup Damage card to the defender. Then cancel all dice results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.ADVANCED_HOMING_MISSILES;
      return isActiveCardInstance(store, token) && weapon && weapon.upgradeKey() === upgradeKey;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      discardUpgrade(attacker);
      if (isDefenderHit(attacker))
      {
         const defender = getDefender(attacker);
         const environment = store.getState().environment;
         defender.receiveCriticalDamage(environment.drawDamage());
      }
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_DEAL_DAMAGE][UpgradeCard.ION_PULSE_MISSILES] = {
   // Spend your Target Lock and discard this card to perform this attack. If this attack hits, the defender suffers 1 damage and receives 2 ion tokens. Then cancel all dice results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.ION_PULSE_MISSILES;
      const defender = getDefender(attacker);
      const targetLock = TargetLock.getFirst(store, token, defender);
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey && targetLock !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      discardUpgrade(attacker);
      if (isDefenderHit(attacker))
      {
         const defender = getDefender(attacker);
         defender.sufferDamage(1, 0);
         store.dispatch(CardAction.addIonCount(defender, 2));
      }
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_DEAL_DAMAGE][UpgradeCard.XX_23_S_THREAD_TRACERS] = {
   // Discard this card to perform this attack. If this attack hits, each friendly ship at Range 1-2 of you may acquire a target lock on the defender. Then cancel all dice results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.XX_23_S_THREAD_TRACERS;
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      discardUpgrade(attacker);
      if (isDefenderHit(attacker))
      {
         // Each friendly ship at Range 1-2 of you may acquire a target lock on the defender.
         const defender = getDefender(attacker);
         const defenderPosition = getDefenderPosition(attacker);
         const environment = store.getState().environment;
                    [Range.ONE, Range.TWO].forEach(function(rangeKey)
         {
            environment.getFriendlyTokensAtRange(attacker, rangeKey).forEach(function(token)
            {
               const tokenPosition = environment.getPositionFor(token);
               const myRangeKey = RangeRuler.getRange(token, tokenPosition, defender, defenderPosition);

               if (Range.STANDARD_RANGES.includes(myRangeKey))
               {
                  TargetLock.newInstance(store, token, defender);
               }
            });
         });
      }
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE] = {};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.ADVANCED_CLOAKING_DEVICE] = {
   // After you perform an attack, you may perform a free cloak action.
   condition: function(store, token)
   {
      const combatAction = getCombatAction(token);
      return isActiveCardInstance(store, token) && combatAction !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const ability = new Ability(ShipAction, ShipAction.CLOAK, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
      const consequent = ability.consequent();
      consequent(store, token, callback);
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.ASSAULT_MISSILES] = {
   // Spend your Target Lock and discard this card to perform this attack. If this attack hits, each other ship at Range 1 of the defender suffers 1 damage.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.ASSAULT_MISSILES;
      const defender = getDefender(attacker);
      const targetLock = TargetLock.getFirst(store, token, defender);
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey && targetLock !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      spendTargetLockAndDiscardUpgrade(store, attacker);
      if (isDefenderHit(attacker))
      {
         const environment = store.getState().environment;
         const defender = getDefender(attacker);
         environment.getTokensAtRange(defender, Range.ONE).forEach(function(token)
         {
            token.sufferDamage(1, 0);
         });
      }
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.BOSSK] = {
   // After you perform an attack that does not hit, if you are not stressed, you must receive 1 Stress token. Then assign 1 Focus token to your ship and acquire a Target Lock on the defender.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      return isActiveCardInstance(store, token) && !isDefenderHit(attacker);
   },
   consequent: function(store, token, callback)
   {
      if (!token.isStressed())
      {
         token.receiveStress();
      }

      token.receiveFocus();
      const defender = getDefender(token);
      TargetLock.newInstance(store, token, defender, callback);
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.DEAD_MANS_SWITCH] = {
   // When you are destroyed, each ship at Range 1 suffers 1 damage.
   condition: function(store, token)
   {
      return token.isDestroyed();
   },
   consequent: function(store, token, callback)
   {
      const environment = store.getState().environment;
      const defender = getDefender(token);

      environment.getTokensAtRange(defender, Range.ONE).forEach(function(myToken)
      {
         myToken.sufferDamage(1, 0);
      });
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.FIRE_CONTROL_SYSTEM] = {
   // After you perform an attack, you may acquire a Target Lock on the defender.
   condition: function(store, token)
   {
      const combatAction = getCombatAction(token);
      return isActiveCardInstance(store, token) && combatAction !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      TargetLock.newInstance(store, attacker, defender, callback);
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.FLECHETTE_CANNON] = {
   // Attack 1 ship. If this attack hits, the defender suffers 1 damage and, if the defender is not stressed, it also receives 1 stress token. Then cancel all dice results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.FLECHETTE_CANNON;
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      if (isDefenderHit(attacker))
      {
         const defender = getDefender(attacker);
         defender.sufferDamage(1, 0);

         if (!defender.isStressed())
         {
            defender.receiveStress();
         }
      }
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.FLECHETTE_TORPEDOES] = {
   // Discard this card and spend your Target Lock to perform this attack. After you perform this attack, the defender receives 1 stress token if its hull value is "4" or lower.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.FLECHETTE_TORPEDOES;
      const defender = getDefender(attacker);
      const targetLock = TargetLock.getFirst(store, token, defender);
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey && targetLock !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      spendTargetLockAndDiscardUpgrade(store, attacker);
      const defender = getDefender(attacker);
      if (defender.hullValue() <= 4)
      {
         defender.receiveStress();
      }
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.GUNNER] = {
   // After you perform an attack that does not hit, you may immediately perform a primary weapon attack. You cannot perform another attack this round.
   condition: function(store, token)
   {
      const upgradeKey = UpgradeCard.GUNNER;
      const attacker = getActiveCardInstance(store);
      const attackerPosition = getAttackerPosition(attacker);
      const defender = getDefender(attacker);
      const defenderPosition = getDefenderPosition(attacker);
      const weapon = attacker.primaryWeapon();
      return isActiveCardInstance(store, token) && !isDefenderHit(attacker) && !attacker.isPerRoundAbilityUsed(UpgradeCard, upgradeKey) && weapon && weapon.isDefenderTargetable(attacker, attackerPosition, defender, defenderPosition);
   },
   consequent: function(store, token, callback)
   {
      const agent = token.agent();
      const weapon = token.primaryWeapon();
      const that = this;
      const finishCallback = function(weapon, defender)
      {
         that.finishConsequent(store, token, weapon, defender, callback);
      };
      agent.chooseWeaponAndDefender(token, finishCallback, weapon);
   },
   finishConsequent: function(store, token, weapon, defender, callback)
   {
      if (defender)
      {
         const combatAction = new CombatAction(store, token, weapon, defender, callback);
         combatAction.doIt();
      }
      else
      {
         callback();
      }
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.IMPETUOUS] = {
   // 	After you perform an attack that destroys an enemy ship, you may acquire a target lock.
   condition: function(store, token)
   {
      const defender = getDefender(token);
      return isActiveCardInstance(store, token) && defender.isDestroyed();
   },
   consequent: function(store, token, callback)
   {
      const agent = token.agent();
      const environment = store.getState().environment;
      const adjudicator = store.getState().adjudicator;
      const shipActions0 = [ShipAction.TARGET_LOCK];
      const that = this;
      const finishCallback = function(shipActionAbility)
      {
         that.finishConsequent(store, token, shipActionAbility, callback);
      };
      agent.getShipAction(environment, adjudicator, token, finishCallback, shipActions0);

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

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.ION_CANNON] = {
   // Attack 1 ship. If this attack hits, the defender suffers 1 damage and receives 1 ion token. Then cancel all dice results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.ION_CANNON;
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      if (isDefenderHit(attacker))
      {
         const defender = getDefender(attacker);
         defender.sufferDamage(1, 0);
         store.dispatch(CardAction.addIonCount(defender));
      }
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.ION_CANNON_TURRET] = {
   // Attack 1 ship (even a ship outside your firing arc). If this attack hits the target ship, the ship suffers 1 damage and receives 1 ion token. Then cancel all dice results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.ION_CANNON_TURRET;
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      if (isDefenderHit(attacker))
      {
         const defender = getDefender(attacker);
         defender.sufferDamage(1, 0);
         store.dispatch(CardAction.addIonCount(defender));
      }
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.ION_TORPEDOES] = {
   // Spend your Target Lock and discard this card to perform this attack. If this attack hits, the defender and each ship at Range 1 of it receives 1 ion token.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.ION_TORPEDOES;
      const defender = getDefender(attacker);
      const targetLock = TargetLock.getFirst(store, token, defender);
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey && targetLock !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      spendTargetLockAndDiscardUpgrade(store, attacker);
      if (isDefenderHit(attacker))
      {
         const environment = store.getState().environment;
         const defender = getDefender(attacker);
         store.dispatch(CardAction.addIonCount(defender));
         environment.getTokensAtRange(defender, Range.ONE).forEach(function(token)
         {
            store.dispatch(CardAction.addIonCount(token));
         });
      }
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.PLASMA_TORPEDOES] = {
   // Spend your Target Lock and discard this card to perform this attack. If this attack hits, after dealing damage, remove 1 shield token from the defender.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.PLASMA_TORPEDOES;
      const defender = getDefender(attacker);
      const targetLock = TargetLock.getFirst(store, token, defender);
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey && targetLock !== undefined;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      spendTargetLockAndDiscardUpgrade(store, attacker);
      if (isDefenderHit(attacker))
      {
         const defender = getDefender(attacker);
         defender.removeShield();
      }
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.REINFORCED_DEFLECTORS] = {
   // After you suffer 3 or more damage from an attack, recover 1 shield (up to your shield value).
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      const damageDealer = getDamageDealer(attacker);
      return token.equals(defender) && damageDealer.hits() + damageDealer.criticalHits() >= 3;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      defender.recoverShield();
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.STEALTH_DEVICE] = {
   // Increase your agility value by 1. If you are hit by an attack, discard this card.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const defender = getDefender(attacker);
      return token.equals(defender) && isDefenderHit(attacker);
   },
   consequent: function(store, token, callback)
   {
      const upgradeInstance = token.upgrade(UpgradeCard.STEALTH_DEVICE);
      discardUpgrade(token, upgradeInstance);
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.TACTICIAN] = {
   // After you perform an attack against a ship inside your firing arc at Range 2, that ship receives 1 stress token.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const inFiringArc = isInFiringArc(attacker);
      const rangeKey = getRangeKey(attacker);
      return isActiveCardInstance(store, token) && inFiringArc && rangeKey === Range.TWO;
   },
   consequent: function(store, token, callback)
   {
      const defender = getDefender(token);
      defender.receiveStress(1, callback);
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.TRACTOR_BEAM] = {
   // Attack 1 ship. If this attack hits, the defender receives 1 tractor beam token. Then cancel all dice results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.TRACTOR_BEAM;
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      if (isDefenderHit(attacker))
      {
         const defender = getDefender(attacker);
         store.dispatch(CardAction.addTractorBeamCount(defender));
      }
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_AFTER_DEAL_DAMAGE][UpgradeCard.TWIN_LASER_TURRET] = {
   // Perform this attack twice (even against a ship outside your firing arc). Each time this attack hits, the defender suffers 1 damage. Then cancel all dice results.
   condition: function(store, token)
   {
      const attacker = getActiveCardInstance(store);
      const weapon = getWeapon(attacker);
      const upgradeKey = UpgradeCard.TWIN_LASER_TURRET;
      return isActiveCardInstance(store, token) && weapon.upgradeKey() === upgradeKey;
   },
   consequent: function(store, token, callback)
   {
      const attacker = getActiveCardInstance(store);
      if (isDefenderHit(attacker))
      {
         const defender = getDefender(attacker);
         defender.sufferDamage(1, 0);
      }
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
UpgradeAbility3[Phase.COMBAT_END] = {};

UpgradeAbility3[Phase.COMBAT_END][UpgradeCard.MARA_JADE] = {
   // At the end of the Combat phase, each enemy ship at Range 1 that does not have a stress token receives 1 stress token.
   condition: function(store, token)
   {
      const upgradeKey = UpgradeCard.MARA_JADE;
      const environment = getEnvironment(store);
      const enemies = environment.getUnfriendlyTokensAtRange(token, Range.ONE);
      return enemies.length > 0 && !token.isAbilityUsed(UpgradeCard, upgradeKey);
   },
   consequent: function(store, token, callback)
   {
      const environment = getEnvironment(store);
      const enemies = environment.getUnfriendlyTokensAtRange(token, Range.ONE);
      enemies.forEach(function(enemy)
      {
         if (!enemy.isStressed())
         {
            enemy.receiveStress();
         }
      });
      callback();
   },
};

UpgradeAbility3[Phase.COMBAT_END][UpgradeCard.R5_P9] = {
   // At the end of the Combat phase, you may spend 1 of your focus tokens to recover 1 shield (up to your shield value).
   condition: function(store, token)
   {
      return token.focusCount() > 0 && token.shieldCount() < token.shieldValue();
   },
   consequent: function(store, token, callback)
   {
      spendFocusToken(store, token);
      token.recoverShield();
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
function discardUpgrade(token, upgradeInstance)
{
   InputValidator.validateNotNull("token", token);
   // upgradeKey optional.

   const myUpgradeInstance = (upgradeInstance === undefined ? token.upgrade(getWeapon(token).upgradeKey()) : upgradeInstance);

   if (myUpgradeInstance.ordnanceCount() > 0)
   {
      const store = token.store();
      store.dispatch(CardAction.addOrdnanceCount(myUpgradeInstance, -1));
   }
   else
   {
      token.discardUpgrade(myUpgradeInstance);
   }
}

function getActiveCardInstance(store)
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

function getAttackerPosition(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const combatAction = getCombatAction(attacker);

   return (combatAction ? combatAction.attackerPosition() : undefined);
}

function getCombatAction(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   return Selector.combatAction(attacker.store().getState(), attacker);
}

function getDamageDealer(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const store = attacker.store();

   return Selector.damageDealer(store.getState(), attacker);
}

function getDefender(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const combatAction = getCombatAction(attacker);

   return (combatAction ? combatAction.defender() : undefined);
}

function getDefenderPosition(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const combatAction = getCombatAction(attacker);

   return (combatAction ? combatAction.defenderPosition() : undefined);
}

function getDefenseDice(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const store = attacker.store();
   const combatAction = getCombatAction(attacker);
   const defenseDiceClass = (combatAction ? combatAction.defenseDiceClass() : DefenseDice);

   return defenseDiceClass.get(store, attacker.id());
}

function getEnvironment(store)
{
   InputValidator.validateNotNull("store", store);

   return Selector.environment(store.getState());
}

function getRangeKey(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const store = attacker.store();

   return Selector.rangeKey(store.getState(), attacker);
}

function getWeapon(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const combatAction = getCombatAction(attacker);

   return (combatAction ? combatAction.weapon() : undefined);
}

function isActiveCardInstance(store, token)
{
   const activeToken = getActiveCardInstance(store);

   return token.equals(activeToken);
}

function isDefenderHit(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const store = attacker.store();

   return Selector.isDefenderHit(store.getState(), attacker);
}

function isInFiringArc(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   const store = attacker.store();

   return Selector.isInFiringArc(store.getState(), attacker);
}

function spendFocusToken(store, attacker)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("attacker", attacker);

   attacker.removeFocus();
}

function spendTargetLock(store, attacker, defender)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);

   const targetLock = TargetLock.getFirst(store, attacker, defender);
   targetLock.delete();
}

function spendTargetLockAndDiscardUpgrade(store, attacker)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("attacker", attacker);

   const defender = getDefender(attacker);
   spendTargetLock(store, attacker, defender);
   discardUpgrade(attacker);
}

UpgradeAbility3.toString = function()
{
   return "model/UpgradeAbility3";
};

if (Object.freeze)
{
   Object.freeze(UpgradeAbility3);
}

export default UpgradeAbility3;