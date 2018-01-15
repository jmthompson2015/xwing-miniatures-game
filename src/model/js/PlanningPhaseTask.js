"use strict";

define(["common/js/InputValidator", "model/js/Action", "model/js/QueueProcessor"],
   function(InputValidator, Action, QueueProcessor)
   {
      function PlanningPhaseTask(store)
      {
         InputValidator.validateNotNull("store", store);

         this.store = function()
         {
            return store;
         };
      }

      PlanningPhaseTask.prototype.delay = function()
      {
         return 10;
      };

      PlanningPhaseTask.prototype.doIt = function(callback)
      {
         InputValidator.validateNotNull("callback", callback);

         LOGGER.trace("PlanningPhaseTask.doIt() start");

         var store = this.store();
         var environment = store.getState().environment;

         var queue = [environment.firstAgent(), environment.secondAgent()];
         var elementFunction = this.planningElementFunction.bind(this);
         var phaseCallback = this.finishPlanningPhase.bind(this);
         var finishFunction = function(finishCallback)
         {
            phaseCallback(finishCallback);
         };
         var delay = this.delay();

         var queueProcessor = new QueueProcessor(queue, callback, elementFunction, finishFunction, delay);
         queueProcessor.processQueue();

         LOGGER.trace("PlanningPhaseTask.doIt() end");
      };

      PlanningPhaseTask.prototype.planningElementFunction = function(agent, queueCallback)
      {
         InputValidator.validateNotNull("agent", agent);
         InputValidator.validateIsFunction("queueCallback", queueCallback);

         LOGGER.trace("PlanningPhaseTask.planningElementFunction() start");
         var store = this.store();

         var agentCallback = function(pilotToManeuver)
         {
            store.dispatch(Action.addPilotToManeuver(pilotToManeuver));
            queueCallback();
         };
         agent.getPlanningAction(agentCallback);

         LOGGER.trace("PlanningPhaseTask.planningElementFunction() end");
      };

      PlanningPhaseTask.prototype.finishPlanningPhase = function(callback)
      {
         InputValidator.validateNotNull("callback", callback);

         LOGGER.trace("PlanningPhaseTask.finishPlanningPhase() start");

         callback();

         LOGGER.trace("PlanningPhaseTask.finishPlanningPhase() end");
      };

      return PlanningPhaseTask;
   });
