"use strict";

define(["qunit", "redux",
  "artifact/js/DamageCard", "artifact/js/PilotCard", "artifact/js/PlayFormat", "artifact/js/Faction",
  "model/js/Agent", "model/js/EnvironmentAction", "model/js/Position", "model/js/Reducer", "model/js/SimpleAgent", "model/js/SquadBuilder", "model/js/Token",
  "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Redux,
      DamageCard, PilotCard, PlayFormat, Faction,
      Agent, EnvironmentAction, Position, Reducer, SimpleAgent, SquadBuilder, Token, EnvironmentFactory)
   {
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

      QUnit.test("discardDamage()", function(assert)
      {
         // Setup.
         var damageDeck = DamageCard.createDeckV2();
         var store = Redux.createStore(Reducer.root);
         store.dispatch(EnvironmentAction.setDamageDeck(damageDeck));
         var damage = damageDeck[0];
         store.dispatch(EnvironmentAction.drawDamage(damage));
         assert.equal(store.getState().damageDeck.length, 32);
         assert.equal(store.getState().damageDiscardPile.length, 0);

         // Run.
         store.dispatch(EnvironmentAction.discardDamage(damage));

         // Verify.
         assert.equal(store.getState().damageDeck.length, 32);
         assert.equal(store.getState().damageDiscardPile.length, 1);
      });

      QUnit.test("drawDamage()", function(assert)
      {
         // Setup.
         var damageDeck = DamageCard.createDeckV2();
         var store = Redux.createStore(Reducer.root);
         store.dispatch(EnvironmentAction.setDamageDeck(damageDeck));
         var damage = damageDeck[0];
         assert.equal(store.getState().damageDeck.length, 33);
         assert.equal(store.getState().damageDiscardPile.length, 0);

         // Run.
         store.dispatch(EnvironmentAction.drawDamage(damage));

         // Verify.
         assert.equal(store.getState().damageDeck.length, 32);
         assert.equal(store.getState().damageDiscardPile.length, 0);
      });

      QUnit.test("moveToken()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var token2 = environment.tokens()[2];
         var fromPosition = environment.getPositionFor(token2);
         var toPosition = new Position(120, 220, 45);
         assert.equal(Object.keys(store.getState().positionToTokenId).length, 3);
         assert.equal(Object.keys(store.getState().tokenIdToPosition).length, 3);
         assert.equal(store.getState().tokens.keySeq().size, 3);

         // Run.
         store.dispatch(EnvironmentAction.moveToken(fromPosition, toPosition));

         // Verify.
         assert.equal(Object.keys(store.getState().positionToTokenId).length, 3);
         assert.equal(Object.keys(store.getState().tokenIdToPosition).length, 3);
         assert.equal(store.getState().tokens.keySeq().size, 3);

         var token22 = Token.get(store, token2.id());
         assert.ok(token22.equals(token2));
         assert.equal(store.getState().tokenIdToPosition[token2.id()], toPosition);
      });

      QUnit.test("placeToken()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var position = new Position(100, 200, 45);
         var agent = new Agent(store, "Charlie", Faction.REBEL);
         assert.equal(Object.keys(store.getState().positionToTokenId).length, 0);
         assert.equal(Object.keys(store.getState().tokenIdToPosition).length, 0);
         assert.equal(store.getState().tokens.keySeq().size, 0);
         var token = new Token(store, PilotCard.LUKE_SKYWALKER, agent);

         // Run.
         store.dispatch(EnvironmentAction.placeToken(position, token));

         // Verify.
         assert.equal(Object.keys(store.getState().positionToTokenId).length, 1);
         assert.equal(store.getState().positionToTokenId[position], token.id(), "positionToTokenId[position] = " + store.getState().positionToTokenId[position]);
         assert.equal(Object.keys(store.getState().tokenIdToPosition).length, 1);
         assert.equal(store.getState().tokenIdToPosition[token.id()], position, "tokenIdToPosition[" + token.id() + "] = " + store.getState().tokenIdToPosition[token.id()]);
         assert.equal(store.getState().tokens.keySeq().size, 1);
      });

      QUnit.test("removeToken()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var token0 = environment.tokens()[0];
         assert.equal(Object.keys(store.getState().positionToTokenId).length, 3);
         assert.equal(Object.keys(store.getState().tokenIdToPosition).length, 3);
         assert.equal(store.getState().tokens.keySeq().size, 3);

         // Run.
         store.dispatch(EnvironmentAction.removeToken(token0));

         // Verify.
         assert.equal(Object.keys(store.getState().positionToTokenId).length, 2);
         assert.equal(Object.keys(store.getState().tokenIdToPosition).length, 2);
         assert.equal(store.getState().tokens.keySeq().size, 2);
      });

      QUnit.test("removeTokenAt()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var token0 = environment.tokens()[0];
         var position0 = environment.getPositionFor(token0);
         assert.equal(Object.keys(store.getState().positionToTokenId).length, 3);
         assert.equal(Object.keys(store.getState().tokenIdToPosition).length, 3);
         assert.equal(store.getState().tokens.keySeq().size, 3);

         // Run.
         store.dispatch(EnvironmentAction.removeTokenAt(position0));

         // Verify.
         assert.equal(Object.keys(store.getState().positionToTokenId).length, 2);
         assert.equal(Object.keys(store.getState().tokenIdToPosition).length, 2);
         assert.equal(store.getState().tokens.keySeq().size, 2);
      });

      QUnit.test("replenishDamageDeck()", function(assert)
      {
         // Setup.
         var damageDeck = DamageCard.createDeckV2();
         var store = Redux.createStore(Reducer.root);
         store.dispatch(EnvironmentAction.setDamageDeck(damageDeck));
         for (var i = 0; i < 33; i++)
         {
            var damage = store.getState().damageDeck[0];
            store.dispatch(EnvironmentAction.drawDamage(damage));
            store.dispatch(EnvironmentAction.discardDamage(damage));
         }
         assert.equal(store.getState().damageDeck.length, 0);
         assert.equal(store.getState().damageDiscardPile.length, 33);

         // Run.
         store.dispatch(EnvironmentAction.replenishDamageDeck());

         // Verify.
         assert.equal(store.getState().damageDeck.length, 33);
         assert.equal(store.getState().damageDiscardPile.length, 0);
      });

      QUnit.test("setActiveToken()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token0 = new Token(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         var token1 = new Token(store, PilotCard.ROOKIE_PILOT, new Agent(store, "Rebel", Faction.REBEL));
         assert.ok(!store.getState().activeTokenId);

         // Run.
         store.dispatch(EnvironmentAction.setActiveToken(token0));

         // Verify.
         assert.equal(store.getState().activeTokenId, token0.id());

         // Run.
         store.dispatch(EnvironmentAction.setActiveToken(token1));

         // Verify.
         assert.equal(store.getState().activeTokenId, token1.id());
      });

      QUnit.test("setDamageDeck()", function(assert)
      {
         // Setup.
         var damageDeck = DamageCard.createDeckV2();
         var store = Redux.createStore(Reducer.root);
         assert.equal(store.getState().damageDeck.length, 0);

         // Run.
         store.dispatch(EnvironmentAction.setDamageDeck(damageDeck));

         // Verify.
         assert.equal(store.getState().damageDeck.length, 33);
         assert.equal(store.getState().damageDeck[0], damageDeck[0]);
      });

      QUnit.test("setFirstAgent()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "Bob", Faction.IMPERIAL);
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
         var agent = new Agent(store, "Bob", Faction.IMPERIAL);
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
         var agent = new Agent(store, "Mike", Faction.REBEL);
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
         var agent = new Agent(store, "Mike", Faction.REBEL);
         var squad = SquadBuilder.CoreSetRebelSquadBuilder.buildSquad(agent);
         assert.ok(!store.getState().secondSquad);

         // Run.
         store.dispatch(EnvironmentAction.setSecondSquad(squad));

         // Verify.
         assert.equal(store.getState().secondSquad, squad);
      });

      QUnit.test("setTokenTouching()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new Token(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         assert.ok(!store.getState().tokenIdToIsTouching[token.id()]);

         // Run.
         store.dispatch(EnvironmentAction.setTokenTouching(token, true));

         // Verify.
         assert.equal(store.getState().tokenIdToIsTouching[token.id()], true);

         // Run.
         store.dispatch(EnvironmentAction.setTokenTouching(token, false));

         // Verify.
         assert.equal(store.getState().tokenIdToIsTouching[token.id()], false);
      });
   });
