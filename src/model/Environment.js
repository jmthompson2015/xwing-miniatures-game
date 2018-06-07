/*
 * Provides an environment.
 * <dl>
 * <dt>heading</dt>
 * <dd>Absolute angle in degrees from the +X axis measured clockwise. Angle is normalized to [0,360).
 * <dt>bearing</dt>
 * <dd>Relative angle in degrees from a ship's heading measured clockwise. Angle is normalized to [0,360).
 * <dt>in range</dt>
 * <dd>Distance to target has a non-null range (ONE, TWO, or THREE) from the <code>RangeRuler</code>.
 * <dt>in firing arc</dt>
 * <dd>Defender's bearing is within the attacker's primary weapon firing arc (typically +/-45 deg forward).
 * <dt>vulnerable</dt>
 * <dd>The attacker's primary weapon can be brought to bear on the defender, although the defender may be out of range.
 * Typically this is the same as in firing arc.</dd>
 * <dt>targetable</dt>
 * <dd>Defender can be hit by the attacker's primary weapon. Typically this means the target is in range and vulnerable,
 * but not touching.
 * </dl>
 */
import ArrayUtilities from "../utility/ArrayUtilities.js";
import InputValidator from "../utility/InputValidator.js";

import CardType from "../artifact/CardType.js";
import DamageCard from "../artifact/DamageCard.js";
import Faction from "../artifact/Faction.js";
import PlayFormat from "../artifact/PlayFormat.js";
import Range from "../artifact/Range.js";

import Action from "./Action.js";
import AgentAction from "./AgentAction.js";
import CardComparator from "./CardComparator.js";
import CardInstance from "./CardInstance.js";
import EnvironmentAction from "./EnvironmentAction.js";
// import ManeuverComputer from "./ManeuverComputer.js";
import Position from "./Position.js";
import RangeRuler from "./RangeRuler.js";
// import RectanglePath from "./RectanglePath.js";
import Squad from "./Squad.js";

function Environment(store, agent1, squad1, agent2, squad2, positions1, positions2)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("agent1", agent1);
   InputValidator.validateNotNull("squad1", squad1);
   InputValidator.validateNotNull("agent2", agent2);
   InputValidator.validateNotNull("squad2", squad2);
   // positions1 optional.
   // positions2 optional.

   this.store = function()
   {
      return store;
   };

   store.dispatch(Action.setEnvironment(this));

   // Initialize the damage deck.
   const damageDeck = CardInstance.keysToCardInstances(store, CardType.DAMAGE, DamageCard.createDeckV2());
   const damageDeckIds = CardInstance.cardInstancesToIds(damageDeck);
   store.dispatch(EnvironmentAction.setDamageDeck(damageDeckIds));

   this._placeInitialTokens(agent1, squad1, agent2, squad2, positions1, positions2);
}

//////////////////////////////////////////////////////////////////////////
// Accessor methods.

Environment.prototype.activeCardInstance = function()
{
   const store = this.store();
   const activeCardId = store.getState().activeCardId;

   return (activeCardId !== undefined ? CardInstance.get(store, activeCardId) : undefined);
};

Environment.prototype.cardInstances = function(cardTypeKey)
{
   // cardTypeKey optional.

   const store = this.store();
   const cardInstances = store.getState().cardInstances;
   const keys = cardInstances.keySeq().toArray();

   let answer = keys.map(function(id)
   {
      return CardInstance.get(store, id);
   });

   if (cardTypeKey !== undefined)
   {
      answer = answer.filter(function(cardInstance)
      {
         return cardInstance.card().cardTypeKey === cardTypeKey;
      });
   }

   return answer;
};

Environment.prototype.createTokenPositions = function()
{
   const answer = [];

   const tokens = this.pilotInstances();

   tokens.forEach(function(token)
   {
      const position = this.getPositionFor(token);
      answer.push(
      {
         token: token,
         position: position
      });
   }, this);

   return answer;
};

