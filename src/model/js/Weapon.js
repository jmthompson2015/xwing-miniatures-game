"use strict";

define(["common/js/InputValidator", "artifact/js/FiringArc", "artifact/js/UpgradeHeader",
  "model/js/FiringComputer", "model/js/ManeuverComputer", "model/js/Position", "model/js/RangeRuler", "model/js/TargetLock"],
   function(InputValidator, FiringArc, UpgradeHeader,
      FiringComputer, ManeuverComputer, Position, RangeRuler, TargetLock)
   {
      function Weapon(name, weaponValue, rangeKeys, primaryFiringArcKey, auxiliaryFiringArcKey, isTurret, upgradeCard)
      {
         InputValidator.validateNotNull("name", name);
         InputValidator.validateNotNull("weaponValue", weaponValue);
         InputValidator.validateNotNull("rangeKeys", rangeKeys);
         InputValidator.validateNotNull("primaryFiringArcKey", primaryFiringArcKey);
         // auxiliaryFiringArcKey optional.
         // isTurret optional.
         // upgradeCard optional.

         this.name = function()
         {
            return name;
         };

         this.weaponValue = function()
         {
            return weaponValue;
         };

         this.rangeKeys = function()
         {
            return rangeKeys;
         };

         this.primaryFiringArcKey = function()
         {
            return primaryFiringArcKey;
         };

         this.auxiliaryFiringArcKey = function()
         {
            return auxiliaryFiringArcKey;
         };

         this.isTurret = function()
         {
            return isTurret;
         };

         this.upgradeKey = function()
         {
            return (upgradeCard !== undefined ? upgradeCard.key : undefined);
         };

         var primaryFiringArc = FiringArc.properties[primaryFiringArcKey];

         this.primaryFiringArc = function()
         {
            return primaryFiringArc;
         };

         var auxiliaryFiringArc = FiringArc.properties[auxiliaryFiringArcKey];

         this.auxiliaryFiringArc = function()
         {
            return auxiliaryFiringArc;
         };

         var upgrade = upgradeCard;

         this.upgrade = function()
         {
            return upgrade;
         };
      }

      Weapon.prototype.equals = function(another)
      {
         InputValidator.validateNotNull("another", another);

         var answer = this.name() === another.name();

         if (answer)
         {
            answer = this.weaponValue() === another.weaponValue();
         }

         return answer;
      };

      Weapon.prototype.isUsable = function(attacker, defender)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);

         var answer;
         var upgrade = this.upgrade();

         if (upgrade)
         {
            if (upgrade.isImplemented)
            {
               switch (upgrade.headerKey)
               {
                  case UpgradeHeader.ATTACK:
                     answer = true;
                     break;
                  case UpgradeHeader.ATTACK_FOCUS:
                     answer = (attacker.focusCount() > 0);
                     break;
                  case UpgradeHeader.ATTACK_TARGET_LOCK:
                     answer = (TargetLock.getFirst(attacker.store(), attacker, defender) !== undefined);
                     break;
                  default:
                     throw "Unknown upgrade header: " + upgrade.headerKey;
               }
            }
            else
            {
               answer = false;
            }
         }
         else
         {
            // Primary weapon.
            answer = true;
         }

         return answer;
      };

      Weapon.prototype.isDefenderInFiringArc = function(attackerPosition, firingArc, defender, defenderPosition)
      {
         InputValidator.validateNotNull("attackerPosition", attackerPosition);
         InputValidator.validateNotNull("firingArc", firingArc);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("defenderPosition", defenderPosition);

         var shipBase = defender.card().shipFaction.ship.shipBase;

         return FiringComputer.isInFiringArc(attackerPosition, firingArc, defenderPosition, shipBase);
      };

      Weapon.prototype.isDefenderInRange = function(attacker, attackerPosition, defender, defenderPosition)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("attackerPosition", attackerPosition);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("defenderPosition", defenderPosition);

         return FiringComputer.isInRange(this.rangeKeys(), attacker, attackerPosition, defender, defenderPosition);
      };

      Weapon.prototype.isDefenderTargetable = function(attacker, attackerPosition, defender, defenderPosition)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("attackerPosition", attackerPosition);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("defenderPosition", defenderPosition);

         return this.isUsable(attacker, defender) &&
            this.isDefenderInRange(attacker, attackerPosition, defender, defenderPosition) &&
            (this.isTurret() ||
               this.isDefenderInFiringArc(attackerPosition, this.primaryFiringArc(), defender, defenderPosition) ||
               (this.auxiliaryFiringArc() && this.isDefenderInFiringArc(attackerPosition, this.auxiliaryFiringArc(), defender, defenderPosition)));
      };

      Weapon.prototype.isPrimary = function()
      {
         return this.name() === "Primary Weapon";
      };

      Weapon.prototype.toString = function()
      {
         return this.name();
      };

      return Weapon;
   });
