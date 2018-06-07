import InputValidator from "../utility/InputValidator.js";

import Action from "./Action.js";
import QueueProcessor from "./QueueProcessor.js";

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

   const store = this.store();
   const environment = store.getState().environment;

   const queue = [environment.firstAgent(), environment.secondAgent()];
   const elementFunction = this.planningElementFunction.bind(this);
   const delay = this.delay();

   const queueProcessor = new QueueProcessor(queue, callback, elementFunction, undefined, delay);
   queueProcessor.processQueue();

   LOGGER.trace("PlanningPhaseTask.doIt() end");
};

PlanningPhaseTask.prototype.planningElementFunction = function(agent, queueCallback)
{
   InputValidator.validateNotNull("agent", agent);
   InputValidator.validateIsFunction("queueCallback", queueCallback);

   LOGGER.trace("PlanningPhaseTask.planningElementFunction() start");
   const store = this.store();

   const agentCallback = function(pilotToManeuver)
   {
      store.dispatch(Action.addPilotToManeuver(pilotToManeuver));
      queueCallback();
   };
   agent.getPlanningAction(agentCallback);

   LOGGER.trace("PlanningPhaseTask.planningElementFunction() end");
};

export default PlanningPhaseTask;