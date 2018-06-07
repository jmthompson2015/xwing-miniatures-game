import InputValidator from "../utility/InputValidator.js";

import DefenseDiceValue from "../artifact/DefenseDiceValue.js";

import DefenseDice from "./DefenseDice.js";

function MockDefenseDice(store, attackerId)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateIsNumber("attackerId", attackerId);

   const values = [DefenseDiceValue.BLANK, DefenseDiceValue.EVADE, DefenseDiceValue.FOCUS];
   const answer = new DefenseDice(store, attackerId, values);

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

export default MockDefenseDice;