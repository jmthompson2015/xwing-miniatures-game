import InputValidator from "../utility/InputValidator.js";

import DamageCard from "../artifact/DamageCard.js";
import DiceModification from "../artifact/DiceModification.js";
import Maneuver from "../artifact/Maneuver.js";
import Phase from "../artifact/Phase.js";
import PilotCard from "../artifact/PilotCard.js";
import PlayFormat from "../artifact/PlayFormat.js";
import Range from "../artifact/Range.js";
import ShipAction from "../artifact/ShipAction.js";
import UpgradeCard from "../artifact/UpgradeCard.js";
import UpgradeHeader from "../artifact/UpgradeHeader.js";

import Ability from "./Ability.js";
import Action from "./Action.js";
import AgentAction from "./AgentAction.js";
import CardInstance from "./CardInstance.js";
import DamageAbility2 from "./DamageAbility2.js";
import ManeuverComputer from "./ManeuverComputer.js";
import MediumAgentStrategy from "./MediumAgentStrategy.js";
import ModifyDiceAbility from "./ModifyDiceAbility.js";
import PilotAbility3 from "./PilotAbility3.js";
import Selector from "./Selector.js";
import ShipActionAbility from "./ShipActionAbility.js";
import SimpleAgentStrategy from "./SimpleAgentStrategy.js";
import TargetLock from "./TargetLock.js";
import UpgradeAbility2 from "./UpgradeAbility2.js";
import UpgradeAbility3 from "./UpgradeAbility3.js";

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

   let id = idIn;

   if (isNaN(id))
   {
      id = store.getState().nextAgentId;
      store.dispatch(AgentAction.incrementNextAgentId());
   }

   this.id = function()
   {
      return id;
   };

   const strategy = (strategyIn !== undefined ? strategyIn : SimpleAgentStrategy);

   this._strategy = function()
   {
      return strategy;
   };

   const isNew = (isNewIn !== undefined ? isNewIn : true);

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

   const answer = [];
   const maneuverKeys = [Maneuver.BARREL_ROLL_LEFT_2_STANDARD, Maneuver.STRAIGHT_2_STANDARD, Maneuver.BARREL_ROLL_RIGHT_2_STANDARD];
   const store = this.store();
   const adjudicator = store.getState().adjudicator;

   maneuverKeys.forEach(function(maneuverKey)
   {
      if (adjudicator.canDecloak(token, maneuverKey))
      {
         const context = {
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

   const store = this.store();
   const environment = store.getState().environment;
   const fromPosition = environment.getPositionFor(token);
   const shipBase = token.card().shipFaction.ship.shipBase;
   const playFormatKey = environment.playFormatKey();
   const maneuverKeys = token.maneuverKeys();

   // Find the maneuvers which keep the ship on the battlefield.
   return maneuverKeys.filter(function(maneuverKey)
   {
      const maneuver = Maneuver.properties[maneuverKey];
      const toPosition = ManeuverComputer.computeToPosition(playFormatKey, maneuver, fromPosition, shipBase);
      let polygon;

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

   const answer = [];
   const store = this.store();

   const usedDiceMods = attacker.usedAbilityKeys(DiceModification);

   DiceModification.keys().forEach(function(modificationKey)
   {
      if (!usedDiceMods.includes(modificationKey))
      {
         const modifyDiceAbility = ModifyDiceAbility[ModifyDiceAbility.ATTACK_KEY][modificationKey];

         if (modifyDiceAbility !== undefined && modifyDiceAbility.condition(store, attacker))
         {
            answer.push(new Ability(DiceModification, modificationKey, ModifyDiceAbility, ModifyDiceAbility.ATTACK_KEY));
         }
      }
   });

   const pilotKey = attacker.card().key;

   if (!attacker.isAbilityUsed(PilotCard, pilotKey) && !attacker.isPerRoundAbilityUsed(PilotCard, pilotKey))
   {
      const pilotAbility = PilotAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][pilotKey];

      if (pilotAbility !== undefined && pilotAbility.condition(store, attacker))
      {
         answer.push(new Ability(PilotCard, pilotKey, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE));
      }
   }

   let attackerUsedUpgrades = attacker.usedAbilityKeys(UpgradeCard);
   attackerUsedUpgrades = attackerUsedUpgrades.concat(attacker.usedPerRoundAbilityKeys(UpgradeCard));

   attacker.upgradeKeys().forEach(function(upgradeKey)
   {
      if (!attackerUsedUpgrades.includes(upgradeKey))
      {
         const upgradeAbility = UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][upgradeKey];

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

   const answer = [];
   const store = this.store();
   const usedDiceMods = defender.usedAbilityKeys(DiceModification);

   DiceModification.keys().forEach(function(modificationKey)
   {
      if (!usedDiceMods.includes(modificationKey))
      {
         const modifyDiceAbility = ModifyDiceAbility[ModifyDiceAbility.DEFENSE_KEY][modificationKey];

         if (modifyDiceAbility !== undefined && modifyDiceAbility.condition(store, defender))
         {
            answer.push(new Ability(DiceModification, modificationKey, ModifyDiceAbility, ModifyDiceAbility.DEFENSE_KEY));
         }
      }
   });

   const pilotKey = defender.card().key;

   if (!defender.isAbilityUsed(PilotCard, pilotKey) && !defender.isPerRoundAbilityUsed(PilotCard, pilotKey))
   {
      const pilotAbility = PilotAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][pilotKey];

      if (pilotAbility !== undefined && pilotAbility.condition(store, defender))
      {
         answer.push(new Ability(PilotCard, pilotKey, PilotAbility3, Phase.COMBAT_MODIFY_DEFENSE_DICE));
      }
   }

   let defenderUsedUpgrades = attacker.usedAbilityKeys(UpgradeCard);
   defenderUsedUpgrades = defenderUsedUpgrades.concat(attacker.usedPerRoundAbilityKeys(UpgradeCard));

   defender.upgradeKeys().forEach(function(upgradeKey)
   {
      if (!defenderUsedUpgrades.includes(upgradeKey))
      {
         const upgradeAbility = UpgradeAbility3[Phase.COMBAT_MODIFY_DEFENSE_DICE][upgradeKey];

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

   const answer = [];
   const store = this.store();
   const environment = store.getState().environment;
   const adjudicator = store.getState().adjudicator;

   if (!adjudicator.canSelectShipAction(token))
   {
      return answer;
   }

   let shipActionKeys = (shipActionKeys0 !== undefined ? shipActionKeys0 : token.shipActions());
   const usedShipActionKeys = token.usedPerRoundAbilityKeys(ShipAction);
   shipActionKeys = shipActionKeys.filter(function(shipActionKey)
   {
      return !usedShipActionKeys.includes(shipActionKey);
   });

   let context;
   const maneuverKeysMap = {};
   maneuverKeysMap[ShipAction.BARREL_ROLL] = [Maneuver.BARREL_ROLL_LEFT_1_STANDARD, Maneuver.BARREL_ROLL_RIGHT_1_STANDARD];
   maneuverKeysMap[ShipAction.BOOST] = [Maneuver.BANK_LEFT_1_STANDARD, Maneuver.STRAIGHT_1_STANDARD, Maneuver.BANK_RIGHT_1_STANDARD];
   maneuverKeysMap[ShipAction.SLAM] = token.card().shipFaction.ship.maneuverKeys;
   const canDoItMap = {};
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
   let tokens;

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
               const isHuge = myToken.isHuge();

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
               const tokenParent = environment.parentOf(token);

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
            const defenders = (token.isUpgradedWith(UpgradeCard.ST_321) ? environment.getDefenders(token) : environment.getDefendersInRange(token));
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
      const phaseKey = Phase.ACTIVATION_PERFORM_ACTION;
      const usedUpgradeKeys = token.usedPerRoundAbilityKeys(UpgradeCard);

      token.upgradeKeys().forEach(function(upgradeKey)
      {
         const myUpgrade = UpgradeCard.properties[upgradeKey];

         if (myUpgrade && myUpgrade.headerKey === UpgradeHeader.ACTION)
         {
            const myAbility = UpgradeAbility2[phaseKey][upgradeKey];

            if (myAbility !== undefined && !usedUpgradeKeys.includes(upgradeKey) && myAbility.condition(store, token))
            {
               answer.push(new Ability(UpgradeCard, upgradeKey, UpgradeAbility2, phaseKey));
            }
         }
      });

      const usedDamageKeys = token.usedPerRoundAbilityKeys(DamageCard);

      token.criticalDamageKeys().forEach(function(damageKey)
      {
         const myDamage = DamageCard.properties[damageKey];

         if (myDamage && myDamage.hasAction)
         {
            const myAbility = DamageAbility2[phaseKey][damageKey];

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

   const store = this.store();
   const environment = store.getState().environment;
   const choices = environment.createWeaponToRangeToDefenders(attacker, weaponIn);

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

   const store = this.store();
   const weapon = Selector.combatAction(store.getState(), attacker).weapon();

   this._strategy().dealDamage(this, attacker, weapon, attackDice, defender, defenseDice, damageDealer, callback);
};

Agent.prototype.getDecloakAction = function(token, callback)
{
   InputValidator.validateNotNull("token", token);
   InputValidator.validateIsFunction("callback", callback);

   const decloakActions = this.determineValidDecloakActions(token);
   this._strategy().chooseDecloakAction(this, token, decloakActions, callback);
};

Agent.prototype.getModifyAttackDiceAction = function(attacker, defender, callback)
{
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateIsFunction("callback", callback);

   const modifications = this.determineValidModifyAttackDiceActions(attacker, defender);
   this._strategy().chooseModifyAttackDiceAction(this, attacker, defender, modifications, callback);
};

Agent.prototype.getModifyDefenseDiceAction = function(attacker, defender, callback)
{
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateIsFunction("callback", callback);

   const modifications = this.determineValidModifyDefenseDiceActions(attacker, defender);
   this._strategy().chooseModifyDefenseDiceAction(this, attacker, defender, modifications, callback);
};

Agent.prototype.getPlanningAction = function(callback)
{
   InputValidator.validateIsFunction("callback", callback);

   const isPure = false;
   const tokens = this.pilotInstances(isPure);
   const tokenToValidManeuvers = {};

   tokens.forEach(function(token)
   {
      const validManeuvers = this.determineValidManeuvers(token);
      tokenToValidManeuvers[token] = validManeuvers;
   }, this);

   this._strategy().choosePlanningActions(this, tokens, tokenToValidManeuvers, callback);
};

Agent.prototype.getShipAction = function(token, callback, shipActionKeys0)
{
   InputValidator.validateNotNull("token", token);
   // callback optional.
   // shipActionKeys0 optional.

   const store = token.store();
   const environment = store.getState().environment;
   const activeCardInstance = environment.activeCardInstance();

   if (activeCardInstance && activeCardInstance.id() === token.id())
   {
      const shipActionKeys = this.determineValidShipActions(token, shipActionKeys0);
      this._strategy().chooseShipAction(this, token, shipActionKeys, callback);
   }
   else
   {
      callback();
   }
};

Agent.prototype.pilotInstances = function(isPureIn)
{
   const store = this.store();
   const isPure = (isPureIn !== undefined ? isPureIn : false);
   const ids = store.getState().agentPilots.get(this.id());
   let answer = Agent.idsToCardInstances(store, ids).toJS();

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
   const store = this.store();
   const id = this.id();
   const values = Immutable.Map(
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

   const values = store.getState().agents.get(id);
   let answer;

   if (values !== undefined)
   {
      const name = values.get("name");
      const strategy = values.get("strategy");
      const isNew = false;

      answer = new Agent(store, name, id, strategy, isNew);
   }

   return answer;
};

Agent.idsToCardInstances = function(store, ids)
{
   InputValidator.validateNotNull("store", store);
   // ids optional.

   let answer;

   if (ids !== undefined)
   {
      answer = ids.reduce(function(accumulator, id)
      {
         const cardInstance = CardInstance.get(store, id);
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

export default Agent;