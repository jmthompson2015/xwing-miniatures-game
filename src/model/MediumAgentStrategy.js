import ArrayUtilities from "../utility/ArrayUtilities.js";
import InputValidator from "../utility/InputValidator.js";

import Difficulty from "../artifact/Difficulty.js";
import Maneuver from "../artifact/Maneuver.js";
import Range from "../artifact/Range.js";
import ShipAction from "../artifact/ShipAction.js";

import Ability from "./Ability.js";
import Action from "./Action.js";
import AttackDice from "./AttackDice.js";
import CardAction from "./CardAction.js";
import CombatAction from "./CombatAction.js";
import DefenseDice from "./DefenseDice.js";
import Environment from "./Environment.js";
import ManeuverComputer from "./ManeuverComputer.js";
import RangeRuler from "./RangeRuler.js";
import Reducer from "./Reducer.js";
import Selector from "./Selector.js";
import Squad from "./Squad.js";
import TargetLock from "./TargetLock.js";

const MediumAgentStrategy = {};

MediumAgentStrategy.chooseAbility = function(agent, damageAbilities, pilotAbilities, upgradeAbilities, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("damageAbilities", damageAbilities);
   InputValidator.validateNotNull("pilotAbilities", pilotAbilities);
   InputValidator.validateNotNull("upgradeAbilities", upgradeAbilities);
   InputValidator.validateIsFunction("callback", callback);

   let ability = (damageAbilities.length > 0 ? ArrayUtilities.randomElement(damageAbilities) : undefined);

   if (ability === undefined)
   {
      ability = (upgradeAbilities.length > 0 ? ArrayUtilities.randomElement(upgradeAbilities) : undefined);

      if (ability === undefined)
      {
         ability = (pilotAbilities.length > 0 ? ArrayUtilities.randomElement(pilotAbilities) : undefined);
      }
   }

   const isAccepted = (ability !== undefined);

   callback(ability, isAccepted);
};

