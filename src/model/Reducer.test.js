import Event from "../artifact/Event.js";
import Maneuver from "../artifact/Maneuver.js";
import Phase from "../artifact/Phase.js";
import PilotCard from "../artifact/PilotCard.js";
import Range from "../artifact/Range.js";

import Action from "./Action.js";
import Agent from "./Agent.js";
import AttackDice from "./AttackDice.js";
import CardInstance from "./CardInstance.js";
import DefenseDice from "./DefenseDice.js";
import EnvironmentAction from "./EnvironmentAction.js";
import Position from "./Position.js";
import Reducer from "./Reducer.js";
import TargetLock from "./TargetLock.js";

QUnit.module("Reducer");

QUnit.test("addPilotToManeuver()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var pilotToManeuver = {};
   pilotToManeuver[1] = Maneuver.STRAIGHT_1_STANDARD;
   pilotToManeuver[2] = Maneuver.BANK_RIGHT_2_STANDARD;

   // Run.
   store.dispatch(Action.addPilotToManeuver(pilotToManeuver));

   // Verify.
   var result = store.getState().pilotToManeuver;
   assert.ok(result);
   assert.equal(result.get("1"), Maneuver.STRAIGHT_1_STANDARD);
   assert.equal(result.get("2"), Maneuver.BANK_RIGHT_2_STANDARD);
});

QUnit.test("addTargetLock()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var agent0 = new Agent(store, "Alpha");
   var attacker = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent0);
   var agent1 = new Agent(store, "Bravo");
   var defender = new CardInstance(store, PilotCard.ACADEMY_PILOT, agent1);
   assert.equal(store.getState().targetLocks.size, 0);
   var targetLock = Immutable.Map(
   {
      attackerId: attacker.id(),
      defenderId: defender.id(),
      id: "A",
   });

   // Run.
   store.dispatch(Action.addTargetLock(targetLock));

   // Verify.
   assert.equal(store.getState().targetLocks.size, 1);
   assert.equal(store.getState().targetLocks.get(0).get("id"), "A");
   assert.equal(store.getState().targetLocks.get(0).get("attackerId"), attacker.id());
   assert.equal(store.getState().targetLocks.get(0).get("defenderId"), defender.id());
});

QUnit.test("dequeueEvent()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var agent = new Agent(store, "Rebel");
   var token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent);
   store.dispatch(EnvironmentAction.placeToken(new Position(100, 200, 45), token));
   var token2 = new CardInstance(store, PilotCard.BIGGS_DARKLIGHTER, agent);
   store.dispatch(EnvironmentAction.placeToken(new Position(200, 200, 45), token2));

   store.dispatch(Action.enqueueEvent(Event.AFTER_EXECUTE_MANEUVER, token));
   store.dispatch(Action.enqueueEvent(Event.SHIP_ACTION_PERFORMED, token2));

   assert.equal(store.getState().eventQueue.size, 2);
   var eventData0 = store.getState().eventQueue.get(0);
   assert.ok(eventData0);
   assert.equal(eventData0.get("eventKey"), Event.AFTER_EXECUTE_MANEUVER);
   assert.equal(eventData0.get("eventToken"), token);
   var eventData1 = store.getState().eventQueue.get(1);
   assert.ok(eventData1);
   assert.equal(eventData1.get("eventKey"), Event.SHIP_ACTION_PERFORMED);
   assert.equal(eventData1.get("eventToken"), token2);

   // Run.
   store.dispatch(Action.dequeueEvent());

   // Verify.
   assert.equal(store.getState().eventQueue.size, 1);
   eventData0 = store.getState().eventQueue.get(0);
   assert.ok(eventData0);
   assert.equal(eventData0.get("eventKey"), Event.SHIP_ACTION_PERFORMED);
   assert.equal(eventData0.get("eventToken"), token2);

   // Run.
   store.dispatch(Action.dequeueEvent());

   // Verify.
   assert.equal(store.getState().eventQueue.size, 0);
});

