import Faction from "../artifact/Faction.js";
import PilotCard from "../artifact/PilotCard.js";
import Ship from "../artifact/Ship.js";

import Agent from "./Agent.js";
import Reducer from "./Reducer.js";
import SquadBuilder from "./SquadBuilder.js";

QUnit.module("SquadBuilder");

QUnit.test("CoreSetFirstOrderSquadBuilder buildSquad()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const squadBuilder = SquadBuilder.CoreSetFirstOrderSquadBuilder;
   const agent = new Agent(store, "FirstOrder Agent");

   // Run.
   const result = squadBuilder.buildSquad(agent);

   // Verify.
   assert.ok(result);
   const tokens = result.tokens();
   assert.ok(tokens);
   assert.equal(tokens.length, 2);
   assert.equal(tokens[0].card().key, PilotCard.EPSILON_LEADER);
   assert.equal(tokens[1].card().key, PilotCard.ZETA_ACE);

   for (let i = 0; i < 2; i++)
   {
      assert.equal(tokens[i].card().shipFaction.shipKey, Ship.TIE_FO_FIGHTER);
   }
});

QUnit.test("CoreSetFirstOrderSquadBuilder description()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetFirstOrderSquadBuilder;
   const result = squadBuilder.description();
   assert.equal(result, "TIE/fo Fighters x2");
});

QUnit.test("CoreSetFirstOrderSquadBuilder getName()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetFirstOrderSquadBuilder;
   const result = squadBuilder.name();
   assert.equal(result, "First Order TFA Core Set: 39 Points");
});

QUnit.test("CoreSetFirstOrderSquadBuilder toString()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetFirstOrderSquadBuilder;
   const result = squadBuilder.toString();
   assert.equal(result, "2015 First Order TFA Core Set: 39 Points (TIE/fo Fighters x2)");
});

QUnit.test("CoreSetImperialSquadBuilder buildSquad()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const squadBuilder = SquadBuilder.CoreSetImperialSquadBuilder;
   const agent = new Agent(store, "Imperial Agent");

   // Run.
   const result = squadBuilder.buildSquad(agent);

   // Verify.
   assert.ok(result);
   const tokens = result.tokens();
   assert.ok(tokens);
   assert.equal(tokens.length, 2);
   assert.equal(tokens[0].card().key, PilotCard.MAULER_MITHEL);
   assert.equal(tokens[1].card().key, PilotCard.DARK_CURSE);

   for (let i = 0; i < 2; i++)
   {
      assert.equal(tokens[i].card().shipFaction.shipKey, Ship.TIE_FIGHTER);
   }
});

QUnit.test("CoreSetImperialSquadBuilder description()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetImperialSquadBuilder;
   const result = squadBuilder.description();
   assert.equal(result, "TIE Fighters x2");
});

QUnit.test("CoreSetImperialSquadBuilder getName()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetImperialSquadBuilder;
   const result = squadBuilder.name();
   assert.equal(result, "Imperial Core Set: 36 Points");
});

QUnit.test("CoreSetImperialSquadBuilder toString()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetImperialSquadBuilder;
   const result = squadBuilder.toString();
   assert.equal(result, "2012 Imperial Core Set: 36 Points (TIE Fighters x2)");
});

QUnit.test("CoreSetRebelSquadBuilder buildSquad()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const squadBuilder = SquadBuilder.CoreSetRebelSquadBuilder;
   const agent = new Agent(store, "Rebel Agent");

   // Run.
   const result = squadBuilder.buildSquad(agent);

   // Verify.
   assert.ok(result);
   const tokens = result.tokens();
   assert.ok(tokens);
   assert.equal(tokens.length, 1);
   assert.equal(tokens[0].card().key, PilotCard.LUKE_SKYWALKER);
   assert.equal(tokens[0].card().shipFaction.shipKey, Ship.X_WING);
});

QUnit.test("CoreSetRebelSquadBuilder description()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetRebelSquadBuilder;
   const result = squadBuilder.description();
   assert.equal(result, "X-Wing");
});

QUnit.test("CoreSetRebelSquadBuilder getName()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetRebelSquadBuilder;
   const result = squadBuilder.name();
   assert.equal(result, "Rebel Core Set: 36 Points");
});

QUnit.test("CoreSetRebelSquadBuilder toString()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetRebelSquadBuilder;
   const result = squadBuilder.toString();
   assert.equal(result, "2012 Rebel Core Set: 36 Points (X-Wing)");
});

QUnit.test("CoreSetResistanceSquadBuilder buildSquad()", function(assert)
{
   // Setup.
   const store = Redux.createStore(Reducer.root);
   const squadBuilder = SquadBuilder.CoreSetResistanceSquadBuilder;
   const agent = new Agent(store, "Resistance Agent");

   // Run.
   const result = squadBuilder.buildSquad(agent);

   // Verify.
   assert.ok(result);
   const tokens = result.tokens();
   assert.ok(tokens);
   assert.equal(tokens.length, 1);
   assert.equal(tokens[0].card().key, PilotCard.POE_DAMERON);
   assert.equal(tokens[0].card().shipFaction.shipKey, Ship.T_70_X_WING);
});

QUnit.test("CoreSetResistanceSquadBuilder description()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetResistanceSquadBuilder;
   const result = squadBuilder.description();
   assert.equal(result, "T-70");
});

QUnit.test("CoreSetResistanceSquadBuilder getName()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetResistanceSquadBuilder;
   const result = squadBuilder.name();
   assert.equal(result, "Resistance TFA Core Set: 39 Points");
});

QUnit.test("CoreSetResistanceSquadBuilder toString()", function(assert)
{
   const squadBuilder = SquadBuilder.CoreSetResistanceSquadBuilder;
   const result = squadBuilder.toString();
   assert.equal(result, "2015 Resistance TFA Core Set: 39 Points (T-70)");
});

QUnit.test("SquadBuilder.findByFaction() First Order", function(assert)
{
   const result = SquadBuilder.findByFaction(Faction.FIRST_ORDER);
   assert.ok(result);
   assert.equal(result.length, 16);
});

QUnit.test("SquadBuilder.findByFaction() Imperial", function(assert)
{
   const result = SquadBuilder.findByFaction(Faction.IMPERIAL);
   assert.ok(result);
   assert.equal(result.length, 16);
});

QUnit.test("SquadBuilder.findByFaction() Rebel", function(assert)
{
   const result = SquadBuilder.findByFaction(Faction.REBEL);
   assert.ok(result);
   assert.equal(result.length, 25);
});

QUnit.test("SquadBuilder.findByFaction() Resistance", function(assert)
{
   const result = SquadBuilder.findByFaction(Faction.RESISTANCE);
   assert.ok(result);
   assert.equal(result.length, 25);
});

QUnit.test("SquadBuilder.findByFaction() Scum", function(assert)
{
   const result = SquadBuilder.findByFaction(Faction.SCUM);
   assert.ok(result);
   assert.equal(result.length, 16);
});

const SquadBuilderTest = {};
export default SquadBuilderTest;