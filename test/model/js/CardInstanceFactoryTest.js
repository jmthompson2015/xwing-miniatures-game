"use strict";

define(["qunit", "redux",
  "artifact/js/Faction", "artifact/js/PilotCard", "artifact/js/UpgradeCard",
  "model/js/Agent", "model/js/CardInstance", "model/js/CardInstanceFactory", "model/js/DualCardInstance", "model/js/Reducer"],
   function(QUnit, Redux,
      Faction, PilotCard, UpgradeCard,
      Agent, CardInstance, CardInstanceFactory, DualCardInstance, Reducer)
   {
      QUnit.module("CardInstanceFactory");

      QUnit.test("create() Academy Pilot", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var pilotKey = PilotCard.ACADEMY_PILOT;
         var agent = new Agent(store, "Imperial Agent");

         // Run.
         var result = CardInstanceFactory.create(store, pilotKey, agent, [UpgradeCard.MARKSMANSHIP]);

         // Verify.
         assert.ok(result);
         assert.ok(result instanceof CardInstance);
         assert.equal(result.card().key, pilotKey);
         assert.equal(result.agent(), agent);
         assert.ok(result.upgradeKeys());
         assert.equal(result.upgradeKeys().size, 1);
      });

      QUnit.test("create() CR90 Corvette", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var pilotKey = PilotCard.CR90_CORVETTE;
         var agent = new Agent(store, "Rebel Agent");

         // Run.
         var result = CardInstanceFactory.create(store, pilotKey, agent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);

         // Verify.
         assert.ok(result);
         assert.ok(result instanceof DualCardInstance);
         assert.equal(result.card().key, pilotKey);
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
         var agent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, pilotKey, agent, [UpgradeCard.MARKSMANSHIP]);

         // Run.
         var result = CardInstanceFactory.get(store, token.id());

         // Verify.
         assert.ok(result);
         assert.ok(result instanceof CardInstance);
         assert.equal(result.card().key, pilotKey);
         assert.equal(result.agent(), agent);
         assert.ok(result.upgradeKeys());
         assert.equal(result.upgradeKeys().size, 1);
      });

      QUnit.test("get() CR90 Corvette", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var pilotKey = PilotCard.CR90_CORVETTE;
         var agent = new Agent(store, "Rebel Agent");
         var token = new DualCardInstance(store, pilotKey, agent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);

         // Run.
         var result = CardInstanceFactory.get(store, token.id());

         // Verify.
         assert.ok(result);
         assert.ok(result instanceof DualCardInstance);
         assert.equal(result.card().key, pilotKey);
         assert.equal(result.agent(), agent);
         assert.ok(result.tokenFore().upgradeKeys());
         assert.equal(result.tokenFore().upgradeKeys().size, 3);
         assert.ok(result.tokenAft().upgradeKeys());
         assert.equal(result.tokenAft().upgradeKeys().size, 1);
      });
   });
