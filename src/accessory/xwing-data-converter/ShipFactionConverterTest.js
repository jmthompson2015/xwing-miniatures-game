

import QUnit from "qunit";
import ShipFaction from "../../artifact/ShipFaction";
import ShipFactionConverter from "../accessory/xwing-data-converter/ShipFactionConverter";
      QUnit.module("ShipFactionConverter");

      QUnit.test("determineImage()", function(assert)
      {
         // Run / Verify.
         assert.equal(ShipFactionConverter.determineImage(ShipFaction.properties[ShipFaction.REBEL_X_WING]), "\"Rebel_X-Wing.png\"");
         assert.equal(ShipFactionConverter.determineImage(ShipFaction.properties[ShipFaction.SCUM_FIRESPRAY_31]), "\"Firespray-31.png\"");
         assert.equal(ShipFactionConverter.determineImage(ShipFaction.properties[ShipFaction.SCUM_YV_666]), "\"Scum_YV-666.png\"");
      });
   