QUnit.test("dequeuePhase()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var agent = new Agent(store, "Rebel");
   var token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent);
   store.dispatch(EnvironmentAction.placeToken(new Position(100, 200, 45), token));
   var token2 = new CardInstance(store, PilotCard.BIGGS_DARKLIGHTER, agent);
   store.dispatch(EnvironmentAction.placeToken(new Position(200, 200, 45), token2));

   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_REVEAL_DIAL, token));
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_EXECUTE_MANEUVER, token2));

   assert.equal(store.getState().phaseQueue.size, 2);
   var phaseData0 = store.getState().phaseQueue.get(0);
   assert.ok(phaseData0);
   assert.equal(phaseData0.get("phaseKey"), Phase.ACTIVATION_REVEAL_DIAL);
   assert.equal(phaseData0.get("phaseToken"), token);
   var phaseData1 = store.getState().phaseQueue.get(1);
   assert.ok(phaseData1);
   assert.equal(phaseData1.get("phaseKey"), Phase.ACTIVATION_EXECUTE_MANEUVER);
   assert.equal(phaseData1.get("phaseToken"), token2);

   // Run.
   store.dispatch(Action.dequeuePhase());

   // Verify.
   assert.equal(store.getState().phaseQueue.size, 1);
   phaseData0 = store.getState().phaseQueue.get(0);
   assert.ok(phaseData0);
   assert.equal(phaseData0.get("phaseKey"), Phase.ACTIVATION_EXECUTE_MANEUVER);
   assert.equal(phaseData0.get("phaseToken"), token2);

   // Run.
   store.dispatch(Action.dequeuePhase());

   // Verify.
   assert.equal(store.getState().phaseQueue.size, 0);
});

QUnit.test("enqueueEvent()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var agent = new Agent(store, "Rebel");
   var token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent);
   store.dispatch(EnvironmentAction.placeToken(new Position(100, 200, 45), token));
   assert.equal(store.getState().eventQueue.size, 0);

   // Run.
   store.dispatch(Action.enqueueEvent(Event.AFTER_EXECUTE_MANEUVER, token));

   // Verify.
   assert.equal(store.getState().eventQueue.size, 1);
   var eventData0 = store.getState().eventQueue.get(0);
   assert.ok(eventData0);
   assert.equal(eventData0.get("eventKey"), Event.AFTER_EXECUTE_MANEUVER);
   assert.equal(eventData0.get("eventToken"), token);

   // Run.
   var token2 = new CardInstance(store, PilotCard.BIGGS_DARKLIGHTER, agent);
   store.dispatch(EnvironmentAction.placeToken(new Position(200, 200, 45), token2));
   store.dispatch(Action.enqueueEvent(Event.SHIP_ACTION_PERFORMED, token2));

   // Verify.
   assert.equal(store.getState().eventQueue.size, 2);
   eventData0 = store.getState().eventQueue.get(0);
   assert.ok(eventData0);
   assert.equal(eventData0.get("eventKey"), Event.AFTER_EXECUTE_MANEUVER);
   assert.equal(eventData0.get("eventToken"), token);
   var eventData1 = store.getState().eventQueue.get(1);
   assert.ok(eventData1);
   assert.equal(eventData1.get("eventKey"), Event.SHIP_ACTION_PERFORMED);
   assert.equal(eventData1.get("eventToken"), token2);
});

QUnit.test("enqueuePhase()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var agent = new Agent(store, "Rebel");
   var token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent);
   store.dispatch(EnvironmentAction.placeToken(new Position(100, 200, 45), token));
   assert.equal(store.getState().phaseQueue.size, 0);

   // Run.
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_REVEAL_DIAL, token));

   // Verify.
   assert.equal(store.getState().phaseQueue.size, 1);
   var phaseData0 = store.getState().phaseQueue.get(0);
   assert.ok(phaseData0);
   assert.equal(phaseData0.get("phaseKey"), Phase.ACTIVATION_REVEAL_DIAL);
   assert.equal(phaseData0.get("phaseToken"), token);

   // Run.
   var token2 = new CardInstance(store, PilotCard.BIGGS_DARKLIGHTER, agent);
   store.dispatch(EnvironmentAction.placeToken(new Position(200, 200, 45), token2));
   store.dispatch(Action.enqueuePhase(Phase.ACTIVATION_EXECUTE_MANEUVER, token2));

   // Verify.
   assert.equal(store.getState().phaseQueue.size, 2);
   phaseData0 = store.getState().phaseQueue.get(0);
   assert.ok(phaseData0);
   assert.equal(phaseData0.get("phaseKey"), Phase.ACTIVATION_REVEAL_DIAL);
   assert.equal(phaseData0.get("phaseToken"), token);
   var phaseData1 = store.getState().phaseQueue.get(1);
   assert.ok(phaseData1);
   assert.equal(phaseData1.get("phaseKey"), Phase.ACTIVATION_EXECUTE_MANEUVER);
   assert.equal(phaseData1.get("phaseToken"), token2);
});

