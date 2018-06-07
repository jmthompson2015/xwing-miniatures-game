import InputValidator from "../utility/InputValidator.js";

import AttackDiceValue from "../artifact/AttackDiceValue.js";

import AttackDice from "./AttackDice.js";

function MockAttackDice(store, attackerId)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateIsNumber("attackerId", attackerId);

   const values = [AttackDiceValue.BLANK, AttackDiceValue.CRITICAL_HIT, AttackDiceValue.FOCUS, AttackDiceValue.HIT];
   const answer = new AttackDice(store, attackerId, values);

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

export default MockAttackDice;