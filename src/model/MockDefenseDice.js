"use strict";

define(["utility/InputValidator", "artifact/DefenseDiceValue", "model/DefenseDice"],
   function(InputValidator, DefenseDiceValue, DefenseDice)
   {
      function MockDefenseDice(store, attackerId)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsNumber("attackerId", attackerId);

         var values = [DefenseDiceValue.BLANK, DefenseDiceValue.EVADE, DefenseDiceValue.FOCUS];
         var answer = new DefenseDice(store, attackerId, values);

         answer.rerollAllFocus = function() {};

         answer.rerollBlank = function() {};

         answer.rerollBlankAndFocus = function() {};

         answer.rerollFocus = function() {};

         answer.rerollType = function() {};

         return answer;
      }

      MockDefenseDice.get = function(store, attackerId)
      {
         InputValidator.validateNotNull("store", store);
         InputValidator.validateIsNumber("attackerId", attackerId);

         return new MockDefenseDice(store, attackerId);
      };

      return MockDefenseDice;
   });
