import InputValidator from "../utility/InputValidator.js";

import Action from "./Action.js";
import TargetLock from "./TargetLock.js";

function ShipDestroyedAction(environment, token, fromPosition)
{
   InputValidator.validateNotNull("environment", environment);
   InputValidator.validateNotNull("token", token);
   // InputValidator.validateNotNull("fromPosition", fromPosition);

   this.environment = function()
   {
      return environment;
   };

   this.token = function()
   {
      return token;
   };

   this.fromPosition = function()
   {
      return fromPosition;
   };

   this.doIt = function()
   {
      LOGGER.trace("ShipDestroyedAction.doIt() start");

      const tokens = [];

      if (token.isParent())
      {
         tokens.push(token.tokenFore());
         tokens.push(token.tokenAft());
      }
      else
      {
         tokens.push(token);
      }

      tokens.forEach(function(token)
      {
         const store = environment.store();
         TargetLock.removeAllTargetLocks(store, token);

         // Return the damage cards.
         if (token.isParent())
         {
            environment.discardAllDamage(token.tokenFore().damages());
            environment.discardAllDamage(token.tokenFore().criticalDamages());
            environment.discardAllDamage(token.tokenAft().damages());
            environment.discardAllDamage(token.tokenAft().criticalDamages());
         }
         else
         {
            environment.discardAllDamage(token.damages());
            environment.discardAllDamage(token.criticalDamages());
         }

         if (token)
         {
            environment.removeTouching(token);
            environment.removeToken(token);
         }
         store.dispatch(Action.setUserMessage("Ship destroyed: " + token));
      });

      LOGGER.trace("ShipDestroyedAction.doIt() end");
   };
}

export default ShipDestroyedAction;