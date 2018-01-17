"use strict";

define(["qunit", "redux",
  "artifact/js/Faction", "artifact/js/PilotCard", "artifact/js/PlayFormat", "artifact/js/Range", "artifact/js/Ship", "artifact/js/UpgradeCard",
   "model/js/Agent", "model/js/Environment", "model/js/Position", "model/js/Reducer", "model/js/Squad", "model/js/SquadBuilder", "model/js/TargetLock", "model/js/CardInstance", "model/js/CardAction",
  "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Redux, Faction, PilotCard, PlayFormat, Range, Ship, UpgradeCard,
      Agent, Environment, Position, Reducer, Squad, SquadBuilder, TargetLock, CardInstance, CardAction,
      EnvironmentFactory)
   {
      QUnit.module("Environment");

      QUnit.test("activeCardInstance()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var token0 = environment.pilotInstances()[0]; // TIE Fighter.
         assert.ok(!environment.activeCardInstance());

         // Run.
         environment.setActiveToken(token0);

         // Verify.
         assert.ok(environment.activeCardInstance().equals(token0));
      });

      QUnit.test("cardInstances()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();

         // Run.
         var result = environment.cardInstances();

         // Verify.
         assert.ok(result);
         result.sort(function(a, b)
         {
            return b.id() - a.id();
         });
         assert.equal(result.length, 39);
         assert.equal(result[5].card().key, PilotCard.MAULER_MITHEL);
         assert.equal(result[3].card().key, PilotCard.DARK_CURSE);
         assert.equal(result[2].card().key, PilotCard.LUKE_SKYWALKER);
      });

      QUnit.test("cardInstances() Huge", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createHugeShipEnvironment();

         // Run.
         var result = environment.cardInstances();

         // Verify.
         assert.ok(result);
         result.sort(function(a, b)
         {
            return b.id() - a.id();
         });
         assert.equal(result.length, 60);
         assert.equal(result[4].card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
         assert.equal(result[6].card().key, PilotCard.WES_JANSON);
         assert.equal(result[21].card().key, PilotCard.CR90_CORVETTE);
         assert.equal(result[24].card().key, PilotCard.RAIDER_CLASS_CORVETTE);
         assert.equal(result[25].card().key, PilotCard.JUNO_ECLIPSE);
         assert.equal(result[26].card().key, PilotCard.GOZANTI_CLASS_CRUISER);
      });

      QUnit.test("createWeaponToRangeToDefenders() one", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attackerPosition0 = new Position(458, 895, -90); // X-Wing.
         var attacker = environment.getTokenAt(attackerPosition0);
         var attackerPosition = new Position(300, 70, -90);
         environment.moveToken(attackerPosition0, attackerPosition);
         var weapon = attacker.primaryWeapon();

         // Run.
         var result = environment.createWeaponToRangeToDefenders(attacker);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
         {
            var weaponToRangeToDefenders = result[0];
            weapon = weaponToRangeToDefenders.weapon;
            assert.equal(weapon.name(), attacker.primaryWeapon().name());
            assert.equal(weapon.weaponValue(), attacker.primaryWeapon().weaponValue());

            var rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
            assert.ok(rangeToDefendersArray);
            assert.equal(rangeToDefendersArray.length, 1);

            var rangeToDefenders = rangeToDefendersArray[0];
            assert.equal(rangeToDefenders.range, Range.ONE);

            var defenders = rangeToDefenders.defenders;
            assert.ok(defenders);
            assert.equal(defenders.length, 1);
         }
      });

      QUnit.test("createWeaponToRangeToDefenders() four", function(assert)
      {
         // Setup.
         var store00 = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store00, "Imperial Agent");
         var rebelAgent = new Agent(store00, "Rebel Agent");
         var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2016, "squad1", [
                 new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent),
                 new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent),
                 new CardInstance(store00, PilotCard.OBSIDIAN_SQUADRON_PILOT, imperialAgent),
                 new CardInstance(store00, PilotCard.OBSIDIAN_SQUADRON_PILOT, imperialAgent),
                 new CardInstance(store00, PilotCard.BLACK_SQUADRON_PILOT, imperialAgent),
                 new CardInstance(store00, PilotCard.BLACK_SQUADRON_PILOT, imperialAgent)
          ]);
         var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [UpgradeCard.OUTRIDER, UpgradeCard.CALCULATION, UpgradeCard.MANGLER_CANNON, UpgradeCard.BLASTER_TURRET, UpgradeCard.PROTON_TORPEDOES])]);

         var store = Redux.createStore(Reducer.root);
         var positions1 = [new Position(450, 845, 90), new Position(450, 795, 90), new Position(450, 745, 90), new Position(450, 695, 90), new Position(450, 645, 90), new Position(450, 595, 90)];
         var positions2 = [new Position(458, 895, -90)];
         var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);

         var attacker = environment.pilotInstances()[6];
         var defender3 = environment.pilotInstances()[3];
         store.dispatch(CardAction.addFocusCount(attacker));
         TargetLock.newInstance(store, attacker, defender3);

         // Run.
         var result = environment.createWeaponToRangeToDefenders(attacker);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 4);
         var weaponToRangeToDefenders, weapon, rangeToDefendersArray, rangeToDefenders, defenders;
         {
            weaponToRangeToDefenders = result[0];
            weapon = weaponToRangeToDefenders.weapon;
            // assert.equal(weapon, attacker.primaryWeapon());
            assert.equal(weapon.name(), attacker.primaryWeapon().name());
            assert.equal(weapon.weaponValue(), attacker.primaryWeapon().weaponValue());

            rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
            assert.ok(rangeToDefendersArray);
            assert.equal(rangeToDefendersArray.length, 3);

            rangeToDefenders = rangeToDefendersArray[0];
            assert.equal(rangeToDefenders.range, Range.ONE);
            defenders = rangeToDefenders.defenders;
            assert.ok(defenders);
            assert.equal(defenders.length, 3, "defenders.length === 3");

            rangeToDefenders = rangeToDefendersArray[1];
            assert.equal(rangeToDefenders.range, Range.TWO);
            defenders = rangeToDefenders.defenders;
            assert.ok(defenders);
            assert.equal(defenders.length, 2);

            rangeToDefenders = rangeToDefendersArray[2];
            assert.equal(rangeToDefenders.range, Range.THREE);
            defenders = rangeToDefenders.defenders;
            assert.ok(defenders);
            assert.equal(defenders.length, 1);
         }
         {
            weaponToRangeToDefenders = result[1];
            weapon = weaponToRangeToDefenders.weapon;
            assert.equal(weapon.upgradeKey(), UpgradeCard.MANGLER_CANNON);

            rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
            assert.ok(rangeToDefendersArray);
            assert.equal(rangeToDefendersArray.length, 3);

            rangeToDefenders = rangeToDefendersArray[0];
            assert.equal(rangeToDefenders.range, Range.ONE);
            defenders = rangeToDefenders.defenders;
            assert.ok(defenders);
            assert.equal(defenders.length, 3, "defenders.length === 3");

            rangeToDefenders = rangeToDefendersArray[1];
            assert.equal(rangeToDefenders.range, Range.TWO);
            defenders = rangeToDefenders.defenders;
            assert.ok(defenders);
            assert.equal(defenders.length, 2);

            rangeToDefenders = rangeToDefendersArray[2];
            assert.equal(rangeToDefenders.range, Range.THREE);
            defenders = rangeToDefenders.defenders;
            assert.ok(defenders);
            assert.equal(defenders.length, 1);
         }
         {
            weaponToRangeToDefenders = result[2];
            weapon = weaponToRangeToDefenders.weapon;
            assert.equal(weapon.upgradeKey(), UpgradeCard.BLASTER_TURRET);

            rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
            assert.ok(rangeToDefendersArray);
            assert.equal(rangeToDefendersArray.length, 2);

            rangeToDefenders = rangeToDefendersArray[0];
            assert.equal(rangeToDefenders.range, Range.ONE);
            defenders = rangeToDefenders.defenders;
            assert.ok(defenders);
            assert.equal(defenders.length, 3, "defenders.length === 3");

            rangeToDefenders = rangeToDefendersArray[1];
            assert.equal(rangeToDefenders.range, Range.TWO);
            defenders = rangeToDefenders.defenders;
            assert.ok(defenders);
            assert.equal(defenders.length, 2);
         }
         {
            weaponToRangeToDefenders = result[3];
            weapon = weaponToRangeToDefenders.weapon;
            assert.equal(weapon.upgradeKey(), UpgradeCard.PROTON_TORPEDOES);

            rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
            assert.ok(rangeToDefendersArray);
            assert.equal(rangeToDefendersArray.length, 1);

            rangeToDefenders = rangeToDefendersArray[0];
            assert.equal(rangeToDefenders.range, Range.TWO);
            defenders = rangeToDefenders.defenders;
            assert.ok(defenders);
            assert.equal(defenders.length, 1);
         }
      });

      QUnit.test("createWeaponToRangeToDefenders() one with weapon", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var attackerPosition0 = new Position(458, 895, -90); // X-Wing.
         var attacker = environment.getTokenAt(attackerPosition0);
         var attackerPosition = new Position(300, 220, -90);
         environment.moveToken(attackerPosition0, attackerPosition);
         var defender = environment.pilotInstances()[0]; // TIE Fighter
         var weapon = attacker.secondaryWeapons()[0]; // Proton Torpedoes
         assert.ok(weapon);
         assert.equal(weapon.name(), "Proton Torpedoes");
         TargetLock.newInstance(store, attacker, defender);
         assert.ok(attacker);
         assert.equal(environment.getPositionFor(attacker).x(), 300);
         assert.equal(environment.getPositionFor(attacker).y(), 220);

         // Run.
         var result = environment.createWeaponToRangeToDefenders(attacker, weapon);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1, "result.length === 1");
         {
            var weaponToRangeToDefenders = result[0];
            weapon = weaponToRangeToDefenders.weapon;
            assert.equal(weapon.name(), attacker.secondaryWeapons()[0].name());
            assert.equal(weapon.weaponValue(), attacker.secondaryWeapons()[0].weaponValue());

            var rangeToDefendersArray = weaponToRangeToDefenders.rangeToDefenders;
            assert.ok(rangeToDefendersArray);
            assert.equal(rangeToDefendersArray.length, 1);

            var rangeToDefenders = rangeToDefendersArray[0];
            assert.equal(rangeToDefenders.range, Range.TWO, "range === two");

            var defenders = rangeToDefenders.defenders;
            assert.ok(defenders);
            assert.equal(defenders.length, 1);
         }
      });

      QUnit.test("discardDamage()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var damage = environment.drawDamage();
         assert.equal(store.getState().damageDeck.size, 32);
         assert.equal(store.getState().damageDiscardPile.size, 0);

         // Run.
         environment.discardDamage(damage);

         // Verify.
         assert.equal(store.getState().damageDeck.size, 32);
         assert.equal(store.getState().damageDiscardPile.size, 1);
         assert.equal(CardInstance.get(store, store.getState().damageDiscardPile.get(0)).card().key, damage.card().key);
      });

      QUnit.test("drawDamage()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         assert.equal(store.getState().damageDeck.size, 33);
         assert.equal(store.getState().damageDiscardPile.size, 0);

         // Run.
         var result = environment.drawDamage();

         // Verify.
         assert.ok(result);
         assert.equal(store.getState().damageDeck.size, 32);
         assert.equal(store.getState().damageDiscardPile.size, 0);
      });

      QUnit.test("drawDamage() empty", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         for (var i = 0; i < 33; i++)
         {
            var damage = environment.drawDamage();
            environment.discardDamage(damage);
         }
         assert.equal(store.getState().damageDeck.size, 0);
         assert.equal(store.getState().damageDiscardPile.size, 33);

         // Run.
         var result = environment.drawDamage();

         // Verify.
         assert.ok(result);
         assert.equal(store.getState().damageDeck.size, 32);
         assert.equal(store.getState().damageDiscardPile.size, 0);
      });

      QUnit.test("getDefenders() Imperial vs Rebel", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attacker = environment.pilotInstances()[0]; // TIE Fighter.

         // Run.
         var result = environment.getDefenders(attacker);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
      });

      QUnit.test("getDefenders() Rebel vs Imperial", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attacker = environment.pilotInstances()[2]; // X-Wing.

         // Run.
         var result = environment.getDefenders(attacker);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
      });

      QUnit.test("getDefenders() Rebel vs Rebel", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent1 = new Agent(store, "1");
         var squad1 = SquadBuilder.findByNameAndYear("Worlds #2", 2016).buildSquad(agent1);
         var agent2 = new Agent(store, "2");
         var squad2 = SquadBuilder.findByNameAndYear("Worlds #4", 2016).buildSquad(agent1);
         var environment = new Environment(store, agent1, squad1, agent2, squad2);
         var attacker = environment.pilotInstances()[0]; // X-Wing.

         // Run.
         var result = environment.getDefenders(attacker);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.ok(result[0].equals(environment.pilotInstances()[2]));
         assert.ok(result[1].equals(environment.pilotInstances()[3]));
      });

      QUnit.test("getDefendersInRange()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attacker = environment.pilotInstances()[2]; // X-Wing
         var attackerPosition0 = environment.getPositionFor(attacker);
         var attackerPosition = new Position(458, 50, -90);
         environment.moveToken(attackerPosition0, attackerPosition);

         // Run.
         var result = environment.getDefendersInRange(attacker);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0].card().shipFaction.factionKey, Faction.IMPERIAL);
      });

      QUnit.test("getFriendlyTokensAtRange() zero", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attacker = environment.pilotInstances()[2]; // X-Wing
         var attackerPosition0 = environment.getPositionFor(attacker);
         var attackerPosition = new Position(458, 50, -90);
         environment.moveToken(attackerPosition0, attackerPosition);

         // Run.
         var result = environment.getFriendlyTokensAtRange(attacker, Range.TWO);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 0);
      });

      QUnit.test("getFriendlyTokensAtRange() one", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attacker = environment.pilotInstances()[0]; // TIE Fighter
         var attackerPosition0 = environment.getPositionFor(attacker);
         var attackerPosition = new Position(458, 50, -90);
         environment.moveToken(attackerPosition0, attackerPosition);

         // Run.
         var result = environment.getFriendlyTokensAtRange(attacker, Range.TWO);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
         assert.equal(result[0].card().key, PilotCard.DARK_CURSE);
      });

      QUnit.test("getPilotInstancesForAgent() First Order", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createTFACoreSetEnvironment();
         var agent = environment.firstAgent();

         // Run.
         var result = environment.getPilotInstancesForAgent(agent);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0].card().key, PilotCard.EPSILON_LEADER);
         assert.equal(result[1].card().key, PilotCard.ZETA_ACE);
      });

      QUnit.test("getPilotInstancesForAgent() Imperial", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var agent = environment.firstAgent();

         // Run.
         var result = environment.getPilotInstancesForAgent(agent);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0].card().key, PilotCard.MAULER_MITHEL);
         assert.equal(result[1].card().key, PilotCard.DARK_CURSE);
      });

      QUnit.test("getPilotInstancesForAgent() Imperial mixed teams", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var foAgent = new Agent(store, "First Order Agent");
         var resistanceAgent = new Agent(store, "Resistance Agent");
         var squad1 = SquadBuilder.findByNameAndYear("Worlds #3", 2016).buildSquad(foAgent);
         var squad2 = SquadBuilder.CoreSetResistanceSquadBuilder.buildSquad(resistanceAgent);
         var environment = new Environment(store, foAgent, squad1, resistanceAgent, squad2);
         var agent = environment.firstAgent();

         // Run.
         var result = environment.getPilotInstancesForAgent(agent);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 3);
         assert.equal(result[0].card().key, PilotCard.OMEGA_LEADER);
         assert.equal(result[1].card().key, PilotCard.COLONEL_VESSERY);
         assert.equal(result[2].card().key, PilotCard.OMICRON_GROUP_PILOT);
      });

      QUnit.test("getPilotInstancesForAgent() Rebel", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var agent = environment.secondAgent();

         // Run.
         var result = environment.getPilotInstancesForAgent(agent);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
         assert.equal(result[0].card().key, PilotCard.LUKE_SKYWALKER);
      });

      QUnit.test("getPilotInstancesForAgent() Resistance", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createTFACoreSetEnvironment();
         var agent = environment.secondAgent();

         // Run.
         var result = environment.getPilotInstancesForAgent(agent);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
         assert.equal(result[0].card().key, PilotCard.POE_DAMERON);
      });

      QUnit.test("getPositionFor()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var token = environment.pilotInstances()[0];
         var position = new Position(305, 20, 90);

         // Run.
         var result = environment.getPositionFor(token);

         // Verify.
         assert.ok(result);
         assert.strictEqual(result.toString(), position.toString());
      });

      QUnit.test("getPositionFor() Huge2", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createHugeShipEnvironment();
         var token = environment.pilotInstances()[3]; // CR90

         // Run.
         var result = environment.getPositionFor(token);

         // Verify.
         assert.ok(result);
         assert.equal(result.x(), 458);
         assert.equal(result.y(), 803);
         assert.equal(result.heading(), 270);

         // Run.
         result = environment.getPositionFor(token.tokenFore());

         // Verify.
         assert.ok(result);
         assert.equal(result.x(), 458);
         assert.equal(result.y(), 803 - 72);
         assert.equal(result.heading(), 270);

         // Run.
         result = environment.getPositionFor(token.tokenAft());

         // Verify.
         assert.ok(result);
         assert.equal(result.x(), 458);
         assert.equal(result.y(), 803 + 72);
         assert.equal(result.heading(), 270);
      });

      QUnit.test("getPositionFor() Huge2 330 deg", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createHugeShipEnvironment();
         var token = environment.pilotInstances()[3]; // CR90
         var fromPosition = new Position(458, 803, 270);
         var toPosition = new Position(458, 750, 330);
         environment.moveToken(fromPosition, toPosition);

         // Run.
         var result = environment.getPositionFor(token);

         // Verify.
         assert.ok(result);
         assert.equal(result.x(), 458);
         assert.equal(result.y(), 750);
         assert.equal(result.heading(), 330);

         // Run.
         result = environment.getPositionFor(token.tokenFore());

         // Verify.
         assert.ok(result);
         assert.equal(result.x(), 458 + 62);
         assert.equal(result.y(), 750 - 36);
         assert.equal(result.heading(), 330);

         // Run.
         result = environment.getPositionFor(token.tokenAft());

         // Verify.
         assert.ok(result);
         assert.equal(result.x(), 458 - 62);
         assert.equal(result.y(), 750 + 36);
         assert.equal(result.heading(), 330);
      });

      QUnit.test("getTargetableDefenders() none", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attackerPosition = new Position(458, 895, -90);
         var attacker = environment.getTokenAt(attackerPosition);
         var weapon = attacker.primaryWeapon();

         // Run.
         var result = environment.getTargetableDefenders(attacker, attackerPosition, weapon);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 0);
      });

      QUnit.test("getTargetableDefenders() one", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attackerPosition0 = new Position(458, 895, -90);
         var attacker = environment.getTokenAt(attackerPosition0);
         var attackerPosition = new Position(305, 70, -90);
         environment.moveToken(attackerPosition0, attackerPosition);
         var weapon = attacker.primaryWeapon();

         // Run.
         var result = environment.getTargetableDefenders(attacker, attackerPosition, weapon);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
      });

      QUnit.test("getTargetableDefendersAtRange() none", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attackerPosition = new Position(458, 895, -90);
         var attacker = environment.getTokenAt(attackerPosition);
         var weapon = attacker.primaryWeapon();

         // Run.
         var result = environment.getTargetableDefendersAtRange(attacker, attackerPosition, weapon,
            Range.ONE);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 0);
      });

      QUnit.test("getTargetableDefendersAtRange() one", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attackerPosition0 = new Position(458, 895, -90);
         var attacker = environment.getTokenAt(attackerPosition0);
         var attackerPosition = new Position(305, 70, -90);
         environment.moveToken(attackerPosition0, attackerPosition);
         var weapon = attacker.primaryWeapon();

         // Run.
         var result = environment.getTargetableDefendersAtRange(attacker, attackerPosition, weapon, Range.ONE);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
      });

      QUnit.test("getTokenAt() 1", function(assert)
      {
         var position = new Position(305, 20, 90);
         var environment = EnvironmentFactory.createCoreSetEnvironment();

         var token = environment.getTokenAt(position);
         assert.strictEqual(token.card().key, PilotCard.MAULER_MITHEL);
      });

      QUnit.test("getTokenAt() 2", function(assert)
      {
         var position = new Position(610, 20, 90);
         var environment = EnvironmentFactory.createCoreSetEnvironment();

         var token = environment.getTokenAt(position);
         assert.strictEqual(token.card().key, PilotCard.DARK_CURSE);
      });

      QUnit.test("getTokenAt() 3", function(assert)
      {
         var position = new Position(458, 895, -90);
         var environment = EnvironmentFactory.createCoreSetEnvironment();

         var token = environment.getTokenAt(position);
         assert.strictEqual(token.card().key, PilotCard.LUKE_SKYWALKER);
      });

      QUnit.test("getTokenById()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();

         // Run / Verify.
         assert.equal(environment.getTokenById(1).id(), 1);
         assert.equal(environment.getTokenById(2).id(), 2);
         assert.equal(environment.getTokenById(3).id(), 3);
      });

      QUnit.test("getTokensAtRange()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attacker = environment.pilotInstances()[2]; // X-Wing
         var attackerPosition0 = environment.getPositionFor(attacker);
         var attackerPosition = new Position(458, 50, -90);
         environment.moveToken(attackerPosition0, attackerPosition);

         // Run.
         var result = environment.getTokensAtRange(attacker, Range.TWO);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0].card().key, PilotCard.MAULER_MITHEL);
         assert.equal(result[1].card().key, PilotCard.DARK_CURSE);
      });

      QUnit.test("getTokensForActivation()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();

         // Run.
         var result = environment.getTokensForActivation();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 3);
         var token;
         var i = 0;
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 6);
         assert.equal(token.card().key, PilotCard.DARK_CURSE);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 7);
         assert.equal(token.card().key, PilotCard.MAULER_MITHEL);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.LUKE_SKYWALKER);
      });

      QUnit.test("getTokensForActivation() Huge", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createHugeShipEnvironment();

         // Run.
         var result = environment.getTokensForActivation();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 6);
         var token;
         var i = 0;
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.JUNO_ECLIPSE);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.WES_JANSON);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 2);
         assert.equal(token.card().key, PilotCard.GOZANTI_CLASS_CRUISER);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 3);
         assert.equal(token.card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
         token = result[i++];
         assert.equal(token.tokenFore().pilotSkillValue(), 4);
         assert.equal(token.tokenAft().pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE);
         token = result[i++];
         assert.equal(token.tokenFore().pilotSkillValue(), 4);
         assert.equal(token.tokenAft().pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.CR90_CORVETTE);
      });

      QUnit.test("getTokensForActivation() Huge pure", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createHugeShipEnvironment();

         // Run.
         var result = environment.getTokensForActivation(true);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 8);
         var token;
         var i = 0;
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.JUNO_ECLIPSE);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.WES_JANSON);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 2);
         assert.equal(token.card().key, PilotCard.GOZANTI_CLASS_CRUISER);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 3);
         assert.equal(token.card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".fore");
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".aft");
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".fore");
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".aft");
      });

      QUnit.test("getTokensForCombat()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();

         // Run.
         var result = environment.getTokensForCombat();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 3);
         var token;
         var i = 0;
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.LUKE_SKYWALKER);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 7);
         assert.equal(token.card().key, PilotCard.MAULER_MITHEL);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 6);
         assert.equal(token.card().key, PilotCard.DARK_CURSE);
      });

      QUnit.test("getTokensForCombat() Huge", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createHugeShipEnvironment();

         // Run.
         var result = environment.getTokensForCombat();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 8);
         var token;
         var i = 0;
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.JUNO_ECLIPSE);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 8);
         assert.equal(token.card().key, PilotCard.WES_JANSON);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".fore");
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".aft");
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".fore");
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 4);
         assert.equal(token.card().key, PilotCard.CR90_CORVETTE + ".aft");
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 3);
         assert.equal(token.card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
         token = result[i++];
         assert.equal(token.pilotSkillValue(), 2);
         assert.equal(token.card().key, PilotCard.GOZANTI_CLASS_CRUISER);
      });

      QUnit.test("getTokensTouching()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var fromPosition0 = new Position(305, 20, 90);
         var token0 = environment.getTokenAt(fromPosition0); // TIE Fighter 1
         var fromPosition20 = new Position(458, 895, -90);
         var fromPosition2 = new Position(fromPosition0.x(), fromPosition0.y() + 39, -90);
         environment.moveToken(fromPosition20, fromPosition2);

         // Run.
         var result = environment.getTokensTouching(token0);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 1);
         assert.equal(result[0].card().shipFaction.shipKey, Ship.X_WING);
      });

      QUnit.test("getUnfriendlyTokensAtRange() one", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var attacker = environment.pilotInstances()[2]; // X-Wing
         var attackerPosition0 = environment.getPositionFor(attacker);
         var attackerPosition = new Position(458, 50, -90);
         environment.moveToken(attackerPosition0, attackerPosition);

         // Run.
         var result = environment.getUnfriendlyTokensAtRange(attacker, Range.TWO);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 2);
         assert.equal(result[0].card().key, PilotCard.MAULER_MITHEL);
         assert.equal(result[1].card().key, PilotCard.DARK_CURSE);
      });

      QUnit.test("incrementRound()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         assert.equal(environment.round(), 0);

         // Run.
         environment.incrementRound();

         // Verify.
         assert.equal(environment.round(), 1);
      });

      QUnit.test("moveToken()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var token = environment.pilotInstances()[0];
         var fromPosition = environment.getPositionFor(token);
         var toPosition = new Position(fromPosition.x() + 100, fromPosition.y() + 100, fromPosition.heading() + 90);
         assert.equal(environment.getPositionFor(token), fromPosition);
         assert.ok(environment.getTokenAt(fromPosition).equals(token));

         // Run.
         environment.moveToken(fromPosition, toPosition);

         // Verify.
         assert.strictEqual(environment.getPositionFor(token), toPosition);
         assert.ok(environment.getTokenAt(toPosition).equals(token));
      });

      QUnit.test("pilotInstances()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();

         // Run.
         var result = environment.pilotInstances();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 3);
         assert.equal(result[0].card().key, PilotCard.MAULER_MITHEL);
         assert.equal(result[1].card().key, PilotCard.DARK_CURSE);
         assert.equal(result[2].card().key, PilotCard.LUKE_SKYWALKER);
      });

      QUnit.test("pilotInstances() pure", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var isPure = true;

         // Run.
         var result = environment.pilotInstances(isPure);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 3);
         assert.equal(result[0].card().key, PilotCard.MAULER_MITHEL);
         assert.equal(result[1].card().key, PilotCard.DARK_CURSE);
         assert.equal(result[2].card().key, PilotCard.LUKE_SKYWALKER);
      });

      QUnit.test("pilotInstances() Huge", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createHugeShipEnvironment();

         // Run.
         var result = environment.pilotInstances();

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 6);
         var i = 0;
         assert.equal(result[i++].card().key, PilotCard.GOZANTI_CLASS_CRUISER);
         assert.equal(result[i++].card().key, PilotCard.JUNO_ECLIPSE);
         assert.equal(result[i++].card().key, PilotCard.RAIDER_CLASS_CORVETTE);
         assert.equal(result[i++].card().key, PilotCard.CR90_CORVETTE);
         assert.equal(result[i++].card().key, PilotCard.WES_JANSON);
         assert.equal(result[i++].card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
      });

      QUnit.test("pilotInstances() Huge pure", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createHugeShipEnvironment();

         // Run.
         var result = environment.pilotInstances(true);

         // Verify.
         assert.ok(result);
         assert.equal(result.length, 8);
         var i = 0;
         assert.equal(result[i++].card().key, PilotCard.GOZANTI_CLASS_CRUISER);
         assert.equal(result[i++].card().key, PilotCard.JUNO_ECLIPSE);
         assert.equal(result[i++].card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".fore");
         assert.equal(result[i++].card().key, PilotCard.RAIDER_CLASS_CORVETTE + ".aft");
         assert.equal(result[i++].card().key, PilotCard.CR90_CORVETTE + ".fore");
         assert.equal(result[i++].card().key, PilotCard.CR90_CORVETTE + ".aft");
         assert.equal(result[i++].card().key, PilotCard.WES_JANSON);
         assert.equal(result[i++].card().key, PilotCard.GR_75_MEDIUM_TRANSPORT);
      });

      QUnit.test("playFormatKey() Standard", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();

         // Run.
         var result = environment.playFormatKey();

         // Verify.
         assert.ok(result);
         assert.equal(result, PlayFormat.STANDARD);
      });

      QUnit.test("playFormatKey() Epic", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createHugeShipEnvironment();

         // Run.
         var result = environment.playFormatKey();

         // Verify.
         assert.ok(result);
         assert.equal(result, PlayFormat.EPIC);
      });

      QUnit.test("removeToken()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var token = environment.pilotInstances()[0];
         var position = environment.getPositionFor(token);
         assert.equal(environment.getPositionFor(token), position);
         assert.ok(environment.getTokenAt(position).equals(token));

         // Run.
         environment.removeToken(token);

         // Verify.
         assert.strictEqual(environment.getPositionFor(token), undefined);
         assert.strictEqual(environment.getTokenAt(position), undefined);
      });

      QUnit.test("setTokenTouching()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var token = environment.pilotInstances()[0];
         assert.equal(environment.isTouching(token), false);

         // Run.
         environment.setTokenTouching(token, true);

         // Verify.
         assert.equal(environment.isTouching(token), true);
      });

      QUnit.test("toString()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();

         // Run / Verify.
         assert.equal(environment.toString(), "(305, 20, 90) 34 \"Mauler Mithel\" (TIE Fighter) pilot\n(610, 20, 90) 36 \"Dark Curse\" (TIE Fighter) pilot\n(458, 895, 270) 37 Luke Skywalker (X-Wing) pilot\n");
      });
   });
