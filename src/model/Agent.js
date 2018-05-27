"use strict";

define(["immutable", "utility/InputValidator", "artifact/DamageCard", "artifact/DiceModification", "artifact/Maneuver", "artifact/Phase", "artifact/PilotCard", "artifact/PlayFormat", "artifact/Range", "artifact/ShipAction", "artifact/UpgradeCard", "artifact/UpgradeHeader",
  "model/Ability", "model/Action", "model/AgentAction", "model/CardInstance", "model/DamageAbility2", "model/ManeuverComputer", "model/MediumAgentStrategy", "model/ModifyDiceAbility", "model/PilotAbility3", "model/Selector", "model/ShipActionAbility", "model/SimpleAgentStrategy", "model/TargetLock", "model/UpgradeAbility2", "model/UpgradeAbility3"],
   function(Immutable, InputValidator, DamageCard, DiceModification, Maneuver, Phase, PilotCard, PlayFormat, Range, ShipAction, UpgradeCard, UpgradeHeader,
      Ability, Action, AgentAction, CardInstance, DamageAbility2, ManeuverComputer, MediumAgentStrategy, ModifyDiceAbility, PilotAbility3, Selector, ShipActionAbility, SimpleAgentStrategy, TargetLock, UpgradeAbility2, UpgradeAbility3)
   {
      function Agent(store, name, idIn, strategyIn, isNewIn)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsString("name", name);
         // idIn optional. default: determined from store
         // strategyIn optional. default: SimpleAgentStrategy
         // isNewIn optional. default: true

         this.store = function()
         {
            return store;
         };

         this.name = function()
         {
            return name;
         };

         var id = idIn;

         if (isNaN(id))
         {
            id = store.getState().nextAgentId;
            store.dispatch(AgentAction.incrementNextAgentId());
         }

         this.id = function()
         {
            return id;
         };

         var strategy = (strategyIn !== undefined ? strategyIn : SimpleAgentStrategy);

         this._strategy = function()
         {
            return strategy;
         };

         var isNew = (isNewIn !== undefined ? isNewIn : true);

         if (isNew)
         {
            this._save();
         }
      }

      //////////////////////////////////////////////////////////////////////////
      // Accessor methods.

      Agent.prototype.agentClass = Agent;

      Agent.prototype.determineValidDecloakActions = function(token)
      {
         InputValidator.validateNotNull("token", token);

         var answer = [];
         var maneuverKeys = [Maneuver.BARREL_ROLL_LEFT_2_STANDARD, Maneuver.STRAIGHT_2_STANDARD, Maneuver.BARREL_ROLL_RIGHT_2_STANDARD];
         var store = this.store();
         var adjudicator = store.getState().adjudicator;

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

      Agent.prototype.determineValidManeuvers = function(token)
      {
         InputValidator.validateNotNull("token", token);

         var store = this.store();
         var environment = store.getState().environment;
         var fromPosition = environment.getPositionFor(token);
         var shipBase = token.card().shipFaction.ship.shipBase;
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

      Agent.prototype.determineValidModifyAttackDiceActions = function(attacker, defender)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);

         var answer = [];
         var store = this.store();

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

         var pilotKey = attacker.card().key;

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

      Agent.prototype.determineValidModifyDefenseDiceActions = function(attacker, defender)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);

         var answer = [];
         var store = this.store();
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

         var pilotKey = defender.card().key;

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

      Agent.prototype.determineValidShipActions = function(token, shipActionKeys0)
      {
         InputValidator.validateNotNull("token", token);
         // shipActionKeys0 optional.

         var answer = [];
         var store = this.store();
         var environment = store.getState().environment;
         var adjudicator = store.getState().adjudicator;

         if (!adjudicator.canSelectShipAction(token))
         {
            return answer;
         }

         var shipActionKeys = (shipActionKeys0 !== undefined ? shipActionKeys0 : token.shipActions());
         var usedShipActionKeys = token.usedPerRoundAbilityKeys(ShipAction);
         shipActionKeys = shipActionKeys.filter(function(shipActionKey)
         {
            return !usedShipActionKeys.includes(shipActionKey);
         });

         var context;
         var maneuverKeysMap = {};
         maneuverKeysMap[ShipAction.BARREL_ROLL] = [Maneuver.BARREL_ROLL_LEFT_1_STANDARD, Maneuver.BARREL_ROLL_RIGHT_1_STANDARD];
         maneuverKeysMap[ShipAction.BOOST] = [Maneuver.BANK_LEFT_1_STANDARD, Maneuver.STRAIGHT_1_STANDARD, Maneuver.BANK_RIGHT_1_STANDARD];
         maneuverKeysMap[ShipAction.SLAM] = token.card().shipFaction.ship.maneuverKeys;
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
                     if (myToken.id() !== token.id() && (token.idParent() === undefined || token.idParent() !== myToken.id()))
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
                  if (token.idParent() !== undefined)
                  {
                     var tokenParent = environment.parentOf(token);

                     if (!tokenParent.tokenFore().isDestroyed())
                     {
                        context = {
                           token: tokenParent.tokenFore(),
                        };
                        answer.push(new Ability(ShipAction, shipActionKey, ShipActionAbility, ShipActionAbility.ABILITY_KEY, context));
                     }
                     if (!tokenParent.tokenAft().isDestroyed())
                     {
                        context = {
                           token: tokenParent.tokenAft(),
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
                  var defenders = (token.isUpgradedWith(UpgradeCard.ST_321) ? environment.getDefenders(token) : environment.getDefendersInRange(token));
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

      Agent.prototype.isComputerAgent = function()
      {
         return [SimpleAgentStrategy, MediumAgentStrategy].includes(this._strategy());
      };

      Agent.prototype.toString = function()
      {
         return this.name() + ", " + this._strategy().name;
      };

      //////////////////////////////////////////////////////////////////////////
      // Behavior methods.

      Agent.prototype.chooseAbility = function(damageAbilities, pilotAbilities, upgradeAbilities, callback)
      {
         InputValidator.validateNotNull("damageAbilities", damageAbilities);
         InputValidator.validateNotNull("pilotAbilities", pilotAbilities);
         InputValidator.validateNotNull("upgradeAbilities", upgradeAbilities);
         InputValidator.validateIsFunction("callback", callback);

         this._strategy().chooseAbility(this, damageAbilities, pilotAbilities, upgradeAbilities, callback);
      };

      Agent.prototype.chooseWeaponAndDefender = function(attacker, callback, weaponIn)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateIsFunction("callback", callback);
         // weapon optional.

         var store = this.store();
         var environment = store.getState().environment;
         var choices = environment.createWeaponToRangeToDefenders(attacker, weaponIn);

         if (choices.length > 0)
         {
            this._strategy().chooseWeaponAndDefender(this, attacker, choices, callback);
         }
         else
         {
            callback();
         }
      };

      Agent.prototype.dealDamage = function(attacker, attackDice, defender, defenseDice, damageDealer, callback)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("attackDice", attackDice);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("defenseDice", defenseDice);
         InputValidator.validateNotNull("damageDealer", damageDealer);
         InputValidator.validateIsFunction("callback", callback);

         var store = this.store();
         var weapon = Selector.combatAction(store.getState(), attacker).weapon();

         this._strategy().dealDamage(this, attacker, weapon, attackDice, defender, defenseDice, damageDealer, callback);
      };

      Agent.prototype.getDecloakAction = function(token, callback)
      {
         InputValidator.validateNotNull("token", token);
         InputValidator.validateIsFunction("callback", callback);

         var decloakActions = this.determineValidDecloakActions(token);
         this._strategy().chooseDecloakAction(this, token, decloakActions, callback);
      };

      Agent.prototype.getModifyAttackDiceAction = function(attacker, defender, callback)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateIsFunction("callback", callback);

         var modifications = this.determineValidModifyAttackDiceActions(attacker, defender);
         this._strategy().chooseModifyAttackDiceAction(this, attacker, defender, modifications, callback);
      };

      Agent.prototype.getModifyDefenseDiceAction = function(attacker, defender, callback)
      {
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateIsFunction("callback", callback);

         var modifications = this.determineValidModifyDefenseDiceActions(attacker, defender);
         this._strategy().chooseModifyDefenseDiceAction(this, attacker, defender, modifications, callback);
      };

      Agent.prototype.getPlanningAction = function(callback)
      {
         InputValidator.validateIsFunction("callback", callback);

         var isPure = false;
         var tokens = this.pilotInstances(isPure);
         var tokenToValidManeuvers = {};

         tokens.forEach(function(token)
         {
            var validManeuvers = this.determineValidManeuvers(token);
            tokenToValidManeuvers[token] = validManeuvers;
         }, this);

         this._strategy().choosePlanningActions(this, tokens, tokenToValidManeuvers, callback);
      };

      Agent.prototype.getShipAction = function(token, callback, shipActionKeys0)
      {
         InputValidator.validateNotNull("token", token);
         // callback optional.
         // shipActionKeys0 optional.

         var store = token.store();
         var environment = store.getState().environment;
         var activeCardInstance = environment.activeCardInstance();

         if (activeCardInstance && activeCardInstance.id() === token.id())
         {
            var shipActionKeys = this.determineValidShipActions(token, shipActionKeys0);
            this._strategy().chooseShipAction(this, token, shipActionKeys, callback);
         }
         else
         {
            callback();
         }
      };

      Agent.prototype.pilotInstances = function(isPureIn)
      {
         var store = this.store();
         var isPure = (isPureIn !== undefined ? isPureIn : false);
         var ids = store.getState().agentPilots.get(this.id());
         var answer = Agent.idsToCardInstances(store, ids).toJS();

         if (isPure)
         {
            answer = answer.reduce(function(accumulator, cardInstance)
            {
               if (cardInstance.isParent())
               {
                  accumulator.push(cardInstance.tokenFore());
                  accumulator.push(cardInstance.tokenAft());
               }
               else
               {
                  accumulator.push(cardInstance);
               }
               return accumulator;
            }, []);
         }

         return answer;
      };

      //////////////////////////////////////////////////////////////////////////
      // Mutator methods.

      Agent.prototype._save = function()
      {
         var store = this.store();
         var id = this.id();
         var values = Immutable.Map(
         {
            id: id,
            name: this.name(),
            strategy: this._strategy(),
         });

         store.dispatch(Action.addAgent(id, values));
      };

      //////////////////////////////////////////////////////////////////////////
      // Utility methods.

      Agent.prototype.newInstance = function(store)
      {
         InputValidator.validateNotNull("store", store);

         return new Agent(store, this.name(), undefined, this._strategy());
      };

      Agent.get = function(store, id)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsNumber("id", id);

         var values = store.getState().agents.get(id);
         var answer;

         if (values !== undefined)
         {
            var name = values.get("name");
            var strategy = values.get("strategy");
            var isNew = false;

            answer = new Agent(store, name, id, strategy, isNew);
         }

         return answer;
      };

      Agent.idsToCardInstances = function(store, ids)
      {
         InputValidator.validateNotNull("store", store);
         // ids optional.

         var answer;

         if (ids !== undefined)
         {
            answer = ids.reduce(function(accumulator, id)
            {
               var cardInstance = CardInstance.get(store, id);
               if (cardInstance !== undefined)
               {
                  accumulator = accumulator.push(cardInstance);
               }
               return accumulator;
            }, Immutable.List());
         }
         else
         {
            answer = Immutable.List();
         }

         return answer;
      };

      return Agent;
   });
