

import Bearing from "../../artifact/Bearing";
import Difficulty from "../../artifact/Difficulty";
import Ship from "../../artifact/Ship";
import ShipAction from "../../artifact/ShipAction";
import EnumGenerator from "../accessory/xwing-data-converter/EnumGenerator";
import XWingData from "../accessory/xwing-data-converter/XWingData";
import XWingType from "../accessory/xwing-data-converter/XWingType";
      var ReferenceConverter = {};

      ReferenceConverter.convert = function(callback)
      {
         var finishConvert = this.finishConvert.bind(this);
         var finishCallback = function(response)
         {
            finishConvert(response, callback);
         };

         var xwingData = new XWingData();
         xwingData.load(finishCallback);
      };

      ReferenceConverter.finishConvert = function(xwingData, callback)
      {
         var enums = generateEnums(xwingData);
         var properties = generateProperties(xwingData);

         callback(xwingData, enums, properties);
      };

      function createExtraReferenceEnums()
      {
         var answer = [];

         answer.push("ACQUIRE_A_TARGET_LOCK_ACTION: \"acquireATargetLockAction\",<br/>");
         answer.push("ALTERNATE_PRIMARY_WEAPONS: \"alternatePrimaryWeapons\",<br/>");
         answer.push("BARREL_ROLL_ACTION: \"barrelRollAction\",<br/>");
         answer.push("EVADE_ACTION: \"evadeAction\",<br/>");
         answer.push("FOCUS_ACTION: \"focusAction\",<br/>");
         answer.push("STRESS_TOKEN: \"stressToken\",<br/>");
         answer.push("THE_COMBAT_PHASE: \"theCombatPhase\",<br/>");
         answer.push("THE_GAME_ROUND: \"theGameRound\",<br/>");

         return answer;
      }

      function createExtraReferenceProperties()
      {
         var answer = [];
         var resourceBase = "../../../src/resource/referenceCard";

         answer.push("\"acquireATargetLockAction\":<br/>{<br/>name: \"Acquire a Target Lock Action\",<br/>image: \"" + resourceBase + "/Acquire_A_Target_Lock_Action.png\",<br/>key: \"acquireATargetLockAction\",<br/>},<br/>");
         answer.push("\"alternatePrimaryWeapons\":<br/>{<br/>name: \"Alternate Primary Weapons\",<br/>image: \"" + resourceBase + "/Alternate_Primary_Weapons.png\",<br/>key: \"alternatePrimaryWeapons\",<br/>},<br/>");
         answer.push("\"barrelRollAction\":<br/>{<br/>name: \"Barrel Roll Action\",<br/>image: \"" + resourceBase + "/Barrel_Roll_Action.png\",<br/>key: \"barrelRollAction\",<br/>},<br/>");
         answer.push("\"evadeAction\":<br/>{<br/>name: \"Evade Action\",<br/>image: \"" + resourceBase + "/Evade_Action.png\",<br/>key: \"evadeAction\",<br/>},<br/>");
         answer.push("\"focusAction\":<br/>{<br/>name: \"Focus Action\",<br/>image: \"" + resourceBase + "/Focus_Action.png\",<br/>key: \"focusAction\",<br/>},<br/>");
         answer.push("\"stressToken\":<br/>{<br/>name: \"Stress Token\",<br/>image: \"" + resourceBase + "/Stress_Token.png\",<br/>key: \"stressToken\",<br/>},<br/>");
         answer.push("\"theCombatPhase\":<br/>{<br/>name: \"The Combat Phase\",<br/>image: \"" + resourceBase + "/The_Combat_Phase.png\",<br/>key: \"theCombatPhase\",<br/>},<br/>");
         answer.push("\"theGameRound\":<br/>{<br/>name: \"The Game Round\",<br/>image: \"" + resourceBase + "/The_Game_Round.png\",<br/>key: \"theGameRound\",<br/>},<br/>");

         return answer;
      }

      function generateEnums(xwingData)
      {
         var referenceArray = xwingData.dataByType(XWingType.REFERENCES);
         var enumNames = [];
         var enumValues = [];

         var enums = referenceArray.reduce(function(accumulator, reference)
         {
            var enumName = EnumGenerator.createReferenceEnumName(reference);

            if (enumNames.includes(enumName))
            {
               LOGGER.warn("Duplicate enum name " + enumName);
            }

            enumNames.push(enumName);

            var enumValue = EnumGenerator.createReferenceEnumValue(reference);

            if (enumValues.includes(enumValue))
            {
               LOGGER.warn("Duplicate enum value " + enumValue);
            }

            enumValues.push(enumValue);
            accumulator.push(enumName + ": " + enumValue + ",<br/>");

            return accumulator;
         }, []);

         enums = enums.concat(createExtraReferenceEnums());

         enums.sort();

         return enums.join("");
      }

      function generateProperties(xwingData)
      {
         var referenceArray = xwingData.dataByType(XWingType.REFERENCES);
         var properties = referenceArray.reduce(function(accumulator, reference)
         {
            var enumValue = EnumGenerator.createReferenceEnumValue(reference);
            accumulator.push(enumValue + ":<br/>{<br/>" + generatePropertiesSingle(reference) + "},<br/>");

            return accumulator;
         }, []);

         properties = properties.concat(createExtraReferenceProperties());

         properties.sort();

         return "properties:<br/>{<br/>" + properties.join("") + "},<br/>";
      }

      function generatePropertiesSingle(reference)
      {
         var name = reference.title + " " + reference.subtitle;
         name = name.replace(" Reference Card", "");
         name = EnumGenerator.quoteValue(name);
         var image = EnumGenerator.quoteValue(reference.image);

         var answer = "";

         answer += EnumGenerator.createProperty("name", name);
         answer += EnumGenerator.createProperty("image", image);
         answer += EnumGenerator.createProperty("key", EnumGenerator.createReferenceEnumValue(reference));

         return answer;
      }

      export default ReferenceConverter;
   