QUnit.test("incrementNextTargetLockId()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   assert.equal(store.getState().nextTargetLockId, 0);

   // Run.
   store.dispatch(Action.incrementNextTargetLockId());

   // Verify.
   assert.equal(store.getState().nextTargetLockId, 1);

   // Run.
   store.dispatch(Action.incrementNextTargetLockId());

   // Verify.
   assert.equal(store.getState().nextTargetLockId, 2);

   for (var i = 3; i < 52; i++)
   {
      store.dispatch(Action.incrementNextTargetLockId());
   }

   assert.equal(store.getState().nextTargetLockId, 51);

   // Run.
   store.dispatch(Action.incrementNextTargetLockId());

   // Verify.
   assert.equal(store.getState().nextTargetLockId, 0);
});

QUnit.test("removeTargetLock()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var agent0 = new Agent(store, "Alpha");
   var attacker = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent0);
   var agent1 = new Agent(store, "Bravo");
   var defender = new CardInstance(store, PilotCard.ACADEMY_PILOT, agent1);
   var targetLock = TargetLock.newInstance(store, attacker, defender);
   //  store.dispatch(Action.addTargetLock(targetLock));
   assert.equal(store.getState().targetLocks.size, 1);
   assert.equal(store.getState().targetLocks.get(0).get("id"), "A");
   assert.equal(store.getState().targetLocks.get(0).get("attackerId"), attacker.id());
   assert.equal(store.getState().targetLocks.get(0).get("defenderId"), defender.id());

   // Run.
   //  store.dispatch(Action.removeTargetLock(targetLock));
   targetLock.delete();

   // Verify.
   assert.equal(store.getState().targetLocks.size, 0);
});

QUnit.test("setTokenActivationAction()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   var activationAction = {};
   assert.ok(!store.getState().cardActivationAction.get(token.id()));

   // Run.
   store.dispatch(Action.setTokenActivationAction(token.id(), activationAction));

   // Verify.
   assert.ok(store.getState().cardActivationAction.get(token.id()));
   assert.equal(store.getState().cardActivationAction.get(token.id()), activationAction);
});

QUnit.test("setTokenAttackDice()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   assert.ok(store.getState().cardAttackDice.get(token.id()) === undefined);
   var attackDice = new AttackDice(store, token.id(), 3);

   // Run.
   store.dispatch(Action.setTokenAttackDice(token.id(), attackDice.values()));

   // Verify.
   var result = store.getState().cardAttackDice.get(token.id());
   assert.ok(result);
   var results = result.toJS();
   var values = attackDice.values();
   assert.equal(results.length, values.length);
   for (var i = 0; i < values.length; i++)
   {
      assert.equal(results[i], values[i]);
   }
});

QUnit.test("setTokenCombatAction()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   var combatAction = {};
   assert.ok(!store.getState().cardCombatAction.get(token.id()));

   // Run.
   store.dispatch(Action.setTokenCombatAction(token, combatAction));

   // Verify.
   assert.ok(store.getState().cardCombatAction.get(token.id()));
   assert.equal(store.getState().cardCombatAction.get(token.id()), combatAction);
});

