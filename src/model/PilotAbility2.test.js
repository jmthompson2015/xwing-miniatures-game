import Maneuver from "../artifact/Maneuver.js";
import Phase from "../artifact/Phase.js";

import Action from "./Action.js";
import ActivationAction from "./ActivationAction.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import PilotAbility from "./PilotAbility2.js";

QUnit.module("PilotAbility2");

var delay = 10;

QUnit.test("condition()", function(assert)
{
   // Setup.
   var environment = createEnvironment();
   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      var abilities = PilotAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            var ability = abilities[pilotKey];

            if (ability.condition)
            {
               var result = ability.condition(store, token);
               assert.ok(result !== undefined, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
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
   var callback = function()
   {
      LOGGER.info("in callback()");
   };

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      var abilities = PilotAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            var ability = abilities[pilotKey];

            if (ability.condition && ability.condition(store, token))
            {
               ability.consequent(store, token, callback);
               assert.ok(true, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
            }
         });
      }
   });
});

QUnit.test("function()", function(assert)
{
   // Setup.
   var environment = createEnvironment();
   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      var abilities = PilotAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            var ability = abilities[pilotKey];

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
   var environment = EnvironmentFactory.createCoreSetEnvironment();

   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing.
   var maneuverKey = Maneuver.STRAIGHT_3_EASY;
   var callback = function()
   {
      LOGGER.info("in callback()");
   };

   environment.setActiveToken(token);
   store.dispatch(Action.setDelay(delay));
   ActivationAction.create(store, token.id(), callback);
   var maneuver = Maneuver.properties[maneuverKey];
   store.dispatch(Action.setTokenManeuver(token, maneuver));

   return environment;
}

const PilotAbility2Test = {};
export default PilotAbility2Test;