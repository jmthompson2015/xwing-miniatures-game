import InputValidator from "../utility/InputValidator.js";

import Event from "../artifact/Event.js";
import ShipAction from "../artifact/ShipAction.js";

import Action from "./Action.js";

function TargetLock(id, attacker, defender)
{
   InputValidator.validateNotNull("id", id);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);

   this.id = function()
   {
      return id;
   };

   this.attacker = function()
   {
      return attacker;
   };

   this.defender = function()
   {
      return defender;
   };
}

//////////////////////////////////////////////////////////////////////////
// Accessor methods.

TargetLock.prototype.store = function()
{
   const attacker = this.attacker();

   return attacker.store();
};

TargetLock.prototype.values = function()
{
   const store = this.store();
   const attackerId = this.attacker().id();
   const defenderId = this.defender().id();

   const targetLocks = store.getState().targetLocks;

   for (let i = 0; i < targetLocks.size; i++)
   {
      const values = targetLocks.get(i);

      if (values.get("attackerId") === attackerId && values.get("defenderId") === defenderId)
      {
         return values;
      }
   }
};

//////////////////////////////////////////////////////////////////////////
// Mutator methods.

TargetLock.prototype.delete = function()
{
   const store = this.store();
   const values = this.values();

   store.dispatch(Action.removeTargetLock(values));
};

//////////////////////////////////////////////////////////////////////////
// Utility methods.

TargetLock.newInstance = function(store, attacker, defender, eventCallback)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);
   // eventCallback optional.

   // Initialize ID.
   const newId = TargetLock.nextId(store);

   const answer = new TargetLock(newId, attacker, defender);

   const values = Immutable.Map(
   {
      attackerId: attacker.id(),
      defenderId: defender.id(),
      id: newId,
   });

   store.dispatch(Action.addTargetLock(values));

   const eventContext = {
      defenderId: defender.id(),
      id: newId,
      shipActionKey: ShipAction.TARGET_LOCK,
   };

   store.dispatch(Action.enqueueEvent(Event.TARGET_LOCK_ACQUIRED, attacker, eventCallback, eventContext));

   return answer;
};

TargetLock.get = function(store, attacker, defender)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);

   const tlValues = store.getState().targetLocks;
   const attackerId = attacker.id();
   const defenderId = defender.id();

   return tlValues.toArray().filter(function(values)
   {
      return values.get("attackerId") === attackerId && values.get("defenderId") === defenderId;
   }).map(function(values)
   {
      const id = values.get("id");
      return new TargetLock(id, attacker, defender);
   });
};

TargetLock.getByAttacker = function(store, attacker)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("attacker", attacker);

   const tlValues = store.getState().targetLocks;
   const attackerId = attacker.id();

   return tlValues.toArray().filter(function(values)
   {
      return values.get("attackerId") === attackerId;
   }).map(function(values)
   {
      const id = values.get("id");
      const defenderId = values.get("defenderId");
      const defender = store.getState().environment.getTokenById(defenderId);
      return new TargetLock(id, attacker, defender);
   });
};

TargetLock.getByDefender = function(store, defender)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("defender", defender);

   const tlValues = store.getState().targetLocks;
   const defenderId = defender.id();

   return tlValues.toArray().filter(function(values)
   {
      return values.get("defenderId") === defenderId;
   }).map(function(values)
   {
      const id = values.get("id");
      const attackerId = values.get("attackerId");
      const attacker = store.getState().environment.getTokenById(attackerId);
      return new TargetLock(id, attacker, defender);
   });
};

TargetLock.getFirst = function(store, attacker, defender)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateNotNull("defender", defender);

   let answer = TargetLock.get(store, attacker, defender);

   if (answer.length === 0)
   {
      answer = undefined;
   }
   else
   {
      answer = answer[0];
   }

   return answer;
};

TargetLock.nextId = function(store)
{
   InputValidator.validateNotNull("store", store);

   const isDoubling = (store.getState().nextTargetLockId > 25);
   const offset = store.getState().nextTargetLockId - (isDoubling ? 26 : 0);
   const letter = String.fromCharCode(65 + offset);
   const answer = (isDoubling ? letter + letter : letter);
   store.dispatch(Action.incrementNextTargetLockId());

   return answer;
};

TargetLock.removeAllTargetLocks = function(store, token)
{
   InputValidator.validateNotNull("store", store);
   InputValidator.validateNotNull("token", token);

   const tlValues = store.getState().targetLocks.filter(function(targetLock)
   {
      return targetLock.get("attackerId") === token.id() || targetLock.get("defenderId") === token.id();
   });

   for (let i = 0; i < tlValues.size; i++)
   {
      const values = tlValues.get(i);
      store.dispatch(Action.removeTargetLock(values));
   }
};

export default TargetLock;