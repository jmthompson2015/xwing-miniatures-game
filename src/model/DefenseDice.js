import InputValidator from "../utility/InputValidator.js";

import DefenseDiceValue from "../artifact/DefenseDiceValue.js";

import Action from "./Action.js";

function DefenseDice(store, attackerId, sizeOrValues)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateIsNumber("attackerId", attackerId);

   this.store = function()
   {
      return store;
   };

   this.attackerId = function()
   {
      return attackerId;
   };

   if (typeof sizeOrValues === "number")
   {
      const size = sizeOrValues;
      const newValues = [];

      for (let i = 0; i < size; i++)
      {
         newValues.push(DefenseDice.rollRandomValue());
      }

      this.save(newValues);
   }
   else if (Array.isArray(sizeOrValues))
   {
      this.save(sizeOrValues);
   }
}

//////////////////////////////////////////////////////////////////////////
// Accessor methods.

DefenseDice.prototype.blankCount = function()
{
   return this.valueCount(DefenseDiceValue.BLANK);
};

DefenseDice.prototype.evadeCount = function()
{
   return this.valueCount(DefenseDiceValue.EVADE);
};

DefenseDice.prototype.focusCount = function()
{
   return this.valueCount(DefenseDiceValue.FOCUS);
};

DefenseDice.prototype.size = function()
{
   return this.values().length;
};

DefenseDice.prototype.sortedValues = function()
{
   return this.values().sort(function(die0, die1)
   {
      const value0 = DefenseDiceValue.properties[die0].sortOrder;
      const value1 = DefenseDiceValue.properties[die1].sortOrder;

      return value0 - value1;
   });
};

DefenseDice.prototype.toString = function()
{
   const values = this.values();

   return "attackerId=" + this.attackerId() + ", size=" + values.length + ", values=" + values;
};

DefenseDice.prototype.value = function(index)
{
   InputValidator.validateIsNumber("index", index);

   const values = this.values();

   return values[index];
};

DefenseDice.prototype.valueCount = function(target)
{
   InputValidator.validateNotNull("target", target);

   return this.values().reduce(function(accumulator, currentValue)
   {
      return accumulator + (currentValue === target ? 1 : 0);
   }, 0);
};

DefenseDice.prototype.values = function()
{
   const store = this.store();
   const attackerId = this.attackerId();

   const answer = store.getState().cardDefenseDice.get(attackerId);

   return (answer !== undefined ? answer.toJS() : []);
};

//////////////////////////////////////////////////////////////////////////
// Mutator methods.

DefenseDice.prototype.addDie = function(value)
{
   // value optional.

   const myValue = (value !== undefined ? value : DefenseDice.rollRandomValue());
   const values = this.values();
   values.push(myValue);
   this.save(values);
};

DefenseDice.prototype.changeAllToValue = function(oldValue, newValue)
{
   const oldValues = this.values();
   const newValues = oldValues.slice();

   for (let i = 0; i < oldValues.length; i++)
   {
      if (oldValues[i] === oldValue)
      {
         newValues[i] = newValue;
      }
   }

   this.save(newValues);
};

DefenseDice.prototype.changeOneToValue = function(oldValue, newValue)
{
   const oldValues = this.values();
   const newValues = oldValues.slice();

   for (let i = 0; i < oldValues.length; i++)
   {
      if (oldValues[i] === oldValue)
      {
         newValues[i] = newValue;
         break;
      }
   }

   this.save(newValues);
};

DefenseDice.prototype.rerollAllFocus = function()
{
   const oldValues = this.values();
   const newValues = [];

   // Reroll all focus values.
   for (let i = 0; i < oldValues.size; i++)
   {
      const oldValue = oldValues.get(i);

      if (oldValue === DefenseDiceValue.FOCUS)
      {
         newValues.push(DefenseDice.rollRandomValue());
      }
      else
      {
         newValues.push(oldValue);
      }
   }

   this.save(newValues);
};

DefenseDice.prototype.rerollBlank = function(count)
{
   this.rerollType(DefenseDiceValue.BLANK, count);
};

DefenseDice.prototype.rerollBlankAndFocus = function(count)
{
   // count optional; default: 1

   const blankCount = this.blankCount();

   if (blankCount >= count)
   {
      this.rerollBlank(count);
   }
   else
   {
      // 0 <= blankCount < count
      if (blankCount > 0)
      {
         this.rerollBlank(count);
      }

      const myCount = count - blankCount;

      if (myCount > 0)
      {
         this.rerollFocus(myCount);
      }
   }
};

DefenseDice.prototype.rerollFocus = function(count)
{
   this.rerollType(DefenseDiceValue.FOCUS, count);
};

DefenseDice.prototype.rerollType = function(type, count)
{
   InputValidator.validateNotNull("type", type);
   // count optional; default: 1

   // Reroll type values.
   let myCount = (count === undefined ? 1 : count);

   const oldValues = this.values();
   const newValues = oldValues;

   for (let i = 0; i < oldValues.size; i++)
   {
      const oldValue = oldValues.get(i);

      if (oldValue === type)
      {
         newValues[i] = DefenseDice.rollRandomValue();
         myCount--;

         if (myCount === 0)
         {
            break;
         }
      }
   }

   this.save(newValues);
};

DefenseDice.prototype.save = function(newValues)
{
   const store = this.store();
   const attackerId = this.attackerId();
   const values = (Array.isArray(newValues) ? Immutable.List(newValues) : newValues);
   store.dispatch(Action.setTokenDefenseDice(attackerId, values));
};

DefenseDice.prototype.spendEvadeToken = function()
{
   const oldValues = this.values();
   const newValues = oldValues.slice();

   // Add an evade result.
   newValues.push(DefenseDiceValue.EVADE);
   this.save(newValues);
};

DefenseDice.prototype.spendFocusToken = function()
{
   // Change all focus results to evades.
   this.changeAllToValue(DefenseDiceValue.FOCUS, DefenseDiceValue.EVADE);
};

//////////////////////////////////////////////////////////////////////////
// Utility methods.

DefenseDice.get = function(store, attackerId)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateIsNumber("attackerId", attackerId);

   return new DefenseDice(store, attackerId);
};

DefenseDice.rollRandomValue = function()
{
   const min = 1;
   const max = 8;
   const roll = Math.floor(Math.random() * (max - min + 1)) + min;
   let value;

   // There are 2 focus, 3 evade, and 3 blank.
   switch (roll)
   {
      case 1:
      case 4:
         value = DefenseDiceValue.FOCUS;
         break;
      case 2:
      case 5:
      case 7:
         value = DefenseDiceValue.EVADE;
         break;
      case 3:
      case 6:
      case 8:
         value = DefenseDiceValue.BLANK;
         break;
      default:
         throw "Unsupported roll: " + roll;
   }

   return value;
};

export default DefenseDice;