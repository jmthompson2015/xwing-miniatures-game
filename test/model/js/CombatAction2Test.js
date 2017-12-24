"use strict";

define(["qunit", "redux",
  "artifact/js/Faction", "artifact/js/Phase", "artifact/js/PilotCard", "artifact/js/Range", "artifact/js/UpgradeCard",
  "model/js/Ability", "model/js/Action", "model/js/Adjudicator", "model/js/Agent", "model/js/AttackDice", "model/js/CardAction", "model/js/CardInstance", "model/js/CombatAction", "model/js/DefenseDice", "model/js/Environment", "model/js/EnvironmentAction", "model/js/EventObserver",
  "model/js/PhaseObserver", "model/js/Position", "model/js/Reducer", "model/js/Selector", "model/js/Squad", "model/js/TargetLock", "model/js/UpgradeAbility3",
  "../../../test/model/js/EnvironmentFactory", "../../../test/model/js/MockAttackDice", "../../../test/model/js/MockDefenseDice"],
   function(QUnit, Redux,
      Faction, Phase, PilotCard, Range, UpgradeCard,
      Ability, Action, Adjudicator, Agent, AttackDice, CardAction, CardInstance, CombatAction, DefenseDice, Environment, EnvironmentAction, EventObserver,
      PhaseObserver, Position, Reducer, Selector, Squad, TargetLock, UpgradeAbility3,
      EnvironmentFactory, MockAttackDice, MockDefenseDice)
   {
      QUnit.module("CombatAction-2");

      var delay = 10;

      QUnit.test("CombatAction.doIt() range one through Modify Attack Dice", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         Adjudicator.create(store);
         var attacker = environment.pilotInstances()[2]; // Luke Skywalker X-Wing
         assert.ok(attacker);
         attacker.agent().getModifyAttackDiceAction = function(attacker, defender, callback)
         {
            callback(undefined, false);
         };
         var weapon = attacker.primaryWeapon();
         assert.ok(weapon);
         var attackerPosition = environment.getPositionFor(attacker);
         var defenderPosition = new Position(305, 20, 90); // Mauler Mithel TIE Fighter
         var defender = environment.pilotInstances()[0];
         defender.agent().getModifyDefenseDiceAction = function(attacker, defender, callback)
         {
            callback(undefined, false);
         };

         environment.removeToken(attacker);
         attackerPosition = new Position(defenderPosition.x(), defenderPosition.y() + 50, -90);
         store.dispatch(EnvironmentAction.placeToken(attackerPosition, attacker));
         var callback = function()
         {
            LOGGER.info("callback() start");
         };
         environment.setActiveToken(attacker);
         store.dispatch(Action.setDelay(delay));
         var combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
         combatAction.rollDefenseDice = function()
         {
            var callback = this.callback();
            callback();
         };

         // Run.
         combatAction.doIt();

         // Verify.
         assert.equal(Selector.rangeKey(store.getState(), attacker), Range.ONE);
         assert.equal(store.getState().phaseKey, Phase.COMBAT_MODIFY_ATTACK_DICE);
         verifyAttackDice(assert, AttackDice.get(store, attacker.id()));
         assert.ok(!defender.isDestroyed());
         var defenseDice = DefenseDice.get(store, attacker.id());
         assert.ok(defenseDice);
      });

      QUnit.test("CombatAction.doIt() range one through Modify Defense Dice", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         Adjudicator.create(store);
         var attacker = environment.pilotInstances()[2]; // Luke Skywalker X-Wing
         assert.ok(attacker);
         attacker.agent().getModifyAttackDiceAction = function(attacker, defender, callback)
         {
            callback(undefined, false);
         };
         var weapon = attacker.primaryWeapon();
         assert.ok(weapon);
         var attackerPosition = environment.getPositionFor(attacker);
         var defenderPosition = new Position(305, 20, 90); // Mauler Mithel TIE Fighter
         var defender = environment.pilotInstances()[0];
         defender.agent().compareResults = function(store, adjudicator, attacker, defender, callback)
         {
            callback(undefined, false);
         };

         environment.removeToken(attacker);
         attackerPosition = new Position(defenderPosition.x(), defenderPosition.y() + 50, -90);
         store.dispatch(EnvironmentAction.placeToken(attackerPosition, attacker));
         var callback = function()
         {
            LOGGER.info("callback() start");
         };
         environment.setActiveToken(attacker);
         store.dispatch(Action.setDelay(delay));
         var combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
         combatAction.compareResults = function()
         {
            var callback = this.callback();
            callback();
         };

         // Run.
         combatAction.doIt();

         // Verify.
         assert.equal(Selector.rangeKey(store.getState(), attacker), Range.ONE);
         assert.equal(store.getState().phaseKey, Phase.COMBAT_MODIFY_DEFENSE_DICE);
         verifyAttackDice(assert, AttackDice.get(store, attacker.id()));
         assert.ok(!defender.isDestroyed());
         verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
         assert.equal(defender.hullValue(), 3);
         assert.equal(defender.damageCount(), 0);
         assert.equal(defender.criticalDamageCount(), 0);
      });

      QUnit.test("CombatAction.doIt() range one", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var attacker = environment.pilotInstances()[2]; // Luke Skywalker X-Wing
         assert.ok(attacker);
         attacker.agent().getModifyAttackDiceAction = function(attacker, defender, callback)
         {
            callback(undefined, false);
         };
         var weapon = attacker.primaryWeapon();
         assert.ok(weapon);
         var attackerPosition = environment.getPositionFor(attacker);
         var defenderPosition = new Position(305, 20, 90); // Mauler Mithel TIE Fighter
         var defender = environment.pilotInstances()[0];
         defender.agent().getModifyDefenseDiceAction = function(attacker, defender, callback)
         {
            callback(undefined, false);
         };

         environment.removeToken(attacker);
         attackerPosition = new Position(defenderPosition.x(), defenderPosition.y() + 50, -90);
         store.dispatch(EnvironmentAction.placeToken(attackerPosition, attacker));
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.equal(combatAction.executionCount(), 1);
            assert.equal(Selector.rangeKey(store.getState(), attacker), Range.ONE);
            assert.equal(store.getState().phaseKey, Phase.COMBAT_AFTER_DEAL_DAMAGE);
            verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

            assert.ok(!defender.isDestroyed());
            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            assert.equal(defender.damageCount() + defender.criticalDamageCount(), 1);
            assert.equal(defender.hullValue(), 3);
            done();
         };
         environment.setActiveToken(attacker);
         store.dispatch(Action.setDelay(delay));
         var combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Bossk upgrade", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.BOSSK;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            if (Selector.isDefenderHit(store.getState(), attacker))
            {
               assert.ok(Selector.isDefenderHit(store.getState(), attacker), "isDefenderHit() === true");
               assert.equal(attacker.stressCount(), 0);
               assert.equal(attacker.focusCount(), 0);
               assert.equal(store.getState().targetLocks.size, 0);
            }
            else
            {
               assert.ok(!Selector.isDefenderHit(store.getState(), attacker), "isDefenderHit() === false");
               assert.equal(attacker.stressCount(), 1);
               assert.equal(attacker.focusCount(), 1);
               assert.equal(store.getState().targetLocks.size, 0);
            }
            done();
         };
         var combatAction = createCombatAction2(upgradeKey, callback);
         var store = combatAction.store();
         var environment = combatAction.environment();
         var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
         var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter
         assert.ok(environment.getPositionFor(attacker), "environment.getPositionFor(attacker) !== undefined");
         assert.ok(environment.getPositionFor(defender), "environment.getPositionFor(defender) !== undefined");
         assert.ok(attacker.isUpgradedWith(upgradeKey), "isUpgradedWith() === true");
         assert.equal(attacker.stressCount(), 0);
         assert.equal(attacker.focusCount(), 0);
         assert.equal(store.getState().targetLocks.size, 0);

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Fire Control System", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.FIRE_CONTROL_SYSTEM;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.equal(TargetLock.getFirst(store, attacker, defender) === undefined, defender.isDestroyed());
            assert.ok(attacker.isUpgradedWith(upgradeKey));
            verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            assert.ok(defender.damageCount() + defender.criticalDamageCount() > 0);
            done();
         };
         var combatAction = createCombatAction(upgradeKey, callback);
         var store = combatAction.store();
         var environment = combatAction.environment();
         var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
         var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter
         assert.ok(TargetLock.getFirst(store, attacker, defender));

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Flechette Cannon", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.FLECHETTE_CANNON;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.ok(TargetLock.getFirst(store, attacker, defender));
            assert.ok(attacker.isUpgradedWith(upgradeKey));
            assert.equal(attacker.secondaryWeapons().length, 1);
            verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            assert.equal(defender.damageCount(), 1, "defender.damageCount() === 1");
            assert.equal(defender.criticalDamageCount(), 0, "defender.criticalDamageCount() === 0");
            assert.ok(defender.isStressed());
            assert.equal(defender.stressCount(), 1, "defender.stressCount() === 1");
            done();
         };
         var combatAction = createCombatAction(upgradeKey, callback);
         var store = combatAction.store();
         var environment = combatAction.environment();
         var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
         var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Gunner upgrade", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.GUNNER;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            var store = combatAction.store();
            var attacker = combatAction.attacker(); // Dash Rendar YT-2400
            var defender = combatAction.defender(); // Academy PilotCard TIE Fighter

            if (Selector.isDefenderHit(store.getState(), attacker))
            {
               assert.ok(Selector.isDefenderHit(store.getState(), attacker), "isDefenderHit() === true");
               assert.ok(defender.damageCount() + defender.criticalDamageCount() > 0, "damageCount() + criticalDamageCount() > 0");
            }
            else
            {
               assert.ok(!Selector.isDefenderHit(store.getState(), attacker), "isDefenderHit() !== true");
               assert.equal(defender.damageCount() + defender.criticalDamageCount(), 0, "damageCount() + criticalDamageCount() === 0");
            }
            done();
         };
         var combatAction = createCombatAction(upgradeKey, callback, 695);
         combatAction.notifyDamage = function()
         {
            var store = this.store();
            var attacker = this.attacker();

            // Reset so that defender is not hit.
            store.dispatch(Action.setTokenDefenderHit(attacker, false));
            store.dispatch(Action.enqueuePhase(Phase.COMBAT_NOTIFY_DAMAGE, this.attacker(), this.finishNotifyDamage.bind(this)));
         };

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Heavy Laser Cannon", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.HEAVY_LASER_CANNON;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.ok(attacker.isUpgradedWith(upgradeKey));
            assert.equal(attacker.secondaryWeapons().length, 1);
            assert.equal(AttackDice.get(store, attacker.id()).size(), 4);
            var attackDice = AttackDice.get(store, attacker.id());
            assert.equal(attackDice.blankCount(), 1);
            assert.equal(attackDice.criticalHitCount(), 0, "attackDice.criticalHitCount() === 0");
            assert.equal(attackDice.focusCount(), 1);
            assert.equal(attackDice.hitCount(), 2, "attackDice.hitCount() === 2");

            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            assert.equal(defender.damageCount() + defender.criticalDamageCount(), 1);
            done();
         };
         var combatAction = createCombatActionRange2(upgradeKey, callback);
         var store = combatAction.store();
         var environment = combatAction.environment();
         var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
         var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Hot Shot Blaster", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.HOT_SHOT_BLASTER;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.ok(!attacker.isUpgradedWith(upgradeKey));
            assert.equal(attacker.secondaryWeapons().length, 0);
            verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            assert.ok(defender.damageCount() + defender.criticalDamageCount() > 0);
            assert.equal(defender.hullValue(), 3);
            done();
         };
         var combatAction = createCombatAction(upgradeKey, callback);
         var store = combatAction.store();
         var environment = combatAction.environment();
         var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
         var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Ion Cannon", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.ION_CANNON;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.ok(attacker.isUpgradedWith(upgradeKey));
            assert.equal(attacker.secondaryWeapons().length, 1);
            verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            assert.equal(defender.damageCount(), 1);
            assert.equal(defender.criticalDamageCount(), 0);
            assert.equal(defender.ionCount(), 1);
            done();
         };
         var combatAction = createCombatAction(upgradeKey, callback);
         var store = combatAction.store();
         var environment = combatAction.environment();
         var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
         var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Ion Cannon Turret", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.ION_CANNON_TURRET;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.ok(attacker.isUpgradedWith(upgradeKey));
            assert.equal(attacker.secondaryWeapons().length, 1);
            verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            assert.equal(defender.damageCount(), 1);
            assert.equal(defender.criticalDamageCount(), 0);
            assert.equal(defender.ionCount(), 1);
            done();
         };
         var combatAction = createCombatAction(upgradeKey, callback);
         var store = combatAction.store();
         var environment = combatAction.environment();
         var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
         var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Mangler Cannon", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.MANGLER_CANNON;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.ok(attacker.isUpgradedWith(upgradeKey));
            assert.equal(attacker.secondaryWeapons().length, 1);
            var attackDice = AttackDice.get(store, attacker.id());
            assert.equal(attackDice.blankCount(), 1);
            assert.equal(attackDice.criticalHitCount(), 1); // mock dice don't change
            assert.equal(attackDice.focusCount(), 1);
            assert.equal(attackDice.hitCount(), 1); // mock dice don't change

            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            assert.equal(defender.damageCount() + defender.criticalDamageCount(), 1);
            done();
         };
         var combatAction = createCombatAction(upgradeKey, callback);
         var store = combatAction.store();
         var environment = combatAction.environment();
         var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
         var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Predator", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.PREDATOR;
         var callback = function()
         {
            // Verify.
            var store = combatAction.store();
            var environment = combatAction.environment();
            var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
            assert.ok(true, "test resumed from async operation");
            assert.ok(attacker.isUpgradedWith(upgradeKey));
            verifyAttackDice(assert, AttackDice.get(store, attacker.id()));
            done();
         };
         var combatAction = createCombatAction(upgradeKey, callback);

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Tactician", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.TACTICIAN;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.ok(attacker.isUpgradedWith(upgradeKey));
            assert.equal(combatAction.executionCount(), 1);
            verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            assert.ok(defender.damageCount() + defender.criticalDamageCount() > 0);
            assert.equal(defender.stressCount(), 1, "defender.stressCount() === 1");
            done();
         };
         var combatAction = createCombatActionRange2(upgradeKey, callback);
         var store = combatAction.store();
         var environment = combatAction.environment();
         var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
         var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Tractor Beam", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.TRACTOR_BEAM;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.ok(attacker.isUpgradedWith(upgradeKey));
            assert.equal(attacker.secondaryWeapons().length, 1);
            verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            assert.equal(defender.damageCount(), 0);
            assert.equal(defender.criticalDamageCount(), 0);
            assert.equal(defender.tractorBeamCount(), 1);
            done();
         };
         var combatAction = createCombatAction(upgradeKey, callback);
         var store = combatAction.store();
         var environment = combatAction.environment();
         var attacker = environment.pilotInstances()[1]; // Dash Rendar YT-2400
         var defender = environment.pilotInstances()[0]; // Academy PilotCard TIE Fighter
         assert.equal(defender.tractorBeamCount(), 0);

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Twin Laser Turret", function(assert)
      {
         // Setup.
         var upgradeKey = UpgradeCard.TWIN_LASER_TURRET;
         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            assert.ok(attacker.isUpgradedWith(upgradeKey));
            assert.equal(combatAction.executionCount(), 2);
            assert.equal(attacker.secondaryWeapons().length, 1);
            verifyAttackDice(assert, AttackDice.get(store, attacker.id()));

            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            assert.ok(0 <= defender.damageCount() && defender.damageCount() <= 2, "defender.damageCount() = " + defender.damageCount());
            assert.equal(defender.damageCount(), 2, "defender.damageCount() = " + defender.damageCount());
            assert.equal(defender.criticalDamageCount(), 0, "defender.criticalDamageCount() = " + defender.criticalDamageCount());
            done();
         };
         var combatAction = createCombatActionRange2(upgradeKey, callback);
         var store = combatAction.store();
         var environment = combatAction.environment();
         var attacker = environment.pilotInstances()[1];
         assert.ok(attacker.isUpgradedWith(upgradeKey));
         assert.equal(attacker.secondaryWeapons().length, 1);
         var defender = environment.pilotInstances()[0];
         assert.equal(defender.damageCount(), 0);

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      QUnit.test("CombatAction.doIt() Whisper", function(assert)
      {
         // Setup.
         var store00 = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store00, "Imperial Agent");
         var attacker = new CardInstance(store00, PilotCard.WHISPER, imperialAgent);
         var attackerPosition = new Position(458, 895, -90);
         var rebelAgent = new Agent(store00, "Rebel Agent");
         var defender = new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent);
         var defenderPosition = new Position(450, 845, 90);

         var store = Redux.createStore(Reducer.root);
         var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [defender]);
         var squad2 = new Squad(Faction.REBEL, "squad2", 2016, "squad2", [attacker]);
         var positions1 = [defenderPosition];
         var positions2 = [attackerPosition];
         var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
         defender = environment.pilotInstances()[0];
         attacker = environment.pilotInstances()[1];
         var weapon = attacker.primaryWeapon();
         Adjudicator.create(store);
         assert.equal(attacker.focusCount(), 0);

         EventObserver.observeStore(store);
         PhaseObserver.observeStore(store);

         var callback = function()
         {
            // Verify.
            assert.ok(true, "test resumed from async operation");
            verifyAttackDice(assert, AttackDice.get(store, attacker.id()));
            assert.equal(attacker.focusCount(), 1);

            verifyDefenseDice(assert, DefenseDice.get(store, attacker.id()));
            done();
         };
         environment.setActiveToken(attacker);
         store.dispatch(Action.setDelay(delay));
         var combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);

         // Run.
         var done = assert.async();
         combatAction.doIt();
      });

      function createCombatAction(upgradeKey, callback0, y)
      {
         var store00 = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store00, "Rebel Agent");
         var attacker = new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [upgradeKey]);
         var attackerPosition = new Position(458, 895, -90);

         var imperialAgent = new Agent(store00, "Imperial Agent");
         var defender = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
         var myY = (y !== undefined ? y : 845);
         var defenderPosition = new Position(450, myY, 90);

         var store = Redux.createStore(Reducer.root);
         var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [defender]);
         var squad2 = new Squad(Faction.REBEL, "squad2", 2016, "squad2", [attacker]);
         var positions1 = [defenderPosition];
         var positions2 = [attackerPosition];
         var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
         imperialAgent = environment.firstAgent();
         imperialAgent.getModifyDefenseDiceAction = function(attacker, defender, callback)
         {
            callback(undefined, false);
         };
         rebelAgent = environment.secondAgent();
         rebelAgent.getModifyAttackDiceAction = function(attacker, defender, callback)
         {
            var rawAbility = UpgradeAbility3[Phase.COMBAT_MODIFY_ATTACK_DICE][upgradeKey];
            var ability;
            if (rawAbility && rawAbility.condition(store, attacker))
            {
               ability = new Ability(UpgradeCard, upgradeKey, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
            }
            var isAccepted = (ability !== undefined);
            callback(ability, isAccepted);
         };
         defender = environment.pilotInstances()[0];
         attacker = environment.pilotInstances()[1];
         environment.setActiveToken(attacker);
         Adjudicator.create(store);
         EventObserver.observeStore(store);
         PhaseObserver.observeStore(store);

         store.dispatch(CardAction.addFocusCount(attacker));
         TargetLock.newInstance(store, attacker, defender);

         var weapon = attacker.secondaryWeapons()[0];

         if (weapon === undefined)
         {
            weapon = attacker.primaryWeapon();
         }

         var callback = (callback0 !== undefined ? callback0 : function()
         {
            LOGGER.info("callback() start");
         });

         store.dispatch(Action.setDelay(delay));

         return new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
      }

      function createCombatActionRange2(upgradeKey, callback0)
      {
         return createCombatAction(upgradeKey, callback0, 700);
      }

      function createCombatAction2(upgradeKey, callback0)
      {
         var store00 = Redux.createStore(Reducer.root);
         var rebelAgent = new Agent(store00, "Rebel Agent");
         var attacker = new CardInstance(store00, PilotCard.DASH_RENDAR, rebelAgent, [upgradeKey]);
         var attackerPosition = new Position(458, 895, -90);

         var imperialAgent = new Agent(store00, "Imperial Agent");
         var defender = new CardInstance(store00, PilotCard.ACADEMY_PILOT, imperialAgent);
         var defenderPosition = new Position(450, 845, 90);

         var store = Redux.createStore(Reducer.root);
         Adjudicator.create(store);

         var squad1 = new Squad(Faction.IMPERIAL, "squad1", 2017, "squad1", [defender]);
         var squad2 = new Squad(Faction.REBEL, "squad2", 2016, "squad2", [attacker]);
         var positions1 = [defenderPosition];
         var positions2 = [attackerPosition];
         var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
         imperialAgent = environment.firstAgent();
         imperialAgent.getModifyDefenseDiceAction = function(attacker, defender, callback)
         {
            callback(undefined, false);
         };
         rebelAgent = environment.secondAgent();
         rebelAgent.getModifyAttackDiceAction = function(attacker, defender, callback)
         {
            callback(undefined, false);
         };
         defender = environment.pilotInstances()[0];
         attacker = environment.pilotInstances()[1];
         environment.setActiveToken(attacker);
         EventObserver.observeStore(store);
         PhaseObserver.observeStore(store);

         var weapon = attacker.primaryWeapon();
         var callback = (callback0 !== undefined ? callback0 : function()
         {
            LOGGER.info("callback() start");
         });

         store.dispatch(Action.setDelay(delay));

         return new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
      }

      function verifyAttackDice(assert, attackDice)
      {
         assert.ok(attackDice);
         assert.equal(attackDice.blankCount(), 1);
         assert.equal(attackDice.criticalHitCount(), 1);
         assert.equal(attackDice.focusCount(), 1);
         assert.equal(attackDice.hitCount(), 1);
      }

      function verifyDefenseDice(assert, defenseDice)
      {
         assert.ok(defenseDice);
         assert.equal(defenseDice.blankCount(), 1);
         assert.equal(defenseDice.evadeCount(), 1);
         assert.equal(defenseDice.focusCount(), 1);
      }
   });
