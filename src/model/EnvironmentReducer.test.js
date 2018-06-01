import CardType from "../artifact/CardType.js";
import DamageCard from "../artifact/DamageCard.js";
import PilotCard from "../artifact/PilotCard.js";
import PlayFormat from "../artifact/PlayFormat.js";

import Agent from "./Agent.js";
import CardInstance from "./CardInstance.js";
import EnvironmentAction from "./EnvironmentAction.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import Position from "./Position.js";
import Reducer from "./Reducer.js";
import SquadBuilder from "./SquadBuilder.js";

QUnit.module("EnvironmentReducer");

QUnit.test("addRound()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   assert.equal(store.getState().round, 0);

   // Run.
   store.dispatch(EnvironmentAction.addRound());

   // Verify.
   assert.equal(store.getState().round, 1);

   // Run.
   store.dispatch(EnvironmentAction.addRound(2));

   // Verify.
   assert.equal(store.getState().round, 3);
});

QUnit.test("addTouching()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var pilotInstance1 = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   var pilotInstance2 = new CardInstance(store, PilotCard.LUKE_SKYWALKER, new Agent(store, "Rebel"));
   assert.equal(store.getState().touching.size, 0);

   // Run.
   store.dispatch(EnvironmentAction.addTouching(pilotInstance1, pilotInstance2));

   // Verify.
   var touching = store.getState().touching;
   assert.equal(touching.size, 1);
   var touching0 = touching.get(0);
   assert.equal(touching0.get(0), pilotInstance1.id());
   assert.equal(touching0.get(1), pilotInstance2.id());
});

QUnit.test("discardDamage()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var damageDeck = CardInstance.keysToCardInstances(store, CardType.DAMAGE, DamageCard.createDeckV2());
   var damageDeckIds = CardInstance.cardInstancesToIds(damageDeck);
   store.dispatch(EnvironmentAction.setDamageDeck(damageDeckIds));
   var damage = damageDeck[0];
   store.dispatch(EnvironmentAction.drawDamage(damage));
   assert.equal(store.getState().damageDeck.size, 32);
   assert.equal(store.getState().damageDiscardPile.size, 0);

   // Run.
   store.dispatch(EnvironmentAction.discardDamage(damage));

   // Verify.
   assert.equal(store.getState().damageDeck.size, 32);
   assert.equal(store.getState().damageDiscardPile.size, 1);
});

QUnit.test("drawDamage()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var damageDeck = CardInstance.keysToCardInstances(store, CardType.DAMAGE, DamageCard.createDeckV2());
   var damageDeckIds = CardInstance.cardInstancesToIds(damageDeck);
   store.dispatch(EnvironmentAction.setDamageDeck(damageDeckIds));
   var damage = damageDeck[0];
   assert.equal(store.getState().damageDeck.size, 33);
   assert.equal(store.getState().damageDiscardPile.size, 0);

   // Run.
   store.dispatch(EnvironmentAction.drawDamage(damage));

   // Verify.
   assert.equal(store.getState().damageDeck.size, 32);
   assert.equal(store.getState().damageDiscardPile.size, 0);
});

QUnit.test("moveToken()", function(assert)
{
   // Setup.
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var store = environment.store();
   var token2 = environment.pilotInstances()[2];
   var fromPosition = environment.getPositionFor(token2);
   var toPosition = new Position(120, 220, 45);
   assert.equal(store.getState().positionToCardId.keySeq().size, 3);
   assert.equal(store.getState().cardPosition.keySeq().size, 3);
   assert.equal(store.getState().cardInstances.keySeq().size, 39);

   // Run.
   store.dispatch(EnvironmentAction.moveToken(fromPosition, toPosition));

   // Verify.
   assert.equal(store.getState().positionToCardId.keySeq().size, 3);
   assert.equal(store.getState().cardPosition.keySeq().size, 3);
   assert.equal(store.getState().cardInstances.keySeq().size, 39);

   var token22 = CardInstance.get(store, token2.id());
   assert.ok(token22.equals(token2));
   assert.equal(store.getState().cardPosition.get(token2.id()), toPosition);
});

