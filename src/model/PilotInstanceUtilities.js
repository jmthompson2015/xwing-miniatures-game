import ArrayUtilities from "../utility/ArrayUtilities.js";
import InputValidator from "../utility/InputValidator.js";

import Bearing from "../artifact/Bearing.js";
import DamageCard from "../artifact/DamageCard.js";
import Difficulty from "../artifact/Difficulty.js";
import FiringArc from "../artifact/FiringArc.js";
import Maneuver from "../artifact/Maneuver.js";
import PilotCard from "../artifact/PilotCard.js";
import Range from "../artifact/Range.js";
import ShipAction from "../artifact/ShipAction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Weapon from "./Weapon.js";

var PilotInstanceUtilities = {};

PilotInstanceUtilities.computeAttackDiceCount = function(pilotInstance, environment, weapon, defender, rangeKey)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);
   InputValidator.validateNotNull("environment", environment);
   InputValidator.validateNotNull("weapon", weapon);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateNotNull("rangeKey", rangeKey);

   var answer;

   if (pilotInstance.isCriticallyDamagedWith(DamageCard.BLINDED_PILOT))
   {
      answer = 0;
      var damageInstance = pilotInstance.criticalDamage(DamageCard.BLINDED_PILOT);
      pilotInstance.flipDamageCardFacedown(damageInstance);
   }
   else
   {
      answer = weapon.weaponValue();

      if (rangeKey === Range.ONE && weapon.isPrimary() && defender.card().key !== PilotCard.ZERTIK_STROM)
      {
         // Bonus attack die at range one.
         answer++;

         if (pilotInstance.card().key === PilotCard.TALONBANE_COBRA)
         {
            answer++;
         }
      }

      var attackerPosition = environment.getPositionFor(pilotInstance);
      var defenderPosition = environment.getPositionFor(defender);
      var firingArc, isInFiringArc;

      if (pilotInstance.card().key === PilotCard.BACKSTABBER)
      {
         firingArc = FiringArc.FORWARD;
         isInFiringArc = weapon.isDefenderInFiringArc(defenderPosition, firingArc, pilotInstance, attackerPosition);

         if (!isInFiringArc)
         {
            answer++;
         }
      }

      if (pilotInstance.card().key === PilotCard.EADEN_VRILL && weapon.isPrimary() && defender.isStressed())
      {
         answer++;
      }

      if (pilotInstance.card().key === PilotCard.FENN_RAU && rangeKey === Range.ONE)
      {
         answer++;
      }

      if (pilotInstance.card().key === PilotCard.KAVIL)
      {
         firingArc = weapon.primaryFiringArc();
         isInFiringArc = weapon.isDefenderInFiringArc(attackerPosition, firingArc, defender, defenderPosition);

         if (!isInFiringArc)
         {
            answer++;
         }
      }

      if (pilotInstance.card().key === PilotCard.MAULER_MITHEL && rangeKey === Range.ONE)
      {
         answer++;
      }

      if (pilotInstance.card().key === PilotCard.NDRU_SUHLAK && environment.getFriendlyTokensAtRange(pilotInstance, Range.ONE).length === 0 && environment.getFriendlyTokensAtRange(pilotInstance, Range.TWO).length === 0)
      {
         answer++;
      }

      if (pilotInstance.card().key === PilotCard.SCOURGE && (defender.damageCount() > 0 || defender.criticalDamageCount() > 0))
      {
         answer++;
      }

      if (weapon.upgradeKey() === UpgradeCard.DORSAL_TURRET && rangeKey === Range.ONE)
      {
         answer++;
      }

      if (weapon.upgradeKey() === UpgradeCard.PROTON_ROCKETS)
      {
         answer += Math.min(pilotInstance.agilityValue(), 3);
      }

      if (pilotInstance.isCriticallyDamagedWith(DamageCard.WEAPONS_FAILURE_V2))
      {
         answer -= 1;
      }
   }

   return answer;
};