MediumAgentStrategy.chooseDecloakAction = function(agent, token, decloakActions, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("decloakActions", decloakActions);
   InputValidator.validateIsFunction("callback", callback);

   const answer = ArrayUtilities.randomElement(decloakActions);

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
   const store = agent.store();
   const environment = store.getState().environment;
   const attackerPosition = environment.getPositionFor(attacker);
   const defenderPosition = environment.getPositionFor(defender);
   let bestModification;
   let bestHits;
   let bestFocusTokens;

   if (modifications.length === 1)
   {
      bestModification = modifications[0];
   }
   else if (modifications.length > 1)
   {
      modifications.forEach(function(modification)
      {
         const mockStore = this.cloneStore(store, attacker, attackerPosition, defender, defenderPosition);
         const mockEnvironment = mockStore.getState().environment;
         const mockAttacker = mockEnvironment.pilotInstances()[0];
         let mockAttackDice = AttackDice.get(mockStore, mockAttacker.id());
         const mod = new Ability(modification.source(), modification.sourceKey(), modification.abilityType(), modification.abilityKey());
         const consequent = mod.consequent();
         const callback = function() {};
         consequent(mockStore, mockAttacker, callback);
         mockAttackDice = AttackDice.get(mockStore, mockAttacker.id());
         const hits = mockAttackDice.hitCount() + mockAttackDice.criticalHitCount();
         const focusTokens = mockAttacker.focusCount();

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

   const isAccepted = (bestModification !== undefined && bestModification !== null);

   callback(bestModification, isAccepted);
};

MediumAgentStrategy.chooseModifyDefenseDiceAction = function(agent, attacker, defender, modifications, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateNotNull("modifications", modifications);
   InputValidator.validateIsFunction("callback", callback);

   const store = agent.store();
   const environment = store.getState().environment;
   const attackerPosition = environment.getPositionFor(attacker);
   const defenderPosition = environment.getPositionFor(defender);
   let bestModification;
   let bestEvades;
   let bestEvadeTokens;

   if (modifications.length === 1)
   {
      bestModification = modifications[0];
   }
   else if (modifications.length > 1)
   {
      modifications.forEach(function(modification)
      {
         const mockStore = this.cloneStore(store, attacker, attackerPosition, defender, defenderPosition);
         const mockEnvironment = mockStore.getState().environment;
         const mockAttacker = mockEnvironment.getTokenById(1);
         const mockDefender = mockEnvironment.getTokenById(2);
         let mockDefenseDice = DefenseDice.get(mockStore, mockAttacker.id());
         const mod = new Ability(modification.source(), modification.sourceKey(), modification.abilityType(), modification.abilityKey());
         const consequent = mod.consequent();
         const callback = function() {};
         consequent(mockStore, mockAttacker, callback);
         mockDefenseDice = DefenseDice.get(mockStore, mockAttacker.id());
         const evades = mockDefenseDice.evadeCount();
         const evadeTokens = mockDefender.evadeCount();

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

   const isAccepted = (bestModification !== undefined && bestModification !== null);

   callback(bestModification, isAccepted);
};

MediumAgentStrategy.choosePlanningActions = function(agent, tokens, tokenToValidManeuvers, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateIsArray("tokens", tokens);
   InputValidator.validateNotNull("tokenToValidManeuvers", tokenToValidManeuvers);
   InputValidator.validateIsFunction("callback", callback);

   const store = agent.store();
   const environment = store.getState().environment;
   const tokenToManeuver = {};

   if (tokens.length > 0)
   {
      const defenders = environment.getDefenders(tokens[0]);
      const playFormatKey = environment.playFormatKey();

      tokens.forEach(function(token)
      {
         const fromPosition = environment.getPositionFor(token);
         const shipBase = token.card().shipFaction.ship.shipBase;

         // Find the maneuvers which keep the ship on the battlefield.
         const validManeuvers = tokenToValidManeuvers[token];
         let closestManeuver;
         let minDistance;

         // Find the maneuvers which take the ship within range of a defender.
         const validManeuversR1 = [];
         const validManeuversR2 = [];
         const validManeuversR3 = [];

         validManeuvers.forEach(function(maneuverKey)
         {
            const maneuver = Maneuver.properties[maneuverKey];
            const toPosition = ManeuverComputer.computeToPosition(playFormatKey, maneuver, fromPosition, shipBase);
            const weapon = token.primaryWeapon();

            if (weapon)
            {
               const firingArc = weapon.primaryFiringArc();

               for (let i = 0; i < defenders.length; i++)
               {
                  const defender = defenders[i];
                  const defenderPosition = environment.getPositionFor(defender);

                  if (weapon.isDefenderInFiringArc(toPosition, firingArc, defender, defenderPosition))
                  {
                     // Save the maneuver which has the minimum distance.
                     const distance = toPosition.computeDistance(defenderPosition);

                     if (!minDistance || distance < minDistance)
                     {
                        closestManeuver = maneuverKey;
                        minDistance = distance;
                     }
                  }

                  if (weapon.isDefenderTargetable(token, toPosition, defender, defenderPosition))
                  {
                     const range = RangeRuler.getRange(token, toPosition, defender, defenderPosition);

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

         let myManeuver;

         if (token.isStressed())
         {
            // Choose an easy maneuver.
            const easyManeuvers = validManeuvers.filter(function(maneuverKey)
            {
               return Maneuver.properties[maneuverKey].difficultyKey === Difficulty.EASY;
            });

            let intersection = ArrayUtilities.intersect(easyManeuvers, validManeuversR1);
            myManeuver = ArrayUtilities.randomElement(intersection);

            if (myManeuver === undefined)
            {
               intersection = ArrayUtilities.intersect(easyManeuvers, validManeuversR2);
               myManeuver = ArrayUtilities.randomElement(intersection);

               if (myManeuver === undefined)
               {
                  intersection = ArrayUtilities.intersect(easyManeuvers, validManeuversR3);
                  myManeuver = ArrayUtilities.randomElement(intersection);

                  if (myManeuver === undefined)
                  {
                     myManeuver = ArrayUtilities.randomElement(easyManeuvers);
                  }
               }
            }
         }

         if (myManeuver === undefined)
         {
            myManeuver = ArrayUtilities.randomElement(validManeuversR1);

            if (myManeuver === undefined)
            {
               myManeuver = ArrayUtilities.randomElement(validManeuversR2);

               if (myManeuver === undefined)
               {
                  myManeuver = ArrayUtilities.randomElement(validManeuversR3);

                  if (myManeuver === undefined)
                  {
                     myManeuver = closestManeuver;

                     if (myManeuver === undefined)
                     {
                        myManeuver = ArrayUtilities.randomElement(validManeuvers);

                        if (myManeuver === undefined)
                        {
                           // The ship fled the battlefield.
                           const maneuverKeys = token.maneuverKeys();
                           myManeuver = ArrayUtilities.randomElement(maneuverKeys);
                        }
                     }
                  }
               }
            }
         }

         tokenToManeuver[token.id()] = myManeuver;
      }, this);
   }

   callback(tokenToManeuver);
};

MediumAgentStrategy.chooseShipAction = function(agent, token, shipActions, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("shipActions", shipActions);
   InputValidator.validateIsFunction("callback", callback);

   let answer;

   const store = agent.store();
   const targetLocks = shipActions.filter(function(shipAction)
   {
      return shipAction.defender;
   });

   if (TargetLock.getByAttacker(store, token).length === 0 && targetLocks.length > 0)
   {
      answer = ArrayUtilities.randomElement(targetLocks);
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
      answer = ArrayUtilities.randomElement(shipActions);
   }

   LOGGER.debug("shipAction for " + token.name() + ": " + answer);

   const isAccepted = (answer !== undefined);

   callback(answer, isAccepted);
};

MediumAgentStrategy.chooseWeaponAndDefender = function(agent, attacker, choices, callback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("choices", choices);
   InputValidator.validateIsFunction("callback", callback);

   let weapon, defender;

   if (choices.length > 0)
   {
      // Choose strongest weapon.
      let weaponData, maxWeaponStrength;

      choices.forEach(function(myWeaponData)
      {
         const weaponValue = myWeaponData.weapon.weaponValue();

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
      const rangeToDefenders = weaponData.rangeToDefenders;
      let minHullShield;

      rangeToDefenders.forEach(function(rangeData)
      {
         const defenders = rangeData.defenders;

         defenders.forEach(function(myDefender)
         {
            const hullShield = myDefender.hullValue() + myDefender.shieldValue();

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
   const environment = store.getState().environment;
   const newStore = Redux.createStore(Reducer.root);

   const factionKey1 = attacker.card().shipFaction.factionKey;
   const factionKey2 = defender.card().shipFaction.factionKey;
   const squad1 = new Squad(factionKey1, "First Squad", 2017, "description", [attacker]);
   const squad2 = new Squad(factionKey2, "Second Squad", 2017, "description", [defender]);
   const newEnvironment = new Environment(newStore, environment.firstAgent(), squad1, environment.secondAgent(), squad2, [attackerPosition], [defenderPosition]);
   newStore.dispatch(Action.setEnvironment(newEnvironment));
   const tokens = newEnvironment.pilotInstances();
   const newAttacker = tokens[0];
   const newDefender = tokens[1];

   newStore.dispatch(CardAction.addFocusCount(newAttacker, attacker.focusCount()));
   newEnvironment.setActiveToken(newAttacker);
   newStore.dispatch(CardAction.addEvadeCount(newDefender, defender.evadeCount()));
   newStore.dispatch(CardAction.addFocusCount(newDefender, defender.focusCount()));
   const oldAttackDice = AttackDice.get(store, attacker.id());
   newStore.dispatch(Action.setTokenAttackDice(newAttacker.id(), oldAttackDice.values()));
   const oldDefenseDice = DefenseDice.get(store, attacker.id());
   newStore.dispatch(Action.setTokenDefenseDice(newAttacker.id(), oldDefenseDice.values()));

   const oldTargetLock = TargetLock.getFirst(store, attacker, defender);
   if (oldTargetLock !== undefined)
   {
      TargetLock.newInstance(newStore, newAttacker, newDefender);
   }

   const oldCombatAction = Selector.combatAction(store.getState(), attacker);

   if (oldCombatAction !== undefined)
   {
      const newCombatAction = new CombatAction(newStore, newAttacker, oldCombatAction.weapon(), newDefender, function() {});
      newStore.dispatch(Action.setTokenCombatAction(newAttacker, newCombatAction));
   }

   return newStore;
};

MediumAgentStrategy.dealDamage = function(agent)
{
   InputValidator.validateNotNull("agent", agent);

   // Nothing to do.
};

MediumAgentStrategy.name = "MediumAgent";

export default MediumAgentStrategy;