QUnit.test("placeToken()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var position = new Position(100, 200, 45);
   var agent = new Agent(store, "Charlie");
   assert.equal(store.getState().positionToCardId.keySeq().size, 0);
   assert.equal(store.getState().cardPosition.keySeq().size, 0);
   assert.equal(store.getState().cardInstances.keySeq().size, 0);
   var token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent);

   // Run.
   store.dispatch(EnvironmentAction.placeToken(position, token));

   // Verify.
   assert.equal(store.getState().positionToCardId.keySeq().size, 1);
   assert.equal(store.getState().positionToCardId.get(position.toString()), token.id(), "positionToCardId.get(position) = " + store.getState().positionToCardId[position]);
   assert.equal(store.getState().cardPosition.keySeq().size, 1);
   assert.equal(store.getState().cardPosition.get(token.id()), position, "cardPosition[" + token.id() + "] = " + store.getState().cardPosition[token.id()]);
   assert.equal(store.getState().cardInstances.keySeq().size, 1);
});

QUnit.test("removeToken()", function(assert)
{
   // Setup.
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var store = environment.store();
   var token0 = environment.pilotInstances()[0];
   assert.equal(store.getState().positionToCardId.keySeq().size, 3);
   assert.equal(store.getState().cardPosition.keySeq().size, 3);
   assert.equal(store.getState().cardInstances.keySeq().size, 39);

   // Run.
   store.dispatch(EnvironmentAction.removeToken(token0));

   // Verify.
   assert.equal(store.getState().positionToCardId.keySeq().size, 2);
   assert.equal(store.getState().cardPosition.keySeq().size, 2);
   assert.equal(store.getState().cardInstances.keySeq().size, 38);
});

QUnit.test("removeTokenAt()", function(assert)
{
   // Setup.
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var store = environment.store();
   var token0 = environment.pilotInstances()[0];
   var position0 = environment.getPositionFor(token0);
   assert.equal(store.getState().positionToCardId.keySeq().size, 3);
   assert.equal(store.getState().cardPosition.keySeq().size, 3);
   assert.equal(store.getState().cardInstances.keySeq().size, 39);

   // Run.
   store.dispatch(EnvironmentAction.removeTokenAt(position0));

   // Verify.
   assert.equal(store.getState().positionToCardId.keySeq().size, 2);
   assert.equal(store.getState().cardPosition.keySeq().size, 2);
   assert.equal(store.getState().cardInstances.keySeq().size, 38);
});

QUnit.test("removeTouching()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var imperialAgent = new Agent(store, "Imperial");
   var pilotInstance1 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
   var pilotInstance2 = new CardInstance(store, PilotCard.LUKE_SKYWALKER, new Agent(store, "Rebel"));
   var pilotInstance3 = new CardInstance(store, PilotCard.HOWLRUNNER, imperialAgent);
   assert.equal(store.getState().touching.size, 0);
   store.dispatch(EnvironmentAction.addTouching(pilotInstance1, pilotInstance2));
   store.dispatch(EnvironmentAction.addTouching(pilotInstance2, pilotInstance3));
   store.dispatch(EnvironmentAction.addTouching(pilotInstance3, pilotInstance1));

   // Run.
   store.dispatch(EnvironmentAction.removeTouching(pilotInstance1));

   // Verify.
   var touching = store.getState().touching;
   assert.equal(touching.size, 1);
   var touching0 = touching.get(0);
   assert.equal(touching0.get(0), pilotInstance2.id());
   assert.equal(touching0.get(1), pilotInstance3.id());
});