QUnit.test("setTokenDamageDealer()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   var damageDealer = {};
   assert.ok(!store.getState().cardDamageDealer.get(token.id()));

   // Run.
   store.dispatch(Action.setTokenDamageDealer(token, damageDealer));

   // Verify.
   assert.ok(store.getState().cardDamageDealer.get(token.id()));
   assert.equal(store.getState().cardDamageDealer.get(token.id()), damageDealer);
});

QUnit.test("setTokenDefenderHit()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   assert.ok(!store.getState().cardIsDefenderHit.get(token.id()));

   // Run.
   store.dispatch(Action.setTokenDefenderHit(token, true));

   // Verify.
   assert.equal(store.getState().cardIsDefenderHit.get(token.id()), true);

   // Run.
   store.dispatch(Action.setTokenDefenderHit(token, false));

   // Verify.
   assert.equal(store.getState().cardIsDefenderHit.get(token.id()), false);
});

QUnit.test("setTokenDefenseDice()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   assert.ok(store.getState().cardDefenseDice.get(token.id()) === undefined);
   var defenseDice = new DefenseDice(store, token.id(), 3);

   // Run.
   store.dispatch(Action.setTokenDefenseDice(token.id(), defenseDice.values()));

   // Verify.
   var result = store.getState().cardDefenseDice.get(token.id());
   assert.ok(result);
   var results = result.toJS();
   var values = defenseDice.values();
   assert.equal(results.length, values.length);
   for (var i = 0; i < values.length; i++)
   {
      assert.equal(results[i], values[i]);
   }
});

QUnit.test("setTokenInFiringArc()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   assert.ok(!store.getState().cardIsInFiringArc.get(token.id()));

   // Run.
   store.dispatch(Action.setTokenInFiringArc(token, true));

   // Verify.
   assert.equal(store.getState().cardIsInFiringArc.get(token.id()), true);

   // Run.
   store.dispatch(Action.setTokenInFiringArc(token, false));

   // Verify.
   assert.equal(store.getState().cardIsInFiringArc.get(token.id()), false);
});

QUnit.test("setTokenManeuver()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   var maneuverKey0 = Maneuver.STRAIGHT_1_STANDARD;
   var maneuverKey1 = Maneuver.BANK_RIGHT_2_STANDARD;
   assert.ok(!store.getState().cardManeuver[token.id()]);

   // Run.
   var maneuver0 = Maneuver.properties[maneuverKey0];
   store.dispatch(Action.setTokenManeuver(token, maneuver0));

   // Verify.
   assert.ok(store.getState().cardManeuver.get(token.id()));
   assert.equal(store.getState().cardManeuver.get(token.id()), maneuver0);

   // Run.
   var maneuver1 = Maneuver.properties[maneuverKey1];
   store.dispatch(Action.setTokenManeuver(token, maneuver1));

   // Verify.
   assert.ok(store.getState().cardManeuver.get(token.id()));
   assert.equal(store.getState().cardManeuver.get(token.id()), maneuver1);
});

QUnit.test("setTokenManeuverAction()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   var maneuverAction = {};
   assert.ok(!store.getState().cardManeuverAction.get(token.id()));

   // Run.
   store.dispatch(Action.setTokenManeuverAction(token.id(), maneuverAction));

   // Verify.
   assert.ok(store.getState().cardManeuverAction.get(token.id()));
   assert.equal(store.getState().cardManeuverAction.get(token.id()), maneuverAction);
});

QUnit.test("setTokenRange()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   var rangeKey = Range.TWO;
   assert.ok(!store.getState().cardRange.get(token.id()));

   // Run.
   store.dispatch(Action.setTokenRange(token, rangeKey));

   // Verify.
   assert.ok(store.getState().cardRange.get(token.id()));
   assert.equal(store.getState().cardRange.get(token.id()), rangeKey);
});

QUnit.test("setUserMessage()", function(assert)
{
   // Setup.
   var userMessage = "This is an important message!";
   var store = Redux.createStore(Reducer.root);
   assert.ok(!store.getState().userMessage);

   // Run.
   store.dispatch(Action.setUserMessage(userMessage));

   // Verify.
   assert.equal(store.getState().userMessage, userMessage);
});

const ReducerTest = {};
export default ReducerTest;