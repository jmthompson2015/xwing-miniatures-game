"use strict";

define(["qunit", "redux", "artifact/js/Faction", "artifact/js/PilotCard", "artifact/js/Ship",
  "model/js/Agent", "model/js/SquadBuilder", "model/js/Reducer"],
   function(QUnit, Redux, Faction, PilotCard, Ship,
      Agent, SquadBuilder, Reducer)
   {
      QUnit.module("SquadBuilder");

      QUnit.test("CoreSetFirstOrderSquadBuilder buildSquad()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var squadBuilder = SquadBuilder.CoreSetFirstOrderSquadBuilder;
         var agent = new Agent(store, "FirstOrder Agent");

         // Run.
         var result = squadBuilder.buildSquad(agent);

         // Verify.
         assert.ok(result);
         var tokens = result.tokens();
         assert.ok(tokens);
         assert.equal(tokens.length, 2);
         assert.equal(tokens[0].card().key, PilotCard.EPSILON_LEADER);
         assert.equal(tokens[1].card().key, PilotCard.ZETA_ACE);

         for (var i = 0; i < 2; i++)
         {
            assert.equal(tokens[i].card().shipFaction.shipKey, Ship.TIE_FO_FIGHTER);
         }
      });

      QUnit.test("CoreSetFirstOrderSquadBuilder description()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetFirstOrderSquadBuilder;
         var result = squadBuilder.description();
         assert.equal(result, "TIE/fo Fighters x2");
      });

      QUnit.test("CoreSetFirstOrderSquadBuilder getName()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetFirstOrderSquadBuilder;
         var result = squadBuilder.name();
         assert.equal(result, "First Order TFA Core Set: 39 Points");
      });

      QUnit.test("CoreSetFirstOrderSquadBuilder toString()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetFirstOrderSquadBuilder;
         var result = squadBuilder.toString();
         assert.equal(result, "2015 First Order TFA Core Set: 39 Points (TIE/fo Fighters x2)");
      });

      QUnit.test("CoreSetImperialSquadBuilder buildSquad()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var squadBuilder = SquadBuilder.CoreSetImperialSquadBuilder;
         var agent = new Agent(store, "Imperial Agent");

         // Run.
         var result = squadBuilder.buildSquad(agent);

         // Verify.
         assert.ok(result);
         var tokens = result.tokens();
         assert.ok(tokens);
         assert.equal(tokens.length, 2);
         assert.equal(tokens[0].card().key, PilotCard.MAULER_MITHEL);
         assert.equal(tokens[1].card().key, PilotCard.DARK_CURSE);

         for (var i = 0; i < 2; i++)
         {
            assert.equal(tokens[i].card().shipFaction.shipKey, Ship.TIE_FIGHTER);
         }
      });

      QUnit.test("CoreSetImperialSquadBuilder description()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetImperialSquadBuilder;
         var result = squadBuilder.description();
         assert.equal(result, "TIE Fighters x2");
      });

      QUnit.test("CoreSetImperialSquadBuilder getName()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetImperialSquadBuilder;
         var result = squadBuilder.name();
         assert.equal(result, "Imperial Core Set: 36 Points");
      });

      QUnit.test("CoreSetImperialSquadBuilder toString()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetImperialSquadBuilder;
         var result = squadBuilder.toString();
         assert.equal(result, "2012 Imperial Core Set: 36 Points (TIE Fighters x2)");
      });

      QUnit.test("CoreSetRebelSquadBuilder buildSquad()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var squadBuilder = SquadBuilder.CoreSetRebelSquadBuilder;
         var agent = new Agent(store, "Rebel Agent");

         // Run.
         var result = squadBuilder.buildSquad(agent);

         // Verify.
         assert.ok(result);
         var tokens = result.tokens();
         assert.ok(tokens);
         assert.equal(tokens.length, 1);
         assert.equal(tokens[0].card().key, PilotCard.LUKE_SKYWALKER);
         assert.equal(tokens[0].card().shipFaction.shipKey, Ship.X_WING);
      });

      QUnit.test("CoreSetRebelSquadBuilder description()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetRebelSquadBuilder;
         var result = squadBuilder.description();
         assert.equal(result, "X-Wing");
      });

      QUnit.test("CoreSetRebelSquadBuilder getName()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetRebelSquadBuilder;
         var result = squadBuilder.name();
         assert.equal(result, "Rebel Core Set: 36 Points");
      });

      QUnit.test("CoreSetRebelSquadBuilder toString()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetRebelSquadBuilder;
         var result = squadBuilder.toString();
         assert.equal(result, "2012 Rebel Core Set: 36 Points (X-Wing)");
      });

      QUnit.test("CoreSetResistanceSquadBuilder buildSquad()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var squadBuilder = SquadBuilder.CoreSetResistanceSquadBuilder;
         var agent = new Agent(store, "Resistance Agent");

         // Run.
         var result = squadBuilder.buildSquad(agent);

         // Verify.
         assert.ok(result);
         var tokens = result.tokens();
         assert.ok(tokens);
         assert.equal(tokens.length, 1);
         assert.equal(tokens[0].card().key, PilotCard.POE_DAMERON);
         assert.equal(tokens[0].card().shipFaction.shipKey, Ship.T_70_X_WING);
      });

      QUnit.test("CoreSetResistanceSquadBuilder description()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetResistanceSquadBuilder;
         var result = squadBuilder.description();
         assert.equal(result, "T-70");
      });

      QUnit.test("CoreSetResistanceSquadBuilder getName()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetResistanceSquadBuilder;
         var result = squadBuilder.name();
         assert.equal(result, "Resistance TFA Core Set: 39 Points");
      });

      QUnit.test("CoreSetResistanceSquadBuilder toString()", function(assert)
      {
         var squadBuilder = SquadBuilder.CoreSetResistanceSquadBuilder;
         var result = squadBuilder.toString();
         assert.equal(result, "2015 Resistance TFA Core Set: 39 Points (T-70)");
      });

      QUnit.test("SquadBuilder.findByFaction() First Order", function(assert)
      {
         var result = SquadBuilder.findByFaction(Faction.FIRST_ORDER);
         assert.ok(result);
         assert.equal(result.length, 16);
      });

      QUnit.test("SquadBuilder.findByFaction() Imperial", function(assert)
      {
         var result = SquadBuilder.findByFaction(Faction.IMPERIAL);
         assert.ok(result);
         assert.equal(result.length, 16);
      });

      QUnit.test("SquadBuilder.findByFaction() Rebel", function(assert)
      {
         var result = SquadBuilder.findByFaction(Faction.REBEL);
         assert.ok(result);
         assert.equal(result.length, 25);
      });

      QUnit.test("SquadBuilder.findByFaction() Resistance", function(assert)
      {
         var result = SquadBuilder.findByFaction(Faction.RESISTANCE);
         assert.ok(result);
         assert.equal(result.length, 25);
      });

      QUnit.test("SquadBuilder.findByFaction() Scum", function(assert)
      {
         var result = SquadBuilder.findByFaction(Faction.SCUM);
         assert.ok(result);
         assert.equal(result.length, 16);
      });
   });
