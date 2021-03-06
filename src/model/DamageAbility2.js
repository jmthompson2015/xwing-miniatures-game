/*
 * Provides damage abilities for the Activation Phase.
 */
import InputValidator from "../utility/InputValidator.js";

import AttackDiceValue from "../artifact/AttackDiceValue.js";
import DamageCard from "../artifact/DamageCard.js";
import Phase from "../artifact/Phase.js";

// import Action from "./Action.js";
import AttackDice from "./AttackDice.js";

const DamageAbility2 = {};

////////////////////////////////////////////////////////////////////////
DamageAbility2[Phase.ACTIVATION_REVEAL_DIAL] = {};

DamageAbility2[Phase.ACTIVATION_REVEAL_DIAL][DamageCard.SHAKEN_PILOT_V2] = {
   // During the Planning phase, you cannot be assigned straight maneuvers. When you reveal a maneuver, flip this card facedown.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isCriticallyDamagedWith(DamageCard.SHAKEN_PILOT_V2);
   },
   consequent: function(store, token, callback)
   {
      flipCardFacedown(store, token, DamageCard.SHAKEN_PILOT_V2);
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
DamageAbility2[Phase.ACTIVATION_PERFORM_ACTION] = {};

DamageAbility2[Phase.ACTIVATION_PERFORM_ACTION][DamageCard.CONSOLE_FIRE] = {
   // Action: Flip this card facedown.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isCriticallyDamagedWith(DamageCard.CONSOLE_FIRE);
   },
   consequent: function(store, token, callback)
   {
      flipCardFacedown(store, token, DamageCard.CONSOLE_FIRE);
      callback();
   },
};

DamageAbility2[Phase.ACTIVATION_PERFORM_ACTION][DamageCard.CONSOLE_FIRE_V2] = {
   // Action: Flip this card facedown.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isCriticallyDamagedWith(DamageCard.CONSOLE_FIRE_V2);
   },
   consequent: function(store, token, callback)
   {
      flipCardFacedown(store, token, DamageCard.CONSOLE_FIRE_V2);
      callback();
   },
};

DamageAbility2[Phase.ACTIVATION_PERFORM_ACTION][DamageCard.DAMAGED_SENSOR_ARRAY] = {
   // Action: Roll 1 attack die. On a Hit result, flip this card facedown.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isCriticallyDamagedWith(DamageCard.DAMAGED_SENSOR_ARRAY);
   },
   consequent: function(store, token, callback)
   {
      if (AttackDice.rollRandomValue() === AttackDiceValue.HIT)
      {
         flipCardFacedown(store, token, DamageCard.DAMAGED_SENSOR_ARRAY);
      }
      callback();
   },
};

DamageAbility2[Phase.ACTIVATION_PERFORM_ACTION][DamageCard.DAMAGED_SENSOR_ARRAY_V2] = {
   // Action: Roll 1 attack die. On a Hit or Critical Hit result, flip this card facedown.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isCriticallyDamagedWith(DamageCard.DAMAGED_SENSOR_ARRAY_V2);
   },
   consequent: function(store, token, callback)
   {
      const attackDie = AttackDice.rollRandomValue();
      if ([AttackDiceValue.HIT, AttackDiceValue.CRITICAL_HIT].includes(attackDie))
      {
         flipCardFacedown(store, token, DamageCard.DAMAGED_SENSOR_ARRAY_V2);
      }
      callback();
   },
};

DamageAbility2[Phase.ACTIVATION_PERFORM_ACTION][DamageCard.LOOSE_STABILIZER_V2] = {
   // Action: Flip this card facedown.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isCriticallyDamagedWith(DamageCard.LOOSE_STABILIZER_V2);
   },
   consequent: function(store, token, callback)
   {
      flipCardFacedown(store, token, DamageCard.LOOSE_STABILIZER_V2);
      callback();
   },
};

DamageAbility2[Phase.ACTIVATION_PERFORM_ACTION][DamageCard.MAJOR_HULL_BREACH_V2] = {
   // Action: Flip this card facedown.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isCriticallyDamagedWith(DamageCard.MAJOR_HULL_BREACH_V2);
   },
   consequent: function(store, token, callback)
   {
      flipCardFacedown(store, token, DamageCard.MAJOR_HULL_BREACH_V2);
      callback();
   },
};

DamageAbility2[Phase.ACTIVATION_PERFORM_ACTION][DamageCard.STRUCTURAL_DAMAGE] = {
   // Action: Roll 1 attack die. On a Hit result, flip this card facedown.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isCriticallyDamagedWith(DamageCard.STRUCTURAL_DAMAGE);
   },
   consequent: function(store, token, callback)
   {
      if (AttackDice.rollRandomValue() === AttackDiceValue.HIT)
      {
         flipCardFacedown(store, token, DamageCard.STRUCTURAL_DAMAGE);
      }
      callback();
   },
};

DamageAbility2[Phase.ACTIVATION_PERFORM_ACTION][DamageCard.STRUCTURAL_DAMAGE_V2] = {
   // Action: Roll 1 attack die. On a Hit or Critical Hit result, flip this card facedown.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isCriticallyDamagedWith(DamageCard.STRUCTURAL_DAMAGE_V2);
   },
   consequent: function(store, token, callback)
   {
      const attackDie = AttackDice.rollRandomValue();
      if ([AttackDiceValue.HIT, AttackDiceValue.CRITICAL_HIT].includes(attackDie))
      {
         flipCardFacedown(store, token, DamageCard.STRUCTURAL_DAMAGE_V2);
      }
      callback();
   },
};

DamageAbility2[Phase.ACTIVATION_PERFORM_ACTION][DamageCard.WEAPON_MALFUNCTION] = {
   // Action: Roll 1 attack die. On a Hit or Critical Hit result, flip this card facedown.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isCriticallyDamagedWith(DamageCard.WEAPON_MALFUNCTION);
   },
   consequent: function(store, token, callback)
   {
      const attackDie = AttackDice.rollRandomValue();
      if ([AttackDiceValue.HIT, AttackDiceValue.CRITICAL_HIT].includes(attackDie))
      {
         flipCardFacedown(store, token, DamageCard.WEAPON_MALFUNCTION);
      }
      callback();
   },
};

DamageAbility2[Phase.ACTIVATION_PERFORM_ACTION][DamageCard.WEAPONS_FAILURE_V2] = {
   // Action: Roll 1 attack die. On a Hit or Critical Hit result, flip this card facedown.
   condition: function(store, token)
   {
      return isActiveCardInstance(store, token) && token.isCriticallyDamagedWith(DamageCard.WEAPONS_FAILURE_V2);
   },
   consequent: function(store, token, callback)
   {
      const attackDie = AttackDice.rollRandomValue();
      if ([AttackDiceValue.HIT, AttackDiceValue.CRITICAL_HIT].includes(attackDie))
      {
         flipCardFacedown(store, token, DamageCard.WEAPONS_FAILURE_V2);
      }
      callback();
   },
};

////////////////////////////////////////////////////////////////////////
function flipCardFacedown(store, token, damageKey)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("token", token);
   InputValidator.validateNotNull("damageKey", damageKey);

   const damageInstance = token.criticalDamage(damageKey);
   token.flipDamageCardFacedown(damageInstance);
}

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

DamageAbility2.toString = function()
{
   return "model/DamageAbility2";
};

if (Object.freeze)
{
   Object.freeze(DamageAbility2);
}

export default DamageAbility2;