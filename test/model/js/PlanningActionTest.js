"use strict";

define(["qunit", "model/js/Action", "model/js/Adjudicator", "model/js/PlanningAction", "../../../test/model/js/EnvironmentFactory"],
   function(QUnit, Action, Adjudicator, PlanningAction, EnvironmentFactory)
   {
      QUnit.module("PlanningAction");

      QUnit.test("doIt()", function(assert)
      {
         // Setup.
         var environment = EnvironmentFactory.createCoreSetEnvironment();
         var store = environment.store();
         var adjudicator = Adjudicator.create(store);
         store.dispatch(Action.setAdjudicator(adjudicator));
         var firstAgent = environment.firstAgent();

         function callback(agent, tokenToManeuver)
         {
            // Verify.
            assert.ok(agent);
            assert.equal(agent, firstAgent);
            assert.ok(tokenToManeuver);
         }
         var action = new PlanningAction(environment, adjudicator, firstAgent, callback);

         // Run.
         action.doIt();
      });
   });
