"use strict";

define(["common/js/InputValidator"], function(InputValidator)
{
   var Selector = {};

   Selector.adjudicator = function(state)
   {
      return state.adjudicator;
   };

   Selector.combatAction = function(state, token)
   {
      InputValidator.validateNotNull("state", state);
      InputValidator.validateNotNull("token", token);

      return state.cardCombatAction.get(token.id());
   };

   Selector.damageDealer = function(state, attacker)
   {
      InputValidator.validateNotNull("state", state);
      InputValidator.validateNotNull("attacker", attacker);

      return state.cardDamageDealer.get(attacker.id());
   };

   Selector.environment = function(state)
   {
      return state.environment;
   };

   Selector.isDefenderHit = function(state, token)
   {
      InputValidator.validateNotNull("state", state);
      InputValidator.validateNotNull("token", token);

      return state.cardIsDefenderHit.get(token.id());
   };

   Selector.isInFiringArc = function(state, token)
   {
      InputValidator.validateNotNull("state", state);
      InputValidator.validateNotNull("token", token);

      return state.cardIsInFiringArc.get(token.id());
   };

   Selector.maneuver = function(state, token)
   {
      InputValidator.validateNotNull("state", state);
      InputValidator.validateNotNull("token", token);

      return state.cardManeuver.get(token.id());
   };

   Selector.rangeKey = function(state, attacker)
   {
      InputValidator.validateNotNull("state", state);
      InputValidator.validateNotNull("attacker", attacker);

      return state.cardRange.get(attacker.id());
   };

   if (Object.freeze)
   {
      Object.freeze(Selector);
   }

   return Selector;
});
