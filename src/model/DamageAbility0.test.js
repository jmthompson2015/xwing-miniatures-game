import Event from "../artifact/Event.js";

import Action from "./Action.js";
import CardInstance from "./CardInstance.js";
import DamageAbility from "./DamageAbility0.js";
import EnvironmentFactory from "./EnvironmentFactory.js";

QUnit.module("DamageAbility0");

QUnit.test("condition()", function(assert)
{
   // Setup.
   var environment = createEnvironment();
   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Event.keys().forEach(function(eventKey)
   {
      var abilities = DamageAbility[eventKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(damageKey)
         {
            var ability = abilities[damageKey];

            if (ability.condition)
            {
               var result = ability.condition(store, token);
               assert.ok(result !== undefined, "eventKey = " + eventKey + " damageKey = " + damageKey);
            }
         });
      }
   });
});

QUnit.test("consequent()", function(assert)
{
   // Setup.
   var environment = createEnvironment();
   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Event.keys().forEach(function(eventKey)
   {
      var abilities = DamageAbility[eventKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(damageKey)
         {
            var damageInstance = new CardInstance(store, damageKey);
            token.receiveCriticalDamage(damageInstance);
            var eventCallback = function()
            {
               assert.ok(true, "test resumed from async operation");
               assert.ok(true, "eventKey = " + eventKey + " damageKey = " + damageKey);
               done();
            };
            store.dispatch(Action.enqueueEvent(eventKey, token, eventCallback));
            var done = assert.async();
            store.dispatch(Action.dequeueEvent());
         });
      }
   });
});

function createEnvironment()
{
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var token = environment.pilotInstances()[2]; // X-Wing.

   environment.setActiveToken(token);

   return environment;
}

const DamageAbility0Test = {};
export default DamageAbility0Test;