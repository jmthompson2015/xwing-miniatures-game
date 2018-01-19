"use strict";

define(["common/js/InputValidator", "model/js/Action", "model/js/TargetLock"],
   function(InputValidator, Action, TargetLock)
   {
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

            var tokens = [];

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
               var store = environment.store();
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
                  environment.removeToken(token);
               }
               store.dispatch(Action.setUserMessage("Ship destroyed: " + token));
            });

            LOGGER.trace("ShipDestroyedAction.doIt() end");
         };
      }

      return ShipDestroyedAction;
   });
