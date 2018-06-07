import InputValidator from "../utility/InputValidator.js";

import AttackDiceValue from "../artifact/AttackDiceValue.js";

import Action from "./Action.js";

function AttackDice(store, attackerId, sizeOrValues)
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
         newValues.push(AttackDice.rollRandomValue());
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

AttackDice.prototype.blankCount = function()
{
   return this.valueCount(AttackDiceValue.BLANK);
};

AttackDice.prototype.criticalHitCount = function()
{
   return this.valueCount(AttackDiceValue.CRITICAL_HIT);
};

AttackDice.prototype.focusCount = function()
{
   return this.valueCount(AttackDiceValue.FOCUS);
};

AttackDice.prototype.hitCount = function()
{
   return this.valueCount(AttackDiceValue.HIT);
};

AttackDice.prototype.size = function()
{
   return this.values().length;
};

AttackDice.prototype.sortedValues = function()
{
   return this.values().sort(function(die0, die1)
   {
      const value0 = AttackDiceValue.properties[die0].sortOrder;
      const value1 = AttackDiceValue.properties[die1].sortOrder;

      return value0 - value1;
   });
};

AttackDice.prototype.toString = function()
{
   const values = this.values();

   return "attackerId=" + this.attackerId() + ", size=" + values.length + ", values=" + values;
};

AttackDice.prototype.value = function(index)
{
   InputValidator.validateIsNumber("index", index);

   const values = this.values();

   return values[index];
};

AttackDice.prototype.valueCount = function(target)
{
   InputValidator.validateNotNull("target", target);

   return this.values().reduce(function(accumulator, currentValue)
   {
      return accumulator + (currentValue === target ? 1 : 0);
   }, 0);
};

AttackDice.prototype.values = function()
{
   const store = this.store();
   const attackerId = this.attackerId();
   const answer = store.getState().cardAttackDice.get(attackerId);

   return (answer !== undefined ? answer.toJS() : []);
};

//////////////////////////////////////////////////////////////////////////
// Mutator methods.

AttackDice.prototype.addDie = function(value)
{
   // value optional.

   const myValue = (value !== undefined ? value : AttackDice.rollRandomValue());
   const values = this.values();
   values.push(myValue);
   this.save(values);
};

AttackDice.prototype.changeAllToValue = function(oldValue, newValue)
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

AttackDice.prototype.changeOneToValue = function(oldValue, newValue)
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

AttackDice.prototype.rerollAllBlank = function()
{
   const oldValues = this.values();
   const newValues = [];

   // Reroll all blank values.
   for (let i = 0; i < oldValues.size; i++)
   {
      const oldValue = oldValues.get(i);

      if (oldValue === AttackDiceValue.BLANK)
      {
         newValues.push(AttackDice.rollRandomValue());
      }
      else
      {
         newValues.push(oldValue);
      }
   }

   this.save(newValues);
};

AttackDice.prototype.rerollAllFocus = function()
{
   const oldValues = this.values();
   const newValues = [];

   // Reroll all focus values.
   for (let i = 0; i < oldValues.size; i++)
   {
      const oldValue = oldValues.get(i);

      if (oldValue === AttackDiceValue.FOCUS)
      {
         newValues.push(AttackDice.rollRandomValue());
      }
      else
      {
         newValues.push(oldValue);
      }
   }

   this.save(newValues);
};

AttackDice.prototype.rerollBlank = function(count)
{
   // count optional; default: 1

   this.rerollType(AttackDiceValue.BLANK, count);
};

AttackDice.prototype.rerollBlankAndFocus = function(count)
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

AttackDice.prototype.rerollFocus = function(count)
{
   // count optional; default: 1

   this.rerollType(AttackDiceValue.FOCUS, count);
};

AttackDice.prototype.rerollType = function(type, count)
{
   InputValidator.validateNotNull("type", type);
   // count optional; default: 1

   // Reroll type values.
   let myCount = (count === undefined ? 1 : count);

   const oldValues = this.values();
   let newValues = oldValues;

   for (let i = 0; i < oldValues.size; i++)
   {
      const oldValue = oldValues.get(i);

      if (oldValue === type)
      {
         newValues = newValues.set(i, AttackDice.rollRandomValue());
         myCount--;

         if (myCount === 0)
         {
            break;
         }
      }
   }

   this.save(newValues);
};

AttackDice.prototype.save = function(newValues)
{
   const store = this.store();
   const attackerId = this.attackerId();
   const values = (Array.isArray(newValues) ? Immutable.List(newValues) : newValues);
   store.dispatch(Action.setTokenAttackDice(attackerId, values));
};

AttackDice.prototype.spendFocusToken = function()
{
   // Change all focus results to hits.
   this.changeAllToValue(AttackDiceValue.FOCUS, AttackDiceValue.HIT);
};

AttackDice.prototype.spendTargetLock = function()
{
   // Reroll any blank or focus values.
   const oldValues = this.values();
   const newValues = oldValues.slice();

   oldValues.forEach(function(oldValue, i)
   {
      if ([AttackDiceValue.BLANK, AttackDiceValue.FOCUS].includes(oldValue))
      {
         newValues[i] = AttackDice.rollRandomValue();
      }
   });

   this.save(newValues);
};

//////////////////////////////////////////////////////////////////////////
// Utility methods.

AttackDice.get = function(store, attackerId)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateIsNumber("attackerId", attackerId);

   return new AttackDice(store, attackerId);
};

AttackDice.rollRandomValue = function()
{
   const min = 1;
   const max = 8;
   const roll = Math.floor(Math.random() * (max - min + 1)) + min;
   let value;

   // There are 2 focus, 3 hit, 1 critical hit, and 2 blank.
   switch (roll)
   {
      case 1:
      case 5:
         value = AttackDiceValue.FOCUS;
         break;
      case 2:
      case 6:
      case 8:
         value = AttackDiceValue.HIT;
         break;
      case 3:
         value = AttackDiceValue.CRITICAL_HIT;
         break;
      case 4:
      case 7:
         value = AttackDiceValue.BLANK;
         break;
      default:
         throw "Unsupported roll: " + roll;
   }

   return value;
};

if (Object.freeze)
{
   Object.freeze(AttackDiceValue);
}

export default AttackDice;