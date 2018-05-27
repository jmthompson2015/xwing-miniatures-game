"use strict";

define(["artifact/PilotCard", "artifact/UpgradeType", "view/UpgradeTypeComparator", "accessory/xwing-data-converter/EnumGenerator", "accessory/xwing-data-converter/XWingData", "accessory/xwing-data-converter/XWingType"],
   function(PilotCard, UpgradeType, UpgradeTypeComparator, EnumGenerator, XWingData, XWingType)
   {
      var PilotConverter = {};

      PilotConverter.convert = function(callback)
      {
         var finishConvert = this.finishConvert.bind(this);
         var finishCallback = function(response)
         {
            finishConvert(response, callback);
         };

         var xwingData = new XWingData();
         xwingData.load(finishCallback);
      };

      PilotConverter.finishConvert = function(xwingData, callback)
      {
         var pilotArray = xwingData.dataByType(XWingType.PILOTS);

         // Add v2 pilots.
         pilotArray.push(createPilot("Contracted Scout v2", 3, 25));
         pilotArray.push(createPilot("Dengar v2", 9, 33));
         pilotArray.push(createPilot("Manaroo v2", 4, 27));
         pilotArray.push(createPilot("Tel Trevura v2", 7, 30));

         var enums = PilotConverter.generateEnums(xwingData);
         var properties = generateProperties(xwingData);

         callback(xwingData, enums, properties);
      };

      PilotConverter.determineShipFactionKey = function(pilot, pilotCard)
      {
         var answer;
         var shipName = EnumGenerator.createShipEnumName(pilot.ship);

         switch (pilot.faction)
         {
            case "First Order":
               answer = "ShipFaction.FIRST_ORDER_" + shipName;
               break;
            case "Galactic Empire":
               answer = "ShipFaction.IMPERIAL_" + shipName;
               break;
            case "Rebel Alliance":
               answer = "ShipFaction.REBEL_" + shipName;
               break;
            case "Resistance":
               answer = "ShipFaction.RESISTANCE_" + shipName;
               break;
            case "Scum and Villainy":
               answer = "ShipFaction.SCUM_" + shipName;
               break;
         }

         if (pilotCard)
         {
            var shipFactionKey = pilotCard.shipFactionKey;

            if (shipFactionKey)
            {
               if (shipFactionKey.endsWith("v2"))
               {
                  answer += "_V2";
               }
               else if (shipFactionKey.endsWith("v3"))
               {
                  answer += "_V3";
               }
            }
         }

         return answer;
      };

      var EXCLUDE_NAMES = ["C-ROC Cruiser", "CR90 Corvette (Fore)", "CR90 Corvette (Aft)", "Gozanti-class Cruiser", "GR-75 Medium Transport", "Raider-class Corvette (Fore)", "Raider-class Corvette (Aft)"];

      PilotConverter.generateEnums = function(xwingData)
      {
         var pilotArray = xwingData.dataByType(XWingType.PILOTS);
         var enumNames = [];
         var enumValues = [];

         var enums = pilotArray.reduce(function(accumulator, pilot)
         {
            if (!EXCLUDE_NAMES.includes(pilot.name))
            {
               var enumName = EnumGenerator.createPilotEnumName(pilot);
               if (enumNames.includes(enumName))
               {
                  LOGGER.warn("Duplicate enum name " + enumName);
               }
               enumNames.push(enumName);

               var enumValue = EnumGenerator.createPilotEnumValue(pilot);
               if (enumValues.includes(enumValue))
               {
                  LOGGER.warn("Duplicate enum value " + enumValue);
               }
               enumValues.push(enumValue);

               accumulator.push(enumName + ": " + enumValue + ",<br/>");
            }
            return accumulator;
         }, []);

         enums.sort();

         enums.push("<br/>");
         enums.push("// Huge ships.<br/>");
         enums.push("C_ROC_CRUISER: \"cRocCruiser\",<br/>");
         enums.push("CR90_CORVETTE: \"cr90Corvette\",<br/>");
         enums.push("GOZANTI_CLASS_CRUISER: \"gozantiClassCruiser\",<br/>");
         enums.push("GR_75_MEDIUM_TRANSPORT: \"gr75MediumTransport\",<br/>");
         enums.push("RAIDER_CLASS_CORVETTE: \"raiderClassCorvette\",<br/>");

         return enums.join("");
      };

      function createPilot(name, pilotSkillValue, squadPointCost)
      {
         var xws = name;
         xws = xws.replace(/ /g, "");
         xws = xws.replace(/-/g, "");
         xws = xws.toLowerCase();

         return (
         {
            name: name,
            faction: "Scum and Villainy",
            points: squadPointCost,
            ship: "JumpMaster 5000",
            skill: pilotSkillValue,
            slots: ["Crew", "Elite", "Illicit"],
            wave: "Aces",
            xws: xws,
         });
      }

      function determineDescription(pilot, pilotCard)
      {
         var answer = pilot.text;

         if (answer === undefined)
         {
            if (pilotCard)
            {
               answer = pilotCard.description;
            }
         }

         if (answer !== undefined)
         {
            answer = answer.replace(/'/g, "\\\'");
            answer = answer.replace(/"/g, "\\\"");
            answer = answer.replace(/<strong>/g, "&lt;strong>");
            answer = answer.replace(/<\/strong>/g, "&lt;\/strong>");
            answer = answer.replace(/<br \/>/g, "&lt;br />");

            answer = EnumGenerator.quoteValue(answer);
         }

         return answer;
      }

      function determineImage(pilot, pilotCard)
      {
         var answer;

         if (pilot.image !== undefined)
         {
            answer = EnumGenerator.quoteValue(pilot.image);
         }

         if (pilotCard !== undefined)
         {
            answer = pilotCard.image;
            answer = EnumGenerator.quoteValue(answer);
         }

         return answer;
      }

      function determineIsFlavorText(pilotCard)
      {
         var answer;

         if (pilotCard)
         {
            answer = pilotCard.isFlavorText;
         }

         return answer;
      }

      function determineIsImplemented(pilotCard)
      {
         var answer;

         if (pilotCard)
         {
            answer = pilotCard.isImplemented;
         }

         return answer;
      }

      function determineUpgradeTypeKeys(pilot)
      {
         var slots = pilot.slots;

         var upgradeTypeKeys = slots.map(function(slot)
         {
            var upgradeType = UpgradeType.findByName(slot);
            if (upgradeType === undefined)
            {
               LOGGER.warn("Can't find UpgradeType for " + slot);
            }
            return upgradeType.key;
         });

         upgradeTypeKeys.sort(UpgradeTypeComparator);

         var answer = upgradeTypeKeys.map(function(upgradeTypeKey)
         {
            var upgradeType = UpgradeType.properties[upgradeTypeKey];
            var upgradeEnumName = upgradeType.name.toUpperCase();
            upgradeEnumName = upgradeEnumName.replace(/ /g, "_");
            return "UpgradeType." + upgradeEnumName;
         });

         return "[" + answer.join(", ") + "]";
      }

      function determineWave(xwingData, pilot)
      {
         var answer;

         if (pilot.id !== undefined)
         {
            var source = xwingData.firstSource(XWingType.PILOTS, pilot.id);

            if (source)
            {
               var wave = source.wave;

               if (wave === "Iconic Starships")
               {
                  wave = "Aces";
               }

               answer = "" + wave;
            }
         }

         return answer;
      }

      function findPilotCard(pilot)
      {
         var enumValue = EnumGenerator.createPilotEnumValue(pilot);
         enumValue = enumValue.replace(/"/g, "");
         var pilotCard = PilotCard.properties[enumValue];

         if (pilotCard === undefined)
         {
            LOGGER.warn("Can't find PilotCard for " + enumValue);
         }

         return pilotCard;
      }

      function generateProperties(xwingData)
      {
         var pilotArray = xwingData.dataByType(XWingType.PILOTS);
         var properties = pilotArray.reduce(function(accumulator, pilot)
         {
            if (!EXCLUDE_NAMES.includes(pilot.name))
            {
               pilot.wave = determineWave(xwingData, pilot);
               var enumValue = EnumGenerator.createPilotEnumValue(pilot);
               accumulator.push(enumValue + ":<br/>{<br/>" + generatePropertiesSingle(pilot) + "},<br/>");
            }
            return accumulator;
         }, []);

         properties.sort();

         return "properties:<br/>{<br/>" + properties.join("") + "},<br/>";
      }

      function generatePropertiesSingle(pilot)
      {
         var name = pilot.name;
         name = name.replace("-wing", "-Wing");
         name = name.replace(/'/g, "\\\'");
         name = name.replace(/"/g, "\\\"");
         name = EnumGenerator.quoteValue(name);

         var pilotCard = findPilotCard(pilot);
         var shipFactionKey = PilotConverter.determineShipFactionKey(pilot, pilotCard);
         var isFlavorText = determineIsFlavorText(pilotCard);
         var isImplemented = (isFlavorText ? true : determineIsImplemented(pilotCard));
         var wave = EnumGenerator.quoteValue(pilot.wave);
         var image = determineImage(pilot, pilotCard);

         var answer = "";

         answer += EnumGenerator.createProperty("name", name);
         answer += EnumGenerator.createProperty("description", determineDescription(pilot, pilotCard));
         answer += EnumGenerator.createProperty("isFlavorText", isFlavorText);
         answer += EnumGenerator.createProperty("isUnique", (pilot.unique ? "true" : undefined));
         answer += EnumGenerator.createProperty("shipFactionKey", shipFactionKey);
         answer += EnumGenerator.createProperty("pilotSkillValue", (pilot.skill !== "?" ? pilot.skill : undefined));
         answer += EnumGenerator.createProperty("primaryWeaponValue", (pilot.ship_override !== undefined ? pilot.ship_override.attack : undefined));
         answer += EnumGenerator.createProperty("energyValue", (pilot.ship_override !== undefined ? pilot.ship_override.energy : undefined));
         answer += EnumGenerator.createProperty("agilityValue", (pilot.ship_override !== undefined ? pilot.ship_override.agility : undefined));
         answer += EnumGenerator.createProperty("hullValue", (pilot.ship_override !== undefined ? pilot.ship_override.hull : undefined));
         answer += EnumGenerator.createProperty("shieldValue", (pilot.ship_override !== undefined ? pilot.ship_override.shields : undefined));
         answer += EnumGenerator.createProperty("image", image);
         answer += EnumGenerator.createProperty("squadPointCost", (pilot.points !== "?" ? pilot.points : undefined));
         answer += EnumGenerator.createProperty("upgradeTypeKeys", determineUpgradeTypeKeys(pilot));
         answer += EnumGenerator.createProperty("wave", wave);
         answer += EnumGenerator.createProperty("isImplemented", isImplemented);
         answer += EnumGenerator.createProperty("key", EnumGenerator.createPilotEnumValue(pilot));

         return answer;
      }

      return PilotConverter;
   });
