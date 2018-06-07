import InputValidator from "../utility/InputValidator.js";

import Phase from "../artifact/Phase.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Action from "./Action.js";
import CardAction from "./CardAction.js";
import QueueProcessor from "./QueueProcessor.js";

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

   const store = this.store();
   const environment = store.getState().environment;

   const queue = environment.getTokensForActivation();
   const elementFunction = this.cleanUpElementFunction.bind(this);
   const phaseCallback = this.roundEnd.bind(this);
   const finishFunction = function(finishCallback)
   {
      phaseCallback(finishCallback);
   };
   const delay = this.delay();

   const queueProcessor = new QueueProcessor(queue, callback, elementFunction, finishFunction, delay);
   queueProcessor.processQueue();

   LOGGER.trace("EndPhaseTask.doIt() end");
};

EndPhaseTask.prototype.cleanUpElementFunction = function(cardInstance, queueCallback)
{
   InputValidator.validateNotNull("cardInstance", cardInstance);
   InputValidator.validateIsFunction("queueCallback", queueCallback);

   const store = this.store();

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

   const store = this.store();
   const environment = store.getState().environment;

   const queue = environment.getTokensForActivation();
   const elementFunction = this.roundEndElementFunction.bind(this);
   const phaseCallback = this.finishEndPhase.bind(this);
   const finishFunction = function(finishCallback)
   {
      phaseCallback(finishCallback);
   };
   const delay = this.delay();

   const queueProcessor = new QueueProcessor(queue, callback, elementFunction, finishFunction, delay);
   queueProcessor.processQueue();

   LOGGER.trace("EndPhaseTask.roundEnd() end");
};

EndPhaseTask.prototype.roundEndElementFunction = function(cardInstance, queueCallback)
{
   InputValidator.validateNotNull("cardInstance", cardInstance);
   InputValidator.validateIsFunction("queueCallback", queueCallback);

   const store = this.store();

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

export default EndPhaseTask;