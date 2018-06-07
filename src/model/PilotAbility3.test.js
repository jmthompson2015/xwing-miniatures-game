import Phase from "../artifact/Phase.js";

import Action from "./Action.js";
import Adjudicator from "./Adjudicator.js";
import CardAction from "./CardAction.js";
import CombatAction from "./CombatAction.js";
import EnvironmentFactory from "./EnvironmentFactory.js";
import MockAttackDice from "./MockAttackDice.js";
import MockDefenseDice from "./MockDefenseDice.js";
import PilotAbility from "./PilotAbility3.js";
import Position from "./Position.js";
import SquadBuilder from "./SquadBuilder.js";

QUnit.module("PilotAbility3");

QUnit.test("Epsilon Leader", function(assert)
{
   // Setup.
   const squadBuilder1 = SquadBuilder.findByNameAndYear("First Order TFA Core Set: 39 Points", 2015);
   const environment = EnvironmentFactory.createEnvironment(squadBuilder1, SquadBuilder.CoreSetRebelSquadBuilder);
   const store = environment.store();
   const firstAgent = environment.firstAgent();
   const pilotInstances1 = firstAgent.pilotInstances();
   const epsilonLeader = pilotInstances1[0];
   const zetaAce = pilotInstances1[1];

   const secondAgent = environment.secondAgent();
   const pilotInstances2 = secondAgent.pilotInstances();
   const lukeSkywalker = pilotInstances2[0];

   const epsilonLeaderPosition0 = environment.getPositionFor(epsilonLeader);
   const epsilonLeaderPosition1 = new Position(510, 20, 90);
   environment.moveToken(epsilonLeaderPosition0, epsilonLeaderPosition1);
   store.dispatch(CardAction.addStressCount(epsilonLeader));
   store.dispatch(CardAction.addStressCount(zetaAce));
   store.dispatch(CardAction.addStressCount(lukeSkywalker));
   const callback = function()
   {
      // Verify.
      assert.ok(true, "test resumed from async operation");
      assert.equal(epsilonLeader.stressCount(), 0, "epsilonLeader.stressCount() === 0");
      assert.equal(zetaAce.stressCount(), 0, "zetaAce.stressCount() === 0");
      assert.equal(lukeSkywalker.stressCount(), 1, "lukeSkywalker.stressCount() === 1");
      done();
   };

   // Run.
   const done = assert.async();
   store.dispatch(Action.enqueuePhase(Phase.COMBAT_START, undefined, callback));
});

QUnit.test("condition()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      const abilities = PilotAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            const ability = abilities[pilotKey];

            if (ability.condition)
            {
               const result = ability.condition(store, token);
               assert.ok(result !== undefined, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
            }
         });
      }
   });
});

QUnit.test("consequent()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.
   const callback = function()
   {
      LOGGER.info("in callback()");
   };

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      const abilities = PilotAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            const ability = abilities[pilotKey];

            if (ability.condition && ability.condition(store, token))
            {
               ability.consequent(store, token, callback);
               assert.ok(true, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
            }
         });
      }
   });
});

QUnit.test("function()", function(assert)
{
   // Setup.
   const environment = createEnvironment();
   const store = environment.store();
   const token = environment.pilotInstances()[2]; // X-Wing.

   // Run / Verify.
   Phase.keys().forEach(function(phaseKey)
   {
      const abilities = PilotAbility[phaseKey];

      if (abilities)
      {
         Object.keys(abilities).forEach(function(pilotKey)
         {
            const ability = abilities[pilotKey];

            if (typeof ability === "function")
            {
               ability(store, token);
               assert.ok(true, "phaseKey = " + phaseKey + " pilotKey = " + pilotKey);
            }
         });
      }
   });

   assert.ok(true);
});

function createEnvironment()
{
   const environment = EnvironmentFactory.createCoreSetEnvironment();
   const store = environment.store();
   Adjudicator.create(store);

   const attacker = environment.pilotInstances()[2]; // X-Wing.
   const weapon = attacker.primaryWeapon();
   const defender = environment.pilotInstances()[0]; // TIE Fighter.
   const callback = function()
   {
      LOGGER.info("in callback()");
   };

   environment.setActiveToken(attacker);
   store.dispatch(CardAction.addFocusCount(attacker));
   store.dispatch(CardAction.addStressCount(attacker));

   store.dispatch(Action.setTokenAttackDice(attacker.id(), (new MockAttackDice(store, attacker.id())).values()));
   store.dispatch(Action.setTokenDefenderHit(attacker, true));
   store.dispatch(Action.setTokenDefenseDice(attacker.id(), (new MockDefenseDice(store, attacker.id())).values()));
   store.dispatch(Action.setTokenInFiringArc(attacker, true));

   const combatAction = new CombatAction(store, attacker, weapon, defender, callback, MockAttackDice, MockDefenseDice);
   store.dispatch(Action.setTokenCombatAction(attacker, combatAction));

   return environment;
}

const PilotAbility3Test = {};
export default PilotAbility3Test;