"use strict";

define(["common/js/InputValidator", "artifact/js/Phase",
  "model/js/Action", "model/js/ActivationPhaseTask", "model/js/CombatPhaseTask", "model/js/EndPhaseTask", "model/js/PlanningPhaseTask"],
   function(InputValidator, Phase, Action, ActivationPhaseTask, CombatPhaseTask, EndPhaseTask, PlanningPhaseTask)
   {
      function Engine(store, callback)
      {
         InputValidator.validateNotNull("store", store);
         // callback optional.

         this.store = function()
         {
            return store;
         };

         this.callback = function()
         {
            return callback;
         };
      }

      //////////////////////////////////////////////////////////////////////////
      // Accessor methods.

      Engine.prototype.adjudicator = function()
      {
         var store = this.store();

         return store.getState().adjudicator;
      };

      Engine.prototype.delay = function()
      {
         var store = this.store();

         return store.getState().delay;
      };

      Engine.prototype.environment = function()
      {
         var store = this.store();

         return store.getState().environment;
      };

      //////////////////////////////////////////////////////////////////////////
      // Behavior methods.

      Engine.prototype.performPlanningPhase = function(callback)
      {
         if (this.isGameOver())
         {
            this.processGameOver();
         }
         else
         {
            var store = this.store();
            var finishPlanningPhase = this.finishPlanningPhase.bind(this);
            var startOrEndPhaseCallback = function()
            {
               var planningTask = new PlanningPhaseTask(store);
               var phaseCallback = function()
               {
                  finishPlanningPhase(callback);
               };
               planningTask.doIt(phaseCallback);
            };

            this.startOrEndPhase(Phase.PLANNING_START, startOrEndPhaseCallback);
         }
      };

      Engine.prototype.finishPlanningPhase = function(callback)
      {
         if (callback === undefined)
         {
            callback = this.performActivationPhase.bind(this);
         }

         this.startOrEndPhase(Phase.PLANNING_END, callback);
      };

      Engine.prototype.performActivationPhase = function(callback)
      {
         if (this.isGameOver())
         {
            this.processGameOver();
         }
         else
         {
            var store = this.store();
            var finishActivationPhase = this.finishActivationPhase.bind(this);
            var startOrEndPhaseCallback = function()
            {
               var activationTask = new ActivationPhaseTask(store);
               var phaseCallback = function()
               {
                  finishActivationPhase(callback);
               };
               activationTask.doIt(phaseCallback);
            };

            this.startOrEndPhase(Phase.ACTIVATION_START, startOrEndPhaseCallback);
         }
      };

      Engine.prototype.finishActivationPhase = function(callback)
      {
         if (callback === undefined)
         {
            callback = this.performCombatPhase.bind(this);
         }

         this.startOrEndPhase(Phase.ACTIVATION_END, callback);
      };

      Engine.prototype.performCombatPhase = function(callback)
      {
         if (this.isGameOver())
         {
            this.processGameOver();
         }
         else
         {
            var store = this.store();
            var finishCombatPhase = this.finishCombatPhase.bind(this);
            var startOrEndPhaseCallback = function()
            {
               var combatTask = new CombatPhaseTask(store);
               var phaseCallback = function()
               {
                  finishCombatPhase(callback);
               };
               combatTask.doIt(phaseCallback);
            };

            this.startOrEndPhase(Phase.COMBAT_START, startOrEndPhaseCallback);
         }
      };

      Engine.prototype.finishCombatPhase = function(callback)
      {
         if (callback === undefined)
         {
            callback = this.performEndPhase.bind(this);
         }

         this.startOrEndPhase(Phase.COMBAT_END, callback);
      };

      Engine.prototype.performEndPhase = function(callback)
      {
         if (this.isGameOver())
         {
            this.processGameOver();
         }
         else
         {
            var store = this.store();
            var finishEndPhase = this.finishEndPhase.bind(this);
            var startOrEndPhaseCallback = function()
            {
               var endTask = new EndPhaseTask(store);
               var phaseCallback = function()
               {
                  finishEndPhase(callback);
               };
               endTask.doIt(phaseCallback);
            };

            this.startOrEndPhase(Phase.END_START, startOrEndPhaseCallback);
         }
      };

      Engine.prototype.finishEndPhase = function(callback)
      {
         if (callback === undefined)
         {
            callback = this.performPlanningPhase.bind(this);
         }

         this.startOrEndPhase(Phase.END_END, callback);
      };

      //////////////////////////////////////////////////////////////////////////
      // Utility methods.

      Engine.prototype.startOrEndPhase = function(phaseKey, phaseCallback)
      {
         InputValidator.validateNotNull("phaseKey", phaseKey);
         InputValidator.validateNotNull("phaseCallback", phaseCallback);

         LOGGER.trace("Engine.startOrEndPhase() phaseKey = " + phaseKey);

         var environment = this.environment();
         var tokens = environment.pilotInstances();
         var tokenCount = tokens.length;
         var delay = this.delay();
         var count = 0;
         var callback = function()
         {
            count++;
            if (count === tokenCount)
            {
               setTimeout(function()
               {
                  phaseCallback();
               }, delay);
            }
         };
         var store = this.store();

         tokens.forEach(function(token)
         {
            store.dispatch(Action.enqueuePhase(phaseKey, token, callback));
         });
      };

      Engine.prototype.isGameOver = function()
      {
         return this.adjudicator().isGameOver();
      };

      Engine.prototype.processGameOver = function()
      {
         LOGGER.info("Game over.");

         var environment = this.environment();
         var adjudicator = this.adjudicator();
         var winner = adjudicator.determineWinner(environment);
         var store = this.store();
         store.dispatch(Action.setGameOver(winner));

         var message = (winner === undefined ? "Game is a draw." : winner.name() + " won! ");
         store.dispatch(Action.setUserMessage(message));

         var callback = this.callback();

         if (callback)
         {
            callback();
         }
      };

      return Engine;
   });