PilotInstanceUtilities.computeDefenseDiceCount = function(pilotInstance, environment, attacker, weapon, rangeKey)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);
   InputValidator.validateNotNull("environment", environment);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("weapon", weapon);
   InputValidator.validateNotNull("rangeKey", rangeKey);

   var answer = pilotInstance.agilityValue();

   if ([Range.THREE, Range.FOUR, Range.FIVE].includes(rangeKey) && weapon.isPrimary())
   {
      // Bonus defense die at range three, four, and five.
      answer++;

      if (pilotInstance.card().key === PilotCard.TALONBANE_COBRA)
      {
         answer++;
      }
   }

   if (pilotInstance.card().key === PilotCard.FENN_RAU && rangeKey === Range.ONE)
   {
      answer++;
   }

   if (pilotInstance.card().key === PilotCard.GRAZ_THE_HUNTER)
   {
      var attackerPosition = environment.getPositionFor(attacker);
      var defenderPosition = environment.getPositionFor(pilotInstance);
      var firingArc = FiringArc.FORWARD;
      var isInFiringArc = weapon.isDefenderInFiringArc(defenderPosition, firingArc, attacker, attackerPosition);

      if (!isInFiringArc)
      {
         answer++;
      }
   }

   return answer;
};

PilotInstanceUtilities.maneuverKeys = function(pilotInstance)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);

   var answer;

   if (pilotInstance.isIonized())
   {
      answer = [Maneuver.STRAIGHT_1_STANDARD];
   }
   else
   {
      var ship = pilotInstance.ship();
      answer = ship.maneuverKeys.slice();

      if (pilotInstance.isCriticallyDamagedWith(DamageCard.SHAKEN_PILOT_V2))
      {
         // During the Planning phase, you cannot be assigned straight maneuvers. When you reveal a maneuver, flip this card facedown.
         answer = answer.filter(function(maneuverKey)
         {
            var maneuver = Maneuver.properties[maneuverKey];
            return maneuver.bearing !== Bearing.STRAIGHT;
         });
      }

      if (pilotInstance.isCriticallyDamagedWith(DamageCard.DAMAGED_ENGINE) ||
         pilotInstance.isCriticallyDamagedWith(DamageCard.DAMAGED_ENGINE_V2))
      {
         answer = pilotInstance._changeBearingManeuversToDifficulty(answer, Bearing.TURN_LEFT, Difficulty.HARD);
         answer = pilotInstance._changeBearingManeuversToDifficulty(answer, Bearing.TURN_RIGHT, Difficulty.HARD);
      }

      if (pilotInstance.card().key === PilotCard.ELLO_ASTY && !pilotInstance.isStressed())
      {
         answer = pilotInstance._changeBearingManeuversToDifficulty(answer, Bearing.TALLON_ROLL_LEFT, Difficulty.STANDARD);
         answer = pilotInstance._changeBearingManeuversToDifficulty(answer, Bearing.TALLON_ROLL_RIGHT, Difficulty.STANDARD);
      }

      if (pilotInstance.isUpgradedWith(UpgradeCard.NIEN_NUNB))
      {
         answer = pilotInstance._changeBearingManeuversToDifficulty(answer, Bearing.STRAIGHT, Difficulty.EASY);
      }

      if (pilotInstance.isUpgradedWith(UpgradeCard.R2_ASTROMECH))
      {
         answer = pilotInstance._changeSpeedManeuversToDifficulty(answer, 1, Difficulty.EASY);
         answer = pilotInstance._changeSpeedManeuversToDifficulty(answer, 2, Difficulty.EASY);
      }

      if (pilotInstance.isUpgradedWith(UpgradeCard.TWIN_ION_ENGINE_MKII))
      {
         answer = pilotInstance._changeBearingManeuversToDifficulty(answer, Bearing.BANK_LEFT, Difficulty.EASY);
         answer = pilotInstance._changeBearingManeuversToDifficulty(answer, Bearing.BANK_RIGHT, Difficulty.EASY);
      }

      if (pilotInstance.isUpgradedWith(UpgradeCard.UNHINGED_ASTROMECH))
      {
         answer = pilotInstance._changeSpeedManeuversToDifficulty(answer, 3, Difficulty.EASY);
      }

      if (pilotInstance.isStressed() && !pilotInstance.isUpgradedWith(UpgradeCard.HERA_SYNDULLA))
      {
         answer = answer.filter(function(maneuverKey)
         {
            return Maneuver.properties[maneuverKey].difficultyKey !== Difficulty.HARD;
         });
      }
   }

   return answer;
};

