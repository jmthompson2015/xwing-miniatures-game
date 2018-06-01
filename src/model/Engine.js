import InputValidator from "../utility/InputValidator.js";

import Phase from "../artifact/Phase.js";

import Action from "./Action.js";
import ActivationPhaseTask from "./ActivationPhaseTask.js";
import CombatPhaseTask from "./CombatPhaseTask.js";
import EndPhaseTask from "./EndPhaseTask.js";
import PlanningPhaseTask from "./PlanningPhaseTask.js";

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

      store.dispatch(Action.enqueuePhase(Phase.PLANNING_START, undefined, startOrEndPhaseCallback));
   }
};

Engine.prototype.finishPlanningPhase = function(callback)
{
   if (callback === undefined)
   {
      callback = this.performActivationPhase.bind(this);
   }

   var store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.PLANNING_END, undefined, callback));
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

      store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_START, undefined, startOrEndPhaseCallback));
   }
};

Engine.prototype.finishActivationPhase = function(callback)
{
   if (callback === undefined)
   {
      callback = this.performCombatPhase.bind(this);
   }

   var store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_END, undefined, callback));
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

      store.dispatch(Action.enqueuePhase(Phase.COMBAT_START, undefined, startOrEndPhaseCallback));
   }
};

Engine.prototype.finishCombatPhase = function(callback)
{
   if (callback === undefined)
   {
      callback = this.performEndPhase.bind(this);
   }

   var store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.COMBAT_END, undefined, callback));
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

      store.dispatch(Action.enqueuePhase(Phase.END_START, undefined, startOrEndPhaseCallback));
   }
};

Engine.prototype.finishEndPhase = function(callback)
{
   if (callback === undefined)
   {
      callback = this.performPlanningPhase.bind(this);
   }

   var store = this.store();
   store.dispatch(Action.enqueuePhase(Phase.END_END, undefined, callback));
};

//////////////////////////////////////////////////////////////////////////
// Utility methods.

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

export default Engine;