"use strict";

define(["immutable", "common/js/ArrayAugments", "common/js/InputValidator",
  "artifact/js/Bearing", "artifact/js/CardResolver", "artifact/js/CardType", "artifact/js/ConditionCard", "artifact/js/Count", "artifact/js/DamageCard", "artifact/js/Difficulty", "artifact/js/Event", "artifact/js/FiringArc", "artifact/js/Maneuver", "artifact/js/PilotCard", "artifact/js/Range", "artifact/js/ShipAction", "artifact/js/ShipBase", "artifact/js/UpgradeCard", "artifact/js/Value",
  "model/js/Ability", "model/js/Action", "model/js/AgentAction", "model/js/CardAction", "model/js/RangeRuler", "model/js/TargetLock", "model/js/Weapon"],
   function(Immutable, ArrayAugments, InputValidator,
      Bearing, CardResolver, CardType, ConditionCard, Count, DamageCard, Difficulty, Event, FiringArc, Maneuver, PilotCard, Range, ShipAction, ShipBase, UpgradeCard, Value,
      Ability, Action, AgentAction, CardAction, RangeRuler, TargetLock, Weapon)
   {
      function CardInstance(store, cardOrKey, agent, upgradeKeysIn, idIn, isNewIn)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateNotNull("cardOrKey", cardOrKey);
         // agent optional.
         // upgradeKeys optional.
         // idIn optional. default: determined from store
         // isNewIn optional. default: true

         var card;

         if (typeof cardOrKey === "string")
         {
            var cardKey = cardOrKey;
            card = PilotCard.properties[cardKey];

            if (card === undefined)
            {
               card = UpgradeCard.properties[cardKey];
            }

            if (card === undefined)
            {
               card = DamageCard.properties[cardKey];
            }

            if (card === undefined)
            {
               card = ConditionCard.properties[cardKey];
            }
         }
         else
         {
            card = cardOrKey;
         }

         var id = idIn;

         if (isNaN(id))
         {
            id = store.getState().nextCardId;
            store.dispatch(CardAction.incrementNextCardId());
         }

         this.store = function()
         {
            return store;
         };

         this.id = function()
         {
            return id;
         };

         this.card = function()
         {
            return card;
         };

         this.agent = function()
         {
            return agent;
         };

         var isNew = (isNewIn !== undefined ? isNewIn : true);

         if (isNew)
         {
            var upgradeKeys = (upgradeKeysIn ? upgradeKeysIn : Immutable.List());
            this._save(upgradeKeys);
         }
      }

      //////////////////////////////////////////////////////////////////////////
      // Accessor methods.

      CardInstance.prototype.agilityValue = function()
      {
         var base = this.baseAgilityValue();
         var bonus = this.bonusAgilityValue();

         return (base !== undefined && bonus !== undefined ? base + bonus : undefined);
      };

      CardInstance.prototype.attackerTargetLocks = function()
      {
         var store = this.store();

         return TargetLock.getByAttacker(store, this);
      };

      CardInstance.prototype.baseAgilityValue = function()
      {
         return this.value(Value.AGILITY);
      };

      CardInstance.prototype.baseEnergyValue = function()
      {
         return this.value(Value.ENERGY);
      };

      CardInstance.prototype.baseHullValue = function()
      {
         return this.value(Value.HULL);
      };

      CardInstance.prototype.basePilotSkillValue = function()
      {
         return this.value(Value.PILOT_SKILL);
      };

      CardInstance.prototype.basePrimaryWeaponValue = function()
      {
         return this.value(Value.PRIMARY_WEAPON);
      };

      CardInstance.prototype.baseShieldValue = function()
      {
         return this.value(Value.SHIELD);
      };

      CardInstance.prototype.bonusAgilityValue = function()
      {
         var answer = this._bonusValue(Value.AGILITY);

         if (this.isCloaked())
         {
            answer += 2;
         }

         if (this.isUpgradedWith(UpgradeCard.COMMANDER_KENKIRK) && this.shieldCount() === 0 && (this.damageCount() > 0 || this.criticalDamageCount() > 0))
         {
            answer++;
         }

         if (this.isAbilityUsed(UpgradeCard, UpgradeCard.EXPOSE))
         {
            answer--;
         }

         if (this.isAbilityUsed(UpgradeCard, UpgradeCard.R2_F2))
         {
            answer++;
         }

         answer -= this.tractorBeamCount();

         return answer;
      };

      CardInstance.prototype.bonusEnergyValue = function()
      {
         return this._bonusValue(Value.ENERGY);
      };

      CardInstance.prototype.bonusHullValue = function()
      {
         return this._bonusValue(Value.HULL);
      };

      CardInstance.prototype.bonusPilotSkillValue = function()
      {
         var answer = this._bonusValue(Value.PILOT_SKILL);

         if (this.card().key === PilotCard.EPSILON_ACE)
         {
            var damageCount = this.damageCount();
            var criticalDamageCount = this.criticalDamageCount();
            if (damageCount === 0 && criticalDamageCount === 0)
            {
               answer = 12 - this.basePilotSkillValue();
            }
         }

         if (this.isCriticallyDamagedWith(DamageCard.DAMAGED_COCKPIT) || this.isCriticallyDamagedWith(DamageCard.INJURED_PILOT))
         {
            answer = -this.basePilotSkillValue();
         }

         return answer;
      };

      CardInstance.prototype.bonusPrimaryWeaponValue = function()
      {
         var answer = this._bonusValue(Value.PRIMARY_WEAPON);

         if (this.isAbilityUsed(UpgradeCard, UpgradeCard.EXPOSE))
         {
            answer++;
         }

         return answer;
      };

      CardInstance.prototype.bonusShieldValue = function()
      {
         return this._bonusValue(Value.SHIELD);
      };

      CardInstance.prototype.cloakCount = function()
      {
         return this.count(Count.CLOAK);
      };

      CardInstance.prototype.computeAttackDiceCount = function(environment, weapon, defender, rangeKey)
      {
         InputValidator.validateNotNull("environment", environment);
         InputValidator.validateNotNull("weapon", weapon);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("rangeKey", rangeKey);

         var answer;

         if (this.isCriticallyDamagedWith(DamageCard.BLINDED_PILOT))
         {
            answer = 0;
            var damageInstance = this.criticalDamage(DamageCard.BLINDED_PILOT);
            this.flipDamageCardFacedown(damageInstance);
         }
         else
         {
            answer = weapon.weaponValue();

            if (rangeKey === Range.ONE && weapon.isPrimary() && defender.card().key !== PilotCard.ZERTIK_STROM)
            {
               // Bonus attack die at range one.
               answer++;

               if (this.card().key === PilotCard.TALONBANE_COBRA)
               {
                  answer++;
               }
            }

            var attackerPosition = environment.getPositionFor(this);
            var defenderPosition = environment.getPositionFor(defender);
            var firingArc, isInFiringArc;

            if (this.card().key === PilotCard.BACKSTABBER)
            {
               firingArc = FiringArc.FORWARD;
               isInFiringArc = weapon.isDefenderInFiringArc(defenderPosition, firingArc, this, attackerPosition);

               if (!isInFiringArc)
               {
                  answer++;
               }
            }

            if (this.card().key === PilotCard.EADEN_VRILL && weapon.isPrimary() && defender.isStressed())
            {
               answer++;
            }

            if (this.card().key === PilotCard.FENN_RAU && rangeKey === Range.ONE)
            {
               answer++;
            }

            if (this.card().key === PilotCard.KAVIL)
            {
               firingArc = weapon.primaryFiringArc();
               isInFiringArc = weapon.isDefenderInFiringArc(attackerPosition, firingArc, defender, defenderPosition);

               if (!isInFiringArc)
               {
                  answer++;
               }
            }

            if (this.card().key === PilotCard.MAULER_MITHEL && rangeKey === Range.ONE)
            {
               answer++;
            }

            if (this.card().key === PilotCard.NDRU_SUHLAK && environment.getFriendlyTokensAtRange(this, Range.ONE).length === 0 && environment.getFriendlyTokensAtRange(this, Range.TWO).length === 0)
            {
               answer++;
            }

            if (this.card().key === PilotCard.SCOURGE && (defender.damageCount() > 0 || defender.criticalDamageCount() > 0))
            {
               answer++;
            }

            if (weapon.upgradeKey() === UpgradeCard.DORSAL_TURRET && rangeKey === Range.ONE)
            {
               answer++;
            }

            if (weapon.upgradeKey() === UpgradeCard.PROTON_ROCKETS)
            {
               answer += Math.min(this.agilityValue(), 3);
            }

            if (this.isCriticallyDamagedWith(DamageCard.WEAPONS_FAILURE_V2))
            {
               answer -= 1;
            }
         }

         return answer;
      };

      CardInstance.prototype.computeDefenseDiceCount = function(environment, attacker, weapon, rangeKey)
      {
         var answer = this.agilityValue();

         if ([Range.THREE, RangeRuler.FOUR, RangeRuler.FIVE].includes(rangeKey) && weapon.isPrimary())
         {
            // Bonus defense die at range three, four, and five.
            answer++;

            if (this.card().key === PilotCard.TALONBANE_COBRA)
            {
               answer++;
            }
         }

         if (this.card().key === PilotCard.FENN_RAU && rangeKey === Range.ONE)
         {
            answer++;
         }

         if (this.card().key === PilotCard.GRAZ_THE_HUNTER)
         {
            var attackerPosition = environment.getPositionFor(attacker);
            var defenderPosition = environment.getPositionFor(this);
            var firingArc = FiringArc.FORWARD;
            var isInFiringArc = weapon.isDefenderInFiringArc(defenderPosition, firingArc, attacker, attackerPosition);

            if (!isInFiringArc)
            {
               answer++;
            }
         }

         return answer;
      };

      CardInstance.prototype.count = function(property)
      {
         InputValidator.validateNotNull("property", property);

         var state = this.state();
         var id = this.id();
         var counts = state.cardCounts.get(id);
         var answer;

         if (counts)
         {
            answer = counts.get(property);
         }

         return answer;
      };

      CardInstance.prototype.criticalDamage = function(damageKey)
      {
         InputValidator.validateIsString("damageKey", damageKey);

         var damageInstances = this.criticalDamages().filter(function(cardInstance)
         {
            return cardInstance.card().key === damageKey;
         });

         var answer;

         if (damageInstances.size > 0)
         {
            answer = damageInstances.get(0);
         }

         return answer;
      };

      CardInstance.prototype.criticalDamageCount = function()
      {
         return this.criticalDamages().size;
      };

      CardInstance.prototype.criticalDamageKeys = function()
      {
         return CardInstance.cardInstancesToKeys(this.criticalDamages());
      };

      CardInstance.prototype.criticalDamages = function()
      {
         return this.damageInstances().filter(function(cardInstance)
         {
            return cardInstance.isFaceUp();
         });
      };

      CardInstance.prototype.damage = function(damageKey)
      {
         InputValidator.validateIsString("damageKey", damageKey);

         var damageInstances = this.damages().filter(function(cardInstance)
         {
            return cardInstance.card().key === damageKey;
         });

         var answer;

         if (damageInstances.size > 0)
         {
            answer = damageInstances.get(0);
         }

         return answer;
      };

      CardInstance.prototype.damageCount = function()
      {
         return this.damages().size;
      };

      CardInstance.prototype.damageInstances = function()
      {
         var store = this.store();
         var ids = store.getState().cardDamages.get(this.id());

         return CardInstance.idsToCardInstances(store, ids);
      };

      CardInstance.prototype.damageKeys = function()
      {
         return CardInstance.cardInstancesToKeys(this.damages());
      };

      CardInstance.prototype.damages = function()
      {
         return this.damageInstances().filter(function(cardInstance)
         {
            return !cardInstance.isFaceUp();
         });
      };

      CardInstance.prototype.defenderTargetLocks = function()
      {
         var store = this.store();

         return TargetLock.getByDefender(store, this);
      };

      CardInstance.prototype.energyCount = function()
      {
         return this.count(Count.ENERGY);
      };

      CardInstance.prototype.energyValue = function()
      {
         var base = this.baseEnergyValue();
         var bonus = this.bonusEnergyValue();

         return (base !== undefined && bonus !== undefined ? base + bonus : undefined);
      };

      CardInstance.prototype.equals = function(other)
      {
         var answer = false;

         if (other)
         {
            answer = this.id() == other.id() && this.card().key == other.card().key;
         }

         return answer;
      };

      CardInstance.prototype.evadeCount = function()
      {
         return this.count(Count.EVADE);
      };

      CardInstance.prototype.focusCount = function()
      {
         return this.count(Count.FOCUS);
      };

      CardInstance.prototype.hullValue = function()
      {
         var base = this.baseHullValue();
         var bonus = this.bonusHullValue();

         return (base !== undefined && bonus !== undefined ? base + bonus : undefined);
      };

      CardInstance.prototype.ionCount = function()
      {
         return this.count(Count.ION);
      };

      CardInstance.prototype.isAbilityUsed = function(source, sourceKey)
      {
         InputValidator.validateNotNull("source", source);
         InputValidator.validateNotNull("sourceKey", sourceKey);

         var state = this.state();
         var usedAbilities = state.cardUsedAbilities.get(this.id());
         var answer = false;

         for (var i = 0; !answer && i < usedAbilities.size; i++)
         {
            var ability = usedAbilities.get(i);
            answer = (ability.source() === source && ability.sourceKey() === sourceKey);
         }

         return answer;
      };

      CardInstance.prototype.isChild = function()
      {
         var key = this.card().key;

         return key.endsWith(".fore") || key.endsWith(".aft");
      };

      CardInstance.prototype.isCloaked = function()
      {
         return this.cloakCount() > 0;
      };

      CardInstance.prototype.isCriticallyDamagedWith = function(damageKey)
      {
         var criticalDamageKeys = this.criticalDamageKeys();

         return criticalDamageKeys.includes(damageKey);
      };

      CardInstance.prototype.isDestroyed = function()
      {
         return this.totalDamage() >= this.hullValue();
      };

      CardInstance.prototype.isFaceUp = function()
      {
         var store = this.store();
         var answer = store.getState().cardIsFaceUp.get(this.id());

         return (answer !== undefined ? answer : true);
      };

      CardInstance.prototype.isHuge = function()
      {
         return ShipBase.isHuge(this.ship().shipBaseKey) || (this.parent !== undefined);
      };

      CardInstance.prototype.isIonized = function()
      {
         return this.ionCount() > 0;
      };

      CardInstance.prototype.isPerRoundAbilityUsed = function(source, sourceKey)
      {
         InputValidator.validateNotNull("source", source);
         InputValidator.validateNotNull("sourceKey", sourceKey);

         var state = this.state();
         var usedAbilities = state.cardUsedPerRoundAbilities.get(this.id());
         var answer = false;

         for (var i = 0; !answer && i < usedAbilities.size; i++)
         {
            var ability = usedAbilities.get(i);
            answer = (ability.source() === source && ability.sourceKey() === sourceKey);
         }

         return answer;
      };

      CardInstance.prototype.isStressed = function()
      {
         return this.stressCount() > 0;
      };

      CardInstance.prototype.isUpgradedWith = function(upgradeKey)
      {
         return this.upgradeKeys().includes(upgradeKey);
      };

      CardInstance.prototype.maneuverKeys = function()
      {
         var answer;

         if (this.isIonized())
         {
            answer = [Maneuver.STRAIGHT_1_STANDARD];
         }
         else
         {
            var ship = this.ship();
            answer = ship.maneuverKeys.slice();

            if (this.isCriticallyDamagedWith(DamageCard.SHAKEN_PILOT_V2))
            {
               // During the Planning phase, you cannot be assigned straight maneuvers. When you reveal a maneuver, flip this card facedown.
               answer = answer.filter(function(maneuverKey)
               {
                  var maneuver = Maneuver.properties[maneuverKey];
                  return maneuver.bearing !== Bearing.STRAIGHT;
               });
            }

            if (this.isCriticallyDamagedWith(DamageCard.DAMAGED_ENGINE) ||
               this.isCriticallyDamagedWith(DamageCard.DAMAGED_ENGINE_V2))
            {
               answer = this._changeBearingManeuversToDifficulty(answer, Bearing.TURN_LEFT, Difficulty.HARD);
               answer = this._changeBearingManeuversToDifficulty(answer, Bearing.TURN_RIGHT, Difficulty.HARD);
            }

            if (this.card().key === PilotCard.ELLO_ASTY && !this.isStressed())
            {
               answer = this._changeBearingManeuversToDifficulty(answer, Bearing.TALLON_ROLL_LEFT, Difficulty.STANDARD);
               answer = this._changeBearingManeuversToDifficulty(answer, Bearing.TALLON_ROLL_RIGHT, Difficulty.STANDARD);
            }

            if (this.isUpgradedWith(UpgradeCard.NIEN_NUNB))
            {
               answer = this._changeBearingManeuversToDifficulty(answer, Bearing.STRAIGHT, Difficulty.EASY);
            }

            if (this.isUpgradedWith(UpgradeCard.R2_ASTROMECH))
            {
               answer = this._changeSpeedManeuversToDifficulty(answer, 1, Difficulty.EASY);
               answer = this._changeSpeedManeuversToDifficulty(answer, 2, Difficulty.EASY);
            }

            if (this.isUpgradedWith(UpgradeCard.TWIN_ION_ENGINE_MK_II))
            {
               answer = this._changeBearingManeuversToDifficulty(answer, Bearing.BANK_LEFT, Difficulty.EASY);
               answer = this._changeBearingManeuversToDifficulty(answer, Bearing.BANK_RIGHT, Difficulty.EASY);
            }

            if (this.isUpgradedWith(UpgradeCard.UNHINGED_ASTROMECH))
            {
               answer = this._changeSpeedManeuversToDifficulty(answer, 3, Difficulty.EASY);
            }

            if (this.isStressed() && !this.isUpgradedWith(UpgradeCard.HERA_SYNDULLA))
            {
               answer = answer.filter(function(maneuverKey)
               {
                  return Maneuver.properties[maneuverKey].difficultyKey !== Difficulty.HARD;
               });
            }
         }

         return answer;
      };

      CardInstance.prototype.name = function()
      {
         var answer;

         switch (this.card().cardTypeKey)
         {
            case CardType.CONDITION:
               var conditionName = this.card().name;
               answer = this.id() + " " + conditionName;
               break;
            case CardType.DAMAGE:
               var damageName = this.card().name;
               answer = this.id() + " " + damageName;
               break;
            case CardType.PILOT:
               var pilotName = this.card().name;
               var shipName = this.card().shipFaction.ship.name;
               answer = this.id() + " " + pilotName;

               if (!pilotName.startsWith(shipName))
               {
                  answer += " (" + shipName + ")";
               }
               break;
            case CardType.UPGRADE:
               var upgradeName = this.card().name;
               answer = this.id() + " " + upgradeName;
               break;
         }

         return answer;
      };

      CardInstance.prototype.pilotName = function()
      {
         var answer = this.id() + " ";

         if (this.card().isUnique)
         {
            answer += "\u2022 ";
         }

         answer += this.card().name;

         return answer;
      };

      CardInstance.prototype.pilotSkillValue = function()
      {
         var base = this.basePilotSkillValue();
         var bonus = this.bonusPilotSkillValue();

         return (base !== undefined && bonus !== undefined ? base + bonus : undefined);
      };

      CardInstance.prototype.primaryWeapon = function()
      {
         var answer;
         var ship = this.ship();

         if (ship)
         {
            var primaryWeaponValue = this.primaryWeaponValue();

            if (primaryWeaponValue !== undefined)
            {
               answer = new Weapon("Primary Weapon", primaryWeaponValue, ship.primaryWeaponRanges, ship.primaryFiringArcKey, ship.auxiliaryFiringArcKey, ship.isPrimaryWeaponTurret);
            }
         }

         return answer;
      };

      CardInstance.prototype.primaryWeaponValue = function()
      {
         var base = this.basePrimaryWeaponValue();
         var bonus = this.bonusPrimaryWeaponValue();

         return (base !== undefined && bonus !== undefined ? base + bonus : undefined);
      };

      CardInstance.prototype.reinforceCount = function()
      {
         return this.count(Count.REINFORCE);
      };

      CardInstance.prototype.secondaryWeapons = function()
      {
         return this.upgrades().reduce(function(accumulator, cardInstance)
         {
            var card = cardInstance.card();

            if (card.weaponValue !== undefined)
            {
               accumulator.push(new Weapon(card.name, card.weaponValue, card.rangeKeys, card.firingArcKey, undefined, card.isWeaponTurret, card));
            }

            return accumulator;
         }, []);
      };

      CardInstance.prototype.shieldCount = function()
      {
         return this.count(Count.SHIELD);
      };

      CardInstance.prototype.shieldValue = function()
      {
         var base = this.baseShieldValue();
         var bonus = this.bonusShieldValue();

         return (base !== undefined && bonus !== undefined ? base + bonus : undefined);
      };

      CardInstance.prototype.ship = function()
      {
         var ship;
         var pilot = this.card();

         if (pilot && pilot.shipFaction)
         {
            ship = pilot.shipFaction.ship;

            if (pilot.key.endsWith(".fore"))
            {
               ship = ship.fore;
            }
            else if (pilot.key.endsWith(".aft"))
            {
               ship = ship.aft;
            }
            else if (pilot.key.endsWith(".crippledFore"))
            {
               ship = ship.crippledFore;
            }
            else if (pilot.key.endsWith(".crippledAft"))
            {
               ship = ship.crippledAft;
            }
         }

         return ship;
      };

      CardInstance.prototype.shipActions = function()
      {
         var answer = [];

         if (!this.isCriticallyDamagedWith(DamageCard.DAMAGED_SENSOR_ARRAY_V2))
         {
            if (!this.isCriticallyDamagedWith(DamageCard.DAMAGED_SENSOR_ARRAY))
            {
               answer.xwingAddAll(this.ship().shipActionKeys);
            }

            if (answer.includes(ShipAction.CLOAK) && this.isCloaked())
            {
               answer.xwingRemove(ShipAction.CLOAK);
            }

            if (this.isUpgradedWith(UpgradeCard.MIST_HUNTER))
            {
               answer.push(ShipAction.BARREL_ROLL);
            }

            if (this.isUpgradedWith(UpgradeCard.ENGINE_UPGRADE))
            {
               answer.push(ShipAction.BOOST);
            }

            if (this.isUpgradedWith(UpgradeCard.MILLENNIUM_FALCON))
            {
               answer.push(ShipAction.EVADE);
            }

            if (this.isUpgradedWith(UpgradeCard.BROADCAST_ARRAY))
            {
               answer.push(ShipAction.JAM);
            }

            if (this.isUpgradedWith(UpgradeCard.TARGETING_COMPUTER))
            {
               answer.push(ShipAction.TARGET_LOCK);
            }
         }

         return answer;
      };

      CardInstance.prototype.shipName = function()
      {
         return this.card().shipFaction.ship.name;
      };

      CardInstance.prototype.shipState = function(property)
      {
         InputValidator.validateNotNull("property", property);

         var propertyName = property + "Value";
         var pilot = this.card();
         var ship = this.ship();
         var answer = pilot[propertyName];

         if (answer === undefined && ship)
         {
            answer = ship[propertyName];
         }

         if (answer === undefined && ship && ship.fore)
         {
            answer = ship.fore[propertyName];
         }

         if (answer === undefined && ship && ship.aft)
         {
            answer = ship.aft[propertyName];
         }

         return (answer !== undefined ? answer : null);
      };

      CardInstance.prototype.squadPointCost = function()
      {
         var answer = this.upgrades().reduce(function(accumulator, upgrade)
         {
            return accumulator + upgrade.squadPointCost();
         }, this.card().squadPointCost);

         return answer;
      };

      CardInstance.prototype.state = function()
      {
         var store = this.store();

         return store.getState();
      };

      CardInstance.prototype.stressCount = function()
      {
         return this.count(Count.STRESS);
      };

      CardInstance.prototype.toString = function()
      {
         return this.name() + " " + this.card().cardTypeKey;
      };

      CardInstance.prototype.totalDamage = function()
      {
         var answer = this.damageCount();

         answer += this.criticalDamageKeys().reduce(function(accumulator, currentValue)
         {
            return accumulator + ([DamageCard.DIRECT_HIT, DamageCard.DIRECT_HIT_V2].includes(currentValue) ? 2 : 1);
         }, 0);

         return answer;
      };

      CardInstance.prototype.tractorBeamCount = function()
      {
         return this.count(Count.TRACTOR_BEAM);
      };

      CardInstance.prototype.upgrade = function(upgradeKey)
      {
         InputValidator.validateIsString("upgradeKey", upgradeKey);

         var upgradeInstances = this.upgrades().filter(function(cardInstance)
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

      CardInstance.prototype.upgradeKeys = function()
      {
         return CardInstance.cardInstancesToKeys(this.upgrades());
      };

      CardInstance.prototype.upgrades = function()
      {
         var store = this.store();
         var ids = store.getState().cardUpgrades.get(this.id());

         return CardInstance.idsToCardInstances(store, ids);
      };

      CardInstance.prototype.usableAbilities = function(source, sourceKeys, usedKeys, abilityType, abilityKey)
      {
         InputValidator.validateNotNull("source", source);
         InputValidator.validateNotNull("sourceKeys", sourceKeys);
         InputValidator.validateNotNull("usedKeys", usedKeys);
         InputValidator.validateNotNull("abilityType", abilityType);
         InputValidator.validateNotNull("abilityKey", abilityKey);

         var answer = [];
         var store = this.store();

         sourceKeys.forEach(function(sourceKey)
         {
            if (!usedKeys.includes(sourceKey) && abilityType[abilityKey] !== undefined && abilityType[abilityKey][sourceKey] !== undefined)
            {
               var myAbility = abilityType[abilityKey][sourceKey];

               if (myAbility.condition(store, this))
               {
                  answer.push(new Ability(source, sourceKey, abilityType, abilityKey));
               }
            }
         }, this);

         return answer;
      };

      CardInstance.prototype.usableDamageAbilities = function(abilityType, abilityKey)
      {
         InputValidator.validateNotNull("abilityType", abilityType);
         InputValidator.validateNotNull("abilityKey", abilityKey);

         var sourceKeys = this.criticalDamageKeys();
         var usedKeys = this.usedAbilityKeys(DamageCard);
         usedKeys = usedKeys.concat(this.usedPerRoundAbilityKeys(DamageCard));

         return this.usableAbilities(DamageCard, sourceKeys, usedKeys, abilityType, abilityKey);
      };

      CardInstance.prototype.usablePilotAbilities = function(abilityType, abilityKey)
      {
         InputValidator.validateNotNull("abilityType", abilityType);
         InputValidator.validateNotNull("abilityKey", abilityKey);

         var sourceKeys = [this.card().key];
         var usedKeys = this.usedAbilityKeys(PilotCard);
         usedKeys = usedKeys.concat(this.usedPerRoundAbilityKeys(PilotCard));

         return this.usableAbilities(PilotCard, sourceKeys, usedKeys, abilityType, abilityKey);
      };

      CardInstance.prototype.usableUpgradeAbilities = function(abilityType, abilityKey)
      {
         InputValidator.validateNotNull("abilityType", abilityType);
         InputValidator.validateNotNull("abilityKey", abilityKey);

         var sourceKeys = this.upgradeKeys();
         var usedKeys = this.usedAbilityKeys(UpgradeCard);
         usedKeys = usedKeys.concat(this.usedPerRoundAbilityKeys(UpgradeCard));

         return this.usableAbilities(UpgradeCard, sourceKeys, usedKeys, abilityType, abilityKey);
      };

      CardInstance.prototype.usedAbilities = function(source, sourceKey)
      {
         var state = this.state();
         var answer = state.cardUsedAbilities.get(this.id());

         if (source)
         {
            var usedAbilities = answer;
            answer = [];

            for (var i = 0; i < usedAbilities.size; i++)
            {
               var ability = usedAbilities.get(i);

               if (ability.source() === source && (sourceKey === undefined || ability.sourceKey() === sourceKey))
               {
                  answer.push(ability);
               }
            }
         }

         return (answer !== undefined ? answer : []);
      };

      CardInstance.prototype.usedAbilityKeys = function(source, sourceKey)
      {
         var state = this.state();
         var answer = [];
         var usedAbilities = state.cardUsedAbilities.get(this.id());

         for (var i = 0; i < usedAbilities.size; i++)
         {
            var ability = usedAbilities.get(i);

            if ((source === undefined || ability.source() === source) && (sourceKey === undefined || ability.sourceKey() === sourceKey))
            {
               answer.push(ability.sourceKey());
            }
         }

         return answer;
      };

      CardInstance.prototype.usedPerRoundAbilities = function(source, sourceKey)
      {
         var state = this.state();
         var answer = state.cardUsedPerRoundAbilities.get(this.id());

         if (source)
         {
            var usedAbilities = answer;
            answer = [];

            for (var i = 0; i < usedAbilities.size; i++)
            {
               var ability = usedAbilities.get(i);

               if (ability.source() === source && (sourceKey === undefined || ability.sourceKey() === sourceKey))
               {
                  answer.push(ability);
               }
            }
         }

         return (answer !== undefined ? answer : []);
      };

      CardInstance.prototype.usedPerRoundAbilityKeys = function(source, sourceKey)
      {
         var state = this.state();
         var answer = [];
         var usedAbilities = state.cardUsedPerRoundAbilities.get(this.id());

         for (var i = 0; i < usedAbilities.size; i++)
         {
            var ability = usedAbilities.get(i);

            if ((source === undefined || ability.source() === source) && (sourceKey === undefined || ability.sourceKey() === sourceKey))
            {
               answer.push(ability.sourceKey());
            }
         }

         return answer;
      };

      CardInstance.prototype.value = function(property)
      {
         InputValidator.validateNotNull("property", property);

         var propertyName = property + "Value";
         var pilot = this.card();
         var answer = pilot[propertyName];

         if (answer === undefined)
         {
            var ship = this.ship();

            if (ship)
            {
               if (ship.fore)
               {
                  ship = ship.fore;
               }

               answer = ship[propertyName];
            }
         }

         return answer;
      };

      CardInstance.prototype.weaponsDisabledCount = function()
      {
         return this.count(Count.WEAPONS_DISABLED);
      };

      CardInstance.prototype._bonusValue = function(property)
      {
         InputValidator.validateNotNull("property", property);

         var propertyName = property + "Value";
         var answer = 0;

         this.upgrades().forEach(function(upgradeInstance)
         {
            var myCard = upgradeInstance.card();
            answer += (myCard[propertyName] !== undefined ? myCard[propertyName] : 0);
         });

         this.criticalDamages().forEach(function(damageInstance)
         {
            var myCard = damageInstance.card();
            answer += (myCard[propertyName] !== undefined ? myCard[propertyName] : 0);
         });

         return answer;
      };

      //////////////////////////////////////////////////////////////////////////
      // Mutator methods.

      CardInstance.prototype.discardUpgrade = function(upgradeInstance)
      {
         InputValidator.validateNotNull("upgradeInstance", upgradeInstance);

         var store = this.store();
         store.dispatch(CardAction.removeUpgrade(this, upgradeInstance));
      };

      CardInstance.prototype.flipDamageCardFacedown = function(damageInstance)
      {
         InputValidator.validateNotNull("damageInstance", damageInstance);

         var store = this.store();
         store.dispatch(CardAction.setFaceUp(damageInstance, false));
      };

      CardInstance.prototype.receiveCriticalDamage = function(damageInstance, callback)
      {
         InputValidator.validateNotNull("damageInstance", damageInstance);

         LOGGER.debug("CardInstance.receiveCriticalDamage() damageInstance = " + damageInstance);

         if (this.card().key === PilotCard.CHEWBACCA_REBEL)
         {
            this.receiveDamage(damageInstance);
         }
         else
         {
            var store = this.store();
            store.dispatch(CardAction.addDamage(this, damageInstance));
            store.dispatch(CardAction.setFaceUp(damageInstance, true));
            var eventContext = {
               damageInstance: damageInstance,
            };
            store.dispatch(Action.enqueueEvent(Event.RECEIVE_CRITICAL_DAMAGE, this, callback, eventContext));
         }
      };

      CardInstance.prototype.receiveDamage = function(damageInstance, callback)
      {
         InputValidator.validateNotNull("damageInstance", damageInstance);

         var store = this.store();
         store.dispatch(CardAction.addDamage(this, damageInstance));
         store.dispatch(CardAction.setFaceUp(damageInstance, false));
         var eventContext = {
            damageInstance: damageInstance,
         };
         this.store().dispatch(Action.enqueueEvent(Event.RECEIVE_DAMAGE, this, callback, eventContext));
      };

      CardInstance.prototype.receiveStress = function(callback)
      {
         this.store().dispatch(CardAction.addStressCount(this));
         this.store().dispatch(Action.enqueueEvent(Event.RECEIVE_STRESS, this, callback));
      };

      CardInstance.prototype.recoverShield = function(callback)
      {
         if (this.shieldCount() < this.shieldValue())
         {
            this.store().dispatch(CardAction.addShieldCount(this));
            this.store().dispatch(Action.enqueueEvent(Event.RECOVER_SHIELD, this, callback));
         }
         else if (callback)
         {
            callback();
         }
      };

      CardInstance.prototype.removeCriticalDamage = function(damageInstance)
      {
         InputValidator.validateNotNull("damageInstance", damageInstance);

         this.store().dispatch(CardAction.removeDamage(this, damageInstance));
      };

      CardInstance.prototype.removeShield = function(count, callback)
      {
         if (this.shieldCount() > 0)
         {
            var myCount = (count !== undefined ? count : 1);
            this.store().dispatch(CardAction.addShieldCount(this, -myCount));
            this.store().dispatch(Action.enqueueEvent(Event.REMOVE_SHIELD, this, callback));
         }
         else if (callback)
         {
            callback();
         }
      };

      CardInstance.prototype.removeStress = function(callback)
      {
         if (this.stressCount() > 0)
         {
            this.store().dispatch(CardAction.addStressCount(this, -1));
            this.store().dispatch(Action.enqueueEvent(Event.REMOVE_STRESS, this, callback));
         }
         else if (callback)
         {
            callback();
         }
      };

      CardInstance.prototype._save = function(upgradeKeys)
      {
         InputValidator.validateNotNull("upgradeKeys", upgradeKeys);

         var store = this.store();
         var id = this.id();
         var cardTypeKey = this.card().cardTypeKey;
         var cardKey = this.card().key;
         var agent = this.agent();

         store.dispatch(CardAction.setCardInstance(id, cardTypeKey, cardKey, agent));

         upgradeKeys.forEach(function(upgradeKey)
         {
            var upgrade = UpgradeCard.properties[upgradeKey];
            var upgradeInstance = new CardInstance(store, upgrade);
            store.dispatch(CardAction.addUpgrade(this, upgradeInstance));
         }, this);

         Count.keys().forEach(function(property)
         {
            var value;

            switch (property)
            {
               case Count.ENERGY:
                  value = this.shipState(Value.ENERGY);
                  store.dispatch(CardAction.setEnergyCount(this, value));
                  break;
               case Count.SHIELD:
                  if (this.card().cardTypeKey === CardType.PILOT)
                  {
                     value = this.shipState(Value.SHIELD);
                     store.dispatch(CardAction.setShieldCount(this, value));
                  }
                  break;
               default:
                  store.dispatch(CardAction.setCount(this, property));
            }
         }, this);

         store.dispatch(CardAction.clearUsedAbilities(this));
         store.dispatch(CardAction.clearUsedPerRoundAbilities(this));

         if (this.card().cardTypeKey === CardType.PILOT && !this.isChild())
         {
            store.dispatch(AgentAction.addPilot(agent, this));
         }
      };

      //////////////////////////////////////////////////////////////////////////
      // Utility methods.

      CardInstance.prototype.newInstance = function(store, agent)
      {
         InputValidator.validateNotNull("store", store);
         // agent optional.

         var card = this.card();
         var answer = new CardInstance(store, card, agent);

         this.upgrades().forEach(function(upgrade)
         {
            var newUpgrade = upgrade.newInstance(store);
            store.dispatch(CardAction.addUpgrade(answer, newUpgrade));
         }, this);

         return answer;
      };

      CardInstance.prototype._changeBearingManeuversToDifficulty = function(maneuverKeys, bearingKey, difficultyKey)
      {
         return maneuverKeys.map(function(maneuverKey)
         {
            var maneuver = Maneuver.properties[maneuverKey];
            var myBearingKey = maneuver.bearingKey;

            if (myBearingKey === bearingKey)
            {
               var speed = maneuver.speed;
               var answer = Maneuver.find(bearingKey, speed, difficultyKey);
               if (!answer)
               {
                  throw "Unknown maneuver: " + bearingKey + " " + speed + " " + difficultyKey;
               }
               return answer;
            }
            else
            {
               return maneuverKey;
            }
         });
      };

      CardInstance.prototype._changeSpeedManeuversToDifficulty = function(maneuverKeys, speed, difficultyKey)
      {
         return maneuverKeys.map(function(maneuverKey)
         {
            var maneuver = Maneuver.properties[maneuverKey];
            var mySpeed = maneuver.speed;

            if (mySpeed === speed)
            {
               var bearingKey = maneuver.bearingKey;
               var answer = Maneuver.find(bearingKey, speed, difficultyKey);
               if (!answer)
               {
                  throw "Unknown maneuver: " + bearingKey + " " + speed + " " + difficultyKey;
               }
               return answer;
            }
            else
            {
               return maneuverKey;
            }
         });
      };

      CardInstance.prototype._createPrimaryWeapon = function()
      {
         var primaryWeaponValue = this.shipState(Value.PRIMARY_WEAPON);
         var ship = this.ship();

         return new Weapon("Primary Weapon", primaryWeaponValue, ship.primaryWeaponRanges, ship.primaryFiringArcKey, ship.auxiliaryFiringArcKey, ship.isPrimaryWeaponTurret);
      };

      CardInstance.prototype._createSecondaryWeapon = function(upgrade)
      {
         return new Weapon(upgrade.name, upgrade.weaponValue, upgrade.rangeKeys, upgrade.firingArcKey, undefined,
            upgrade.isWeaponTurret, upgrade.key);
      };

      CardInstance.cardInstancesToIds = function(cardInstances)
      {
         InputValidator.validateNotNull("cardInstances", cardInstances);

         return cardInstances.map(function(cardInstance)
         {
            return cardInstance.id();
         });
      };

      CardInstance.cardInstancesToKeys = function(cardInstances)
      {
         InputValidator.validateNotNull("cardInstances", cardInstances);

         return cardInstances.map(function(cardInstance)
         {
            InputValidator.validateNotNull("cardInstance", cardInstance);
            InputValidator.validateNotNull("cardInstance.card()", cardInstance.card());
            return cardInstance.card().key;
         });
      };

      CardInstance.get = function(store, id)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsNumber("id", id);

         var values = store.getState().cardInstances.get(id);
         var answer;

         if (values !== undefined)
         {
            var cardTypeKey = values.get("cardTypeKey");
            var cardKey = values.get("cardKey");
            var card;

            if (cardKey.endsWith(".fore"))
            {
               cardKey = cardKey.substring(0, cardKey.length - ".fore".length);
               card = PilotCard.properties[cardKey].fore;
            }
            else if (cardKey.endsWith(".aft"))
            {
               cardKey = cardKey.substring(0, cardKey.length - ".aft".length);
               card = PilotCard.properties[cardKey].aft;
            }
            else
            {
               card = CardResolver.resolve(cardTypeKey, cardKey);
            }

            var agent = values.get("agent");
            var upgradeKeys = store.getState().cardUpgrades.get(id);
            var isNew = false;

            answer = new CardInstance(store, card, agent, upgradeKeys, id, isNew);
         }

         return answer;
      };

      CardInstance.idsToCardInstances = function(store, ids)
      {
         InputValidator.validateNotNull("store", store);
         // ids optional.

         var answer;

         if (ids !== undefined)
         {
            answer = ids.map(function(id)
            {
               var cardInstance = CardInstance.get(store, id);
               InputValidator.validateNotNull("cardInstance", cardInstance);
               return cardInstance;
            });
         }
         else
         {
            answer = Immutable.List();
         }

         return answer;
      };

      CardInstance.keysToCardInstances = function(store, cardTypeKey, cardKeys, agent)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsString("cardTypeKey", cardTypeKey);
         // cardKeys optional.
         // agent optional.

         var answer;

         if (cardKeys !== undefined)
         {
            answer = cardKeys.map(function(cardKey)
            {
               var card = CardResolver.resolve(cardTypeKey, cardKey);

               return new CardInstance(store, card, agent);
            });
         }
         else
         {
            answer = Immutable.List();
         }

         return answer;
      };

      return CardInstance;
   });