PilotInstanceUtilities.pilotName = function(pilotInstance, isShort)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);

   var answer = pilotInstance.id() + " " + PilotCard.getName(pilotInstance.card().key);

   if (!isShort)
   {
      var pilotName = pilotInstance.card().name;
      var shipName = pilotInstance.card().shipFaction.ship.name;

      if (!pilotName.startsWith(shipName))
      {
         answer += " (" + shipName + ")";
      }
   }

   return answer;
};

PilotInstanceUtilities.primaryWeapon = function(pilotInstance)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);

   var answer;
   var ship = pilotInstance.ship();

   if (ship && pilotInstance.primaryWeaponValue() !== undefined && ship.primaryWeaponRanges !== undefined)
   {
      answer = new Weapon("Primary Weapon", pilotInstance.primaryWeaponValue(), ship.primaryWeaponRanges, ship.primaryFiringArcKey, ship.auxiliaryFiringArcKey, ship.isPrimaryWeaponTurret);
   }

   return answer;
};

PilotInstanceUtilities.secondaryWeapons = function(pilotInstance)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);

   return pilotInstance.upgrades().reduce(function(accumulator, cardInstance)
   {
      var card = cardInstance.card();

      if (card.weaponValue !== undefined)
      {
         accumulator.push(new Weapon(card.name, card.weaponValue, card.rangeKeys, card.firingArcKey, undefined, card.isWeaponTurret, card));
      }

      return accumulator;
   }, []);
};

PilotInstanceUtilities.ship = function(pilotInstance)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);

   var answer;
   var pilot = pilotInstance.card();

   if (pilot && pilot.shipFaction)
   {
      answer = pilot.shipFaction.ship;

      if (pilot.key.endsWith(".fore"))
      {
         answer = answer.fore;
      }
      else if (pilot.key.endsWith(".aft"))
      {
         answer = answer.aft;
      }
      else if (pilot.key.endsWith(".crippledFore"))
      {
         answer = answer.crippledFore;
      }
      else if (pilot.key.endsWith(".crippledAft"))
      {
         answer = answer.crippledAft;
      }
   }

   return answer;
};

PilotInstanceUtilities.shipActions = function(pilotInstance)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);

   var answer = [];

   if (!pilotInstance.isCriticallyDamagedWith(DamageCard.DAMAGED_SENSOR_ARRAY_V2))
   {
      if (!pilotInstance.isCriticallyDamagedWith(DamageCard.DAMAGED_SENSOR_ARRAY))
      {
         ArrayUtilities.addAll(answer, pilotInstance.ship().shipActionKeys);
      }

      if (answer.includes(ShipAction.CLOAK) && pilotInstance.isCloaked())
      {
         ArrayUtilities.remove(answer, ShipAction.CLOAK);
      }

      if (pilotInstance.isUpgradedWith(UpgradeCard.BROADCAST_ARRAY))
      {
         answer.push(ShipAction.JAM);
      }

      if (pilotInstance.isUpgradedWith(UpgradeCard.BURNOUT_SLAM))
      {
         answer.push(ShipAction.SLAM);
      }

      if (pilotInstance.isUpgradedWith(UpgradeCard.ENGINE_UPGRADE))
      {
         answer.push(ShipAction.BOOST);
      }

      if (pilotInstance.isUpgradedWith(UpgradeCard.MILLENNIUM_FALCON))
      {
         answer.push(ShipAction.EVADE);
      }

      if (pilotInstance.isUpgradedWith(UpgradeCard.MIST_HUNTER))
      {
         answer.push(ShipAction.BARREL_ROLL);
      }

      if (pilotInstance.isUpgradedWith(UpgradeCard.TARGETING_COMPUTER))
      {
         answer.push(ShipAction.TARGET_LOCK);
      }

      if (pilotInstance.isUpgradedWith(UpgradeCard.VECTORED_THRUSTERS))
      {
         answer.push(ShipAction.BARREL_ROLL);
      }
   }

   return answer;
};

PilotInstanceUtilities.shipName = function(pilotInstance)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);

   return pilotInstance.card().shipFaction.ship.name;
};

PilotInstanceUtilities.upgrade = function(pilotInstance, upgradeKey)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);
   InputValidator.validateIsString("upgradeKey", upgradeKey);

   var upgradeInstances = pilotInstance.upgrades().filter(function(cardInstance)
   {
      return cardInstance.card().key === upgradeKey;
   });

   var answer;

   if (upgradeInstances.size > 0)
   {
      answer = upgradeInstances.get(0);
   }

   return answer;
};

export default PilotInstanceUtilities;