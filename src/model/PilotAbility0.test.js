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
   const squadBuilder1 = SquadBuilder.findByNameAndYear("JMT", 2017);
   const environment = EnvironmentFactory.createEnvironment(squadBuilder1, SquadBuilder.CoreSetRebelSquadBuilder);
   const store = environment.store();
   const firstAgent = environment.firstAgent();
   const pilotInstances1 = firstAgent.pilotInstances();
   const decimator = pilotInstances1[0];
   const tieDefender = pilotInstances1[1];

   const secondAgent = environment.secondAgent();
   const pilotInstances2 = secondAgent.pilotInstances();
   const xwing = pilotInstances2[0];

   const decimatorPosition0 = environment.getPositionFor(decimator);
   const decimatorPosition1 = new Position(400, 400, 90);
   environment.moveToken(decimatorPosition0, decimatorPosition1);
   const xwingPosition0 = environment.getPositionFor(xwing);
   const xwingPosition1 = new Position(400, 480, -90);
   environment.moveToken(xwingPosition0, xwingPosition1);

   const maneuverAction = new ManeuverAction(store, decimator.id(), Maneuver.STRAIGHT_1_EASY, false, decimatorPosition1);
   const callback = function()
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
   const done = assert.async();
   store.dispatch(Action.enqueueEvent(Event.AFTER_EXECUTE_MANEUVER, decimator, callback));
});

QUnit.test("condition()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Event.keys().forEach(function(eventKey)
   {
      const abilities = PilotAbility[eventKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            const ability = abilities[pilotKey];

            if (ability.condition)
            {
               const result = ability.condition(store, token);
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
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Event.keys().forEach(function(eventKey)
   {
      const abilities = PilotAbility[eventKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            const ability = abilities[pilotKey];

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
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const token = environment.pilotInstances()[2]; // X-Wing.

   environment.setActiveToken(token);

   return environment;
}

const PilotAbility0Test = {};
export default PilotAbility0Test;