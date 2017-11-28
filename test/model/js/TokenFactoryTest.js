"use strict";

define(["qunit", "redux",
  "artifact/js/Faction", "artifact/js/PilotCard", "model/js/SimpleAgent", "artifact/js/UpgradeCard",
  "model/js/Agent", "model/js/DualToken", "model/js/Reducer", "model/js/Token", "model/js/TokenFactory"],
   function(QUnit, Redux,
      Faction, PilotCard, SimpleAgent, UpgradeCard,
      Agent, DualToken, Reducer, Token, TokenFactory)
   {
      QUnit.module("TokenFactory");

      QUnit.test("create() Academy Pilot", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var pilotKey = PilotCard.ACADEMY_PILOT;
         var agent = new Agent(store, "Imperial Agent", Faction.IMPERIAL);

         // Run.
         var result = TokenFactory.create(store, pilotKey, agent, [UpgradeCard.MARKSMANSHIP]);

         // Verify.
         assert.ok(result);
         assert.ok(result instanceof Token);
         assert.equal(result.pilotKey(), pilotKey);
         assert.equal(result.agent(), agent);
         assert.ok(result.upgradeKeys());
         assert.equal(result.upgradeKeys().size, 1);
      });

      QUnit.test("create() CR90 Corvette", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var pilotKey = PilotCard.CR90_CORVETTE;
         var agent = new Agent(store, "Rebel Agent", Faction.REBEL);

         // Run.
         var result = TokenFactory.create(store, pilotKey, agent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);

         // Verify.
         assert.ok(result);
         assert.ok(result instanceof DualToken);
         assert.equal(result.pilotKey(), pilotKey);
         assert.equal(result.agent(), agent);
         assert.ok(result.tokenFore().upgradeKeys());
         assert.equal(result.tokenFore().upgradeKeys().size, 3);
         assert.ok(result.tokenAft().upgradeKeys());
         assert.equal(result.tokenAft().upgradeKeys().size, 1);
      });

      QUnit.test("get() Academy Pilot", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var pilotKey = PilotCard.ACADEMY_PILOT;
         var agent = new Agent(store, "Imperial Agent", Faction.IMPERIAL);
         var token = new Token(store, pilotKey, agent, [UpgradeCard.MARKSMANSHIP]);

         // Run.
         var result = TokenFactory.get(store, token.id());

         // Verify.
         assert.ok(result);
         assert.ok(result instanceof Token);
         assert.equal(result.pilotKey(), pilotKey);
         assert.equal(result.agent(), agent);
         assert.ok(result.upgradeKeys());
         assert.equal(result.upgradeKeys().size, 1);
      });

      QUnit.test("get() CR90 Corvette", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var pilotKey = PilotCard.CR90_CORVETTE;
         var agent = new Agent(store, "Rebel Agent", Faction.REBEL);
         var token = new DualToken(store, pilotKey, agent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);

         // Run.
         var result = TokenFactory.get(store, token.id());

         // Verify.
         assert.ok(result);
         assert.ok(result instanceof DualToken);
         assert.equal(result.pilotKey(), pilotKey);
         assert.equal(result.agent(), agent);
         assert.ok(result.tokenFore().upgradeKeys());
         assert.equal(result.tokenFore().upgradeKeys().size, 3);
         assert.ok(result.tokenAft().upgradeKeys());
         assert.equal(result.tokenAft().upgradeKeys().size, 1);
      });
   });
