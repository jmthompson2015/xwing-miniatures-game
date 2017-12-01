/*
 * Provides damage abilities for the Combat Phase.
 */
"use strict";

define(["common/js/InputValidator", "artifact/js/AttackDiceValue", "artifact/js/DamageCard", "artifact/js/Phase", "model/js/AttackDice"],
   function(InputValidator, AttackDiceValue, DamageCard, Phase, AttackDice)
   {
      var DamageAbility3 = {};

      ////////////////////////////////////////////////////////////////////////
      DamageAbility3[Phase.COMBAT_START] = {};

      DamageAbility3[Phase.COMBAT_START][DamageCard.CONSOLE_FIRE] = {
         // At the start of each Combat phase, roll 1 attack die. On a Hit result, suffer 1 damage.
         condition: function(store, token)
         {
            return isActiveCardInstance(store, token);
         },
         consequent: function(store, token, callback)
         {
            if (AttackDice.rollRandomValue() === AttackDiceValue.HIT)
            {
               var environment = store.getState().environment;
               token.receiveDamage(environment.drawDamage());
            }
            callback();
         },
      };

      DamageAbility3[Phase.COMBAT_START][DamageCard.CONSOLE_FIRE_V2] = {
         // At the start of each Combat phase, roll 1 attack die. On a Hit result, suffer 1 damage.
         condition: function(store, token)
         {
            return isActiveCardInstance(store, token);
         },
         consequent: function(store, token, callback)
         {
            if (AttackDice.rollRandomValue() === AttackDiceValue.HIT)
            {
               var environment = store.getState().environment;
               token.receiveDamage(environment.drawDamage());
            }
            callback();
         },
      };

      ////////////////////////////////////////////////////////////////////////
      function getActiveCardInstance(store)
      {
         InputValidator.validateNotNull("store", store);

         var environment = store.getState().environment;

         return environment.activeCardInstance();
      }

      function isActiveCardInstance(store, token)
      {
         var activeToken = getActiveCardInstance(store);

         return token.equals(activeToken);
      }

      DamageAbility3.toString = function()
      {
         return "model/js/DamageAbility3";
      };

      if (Object.freeze)
      {
         Object.freeze(DamageAbility3);
      }

      return DamageAbility3;
   });
