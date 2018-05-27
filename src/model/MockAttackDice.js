"use strict";

define(["utility/InputValidator", "artifact/AttackDiceValue", "model/AttackDice"],
   function(InputValidator, AttackDiceValue, AttackDice)
   {
      function MockAttackDice(store, attackerId)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsNumber("attackerId", attackerId);

         var values = [AttackDiceValue.BLANK, AttackDiceValue.CRITICAL_HIT, AttackDiceValue.FOCUS, AttackDiceValue.HIT];
         var answer = new AttackDice(store, attackerId, values);

         answer.rerollAllBlank = function() {};

         answer.rerollAllFocus = function() {};

         answer.rerollBlank = function() {};

         answer.rerollBlankAndFocus = function() {};

         answer.rerollFocus = function() {};

         answer.rerollType = function() {};

         answer.spendTargetLock = function() {};

         return answer;
      }

      MockAttackDice.get = function(store, attackerId)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsNumber("attackerId", attackerId);

         return new MockAttackDice(store, attackerId);
      };

      return MockAttackDice;
   });
