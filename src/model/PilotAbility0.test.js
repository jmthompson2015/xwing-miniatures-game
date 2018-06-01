import Event from "../artifact/Event.js";
import Maneuver from "../artifact/Maneuver.js";

import Action from "./Action.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import ManeuverAction from "./ManeuverAction.js";
import PilotAbility from "./PilotAbility0.js";
import Position from "./Position.js";
import SquadBuilder from "./SquadBuilder.js";

QUnit.module("PilotAbility0");

QUnit.test("Captain Oicunn", function(assert)
{
   // Setup.
   var squadBuilder1 = SquadBuilder.findByNameAndYear("JMT", 2017);
   var environment = EnvironmentFactory.createEnvironment(squadBuilder1, SquadBuilder.CoreSetRebelSquadBuilder);
   var store = environment.store();
   var firstAgent = environment.firstAgent();
   var pilotInstances1 = firstAgent.pilotInstances();
   var decimator = pilotInstances1[0];
   var tieDefender = pilotInstances1[1];

   var secondAgent = environment.secondAgent();
   var pilotInstances2 = secondAgent.pilotInstances();
   var xwing = pilotInstances2[0];

   var decimatorPosition0 = environment.getPositionFor(decimator);
   var decimatorPosition1 = new Position(400, 400, 90);
   environment.moveToken(decimatorPosition0, decimatorPosition1);
   var xwingPosition0 = environment.getPositionFor(xwing);
   var xwingPosition1 = new Position(400, 480, -90);
   environment.moveToken(xwingPosition0, xwingPosition1);

   var maneuverAction = new ManeuverAction(store, decimator.id(), Maneuver.STRAIGHT_1_EASY, false, decimatorPosition1);
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(decimator.shieldCount(), 4);
      assert.equal(decimator.damageCount(), 0);
      assert.equal(tieDefender.shieldCount(), 3);
      assert.equal(tieDefender.damageCount(), 0);
      assert.equal(xwing.shieldCount(), 2 - 1, "X-Wing shield decrease");
      assert.equal(xwing.damageCount(), 0);
      done();
   };

   // Run.
   maneuverAction.doIt();
   var done = assert.async();
   store.dispatch(Action.enqueueEvent(Event.AFTER_EXECUTE_MANEUVER, decimator, callback));
});

QUnit.test("condition()", function(assert)
{
   // Setup.
   var environment = createEnvironment();
   var store = environment.store();
   var token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Event.keys().forEach(function(eventKey)
   {
      var abilities = PilotAbility[eventKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            var ability = abilities[pilotKey];

            if (ability.condition)
            {
               var result = ability.condition(store, token);
               assert.ok(result !== undefined, "eventKey = " + eventKey + " pilotKey = " + pilotKey);
            }
         });
      }
   });

   // assert.ok(true);
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
      var abilities = PilotAbility[eventKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            var ability = abilities[pilotKey];

            if (ability.condition && ability.condition(store, token))
            {
               ability.consequent(store, token);
               assert.ok(true, "eventKey = " + eventKey + " pilotKey = " + pilotKey);
            }
         });
      }
   });

   assert.ok(true);
});

function createEnvironment()
{
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var token = environment.pilotInstances()[2]; // X-Wing.

   environment.setActiveToken(token);

   return environment;
}

const PilotAbility0Test = {};
export default PilotAbility0Test;