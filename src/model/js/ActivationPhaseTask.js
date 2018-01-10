"use strict";

define(["common/js/InputValidator", "artifact/js/Maneuver", "artifact/js/Phase", "artifact/js/UpgradeCard",
  "model/js/Action", "model/js/ActivationAction", "model/js/CardAction", "model/js/QueueProcessor"],
   function(InputValidator, Maneuver, Phase, UpgradeCard, Action, ActivationAction, CardAction, QueueProcessor)
   {
      function ActivationPhaseTask(store)
      {
         InputValidator.validateNotNull("store", store);

         this.store = function()
         {
            return store;
         };
      }

      ActivationPhaseTask.prototype.delay = function()
      {
         return 10;
      };

      ActivationPhaseTask.prototype.doIt = function(callback)
      {
         InputValidator.validateNotNull("callback", callback);

         LOGGER.trace("ActivationPhaseTask.doIt() start");

         var store = this.store();
         var environment = store.getState().environment;

         var queue = environment.getTokensForActivation(true);
         var elementFunction = this.decloakElementFunction.bind(this);
         var phaseCallback = this.activationAction.bind(this);
         var finishFunction = function(finishCallback)
         {
            phaseCallback(finishCallback);
         };
         var delay = this.delay();

         var queueProcessor = new QueueProcessor(queue, callback, elementFunction, finishFunction, delay);
         queueProcessor.processQueue();

         LOGGER.trace("ActivationPhaseTask.doIt() end");
      };

      ActivationPhaseTask.prototype.decloakElementFunction = function(cardInstance, queueCallback)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateIsFunction("queueCallback", queueCallback);

         var store = this.store();

         if (cardInstance.isCloaked && cardInstance.isCloaked())
         {
            LOGGER.debug("checking decloak for " + cardInstance);
            var agent = cardInstance.agent();
            var agentCallback = function(token, decloakAbility)
            {
               LOGGER.debug("token = " + token + " decloakAbility = " + decloakAbility);

               if (decloakAbility !== undefined)
               {
                  var consequent = decloakAbility.consequent();
                  consequent(store, token, queueCallback, decloakAbility.context());
                  LOGGER.debug("token.isCloaked() ? " + token.isCloaked());
                  LOGGER.debug("token.cloakCount() = " + token.cloakCount());
               }
               else
               {
                  queueCallback();
               }
            };
            agent.getDecloakAction(cardInstance, agentCallback);

            // Wait for agent to respond.
         }
         else
         {
            queueCallback();
         }
      };

      ActivationPhaseTask.prototype.activationAction = function(callback)
      {
         InputValidator.validateNotNull("callback", callback);

         LOGGER.trace("ActivationPhaseTask.activationAction() start");

         var store = this.store();
         var environment = store.getState().environment;

         var queue = environment.getTokensForActivation(true);
         var elementFunction = this.activationActionElementFunction.bind(this);
         var phaseCallback = this.finishActivationPhase.bind(this);
         var finishFunction = function(finishCallback)
         {
            phaseCallback(finishCallback);
         };
         var delay = this.delay();

         var queueProcessor = new QueueProcessor(queue, callback, elementFunction, finishFunction, delay);
         queueProcessor.processQueue();

         LOGGER.trace("ActivationPhaseTask.activationAction() end");
      };

      ActivationPhaseTask.prototype.activationActionElementFunction = function(cardInstance, queueCallback)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateIsFunction("queueCallback", queueCallback);

         var store = this.store();
         var environment = store.getState().environment;
         environment.setActiveToken(cardInstance);
         var myToken = cardInstance;

         if (cardInstance.parent && cardInstance.card().key.endsWith("fore"))
         {
            myToken = cardInstance.parent;
         }

         var maneuverKey = store.getState().pilotToManeuver.get("" + myToken.id());
         var activationAction = ActivationAction.create(store, cardInstance.id(), queueCallback);
         var maneuver = Maneuver.properties[maneuverKey];
         store.dispatch(Action.setTokenManeuver(cardInstance, maneuver));

         setTimeout(function()
         {
            activationAction.doIt();
         }, this.delay());
      };

      ActivationPhaseTask.prototype.finishActivationPhase = function(callback)
      {
         InputValidator.validateNotNull("callback", callback);

         LOGGER.trace("ActivationPhaseTask.finishActivationPhase() start");

         callback();

         LOGGER.trace("ActivationPhaseTask.finishActivationPhase() end");
      };

      return ActivationPhaseTask;
   });
