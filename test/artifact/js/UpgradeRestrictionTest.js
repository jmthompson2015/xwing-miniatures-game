"use strict";

define(["qunit", "artifact/js/PilotCard", "artifact/js/UpgradeRestriction"],
   function(QUnit, PilotCard, UpgradeRestriction)
   {
      QUnit.module("UpgradeRestriction");

      QUnit.test("UpgradeRestriction properties A-Wing only", function(assert)
      {
         var restrictionKey = UpgradeRestriction.A_WING_ONLY;
         var props = UpgradeRestriction.properties[restrictionKey];

         assert.equal(props.name, "A-Wing only.");
         assert.ok(!props.passes(PilotCard.ACADEMY_PILOT));
         assert.ok(props.passes(PilotCard.ARVEL_CRYNYD));
      });

      QUnit.test("UpgradeRestriction properties Imperial only", function(assert)
      {
         var restrictionKey = UpgradeRestriction.IMPERIAL_ONLY;
         var props = UpgradeRestriction.properties[restrictionKey];

         assert.equal(props.name, "Imperial only.");
         assert.ok(props.passes(PilotCard.ACADEMY_PILOT));
         assert.ok(!props.passes(PilotCard.ARVEL_CRYNYD));
      });

      QUnit.test("UpgradeRestriction properties Large ship only", function(assert)
      {
         var restrictionKey = UpgradeRestriction.LARGE_SHIP_ONLY;
         var props = UpgradeRestriction.properties[restrictionKey];

         assert.equal(props.name, "Large ship only.");
         assert.ok(!props.passes(PilotCard.ACADEMY_PILOT));
         assert.ok(props.passes(PilotCard.BOBA_FETT_IMPERIAL));
      });

      QUnit.test("UpgradeRestriction properties PilotCard Skill above 3", function(assert)
      {
         var restrictionKey = UpgradeRestriction.PILOT_SKILL_ABOVE_3;
         var props = UpgradeRestriction.properties[restrictionKey];

         assert.equal(props.name, "PilotCard Skill above \"3\".");
         assert.ok(!props.passes(PilotCard.ACADEMY_PILOT));
         assert.ok(props.passes(PilotCard.BOBA_FETT_IMPERIAL));
      });

      QUnit.test("passes()", function(assert)
      {
         assert.ok(UpgradeRestriction.passes([UpgradeRestriction.IMPERIAL_ONLY], PilotCard.DARTH_VADER));
         assert.ok(!UpgradeRestriction.passes([UpgradeRestriction.IMPERIAL_ONLY], PilotCard.LUKE_SKYWALKER));

         assert.ok(!UpgradeRestriction.passes([UpgradeRestriction.REBEL_ONLY], PilotCard.DARTH_VADER));
         assert.ok(UpgradeRestriction.passes([UpgradeRestriction.REBEL_ONLY], PilotCard.LUKE_SKYWALKER));

         assert.ok(UpgradeRestriction.passes(
                [UpgradeRestriction.IMPERIAL_ONLY, UpgradeRestriction.TIE_INTERCEPTOR_ONLY],
            PilotCard.ALPHA_SQUADRON_PILOT));
         assert
            .ok(!UpgradeRestriction.passes(
                        [UpgradeRestriction.REBEL_ONLY, UpgradeRestriction.TIE_INTERCEPTOR_ONLY],
               PilotCard.ALPHA_SQUADRON_PILOT));
         assert.ok(!UpgradeRestriction.passes([UpgradeRestriction.IMPERIAL_ONLY, UpgradeRestriction.Y_WING_ONLY],
            PilotCard.ALPHA_SQUADRON_PILOT));
         assert.ok(!UpgradeRestriction.passes([UpgradeRestriction.REBEL_ONLY, UpgradeRestriction.Y_WING_ONLY],
            PilotCard.ALPHA_SQUADRON_PILOT));

         assert.ok(!UpgradeRestriction.passes([UpgradeRestriction.IMPERIAL_ONLY,
                UpgradeRestriction.TIE_INTERCEPTOR_ONLY], PilotCard.DUTCH_VANDER));
         assert.ok(!UpgradeRestriction.passes(
                [UpgradeRestriction.REBEL_ONLY, UpgradeRestriction.TIE_INTERCEPTOR_ONLY], PilotCard.DUTCH_VANDER));
         assert.ok(!UpgradeRestriction.passes([UpgradeRestriction.IMPERIAL_ONLY, UpgradeRestriction.Y_WING_ONLY],
            PilotCard.DUTCH_VANDER));
         assert.ok(UpgradeRestriction.passes([UpgradeRestriction.REBEL_ONLY, UpgradeRestriction.Y_WING_ONLY],
            PilotCard.DUTCH_VANDER));

         assert.ok(UpgradeRestriction.passes(undefined, PilotCard.DUTCH_VANDER));
         assert.ok(UpgradeRestriction.passes([], PilotCard.DUTCH_VANDER));
      });

      QUnit.test("passes() TIE only", function(assert)
      {
         var restriction = UpgradeRestriction.properties[UpgradeRestriction.TIE_ONLY];

         assert.ok(restriction.passes(PilotCard.DARTH_VADER)); // TIE Advanced.
         assert.ok(restriction.passes(PilotCard.CAPTAIN_JONUS)); // TIE Bomber.
         assert.ok(restriction.passes(PilotCard.COLONEL_VESSERY)); // TIE Defender.
         assert.ok(restriction.passes(PilotCard.ACADEMY_PILOT)); // TIE Fighter.
         assert.ok(restriction.passes(PilotCard.EPSILON_ACE)); // TIE/fo Fighter.
         assert.ok(restriction.passes(PilotCard.ALPHA_SQUADRON_PILOT)); // TIE Interceptor.
         assert.ok(restriction.passes(PilotCard.ECHO)); // TIE Phantom.
         assert.ok(restriction.passes(PilotCard.BLACK_EIGHT_SQ_PILOT)); // TIE Punisher.

         assert.ok(!restriction.passes(PilotCard.AIREN_CRACKEN));
         assert.ok(!restriction.passes(PilotCard.ARVEL_CRYNYD));
         assert.ok(!restriction.passes(PilotCard.BANDIT_SQUADRON_PILOT));
         assert.ok(!restriction.passes(PilotCard.LUKE_SKYWALKER));
      });

      QUnit.test("passes() X-Wing only", function(assert)
      {
         var restriction = UpgradeRestriction.properties[UpgradeRestriction.X_WING_ONLY];

         // T-65 X-Wings.
         assert.ok(restriction.passes(PilotCard.BIGGS_DARKLIGHTER));
         assert.ok(restriction.passes(PilotCard.GARVEN_DREIS));
         assert.ok(restriction.passes(PilotCard.HOBBIE_KLIVIAN));
         assert.ok(restriction.passes(PilotCard.JEK_PORKINS));
         assert.ok(restriction.passes(PilotCard.LUKE_SKYWALKER));
         assert.ok(restriction.passes(PilotCard.RED_SQUADRON_PILOT));
         assert.ok(restriction.passes(PilotCard.ROOKIE_PILOT));
         assert.ok(restriction.passes(PilotCard.TARN_MISON));
         assert.ok(restriction.passes(PilotCard.WEDGE_ANTILLES));
         assert.ok(restriction.passes(PilotCard.WES_JANSON));

         // T-70 X-Wings.
         assert.ok(restriction.passes(PilotCard.BLUE_ACE));
         assert.ok(restriction.passes(PilotCard.BLUE_SQUADRON_NOVICE));
         assert.ok(restriction.passes(PilotCard.ELLO_ASTY));
         assert.ok(restriction.passes(PilotCard.POE_DAMERON));
         assert.ok(restriction.passes(PilotCard.RED_ACE));
         assert.ok(restriction.passes(PilotCard.RED_SQUADRON_VETERAN));

         // Other.
         assert.ok(!restriction.passes(PilotCard.DARTH_VADER));
         assert.ok(!restriction.passes(PilotCard.CAPTAIN_JONUS));
         assert.ok(!restriction.passes(PilotCard.COLONEL_VESSERY));
         assert.ok(!restriction.passes(PilotCard.ACADEMY_PILOT));
      });

      QUnit.test("keys()", function(assert)
      {
         // Run.
         var result = UpgradeRestriction.keys();

         // Verify.
         assert.ok(result);
         var length = 50;
         assert.equal(result.length, length);
         var i = 0;
         assert.equal(result[i++], UpgradeRestriction.A_WING_ONLY);
         assert.equal(result[i++], UpgradeRestriction.AGGRESSOR_ONLY);
         assert.equal(result[i++], UpgradeRestriction.ARC_170_ONLY);
         assert.equal(result[i++], UpgradeRestriction.B_WING_ONLY);
         assert.equal(result[i++], UpgradeRestriction.C_ROC_CRUISER_AND_GR_75_ONLY);
         assert.equal(result[i++], UpgradeRestriction.C_ROC_CRUISER_ONLY);
         assert.equal(result[i++], UpgradeRestriction.CR90_ONLY);
         assert.equal(result[i++], UpgradeRestriction.FIRESPRAY_31_ONLY);
         assert.equal(result[i++], UpgradeRestriction.G_1A_STARFIGHTER_ONLY);
         assert.equal(result[i++], UpgradeRestriction.GOZANTI_CLASS_CRUISER_ONLY);
         assert.equal(result[i++], UpgradeRestriction.GR_75_ONLY);
         assert.equal(result[i++], UpgradeRestriction.HUGE_SHIP_ONLY);
         assert.equal(result[i++], UpgradeRestriction.HWK_290_ONLY);
         assert.equal(result[i++], UpgradeRestriction.IMPERIAL_ONLY);
         assert.equal(result[i++], UpgradeRestriction.JUMP_MASTER_5000_ONLY);
         assert.equal(result[i++], UpgradeRestriction.LAMBDA_CLASS_SHUTTLE_ONLY);
         assert.equal(result[i++], UpgradeRestriction.LANCER_CLASS_PURSUIT_CRAFT_ONLY);
         assert.equal(result[i++], UpgradeRestriction.LARGE_SHIP_ONLY);
         assert.equal(result[i++], UpgradeRestriction.LIMITED);
         assert.equal(result[i++], UpgradeRestriction.M3_A_INTERCEPTOR_ONLY);
         assert.equal(result[i++], UpgradeRestriction.PILOT_SKILL_ABOVE_1);
         assert.equal(result[i++], UpgradeRestriction.PILOT_SKILL_ABOVE_2);
         assert.equal(result[i++], UpgradeRestriction.PILOT_SKILL_ABOVE_3);
         assert.equal(result[i++], UpgradeRestriction.PILOT_SKILL_ABOVE_4);
         assert.equal(result[i++], UpgradeRestriction.PROTECTORATE_STARFIGHTER_ONLY);
         assert.equal(result[i++], UpgradeRestriction.RAIDER_CLASS_CORVETTE_AFT_SECTION_ONLY);
         assert.equal(result[i++], UpgradeRestriction.REBEL_AND_SCUM_ONLY);
         assert.equal(result[i++], UpgradeRestriction.REBEL_ONLY);
         assert.equal(result[i++], UpgradeRestriction.SCUM_ONLY);
         assert.equal(result[i++], UpgradeRestriction.SMALL_SHIP_ONLY);
         assert.equal(result[i++], UpgradeRestriction.STAR_VIPER_ONLY);
         assert.equal(result[i++], UpgradeRestriction.T_70_X_WING_ONLY);
         assert.equal(result[i++], UpgradeRestriction.TIE_ADVANCED_ONLY);
         assert.equal(result[i++], UpgradeRestriction.TIE_ADVANCED_PROTOTYPE_ONLY);
         assert.equal(result[i++], UpgradeRestriction.TIE_BOMBER_ONLY);
         assert.equal(result[i++], UpgradeRestriction.TIE_DEFENDER_ONLY);
         assert.equal(result[i++], UpgradeRestriction.TIE_INTERCEPTOR_ONLY);
         assert.equal(result[i++], UpgradeRestriction.TIE_ONLY);
         assert.equal(result[i++], UpgradeRestriction.TIE_PHANTOM_ONLY);
         assert.equal(result[i++], UpgradeRestriction.TIE_SF_ONLY);
         assert.equal(result[i++], UpgradeRestriction.U_WING_ONLY);
         assert.equal(result[i++], UpgradeRestriction.UPSILON_CLASS_SHUTTLE_ONLY);
         assert.equal(result[i++], UpgradeRestriction.VCX_100_ONLY);
         assert.equal(result[i++], UpgradeRestriction.VT_49_DECIMATOR_ONLY);
         assert.equal(result[i++], UpgradeRestriction.X_WING_ONLY);
         assert.equal(result[i++], UpgradeRestriction.YT_1300_AND_YT_2400_ONLY);
         assert.equal(result[i++], UpgradeRestriction.YT_1300_ONLY);
         assert.equal(result[i++], UpgradeRestriction.YT_2400_ONLY);
         assert.equal(result[i++], UpgradeRestriction.Y_WING_ONLY);
         assert.equal(result[i++], UpgradeRestriction.YV_666_ONLY);

         var properties = Object.getOwnPropertyNames(UpgradeRestriction);
         var count = properties.length - 1 - // properties
            1 - // keys
            1 - // passes
            1 - // toString
            1; // values
         assert.equal(result.length, count);
      });
   });
