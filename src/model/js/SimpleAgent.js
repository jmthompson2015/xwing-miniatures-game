"use strict";

define(["common/js/ArrayAugments", "common/js/InputValidator",
  "artifact/js/DamageCard", "artifact/js/DiceModification", "artifact/js/Maneuver", "artifact/js/Phase", "artifact/js/PilotCard", "artifact/js/PlayFormat", "artifact/js/Range", "artifact/js/Ship", "artifact/js/ShipAction", "artifact/js/UpgradeCard", "artifact/js/UpgradeHeader",
  "model/js/Ability", "model/js/DamageAbility2", "model/js/ManeuverComputer", "model/js/ModifyDiceAbility", "model/js/PilotAbility3", "model/js/RangeRuler", "model/js/ShipActionAbility", "model/js/TargetLock", "model/js/UpgradeAbility2", "model/js/UpgradeAbility3"],
   function(ArrayAugments, InputValidator,
      DamageCard, DiceModification, Maneuver, Phase, PilotCard, PlayFormat, Range, Ship, ShipAction, UpgradeCard, UpgradeHeader,
      Ability, DamageAbility2, ManeuverComputer, ModifyDiceAbility, PilotAbility3, RangeRuler, ShipActionAbility, TargetLock, UpgradeAbility2, UpgradeAbility3)
   {
      function SimpleAgent(name, factionKey)
      {
         InputValidator.validateNotEmpty("name", name);
         InputValidator.validateNotNull("factionKey", factionKey);

         this.name = function()
         {
            return name;
         };

         this.factionKey = function()
         {
            return factionKey;
         };
      }

      SimpleAgent.prototype.chooseAbility = function(environment, damageAbilities, pilotAbilities, upgradeAbilities, callback)
      {
         InputValidator.validateNotNull("environment", environment);
         InputValidator.validateNotNull("damageAbilities", damageAbilities);
         InputValidator.validateNotNull("pilotAbilities", pilotAbilities);
         InputValidator.validateNotNull("upgradeAbilities", upgradeAbilities);
         InputValidator.validateNotNull("callback", callback);

         var ability = (damageAbilities.length > 0 ? damageAbilities.xwingRandomElement() : undefined);

         if (ability === undefined)
         {
            ability = (upgradeAbilities.length > 0 ? upgradeAbilities.xwingRandomElement() : undefined);

            if (ability === undefined)
            {
               ability = (pilotAbilities.length > 0 ? pilotAbilities.xwingRandomElement() : undefined);
            }
         }

         var isAccepted = (ability !== undefined);

         callback(ability, isAccepted);
      };

      SimpleAgent.prototype.chooseWeaponAndDefender = function(environment, adjudicator, attacker, callback, weaponIn)
      {
         InputValidator.validateNotNull("environment", environment);
         InputValidator.validateNotNull("adjudicator", adjudicator);
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("callback", callback);
         // weapon optional.

         var weapon, defender;
         var attackerPosition = environment.getPositionFor(attacker);

         if (attackerPosition)
         {
            var choices = environment.createWeaponToRangeToDefenders(attacker, weaponIn);

            if (choices.length > 0)
            {
               var weaponData = choices.xwingRandomElement();
               var myWeapon = weaponData.weapon;

               // The first entry should be the closest.
               var rangeToDefenders = weaponData.rangeToDefenders;
               var defenders = rangeToDefenders[0].defenders;
               weapon = myWeapon;
               defender = defenders[0];
            }
         }

         callback(weapon, defender);
      };

      SimpleAgent.prototype.dealDamage = function()
      {
         // Nothing to do.
      };

      SimpleAgent.prototype.determineValidDecloakActions = function(environment, adjudicator, token)
      {
         InputValidator.validateNotNull("environment", environment);
         InputValidator.validateNotNull("adjudicator", adjudicator);
         InputValidator.validateNotNull("token", token);

         var answer = [];
         var maneuverKeys = [Maneuver.BARREL_ROLL_LEFT_2_STANDARD, Maneuver.STRAIGHT_2_STANDARD, Maneuver.BARREL_ROLL_RIGHT_2_STANDARD];

         maneuverKeys.forEach(function(maneuverKey)
         {
            if (adjudicator.canDecloak(token, maneuverKey))
            {
               var context = {
                  maneuverKey: maneuverKey,
               };
               answer.push(new Ability(ShipAction, ShipAction.DECLOAK, ShipActionAbility, ShipActionAbility.ABILITY_KEY, context));
            }
         });

         return answer;
      };

      SimpleAgent.prototype.determineValidManeuvers = function(environment, token)
      {
         InputValidator.validateNotNull("environment", environment);
         InputValidator.validateNotNull("token", token);

         var fromPosition = environment.getPositionFor(token);
         var shipBase = token.pilot().shipFaction.ship.shipBase;
         var playFormatKey = environment.playFormatKey();
         var maneuverKeys = token.maneuverKeys();

         // Find the maneuvers which keep the ship on the battlefield.
         return maneuverKeys.filter(function(maneuverKey)
         {
            var maneuver = Maneuver.properties[maneuverKey];
            var toPosition = ManeuverComputer.computeToPosition(playFormatKey, maneuver, fromPosition, shipBase);
            var polygon;

            if (toPosition)
            {
               polygon = ManeuverComputer.computePolygon(shipBase, toPosition.x(), toPosition.y(), toPosition.heading());
            }

            return (toPosition && PlayFormat.isPathInPlayArea(playFormatKey, polygon));
         });
      };

      SimpleAgent.prototype.determineValidModifyAttackDiceActions = function(store, attacker, defender)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);

         var answer = [];

         var usedDiceMods = attacker.usedAbilityKeys(DiceModification);

         DiceModification.keys().forEach(function(modificationKey)
         {
            if (!usedDiceMods.includes(modificationKey))
            {
               var modifyDiceAbility = ModifyDiceAbility[ModifyDiceAbility.ATTACK_KEY][modificationKey];

               if (modifyDiceAbility !== undefined && modifyDiceAbility.condition(store, attacker))
               {
                  answer.push(new Ability(DiceModification, modificationKey, ModifyDiceAbility, ModifyDiceAbility.ATTACK_KEY));
               }
            }
         });

         var pilotKey = attacker.pilot().key;

         if (!attacker.isAbilityUsed(PilotCard, pilotKey) && !attacker.isPerRoundAbilityUsed(PilotCard, pilotKey))
         {
            var pilotAbility = PilotAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][pilotKey];

            if (pilotAbility !== undefined && pilotAbility.condition(store, attacker))
            {
               answer.push(new Ability(PilotCard, pilotKey, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE));
            }
         }

         var attackerUsedUpgrades = attacker.usedAbilityKeys(UpgradeCard);
         attackerUsedUpgrades = attackerUsedUpgrades.concat(attacker.usedPerRoundAbilityKeys(UpgradeCard));

         attacker.upgradeKeys().forEach(function(upgradeKey)
         {
            if (!attackerUsedUpgrades.includes(upgradeKey))
            {
               var upgradeAbility = UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][upgradeKey];

               if (upgradeAbility !== undefined && upgradeAbility.condition(store, attacker))
               {
                  answer.push(new Ability(UpgradeCard, upgradeKey, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE));
               }
            }
         });

         return answer;
      };

      SimpleAgent.prototype.determineValidModifyDefenseDiceActions = function(store, attacker, defender)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);

         var answer = [];

         var usedDiceMods = defender.usedAbilityKeys(DiceModification);

         DiceModification.keys().forEach(function(modificationKey)
         {
            if (!usedDiceMods.includes(modificationKey))
            {
               var modifyDiceAbility = ModifyDiceAbility[ModifyDiceAbility.DEFENSE_KEY][modificationKey];

               if (modifyDiceAbility !== undefined && modifyDiceAbility.condition(store, defender))
               {
                  answer.push(new Ability(DiceModification, modificationKey, ModifyDiceAbility, ModifyDiceAbility.DEFENSE_KEY));
               }
            }
         });

         var pilotKey = defender.pilot().key;

         if (!defender.isAbilityUsed(PilotCard, pilotKey) && !defender.isPerRoundAbilityUsed(PilotCard, pilotKey))
         {
            var pilotAbility = PilotAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][pilotKey];

            if (pilotAbility !== undefined && pilotAbility.condition(store, defender))
            {
               answer.push(new Ability(PilotCard, pilotKey, PilotAbility3, Phase.COMBAT_MODIFY_DEFENSE_DICE));
            }
         }

         var defenderUsedUpgrades = attacker.usedAbilityKeys(UpgradeCard);
         defenderUsedUpgrades = defenderUsedUpgrades.concat(attacker.usedPerRoundAbilityKeys(UpgradeCard));

         defender.upgradeKeys().forEach(function(upgradeKey)
         {
            if (!defenderUsedUpgrades.includes(upgradeKey))
            {
               var upgradeAbility = UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][upgradeKey];

               if (upgradeAbility !== undefined && upgradeAbility.condition(store, defender))
               {
                  answer.push(new Ability(UpgradeCard, upgradeKey, UpgradeAbility3, Phase.COMBAT_MODIFY_DEFENSE_DICE));
               }
            }
         });

         return answer;
      };

      SimpleAgent.prototype.determineValidShipActions = function(environment, adjudicator, token, shipActionKeys0)
      {
         InputValidator.validateNotNull("environment", environment);
         InputValidator.validateNotNull("adjudicator", adjudicator);
         InputValidator.validateNotNull("token", token);

         var answer = [];

         if (!adjudicator.canSelectShipAction(token))
         {
            return answer;
         }

         var shipActionKeys = (shipActionKeys0 !== undefined ? shipActionKeys0 : token.shipActions());
         var store = environment.store();
         var usedShipActionKeys = token.usedPerRoundAbilityKeys(ShipAction);
         shipActionKeys = shipActionKeys.filter(function(shipActionKey)
         {
            return !usedShipActionKeys.includes(shipActionKey);
         });

         var context;
         var maneuverKeysMap = {};
         maneuverKeysMap[ShipAction.BARREL_ROLL] = [Maneuver.BARREL_ROLL_LEFT_1_STANDARD, Maneuver.BARREL_ROLL_RIGHT_1_STANDARD];
         maneuverKeysMap[ShipAction.BOOST] = [Maneuver.BANK_LEFT_1_STANDARD, Maneuver.STRAIGHT_1_STANDARD, Maneuver.BANK_RIGHT_1_STANDARD];
         maneuverKeysMap[ShipAction.SLAM] = token.pilot().shipFaction.ship.maneuverKeys;
         var canDoItMap = {};
         canDoItMap[ShipAction.BARREL_ROLL] = function(maneuverKey)
         {
            return adjudicator.canBarrelRoll(token, maneuverKey);
         };
         canDoItMap[ShipAction.BOOST] = function(maneuverKey)
         {
            return adjudicator.canBoost(token, maneuverKey);
         };
         canDoItMap[ShipAction.SLAM] = function(maneuverKey)
         {
            return adjudicator.canSlam(token, maneuverKey);
         };
         var tokens;

         shipActionKeys.forEach(function(shipActionKey)
         {
            switch (shipActionKey)
            {
               case ShipAction.BARREL_ROLL:
               case ShipAction.BOOST:
               case ShipAction.SLAM:
                  maneuverKeysMap[shipActionKey].forEach(function(maneuverKey)
                  {
                     if (canDoItMap[shipActionKey](maneuverKey))
                     {
                        context = {
                           maneuverKey: maneuverKey,
                        };
                        answer.push(new Ability(ShipAction, shipActionKey, ShipActionAbility, ShipActionAbility.ABILITY_KEY, context));
                     }
                  });
                  break;
               case ShipAction.CLOAK:
               case ShipAction.EVADE:
               case ShipAction.FOCUS:
                  answer.push(new Ability(ShipAction, shipActionKey, ShipActionAbility, ShipActionAbility.ABILITY_KEY));
                  break;
               case ShipAction.COORDINATE:
                  tokens = environment.getFriendlyTokensAtRange(token, Range.ONE);
                  tokens = tokens.concat(environment.getFriendlyTokensAtRange(token, Range.TWO));
                  tokens.forEach(function(myToken)
                  {
                     if (myToken !== token && (token.parent === undefined || token.parent !== myToken))
                     {
                        context = {
                           token: myToken,
                        };
                        answer.push(new Ability(ShipAction, shipActionKey, ShipActionAbility, ShipActionAbility.ABILITY_KEY, context));
                     }
                  });
                  break;
               case ShipAction.JAM:
                  tokens = environment.getUnfriendlyTokensAtRange(token, Range.ONE);
                  tokens = tokens.concat(environment.getUnfriendlyTokensAtRange(token, Range.TWO));
                  tokens.forEach(function(myToken)
                  {
                     var isHuge = myToken.isHuge();

                     if (!isHuge && myToken.stressCount() < 2)
                     {
                        context = {
                           defender: myToken,
                        };
                        answer.push(new Ability(ShipAction, shipActionKey, ShipActionAbility, ShipActionAbility.ABILITY_KEY, context));
                     }
                  });
                  break;
               case ShipAction.RECOVER:
               case ShipAction.REINFORCE:
                  if (token.parent !== undefined)
                  {
                     if (!token.parent.tokenFore().isDestroyed())
                     {
                        context = {
                           token: token.parent.tokenFore(),
                        };
                        answer.push(new Ability(ShipAction, shipActionKey, ShipActionAbility, ShipActionAbility.ABILITY_KEY, context));
                     }
                     if (!token.parent.tokenAft().isDestroyed())
                     {
                        context = {
                           token: token.parent.tokenAft(),
                        };
                        answer.push(new Ability(ShipAction, shipActionKey, ShipActionAbility, ShipActionAbility.ABILITY_KEY, context));
                     }
                  }
                  else
                  {
                     context = {
                        token: token,
                     };
                     answer.push(new Ability(ShipAction, shipActionKey, ShipActionAbility, ShipActionAbility.ABILITY_KEY, context));
                  }
                  break;
               case ShipAction.ROTATE_ARC:
                  // FIXME: implement ship action rotate arc.
                  break;
               case ShipAction.TARGET_LOCK:
                  var defenders = environment.getDefendersInRange(token);
                  defenders.forEach(function(defender)
                  {
                     // Only put choices without a current target lock.
                     if (TargetLock.getFirst(store, token, defender) === undefined)
                     {
                        context = {
                           attacker: token,
                           defender: defender,
                        };
                        answer.push(new Ability(ShipAction, shipActionKey, ShipActionAbility, ShipActionAbility.ABILITY_KEY, context));
                     }
                  });
                  break;
               default:
                  throw "Unhandled ship action: shipActionKey = " + shipActionKey + " token = " + token;
            }
         });

         if (shipActionKeys0 === undefined)
         {
            var phaseKey = Phase.ACTIVATION_PERFORM_ACTION;
            var usedUpgradeKeys = token.usedPerRoundAbilityKeys(UpgradeCard);

            token.upgradeKeys().forEach(function(upgradeKey)
            {
               var myUpgrade = UpgradeCard.properties[upgradeKey];

               if (myUpgrade && myUpgrade.headerKey === UpgradeHeader.ACTION)
               {
                  var myAbility = UpgradeAbility2[phaseKey][upgradeKey];

                  if (myAbility !== undefined && !usedUpgradeKeys.includes(upgradeKey) && myAbility.condition(store, token))
                  {
                     answer.push(new Ability(UpgradeCard, upgradeKey, UpgradeAbility2, phaseKey));
                  }
               }
            });

            var usedDamageKeys = token.usedPerRoundAbilityKeys(DamageCard);

            token.criticalDamageKeys().forEach(function(damageKey)
            {
               var myDamage = DamageCard.properties[damageKey];

               if (myDamage && myDamage.hasAction)
               {
                  var myAbility = DamageAbility2[phaseKey][damageKey];

                  if (myAbility !== undefined && !usedDamageKeys.includes(damageKey) && myAbility.condition(store, token))
                  {
                     answer.push(new Ability(DamageCard, damageKey, DamageAbility2, phaseKey));
                  }
               }
            });
         }

         LOGGER.debug("SimpleAgent.determineValidShipActions() answer = " + answer);

         return answer;
      };

      SimpleAgent.prototype.getDecloakAction = function(environment, adjudicator, token, callback)
      {
         InputValidator.validateNotNull("environment", environment);
         InputValidator.validateNotNull("adjudicator", adjudicator);
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("callback", callback);

         var decloakActions = this.determineValidDecloakActions(environment, adjudicator, token);
         var answer = decloakActions.xwingRandomElement();

         callback(token, answer);
      };

      SimpleAgent.prototype.getModifyAttackDiceAction = function(store, adjudicator, attacker, defender, callback)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateNotNull("adjudicator", adjudicator);
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("callback", callback);

         var modifications = this.determineValidModifyAttackDiceActions(store, attacker, defender);
         var answer = modifications.xwingRandomElement();
         var isAccepted = (answer !== undefined);

         callback(answer, isAccepted);
      };

      SimpleAgent.prototype.getModifyDefenseDiceAction = function(store, adjudicator, attacker, defender, callback)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateNotNull("adjudicator", adjudicator);
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("callback", callback);

         var modifications = this.determineValidModifyDefenseDiceActions(store, attacker, defender);
         var answer = modifications.xwingRandomElement();
         var isAccepted = (answer !== undefined);

         callback(answer, isAccepted);
      };

      SimpleAgent.prototype.getPlanningAction = function(environment, adjudicator, callback)
      {
         InputValidator.validateNotNull("environment", environment);
         InputValidator.validateNotNull("adjudicator", adjudicator);
         InputValidator.validateNotNull("callback", callback);

         var faction = this.factionKey();
         var tokens = environment.getTokensForFaction(faction);
         var tokenToManeuver = {};

         tokens.forEach(function(token)
         {
            var validManeuvers = this.determineValidManeuvers(environment, token);

            LOGGER.trace("validManeuvers.length = " + validManeuvers.length + " for " + token);
            var maneuver = validManeuvers.xwingRandomElement();

            LOGGER.trace("0 maneuver = " + maneuver + " for " + token);

            if (!maneuver)
            {
               // Ship fled the battlefield.
               var maneuvers = token.maneuverKeys();
               maneuver = maneuvers.xwingRandomElement();
               LOGGER.trace("1 maneuver = " + maneuver + " for " + token);
            }

            tokenToManeuver[token] = maneuver;
         }, this);

         callback(tokenToManeuver);
      };

      SimpleAgent.prototype.getShipAction = function(environment, adjudicator, token, callback, shipActionKeys0)
      {
         InputValidator.validateNotNull("environment", environment);
         InputValidator.validateNotNull("adjudicator", adjudicator);
         InputValidator.validateNotNull("token", token);
         // shipActionKeys0 optional.

         var shipActionKeys = this.determineValidShipActions(environment, adjudicator, token, shipActionKeys0);
         var answer = shipActionKeys.xwingRandomElement();
         var isAccepted = (answer !== undefined);

         callback(answer, isAccepted);
      };

      SimpleAgent.prototype.isComputerAgent = function()
      {
         return true;
      };

      SimpleAgent.prototype.toString = function()
      {
         return this.name() + ", SimpleAgent, " + this.factionKey();
      };

      return SimpleAgent;
   });