QUnit.test("replenishDamageDeck()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var damageDeck = CardInstance.keysToCardInstances(store, CardType.DAMAGE, DamageCard.createDeckV2());
   var damageDeckIds = CardInstance.cardInstancesToIds(damageDeck);
   store.dispatch(EnvironmentAction.setDamageDeck(damageDeckIds));
   for (var i = 0; i < 33; i++)
   {
      var damage = CardInstance.get(store, store.getState().damageDeck.get(0));
      store.dispatch(EnvironmentAction.drawDamage(damage));
      store.dispatch(EnvironmentAction.discardDamage(damage));
   }
   assert.equal(store.getState().damageDeck.size, 0);
   assert.equal(store.getState().damageDiscardPile.size, 33);

   // Run.
   store.dispatch(EnvironmentAction.replenishDamageDeck());

   // Verify.
   assert.equal(store.getState().damageDeck.size, 33);
   assert.equal(store.getState().damageDiscardPile.size, 0);
});

QUnit.test("setActiveToken()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
   var token1 = new CardInstance(store, PilotCard.ROOKIE_PILOT, new Agent(store, "Rebel"));
   assert.ok(!store.getState().activeCardId);

   // Run.
   store.dispatch(EnvironmentAction.setActiveToken(token0));

   // Verify.
   assert.equal(store.getState().activeCardId, token0.id());

   // Run.
   store.dispatch(EnvironmentAction.setActiveToken(token1));

   // Verify.
   assert.equal(store.getState().activeCardId, token1.id());
});

QUnit.test("setDamageDeck()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   assert.equal(store.getState().damageDeck.size, 0);
   var damageDeck = CardInstance.keysToCardInstances(store, CardType.DAMAGE, DamageCard.createDeckV2());
   var damageDeckIds = CardInstance.cardInstancesToIds(damageDeck);

   // Run.
   store.dispatch(EnvironmentAction.setDamageDeck(damageDeckIds));

   // Verify.
   assert.equal(store.getState().damageDeck.size, 33);
});

QUnit.test("setFirstAgent()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var agent = new Agent(store, "Bob");
   assert.ok(!store.getState().firstAgent);

   // Run.
   store.dispatch(EnvironmentAction.setFirstAgent(agent));

   // Verify.
   assert.equal(store.getState().firstAgent, agent);
});

QUnit.test("setFirstSquad()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var agent = new Agent(store, "Bob");
   var squad = SquadBuilder.CoreSetImperialSquadBuilder.buildSquad(agent);
   assert.ok(!store.getState().firstSquad);

   // Run.
   store.dispatch(EnvironmentAction.setFirstSquad(squad));

   // Verify.
   assert.equal(store.getState().firstSquad, squad);
});

QUnit.test("setPlayAreaScale()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   assert.equal(store.getState().playAreaScale, 1.0);

   // Run.
   store.dispatch(EnvironmentAction.setPlayAreaScale(0.75));

   // Verify.
   assert.equal(store.getState().playAreaScale, 0.75);
});

QUnit.test("setPlayFormat()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   assert.equal(store.getState().playFormatKey, undefined);

   // Run.
   store.dispatch(EnvironmentAction.setPlayFormat(PlayFormat.STANDARD));

   // Verify.
   assert.equal(store.getState().playFormatKey, PlayFormat.STANDARD);

   // Run.
   store.dispatch(EnvironmentAction.setPlayFormat(PlayFormat.EPIC));

   // Verify.
   assert.equal(store.getState().playFormatKey, PlayFormat.EPIC);
});

QUnit.test("setSecondAgent()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var agent = new Agent(store, "Mike");
   assert.ok(!store.getState().secondAgent);

   // Run.
   store.dispatch(EnvironmentAction.setSecondAgent(agent));

   // Verify.
   assert.equal(store.getState().secondAgent, agent);
});

QUnit.test("setSecondSquad()", function(assert)
{
   // Setup.
   var store = Redux.createStore(Reducer.root);
   var agent = new Agent(store, "Mike");
   var squad = SquadBuilder.CoreSetRebelSquadBuilder.buildSquad(agent);
   assert.ok(!store.getState().secondSquad);

   // Run.
   store.dispatch(EnvironmentAction.setSecondSquad(squad));

   // Verify.
   assert.equal(store.getState().secondSquad, squad);
});

const EnvironmentReducerTest = {};
export default EnvironmentReducerTest;