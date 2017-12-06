"use strict";

define(["qunit", "artifact/js/PilotCard", "model/js/CardComparator", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, PilotCard, CardComparator, EnvironmentFactory)
   {
      QUnit.module("CardComparator");

      QUnit.test("Activation", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var cardInstances = environment.pilotInstances();

         // Run.
         cardInstances.sort(CardComparator.Activation);

         // Verify.
         assert.ok(cardInstances);
         assert.equal(cardInstances.length, 3);
         var token;
         var i = 0;
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 6);
         assert.equal(token.card().key, PilotCard.DARK_CURSE);
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 7);
         assert.equal(token.card().key, PilotCard.MAULER_MITHEL);
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.LUKE_SKYWALKER);
      });

      QUnit.test("Activation Huge pure", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createHugeShipEnvironment();
         var cardInstances = environment.pilotInstances(true);

         // Run.
         cardInstances.sort(CardComparator.Activation);

         // Verify.
         assert.ok(cardInstances);
         assert.equal(cardInstances.length, 8);
         var token;
         var i = 0;
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.JUNO_ECLIPSE);
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.WES_JANSON);
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 2);
         assert.equal(token.card().key, PilotCard.GOZANTI_CLASS_CRUISER);
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 3);
         assert.equal(token.card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".fore");
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".aft");
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".fore");
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".aft");
      });

      QUnit.test("Combat", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var cardInstances = environment.pilotInstances(true);

         // Run.
         cardInstances.sort(CardComparator.Combat);

         // Verify.
         assert.ok(cardInstances);
         assert.equal(cardInstances.length, 3);
         var token;
         var i = 0;
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.LUKE_SKYWALKER);
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 7);
         assert.equal(token.card().key, PilotCard.MAULER_MITHEL);
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 6);
         assert.equal(token.card().key, PilotCard.DARK_CURSE);
      });

      QUnit.test("Combat Huge", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createHugeShipEnvironment();
         var cardInstances = environment.pilotInstances(true);

         // Run.
         cardInstances.sort(CardComparator.Combat);

         // Verify.
         assert.ok(cardInstances);
         assert.equal(cardInstances.length, 8);
         var token;
         var i = 0;
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.JUNO_ECLIPSE);
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.WES_JANSON);
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".fore");
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".aft");
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".fore");
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".aft");
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 3);
         assert.equal(token.card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
         token = cardInstances[i++];
         assert.equal(token.pilotSkillValue(), 2);
         assert.equal(token.card().key, PilotCard.GOZANTI_CLASS_CRUISER);
      });
   });