Environment.prototype.createWeaponToRangeToDefenders = function(attacker, weaponIn)
{
   InputValidator.validateNotNull("attacker", attacker);
   // weaponIn optional.

   const answer = [];

   const attackerPosition = this.getPositionFor(attacker);

   if (attackerPosition)
   {
      const primaryWeapon = attacker.primaryWeapon();

      if (primaryWeapon && (!weaponIn || weaponIn.equals(primaryWeapon)))
      {
         const rangeToDefenders = this._createRangeToDefenders(attacker, attackerPosition, primaryWeapon);

         if (rangeToDefenders.length > 0)
         {
            answer.push(this._createWeaponData(primaryWeapon, rangeToDefenders));
         }
      }

      const weapons = attacker.secondaryWeapons();

      weapons.forEach(function(weapon)
      {
         if (!weaponIn || weaponIn.equals(weapon))
         {
            const rangeToDefenders = this._createRangeToDefenders(attacker, attackerPosition, weapon);

            if (rangeToDefenders.length > 0)
            {
               answer.push(this._createWeaponData(weapon, rangeToDefenders));
            }
         }
      }, this);
   }

   return answer;
};

Environment.prototype.firstAgent = function()
{
   const store = this.store();

   return store.getState().firstAgent;
};

Environment.prototype.firstSquad = function()
{
   const store = this.store();

   return store.getState().firstSquad;
};

Environment.prototype.getDefenders = function(attacker0)
{
   InputValidator.validateNotNull("attacker", attacker0);

   const attacker = (attacker0.idParent() !== undefined ? this.parentOf(attacker0) : attacker0);
   let answer = [];
   const firstTokens = this.firstSquad().tokens();
   const firstTokenIds = firstTokens.map(function(token)
   {
      return token.id();
   });
   const secondTokens = this.secondSquad().tokens();
   const secondTokenIds = secondTokens.map(function(token)
   {
      return token.id();
   });

   if (firstTokenIds.includes(attacker.id()))
   {
      answer = secondTokens.filter(function(token)
      {
         return !token.isDestroyed() && this.getPositionFor(token) !== undefined;
      }, this);
   }
   else if (secondTokenIds.includes(attacker.id()))
   {
      answer = firstTokens.filter(function(token)
      {
         return !token.isDestroyed() && this.getPositionFor(token) !== undefined;
      }, this);
   }
   else
   {
      throw "Can't find defenders for attacker = " + attacker;
   }

   return answer;
};

Environment.prototype.getDefendersInRange = function(attacker)
{
   InputValidator.validateNotNull("attacker", attacker);

   let answer = [];
   const attackerPosition = this.getPositionFor(attacker);

   if (attackerPosition)
   {
      const defenders = this.getDefenders(attacker);

      if (defenders && defenders.length > 0)
      {
         answer = defenders.filter(function(defender)
         {
            const defenderPosition = this.getPositionFor(defender);
            const range = RangeRuler.getRange(attacker, attackerPosition, defender, defenderPosition);
            return (Range.STANDARD_RANGES.includes(range));
         }, this);
      }
   }

   return answer;
};

Environment.prototype.getFriendlyTokensAtRange = function(token0, range)
{
   return this.getTokensAtRange(token0, range).filter(function(token)
   {
      return Faction.isFriendly(token.card().shipFaction.factionKey, token0.card().shipFaction.factionKey);
   });
};

Environment.prototype.getPositionFor = function(token)
{
   InputValidator.validateNotNull("token", token);
   InputValidator.validateIsFunction("token.id", token.id);

   const store = this.store();
   let answer;

   if (token.idParent() !== undefined)
   {
      const tokenParent = this.parentOf(token);
      const parentPosition = this.getPositionFor(tokenParent);

      if (parentPosition)
      {
         const angle = parentPosition.heading() * Math.PI / 180.0;
         const length = 72;
         let x, y;

         if (token.card().key.endsWith(".fore"))
         {
            x = parentPosition.x() + length * Math.cos(angle);
            y = parentPosition.y() + length * Math.sin(angle);
         }
         else
         {
            x = parentPosition.x() - length * Math.cos(angle);
            y = parentPosition.y() - length * Math.sin(angle);
         }

         if (PlayFormat.isPointInPlayArea(store.getState().playFormatKey, x, y))
         {
            answer = new Position(x, y, parentPosition.heading());
         }
      }
   }
   else
   {
      answer = store.getState().cardPosition.get(token.id());
   }

   return answer;
};

