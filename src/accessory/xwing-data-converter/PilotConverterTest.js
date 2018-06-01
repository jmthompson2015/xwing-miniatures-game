

import QUnit from "qunit";
import PilotCard from "../../artifact/PilotCard";
import PilotConverter from "../accessory/xwing-data-converter/PilotConverter";
      QUnit.module("PilotConverter");

      var BOBA_FETT_IMPERIAL = {
         "name": "Boba Fett",
         "ship": "Firespray-31",
         "faction": "Galactic Empire",
         "xws": "bobafett",
      };

      var BOBA_FETT_SCUM = {
         "name": "Boba Fett",
         "ship": "Firespray-31",
         "faction": "Scum and Villainy",
         "xws": "bobafett",
      };

      var CARNOR_JAX = {
         "name": "Carnor Jax",
         "ship": "TIE Interceptor",
         "faction": "Galactic Empire",
         "xws": "carnorjax",
      };

      var DAGGER_SQUADRON_PILOT = {
         "name": "Dagger Squadron Pilot",
         "ship": "B-wing",
         "faction": "Rebel Alliance",
         "xws": "daggersquadronpilot",
      };

      var DALAN_OBEROS_STAR_VIPER = {
         "name": "Dalan Oberos",
         "xws": "dalanoberos",
         "ship": "StarViper",
         "faction": "Scum and Villainy",
      };

      var DALAN_OBEROS_KIMOGILA = {
         "name": "Dalan Oberos",
         "xws": "dalanoberos",
         "ship": "M12-L Kimogila Fighter",
         "faction": "Scum and Villainy",
      };

      var POE_DAMERON = {
         "name": "Poe Dameron",
         "ship": "T-70 X-wing",
         "faction": "Resistance",
         "xws": "poedameron",
      };

      var POE_DAMERON_HOTR = {
         "name": "Poe Dameron",
         "xws": "poedameron-swx57",
         "ship": "T-70 X-wing",
         "faction": "Resistance",
      };

      var PILOT_ARRAY = [BOBA_FETT_IMPERIAL, BOBA_FETT_SCUM, DALAN_OBEROS_KIMOGILA, DALAN_OBEROS_STAR_VIPER, POE_DAMERON, POE_DAMERON_HOTR];

      QUnit.test("determineShipFactionKey Carnor Jax", function(assert)
      {
         // Run.
         var result = PilotConverter.determineShipFactionKey(CARNOR_JAX, PilotCard.properties[PilotCard.CARNOR_JAX]);

         // Verify.
         assert.ok(result);
         assert.equal(result, "ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V3");
      });

      QUnit.test("determineShipFactionKey Dagger Squadron Pilot", function(assert)
      {
         // Run.
         var result = PilotConverter.determineShipFactionKey(DAGGER_SQUADRON_PILOT, PilotCard.properties[PilotCard.DAGGER_SQUADRON_PILOT]);

         // Verify.
         assert.ok(result);
         assert.equal(result, "ShipFaction.REBEL_B_WING_V2");
      });

      QUnit.skip("generateEnums", function(assert)
      {
         // Run.
         var result = PilotConverter.generateEnums(PILOT_ARRAY);

         // Verify.
         assert.ok(result);
         assert.equal(result, "BOBA_FETT_IMPERIAL: \"bobaFett_imperial\",<br/>BOBA_FETT_SCUM: \"bobaFett_scum\",<br/>DALAN_OBEROS_M12_L_KIMOGILA_FIGHTER: \"dalanOberos_m12LKimogilaFighter\",<br/>DALAN_OBEROS_STAR_VIPER: \"dalanOberos_starViper\",<br/>POE_DAMERON: \"poeDameron\",<br/>POE_DAMERON_HOTR: \"poeDameron_hotr\",<br/><br/>// Huge ships.<br/>C_ROC_CRUISER: \"cRocCruiser\",<br/>CR90_CORVETTE: \"cr90Corvette\",<br/>GOZANTI_CLASS_CRUISER: \"gozantiClassCruiser\",<br/>GR_75_MEDIUM_TRANSPORT: \"gr75MediumTransport\",<br/>RAIDER_CLASS_CORVETTE: \"raiderClassCorvette\",<br/>");
      });
   
