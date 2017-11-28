"use strict";

define(["common/js/InputValidator", "artifact/js/PilotCard", "model/js/CardInstance", "model/js/DualCardInstance"],
   function(InputValidator, PilotCard, CardInstance, DualCardInstance)
   {
      var CardInstanceFactory = {
         create: function(store, pilotKey, agent, upgradeKeysFore, upgradeKeysAft)
         {
            InputValidator.validateNotNull("store", store);
            InputValidator.validateNotNull("pilotKey", pilotKey);
            InputValidator.validateNotNull("agent", agent);
            // upgradeKeysForeIn optional.
            // upgradeKeysAftIn optional.

            var pilot = PilotCard.properties[pilotKey];

            var answer;

            if (pilot.fore || pilot.aft)
            {
               answer = new DualCardInstance(store, pilotKey, agent, upgradeKeysFore, upgradeKeysAft);
            }
            else
            {
               answer = new CardInstance(store, pilotKey, agent, upgradeKeysFore);
            }

            return answer;
         },

         get: function(store, id)
         {
            InputValidator.validateNotNull("store", store);
            InputValidator.validateIsNumber("id", id);

            var answer;
            var tokenValues = store.getState().tokens.get(id);

            if (tokenValues)
            {
               var idFore = tokenValues.get("idFore");
               var idAft = tokenValues.get("idAft");

               if (idFore !== undefined || idAft !== undefined)
               {
                  answer = DualCardInstance.get(store, id);
               }
               else
               {
                  answer = CardInstance.get(store, id);
               }
            }

            return answer;
         },
      };

      return CardInstanceFactory;
   });
