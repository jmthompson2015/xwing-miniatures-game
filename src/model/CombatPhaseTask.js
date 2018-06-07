import InputValidator from "../utility/InputValidator.js";

import Action from "./Action.js";
import CombatAction from "./CombatAction.js";
import QueueProcessor from "./QueueProcessor.js";

function CombatPhaseTask(store)
{
   InputValidator.validateNotNull("store", store);

   this.store = function()
   {
      return store;
   };
}

CombatPhaseTask.prototype.delay = function()
{
   return 10;
};

CombatPhaseTask.prototype.doIt = function(callback)
{
   InputValidator.validateNotNull("callback", callback);

   LOGGER.trace("CombatPhaseTask.doIt() start");

   const store = this.store();
   const environment = store.getState().environment;

   const queue = environment.getTokensForCombat();
   const elementFunction = this.combatElementFunction.bind(this);
   const phaseCallback = this.finishCombatPhase.bind(this);
   const finishFunction = function(finishCallback)
   {
      phaseCallback(finishCallback);
   };
   const delay = this.delay();

   const queueProcessor = new QueueProcessor(queue, callback, elementFunction, finishFunction, delay);
   queueProcessor.processQueue();

   LOGGER.trace("CombatPhaseTask.doIt() end");
};

CombatPhaseTask.prototype.combatElementFunction = function(attacker, queueCallback)
{
   InputValidator.validateNotNull("attacker", attacker);
   InputValidator.validateIsFunction("queueCallback", queueCallback);

   LOGGER.trace("CombatPhaseTask.combatElementFunction() start");
   const store = this.store();
   const environment = store.getState().environment;
   environment.setActiveToken(attacker);
   const adjudicator = store.getState().adjudicator;

   if (adjudicator.canAttack(attacker))
   {
      const agent = attacker.agent();
      const agentCallback = function(weapon, defender)
      {
         if (weapon && defender)
         {
            store.dispatch(Action.setUserMessage(attacker + " fires upon " + defender));
            const combatAction = new CombatAction(store, attacker, weapon, defender, queueCallback);
            combatAction.doIt();
         }
         else
         {
            queueCallback();
         }
      };
      agent.chooseWeaponAndDefender(attacker, agentCallback);
   }
   else
   {
      queueCallback();
   }

   LOGGER.trace("CombatPhaseTask.combatElementFunction() end");
};

CombatPhaseTask.prototype.finishCombatPhase = function(callback)
{
   InputValidator.validateNotNull("callback", callback);

   LOGGER.trace("CombatPhaseTask.finishCombatPhase() start");

   callback();

   LOGGER.trace("CombatPhaseTask.finishCombatPhase() end");
};

export default CombatPhaseTask;