import InputValidator from "../utility/InputValidator.js";

import Phase from "../artifact/Phase.js";
import ShipAction from "../artifact/ShipAction.js";

import Action from "./Action.js";
import CardAction from "./CardAction.js";
import DamageAbility1 from "./DamageAbility1.js";
import DamageAbility2 from "./DamageAbility2.js";
import DamageAbility3 from "./DamageAbility3.js";
import DamageAbility4 from "./DamageAbility4.js";
import Observer from "./Observer.js";
import PilotAbility1 from "./PilotAbility1.js";
import PilotAbility2 from "./PilotAbility2.js";
import PilotAbility3 from "./PilotAbility3.js";
import PilotAbility4 from "./PilotAbility4.js";
import QueueProcessor from "./QueueProcessor.js";
import UpgradeAbility1 from "./UpgradeAbility1.js";
import UpgradeAbility2 from "./UpgradeAbility2.js";
import UpgradeAbility3 from "./UpgradeAbility3.js";
import UpgradeAbility4 from "./UpgradeAbility4.js";

function PhaseObserver(store)
{
   InputValidator.validateNotNull("store", store);

   this.store = function()
   {
      return store;
   };
}

//////////////////////////////////////////////////////////////////////////
// Creation methods.

PhaseObserver.observeStore = function(store)
{
   const observer = new PhaseObserver(store);

   const select = function(state)
   {
      return state.phaseQueue;
   };

   Observer.observeStore(store, select, observer.onChange.bind(observer));

   return observer;
};

//////////////////////////////////////////////////////////////////////////
// Behavior methods.

PhaseObserver.prototype.onChange = function(phaseQueue)
{
   LOGGER.trace("PhaseObserver.onChange() start");

   if (phaseQueue.size > 0)
   {
      const store = this.store();
      store.dispatch(Action.dequeuePhase());
      const phaseData = store.getState().phaseData;

      LOGGER.debug("phaseData = " + JSON.stringify(phaseData));

      if (phaseData !== undefined)
      {
         const environment = store.getState().environment;
         const queue = environment.getTokensForActivation();
         const pilotInstanceCallback = this.finishOnChange.bind(this);
         const callback = function()
         {
            pilotInstanceCallback(phaseData);
         };
         const pilotInstanceFunction = this.chooseAbility.bind(this);
         const elementFunction = function(pilotInstance, queueCallback)
         {
            pilotInstanceFunction(phaseData, pilotInstance, queueCallback);
         };
         const delay = 10;
         const queueProcessor = new QueueProcessor(queue, callback, elementFunction, undefined, delay);
         queueProcessor.processQueue();
      }
   }

   LOGGER.trace("PhaseObserver.onChange() end");
};

PhaseObserver.prototype.chooseAbility = function(phaseData, pilotInstance, queueCallback)
{
   LOGGER.trace("PhaseObserver.chooseAbility() start");

   InputValidator.validateNotNull("phaseData", phaseData);
   InputValidator.validateNotNull("pilotInstance", pilotInstance);
   InputValidator.validateNotNull("queueCallback", queueCallback);

   const phaseKey = phaseData.get("phaseKey");
   const phaseContext = phaseData.get("phaseContext");

   const agent = pilotInstance.agent();
   const that = this;
   const agentCallback = function(ability, isAccepted)
   {
      that.finishChooseAbility(phaseData, pilotInstance, queueCallback, ability, isAccepted);
   };
   let defender;
   if (phaseContext)
   {
      defender = phaseContext.defender;
   }

   if (phaseKey === Phase.ACTIVATION_PERFORM_ACTION)
   {
      agent.getShipAction(pilotInstance, agentCallback);
   }
   else if (phaseKey === Phase.COMBAT_MODIFY_ATTACK_DICE)
   {
      agent.getModifyAttackDiceAction(pilotInstance, defender, agentCallback);
   }
   else if (phaseKey === Phase.COMBAT_MODIFY_DEFENSE_DICE)
   {
      const defenderAgent = defender.agent();
      defenderAgent.getModifyDefenseDiceAction(pilotInstance, defender, agentCallback);
   }
   else
   {
      const abilityTypes = PhaseObserver.abilityTypes(phaseKey);
      const damageAbilities = (pilotInstance.usableDamageAbilities !== undefined ? pilotInstance.usableDamageAbilities(abilityTypes[0], phaseKey) : []);
      const pilotAbilities = (pilotInstance.usablePilotAbilities !== undefined ? pilotInstance.usablePilotAbilities(abilityTypes[1], phaseKey) : []);
      const upgradeAbilities = (pilotInstance.usableUpgradeAbilities !== undefined ? pilotInstance.usableUpgradeAbilities(abilityTypes[2], phaseKey) : []);

      if (damageAbilities.length > 0 || pilotAbilities.length > 0 || upgradeAbilities.length > 0)
      {
         agent.chooseAbility(damageAbilities, pilotAbilities, upgradeAbilities, agentCallback);
      }
      else
      {
         queueCallback();
      }
   }

   LOGGER.trace("PhaseObserver.chooseAbility() end");
};

