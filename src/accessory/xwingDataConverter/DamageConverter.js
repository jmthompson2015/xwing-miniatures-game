"use strict";

define(["common/js/InputValidator", "artifact/js/Bearing", "artifact/js/DamageCard", "artifact/js/DamageCardTrait", "artifact/js/Difficulty", "artifact/js/Ship", "artifact/js/ShipAction", "artifact/js/ShipFaction", "accessory/xwingDataConverter/EnumGenerator", "accessory/xwingDataConverter/FactionConverter", "common/js/FileLoader"],
   function(InputValidator, Bearing, DamageCard, DamageCardTrait, Difficulty, Ship, ShipAction, ShipFaction, EnumGenerator, FactionConverter, FileLoader)
   {
      var DamageConverter = {};

      DamageConverter.convert = function(callback)
      {
         var finishConvert = this.finishConvert1.bind(this);
         var finishCallback = function(response)
         {
            finishConvert(response, callback);
         };

         FileLoader.loadFile("../../../lib/xwing-data/data/damage-deck-core.js", finishCallback);
      };

      DamageConverter.finishConvert1 = function(response1, callback)
      {
         var finishConvert = this.finishConvert2.bind(this);
         var finishCallback = function(response)
         {
            finishConvert(response1, response, callback);
         };

         FileLoader.loadFile("../../../lib/xwing-data/data/damage-deck-core-tfa.js", finishCallback);
      };

      DamageConverter.finishConvert2 = function(response1, response2, callback)
      {
         var damageArray = JSON.parse(response1);
         var damageV2Array = JSON.parse(response2);

         var enums = generateEnums(damageArray, damageV2Array);
         var properties = generateProperties(damageArray, damageV2Array);

         callback(damageArray, damageV2Array, enums, properties);
      };

      function determineActionDescription(damage)
      {
         var answer;

         var index = damage.text.indexOf("<strong>Action:");

         if (index >= 0)
         {
            answer = damage.text.substring(index);

            answer = answer.replace(/"/g, "\\\"");
            answer = answer.replace(/<strong>/g, "&lt;strong>");
            answer = answer.replace(/<\/strong>/g, "&lt;\/strong>");
            answer = answer.replace(/<br \/>/g, "&lt;br />");

            answer = EnumGenerator.quoteValue(answer);
         }

         return answer;
      }

      function determineAgilityValue(damage, damageCard)
      {
         var answer;

         if (damageCard)
         {
            answer = damageCard.agilityValue;
         }

         return answer;
      }

      function determineDescription(damage, damageCard)
      {
         var answer = damage.text;

         if (answer === undefined && damageCard)
         {
            answer = damageCard.description;
         }

         var index = answer.indexOf("<strong>Action:");

         if (index >= 0)
         {
            answer = answer.substring(0, index);
         }

         answer = answer.replace(/"/g, "\\\"");
         answer = answer.replace(/<strong>/g, "&lt;strong>");
         answer = answer.replace(/<\/strong>/g, "&lt;\/strong>");
         answer = answer.replace(/<br \/>/g, "&lt;br />");

         if (answer !== undefined)
         {
            answer = EnumGenerator.quoteValue(answer);
         }

         return answer;
      }

      function determineHasAction(damage)
      {
         var answer;

         if (damage.text.indexOf("Action:") >= 0)
         {
            answer = true;
         }

         return answer;
      }

      function determineImage(damage)
      {
         var answer;

         if (damage.image !== undefined)
         {
            answer = EnumGenerator.quoteValue(damage.image);
         }

         return answer;
      }

      function determineIsImplemented(damage, damageCard)
      {
         var answer;

         if (damageCard)
         {
            answer = damageCard.isImplemented;
         }

         return answer;
      }

      function determinePrimaryWeaponValue(damage, damageCard)
      {
         var answer;

         if (damageCard)
         {
            answer = damageCard.primaryWeaponValue;
         }

         return answer;
      }

      function findDamageCard(damageEnumValue)
      {
         var damageCard = DamageCard.properties[damageEnumValue];

         if (damageCard === undefined)
         {
            LOGGER.warn("Can't find damageCard for " + damageEnumValue);
         }

         return damageCard;
      }

      function generateEnums(damageArray, damageV2Array)
      {
         var enums0 = generateEnumsSubset(damageArray, "", "");
         var enums1 = generateEnumsSubset(damageV2Array, "_V2", "V2");
         var enums = enums0.concat(enums1);

         return enums.join("");
      }

      function generateEnumsSubset(damageArray, suffix0, suffix1)
      {
         var enumNames = [];
         var enumValues = [];

         var enums = damageArray.reduce(function(accumulator, damage)
         {
            var enumName = EnumGenerator.createDamageEnumName(damage) + suffix0;

            if (enumNames.includes(enumName))
            {
               LOGGER.warn("Duplicate enum name " + enumName);
            }

            enumNames.push(enumName);

            var enumValue = EnumGenerator.createDamageEnumValue(damage, false) + suffix1;
            enumValue = EnumGenerator.quoteValue(enumValue);

            if (enumValues.includes(enumValue))
            {
               LOGGER.warn("Duplicate enum value " + enumValue);
            }

            enumValues.push(enumValue);
            accumulator.push(enumName + ": " + enumValue + ",<br/>");
            return accumulator;
         }, []);

         enums.sort();

         return enums;
      }

      function generateProperties(damageArray, damageV2Array)
      {
         var properties0 = generatePropertiesSubset(damageArray, "");
         var properties1 = generatePropertiesSubset(damageV2Array, "V2");
         var properties = properties0.concat(properties1);

         return "properties:<br/>{<br/>" + properties.join("") + "},<br/>";
      }

      function generatePropertiesSubset(damageArray, suffix)
      {
         var properties = damageArray.reduce(function(accumulator, damage)
         {
            var enumValue = EnumGenerator.createDamageEnumValue(damage, false) + suffix;
            enumValue = EnumGenerator.quoteValue(enumValue);
            accumulator.push(enumValue + ":<br/>{<br/>" + generatePropertiesSingle(damage, suffix) + "},<br/>");
            return accumulator;
         }, []);

         properties.sort();

         return properties;
      }

      function generatePropertiesSingle(damage, suffix)
      {
         var name = damage.name;
         name = EnumGenerator.quoteValue(name);

         var damageEnumValue = EnumGenerator.createDamageEnumValue(damage, false) + suffix;
         var key = EnumGenerator.quoteValue(damageEnumValue);

         var damageCard = findDamageCard(damageEnumValue);

         var actionDescription = determineActionDescription(damage, damageCard);
         var agilityValue = determineAgilityValue(damage, damageCard);
         var description = determineDescription(damage, damageCard);
         var hasAction = determineHasAction(damage, damageCard);
         var image = determineImage(damage, damageCard);
         var isImplemented = determineIsImplemented(damage, damageCard);
         var primaryWeaponValue = determinePrimaryWeaponValue(damage, damageCard);
         var trait = "DamageCardTrait." + DamageCardTrait.findByName(damage.type).key.toUpperCase();

         var answer = "";

         answer += EnumGenerator.createProperty("name", name);
         answer += EnumGenerator.createProperty("trait", trait);
         answer += EnumGenerator.createProperty("description", description);
         answer += EnumGenerator.createProperty("primaryWeaponValue", primaryWeaponValue);
         answer += EnumGenerator.createProperty("agilityValue", agilityValue);
         answer += EnumGenerator.createProperty("hasAction", hasAction);
         answer += EnumGenerator.createProperty("actionDescription", actionDescription);
         answer += EnumGenerator.createProperty("image", image);
         answer += EnumGenerator.createProperty("isImplemented", isImplemented);
         answer += EnumGenerator.createProperty("key", key);

         return answer;
      }

      return DamageConverter;
   });