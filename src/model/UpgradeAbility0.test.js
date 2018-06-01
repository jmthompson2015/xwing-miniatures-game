import Event from "../artifact/Event.js";
import Maneuver from "../artifact/Maneuver.js";
import Ship from "../artifact/Ship.js";

import Action from "./Action.js";
import ActivationAction from "./ActivationAction.js";
import Adjudicator from "./Adjudicator.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import ManeuverAction from "./ManeuverAction.js";
import Position from "./Position.js";
import SquadBuilder from "./SquadBuilder.js";
import UpgradeAbility from "./UpgradeAbility0.js";

QUnit.module("UpgradeAbility0");

var delay = 10;

QUnit.test("Attanni Mindlink receive focus", function(assert)
{
   // Setup.
   var squadBuilder1 = SquadBuilder.findByNameAndYear("US Nationals #4", 2017);
   var environment = EnvironmentFactory.createEnvironment(squadBuilder1, SquadBuilder.CoreSetRebelSquadBuilder);
   var firstAgent = environment.firstAgent();
   var pilotInstances1 = firstAgent.pilotInstances();
   assert.ok(pilotInstances1);
   assert.equal(pilotInstances1.length, 3);
   assert.equal(pilotInstances1[0].focusCount(), 0);
   assert.equal(pilotInstances1[1].focusCount(), 0);
   assert.equal(pilotInstances1[2].focusCount(), 0);
   var secondAgent = environment.secondAgent();
   var pilotInstances2 = secondAgent.pilotInstances();
   assert.ok(pilotInstances2);
   assert.equal(pilotInstances2.length, 1);
   assert.equal(pilotInstances2[0].focusCount(), 0);

   // Run.
   pilotInstances1[0].receiveFocus();

   // Verify.
   assert.equal(pilotInstances1[0].focusCount(), 1);
   assert.equal(pilotInstances1[1].focusCount(), 1);
   assert.equal(pilotInstances1[2].focusCount(), 1);
   assert.equal(pilotInstances2[0].focusCount(), 0);
});

QUnit.test("Attanni Mindlink receive stress", function(assert)
{
   // Setup.
   var squadBuilder1 = SquadBuilder.findByNameAndYear("US Nationals #4", 2017);
   var environment = EnvironmentFactory.createEnvironment(squadBuilder1, SquadBuilder.CoreSetRebelSquadBuilder);
   var firstAgent = environment.firstAgent();
   var pilotInstances1 = firstAgent.pilotInstances();
   assert.ok(pilotInstances1);
   assert.equal(pilotInstances1.length, 3);
   assert.equal(pilotInstances1[0].stressCount(), 0);
   assert.equal(pilotInstances1[1].stressCount(), 0);
   assert.equal(pilotInstances1[2].stressCount(), 0);
   var secondAgent = environment.secondAgent();
   var pilotInstances2 = secondAgent.pilotInstances();
   assert.ok(pilotInstances2);
   assert.equal(pilotInstances2.length, 1);
   assert.equal(pilotInstances2[0].stressCount(), 0);

   // Run.
   pilotInstances1[0].receiveStress();

   // Verify.
   assert.equal(pilotInstances1[0].stressCount(), 1);
   assert.equal(pilotInstances1[1].stressCount(), 1);
   assert.equal(pilotInstances1[2].stressCount(), 1);
   assert.equal(pilotInstances2[0].stressCount(), 0);
});

QUnit.test("Ion Projector", function(assert)
{
   // Setup.
   var squadBuilder1 = SquadBuilder.findByNameAndYear("JMT", 2017);
   var environment = EnvironmentFactory.createEnvironment(squadBuilder1, SquadBuilder.CoreSetRebelSquadBuilder);
   var store = environment.store();
   var firstAgent = environment.firstAgent();
   var pilotInstances1 = firstAgent.pilotInstances();
   assert.equal(pilotInstances1.length, 2);
   var decimator = pilotInstances1[0];
   var tieDefender = pilotInstances1[1];
   assert.equal(decimator.card().shipFaction.ship.key, Ship.VT_49_DECIMATOR);
   assert.equal(tieDefender.card().shipFaction.ship.key, Ship.TIE_DEFENDER);

   var secondAgent = environment.secondAgent();
   var pilotInstances2 = secondAgent.pilotInstances();
   assert.equal(pilotInstances2.length, 1);
   var xwing = pilotInstances2[0];
   assert.equal(xwing.card().shipFaction.ship.key, Ship.X_WING);

   var decimatorPosition0 = environment.getPositionFor(decimator);
   var decimatorPosition1 = new Position(400, 400, 90);
   environment.moveToken(decimatorPosition0, decimatorPosition1);
   var xwingPosition0 = environment.getPositionFor(xwing);
   var xwingPosition1 = new Position(400, 480, -90);
   environment.moveToken(xwingPosition0, xwingPosition1);

   var maneuverAction = new ManeuverAction(store, xwing.id(), Maneuver.STRAIGHT_1_EASY, false, xwingPosition1);
   var callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(decimator.ionCount(), 0);
      assert.equal(tieDefender.ionCount(), 0);
      assert.equal([0, 1].includes(xwing.ionCount()), true, "xwing.ionCount() === 1");
      done();
   };

   // Run.
   maneuverAction.doIt();
   var done = assert.async();
   store.dispatch(Action.enqueueEvent(Event.AFTER_EXECUTE_MANEUVER, xwing, callback));
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
      var abilities = UpgradeAbility[eventKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(upgradeKey)
         {
            var ability = abilities[upgradeKey];

            if (ability.condition)
            {
               var result = ability.condition(store, token);
               assert.ok(result !== undefined, "eventKey = " + eventKey + " upgradeKey = " + upgradeKey);
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
      var abilities = UpgradeAbility[eventKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(upgradeKey)
         {
            var ability = abilities[upgradeKey];

            if (ability.condition && ability.condition(store, token))
            {
               ability.consequent(store, token);
               assert.ok(true, "eventKey = " + eventKey + " upgradeKey = " + upgradeKey);
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
   Adjudicator.create(store);

   var token = environment.pilotInstances()[2]; // X-Wing.
   var maneuverKey = Maneuver.STRAIGHT_2_EASY;
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

const UpgradeAbility0Test = {};
export default UpgradeAbility0Test;