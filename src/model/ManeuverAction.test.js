import Maneuver from "../artifact/Maneuver.js";
import PilotCard from "../artifact/PilotCard.js";
import ShipBase from "../artifact/ShipBase.js";

import CardInstance from "./CardInstance.js";
import EnvironmentAction from "./EnvironmentAction.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import ManeuverAction from "./ManeuverAction.js";
import Position from "./Position.js";

QUnit.module("ManeuverAction");

QUnit.test("ManeuverAction properties", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const maneuverKey = Maneuver.STRAIGHT_1_EASY;
   const token = environment.pilotInstances()[2]; // X-Wing
   const fromPosition = environment.getPositionFor(token);
   const shipBaseKey = token.card().shipFaction.ship.shipBaseKey;

   // Run.
   const result = new ManeuverAction(store, token.id(), maneuverKey);

   // Verify.
   assert.equal(result.store(), store);
   assert.equal(result.tokenId(), token.id());
   assert.equal(result.maneuverKey(), maneuverKey);
   assert.equal(result.isBoost(), false);

   const resultPosition = result.fromPosition();
   assert.equal(resultPosition.x(), fromPosition.x());
   assert.equal(resultPosition.y(), fromPosition.y());
   assert.equal(resultPosition.heading(), fromPosition.heading());
   assert.equal(result.maneuver(), Maneuver.properties[maneuverKey]);
   assert.equal(result.shipBase(), ShipBase.properties[shipBaseKey]);
   assert.ok(result.token().equals(token));
});

QUnit.test("doIt() Straight1Easy", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing
   const fromPosition0 = environment.getPositionFor(token);
   const fromPosition = new Position(fromPosition0.x(), fromPosition0.y(), -30);
   environment.moveToken(fromPosition0, fromPosition);
   const maneuverKey = Maneuver.STRAIGHT_1_EASY;
   const maneuverAction = new ManeuverAction(store, token.id(), maneuverKey);

   // Run.
   maneuverAction.doIt();

   // Verify.
   const toPosition = environment.getPositionFor(token);
   assert.ok(toPosition);
   assert.equal(toPosition.x(), fromPosition.x() + 69);
   assert.equal(toPosition.y(), fromPosition.y() - 40);
   assert.equal(toPosition.heading(), 330);
});

QUnit.test("doIt() Straight3Standard", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing
   const fromPosition0 = environment.getPositionFor(token);
   const fromPosition = new Position(fromPosition0.x(), fromPosition0.y(), -30);
   environment.moveToken(fromPosition0, fromPosition);
   const maneuverKey = Maneuver.STRAIGHT_3_STANDARD;
   const maneuverAction = new ManeuverAction(store, token.id(), maneuverKey);

   // Run.
   maneuverAction.doIt();

   // Verify.
   const toPosition = environment.getPositionFor(token);
   assert.ok(toPosition);
   assert.equal(toPosition.x(), fromPosition.x() + 139);
   assert.equal(toPosition.y(), fromPosition.y() - 80);
   assert.equal(toPosition.heading(), 330);
});

QUnit.test("doIt() Straight3Standard collision", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const token0 = environment.pilotInstances()[0]; // TIE Fighter
   const fromPosition00 = environment.getPositionFor(token0);
   const token2 = environment.pilotInstances()[2]; // X-Wing
   const fromPosition20 = environment.getPositionFor(token2);
   const fromPosition2 = new Position(fromPosition20.x(), fromPosition20.y(), -30);
   environment.moveToken(fromPosition20, fromPosition2);

   // Move token0 to token2's planned toPosition.
   const fromPosition0 = new Position(fromPosition2.x() + 139, fromPosition2.y() - 80, 90);
   environment.moveToken(fromPosition00, fromPosition0);

   const maneuverKey = Maneuver.STRAIGHT_3_STANDARD;
   const maneuverAction = new ManeuverAction(store, token2.id(), maneuverKey);

   // Run.
   maneuverAction.doIt();

   // Verify.
   const toPosition = environment.getPositionFor(token2);
   assert.equal(toPosition.x(), fromPosition2.x() + 95);
   assert.equal(toPosition.y(), fromPosition2.y() - 55);
   assert.equal(toPosition.heading(), 330);
});

QUnit.test("doIt() IG-88C", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const agent = environment.pilotInstances()[2].agent(); // X-Wing
   const token = new CardInstance(environment.store(), PilotCard.IG_88C, agent);
   const position = new Position(450, 450, 0);
   store.dispatch(EnvironmentAction.placeToken(position, token));
   const maneuverKey = Maneuver.STRAIGHT_1_STANDARD;
   const isBoost = true;
   const maneuverAction = new ManeuverAction(store, token.id(), maneuverKey, isBoost);
   assert.equal(token.evadeCount(), 0);

   // Run.
   maneuverAction.doIt();

   // Verify.
   assert.equal(token.evadeCount(), 1);
});

QUnit.test("toString()", function(assert)
{
   // Setup.
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2];
   const maneuverKey = Maneuver.STRAIGHT_1_STANDARD;
   const isBoost = true;
   const maneuverAction = new ManeuverAction(store, token.id(), maneuverKey, isBoost);

   // Run.
   const result = maneuverAction.toString();

   // Verify.
   assert.ok(result);
   assert.equal(result, "ManeuverAction tokenId=37, maneuverKey=straight1Standard, isBoost?true, fromPosition=(458, 895, 270)");
});

const ManeuverActionTest = {};
export default ManeuverActionTest;