Environment.prototype.getTargetableDefenders = function(attacker, attackerPosition, weapon)
{
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("attackerPosition", attackerPosition);
   InputValidator.validateNotNull("weapon", weapon);

   let answer = this.getDefenders(attacker);
   LOGGER.trace("Environment.getTargetableDefenders() 0 defenders = " + answer);
   answer = answer.filter(function(defender)
   {
      const defenderPosition = this.getPositionFor(defender);
      return this._isTargetable(attacker, attackerPosition, weapon, defender, defenderPosition);
   }, this);
   LOGGER.trace("Environment.getTargetableDefenders() 1 targetable defenders = " + answer);

   return answer;
};

Environment.prototype.getTargetableDefendersAtRange = function(attacker, attackerPosition, weapon, range)
{
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("attackerPosition", attackerPosition);
   InputValidator.validateNotNull("weapon", weapon);
   InputValidator.validateNotNull("range", range);

   let answer = this.getTargetableDefenders(attacker, attackerPosition, weapon);
   LOGGER.trace("Environment.getTargetableDefendersAtRange() 0 targetable defenders = " + answer);
   answer = answer.filter(function(defender)
   {
      const defenderPosition = this.getPositionFor(defender);
      const myRange = RangeRuler.getRange(attacker, attackerPosition, defender, defenderPosition);
      return (myRange === range);
   }, this);
   LOGGER.trace("Environment.getTargetableDefendersAtRange() 1 targetable defenders = " + answer);

   return answer;
};

Environment.prototype.getTokenAt = function(position)
{
   InputValidator.validateNotNull("position", position);

   const store = this.store();
   let answer;
   const tokenId = store.getState().positionToCardId.get(position.toString());

   if (tokenId !== undefined)
   {
      answer = this.getTokenById(tokenId);
   }

   return answer;
};

Environment.prototype.getTokenById = function(tokenId)
{
   let answer;

   if (tokenId !== undefined)
   {
      const store = this.store();
      answer = CardInstance.get(store, tokenId);
   }

   return answer;
};

Environment.prototype.getTokensAtRange = function(token0, range)
{
   InputValidator.validateNotNull("token0", token0);
   InputValidator.validateNotNull("range", range);

   const position0 = this.getPositionFor(token0);

   return this.pilotInstances().filter(function(token)
   {
      let answer;

      if (token.equals(token0))
      {
         answer = false;
      }
      else
      {
         const position = this.getPositionFor(token);

         if (position0 !== undefined && position !== undefined)
         {
            const myRange = RangeRuler.getRange(token0, position0, token, position);
            answer = (myRange === range);
         }
         else
         {
            answer = false;
         }
      }

      return answer;
   }, this);
};

Environment.prototype.getTokensForActivation = function(isPure)
{
   const pilotInstances = this.pilotInstances(isPure);
   pilotInstances.sort(CardComparator.Activation);

   return pilotInstances;
};

Environment.prototype.getTokensForCombat = function()
{
   const isPure = true;
   const pilotInstances = this.pilotInstances(isPure);
   pilotInstances.sort(CardComparator.Combat);

   return pilotInstances;
};

Environment.prototype.getUnfriendlyTokensAtRange = function(token0, range)
{
   return this.getTokensAtRange(token0, range).filter(function(token)
   {
      return !Faction.isFriendly(token.card().shipFaction.factionKey, token0.card().shipFaction.factionKey);
   });
};

Environment.prototype.parentOf = function(pilotInstance)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);

   let answer;
   const idParent = pilotInstance.idParent();

   if (idParent !== undefined)
   {
      const store = this.store();
      answer = CardInstance.get(store, idParent);
   }

   return answer;
};