PhaseObserver.prototype.finishChooseAbility = function(phaseData, pilotInstance, queueCallback, ability, isAccepted)
{
   LOGGER.trace("PhaseObserver.finishChooseAbility() start");

   InputValidator.validateNotNull("phaseData", phaseData);
   InputValidator.validateNotNull("pilotInstance", pilotInstance);
   InputValidator.validateNotNull("queueCallback", queueCallback);
   // ability optional.
   // isAccepted optional.

   LOGGER.debug("PhaseObserver.finishChooseAbility() ability = " + ability + " isAccepted ? " + isAccepted);

   const that = this;
   const backFunction = function()
   {
      that.chooseAbility(phaseData, pilotInstance, queueCallback);
   };
   const forwardFunction = function()
   {
      queueCallback();
   };

   this.finish(phaseData, pilotInstance, backFunction, forwardFunction, ability, isAccepted);

   LOGGER.trace("PhaseObserver.finishChooseAbility() end");
};

PhaseObserver.prototype.finish = function(phaseData, pilotInstance, backFunction, forwardFunction, ability, isAccepted)
{
   LOGGER.trace("PhaseObserver.finish() start");

   InputValidator.validateNotNull("phaseData", phaseData);
   InputValidator.validateNotNull("pilotInstance", pilotInstance);
   InputValidator.validateNotNull("backFunction", backFunction);
   InputValidator.validateNotNull("forwardFunction", forwardFunction);
   // ability optional.
   // isAccepted optional.

   if (ability !== undefined && isAccepted === true)
   {
      const store = this.store();

      if (ability.sourceObject().oncePerRound)
      {
         store.dispatch(CardAction.addUsedPerRoundAbility(pilotInstance, ability));
      }
      else
      {
         store.dispatch(CardAction.addUsedAbility(pilotInstance, ability));
      }

      const message = ability.sourceObject().name + " ability used.";
      LOGGER.info(message);
      store.dispatch(Action.setUserMessage(message));

      const myCallback = (ability.source() === ShipAction ? forwardFunction : backFunction);
      const consequent = ability.consequent();
      consequent(store, pilotInstance, myCallback, ability.context());
   }
   else
   {
      forwardFunction();
   }

   LOGGER.trace("PhaseObserver.finish() end");
};

PhaseObserver.prototype.finishOnChange = function(phaseData)
{
   LOGGER.trace("PhaseObserver.finishOnChange() start");

   InputValidator.validateNotNull("phaseData", phaseData);

   const store = this.store();
   store.dispatch(Action.clearPhase());

   const callback = phaseData.get("phaseCallback");

   if (callback !== undefined)
   {
      callback();
   }

   LOGGER.trace("PhaseObserver.finishOnChange() end");
};

//////////////////////////////////////////////////////////////////////////
// Utility methods.

PhaseObserver.abilityTypes = function(phaseKey)
{
   InputValidator.validateNotNull("phaseKey", phaseKey);

   let answer;

   if (phaseKey.startsWith("planning"))
   {
      answer = [DamageAbility1, PilotAbility1, UpgradeAbility1];
   }
   else if (phaseKey.startsWith("activation"))
   {
      answer = [DamageAbility2, PilotAbility2, UpgradeAbility2];
   }
   else if (phaseKey.startsWith("combat"))
   {
      answer = [DamageAbility3, PilotAbility3, UpgradeAbility3];
   }
   else if (phaseKey.startsWith("end"))
   {
      answer = [DamageAbility4, PilotAbility4, UpgradeAbility4];
   }

   return answer;
};

if (Object.freeze)
{
   Object.freeze(PhaseObserver);
}

export default PhaseObserver;