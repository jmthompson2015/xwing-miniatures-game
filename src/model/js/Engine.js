"use strict";

define(["common/js/InputValidator", "artifact/js/Maneuver", "artifact/js/Phase",
  "model/js/Action", "model/js/ActivationPhaseTask", "model/js/CombatAction", "model/js/EndPhaseTask", "model/js/PlanningPhaseTask"],
   function(InputValidator, Maneuver, Phase, Action, ActivationPhaseTask, CombatAction, EndPhaseTask, PlanningPhaseTask)
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

         var combatQueue = [];
         var combatPhaseCallback = this.performEndPhase.bind(this);

         //////////////////////////////////////////////////////////////////////////
         // Mutator methods.

         this.combatPhaseCallback = function(callback)
         {
            if (callback !== undefined)
            {
               combatPhaseCallback = callback;
            }

            return combatPhaseCallback;
         };

         this.combatQueue = function(queue)
         {
            if (queue !== undefined)
            {
               combatQueue = queue;
            }

            return combatQueue;
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
            store.dispatch(Action.enqueuePhase(Phase.PLANNING_START));

            var planningTask = new PlanningPhaseTask(store);
            var finishPlanningPhase = this.finishPlanningPhase.bind(this);
            var phaseCallback = function()
            {
               finishPlanningPhase(callback);
            };
            planningTask.doIt(phaseCallback);
         }
      };

      Engine.prototype.finishPlanningPhase = function(callback)
      {
         var store = this.store();
         store.dispatch(Action.enqueuePhase(Phase.PLANNING_END));

         if (callback === undefined)
         {
            callback = this.performActivationPhase.bind(this);
         }

         callback();
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
            store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_START));

            var activationTask = new ActivationPhaseTask(store);
            var finishActivationPhase = this.finishActivationPhase.bind(this);
            var phaseCallback = function()
            {
               finishActivationPhase(callback);
            };
            activationTask.doIt(phaseCallback);
         }
      };

      Engine.prototype.finishActivationPhase = function(callback)
      {
         var store = this.store();
         store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_END));

         if (callback === undefined)
         {
            callback = this.performCombatPhase.bind(this);
         }

         callback();
      };

      Engine.prototype.performCombatPhase = function(callback)
      {
         // callback optional.
         if (callback !== undefined)
         {
            this.combatPhaseCallback(callback);
         }

         var environment = this.environment();

         if (this.isGameOver())
         {
            this.processGameOver();
         }
         else
         {
            LOGGER.trace("Engine.performCombatPhase() start");
            this.combatQueue(environment.getTokensForCombat());
            var processCombatQueue = this.processCombatQueue.bind(this);
            this.startOrEndPhase(Phase.COMBAT_START, processCombatQueue);
         }
      };

      Engine.prototype.processCombatQueue = function()
      {
         LOGGER.trace("Engine.processCombatQueue() start");

         var store = this.store();
         var environment = this.environment();
         var adjudicator = this.adjudicator();

         if (this.combatQueue().length === 0)
         {
            environment.setActiveToken(undefined);
            store.dispatch(Action.setUserMessage(""));
            LOGGER.trace("Engine.processCombatQueue() done");
            var combatPhaseCallback = this.combatPhaseCallback();
            this.startOrEndPhase(Phase.COMBAT_END, combatPhaseCallback);
            return;
         }

         var attacker = this.combatQueue().shift();

         if (attacker)
         {
            environment.setActiveToken(attacker);

            if (adjudicator.canAttack(attacker))
            {
               // Perform combat steps.
               LOGGER.debug("attacker = " + attacker.name());

               // Declare target.
               var agent = attacker.agent();
               agent.chooseWeaponAndDefender(attacker, this.setWeaponAndDefender.bind(this));

               // Wait for agent to respond.
            }
            else
            {
               // Proceed.
               setTimeout(this.processCombatQueue.bind(this), this.delay());
            }
         }

         LOGGER.trace("Engine.processCombatQueue() end");
      };

      Engine.prototype.setWeaponAndDefender = function(weapon, defender)
      {
         if (weapon && defender)
         {
            var environment = this.environment();
            var attacker = environment.activeCardInstance();

            if (defender)
            {
               var store = this.store();
               store.dispatch(Action.setUserMessage(attacker + " fires upon " + defender));

               var combatAction = new CombatAction(store, attacker, weapon, defender, this.processCombatQueue.bind(this));

               setTimeout(function()
               {
                  combatAction.doIt();
               }, this.delay());
            }
         }
         else
         {
            this.processCombatQueue();
         }
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
            store.dispatch(Action.enqueuePhase(Phase.END_START));

            var endTask = new EndPhaseTask(store);
            var finishEndPhase = this.finishEndPhase.bind(this);
            var phaseCallback = function()
            {
               finishEndPhase(callback);
            };
            endTask.doIt(phaseCallback);
         }
      };

      Engine.prototype.finishEndPhase = function(callback)
      {
         var store = this.store();
         store.dispatch(Action.enqueuePhase(Phase.END_END));

         if (callback === undefined)
         {
            callback = this.performPlanningPhase.bind(this);
         }

         callback();
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
