"use strict";

define(["qunit", "redux",
  "artifact/js/DamageCard", "artifact/js/DiceModification", "artifact/js/Faction", "artifact/js/Maneuver", "artifact/js/Phase", "artifact/js/PilotCard", "artifact/js/ShipAction", "artifact/js/UpgradeCard",
  "model/js/Ability", "model/js/Action", "model/js/Adjudicator", "model/js/Agent", "model/js/CombatAction", "model/js/Environment", "model/js/EnvironmentAction", "model/js/MediumAgentStrategy", "model/js/PilotAbility3", "model/js/Position", "model/js/Reducer", "model/js/ShipActionAbility", "model/js/Squad", "model/js/TargetLock", "model/js/CardInstance", "model/js/CardAction",
  "../../../test/model/js/EnvironmentFactory", "../../../test/model/js/MockAttackDice", "../../../test/model/js/MockDefenseDice"],
   function(QUnit, Redux, DamageCard, DiceModification, Faction, Maneuver, Phase, PilotCard, ShipAction, UpgradeCard,
      Ability, Action, Adjudicator, Agent, CombatAction, Environment, EnvironmentAction, MediumAgentStrategy, PilotAbility3, Position, Reducer, ShipActionAbility, Squad, TargetLock, CardInstance, CardAction,
      EnvironmentFactory, MockAttackDice, MockDefenseDice)
   {
      QUnit.module("MediumAgent");

      QUnit.test("properties", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var result = new Agent(store, "myAgent", undefined, MediumAgentStrategy);

         // Run / Verify.
         assert.equal(result.name(), "myAgent");
      });

      QUnit.test("chooseAbility()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         var name = "myAgent";
         var agent = new Agent(store, name);
         var tokens = environment.pilotInstances();
         var token2 = tokens[2];
         LOGGER.debug("token2 = " + token2);

         var damageAbilities = [];
         var pilotAbilities = [new Ability(PilotCard, PilotCard.LUKE_SKYWALKER, PilotAbility3, Phase.COMBAT_MODIFY_DEFENSE_DICE)];
         var upgradeAbilities = [];
         LOGGER.debug("damageAbilities = " + damageAbilities);
         LOGGER.debug("pilotAbilities = " + pilotAbilities);
         LOGGER.debug("upgradeAbilities = " + upgradeAbilities);

         function callback(ability, isAccepted)
         {
            LOGGER.debug("callback() ability = " + ability + " isAccepted ? " + isAccepted);

            // Verify.
            assert.ok(ability);
            assert.ok(ability.source(), PilotCard);
            assert.ok(ability.sourceKey(), PilotCard.LUKE_SKYWALKER);
            assert.ok(ability.abilityType(), PilotAbility3);
            assert.ok(ability.abilityKey(), Phase.COMBAT_MODIFY_DEFENSE_DICE);
            assert.equal(isAccepted, true);
         }

         // Run.
         agent.chooseAbility(damageAbilities, pilotAbilities, upgradeAbilities, callback);
      });

      QUnit.test("chooseWeaponAndDefender() Imperial", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         Adjudicator.create(store);
         var name = "myAgent";
         var agent = new Agent(store, name);

         var oldPosition0 = new Position(305, 20, 90);
         var token0 = environment.getTokenAt(oldPosition0);
         var position0 = new Position(458, 795, 90);
         environment.moveToken(oldPosition0, position0);

         var position1 = new Position(610, 20, 90);
         var token1 = environment.getTokenAt(position1);

         var position2 = new Position(458, 895, -90);
         var token2 = environment.getTokenAt(position2);

         LOGGER.debug("token0 = " + token0);
         LOGGER.debug("token1 = " + token1);
         LOGGER.debug("token2 = " + token2);

         function callback(weapon, defender)
         {
            LOGGER.debug("callback() weapon = " + weapon + " defender = " + defender);

            // Verify.
            assert.ok(weapon);
            assert.equal(weapon.equals(token0.primaryWeapon()), true);
            assert.ok(defender);
            assert.equal(defender.id(), token2.id());
         }

         // Run.
         agent.chooseWeaponAndDefender(token0, callback);
      });

      QUnit.test("chooseWeaponAndDefender() Rebel", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         Adjudicator.create(store);
         var oldPosition0 = new Position(305, 20, 90);
         var position0 = new Position(458, 695, 90);
         store.dispatch(EnvironmentAction.moveToken(oldPosition0, position0));
         var token0 = environment.pilotInstances()[0];
         var token2 = environment.pilotInstances()[2];
         TargetLock.newInstance(store, token2, token0);
         var agent = token2.agent();

         var callback = function(weapon, defender)
         {
            // Verify.
            assert.ok(weapon);
            assert.equal(weapon.equals(token2.secondaryWeapons()[0]), true);
            assert.ok(defender);
            assert.ok(defender.equals(token0));
         };

         // Run.
         agent.chooseWeaponAndDefender(token2, callback);
      });

      QUnit.test("cloneStore()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createTFACoreSetEnvironment(store, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         var attacker = environment.pilotInstances()[2]; // T-70 X-Wing
         var attackerPosition = environment.getPositionFor(attacker);
         var defender = environment.pilotInstances()[0]; // TIE Fighter
         var defenderPosition = environment.getPositionFor(defender);
         var weapon = attacker.primaryWeapon();
         var caCallback = function() {};
         var combatAction = new CombatAction(store, attacker, weapon, defender, caCallback, MockAttackDice, MockDefenseDice);
         environment.setActiveToken(attacker);
         store.dispatch(Action.setTokenCombatAction(attacker, combatAction));

         // Run.
         var result = MediumAgentStrategy.cloneStore(store, attacker, attackerPosition, defender, defenderPosition);

         // Verify.
         assert.ok(result);
         var newEnvironment = result.getState().environment;
         assert.ok(newEnvironment);
         var newTokens = newEnvironment.pilotInstances();
         assert.ok(newTokens);
         assert.equal(newTokens.length, 2, "newTokens.length === 2");
         assert.equal(newTokens[0].card().key, attacker.card().key);
         assert.equal(newTokens[1].card().key, defender.card().key);
      });

      QUnit.test("determineValidManeuvers()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var token = environment.pilotInstances()[0]; // TIE Fighter.
         var agent = token.agent();

         // Run.
         var result = agent.determineValidManeuvers(token);

         // Validate.
         assert.ok(result);
         assert.equal(result.length, 16);
      });

      QUnit.test("determineValidManeuvers() corner", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var token = environment.pilotInstances()[0]; // TIE Fighter.
         var agent = token.agent();
         var position0 = environment.getPositionFor(token);
         LOGGER.debug("before position0 = " + position0);
         var position = new Position(21, position0.y(), position0.heading());
         environment.moveToken(position0, position);

         // Run.
         var result = agent.determineValidManeuvers(token);

         // Validate.
         assert.ok(result);
         assert.equal(result.length, 11);
         result.forEach(function(maneuver, i)
         {
            LOGGER.debug(i + " maneuver = " + maneuver);
         });
      });

      QUnit.test("determineValidModifyDefenseDiceActions() Captain Oicunn", function(assert)
      {
         // Setup.
         var store00 = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store00, "Imperial Agent");
         var rebelAgent = new Agent(store00, "Rebel Agent");
         var squad1 = new Squad(Faction.REBEL, "squad1", 2016, "squad1", [new CardInstance(store00, PilotCard.CAPTAIN_OICUNN, imperialAgent, [UpgradeCard.YSANNE_ISARD])]);
         var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [new CardInstance(store00, PilotCard.LUKE_SKYWALKER, rebelAgent, [UpgradeCard.PROTON_TORPEDOES, UpgradeCard.R2_D2_ASTROMECH])]);
         var positions1 = [new Position(305, 20, 90)];
         var positions2 = [new Position(458, 895, 270)];

         var store = Redux.createStore(Reducer.root);
         var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
         imperialAgent = environment.firstAgent();
         rebelAgent = environment.secondAgent();
         var attacker = environment.pilotInstances()[1]; // X-Wing.
         var defender = environment.pilotInstances()[0]; // VT-49 Decimator.
         store.dispatch(CardAction.addEvadeCount(defender));
         environment.setActiveToken(attacker);
         var weapon = attacker.primaryWeapon();
         var callback = function() {};
         var combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
         store.dispatch(Action.setTokenCombatAction(attacker, combatAction));

         // Run.
         var result = rebelAgent.determineValidModifyDefenseDiceActions(attacker, defender);

         // Validate.
         assert.ok(result);
         assert.equal(result.length, 1);
         assert.equal(result[0].sourceKey(), DiceModification.DEFENSE_SPEND_EVADE);
      });

      QUnit.test("determineValidShipActions() Mauler Mithel", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         Adjudicator.create(store);
         var token = environment.pilotInstances()[0]; // TIE Fighter.
         var agent = token.agent();

         // Run.
         var result = agent.determineValidShipActions(token);

         // Validate.
         assert.ok(result);
         assert.equal(result.length, 4);
         result.forEach(function(maneuver, i)
         {
            LOGGER.debug(i + " maneuver = " + maneuver);
         });
      });

      QUnit.test("determineValidShipActions() Luke Skywalker", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         Adjudicator.create(store);
         var token = environment.pilotInstances()[2]; // X-Wing.
         var agent = token.agent();
         var upgrade = new CardInstance(store, UpgradeCard.properties[UpgradeCard.LANDO_CALRISSIAN]);
         store.dispatch(CardAction.addUpgrade(token, upgrade));
         var damage = new CardInstance(store, DamageCard.CONSOLE_FIRE);
         token.receiveCriticalDamage(damage);
         environment.setActiveToken(token);

         // Run.
         var result = agent.determineValidShipActions(token);

         // Validate.
         assert.ok(result);
         assert.equal(result.length, 3);
         result.forEach(function(ability, i)
         {
            LOGGER.debug(i + " ability = " + ability);
         });
         assert.equal(result[0].sourceKey(), ShipAction.FOCUS);

         assert.ok(result[1]);
         assert.equal(result[1].source(), UpgradeCard);
         assert.equal(result[1].sourceKey(), UpgradeCard.LANDO_CALRISSIAN);

         assert.ok(result[2]);
         assert.equal(result[2].source(), DamageCard);
         assert.equal(result[2].sourceKey(), DamageCard.CONSOLE_FIRE);
      });

      QUnit.test("determineValidShipActions() Miranda Doni", function(assert)
      {
         // Setup.
         var store00 = Redux.createStore(Reducer.root);
         var imperialAgent = new Agent(store00, "Imperial Agent");
         var rebelAgent = new Agent(store00, "Rebel Agent");
         var squad1 = new Squad(Faction.REBEL, "squad1", 2016, "squad1", [new CardInstance(store00, PilotCard.MAULER_MITHEL, imperialAgent, [UpgradeCard.MARKSMANSHIP]), new CardInstance(store00, PilotCard.DARK_CURSE, imperialAgent)]);
         var squad2 = new Squad(Faction.REBEL, "squad2", 2017, "squad2", [new CardInstance(store00, PilotCard.LUKE_SKYWALKER, rebelAgent, [UpgradeCard.PROTON_TORPEDOES, UpgradeCard.R2_D2_ASTROMECH]), new CardInstance(store00, PilotCard.MIRANDA_DONI, rebelAgent)]);
         var positions1 = [new Position(305, 20, 90), new Position(610, 20, 90)];
         var positions2 = [new Position(458, 895, 270), new Position(400, 400, 0)];

         var store = Redux.createStore(Reducer.root);
         var environment = new Environment(store, imperialAgent, squad1, rebelAgent, squad2, positions1, positions2);
         Adjudicator.create(store);
         imperialAgent = environment.firstAgent();
         rebelAgent = environment.secondAgent();
         var token = environment.pilotInstances()[3]; // K-Wing.
         var previousManeuver = Maneuver.properties[Maneuver.STRAIGHT_2_EASY];
         store.dispatch(Action.setTokenManeuver(token, previousManeuver));

         // Run.
         var result = rebelAgent.determineValidShipActions(token);

         // Validate.
         assert.ok(result);
         assert.equal(result.length, 6);
         assert.equal(result[0].sourceKey(), ShipAction.FOCUS);
         assert.ok(result[1]);
         assert.equal(result[1].sourceKey(), ShipAction.SLAM);
         assert.equal(result[1].context().maneuverKey, Maneuver.TURN_LEFT_2_STANDARD);

         assert.ok(result[2]);
         assert.equal(result[2].sourceKey(), ShipAction.SLAM);
         assert.equal(result[2].context().maneuverKey, Maneuver.BANK_LEFT_2_STANDARD);

         assert.ok(result[3]);
         assert.equal(result[3].sourceKey(), ShipAction.SLAM);
         assert.equal(result[3].context().maneuverKey, Maneuver.STRAIGHT_2_EASY);

         assert.ok(result[4]);
         assert.equal(result[4].sourceKey(), ShipAction.SLAM);
         assert.equal(result[4].context().maneuverKey, Maneuver.BANK_RIGHT_2_STANDARD);

         assert.ok(result[5]);
         assert.equal(result[5].sourceKey(), ShipAction.SLAM);
         assert.equal(result[5].context().maneuverKey, Maneuver.TURN_RIGHT_2_STANDARD);
      });

      QUnit.test("getDecloakAction()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         Adjudicator.create(store);
         var agent = new Agent(store, "Imperial Agent");
         var token = new CardInstance(store, PilotCard.SIGMA_SQUADRON_PILOT, agent);
         store.dispatch(EnvironmentAction.placeToken(new Position(200, 200, 0), token));
         store.dispatch(CardAction.addCloakCount(token));

         var result;

         function callback(token, maneuverAction)
         {
            LOGGER.debug("callback()");
            result = maneuverAction;

            // Verify.
            if (result)
            {
               assert.ok(result);
               assert.ok(result.context().maneuverKey);
            }
            else
            {
               assert.ok(!result);
            }
         }

         // Run.
         result = agent.getDecloakAction(token, callback);
      });

      QUnit.test("getModifyAttackDiceAction() focus", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         Adjudicator.create(store);
         var attacker = environment.pilotInstances()[0]; // TIE Fighter
         var defender = environment.pilotInstances()[2]; // X-Wing
         var weapon = attacker.primaryWeapon();
         var caCallback = function() {};
         var combatAction = new CombatAction(store, attacker, weapon, defender, caCallback, MockAttackDice, MockDefenseDice);
         var agent = attacker.agent();
         environment.setActiveToken(attacker);
         store.dispatch(Action.setTokenCombatAction(attacker, combatAction));
         store.dispatch(CardAction.addFocusCount(attacker));

         function callback(modifyAbility)
         {
            LOGGER.debug("callback() modifyAbility = " + modifyAbility);

            // Verify.
            assert.ok(modifyAbility);
            assert.equal(modifyAbility.sourceKey(), DiceModification.ATTACK_SPEND_FOCUS);
         }

         // Run.
         agent.getModifyAttackDiceAction(attacker, defender, callback);
      });

      QUnit.test("getModifyDefenseDiceAction() evade", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         Adjudicator.create(store);
         var attacker = environment.pilotInstances()[2]; // X-Wing
         var defender = environment.pilotInstances()[0]; // TIE Fighter
         var weapon = attacker.primaryWeapon();
         var caCallback = function() {};
         var combatAction = new CombatAction(store, attacker, weapon, defender, caCallback, MockAttackDice, MockDefenseDice);
         var agent = defender.agent();
         environment.setActiveToken(attacker);
         store.dispatch(Action.setTokenCombatAction(attacker, combatAction));
         store.dispatch(CardAction.addEvadeCount(defender));

         function callback(modifyAbility)
         {
            LOGGER.debug("callback() modifyAbility = " + modifyAbility);

            // Verify.
            assert.ok(modifyAbility);
            assert.equal(modifyAbility.sourceKey(), DiceModification.DEFENSE_SPEND_EVADE);
         }

         // Run.
         agent.getModifyDefenseDiceAction(attacker, defender, callback);
      });

      QUnit.test("getPlanningAction() Imperial", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         Adjudicator.create(store);
         var agent = environment.firstAgent();

         var position0 = new Position(305, 20, 90);
         var token0 = environment.getTokenAt(position0);

         var position1 = new Position(610, 20, 90);
         var token1 = environment.getTokenAt(position1);

         var position2 = new Position(458, 895, -90);
         var token2 = environment.getTokenAt(position2);

         var result;

         function callback(planningAction)
         {
            LOGGER.debug("callback()");
            result = planningAction;

            // Verify.
            assert.ok(result);
            assert.ok(result[token0.id()]);
            assert.ok(result[token1.id()]);
            assert.ok(!result[token2.id()]);
         }

         // Run.
         agent.getPlanningAction(callback);
      });

      QUnit.test("getPlanningAction() Rebel", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         Adjudicator.create(store);
         var agent = environment.secondAgent();

         var position0 = new Position(305, 20, 90);
         var token0 = environment.getTokenAt(position0);

         var position1 = new Position(610, 20, 90);
         var token1 = environment.getTokenAt(position1);

         var position2 = new Position(458, 895, -90);
         var token2 = environment.getTokenAt(position2);
         var maneuver2 = Maneuver.STRAIGHT_1_STANDARD;

         var result;

         function callback(planningAction)
         {
            LOGGER.debug("callback()");
            result = planningAction;

            // Verify.
            assert.ok(result);
            assert.ok(!result[token0.id()]);
            assert.ok(!result[token1.id()]);
            assert.ok(result[token2.id()], maneuver2);
         }

         // Run.
         agent.getPlanningAction(callback);
      });

      QUnit.test("getPlanningAction() Rebel 2", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         Adjudicator.create(store);
         var agent = environment.secondAgent();

         var oldPosition = new Position(458, 895, -90);
         var newPosition = new Position(20, 110, -90);
         var token = environment.getTokenAt(oldPosition);
         environment.moveToken(oldPosition, newPosition);

         function callback(planningAction)
         {
            // Verify.
            assert.ok(planningAction);
            assert.ok(planningAction[token.id()]);
            var maneuver = planningAction[token.id()];
            assert.ok(maneuver === Maneuver.STRAIGHT_1_EASY || maneuver === Maneuver.TURN_RIGHT_2_STANDARD);
         }

         // Run.
         agent.getPlanningAction(callback);
      });

      QUnit.test("getShipAction()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment(undefined, MediumAgentStrategy, MediumAgentStrategy);
         var store = environment.store();
         Adjudicator.create(store);
         var name = "myAgent";
         var agent = new Agent(store, name);
         var tokens = environment.pilotInstances();
         var token2 = tokens[2];
         LOGGER.debug("token2 = " + token2);

         function callback(shipAction, isAccepted)
         {
            LOGGER.debug("callback() shipAction = " + shipAction + " isAccepted ? " + isAccepted);

            // Verify.
            assert.ok(shipAction);
            assert.ok(shipAction.source(), ShipAction);
            assert.ok(shipAction.sourceKey(), ShipAction.FOCUS);
            assert.ok(shipAction.abilityType(), ShipActionAbility);
            assert.ok(shipAction.abilityKey(), ShipActionAbility.ABILITY_KEY);
            assert.equal(isAccepted, true);
         }

         // Run.
         agent.getShipAction(token2, callback);
      });

      QUnit.test("getPlanningAction() IG-88A", function(assert)
      {
         // Setup.
         var store00 = Redux.createStore(Reducer.root);
         var iconBase = "../../../main/resources/icons/";
         var imageBase = "../../../main/resources/images/";
         var firstAgent = EnvironmentFactory.createAgent(store00, "First Agent", MediumAgentStrategy, Faction.IMPERIAL, iconBase, imageBase);
         var firstTokens = [new CardInstance(store00, PilotCard.MAULER_MITHEL, firstAgent)];
         var firstSquad = new Squad(Faction.IMPERIAL, "First Squad", 2017, "description", firstTokens);
         var secondAgent = EnvironmentFactory.createAgent(store00, "Second Agent", MediumAgentStrategy, Faction.SCUM, iconBase, imageBase);
         var secondTokens = [new CardInstance(store00, PilotCard.IG_88A, secondAgent)];
         var secondSquad = new Squad(Faction.SCUM, "Second Squad", 2017, "description", secondTokens);

         var store = Redux.createStore(Reducer.root);
         var environment = new Environment(store, firstAgent, firstSquad, secondAgent, secondSquad);
         firstAgent = environment.firstAgent();
         secondAgent = environment.secondAgent();
         var token = environment.pilotInstances()[1];
         Adjudicator.create(store);
         var callback = function(pilotToManeuver)
         {
            // Verify.
            assert.ok(pilotToManeuver);
            assert.ok(pilotToManeuver[token.id()]);
            assert.equal(pilotToManeuver[token.id()], Maneuver.STRAIGHT_3_EASY);
         };

         // Run.
         secondAgent.getPlanningAction(callback);
      });

      QUnit.test("toString()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var agent = new Agent(store, "myAgent", undefined, MediumAgentStrategy);

         // Run.
         var result = agent.toString();

         // Verify.
         assert.ok(result);
         assert.equal(result, "myAgent, MediumAgent");
      });
   });
