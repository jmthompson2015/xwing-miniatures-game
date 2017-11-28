"use strict";

define(["redux", "common/js/ArrayAugments", "common/js/InputValidator",
  "artifact/js/Difficulty", "artifact/js/Maneuver", "artifact/js/Range", "artifact/js/ShipAction",
  "model/js/Ability", "model/js/Action", "model/js/AttackDice", "model/js/CardAction", "model/js/CombatAction", "model/js/DefenseDice", "model/js/Environment", "model/js/ManeuverComputer", "model/js/RangeRuler", "model/js/Reducer", "model/js/Selector", "model/js/Squad", "model/js/TargetLock"],
   function(Redux, ArrayAugments, InputValidator,
      Difficulty, Maneuver, Range, ShipAction,
      Ability, Action, AttackDice, CardAction, CombatAction, DefenseDice, Environment, ManeuverComputer, RangeRuler, Reducer, Selector, Squad, TargetLock)
   {
      var MediumAgentStrategy = {};

      MediumAgentStrategy.chooseAbility = function(agent, damageAbilities, pilotAbilities, upgradeAbilities, callback)
      {
         InputValidator.validateNotNull("agent", agent);
         InputValidator.validateNotNull("damageAbilities", damageAbilities);
         InputValidator.validateNotNull("pilotAbilities", pilotAbilities);
         InputValidator.validateNotNull("upgradeAbilities", upgradeAbilities);
         InputValidator.validateIsFunction("callback", callback);

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

      MediumAgentStrategy.chooseDecloakAction = function(agent, token, decloakActions, callback)
      {
         InputValidator.validateNotNull("agent", agent);
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("decloakActions", decloakActions);
         InputValidator.validateIsFunction("callback", callback);

         var answer = decloakActions.xwingRandomElement();

         callback(token, answer);
      };

      MediumAgentStrategy.chooseModifyAttackDiceAction = function(agent, attacker, defender, modifications, callback)
      {
         InputValidator.validateNotNull("agent", agent);
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("modifications", modifications);
         InputValidator.validateIsFunction("callback", callback);

         // Maximize the hits and critical hits.
         var store = agent.store();
         var environment = store.getState().environment;
         var attackerPosition = environment.getPositionFor(attacker);
         var defenderPosition = environment.getPositionFor(defender);
         var bestModification;
         var bestHits;
         var bestFocusTokens;

         if (modifications.length === 1)
         {
            bestModification = modifications[0];
         }
         else if (modifications.length > 1)
         {
            modifications.forEach(function(modification)
            {
               var mockStore = this.cloneStore(store, attacker, attackerPosition, defender, defenderPosition);
               var mockEnvironment = mockStore.getState().environment;
               var mockAttacker = mockEnvironment.getTokenById(1);
               var mockAttackDice = AttackDice.get(mockStore, mockAttacker.id());
               var mod = new Ability(modification.source(), modification.sourceKey(), modification.type(), modification.abilityKey());
               var consequent = mod.consequent();
               var callback = function() {};
               consequent(mockStore, mockAttacker, callback);
               mockAttackDice = AttackDice.get(mockStore, mockAttacker.id());
               var hits = mockAttackDice.hitCount() + mockAttackDice.criticalHitCount();
               var focusTokens = mockAttacker.focusCount();

               if (bestHits === undefined || hits > bestHits)
               {
                  bestModification = modification;
                  bestHits = hits;
                  bestFocusTokens = focusTokens;
               }
               else if (hits === bestHits && (bestFocusTokens === undefined || focusTokens > bestFocusTokens))
               {
                  bestModification = modification;
                  bestFocusTokens = focusTokens;
               }
            }, this);
         }

         var isAccepted = (bestModification !== undefined && bestModification !== null);

         callback(bestModification, isAccepted);
      };

      MediumAgentStrategy.chooseModifyDefenseDiceAction = function(agent, attacker, defender, modifications, callback)
      {
         InputValidator.validateNotNull("agent", agent);
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("defender", defender);
         InputValidator.validateNotNull("modifications", modifications);
         InputValidator.validateIsFunction("callback", callback);

         var store = agent.store();
         var environment = store.getState().environment;
         var attackerPosition = environment.getPositionFor(attacker);
         var defenderPosition = environment.getPositionFor(defender);
         var bestModification;
         var bestEvades;
         var bestEvadeTokens;

         if (modifications.length === 1)
         {
            bestModification = modifications[0];
         }
         else if (modifications.length > 1)
         {
            modifications.forEach(function(modification)
            {
               var mockStore = this.cloneStore(store, attacker, attackerPosition, defender, defenderPosition);
               var mockEnvironment = mockStore.getState().environment;
               var mockAttacker = mockEnvironment.getTokenById(1);
               var mockDefender = mockEnvironment.getTokenById(2);
               var mockDefenseDice = DefenseDice.get(mockStore, mockAttacker.id());
               var mod = new Ability(modification.source(), modification.sourceKey(), modification.type(), modification.abilityKey());
               var consequent = mod.consequent();
               var callback = function() {};
               consequent(mockStore, mockAttacker, callback);
               mockDefenseDice = DefenseDice.get(mockStore, mockAttacker.id());
               var evades = mockDefenseDice.evadeCount();
               var evadeTokens = mockDefender.evadeCount();

               if (bestEvades === undefined || evades > bestEvades)
               {
                  bestModification = modification;
                  bestEvades = evades;
                  bestEvadeTokens = evadeTokens;
               }
               else if (evades === bestEvades && (bestEvadeTokens === undefined || evadeTokens > bestEvadeTokens))
               {
                  bestModification = modification;
                  bestEvadeTokens = evadeTokens;
               }
            }, this);
         }

         var isAccepted = (bestModification !== undefined && bestModification !== null);

         callback(bestModification, isAccepted);
      };

      MediumAgentStrategy.choosePlanningActions = function(agent, tokens, tokenToValidManeuvers, callback)
      {
         InputValidator.validateNotNull("agent", agent);
         InputValidator.validateNotNull("tokens", tokens);
         InputValidator.validateNotNull("tokenToValidManeuvers", tokenToValidManeuvers);
         InputValidator.validateIsFunction("callback", callback);

         var store = agent.store();
         var environment = store.getState().environment;
         var defenders = environment.getDefenders(tokens[0]);
         var tokenToManeuver = {};
         var playFormatKey = environment.playFormatKey();

         tokens.forEach(function(token)
         {
            var fromPosition = environment.getPositionFor(token);
            var shipBase = token.pilot().shipFaction.ship.shipBase;

            // Find the maneuvers which keep the ship on the battlefield.
            var validManeuvers = tokenToValidManeuvers[token];
            var closestManeuver;
            var minDistance;

            // Find the maneuvers which take the ship within range of a defender.
            var validManeuversR1 = [];
            var validManeuversR2 = [];
            var validManeuversR3 = [];

            validManeuvers.forEach(function(maneuverKey)
            {
               var maneuver = Maneuver.properties[maneuverKey];
               var toPosition = ManeuverComputer.computeToPosition(playFormatKey, maneuver, fromPosition, shipBase);
               var weapon = token.primaryWeapon();

               if (weapon)
               {
                  var firingArc = weapon.primaryFiringArc();

                  for (var i = 0; i < defenders.length; i++)
                  {
                     var defender = defenders[i];
                     var defenderPosition = environment.getPositionFor(defender);

                     if (weapon.isDefenderInFiringArc(toPosition, firingArc, defender, defenderPosition))
                     {
                        // Save the maneuver which has the minimum distance.
                        var distance = toPosition.computeDistance(defenderPosition);

                        if (!minDistance || distance < minDistance)
                        {
                           closestManeuver = maneuverKey;
                           minDistance = distance;
                        }
                     }

                     if (weapon.isDefenderTargetable(token, toPosition, defender, defenderPosition))
                     {
                        var range = RangeRuler.getRange(token, toPosition, defender, defenderPosition);

                        switch (range)
                        {
                           case Range.ONE:
                              validManeuversR1.push(maneuverKey);
                              break;
                           case Range.TWO:
                              validManeuversR2.push(maneuverKey);
                              break;
                           case Range.THREE:
                              validManeuversR3.push(maneuverKey);
                              break;
                        }
                     }
                  }
               }
            }, this);

            var myManeuver;

            if (token.isStressed())
            {
               // Choose an easy maneuver.
               var easyManeuvers = validManeuvers.filter(function(maneuverKey)
               {
                  return Maneuver.properties[maneuverKey].difficultyKey === Difficulty.EASY;
               });

               var intersection = easyManeuvers.xwingIntersect(validManeuversR1);
               myManeuver = intersection.xwingRandomElement();

               if (myManeuver === undefined)
               {
                  intersection = easyManeuvers.xwingIntersect(validManeuversR2);
                  myManeuver = intersection.xwingRandomElement();

                  if (myManeuver === undefined)
                  {
                     intersection = easyManeuvers.xwingIntersect(validManeuversR3);
                     myManeuver = intersection.xwingRandomElement();

                     if (myManeuver === undefined)
                     {
                        myManeuver = easyManeuvers.xwingRandomElement();
                     }
                  }
               }
            }

            if (myManeuver === undefined)
            {
               myManeuver = validManeuversR1.xwingRandomElement();

               if (myManeuver === undefined)
               {
                  myManeuver = validManeuversR2.xwingRandomElement();

                  if (myManeuver === undefined)
                  {
                     myManeuver = validManeuversR3.xwingRandomElement();

                     if (myManeuver === undefined)
                     {
                        myManeuver = closestManeuver;

                        if (myManeuver === undefined)
                        {
                           myManeuver = validManeuvers.xwingRandomElement();

                           if (myManeuver === undefined)
                           {
                              // The ship fled the battlefield.
                              var maneuverKeys = token.maneuverKeys();
                              myManeuver = maneuverKeys.xwingRandomElement();
                           }
                        }
                     }
                  }
               }
            }

            tokenToManeuver[token] = myManeuver;
         }, this);

         callback(tokenToManeuver);
      };

      MediumAgentStrategy.chooseShipAction = function(agent, token, shipActions, callback)
      {
         InputValidator.validateNotNull("agent", agent);
         InputValidator.validateNotNull("token", token);
         InputValidator.validateNotNull("shipActions", shipActions);
         InputValidator.validateIsFunction("callback", callback);

         var answer;

         var store = agent.store();
         var targetLocks = shipActions.filter(function(shipAction)
         {
            return shipAction.defender;
         });

         if (TargetLock.getByAttacker(store, token).length === 0 && targetLocks.length > 0)
         {
            answer = targetLocks.xwingRandomElement();
         }
         else if (token.focusCount() === 0 && shipActions.includes(ShipAction.FOCUS))
         {
            answer = ShipAction.FOCUS;
         }
         else if (token.evadeCount() === 0 && shipActions.includes(ShipAction.EVADE))
         {
            answer = ShipAction.EVADE;
         }
         else
         {
            answer = shipActions.xwingRandomElement();
         }

         LOGGER.debug("shipAction for " + token.name() + ": " + answer);

         var isAccepted = (answer !== undefined);

         callback(answer, isAccepted);
      };

      MediumAgentStrategy.chooseWeaponAndDefender = function(agent, attacker, choices, callback)
      {
         InputValidator.validateNotNull("agent", agent);
         InputValidator.validateNotNull("attacker", attacker);
         InputValidator.validateNotNull("choices", choices);
         InputValidator.validateIsFunction("callback", callback);

         var weapon, defender;

         if (choices.length > 0)
         {
            // Choose strongest weapon.
            var weaponData, maxWeaponStrength;

            choices.forEach(function(myWeaponData)
            {
               var weaponValue = myWeaponData.weapon.weaponValue();

               if (maxWeaponStrength === undefined || weaponValue > maxWeaponStrength)
               {
                  weaponData = myWeaponData;
                  weapon = myWeaponData.weapon;
                  maxWeaponStrength = weaponValue;
               }
               else if (weaponValue === maxWeaponStrength && (myWeaponData.weapon.upgrade() === undefined || myWeaponData.weapon.upgrade().isImplemented) && Math.random() >= 0.5)
               {
                  weaponData = myWeaponData;
                  weapon = myWeaponData.weapon;
                  maxWeaponStrength = weaponValue;
               }
            });

            // Choose weakest defender.
            var rangeToDefenders = weaponData.rangeToDefenders;
            var minHullShield;

            rangeToDefenders.forEach(function(rangeData)
            {
               var defenders = rangeData.defenders;

               defenders.forEach(function(myDefender)
               {
                  var hullShield = myDefender.hullValue() + myDefender.shieldValue();

                  if (minHullShield === undefined || hullShield < minHullShield)
                  {
                     defender = myDefender;
                     minHullShield = hullShield;
                  }
               });
            });
         }

         callback(weapon, defender);
      };

      MediumAgentStrategy.cloneStore = function(store, attacker, attackerPosition, defender, defenderPosition)
      {
         var environment = store.getState().environment;
         var newStore = Redux.createStore(Reducer.root);

         var squad1 = new Squad(environment.firstAgent().factionKey(), "First Squad", 2017, "description", [attacker]);
         var squad2 = new Squad(environment.secondAgent().factionKey(), "Second Squad", 2017, "description", [defender]);
         var newEnvironment = new Environment(newStore, environment.firstAgent(), squad1, environment.secondAgent(), squad2, [attackerPosition], [defenderPosition]);
         newStore.dispatch(Action.setEnvironment(newEnvironment));
         var tokens = newEnvironment.tokens();
         var newAttacker = tokens[0];
         var newDefender = tokens[1];

         newStore.dispatch(CardAction.addFocusCount(newAttacker, attacker.focusCount()));
         newEnvironment.setActiveToken(newAttacker);
         newStore.dispatch(CardAction.addEvadeCount(newDefender, defender.evadeCount()));
         newStore.dispatch(CardAction.addFocusCount(newDefender, defender.focusCount()));
         var oldAttackDice = AttackDice.get(store, attacker.id());
         newStore.dispatch(Action.setTokenAttackDice(newAttacker.id(), oldAttackDice.values()));
         var oldDefenseDice = DefenseDice.get(store, attacker.id());
         newStore.dispatch(Action.setTokenDefenseDice(newAttacker.id(), oldDefenseDice.values()));

         var oldTargetLock = TargetLock.getFirst(store, attacker, defender);
         if (oldTargetLock !== undefined)
         {
            TargetLock.newInstance(newStore, newAttacker, newDefender);
         }

         var oldCombatAction = Selector.combatAction(store.getState(), attacker);
         var newCombatAction = new CombatAction(newStore, newAttacker, oldCombatAction.weapon(), newDefender, function() {});
         newStore.dispatch(Action.setTokenCombatAction(newAttacker, newCombatAction));

         return newStore;
      };

      MediumAgentStrategy.dealDamage = function(agent)
      {
         InputValidator.validateNotNull("agent", agent);

         // Nothing to do.
      };

      MediumAgentStrategy.name = "MediumAgent";

      return MediumAgentStrategy;
   });
