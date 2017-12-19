"use strict";

define(["artifact/js/Bearing", "artifact/js/Difficulty", "artifact/js/ShipAction", "artifact/js/UpgradeCard", "artifact/js/UpgradeHeader", "artifact/js/UpgradeType", "accessory/xwingDataConverter/EnumGenerator", "common/js/FileLoader"],
   function(Bearing, Difficulty, ShipAction, UpgradeCard, UpgradeHeader, UpgradeType, EnumGenerator, FileLoader)
   {
      var XwingDataUpgradeConverter = {};

      XwingDataUpgradeConverter.convert = function(callback)
      {
         var finishConvert = this.finishConvert.bind(this);
         var finishCallback = function(response)
         {
            finishConvert(response, callback);
         };

         FileLoader.loadFile("../../../lib/xwing-data/data/upgrades.js", finishCallback);
      };

      XwingDataUpgradeConverter.finishConvert = function(response, callback)
      {
         var upgradeArray = JSON.parse(response);

         var enums = generateEnums(upgradeArray);
         var properties = generateProperties(upgradeArray);

         callback(upgradeArray, enums, properties);
      };

      function determineCancelAllDiceResults(upgrade, upgradeCard)
      {
         var answer;

         if (upgradeCard !== undefined && upgradeCard.cancelAllDiceResults !== undefined)
         {
            answer = upgradeCard.cancelAllDiceResults;
         }

         return answer;
      }

      function determineDescription(upgrade, upgradeCard)
      {
         var answer = upgrade.text;

         if (answer === undefined && upgradeCard)
         {
            answer = upgradeCard.description;
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

      function determineDiscardThisCard(upgrade, upgradeCard)
      {
         var answer;

         if (upgradeCard !== undefined && upgradeCard.discardThisCard !== undefined)
         {
            answer = upgradeCard.discardThisCard;
         }

         return answer;
      }

      function determineFiringArcKey(upgrade, upgradeCard)
      {
         var answer;

         if (upgrade.attack !== undefined || determineIsWeaponTurret(upgrade, upgradeCard))
         {
            answer = "FiringArc.FORWARD";
         }

         return answer;
      }

      function determineHeaderKey(upgrade, upgradeCard)
      {
         var answer;

         if (upgradeCard !== undefined && upgradeCard.headerKey !== undefined)
         {
            var header = UpgradeHeader.properties[upgradeCard.headerKey];
            var headerEnumName = header.name;
            headerEnumName = headerEnumName.replace(/ /g, "_");
            headerEnumName = headerEnumName.replace(/\[/g, "");
            headerEnumName = headerEnumName.replace(/\]/g, "");
            headerEnumName = headerEnumName.toUpperCase();
            answer = "UpgradeHeader." + headerEnumName;
         }

         return answer;
      }

      function determineImage(upgrade)
      {
         var answer;

         if (upgrade.image !== undefined)
         {
            answer = EnumGenerator.quoteValue(upgrade.image);
         }

         return answer;
      }

      function determineIsImplemented(upgrade, upgradeCard)
      {
         var answer;

         if (upgradeCard)
         {
            answer = upgradeCard.isImplemented;
         }

         return answer;
      }

      function determineIsWeaponTurret(upgrade, upgradeCard)
      {
         var answer;

         if (upgrade.slot === "Turret")
         {
            answer = true;
         }
         else if (upgrade.attack !== undefined)
         {
            answer = (upgradeCard && upgradeCard.isWeaponTurret);
         }

         return answer;
      }

      var RANGES = [undefined, "ONE", "TWO", "THREE", "FOUR", "FIVE"];

      function determineRangeKeys(upgrade)
      {
         var answer;

         if (upgrade.range !== undefined)
         {
            var parts = upgrade.range.split("-");
            var min = parseInt(parts[0]);
            var max = parseInt(parts[parts.length - 1]);
            var rangeKeys = [];

            for (var i = min; i <= max; i++)
            {
               rangeKeys.push("Range." + RANGES[i]);
            }

            answer = "[" + rangeKeys.join(", ") + "]";
         }

         return answer;
      }

      function determineRestrictionKeys(upgrade)
      {
         var answer;
         var restrictionKeys = [];

         switch (upgrade.faction)
         {
            case "Galactic Empire":
               restrictionKeys.push("UpgradeRestriction.IMPERIAL_ONLY");
               break;
            case "Rebel Alliance":
               restrictionKeys.push("UpgradeRestriction.REBEL_ONLY");
               break;
            case "Scum and Villainy":
               restrictionKeys.push("UpgradeRestriction.SCUM_ONLY");
               break;
         }

         if (upgrade.ship)
         {
            upgrade.ship.forEach(function(ship)
            {
               var shipEnumName = EnumGenerator.createShipEnumName(ship);
               restrictionKeys.push("UpgradeRestriction." + shipEnumName + "_ONLY");
            });
         }

         if (upgrade.size)
         {
            upgrade.size.forEach(function(size)
            {
               switch (size)
               {
                  case "small":
                     restrictionKeys.push("UpgradeRestriction.SMALL_SHIP_ONLY");
                     break;
                  case "large":
                     restrictionKeys.push("UpgradeRestriction.LARGE_SHIP_ONLY");
                     break;
                  case "huge":
                     restrictionKeys.push("UpgradeRestriction.HUGE_SHIP_ONLY");
                     break;
               }
            });
         }

         if (upgrade.limited)
         {
            restrictionKeys.push("UpgradeRestriction.LIMITED");
         }

         if (restrictionKeys.length > 0)
         {
            restrictionKeys.sort();
            answer = "[" + restrictionKeys.join(", ") + "]";
         }

         return answer;
      }

      function determineSpendFocus(upgrade, upgradeCard)
      {
         var answer;

         if (upgradeCard !== undefined && upgradeCard.spendFocus !== undefined)
         {
            answer = upgradeCard.spendFocus;
         }

         return answer;
      }

      function determineSpendTargetLock(upgrade, upgradeCard)
      {
         var answer;

         if (upgradeCard !== undefined && upgradeCard.spendTargetLock !== undefined)
         {
            answer = upgradeCard.spendTargetLock;
         }

         return answer;
      }

      function determineWeaponValue(upgrade, upgradeCard)
      {
         var answer;

         if (upgrade.attack !== undefined)
         {
            answer = upgrade.attack;
         }
         else if (upgradeCard !== undefined && upgradeCard.weaponValue !== undefined)
         {
            answer = upgradeCard.weaponValue;
         }

         return answer;
      }

      function findUpgradeCard(upgrade)
      {
         var enumValue = EnumGenerator.createUpgradeEnumValue(upgrade);
         enumValue = enumValue.replace(/"/g, "");
         var upgradeCard = UpgradeCard.properties[enumValue];

         if (upgradeCard === undefined)
         {
            LOGGER.warn("Can't find upgradeCard for " + enumValue);
         }

         return upgradeCard;
      }

      function generateEnums(upgradeArray)
      {
         var enumNames = [];
         var enumValues = [];

         var enums = upgradeArray.reduce(function(accumulator, upgrade)
         {
            var enumName = EnumGenerator.createUpgradeEnumName(upgrade);
            if (enumNames.includes(enumName))
            {
               LOGGER.warn("Duplicate enum name " + enumName);
            }
            enumNames.push(enumName);

            var enumValue = EnumGenerator.createUpgradeEnumValue(upgrade);
            if (enumValues.includes(enumValue))
            {
               LOGGER.warn("Duplicate enum value " + enumValue);
            }
            enumValues.push(enumValue);

            accumulator.push(enumName + ": " + enumValue + ",<br/>");
            return accumulator;
         }, []);

         enums.sort();

         return enums.join("");
      }

      function generateProperties(upgradeArray)
      {
         var properties = upgradeArray.reduce(function(accumulator, upgrade)
         {
            var enumValue = EnumGenerator.createUpgradeEnumValue(upgrade);
            accumulator.push(enumValue + ":<br/>{<br/>" + generatePropertiesSingle(upgrade) + "},<br/>");
            return accumulator;
         }, []);

         properties.sort();

         return "properties:<br/>{<br/>" + properties.join("") + "},<br/>";
      }

      function generatePropertiesSingle(upgrade)
      {
         var name = upgrade.name;
         name = name.replace("(-1)", "Decrease");
         name = name.replace("(+1)", "Increase");
         name = name.replace("-wing", "-Wing");
         name = name.replace(/'/g, "\\\'");
         name = name.replace(/"/g, "\\\"");
         name = EnumGenerator.quoteValue(name);

         var upgradeCard = findUpgradeCard(upgrade);
         var typeKey = "UpgradeType." + UpgradeType.findByName(upgrade.slot).key.toUpperCase();
         typeKey = typeKey.replace(/ /g, "_");

         var cancelAllDiceResults = determineCancelAllDiceResults(upgrade, upgradeCard);
         var description = determineDescription(upgrade, upgradeCard);
         var discardThisCard = determineDiscardThisCard(upgrade, upgradeCard);
         var firingArcKey = determineFiringArcKey(upgrade, upgradeCard);
         var headerKey = determineHeaderKey(upgrade, upgradeCard);
         var image = determineImage(upgrade, upgradeCard);
         var isImplemented = determineIsImplemented(upgrade, upgradeCard);
         var isWeaponTurret = determineIsWeaponTurret(upgrade, upgradeCard);
         var rangeKeys = determineRangeKeys(upgrade, upgradeCard);
         var restrictionKeys = determineRestrictionKeys(upgrade, upgradeCard);
         var spendFocus = determineSpendFocus(upgrade, upgradeCard);
         var spendTargetLock = determineSpendTargetLock(upgrade, upgradeCard);
         var weaponValue = determineWeaponValue(upgrade, upgradeCard);

         var answer = "";

         answer += EnumGenerator.createProperty("name", name);
         answer += EnumGenerator.createProperty("typeKey", typeKey);
         answer += EnumGenerator.createProperty("isUnique", upgrade.unique);
         answer += EnumGenerator.createProperty("weaponValue", weaponValue);
         answer += EnumGenerator.createProperty("rangeKeys", rangeKeys);
         answer += EnumGenerator.createProperty("firingArcKey", firingArcKey);
         answer += EnumGenerator.createProperty("isWeaponTurret", isWeaponTurret);
         answer += EnumGenerator.createProperty("restrictionKeys", restrictionKeys);
         answer += EnumGenerator.createProperty("headerKey", headerKey);
         answer += EnumGenerator.createProperty("description", description);

         if (upgradeCard)
         {
            answer += EnumGenerator.createProperty("energyLimit", upgradeCard.energyLimit);
            answer += EnumGenerator.createProperty("pilotSkillValue", upgradeCard.pilotSkillValue);
            answer += EnumGenerator.createProperty("energyValue", upgradeCard.energyValue);
            answer += EnumGenerator.createProperty("primaryWeaponValue", upgradeCard.primaryWeaponValue);
            answer += EnumGenerator.createProperty("agilityValue", upgradeCard.agilityValue);
            answer += EnumGenerator.createProperty("hullValue", upgradeCard.hullValue);
            answer += EnumGenerator.createProperty("shieldValue", upgradeCard.shieldValue);
         }

         answer += EnumGenerator.createProperty("cancelAllDiceResults", cancelAllDiceResults);
         answer += EnumGenerator.createProperty("discardThisCard", discardThisCard);
         answer += EnumGenerator.createProperty("spendFocus", spendFocus);
         answer += EnumGenerator.createProperty("spendTargetLock", spendTargetLock);

         answer += EnumGenerator.createProperty("image", image);
         answer += EnumGenerator.createProperty("squadPointCost", upgrade.points);
         answer += EnumGenerator.createProperty("isImplemented", isImplemented);
         answer += EnumGenerator.createProperty("key", EnumGenerator.createUpgradeEnumValue(upgrade));

         return answer;
      }

      return XwingDataUpgradeConverter;
   });
