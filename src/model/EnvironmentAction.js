"use strict";

define(["utility/InputValidator"], function(InputValidator)
{
   var EnvironmentAction = {};

   EnvironmentAction.ADD_ROUND = "addRound";
   EnvironmentAction.ADD_TOUCHING = "addTouching";
   EnvironmentAction.DISCARD_DAMAGE = "discardDamage";
   EnvironmentAction.DRAW_DAMAGE = "drawDamage";
   EnvironmentAction.MOVE_TOKEN = "moveToken";
   EnvironmentAction.PLACE_TOKEN = "placeToken";
   EnvironmentAction.REMOVE_TOKEN = "removeToken";
   EnvironmentAction.REMOVE_TOKEN_AT = "removeTokenAt";
   EnvironmentAction.REMOVE_TOUCHING = "removeTouching";
   EnvironmentAction.REPLENISH_DAMAGE_DECK = "replenishDamageDeck";
   EnvironmentAction.SET_ACTIVE_TOKEN = "setActiveToken";
   EnvironmentAction.SET_DAMAGE_DECK = "setDamageDeck";
   EnvironmentAction.SET_FIRST_AGENT = "setFirstAgent";
   EnvironmentAction.SET_FIRST_SQUAD = "setFirstSquad";
   EnvironmentAction.SET_PLAY_AREA_SCALE = "setPlayAreaScale";
   EnvironmentAction.SET_PLAY_FORMAT = "setPlayFormat";
   EnvironmentAction.SET_SECOND_AGENT = "setSecondAgent";
   EnvironmentAction.SET_SECOND_SQUAD = "setSecondSquad";

   EnvironmentAction.addRound = function(value)
   {
      var myValue = (value !== undefined ? value : 1);

      return (
      {
         type: EnvironmentAction.ADD_ROUND,
         key: myValue,
      });
   };

   EnvironmentAction.addTouching = function(pilotInstance1, pilotInstance2)
   {
      InputValidator.validateNotNull("pilotInstance1", pilotInstance1);
      InputValidator.validateNotNull("pilotInstance2", pilotInstance2);

      return (
      {
         type: EnvironmentAction.ADD_TOUCHING,
         pilotInstance1: pilotInstance1,
         pilotInstance2: pilotInstance2,
      });
   };

   EnvironmentAction.discardDamage = function(damageInstance)
   {
      InputValidator.validateNotNull("damageInstance", damageInstance);
      InputValidator.validateIsFunction("damageInstance.id", damageInstance.id);

      return (
      {
         type: EnvironmentAction.DISCARD_DAMAGE,
         damageInstance: damageInstance,
      });
   };

   EnvironmentAction.drawDamage = function(damageInstance)
   {
      InputValidator.validateNotNull("damageInstance", damageInstance);
      InputValidator.validateIsFunction("damageInstance.id", damageInstance.id);

      return (
      {
         type: EnvironmentAction.DRAW_DAMAGE,
         damageInstance: damageInstance,
      });
   };

   EnvironmentAction.moveToken = function(fromPosition, toPosition)
   {
      InputValidator.validateNotNull("fromPosition", fromPosition);
      InputValidator.validateNotNull("toPosition", toPosition);

      return (
      {
         type: EnvironmentAction.MOVE_TOKEN,
         fromPosition: fromPosition,
         toPosition: toPosition,
      });
   };

   EnvironmentAction.placeToken = function(position, token)
   {
      InputValidator.validateNotNull("position", position);
      InputValidator.validateNotNull("token", token);
      InputValidator.validateIsFunction("token.id", token.id);

      return (
      {
         type: EnvironmentAction.PLACE_TOKEN,
         position: position,
         token: token,
      });
   };

   EnvironmentAction.removeToken = function(token)
   {
      InputValidator.validateNotNull("token", token);

      return (
      {
         type: EnvironmentAction.REMOVE_TOKEN,
         token: token,
      });
   };

   EnvironmentAction.removeTokenAt = function(position)
   {
      InputValidator.validateNotNull("position", position);

      return (
      {
         type: EnvironmentAction.REMOVE_TOKEN_AT,
         position: position,
      });
   };

   EnvironmentAction.removeTouching = function(pilotInstance)
   {
      InputValidator.validateNotNull("pilotInstance", pilotInstance);

      return (
      {
         type: EnvironmentAction.REMOVE_TOUCHING,
         pilotInstance: pilotInstance,
      });
   };

   EnvironmentAction.replenishDamageDeck = function()
   {
      return (
      {
         type: EnvironmentAction.REPLENISH_DAMAGE_DECK,
      });
   };

   EnvironmentAction.setActiveToken = function(token)
   {
      return (
      {
         type: EnvironmentAction.SET_ACTIVE_TOKEN,
         token: token,
      });
   };

   EnvironmentAction.setDamageDeck = function(damageDeck)
   {
      InputValidator.validateIsArray("damageDeck", damageDeck);

      return (
      {
         type: EnvironmentAction.SET_DAMAGE_DECK,
         damageDeck: damageDeck,
      });
   };

   EnvironmentAction.setFirstAgent = function(agent)
   {
      InputValidator.validateNotNull("agent", agent);

      return (
      {
         type: EnvironmentAction.SET_FIRST_AGENT,
         agent: agent,
      });
   };

   EnvironmentAction.setFirstSquad = function(squad)
   {
      InputValidator.validateNotNull("squad", squad);

      return (
      {
         type: EnvironmentAction.SET_FIRST_SQUAD,
         squad: squad,
      });
   };

   EnvironmentAction.setPlayAreaScale = function(scale)
   {
      InputValidator.validateNotNull("scale", scale);

      return (
      {
         type: EnvironmentAction.SET_PLAY_AREA_SCALE,
         scale: scale,
      });
   };

   EnvironmentAction.setPlayFormat = function(playFormatKey)
   {
      InputValidator.validateNotNull("playFormatKey", playFormatKey);

      return (
      {
         type: EnvironmentAction.SET_PLAY_FORMAT,
         playFormatKey: playFormatKey,
      });
   };

   EnvironmentAction.setSecondAgent = function(agent)
   {
      InputValidator.validateNotNull("agent", agent);

      return (
      {
         type: EnvironmentAction.SET_SECOND_AGENT,
         agent: agent,
      });
   };

   EnvironmentAction.setSecondSquad = function(squad)
   {
      InputValidator.validateNotNull("squad", squad);

      return (
      {
         type: EnvironmentAction.SET_SECOND_SQUAD,
         squad: squad,
      });
   };

   if (Object.freeze)
   {
      Object.freeze(EnvironmentAction);
   }

   return EnvironmentAction;
});
