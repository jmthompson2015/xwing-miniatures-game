import Faction from "../artifact/Faction.js";
import FiringArc from "../artifact/FiringArc.js";
import PilotCard from "../artifact/PilotCard.js";
import Range from "../artifact/Range.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

import Agent from "./Agent.js";
import CardAction from "./CardAction.js";
import CardInstance from "./CardInstance.js";
import Environment from "./Environment.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import Position from "./Position.js";
import Reducer from "./Reducer.js";
import Squad from "./Squad.js";
import TargetLock from "./TargetLock.js";
import Weapon from "./Weapon.js";

QUnit.module("Weapon");

QUnit.test("Weapon properties", function(assert)
{
   // Setup.
   var weapon = new Weapon("Primary Weapon", 12, [Range.TWO, Range.THREE], FiringArc.FORWARD);

   // Run / Verify.
   assert.equal(weapon.name(), "Primary Weapon");
   assert.equal(weapon.isPrimary(), true);
   assert.equal(weapon.weaponValue(), 12);
   var rangeKeys = weapon.rangeKeys();
   assert.equal(rangeKeys.length, 2);
   assert.equal(rangeKeys[0], Range.TWO);
   assert.equal(rangeKeys[1], Range.THREE);
});

QUnit.test("isDefenderInRange() range one", function(assert)
{
   // Setup.
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var attackerPosition0 = new Position(458, 895, -90);
   var attacker = environment.getTokenAt(attackerPosition0);
   assert.ok(attacker);
   var defenderPosition = new Position(305, 20, 90);
   var defender = environment.getTokenAt(defenderPosition);
   var attackerPosition = new Position(defenderPosition.x(), defenderPosition.y() + 50, -90);
   environment.moveToken(attackerPosition0, attackerPosition);
   var weapon = new Weapon("myWeapon", 12, [Range.ONE, Range.TWO], FiringArc.FORWARD);

   // Run.
   var result = weapon.isDefenderInRange(attacker, attackerPosition, defender, defenderPosition);

   // Verify.
   assert.ok(result);
});

QUnit.test("isDefenderInFiringArc() range one", function(assert)
{
   // Setup.
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var attackerPosition0 = new Position(458, 895, -90);
   var attacker = environment.getTokenAt(attackerPosition0);
   assert.ok(attacker);
   var defenderPosition = new Position(305, 20, 90);
   var defender = environment.getTokenAt(defenderPosition);
   var attackerPosition = new Position(defenderPosition.x(), defenderPosition.y() + 50, -90);
   environment.moveToken(attackerPosition0, attackerPosition);
   var weapon = new Weapon("myWeapon", 12, [Range.ONE, Range.TWO], FiringArc.FORWARD);

   // Run.
   var result = weapon.isDefenderInFiringArc(attackerPosition, attacker.primaryWeapon().primaryFiringArc(), defender, defenderPosition);

   // Verify.
   assert.ok(result);
});

QUnit.test("isDefenderInFiringArc() rotated", function(assert)
{
   // Setup.
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var attackerPosition0 = new Position(458, 895, -90);
   var attacker = environment.getTokenAt(attackerPosition0);
   assert.ok(attacker);
   var defenderPosition = new Position(305, 20, 90);
   var defender = environment.getTokenAt(defenderPosition);
   var attackerPosition = new Position(defenderPosition.x(), defenderPosition.y() + 50, 0);
   environment.moveToken(attackerPosition0, attackerPosition);
   var weapon = new Weapon("myWeapon", 12, [Range.ONE, Range.TWO], FiringArc.FORWARD);

   // Run.
   var result = weapon.isDefenderInFiringArc(attackerPosition, attacker.primaryWeapon().primaryFiringArc(), defender, defenderPosition);

   // Verify.
   assert.ok(!result);
});

QUnit.test("isDefenderTargetable() range one", function(assert)
{
   // Setup.
   var environment = EnvironmentFactory.createCoreSetEnvironment();
   var attackerPosition0 = new Position(458, 895, -90);
   var attacker = environment.getTokenAt(attackerPosition0);
   assert.ok(attacker);
   var defenderPosition = new Position(305, 20, 90);
   var defender = environment.getTokenAt(defenderPosition);
   var attackerPosition = new Position(defenderPosition.x(), defenderPosition.y() + 50, -90);
   environment.moveToken(attackerPosition0, attackerPosition);
   var weapon = new Weapon("myWeapon", 12, [Range.ONE, Range.TWO], FiringArc.FORWARD);

   // Run.
   var result = weapon.isDefenderTargetable(attacker, attackerPosition, defender, defenderPosition);

   // Verify.
   assert.ok(result);
});

QUnit.test("isUsable()", function(assert)
{
   // Setup.
   var store00 = Redux.createStore(Reducer.root);
   var imperialAgent = new Agent(store00, "Imperial Agent");
   var rebelAgent = new Agent(store00, "Rebel Agent");
   var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent)]);
   var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [UpgradeCard.MANGLER_CANNON, UpgradeCard.BLASTER_TURRET, UpgradeCard.PROTON_TORPEDOES])]);
   var positions1 = [new Position(450, 845, 90)];
   var positions2 = [new Position(458, 895, -90)];

   var store = Redux.createStore(Reducer.root);
   var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
   var tokens = environment.pilotInstances();
   var attacker = tokens[1];
   var defender = tokens[0];
   var weapon0 = attacker.secondaryWeapons()[0]; // Mangler cannon.
   var weapon1 = attacker.secondaryWeapons()[1]; // Blaster turret.
   var weapon2 = attacker.secondaryWeapons()[2]; // Cluster missiles.

   // Run / Verify.
   assert.ok(weapon0.isUsable(attacker, defender));
   assert.ok(!weapon1.isUsable(attacker, defender));
   assert.ok(!weapon2.isUsable(attacker, defender));

   store.dispatch(CardAction.addFocusCount(attacker));

   // Run / Verify.
   assert.ok(weapon0.isUsable(attacker, defender));
   assert.ok(weapon1.isUsable(attacker, defender));
   assert.ok(!weapon2.isUsable(attacker, defender));

   TargetLock.newInstance(store, attacker, defender);

   // Run / Verify.
   assert.ok(weapon0.isUsable(attacker, defender));
   assert.ok(weapon1.isUsable(attacker, defender));
   assert.ok(weapon2.isUsable(attacker, defender));
});

QUnit.test("toString()", function(assert)
{
   // Setup.
   var weapon = new Weapon("myWeapon", 12, [Range.TWO, Range.THREE], FiringArc.FORWARD);

   // Run / Verify.
   assert.equal(weapon.toString(), "myWeapon");
});

const WeaponTest = {};
export default WeaponTest;