Environment.prototype.pilotInstances = function(isPure)
{
   const cardInstances = this.cardInstances(CardType.PILOT);

   return cardInstances.reduce(function(accumulator, cardInstance)
   {
      if (cardInstance.isChild())
      {
         // Skip it.
      }
      else if (isPure && cardInstance.isParent())
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
};

Environment.prototype.playFormat = function()
{
   return PlayFormat.properties[this.playFormatKey()];
};

Environment.prototype.playFormatKey = function()
{
   const store = this.store();
   return store.getState().playFormatKey;
};

Environment.prototype.round = function()
{
   const store = this.store();

   return store.getState().round;
};

Environment.prototype.secondAgent = function()
{
   const store = this.store();

   return store.getState().secondAgent;
};

Environment.prototype.secondSquad = function()
{
   const store = this.store();

   return store.getState().secondSquad;
};

Environment.prototype.toString = function()
{
   const tokens = this.pilotInstances();
   const getPositionFor = this.getPositionFor.bind(this);
   return tokens.reduce(function(accumulator, token)
   {
      const position = getPositionFor(token);
      return accumulator + position.toString() + " " + token.toString() + "\n";
   }, "");
};

//////////////////////////////////////////////////////////////////////////
// Mutator methods.

Environment.prototype.addTouching = function(pilotInstance1, pilotInstance2)
{
   InputValidator.validateNotNull("pilotInstance1", pilotInstance1);
   InputValidator.validateNotNull("pilotInstance2", pilotInstance2);

   const store = this.store();
   store.dispatch(EnvironmentAction.addTouching(pilotInstance1, pilotInstance2));
   const message = pilotInstance1.name() + " touching " + pilotInstance2.name();
   store.dispatch(Action.setUserMessage(message));
   LOGGER.info(message);
};

Environment.prototype.discardAllDamage = function(damages)
{
   InputValidator.validateNotNull("damages", damages);

   damages.forEach(function(damage)
   {
      this.discardDamage(damage);
   }, this);
};

Environment.prototype.discardDamage = function(damage)
{
   InputValidator.validateNotNull("damage", damage);

   const store = this.store();
   store.dispatch(EnvironmentAction.discardDamage(damage));
};

Environment.prototype.drawDamage = function()
{
   let answer;
   const store = this.store();

   if (store.getState().damageDeck.size === 0)
   {
      // Replenish the damage deck from the discard pile.
      LOGGER.debug("Damage deck empty. Shuffling " + store.getState().damageDiscardPile.size + " discards into damage deck.");
      store.dispatch(EnvironmentAction.replenishDamageDeck());
   }

   LOGGER.trace("damageDeck.size = " + store.getState().damageDeck.size);
   answer = CardInstance.get(store, store.getState().damageDeck.get(0));
   store.dispatch(EnvironmentAction.drawDamage(answer));

   return answer;
};

Environment.prototype.incrementRound = function()
{
   const store = this.store();
   store.dispatch(EnvironmentAction.addRound());
};

Environment.prototype.moveToken = function(fromPosition, toPosition)
{
   InputValidator.validateNotNull("fromPosition", fromPosition);
   InputValidator.validateNotNull("toPosition", toPosition);

   const store = this.store();
   store.dispatch(EnvironmentAction.moveToken(fromPosition, toPosition));
};

Environment.prototype.removeToken = function(token)
{
   InputValidator.validateNotNull("token", token);

   const store = this.store();
   store.dispatch(EnvironmentAction.removeToken(token));
   store.dispatch(AgentAction.removePilot(token.agent(), token));
};

Environment.prototype.removeTouching = function(pilotInstance)
{
   InputValidator.validateNotNull("pilotInstance", pilotInstance);

   const store = this.store();
   store.dispatch(EnvironmentAction.removeTouching(pilotInstance));
};

Environment.prototype.setActiveToken = function(newActiveToken)
{
   const store = this.store();
   store.dispatch(EnvironmentAction.setActiveToken(newActiveToken));
};

Environment.prototype.setPlayAreaScale = function(scale)
{
   InputValidator.validateNotNull("scale", scale);

   const store = this.store();
   store.dispatch(EnvironmentAction.setPlayAreaScale(scale));
};

Environment.prototype._placeInitialTokens = function(agent1, squad1, agent2, squad2, positions1, positions2)
{
   InputValidator.validateNotNull("agent1", agent1);
   InputValidator.validateNotNull("squad1", squad1);
   InputValidator.validateNotNull("agent2", agent2);
   InputValidator.validateNotNull("squad2", squad2);
   // positions1 optional.
   // positions2 optional.

   const store = this.store();
   const firstAgent = agent1.newInstance(store);
   const secondAgent = agent2.newInstance(store);
   store.dispatch(EnvironmentAction.setFirstAgent(firstAgent));
   store.dispatch(EnvironmentAction.setSecondAgent(secondAgent));

   const firstTokens = squad1.tokens().map(function(token)
   {
      return token.newInstance(store, firstAgent);
   });
   const secondTokens = squad2.tokens().map(function(token)
   {
      return token.newInstance(store, secondAgent);
   });

   const firstSquad = new Squad(squad1.factionKey(), squad1.name(), squad1.year(), squad1.description(), firstTokens);
   store.dispatch(EnvironmentAction.setFirstSquad(firstSquad));
   const secondSquad = new Squad(squad2.factionKey(), squad2.name(), squad2.year(), squad2.description(), secondTokens);
   store.dispatch(EnvironmentAction.setSecondSquad(secondSquad));

   // Determine the play format.
   const tokens = [];
   ArrayUtilities.addAll(tokens, squad1.tokens());
   ArrayUtilities.addAll(tokens, squad2.tokens());
   const playFormatKey = this._determinePlayFormat(tokens);
   store.dispatch(EnvironmentAction.setPlayFormat(playFormatKey));

   this._placeTokens(firstTokens, true, positions1);
   this._placeTokens(secondTokens, false, positions2);
};

Environment.prototype._placeToken = function(position, token)
{
   InputValidator.validateNotNull("position", position);
   InputValidator.validateNotNull("token", token);

   const store = this.store();
   store.dispatch(EnvironmentAction.placeToken(position, token));
};

Environment.prototype._placeTokens = function(tokens, isTop, positions)
{
   InputValidator.validateNotNull("tokens", tokens);
   InputValidator.validateNotNull("isTop", isTop);
   // positions optional.

   const size = tokens.length;
   const dx = this.playFormat().width / (size + 1);
   const heading = isTop ? 90 : -90;

   for (let i = 1; i <= tokens.length; i++)
   {
      let position;
      const token = tokens[i - 1];

      if (positions !== undefined)
      {
         position = positions[i - 1];
      }
      else
      {
         const shipBase = token.card().shipFaction.ship.shipBase;
         const x = i * dx;
         let y = (shipBase.width / 2);

         if (!isTop)
         {
            y = this.playFormat().height - y;
         }

         position = new Position(x, y, heading);
      }

      this._placeToken(position, token);
   }
};

//////////////////////////////////////////////////////////////////////////
// Utility methods.

Environment.prototype._createRangeData = function(range, defenders)
{
   InputValidator.validateNotNull("range", range);
   InputValidator.validateNotNull("defenders", defenders);
   InputValidator.validateNotEmpty("defenders", defenders);

   return (
   {
      range: range,
      defenders: defenders,
   });
};

Environment.prototype._createRangeToDefenders = function(attacker, attackerPosition, weapon)
{
   const answer = [];

   const rangeKeys = weapon.rangeKeys();

   rangeKeys.forEach(function(range)
   {
      LOGGER.trace("Environment.createRangeToDefenders() range = " + range);
      const defenders = this.getTargetableDefendersAtRange(attacker, attackerPosition, weapon, range);
      LOGGER.trace("Environment.createRangeToDefenders() defenders.length = " + defenders.length);

      if (defenders.length > 0)
      {
         answer.push(this._createRangeData(range, defenders));
      }
   }, this);

   return answer;
};

Environment.prototype._createWeaponData = function(weapon, rangeToDefenders)
{
   InputValidator.validateNotNull("weapon", weapon);
   InputValidator.validateNotNull("rangeToDefenders", rangeToDefenders);

   return (
   {
      weapon: weapon,
      rangeToDefenders: rangeToDefenders,
   });
};

Environment.prototype._determinePlayFormat = function(tokens)
{
   InputValidator.validateNotNull("tokens", tokens);

   let answer;

   if (tokens.length > 0)
   {
      answer = PlayFormat.STANDARD;

      for (let i = 0; i < tokens.length; i++)
      {
         const token = tokens[i];

         if (token.isHuge())
         {
            answer = PlayFormat.EPIC;
            break;
         }
      }
   }

   return answer;
};

Environment.prototype._isTargetable = function(attacker, attackerPosition, weapon, defender, defenderPosition)
{
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("attackerPosition", attackerPosition);
   InputValidator.validateNotNull("weapon", weapon);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateNotNull("defenderPosition", defenderPosition);

   return weapon.isDefenderTargetable(attacker, attackerPosition, defender, defenderPosition) && !attacker.isTouching(defender);
};

export default Environment;