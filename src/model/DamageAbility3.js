/*
 * Provides damage abilities for the Combat Phase.
 */
import InputValidator from "../utility/InputValidator.js";

import AttackDiceValue from "../artifact/AttackDiceValue.js";
import DamageCard from "../artifact/DamageCard.js";
import Phase from "../artifact/Phase.js";

import AttackDice from "./AttackDice.js";

const DamageAbility3 = {};

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
         token.sufferDamage(1, 0);
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
         token.sufferDamage(1, 0);
      }
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
function getActiveCardInstance(store)
{
   InputValidator.validateNotNull("store", store);

   const environment = store.getState().environment;

   return environment.activeCardInstance();
}

function isActiveCardInstance(store, token)
{
   const activeToken = getActiveCardInstance(store);

   return token.equals(activeToken);
}

DamageAbility3.toString = function()
{
   return "model/DamageAbility3";
};

if (Object.freeze)
{
   Object.freeze(DamageAbility3);
}

export default DamageAbility3;