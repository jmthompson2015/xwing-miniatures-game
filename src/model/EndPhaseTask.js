"use strict";

define(["utility/InputValidator", "artifact/Phase", "artifact/UpgradeCard", "model/Action", "model/CardAction", "model/QueueProcessor"],
   function(InputValidator, Phase, UpgradeCard, Action, CardAction, QueueProcessor)
   {
      function EndPhaseTask(store)
      {
         InputValidator.validateNotNull("store", store);

         this.store = function()
         {
            return store;
         };
      }

      EndPhaseTask.prototype.delay = function()
      {
         return 10;
      };

      EndPhaseTask.prototype.doIt = function(callback)
      {
         InputValidator.validateNotNull("callback", callback);

         LOGGER.trace("EndPhaseTask.doIt() start");

         var store = this.store();
         var environment = store.getState().environment;

         var queue = environment.getTokensForActivation();
         var elementFunction = this.cleanUpElementFunction.bind(this);
         var phaseCallback = this.roundEnd.bind(this);
         var finishFunction = function(finishCallback)
         {
            phaseCallback(finishCallback);
         };
         var delay = this.delay();

         var queueProcessor = new QueueProcessor(queue, callback, elementFunction, finishFunction, delay);
         queueProcessor.processQueue();

         LOGGER.trace("EndPhaseTask.doIt() end");
      };

      EndPhaseTask.prototype.cleanUpElementFunction = function(cardInstance, queueCallback)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateIsFunction("queueCallback", queueCallback);

         var store = this.store();

         store.dispatch(Action.enqueuePhase(Phase.END_CLEAN_UP, cardInstance));
         store.dispatch(CardAction.setEvadeCount(cardInstance));
         store.dispatch(CardAction.setReinforceCount(cardInstance));
         store.dispatch(CardAction.setTractorBeamCount(cardInstance));
         store.dispatch(CardAction.setWeaponsDisabledCount(cardInstance));

         if (!cardInstance.isUpgradedWith(UpgradeCard.MOLDY_CROW))
         {
            store.dispatch(CardAction.setFocusCount(cardInstance));
         }

         queueCallback();
      };

      EndPhaseTask.prototype.roundEnd = function(callback)
      {
         InputValidator.validateNotNull("callback", callback);

         LOGGER.trace("EndPhaseTask.roundEnd() start");

         var store = this.store();
         var environment = store.getState().environment;

         var queue = environment.getTokensForActivation();
         var elementFunction = this.roundEndElementFunction.bind(this);
         var phaseCallback = this.finishEndPhase.bind(this);
         var finishFunction = function(finishCallback)
         {
            phaseCallback(finishCallback);
         };
         var delay = this.delay();

         var queueProcessor = new QueueProcessor(queue, callback, elementFunction, finishFunction, delay);
         queueProcessor.processQueue();

         LOGGER.trace("EndPhaseTask.roundEnd() end");
      };

      EndPhaseTask.prototype.roundEndElementFunction = function(cardInstance, queueCallback)
      {
         InputValidator.validateNotNull("cardInstance", cardInstance);
         InputValidator.validateIsFunction("queueCallback", queueCallback);

         var store = this.store();

         store.dispatch(Action.enqueuePhase(Phase.END_ROUND_END, cardInstance));
         store.dispatch(Action.setTokenActivationAction(cardInstance.id()));
         store.dispatch(Action.setTokenAttackDice(cardInstance.id()));
         store.dispatch(Action.setTokenCombatAction(cardInstance));
         store.dispatch(Action.setTokenDamageDealer(cardInstance));
         store.dispatch(Action.setTokenDefenseDice(cardInstance.id()));
         store.dispatch(Action.setTokenDefenderHit(cardInstance, false));
         store.dispatch(Action.setTokenInFiringArc(cardInstance, false));
         store.dispatch(Action.setTokenManeuverAction(cardInstance.id()));
         store.dispatch(Action.setTokenRange(cardInstance));
         store.dispatch(CardAction.clearUsedAbilities(cardInstance));
         store.dispatch(CardAction.clearUsedPerRoundAbilities(cardInstance));

         queueCallback();
      };

      EndPhaseTask.prototype.finishEndPhase = function(callback)
      {
         InputValidator.validateNotNull("callback", callback);

         LOGGER.trace("EndPhaseTask.finishEndPhase() start");

         callback();

         LOGGER.trace("EndPhaseTask.finishEndPhase() end");
      };

      return EndPhaseTask;
   });
