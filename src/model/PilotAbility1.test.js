import Phase from "../artifact/Phase.js";

import EnvironmentFactory from "./EnvironmentFactory.js";
import PilotAbility from "./PilotAbility1.js";

QUnit.module("PilotAbility1");

QUnit.test("condition()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      const abilities = PilotAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            const ability = abilities[pilotKey];

            if (ability.condition)
            {
               const result = ability.condition(store, token);
               assert.ok(result !== undefined, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
            }
         });
      }
   });

   assert.ok(true);
});

QUnit.test("consequent()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      const abilities = PilotAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            const ability = abilities[pilotKey];

            if (ability.condition && ability.condition(store, token))
            {
               ability.consequent(store, token);
               assert.ok(true, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
            }
         });
      }
   });

   assert.ok(true);
});

QUnit.test("function()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      const abilities = PilotAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            const ability = abilities[pilotKey];

            if (typeof ability === "function")
            {
               ability(store, token);
               assert.ok(true, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
            }
         });
      }
   });

   assert.ok(true);
});

function createEnvironment()
{
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const token = environment.pilotInstances()[2]; // X-Wing.

   environment.setActiveToken(token);

   return environment;
}

const PilotAbility1Test = {};
export default PilotAbility1Test;