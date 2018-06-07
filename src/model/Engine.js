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
   const store = this.store();

   return store.getState().adjudicator;
};

Engine.prototype.delay = function()
{
   const store = this.store();

   return store.getState().delay;
};

Engine.prototype.environment = function()
{
   const store = this.store();

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
      const store = this.store();
      const finishPlanningPhase = this.finishPlanningPhase.bind(this);
      const startOrEndPhaseCallback = function()
      {
         const planningTask = new PlanningPhaseTask(store);
         const phaseCallback = function()
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

   const store = this.store();
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
      const store = this.store();
      const finishActivationPhase = this.finishActivationPhase.bind(this);
      const startOrEndPhaseCallback = function()
      {
         const activationTask = new ActivationPhaseTask(store);
         const phaseCallback = function()
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

   const store = this.store();
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
      const store = this.store();
      const finishCombatPhase = this.finishCombatPhase.bind(this);
      const startOrEndPhaseCallback = function()
      {
         const combatTask = new CombatPhaseTask(store);
         const phaseCallback = function()
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

   const store = this.store();
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
      const store = this.store();
      const finishEndPhase = this.finishEndPhase.bind(this);
      const startOrEndPhaseCallback = function()
      {
         const endTask = new EndPhaseTask(store);
         const phaseCallback = function()
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

   const store = this.store();
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

   const environment = this.environment();
   const adjudicator = this.adjudicator();
   const winner = adjudicator.determineWinner(environment);
   const store = this.store();
   store.dispatch(Action.setGameOver(winner));

   const message = (winner === undefined ? "Game is a draw." : winner.name() + " won! ");
   store.dispatch(Action.setUserMessage(message));

   const callback = this.callback();

   if (callback)
   {
      callback();
   }
};

export default Engine;