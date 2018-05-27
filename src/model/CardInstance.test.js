"use strict";

define(["qunit", "redux",
  "artifact/Bearing", "artifact/ConditionCard", "artifact/Count", "artifact/DamageCard", "artifact/Difficulty", "artifact/Faction", "artifact/Maneuver", "artifact/Phase", "artifact/PilotCard", "artifact/Range", "artifact/Ship", "artifact/ShipAction", "artifact/UpgradeCard", "artifact/Value",
  "model/Ability", "model/Action", "model/ActivationAction", "model/Agent", "model/CardAction", "model/CardInstance", "model/DamageAbility2", "model/DamageAbility3", "model/Environment", "model/EnvironmentAction", "model/ManeuverAction", "model/PilotAbility2", "model/PilotAbility3",
  "model/Position", "model/Reducer", "model/ShipActionAbility", "model/Squad", "model/UpgradeAbility2", "model/UpgradeAbility3",
  "model/EnvironmentFactory"],
   function(QUnit, Redux,
      Bearing, ConditionCard, Count, DamageCard, Difficulty, Faction, Maneuver, Phase, PilotCard, Range, Ship, ShipAction, UpgradeCard, Value,
      Ability, Action, ActivationAction, Agent, CardAction, CardInstance, DamageAbility2, DamageAbility3, Environment, EnvironmentAction, ManeuverAction, PilotAbility2, PilotAbility3,
      Position, Reducer, ShipActionAbility, Squad, UpgradeAbility2, UpgradeAbility3,
      EnvironmentFactory)
   {
      QUnit.module("CardInstance");

      QUnit.test("CardInstance properties Darth Vader", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");

         // Run.
         var token = new CardInstance(store, PilotCard.DARTH_VADER, imperialAgent, [UpgradeCard.CLUSTER_MISSILES]);

         // Verify.
         assert.ok(token);
         assert.equal(token.id(), 1);
         assert.equal(token.card().key, PilotCard.DARTH_VADER);
         assert.equal(token.agent(), imperialAgent);
         assert.equal(token.upgradeKeys().size, 1);
         assert.equal(token.upgradeKeys().get(0), UpgradeCard.CLUSTER_MISSILES);

         var values = [3, null, 3, 9, 2, 2];
         Value.keys().forEach(function(valueName, i)
         {
            var functionName = valueName + "Value";
            var myFunction = token[functionName];
            if (myFunction === undefined)
            {
               LOGGER.error("Missing CardInstance function: " + functionName);
            }
            var result = myFunction.call(token);
            assert.equal(result, values[i], "token." + functionName + "() === " + values[i]);
         });

         var counts = [0, 0, 0, 0, 0, 0, 0, 2, // shield
            0, 0, 0];
         Count.keys().forEach(function(countName, i)
         {
            var functionName = countName + "Count";
            var myFunction = token[functionName];
            if (myFunction === undefined)
            {
               LOGGER.error("Missing CardInstance function: " + functionName);
            }
            var result = myFunction.call(token);
            assert.equal(result, counts[i], "token." + functionName + "() === " + counts[i]);
         });

         assert.ok(token.primaryWeapon());
         assert.equal(token.primaryWeapon().weaponValue(), 2, "token.primaryWeapon().weaponValue() === 2");

         assert.equal(token.secondaryWeapons().length, 1, "token.secondaryWeapons().length === 1");
         var weapon0 = token.secondaryWeapons()[0];
         assert.equal(weapon0.weaponValue(), 3, "weapon0.weaponValue() === 3");
         assert.equal(weapon0.upgradeKey(), UpgradeCard.CLUSTER_MISSILES);
      });

      QUnit.test("CardInstance properties CR90 Corvette", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);
         assert.equal(token.id(), 1);
         assert.equal(token.card().key, PilotCard.CR90_CORVETTE);
         assert.equal(token.card().shipFaction.shipKey, Ship.CR90_CORVETTE);
         assert.equal(token.name(), "1 CR90 Corvette");

         var tokenFore = token.tokenFore();
         assert.ok(tokenFore);
         assert.equal(tokenFore.name(), "2 CR90 Corvette (fore)");
         assert.equal(tokenFore.upgradeKeys().size, 3);
         assert.equal(tokenFore.secondaryWeapons().length, 1);
         var weapon = tokenFore.secondaryWeapons()[0];
         assert.ok(weapon);
         assert.equal(weapon.upgradeKey(), UpgradeCard.QUAD_LASER_CANNONS);

         var tokenAft = token.tokenAft();
         assert.ok(tokenAft);
         assert.equal(tokenAft.name(), "10 CR90 Corvette (aft)");
         assert.equal(tokenAft.upgradeKeys().size, 1);
         assert.equal(tokenAft.secondaryWeapons().length, 0);
      });

      QUnit.test("CardInstance.get()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.DARTH_VADER, imperialAgent, [UpgradeCard.CLUSTER_MISSILES]);

         // Run.
         var result = CardInstance.get(store, token.id());

         // Verify.
         assert.ok(result);
         assert.equal(result.id(), 1);
         assert.equal(result.card().key, PilotCard.DARTH_VADER);
         assert.equal(result.agent(), imperialAgent);
         assert.equal(result.upgradeKeys().size, 1);
         assert.equal(result.upgradeKeys().get(0), UpgradeCard.CLUSTER_MISSILES);

         var values = [3, null, 3, 9, 2, 2];
         Value.keys().forEach(function(valueName, i)
         {
            var functionName = valueName + "Value";
            var myFunction = token[functionName];
            if (myFunction === undefined)
            {
               LOGGER.error("Missing CardInstance function: " + functionName);
            }
            var result = myFunction.call(token);
            assert.equal(result, values[i], "token." + functionName + "() === " + values[i]);
         });

         var counts = [0, 0, 0, 0, 0, 0, 0, 2, // shield
           0, 0, 0];
         Count.keys().forEach(function(countName, i)
         {
            var functionName = countName + "Count";
            var myFunction = token[functionName];
            if (myFunction === undefined)
            {
               LOGGER.error("Missing CardInstance function: " + functionName);
            }
            var result = myFunction.call(token);
            assert.equal(result, counts[i], "token." + functionName + "() === " + counts[i]);
         });

         assert.ok(token.primaryWeapon());
         assert.equal(token.primaryWeapon().weaponValue(), 2, "token.primaryWeapon().weaponValue() === 2");

         assert.equal(token.secondaryWeapons().length, 1, "token.secondaryWeapons().length === 1");
         var weapon0 = token.secondaryWeapons()[0];
         assert.equal(weapon0.weaponValue(), 3, "weapon0.weaponValue() === 3");
         assert.equal(weapon0.upgradeKey(), UpgradeCard.CLUSTER_MISSILES);
      });

      QUnit.test("CardInstance properties Dash Rendar", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.DASH_RENDAR, rebelAgent, [UpgradeCard.OUTRIDER, UpgradeCard.PREDATOR, UpgradeCard.MANGLER_CANNON, UpgradeCard.CHEWBACCA]);
         assert.equal(token.id(), 1);
         assert.equal(token.card().key, PilotCard.DASH_RENDAR);
         assert.equal(token.card().shipFaction.shipKey, Ship.YT_2400);
         assert.equal(token.name(), "1 \u2022 Dash Rendar (YT-2400)");
         assert.equal(token.secondaryWeapons().length, 1);
         var weapon1 = token.secondaryWeapons()[0];
         assert.equal(weapon1.upgradeKey(), UpgradeCard.MANGLER_CANNON);
      });

      QUnit.test("CardInstance properties GR-75 Medium Transport", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.GR_75_MEDIUM_TRANSPORT, rebelAgent, [UpgradeCard.CARLIST_RIEEKAN, UpgradeCard.EM_EMITTER]);
         assert.equal(token.id(), 1);
         assert.equal(token.card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
         assert.equal(token.card().shipFaction.shipKey, Ship.GR_75_MEDIUM_TRANSPORT);
         assert.equal(token.name(), "1 GR-75 Medium Transport");
         assert.equal(token.secondaryWeapons().length, 0);
      });

      QUnit.test("agilityValue()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         var token1 = new CardInstance(store, PilotCard.BOUNTY_HUNTER, imperialAgent);
         var token2 = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);

         // Run / Verify.
         assert.equal(token0.agilityValue(), 3);
         assert.equal(token1.agilityValue(), 2);
         assert.equal(token2.agilityValue(), 2);
      });

      QUnit.test("agilityValue() Stealth Device", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent, [UpgradeCard.STEALTH_DEVICE]);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));

         // Run / Verify.
         assert.equal(token.pilotSkillValue(), 1);
         assert.equal(token.primaryWeaponValue(), 2);
         assert.equal(token.agilityValue(), 4, "token.agilityValue() === 4");
         assert.equal(token.hullValue(), 3);
         assert.equal(token.shieldValue(), 0);
      });

      QUnit.test("children() Academy Pilot", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var pilotInstance = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent, [UpgradeCard.STEALTH_DEVICE]);

         // Run.
         var result = pilotInstance.children();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 0);
      });

      QUnit.test("children() CR90 Corvette", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var pilotInstance = new CardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent);

         // Run.
         var result = pilotInstance.children();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0].card().key, PilotCard.CR90_CORVETTE + ".fore");
         assert.equal(result[1].card().key, PilotCard.CR90_CORVETTE + ".aft");
      });

      QUnit.test("cloakCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         assert.equal(token0.cloakCount(), 0);
         store.dispatch(CardAction.addCloakCount(token0));
         assert.equal(token0.cloakCount(), 1);
         store.dispatch(CardAction.addCloakCount(token0, -1));
         assert.equal(token0.cloakCount(), 0);
         store.dispatch(CardAction.addCloakCount(token0, -1));
         assert.equal(token0.cloakCount(), 0);
      });

      QUnit.test("computeAttackDiceCount()", function(assert)
      {
         var store00 = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store00, "Imperial Agent");
         var token0 = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
         var rebelAgent = new Agent(store00, "Rebel Agent");
         var token1 = new CardInstance(store00, PilotCard.ROOKIE_PILOT, rebelAgent);

         var store = Redux.createStore(Reducer.root);
         var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [token0]);
         var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [token1]);
         var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2);
         var tokens = environment.pilotInstances();
         token0 = tokens[0];
         token1 = tokens[1];
         assert.equal(token0.id(), 34);
         assert.equal(token0.card().key, PilotCard.ACADEMY_PILOT);
         assert.equal(token0.card().shipFaction.shipKey, Ship.TIE_FIGHTER);
         assert.equal(token0.name(), "34 Academy Pilot (TIE Fighter)");
         assert.equal(token1.id(), 35);
         assert.equal(token1.card().key, PilotCard.ROOKIE_PILOT);
         assert.equal(token1.card().shipFaction.shipKey, Ship.X_WING);
         assert.equal(token1.name(), "35 Rookie Pilot (X-Wing)");

         assert.equal(token0.computeAttackDiceCount(environment, token0.primaryWeapon(), token1, Range.ONE), 3);
         assert.equal(token0.computeAttackDiceCount(environment, token0.primaryWeapon(), token1, Range.TWO), 2);
         assert.equal(token0.computeAttackDiceCount(environment, token0.primaryWeapon(), token1, Range.THREE), 2);

         assert.equal(token1.computeAttackDiceCount(environment, token1.primaryWeapon(), token0, Range.ONE), 4);
         assert.equal(token1.computeAttackDiceCount(environment, token1.primaryWeapon(), token0, Range.TWO), 3);
         assert.equal(token1.computeAttackDiceCount(environment, token1.primaryWeapon(), token0, Range.THREE), 3);
      });

      QUnit.test("computeAttackDiceCount() Dorsal Turret", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attacker = environment.pilotInstances()[1]; // Dark Curse
         var store = environment.store();
         var upgrade = new CardInstance(store, UpgradeCard.DORSAL_TURRET);
         store.dispatch(CardAction.addUpgrade(attacker, upgrade));
         var defender = environment.pilotInstances()[2]; // X-Wing
         assert.equal(attacker.name(), "36 \u2022 \"Dark Curse\" (TIE Fighter)");
         var weapon = attacker.primaryWeapon();

         // Run / Verify.
         assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.ONE), 3);
         assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.TWO), 2);
         assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.THREE), 2);
      });

      QUnit.test("computeAttackDiceCount() Mauler Mithel", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attacker = environment.pilotInstances()[0]; // Mauler Mithel
         var defender = environment.pilotInstances()[2]; // X-Wing
         assert.equal(attacker.name(), "34 \u2022 \"Mauler Mithel\" (TIE Fighter)");
         var weapon = attacker.primaryWeapon();

         // Run / Verify.
         assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.ONE), 4);
         assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.TWO), 2);
         assert.equal(attacker.computeAttackDiceCount(environment, weapon, defender, Range.THREE), 2);
      });

      QUnit.test("computeAttackDiceCount() Talonbane Cobra", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var agent = environment.pilotInstances()[0].agent(); // Mauler Mithel
         var token = new CardInstance(environment.store(), PilotCard.TALONBANE_COBRA, agent);
         var weapon = token.primaryWeapon();
         var defender = environment.pilotInstances()[2]; // X-Wing

         // Run / Verify.
         assert.equal(token.computeAttackDiceCount(environment, weapon, defender, Range.ONE), 5);
         assert.equal(token.computeAttackDiceCount(environment, weapon, defender, Range.TWO), 3);
         assert.equal(token.computeAttackDiceCount(environment, weapon, defender, Range.THREE), 3);
      });

      QUnit.test("computeAttackDiceCount() Blinded Pilot", function(assert)
      {
         var store00 = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store00, "Imperial Agent");
         var token = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
         var rebelAgent = new Agent(store00, "Rebel Agent");
         var defender = new CardInstance(store00, PilotCard.ROOKIE_PILOT, rebelAgent);

         var store = Redux.createStore(Reducer.root);
         //  store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [token]);
         var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [defender]);
         var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, [new Position(10, 20, 30)]);
         var tokens = environment.pilotInstances();
         token = tokens[0];
         defender = tokens[1];

         assert.equal(token.damageCount(), 0);
         assert.equal(token.criticalDamageCount(), 0);
         assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.ONE), 3);
         assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.TWO), 2);
         assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.THREE), 2);

         var damage = new CardInstance(store, DamageCard.BLINDED_PILOT);
         token.receiveCriticalDamage(damage);
         assert.equal(token.damageCount(), 0);
         assert.equal(token.criticalDamageCount(), 1);
         assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.ONE), 0);
         assert.equal(token.damageCount(), 1);
         assert.equal(token.criticalDamageCount(), 0);
         // Subsequent calls work normally.
         assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.TWO), 2);
         assert.equal(token.computeAttackDiceCount(environment, token.primaryWeapon(), defender, Range.THREE), 2);
      });

      QUnit.test("computeDefenseDiceCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         assert.equal(token0.id(), 1);
         assert.equal(token0.card().key, PilotCard.ACADEMY_PILOT);
         assert.equal(token0.card().shipFaction.shipKey, Ship.TIE_FIGHTER);
         assert.equal(token0.name(), "1 Academy Pilot (TIE Fighter)");
         var environment = {};
         assert.equal(token0.computeDefenseDiceCount(environment, token0, token0.primaryWeapon(), Range.ONE), 3);
         assert.equal(token0.computeDefenseDiceCount(environment, token0, token0.primaryWeapon(), Range.TWO), 3);
         assert.equal(token0.computeDefenseDiceCount(environment, token0, token0.primaryWeapon(), Range.THREE), 4);
         assert.equal(token0.computeDefenseDiceCount(environment, token0, token0.primaryWeapon(), Range.FOUR), 4);
         assert.equal(token0.computeDefenseDiceCount(environment, token0, token0.primaryWeapon(), Range.FIVE), 4);

         var rebelAgent = new Agent(store, "Rebel Agent");
         var token1 = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);
         assert.equal(token1.id(), 2);
         assert.equal(token1.card().key, PilotCard.ROOKIE_PILOT);
         assert.equal(token1.card().shipFaction.shipKey, Ship.X_WING);
         assert.equal(token1.name(), "2 Rookie Pilot (X-Wing)");
         assert.equal(token1.computeDefenseDiceCount(environment, token1, token1.primaryWeapon(), Range.ONE), 2);
         assert.equal(token1.computeDefenseDiceCount(environment, token1, token1.primaryWeapon(), Range.TWO), 2);
         assert.equal(token1.computeDefenseDiceCount(environment, token1, token1.primaryWeapon(), Range.THREE), 3);
         assert.equal(token1.computeDefenseDiceCount(environment, token1, token1.primaryWeapon(), Range.FOUR), 3);
         assert.equal(token1.computeDefenseDiceCount(environment, token1, token1.primaryWeapon(), Range.FIVE), 3);
      });

      QUnit.test("computeDefenseDiceCount() Talonbane Cobra", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var agent = environment.pilotInstances()[0].agent(); // Mauler Mithel
         var token = new CardInstance(environment.store(), PilotCard.TALONBANE_COBRA, agent);
         var weapon = token.primaryWeapon();

         // Run / Verify.
         assert.equal(token.computeDefenseDiceCount(environment, token, weapon, Range.ONE), 2);
         assert.equal(token.computeDefenseDiceCount(environment, token, weapon, Range.TWO), 2);
         assert.equal(token.computeDefenseDiceCount(environment, token, weapon, Range.THREE), 4);
         assert.equal(token.computeDefenseDiceCount(environment, token, weapon, Range.FOUR), 4);
         assert.equal(token.computeDefenseDiceCount(environment, token, weapon, Range.FIVE), 4);
      });

      QUnit.test("criticalDamage() Blinded Pilot", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var pilot = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         var damageKey = DamageCard.BLINDED_PILOT;
         var damage = new CardInstance(store, damageKey);
         store.dispatch(CardAction.addDamage(pilot, damage));
         assert.equal(pilot.isCriticallyDamagedWith(damageKey), true);

         // Run.
         var result = pilot.criticalDamage(damageKey);

         // Verify.
         assert.ok(result);
         assert.equal(result.card().key, damageKey);
      });

      QUnit.test("discardUpgrade()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.DARTH_VADER, imperialAgent, [UpgradeCard.DETERMINATION,
                        UpgradeCard.CLUSTER_MISSILES, UpgradeCard.ENGINE_UPGRADE]);
         assert.equal(token.upgradeKeys().size, 3);
         assert.equal(token.secondaryWeapons().length, 1);
         var upgrade = token.upgrades().get(1);

         // Run.
         token.discardUpgrade(upgrade);

         // Verify.
         assert.equal(token.upgradeKeys().size, 2);
         assert.equal(token.secondaryWeapons().length, 0);
      });

      QUnit.test("energyValue()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         var token1 = new CardInstance(store, PilotCard.GOZANTI_CLASS_CRUISER, imperialAgent);
         var token2 = new CardInstance(store, PilotCard.GR_75_MEDIUM_TRANSPORT, rebelAgent);

         // Run / Verify.
         assert.equal(token0.energyValue(), undefined);
         assert.equal(token1.energyValue(), 4, "token1.energyValue() === 4");
         assert.equal(token2.energyValue(), 4, "token2.energyValue() === 4");
      });

      QUnit.test("evadeCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         assert.equal(token0.evadeCount(), 0);
         store.dispatch(CardAction.addEvadeCount(token0));
         assert.equal(token0.evadeCount(), 1);
         store.dispatch(CardAction.addEvadeCount(token0, -1));
         assert.equal(token0.evadeCount(), 0);
         store.dispatch(CardAction.addEvadeCount(token0, -1));
         assert.equal(token0.evadeCount(), 0);
      });

      QUnit.test("flipDamageCardFacedown()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var damage = new CardInstance(store, DamageCard.BLINDED_PILOT);
         token.receiveCriticalDamage(damage);
         assert.equal(token.criticalDamageCount(), 1);
         assert.equal(token.damageCount(), 0);

         // Run.
         token.flipDamageCardFacedown(damage);

         // Verify.
         assert.equal(token.criticalDamageCount(), 0);
         assert.equal(token.damageCount(), 1);
      });

      QUnit.test("focusCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         assert.equal(token0.focusCount(), 0);
         store.dispatch(CardAction.addFocusCount(token0));
         assert.equal(token0.focusCount(), 1);
         store.dispatch(CardAction.addFocusCount(token0, -1));
         assert.equal(token0.focusCount(), 0);
         store.dispatch(CardAction.addFocusCount(token0, -1));
         assert.equal(token0.focusCount(), 0);
      });

      QUnit.test("hullValue()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         var token1 = new CardInstance(store, PilotCard.BOUNTY_HUNTER, imperialAgent);
         var token2 = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);

         // Run / Verify.
         assert.equal(token0.hullValue(), 3);
         assert.equal(token1.hullValue(), 6);
         assert.equal(token2.hullValue(), 3);
      });

      QUnit.test("hullValue()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent, [UpgradeCard.COMBAT_RETROFIT]);

         // Run / Verify.
         assert.equal(token.pilotSkillValue(), 1);
         assert.equal(token.primaryWeaponValue(), 2);
         assert.equal(token.agilityValue(), 3);
         assert.equal(token.hullValue(), 5);
         assert.equal(token.shieldValue(), 1);
      });

      QUnit.test("hullValue() Direct Hit", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         assert.equal(token.hullValue(), 3);

         // Run / Verify.
         var damage = new CardInstance(store, DamageCard.DIRECT_HIT);
         token.receiveCriticalDamage(damage);
         assert.equal(token.hullValue(), 3);
      });

      QUnit.test("ionCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         assert.equal(token0.ionCount(), 0);
         store.dispatch(CardAction.addIonCount(token0));
         assert.equal(token0.ionCount(), 1);
         store.dispatch(CardAction.addIonCount(token0, -1));
         assert.equal(token0.ionCount(), 0);
         store.dispatch(CardAction.addIonCount(token0, -1));
         assert.equal(token0.ionCount(), 0);
      });

      QUnit.test("ion token", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, agent);
         store.dispatch(CardAction.addIonCount(token));
         assert.equal(token.ionCount(), 1);

         // Run / Verify.
         var maneuverKeys = token.maneuverKeys();
         assert.ok(maneuverKeys);
         assert.equal(maneuverKeys.length, 1);
         assert.equal(maneuverKeys[0], Maneuver.STRAIGHT_1_STANDARD);
      });

      QUnit.test("ion token 2", function(assert)
      {
         // Setup.
         var store00 = Redux.createStore(Reducer.root);
         var agent1 = new Agent(store00, "Imperial Agent");
         var agent2 = new Agent(store00, "Rebel Agent");
         var token = new CardInstance(store00, PilotCard.ACADEMY_PILOT, agent1);

         var store = Redux.createStore(Reducer.root);
         var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [token]);
         var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", []);
         var environment = new Environment(store, agent1, squad1, agent2, squad2, [new Position(200, 200, 0)]);
         var tokens = environment.pilotInstances();
         token = tokens[0];
         var maneuverAction = new ManeuverAction(store, token.id(), Maneuver.STRAIGHT_1_STANDARD);

         // Run.
         maneuverAction.doIt();

         // Verify.
         assert.equal(token.ionCount(), 0);
      });

      QUnit.test("isCloaked()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.SIGMA_SQUADRON_PILOT, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));

         // Run / Verify.
         assert.ok(!token.isCloaked());
         assert.equal(token.agilityValue(), 2);
         store.dispatch(CardAction.addCloakCount(token));
         assert.ok(token.isCloaked());
         assert.equal(token.agilityValue(), 4);
      });

      QUnit.test("isCriticallyDamagedWith() none", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         var damage = DamageCard.BLINDED_PILOT;

         // Run / Verify.
         assert.ok(!token.isCriticallyDamagedWith(damage));
      });

      QUnit.test("isCriticallyDamagedWith()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var damage = new CardInstance(store, DamageCard.BLINDED_PILOT);
         assert.ok(!token.isCriticallyDamagedWith(damage));
         token.receiveCriticalDamage(damage);

         // Run / Verify.
         assert.ok(token.isCriticallyDamagedWith(damage.card().key));
      });

      QUnit.test("isDestroyed()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));

         // Run / Verify.
         assert.ok(!token.isDestroyed());
         token.receiveCriticalDamage(new CardInstance(store, DamageCard.BLINDED_PILOT));
         assert.ok(!token.isDestroyed());
         token.receiveDamage(new CardInstance(store, DamageCard.CONSOLE_FIRE));
         assert.ok(!token.isDestroyed());
         token.receiveCriticalDamage(new CardInstance(store, DamageCard.DAMAGED_COCKPIT));
         assert.ok(token.isDestroyed());
      });

      QUnit.test("isDestroyed() CR90", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);
         var tokenFore = token.tokenFore();
         var i;
         for (i = 0; i < tokenFore.hullValue() - 1; i++)
         {
            tokenFore.receiveDamage(new CardInstance(store, DamageCard.DAMAGED_COCKPIT));
         }
         var tokenAft = token.tokenAft();
         for (i = 0; i < tokenAft.hullValue() - 1; i++)
         {
            tokenAft.receiveDamage(new CardInstance(store, DamageCard.DAMAGED_COCKPIT));
         }
         assert.equal(token.isDestroyed(), false);

         // Run / Verify.
         tokenFore.receiveDamage(new CardInstance(store, DamageCard.DAMAGED_COCKPIT));
         assert.equal(token.isDestroyed(), false);
         tokenAft.receiveDamage(new CardInstance(store, DamageCard.DAMAGED_COCKPIT));
         assert.equal(token.isDestroyed(), true);
      });

      QUnit.test("isHuge()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "Imperial Agent");
         assert.ok(!(new CardInstance(store, PilotCard.ACADEMY_PILOT, agent).isHuge())); // small
         assert.ok(!(new CardInstance(store, PilotCard.CAPTAIN_OICUNN, agent).isHuge())); // large
         assert.ok(new CardInstance(store, PilotCard.GR_75_MEDIUM_TRANSPORT, agent).isHuge()); // huge1
         assert.ok(new CardInstance(store, PilotCard.CR90_CORVETTE, agent).isHuge()); // huge2
      });

      QUnit.test("isStressed()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         assert.ok(!token.isStressed());

         // Run / Verify.
         store.dispatch(CardAction.addStressCount(token));
         assert.ok(token.isStressed());
      });

      QUnit.test("isTouching() false", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         //  var store = environment.store();
         var pilotInstances = environment.pilotInstances();
         assert.equal(pilotInstances.length, 3);
         var pilotInstance1 = pilotInstances[0];
         var pilotInstance2 = pilotInstances[1];
         var pilotInstance3 = pilotInstances[2];
         //  store.dispatch(EnvironmentAction.addTouching(pilotInstance1, pilotInstance2));
         //  store.dispatch(EnvironmentAction.addTouching(pilotInstance2, pilotInstance3));
         //  store.dispatch(EnvironmentAction.addTouching(pilotInstance3, pilotInstance1));

         // Run / Verify.
         assert.equal(pilotInstance1.isTouching(), false);
         assert.equal(pilotInstance2.isTouching(), false);
         assert.equal(pilotInstance3.isTouching(), false);
      });

      QUnit.test("isTouching() true", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var pilotInstances = environment.pilotInstances();
         assert.equal(pilotInstances.length, 3);
         var pilotInstance1 = pilotInstances[0];
         var pilotInstance2 = pilotInstances[1];
         var pilotInstance3 = pilotInstances[2];
         store.dispatch(EnvironmentAction.addTouching(pilotInstance1, pilotInstance2));
         store.dispatch(EnvironmentAction.addTouching(pilotInstance2, pilotInstance3));
         store.dispatch(EnvironmentAction.addTouching(pilotInstance3, pilotInstance1));

         // Run / Verify.
         assert.equal(pilotInstance1.isTouching(), true);
         assert.equal(pilotInstance2.isTouching(), true);
         assert.equal(pilotInstance3.isTouching(), true);
      });

      QUnit.test("isTouching() another", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var pilotInstances = environment.pilotInstances();
         assert.equal(pilotInstances.length, 3);
         var pilotInstance1 = pilotInstances[0];
         var pilotInstance2 = pilotInstances[1];
         var pilotInstance3 = pilotInstances[2];
         store.dispatch(EnvironmentAction.addTouching(pilotInstance1, pilotInstance2));
         store.dispatch(EnvironmentAction.addTouching(pilotInstance2, pilotInstance3));
         store.dispatch(EnvironmentAction.addTouching(pilotInstance3, pilotInstance1));

         // Run / Verify.
         assert.equal(pilotInstance1.isTouching(pilotInstance1), false);
         assert.equal(pilotInstance1.isTouching(pilotInstance2), true);
         assert.equal(pilotInstance1.isTouching(pilotInstance3), true);

         assert.equal(pilotInstance2.isTouching(pilotInstance1), true);
         assert.equal(pilotInstance2.isTouching(pilotInstance2), false);
         assert.equal(pilotInstance2.isTouching(pilotInstance3), true);

         assert.equal(pilotInstance3.isTouching(pilotInstance1), true);
         assert.equal(pilotInstance3.isTouching(pilotInstance2), true);
         assert.equal(pilotInstance3.isTouching(pilotInstance3), false);
      });

      QUnit.test("isUpgradedWith() none", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var upgrade = UpgradeCard.ADRENALINE_RUSH;
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);

         // Run / Verify.
         assert.ok(!token.isUpgradedWith(upgrade));
      });

      QUnit.test("isUpgradedWith()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var upgrade = UpgradeCard.ADRENALINE_RUSH;
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent, [upgrade]);

         // Run / Verify.
         assert.ok(token.isUpgradedWith(upgrade));
      });

      QUnit.test("maneuverKeys()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);

         // Run.
         var result = token.maneuverKeys();

         // Verify.
         assert.equal(result.length, 16);
      });

      QUnit.test("maneuverKeys() stressed", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         store.dispatch(CardAction.addStressCount(token));

         // Run.
         var result = token.maneuverKeys();

         // Verify.
         assert.equal(result.length, 14);
      });

      QUnit.test("maneuverKeys() Damaged Engine", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         token.receiveCriticalDamage(new CardInstance(store, DamageCard.DAMAGED_ENGINE));

         // Run.
         var result = token.maneuverKeys();

         // Verify.
         assert.equal(result.length, 16);
         result.forEach(function(maneuver)
         {
            var maneuverProps = Maneuver.properties[maneuver];
            if (maneuverProps.bearing === Bearing.TURN_LEFT || maneuverProps.bearing === Bearing.TURN_RIGHT)
            {
               assert.equal(maneuverProps.difficulty, Difficulty.HARD);
            }
         });
      });

      QUnit.test("maneuverKeys() Nien Nunb crew", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.CHEWBACCA_REBEL, agent, [UpgradeCard.NIEN_NUNB]);

         // Run.
         var result = token.maneuverKeys();

         // Verify.
         assert.equal(result.length, 16);
         result.forEach(function(maneuver)
         {
            var maneuverProps = Maneuver.properties[maneuver];
            if (maneuverProps.bearing === Bearing.STRAIGHT)
            {
               assert.equal(maneuverProps.difficulty, Difficulty.EASY);
            }
         });
      });

      QUnit.test("maneuverKeys() R2 Astromech", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent, [UpgradeCard.R2_ASTROMECH]);

         // Run.
         var result = token.maneuverKeys();

         // Verify.
         assert.equal(result.length, 15);
         result.forEach(function(maneuver)
         {
            var maneuverProps = Maneuver.properties[maneuver];
            if (maneuverProps.speed === 1 || maneuverProps.speed === 2)
            {
               assert.equal(maneuverProps.difficultyKey, Difficulty.EASY);
            }
         });
      });

      QUnit.test("maneuverKeys() Twin Ion Engine Mk. II", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, agent, [UpgradeCard.TWIN_ION_ENGINE_MKII]);

         // Run.
         var result = token.maneuverKeys();

         // Verify.
         assert.equal(result.length, 16);
         result.forEach(function(maneuver)
         {
            var maneuverProps = Maneuver.properties[maneuver];
            if (maneuverProps.bearing === Bearing.BANK_LEFT || maneuverProps.bearing === Bearing.BANK_RIGHT)
            {
               assert.equal(maneuverProps.difficultyKey, Difficulty.EASY);
            }
         });
      });

      QUnit.test("maneuverKeys() Unhinged Astromech", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "Scum Agent");
         var token = new CardInstance(store, PilotCard.DREA_RENTHAL, agent, [UpgradeCard.UNHINGED_ASTROMECH]);

         // Run.
         var result = token.maneuverKeys();

         // Verify.
         assert.equal(result.length, 15);
         result.forEach(function(maneuver)
         {
            var maneuverProps = Maneuver.properties[maneuver];
            if (!maneuverProps)
            {
               throw "Unknown maneuver: " + maneuver;
            }
            if (maneuverProps.speed === 3)
            {
               assert.equal(maneuverProps.difficultyKey, Difficulty.EASY);
            }
         });
      });

      QUnit.test("name() condition instance", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var condition = new CardInstance(store, ConditionCard.FANATICAL_DEVOTION);

         // Run / Verify.
         assert.equal(condition.name(), "1 \u2022 Fanatical Devotion");
      });

      QUnit.test("name() damage instance", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var damage = new CardInstance(store, DamageCard.DAMAGED_ENGINE_V2);

         // Run / Verify.
         assert.equal(damage.name(), "1 Damaged Engine v2");
      });

      QUnit.test("name() pilot instance", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();

         // Run / Verify.
         assert.equal(environment.pilotInstances().length, 3);
         var i = 0;
         assert.equal(environment.pilotInstances()[i++].name(), "34 \u2022 \"Mauler Mithel\" (TIE Fighter)");
         assert.equal(environment.pilotInstances()[i++].name(), "36 \u2022 \"Dark Curse\" (TIE Fighter)");
         assert.equal(environment.pilotInstances()[i++].name(), "37 \u2022 Luke Skywalker (X-Wing)");
      });

      QUnit.test("name() upgrade instance", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var upgrade = new CardInstance(store, UpgradeCard.ADRENALINE_RUSH);

         // Run / Verify.
         assert.equal(upgrade.name(), "1 Adrenaline Rush");
      });

      QUnit.test("pilotInstancesTouching()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var pilotInstances = environment.pilotInstances();
         assert.equal(pilotInstances.length, 3);
         var pilotInstance1 = pilotInstances[0];
         var pilotInstance2 = pilotInstances[1];
         var pilotInstance3 = pilotInstances[2];
         store.dispatch(EnvironmentAction.addTouching(pilotInstance1, pilotInstance2));
         store.dispatch(EnvironmentAction.addTouching(pilotInstance2, pilotInstance3));
         store.dispatch(EnvironmentAction.addTouching(pilotInstance3, pilotInstance1));

         // Run.
         var result = pilotInstance1.pilotInstancesTouching();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0].id(), 36);
         assert.equal(result[0].card().key, "darkCurse");
         assert.equal(result[1].id(), 37);
         assert.equal(result[1].card().key, "lukeSkywalker");
      });

      QUnit.test("pilotSkillValue()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         var token1 = new CardInstance(store, PilotCard.BOUNTY_HUNTER, imperialAgent);
         var token2 = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);

         // Run / Verify.
         assert.equal(token0.pilotSkillValue(), 1);
         assert.equal(token1.pilotSkillValue(), 3);
         assert.equal(token2.pilotSkillValue(), 2);
      });

      QUnit.test("pilotSkillValue() Epsilon Ace 1", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.EPSILON_ACE, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));

         // Run / Verify.
         assert.equal(token.pilotSkillValue(), 12);
         assert.equal(token.primaryWeaponValue(), 2);
         assert.equal(token.agilityValue(), 3);
         assert.equal(token.hullValue(), 3);
         assert.equal(token.shieldValue(), 1);
      });

      QUnit.test("pilotSkillValue() Epsilon Ace 2", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.EPSILON_ACE, imperialAgent, [UpgradeCard.DETERMINATION]);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));

         // Run / Verify.
         assert.equal(token.pilotSkillValue(), 12);
         assert.equal(token.primaryWeaponValue(), 2);
         assert.equal(token.agilityValue(), 3);
         assert.equal(token.hullValue(), 3);
         assert.equal(token.shieldValue(), 1);
      });

      QUnit.test("pilotSkillValue() Poe Dameron and Veteran Instincts", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.POE_DAMERON, agent, [UpgradeCard.VETERAN_INSTINCTS]);

         // Run / Verify.
         assert.equal(token.pilotSkillValue(), 10);
         assert.equal(token.primaryWeaponValue(), 3);
         assert.equal(token.agilityValue(), 2);
         assert.equal(token.hullValue(), 3);
         assert.equal(token.shieldValue(), 3);
      });

      QUnit.test("pilotSkillValue() Whisper and Veteran Instincts", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.WHISPER, imperialAgent, [UpgradeCard.ADVANCED_CLOAKING_DEVICE, UpgradeCard.REBEL_CAPTIVE, UpgradeCard.VETERAN_INSTINCTS]);

         // Run / Verify.
         assert.equal(token.pilotSkillValue(), 9);
         assert.equal(token.primaryWeaponValue(), 4);
         assert.equal(token.agilityValue(), 2);
         assert.equal(token.hullValue(), 2);
         assert.equal(token.shieldValue(), 2);
      });

      QUnit.test("pilotSkillValue() Damaged Cockpit", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         assert.equal(token.pilotSkillValue(), 1);

         // Run.
         token.receiveCriticalDamage(new CardInstance(store, DamageCard.DAMAGED_COCKPIT));

         // Verify.
         assert.equal(token.criticalDamageKeys().size, 1);
         assert.equal(token.criticalDamageKeys().get(0), DamageCard.DAMAGED_COCKPIT);
         assert.equal(token.pilotSkillValue(), 0);
      });

      QUnit.test("pilotSkillValue() Injured Pilot", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         assert.equal(token.pilotSkillValue(), 1);

         // Run / Verify.
         token.receiveCriticalDamage(new CardInstance(store, DamageCard.INJURED_PILOT));
         assert.equal(token.pilotSkillValue(), 0);
      });

      QUnit.test("primaryWeaponValue()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         var token1 = new CardInstance(store, PilotCard.BOUNTY_HUNTER, imperialAgent);
         var token2 = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);

         // Run / Verify.
         assert.equal(token0.primaryWeaponValue(), 2);
         assert.equal(token1.primaryWeaponValue(), 3);
         assert.equal(token2.primaryWeaponValue(), 3);
      });

      QUnit.test("primaryWeaponValue() Weapon Malfunction", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         assert.equal(token.primaryWeaponValue(), 2);

         // Run / Verify.
         token.receiveCriticalDamage(new CardInstance(store, DamageCard.WEAPON_MALFUNCTION));
         assert.equal(token.primaryWeaponValue(), 1);
      });

      QUnit.test("receiveCriticalDamage()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var damage = new CardInstance(store, DamageCard.BLINDED_PILOT);
         assert.equal(token.criticalDamageCount(), 0);
         assert.ok(!token.isCriticallyDamagedWith(damage));

         // Run.
         token.receiveCriticalDamage(damage);

         // Verify.
         assert.equal(token.criticalDamageCount(), 1);
         assert.ok(token.isCriticallyDamagedWith(damage.card().key));
      });

      QUnit.test("receiveCriticalDamage() Chewbacca", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.CHEWBACCA_REBEL, agent);
         var damage = new CardInstance(store, DamageCard.BLINDED_PILOT);
         assert.equal(token.damageCount(), 0);
         assert.equal(token.criticalDamageCount(), 0);

         // Run.
         token.receiveCriticalDamage(damage);

         // Verify.
         assert.equal(token.damageCount(), 1);
         assert.equal(token.criticalDamageCount(), 0);
      });

      QUnit.test("receiveDamage()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         var damage = new CardInstance(store, DamageCard.BLINDED_PILOT);
         assert.equal(token.damageCount(), 0);

         // Run.
         token.receiveDamage(damage);

         // Verify.
         assert.equal(token.damageCount(), 1);
      });

      QUnit.test("recoverShield() increase to limit", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent);
         assert.equal(token.shieldValue(), 2);
         assert.equal(token.shieldCount(), 2);
         token.recoverShield();
         assert.equal(token.shieldCount(), 2); // stopped at limit
         store.dispatch(CardAction.addShieldCount(token, -1));
         assert.equal(token.shieldCount(), 1);
         token.recoverShield();
         assert.equal(token.shieldCount(), 2);
         token.recoverShield();
         assert.equal(token.shieldCount(), 2); // stopped at limit
      });

      QUnit.test("removeCriticalDamage()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var damage = new CardInstance(store, DamageCard.BLINDED_PILOT);
         token.receiveCriticalDamage(damage);
         assert.ok(token.isCriticallyDamagedWith(damage.card().key));

         // Run.
         token.removeCriticalDamage(damage);

         // Verify.
         assert.ok(!token.isCriticallyDamagedWith(damage));
      });

      QUnit.test("removeStress()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var token = environment.pilotInstances()[2]; // X-Wing
         store.dispatch(CardAction.addStressCount(token));
         assert.equal(token.stressCount(), 1);

         // Run.
         token.removeStress();

         // Verify.
         assert.equal(token.stressCount(), 0);
      });

      QUnit.test("removeStress() Kyle Katarn", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var token = environment.pilotInstances()[2]; // X-Wing
         var upgrade = new CardInstance(store, UpgradeCard.properties[UpgradeCard.KYLE_KATARN]);
         store.dispatch(CardAction.addUpgrade(token, upgrade));
         store.dispatch(CardAction.addStressCount(token));
         assert.equal(token.focusCount(), 0);
         assert.equal(token.stressCount(), 1);

         // Run.
         token.removeStress();

         // Verify.
         assert.equal(token.focusCount(), 1);
         assert.equal(token.stressCount(), 0);
      });

      QUnit.test("secondaryWeapons()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.DASH_RENDAR, rebelAgent, [UpgradeCard.OUTRIDER, UpgradeCard.CALCULATION, UpgradeCard.MANGLER_CANNON, UpgradeCard.CLUSTER_MISSILES, UpgradeCard.ENGINE_UPGRADE]);

         // Run.
         var result = token.secondaryWeapons();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0].name(), "\"Mangler\" Cannon");
         assert.equal(result[1].name(), "Cluster Missiles");
      });

      QUnit.test("shieldCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         assert.equal(token0.shieldCount(), 0);
         store.dispatch(CardAction.addShieldCount(token0));
         assert.equal(token0.shieldCount(), 1);
         store.dispatch(CardAction.addShieldCount(token0, -1));
         assert.equal(token0.shieldCount(), 0);
         store.dispatch(CardAction.addShieldCount(token0, -1));
         assert.equal(token0.shieldCount(), 0);
      });

      QUnit.test("shieldValue()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         var token1 = new CardInstance(store, PilotCard.BOUNTY_HUNTER, imperialAgent);
         var token2 = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);

         // Run / Verify.
         assert.equal(token0.shieldValue(), 0);
         assert.equal(token1.shieldValue(), 4);
         assert.equal(token2.shieldValue(), 2);
      });

      QUnit.test("shipActions() Rookie Pilot", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.ROOKIE_PILOT, rebelAgent);

         // Run.
         var result = token.shipActions();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0], "focus");
         assert.equal(result[1], "targetLock");
      });

      QUnit.test("shipState() Gozanti-class Cruiser", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "name");
         var token = new CardInstance(store, PilotCard.GOZANTI_CLASS_CRUISER, agent);

         // Run / Verify.
         assert.equal(token.shipState(Value.PILOT_SKILL), 2);
         assert.equal(token.shipState(Value.PRIMARY_WEAPON), undefined);
         assert.equal(token.shipState(Value.ENERGY), 4);
         assert.equal(token.shipState(Value.AGILITY), 0);
         assert.equal(token.shipState(Value.HULL), 9);
         assert.equal(token.shipState(Value.SHIELD), 5);
      });

      QUnit.test("shipState() X-Wing", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "name");
         var token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent);

         // Run / Verify.
         assert.equal(token.shipState(Value.PILOT_SKILL), 8);
         assert.equal(token.shipState(Value.PRIMARY_WEAPON), 3);
         assert.equal(token.shipState(Value.AGILITY), 2);
         assert.equal(token.shipState(Value.HULL), 3);
         assert.equal(token.shipState(Value.SHIELD), 2);
      });

      QUnit.test("squadPointCost() X-Wing", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "name");
         var token = new CardInstance(store, PilotCard.LUKE_SKYWALKER, agent, [UpgradeCard.R2_D2_ASTROMECH, UpgradeCard.VETERAN_INSTINCTS]);

         // Run / Verify.
         assert.equal(token.squadPointCost(), 33);
      });

      QUnit.test("stressCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         assert.equal(token0.stressCount(), 0);
         store.dispatch(CardAction.addStressCount(token0));
         assert.equal(token0.stressCount(), 1);
         store.dispatch(CardAction.addStressCount(token0, -1));
         assert.equal(token0.stressCount(), 0);
         store.dispatch(CardAction.addStressCount(token0, -1));
         assert.equal(token0.stressCount(), 0);
      });

      QUnit.test("toString()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);

         // Run / Verify.
         assert.equal(token.toString(), "1 Academy Pilot (TIE Fighter) pilot");
      });

      QUnit.test("tokenAft()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);

         // Run.
         var result = token.tokenAft();

         // Verify.
         assert.ok(result);
         assert.equal(result.card().key, "cr90Corvette.aft");
      });

      QUnit.test("tokenAft() crippled", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);
         var tokenAft = token.tokenAft();
         for (var i = 0; i < tokenAft.hullValue(); i++)
         {
            token.tokenAft().receiveDamage(new CardInstance(store, DamageCard.BLINDED_PILOT));
         }
         assert.equal(tokenAft.isDestroyed(), true);

         // Run.
         var result = token.tokenAft();

         // Verify.
         assert.ok(result);
         assert.equal(result.card().key, "cr90Corvette.crippledAft");
      });

      QUnit.test("tokenFore()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);

         // Run.
         var result = token.tokenFore();

         // Verify.
         assert.ok(result);
         assert.equal(result.card().key, "cr90Corvette.fore");
      });

      QUnit.test("tokenFore() crippled", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);
         var tokenFore = token.tokenFore();
         for (var i = 0; i < tokenFore.hullValue(); i++)
         {
            token.tokenFore().receiveDamage(new CardInstance(store, DamageCard.BLINDED_PILOT));
         }
         assert.ok(tokenFore.isDestroyed());

         // Run.
         var result = token.tokenFore();

         // Verify.
         assert.ok(result);
         assert.equal(result.card().key, "cr90Corvette.crippledFore");
      });

      QUnit.test("tokenFore().ship()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store, "Rebel Agent");
         var token = new CardInstance(store, PilotCard.CR90_CORVETTE, rebelAgent, [UpgradeCard.QUAD_LASER_CANNONS, UpgradeCard.SENSOR_TEAM, UpgradeCard.EM_EMITTER], [UpgradeCard.FREQUENCY_JAMMER]);

         // Run.
         var result = token.tokenFore().ship();

         // Verify.
         assert.ok(result);
         assert.equal(result.key, "cr90Corvette.fore");
      });

      QUnit.test("totalDamage()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var token = environment.pilotInstances()[0]; // TIE Fighter.
         assert.equal(token.damageCount(), 0);
         assert.equal(token.criticalDamageCount(), 0);
         assert.equal(token.totalDamage(), 0);
         assert.ok(!token.isDestroyed());

         // Run.
         store.dispatch(CardAction.addDamage(token, new CardInstance(store, DamageCard.BLINDED_PILOT)));

         // Verify.
         assert.equal(token.damageCount(), 0);
         assert.equal(token.criticalDamageCount(), 1);
         assert.equal(token.totalDamage(), 1);
         assert.ok(!token.isDestroyed());

         // Run.
         store.dispatch(CardAction.addDamage(token, new CardInstance(store, DamageCard.DIRECT_HIT)));

         // Verify.
         assert.equal(token.damageCount(), 0);
         assert.equal(token.criticalDamageCount(), 2);
         assert.equal(token.totalDamage(), 3);
         assert.ok(token.isDestroyed());
      });

      QUnit.test("unfriendlyPilotInstancesTouching() Imperial", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var pilotInstances = environment.pilotInstances();
         assert.equal(pilotInstances.length, 3);
         var pilotInstance1 = pilotInstances[0];
         var pilotInstance2 = pilotInstances[1];
         var pilotInstance3 = pilotInstances[2];
         store.dispatch(EnvironmentAction.addTouching(pilotInstance1, pilotInstance2));
         store.dispatch(EnvironmentAction.addTouching(pilotInstance2, pilotInstance3));
         store.dispatch(EnvironmentAction.addTouching(pilotInstance3, pilotInstance1));

         // Run.
         var result = pilotInstance1.unfriendlyPilotInstancesTouching();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
         assert.equal(result[0].id(), 37);
         assert.equal(result[0].card().key, "lukeSkywalker");
      });

      QUnit.test("unfriendlyPilotInstancesTouching() Rebel", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var pilotInstances = environment.pilotInstances();
         assert.equal(pilotInstances.length, 3);
         var pilotInstance1 = pilotInstances[0];
         var pilotInstance2 = pilotInstances[1];
         var pilotInstance3 = pilotInstances[2];
         store.dispatch(EnvironmentAction.addTouching(pilotInstance1, pilotInstance2));
         store.dispatch(EnvironmentAction.addTouching(pilotInstance2, pilotInstance3));
         store.dispatch(EnvironmentAction.addTouching(pilotInstance3, pilotInstance1));

         // Run.
         var result = pilotInstance3.unfriendlyPilotInstancesTouching();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0].id(), 36);
         assert.equal(result[0].card().key, "darkCurse");
         assert.equal(result[1].id(), 34);
         assert.equal(result[1].card().key, "maulerMithel");
      });

      QUnit.test("upgradeKeys()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var tokens = environment.pilotInstances();
         var token0 = tokens[0]; // TIE Fighter.
         var token1 = tokens[1]; // TIE Fighter.
         var token2 = tokens[2]; // X-Wing.

         // Run / Verify.
         assert.ok(token0.upgradeKeys());
         assert.equal(token0.upgradeKeys().size, 1);
         assert.ok(token1.upgradeKeys());
         assert.equal(token1.upgradeKeys().size, 0);
         assert.ok(token2.upgradeKeys());
         assert.equal(token2.upgradeKeys().size, 2);
      });

      QUnit.test("upgrades()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var tokens = environment.pilotInstances();
         var token0 = tokens[0]; // TIE Fighter.
         var token1 = tokens[1]; // TIE Fighter.
         var token2 = tokens[2]; // X-Wing.

         // Run / Verify.
         assert.ok(token0.upgrades());
         assert.equal(token0.upgrades().size, 1);
         assert.ok(token1.upgrades());
         assert.equal(token1.upgrades().size, 0);
         assert.ok(token2.upgrades());
         assert.equal(token2.upgrades().size, 2);
      });

      QUnit.test("usableDamageAbilities()", function(assert)
      {
         // Setup.
         var store00 = Redux.createStore(Reducer.root);
         var agent1 = new Agent(store00, "name1");
         var agent2 = new Agent(store00, "name2");
         var token = new CardInstance(store00, PilotCard.ACADEMY_PILOT, agent1);

         var store = Redux.createStore(Reducer.root);
         var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [token]);
         var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", []);
         var environment = new Environment(store, agent1, squad1, agent2, squad2, [new Position(300, 300, 0)]);
         var tokens = environment.pilotInstances();
         token = tokens[0];

         var abilityType = DamageAbility2;
         var abilityKey = Phase.ACTIVATION_PERFORM_ACTION;
         environment.setActiveToken(token);

         // Run.
         var result = token.usableDamageAbilities(abilityType, abilityKey);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 0);

         // Run.
         var damageKey = DamageCard.CONSOLE_FIRE;
         store.dispatch(CardAction.addDamage(token, new CardInstance(store, damageKey)));
         result = token.usableDamageAbilities(abilityType, abilityKey);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
         assert.equal(result[0].sourceKey(), damageKey);
      });

      QUnit.test("usablePilotAbilities()", function(assert)
      {
         // Setup.
         var pilotKey = PilotCard.COUNTESS_RYAD;
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var token0 = environment.pilotInstances()[0]; // TIE Fighter.
         var agent = token0.agent();
         var token = new CardInstance(store, pilotKey, agent);
         var maneuverKey = Maneuver.BANK_LEFT_2_STANDARD;
         var abilityType = PilotAbility2;
         var abilityKey = Phase.ACTIVATION_REVEAL_DIAL;
         var maneuver = Maneuver.properties[maneuverKey];
         store.dispatch(EnvironmentAction.placeToken(new Position(400, 400, 0), token));
         store.dispatch(Action.setTokenManeuver(token, maneuver));
         environment.setActiveToken(token);
         var callback = function() {};
         ActivationAction.create(store, token.id(), callback);
         store.dispatch(Action.setTokenManeuver(token, maneuver));

         // Run.
         var result = token.usablePilotAbilities(abilityType, abilityKey);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 0);

         // Run.
         maneuver = Maneuver.properties[Maneuver.STRAIGHT_1_EASY];
         store.dispatch(Action.setTokenManeuver(token, maneuver));
         result = token.usablePilotAbilities(abilityType, abilityKey);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
         assert.equal(result[0].sourceKey(), pilotKey);
      });

      QUnit.test("usableUpgradeAbilities()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var token = environment.pilotInstances()[2]; // X-Wing.
         var maneuverKey = Maneuver.STRAIGHT_1_STANDARD;
         var abilityType = UpgradeAbility2;
         var abilityKey = Phase.ACTIVATION_REVEAL_DIAL;
         var maneuver = Maneuver.properties[maneuverKey];
         var upgrade = new CardInstance(store, UpgradeCard.ADRENALINE_RUSH);
         store.dispatch(CardAction.addUpgrade(token, upgrade));
         environment.setActiveToken(token);
         var callback = function() {};
         ActivationAction.create(store, token.id(), callback);
         store.dispatch(Action.setTokenManeuver(token, maneuver));

         // Run.
         var result = token.usableUpgradeAbilities(abilityType, abilityKey);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 0);

         // Run.
         maneuver = Maneuver.properties[Maneuver.STRAIGHT_4_HARD];
         store.dispatch(Action.setTokenManeuver(token, maneuver));
         result = token.usableUpgradeAbilities(abilityType, abilityKey);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
         assert.equal(result[0].sourceKey(), UpgradeCard.ADRENALINE_RUSH);
      });

      QUnit.test("usedAbilities()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
         var damage = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility3, Phase.COMBAT_DEAL_DAMAGE);
         var pilot = new Ability(PilotCard, PilotCard.ACADEMY_PILOT, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var shipAction = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
         var upgrade = new Ability(UpgradeCard, UpgradeCard.A_WING_TEST_PILOT, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         store.dispatch(CardAction.addUsedAbility(token, damage));
         store.dispatch(CardAction.addUsedAbility(token, pilot));
         store.dispatch(CardAction.addUsedAbility(token, shipAction));
         store.dispatch(CardAction.addUsedAbility(token, upgrade));

         // Run.
         var result = token.usedAbilities();

         // Verify.
         assert.ok(result);
         assert.equal(result.size, 4);
         assert.equal(result.get(0).source(), DamageCard);
         assert.equal(result.get(1).source(), PilotCard);
         assert.equal(result.get(2).source(), ShipAction);
         assert.equal(result.get(3).source(), UpgradeCard);
      });

      QUnit.test("usedAbilities() DamageCard", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
         var damage0 = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility3, Phase.COMBAT_DEAL_DAMAGE);
         var damage1 = new Ability(DamageCard, DamageCard.CONSOLE_FIRE, DamageAbility3, Phase.COMBAT_DEAL_DAMAGE);
         var pilot = new Ability(PilotCard, PilotCard.ACADEMY_PILOT, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var shipAction = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
         var upgrade = new Ability(UpgradeCard, UpgradeCard.A_WING_TEST_PILOT, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         store.dispatch(CardAction.addUsedAbility(token, damage0));
         store.dispatch(CardAction.addUsedAbility(token, damage1));
         store.dispatch(CardAction.addUsedAbility(token, pilot));
         store.dispatch(CardAction.addUsedAbility(token, shipAction));
         store.dispatch(CardAction.addUsedAbility(token, upgrade));

         // Run.
         var result = token.usedAbilities(DamageCard);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0].source(), DamageCard);
         assert.equal(result[0].sourceKey(), DamageCard.BLINDED_PILOT);
         assert.equal(result[1].source(), DamageCard);
         assert.equal(result[1].sourceKey(), DamageCard.CONSOLE_FIRE);
      });

      QUnit.test("usedAbilities() UpgradeCard A-Wing Test Pilot", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
         var damage = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility3, Phase.COMBAT_DEAL_DAMAGE);
         var pilot = new Ability(PilotCard, PilotCard.ACADEMY_PILOT, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var shipAction = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
         var upgrade0 = new Ability(UpgradeCard, UpgradeCard.A_WING_TEST_PILOT, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var upgrade1 = new Ability(UpgradeCard, UpgradeCard.ADRENALINE_RUSH, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         store.dispatch(CardAction.addUsedAbility(token, damage));
         store.dispatch(CardAction.addUsedAbility(token, pilot));
         store.dispatch(CardAction.addUsedAbility(token, shipAction));
         store.dispatch(CardAction.addUsedAbility(token, upgrade0));
         store.dispatch(CardAction.addUsedAbility(token, upgrade1));

         // Run.
         var result = token.usedAbilities(UpgradeCard);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0].source(), UpgradeCard);
         assert.equal(result[0].sourceKey(), UpgradeCard.A_WING_TEST_PILOT);
         assert.equal(result[1].source(), UpgradeCard);
         assert.equal(result[1].sourceKey(), UpgradeCard.ADRENALINE_RUSH);

         // Run.
         result = token.usedAbilities(UpgradeCard, UpgradeCard.A_WING_TEST_PILOT);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
         assert.equal(result[0].source(), UpgradeCard);
         assert.equal(result[0].sourceKey(), UpgradeCard.A_WING_TEST_PILOT);
      });

      QUnit.test("usedAbilityKeys()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial"));
         var damage = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility3, Phase.COMBAT_DEAL_DAMAGE);
         var pilot = new Ability(PilotCard, PilotCard.ACADEMY_PILOT, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var shipAction = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
         var upgrade = new Ability(UpgradeCard, UpgradeCard.A_WING_TEST_PILOT, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         store.dispatch(CardAction.addUsedAbility(token, damage));
         store.dispatch(CardAction.addUsedAbility(token, pilot));
         store.dispatch(CardAction.addUsedAbility(token, shipAction));
         store.dispatch(CardAction.addUsedAbility(token, upgrade));

         // Run.
         var result = token.usedAbilityKeys();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 4);
         assert.equal(result[0], DamageCard.BLINDED_PILOT);
         assert.equal(result[1], PilotCard.ACADEMY_PILOT);
         assert.equal(result[2], ShipAction.EVADE);
         assert.equal(result[3], UpgradeCard.A_WING_TEST_PILOT);
      });

      QUnit.test("weaponsDisabledCount()", function(assert)
      {
         var store = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store, "Imperial Agent");
         var token0 = new CardInstance(store, PilotCard.ACADEMY_PILOT, imperialAgent);
         assert.equal(token0.weaponsDisabledCount(), 0);
         store.dispatch(CardAction.addWeaponsDisabledCount(token0));
         assert.equal(token0.weaponsDisabledCount(), 1);
         store.dispatch(CardAction.addWeaponsDisabledCount(token0, -1));
         assert.equal(token0.weaponsDisabledCount(), 0);
         store.dispatch(CardAction.addWeaponsDisabledCount(token0, -1));
         assert.equal(token0.weaponsDisabledCount(), 0);
      });
   });
