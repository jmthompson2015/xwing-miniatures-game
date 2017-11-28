"use strict";

define(["qunit", "redux",
  "artifact/js/DamageCard", "artifact/js/Faction", "artifact/js/PilotCard", "artifact/js/Ship", "artifact/js/UpgradeCard", "artifact/js/Value",
  "model/js/Agent", "model/js/DualCardInstance",  "model/js/Reducer"],
   function(QUnit, Redux,
      DamageCard, Faction, PilotCard, Ship, UpgradeCard, Value,
      Agent, DualCardInstance, Reducer)
   {
      QUnit.module("DualCardInstance");

      QUnit.test("DualCardInstance properties CR90 Corvette", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var inputAreaId = "firstPilotCardInputArea";
         var iconBase = "../resources/icons/";
         var imageBase = "../resources/images/";
         var rebelAgent = new Agent(store, "Rebel Agent", Faction.REBEL, inputAreaId, iconBase, imageBase);
         var token = new DualCardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);
         assert.equal(token.id(), 1);
         assert.equal(token.pilotKey(), PilotCard.CR90_CORVETTE);
         assert.equal(token.pilot().shipFaction.shipKey, Ship.CR90_CORVETTE);
         assert.equal(token.name(), "1 CR90 Corvette");

         var tokenFore = token.tokenFore();
         assert.ok(tokenFore);
         assert.equal(tokenFore.name(), "2 CR90 Corvette (fore)");
         assert.equal(tokenFore.upgradeKeys().size, 3);
         assert.equal(tokenFore.secondaryWeapons().size, 1);
         var weapon = tokenFore.secondaryWeapons().get(0);
         assert.ok(weapon);
         assert.equal(weapon.upgradeKey(), UpgradeCard.QUAD_LASER_CANNONS);

         var tokenAft = token.tokenAft();
         assert.ok(tokenAft);
         assert.equal(tokenAft.name(), "3 CR90 Corvette (aft)");
         assert.equal(tokenAft.upgradeKeys().size, 1);
         assert.equal(tokenAft.secondaryWeapons().size, 0);
      });

      QUnit.test("isDestroyed()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var inputAreaId = "firstPilotCardInputArea";
         var iconBase = "../resources/icons/";
         var imageBase = "../resources/images/";
         var rebelAgent = new Agent(store, "Rebel Agent", Faction.REBEL, inputAreaId, iconBase, imageBase);
         var token = new DualCardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);
         var tokenFore = token.tokenFore();
         var i;
         for (i = 0; i < tokenFore.hullValue() - 1; i++)
         {
            tokenFore.receiveDamage(DamageCard.DAMAGED_COCKPIT);
         }
         var tokenAft = token.tokenAft();
         for (i = 0; i < tokenAft.hullValue() - 1; i++)
         {
            tokenAft.receiveDamage(DamageCard.DAMAGED_COCKPIT);
         }
         assert.ok(!token.isDestroyed());

         // Run / Verify.
         tokenFore.receiveDamage(DamageCard.DAMAGED_COCKPIT);
         assert.ok(!token.isDestroyed());
         tokenAft.receiveDamage(DamageCard.DAMAGED_COCKPIT);
         assert.ok(token.isDestroyed());
      });

      QUnit.test("shipState() CR90 Corvette", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "name", Faction.REBEL);
         var token = new DualCardInstance(store, PilotCard.CR90_CORVETTE, agent);

         // Run / Verify.
         assert.equal(token.tokenFore().shipState(Value.PILOT_SKILL), 4);
         assert.equal(token.tokenFore().shipState(Value.PRIMARY_WEAPON), 4);
         assert.equal(token.tokenFore().shipState(Value.ENERGY), undefined);
         assert.equal(token.tokenFore().shipState(Value.AGILITY), 0);
         assert.equal(token.tokenFore().shipState(Value.HULL), 8);
         assert.equal(token.tokenFore().shipState(Value.SHIELD), 5);

         assert.equal(token.tokenAft().shipState(Value.PILOT_SKILL), 4);
         assert.equal(token.tokenAft().shipState(Value.PRIMARY_WEAPON), undefined);
         assert.equal(token.tokenAft().shipState(Value.ENERGY), 5);
         assert.equal(token.tokenAft().shipState(Value.AGILITY), 0);
         assert.equal(token.tokenAft().shipState(Value.HULL), 8);
         assert.equal(token.tokenAft().shipState(Value.SHIELD), 3);
      });

      QUnit.test("tokenAft()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var inputAreaId = "firstPilotCardInputArea";
         var iconBase = "../resources/icons/";
         var imageBase = "../resources/images/";
         var rebelAgent = new Agent(store, "Rebel Agent", Faction.REBEL, inputAreaId, iconBase, imageBase);
         var token = new DualCardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);

         // Run.
         var result = token.tokenAft();

         // Verify.
         assert.ok(result);
         assert.equal(result.pilot().key, "cr90Corvette.aft");
      });

      QUnit.test("tokenAft() crippled", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var inputAreaId = "firstPilotCardInputArea";
         var iconBase = "../resources/icons/";
         var imageBase = "../resources/images/";
         var rebelAgent = new Agent(store, "Rebel Agent", Faction.REBEL, inputAreaId, iconBase, imageBase);
         var token = new DualCardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);
         var tokenAft = token.tokenAft();
         for (var i = 0; i < tokenAft.hullValue(); i++)
         {
            token.tokenAft().receiveDamage(DamageCard.BLINDED_PILOT);
         }
         assert.ok(tokenAft.isDestroyed());

         // Run.
         var result = token.tokenAft();

         // Verify.
         assert.ok(result);
         assert.equal(result.pilot().key, "cr90Corvette.crippledAft");
      });

      QUnit.test("tokenFore()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var inputAreaId = "firstPilotCardInputArea";
         var iconBase = "../resources/icons/";
         var imageBase = "../resources/images/";
         var rebelAgent = new Agent(store, "Rebel Agent", Faction.REBEL, inputAreaId, iconBase, imageBase);
         var token = new DualCardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);

         // Run.
         var result = token.tokenFore();

         // Verify.
         assert.ok(result);
         assert.equal(result.pilot().key, "cr90Corvette.fore");
      });

      QUnit.test("tokenFore() crippled", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var inputAreaId = "firstPilotCardInputArea";
         var iconBase = "../resources/icons/";
         var imageBase = "../resources/images/";
         var rebelAgent = new Agent(store, "Rebel Agent", Faction.REBEL, inputAreaId, iconBase, imageBase);
         var token = new DualCardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);
         var tokenFore = token.tokenFore();
         for (var i = 0; i < tokenFore.hullValue(); i++)
         {
            token.tokenFore().receiveDamage(DamageCard.BLINDED_PILOT);
         }
         assert.ok(tokenFore.isDestroyed());

         // Run.
         var result = token.tokenFore();

         // Verify.
         assert.ok(result);
         assert.equal(result.pilot().key, "cr90Corvette.crippledFore");
      });

      QUnit.test("tokenFore().ship()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var inputAreaId = "firstPilotCardInputArea";
         var iconBase = "../resources/icons/";
         var imageBase = "../resources/images/";
         var rebelAgent = new Agent(store, "Rebel Agent", Faction.REBEL, inputAreaId, iconBase, imageBase);
         var token = new DualCardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);

         // Run.
         var result = token.tokenFore().ship();

         // Verify.
         assert.ok(result);
         assert.equal(result.key, "cr90Corvette.fore");
      });
   });
