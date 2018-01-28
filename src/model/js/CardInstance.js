"use strict";

define(["immutable", "common/js/ArrayUtilities", "common/js/InputValidator",
  "artifact/js/Bearing", "artifact/js/CardResolver", "artifact/js/CardType", "artifact/js/ConditionCard", "artifact/js/Count", "artifact/js/DamageCard", "artifact/js/Difficulty", "artifact/js/Event", "artifact/js/Faction", "artifact/js/FiringArc", "artifact/js/Maneuver", "artifact/js/PilotCard", "artifact/js/Range", "artifact/js/ShipAction", "artifact/js/ShipBase", "artifact/js/UpgradeCard", "artifact/js/Value",
  "model/js/Ability", "model/js/Action", "model/js/AgentAction", "model/js/CardAction", "model/js/DamageDealer", "model/js/PilotInstanceUtilities", "model/js/RangeRuler", "model/js/TargetLock", "model/js/Weapon"],
   function(Immutable, ArrayUtilities, InputValidator,
      Bearing, CardResolver, CardType, ConditionCard, Count, DamageCard, Difficulty, Event, Faction, FiringArc, Maneuver, PilotCard, Range, ShipAction, ShipBase, UpgradeCard, Value,
      Ability, Action, AgentAction, CardAction, DamageDealer, PilotInstanceUtilities, RangeRuler, TargetLock, Weapon)
   {
      function CardInstance(store, cardOrKey, agent, upgradeKeysIn, upgradeKeysAftIn, idIn, isNewIn, idParent, idFore, idAft, idCrippledFore, idCrippledAft)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateNotNull("cardOrKey", cardOrKey);
         // agent optional.
         // upgradeKeysIn optional.
         // upgradeKeysAftIn optional.
         // idIn optional. default: determined from store
         // isNewIn optional. default: true
         // idParent optional.
         // idFore optional.
         // idAft optional.
         // idCrippledFore optional.
         // idCrippledAft optional.

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

         this.idParent = function()
         {
            return idParent;
         };

         this.idFore = function()
         {
            return idFore;
         };

         this.idAft = function()
         {
            return idAft;
         };

         this.idCrippledFore = function()
         {
            return idCrippledFore;
         };

         this.idCrippledAft = function()
         {
            return idCrippledAft;
         };

         var isNew = (isNewIn !== undefined ? isNewIn : true);

         if (isNew)
         {
            var upgradeKeys;

            if (card.fore !== undefined && card.aft !== undefined)
            {
               upgradeKeys = Immutable.List();

               var pilotFore = card.fore;
               var upgradeKeysFore = (upgradeKeysIn ? upgradeKeysIn : Immutable.List());
               var tokenFore = new CardInstance(store, pilotFore, agent, upgradeKeysFore, undefined, undefined, true, id);
               idFore = tokenFore.id();

               var pilotCrippledFore = card.crippledFore;
               // FIXME: decide which upgrades to keep.
               var crippledTokenFore = new CardInstance(store, pilotCrippledFore, agent, upgradeKeysFore, undefined, undefined, true, id);
               idCrippledFore = crippledTokenFore.id();

               var pilotAft = card.aft;
               var upgradeKeysAft = (upgradeKeysAftIn ? upgradeKeysAftIn : Immutable.List());
               var tokenAft = new CardInstance(store, pilotAft, agent, upgradeKeysAft, undefined, undefined, true, id);
               idAft = tokenAft.id();

               var pilotCrippledAft = card.crippledAft;
               // FIXME: decide which upgrades to keep.
               var crippledTokenAft = new CardInstance(store, pilotCrippledAft, agent, upgradeKeysAft, undefined, undefined, true, id);
               idCrippledAft = crippledTokenAft.id();

               this._save(upgradeKeys, tokenFore, tokenAft, crippledTokenFore, crippledTokenAft);
            }
            else
            {
               upgradeKeys = (upgradeKeysIn ? upgradeKeysIn : Immutable.List());
               this._save(upgradeKeys);
            }
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
         var answer = this._bonusValue(Value.HULL);

         if (this.isUpgradedWith(UpgradeCard.HEAVY_SCYK_INTERCEPTOR))
         {
            answer++;
         }

         return answer;
      };

      CardInstance.prototype.bonusPilotSkillValue = function()
      {
         var answer = this._bonusValue(Value.PILOT_SKILL);

         if (this.isUpgradedWith(UpgradeCard.ADAPTABILITY_DECREASE))
         {
            answer--;
         }

         if (this.isUpgradedWith(UpgradeCard.ADAPTABILITY_INCREASE))
         {
            answer++;
         }

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

      CardInstance.prototype.children = function()
      {
         var agent = this.agent();
         var pilotInstances = agent.pilotInstances(true);

         return pilotInstances.filter(function(pilotInstance)
         {
            return pilotInstance.isChild() && pilotInstance.idParent() === this.id();
         }, this);
      };

      CardInstance.prototype.cloakCount = function()
      {
         return this.count(Count.CLOAK);
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

         return key.endsWith(".fore") || key.endsWith(".aft") ||
            key.endsWith(".crippledFore") || key.endsWith(".crippledAft");
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
         var answer = false;

         if (this.isParent())
         {
            var tokenFore = this._tokenFore();
            var tokenAft = this._tokenAft();
            answer = tokenFore && tokenFore.isDestroyed() && tokenAft && tokenAft.isDestroyed();
         }
         else
         {
            answer = this.totalDamage() >= this.hullValue();
         }

         return answer;
      };

      CardInstance.prototype.isFaceUp = function()
      {
         var store = this.store();
         var answer = store.getState().cardIsFaceUp.get(this.id());

         return (answer !== undefined ? answer : true);
      };

      CardInstance.prototype.isHuge = function()
      {
         return ShipBase.isHuge(this.ship().shipBaseKey) || (this.idParent() !== undefined);
      };

      CardInstance.prototype.isIonized = function()
      {
         return this.ionCount() > 0;
      };

      CardInstance.prototype.isParent = function()
      {
         return this.idFore() !== undefined && this.idAft() !== undefined;
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

      CardInstance.prototype.isTouching = function(pilotInstance2)
      {
         // pilotInstance2 optional.

         var touching = this.pilotInstancesTouching();

         if (pilotInstance2 !== undefined)
         {
            var id2 = pilotInstance2.id();

            touching = touching.filter(function(pilotInstance)
            {
               return (pilotInstance.id() === id2);
            });
         }

         return touching.length > 0;
      };

      CardInstance.prototype.isUpgradedWith = function(upgradeKey)
      {
         return this.upgradeKeys().includes(upgradeKey);
      };

      CardInstance.prototype.name = function(isShort)
      {
         var answer;
         var cardTypeKey = this.card().cardTypeKey;

         switch (cardTypeKey)
         {
            case CardType.CONDITION:
               answer = this.id() + " " + ConditionCard.getName(this.card().key);
               break;
            case CardType.DAMAGE:
               answer = this.id() + " " + this.card().name;
               break;
            case CardType.PILOT:
               answer = PilotInstanceUtilities.pilotName(this, isShort);
               break;
            case CardType.UPGRADE:
               answer = this.id() + " " + UpgradeCard.getName(this.card().key);
               break;
            default:
               throw "Unknown card type: " + cardTypeKey;
         }

         return answer;
      };

      CardInstance.prototype.pilotInstancesTouching = function()
      {
         var store = this.store();
         var touching = store.getState().touching;
         var id = this.id();

         touching = touching.filter(function(touchPair)
         {
            return touchPair.includes(id);
         }, this);

         var ids = touching.map(function(touchPair)
         {
            return (touchPair.get(0) === id ? touchPair.get(1) : touchPair.get(0));
         }, this);

         return CardInstance.idsToCardInstances(store, ids).toJS();
      };

      CardInstance.prototype.pilotSkillValue = function()
      {
         var base = this.basePilotSkillValue();
         var bonus = this.bonusPilotSkillValue();

         return (base !== undefined && bonus !== undefined ? base + bonus : undefined);
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
         var isVaksai = this.isUpgradedWith(UpgradeCard.VAKSAI);

         var answer = this.upgrades().reduce(function(accumulator, upgrade)
         {
            var value = upgrade.squadPointCost();
            value = (isVaksai ? Math.max(0, value - 1) : value);
            return accumulator + value;
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

      CardInstance.prototype.tokenAft = function()
      {
         var answer = this._tokenAft();

         if (answer !== undefined && answer.isDestroyed())
         {
            answer = this._crippledTokenAft();
         }

         return answer;
      };

      CardInstance.prototype.tokenFore = function()
      {
         var answer = this._tokenFore();

         if (answer !== undefined && answer.isDestroyed())
         {
            answer = this._crippledTokenFore();
         }

         return answer;
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

      CardInstance.prototype.unfriendlyPilotInstancesTouching = function()
      {
         var factionKey0 = this.card().shipFaction.factionKey;

         return this.pilotInstancesTouching().filter(function(pilotInstance)
         {
            var factionKey = pilotInstance.card().shipFaction.factionKey;
            return !Faction.isFriendly(factionKey0, factionKey);
         });
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
               answer = ship[propertyName];

               if (answer === undefined && ship.fore !== undefined)
               {
                  answer = ship.fore[propertyName];
               }

               if (answer === undefined && ship.aft !== undefined)
               {
                  answer = ship.aft[propertyName];
               }
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
      // Condition instance accessors.

      //////////////////////////////////////////////////////////////////////////
      // Damage instance accessors.

      //////////////////////////////////////////////////////////////////////////
      // Pilot instance accessors.

      CardInstance.prototype.computeAttackDiceCount = function(environment, weapon, defender, rangeKey)
      {
         return PilotInstanceUtilities.computeAttackDiceCount(this, environment, weapon, defender, rangeKey);
      };

      CardInstance.prototype.computeDefenseDiceCount = function(environment, attacker, weapon, rangeKey)
      {
         return PilotInstanceUtilities.computeDefenseDiceCount(this, environment, attacker, weapon, rangeKey);
      };

      CardInstance.prototype.maneuverKeys = function()
      {
         return PilotInstanceUtilities.maneuverKeys(this);
      };

      CardInstance.prototype.primaryWeapon = function()
      {
         return PilotInstanceUtilities.primaryWeapon(this);
      };

      CardInstance.prototype.secondaryWeapons = function()
      {
         return PilotInstanceUtilities.secondaryWeapons(this);
      };

      CardInstance.prototype.ship = function()
      {
         return PilotInstanceUtilities.ship(this);
      };

      CardInstance.prototype.shipActions = function()
      {
         return PilotInstanceUtilities.shipActions(this);
      };

      CardInstance.prototype.shipName = function()
      {
         return PilotInstanceUtilities.shipName(this);
      };

      CardInstance.prototype.upgrade = function(upgradeKey)
      {
         return PilotInstanceUtilities.upgrade(this, upgradeKey);
      };

      //////////////////////////////////////////////////////////////////////////
      // Upgrade instance accessors.

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

      CardInstance.prototype.receiveFocus = function(value, callback)
      {
         this.store().dispatch(CardAction.addFocusCount(this, value));
         this.store().dispatch(Action.enqueueEvent(Event.RECEIVE_FOCUS, this, callback));
      };

      CardInstance.prototype.receiveStress = function(value, callback)
      {
         this.store().dispatch(CardAction.addStressCount(this, value));
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

      CardInstance.prototype.removeFocus = function(callback)
      {
         if (this.focusCount() > 0)
         {
            this.store().dispatch(CardAction.addFocusCount(this, -1));
            this.store().dispatch(Action.enqueueEvent(Event.REMOVE_FOCUS, this, callback));
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

      CardInstance.prototype.sufferDamage = function(hitCount, criticalHitCount)
      {
         InputValidator.validateIsNumber("hitCount", hitCount);
         InputValidator.validateIsNumber("criticalHitCount", criticalHitCount);

         var store = this.store();
         var environment = store.getState().environment;
         var evadeCount = this.evadeCount();
         var damageDealer = new DamageDealer(environment, hitCount, criticalHitCount, this, evadeCount);
         damageDealer.dealDamage();
      };

      CardInstance.prototype._save = function(upgradeKeys, tokenFore, tokenAft, crippledTokenFore, crippledTokenAft)
      {
         InputValidator.validateNotNull("upgradeKeys", upgradeKeys);
         // tokenFore optional.
         // tokenAft optional.
         // crippledTokenFore optional.
         // crippledTokenAft optional.

         var store = this.store();
         var id = this.id();
         var cardTypeKey = this.card().cardTypeKey;
         var cardKey = this.card().key;
         var agent = this.agent();
         var idParent = this.idParent();
         var idFore = (tokenFore ? tokenFore.id() : undefined);
         var idAft = (tokenAft ? tokenAft.id() : undefined);
         var idCrippledFore = (crippledTokenFore ? crippledTokenFore.id() : undefined);
         var idCrippledAft = (crippledTokenAft ? crippledTokenAft.id() : undefined);

         store.dispatch(CardAction.setCardInstance(id, cardTypeKey, cardKey, agent, idParent, idFore, idAft, idCrippledFore, idCrippledAft));

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
         var answer = new CardInstance(store, card, agent, undefined, undefined, undefined, this.idParent());

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

      CardInstance.prototype._crippledTokenAft = function()
      {
         var answer;
         var idCrippledAft = this.idCrippledAft();

         if (idCrippledAft !== undefined)
         {
            var store = this.store();
            answer = CardInstance.get(store, idCrippledAft);
         }

         return answer;
      };

      CardInstance.prototype._crippledTokenFore = function()
      {
         var answer;
         var idCrippledFore = this.idCrippledFore();

         if (idCrippledFore !== undefined)
         {
            var store = this.store();
            answer = CardInstance.get(store, idCrippledFore);
         }

         return answer;
      };

      CardInstance.prototype._tokenAft = function()
      {
         var answer;
         var idAft = this.idAft();

         if (idAft !== undefined)
         {
            var store = this.store();
            answer = CardInstance.get(store, idAft);
         }

         return answer;
      };

      CardInstance.prototype._tokenFore = function()
      {
         var answer;
         var idFore = this.idFore();

         if (idFore !== undefined)
         {
            var store = this.store();
            answer = CardInstance.get(store, idFore);
         }

         return answer;
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
            else if (cardKey.endsWith(".crippledFore"))
            {
               cardKey = cardKey.substring(0, cardKey.length - ".crippledFore".length);
               card = PilotCard.properties[cardKey].crippledFore;
            }
            else if (cardKey.endsWith(".crippledAft"))
            {
               cardKey = cardKey.substring(0, cardKey.length - ".crippledAft".length);
               card = PilotCard.properties[cardKey].crippledAft;
            }
            else
            {
               card = CardResolver.resolve(cardTypeKey, cardKey);
            }

            var agent = values.get("agent");
            var isNew = false;
            var idParent = values.get("idParent");
            var idFore = values.get("idFore");
            var idAft = values.get("idAft");
            var idCrippledFore = values.get("idCrippledFore");
            var idCrippledAft = values.get("idCrippledAft");

            var upgradeKeys, upgradeKeysAft;

            if (idFore !== undefined && idAft !== undefined)
            {
               upgradeKeys = store.getState().cardUpgrades.get(id);
               upgradeKeysAft = store.getState().cardUpgrades.get(id);
            }
            else
            {
               upgradeKeys = store.getState().cardUpgrades.get(id);
            }

            answer = new CardInstance(store, card, agent, upgradeKeys, upgradeKeysAft, id, isNew, idParent, idFore, idAft, idCrippledFore, idCrippledAft);
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
