"use strict";

define(["utility/InputValidator", "artifact/Ship", "artifact/ShipFaction", "accessory/xwing-data-converter/EnumGenerator", "accessory/xwing-data-converter/FactionConverter", "accessory/xwing-data-converter/XWingData", "accessory/xwing-data-converter/XWingType"],
   function(InputValidator, Ship, ShipFaction, EnumGenerator, FactionConverter, XWingData, XWingType)
   {
      var ShipFactionConverter = {};

      ShipFactionConverter.convert = function(callback)
      {
         var finishConvert = this.finishConvert.bind(this);
         var finishCallback = function(response)
         {
            finishConvert(response, callback);
         };

         var xwingData = new XWingData();
         xwingData.load(finishCallback);
      };

      ShipFactionConverter.finishConvert = function(xwingData, callback)
      {
         var ship = xwingData.findByName(XWingType.SHIPS, "TIE Adv. Prototype");
         ship.name = "TIE Advanced Prototype";

         var shipArray = xwingData.dataByType(XWingType.SHIPS);

         shipArray.forEach(function(ship)
         {
            ship.name = ship.name.replace("-wing", "-Wing");
         });

         // Add v2 and v3 ships.
         shipArray.push(createShip("TIE Bomber v2", "Galactic Empire"));
         shipArray.push(createShip("TIE Defender v2", "Galactic Empire"));
         shipArray.push(createShip("TIE Interceptor v2", "Galactic Empire"));
         shipArray.push(createShip("TIE Interceptor v3", "Galactic Empire"));
         shipArray.push(createShip("A-Wing v2", "Rebel Alliance"));
         shipArray.push(createShip("B-Wing v2", "Rebel Alliance"));
         shipArray.push(createShip("T-70 X-Wing v2", "Resistance"));
         shipArray.push(createShip("Kihraxz Fighter v2", "Scum and Villainy"));
         shipArray.push(createShip("M3-A Interceptor v2", "Scum and Villainy"));
         shipArray.push(createShip("StarViper v2", "Scum and Villainy"));

         var enums = generateEnums(xwingData);
         var properties = generateProperties(xwingData);

         callback(xwingData, enums, properties);
      };

      ShipFactionConverter.determineImage = function(ship, factionIndex, shipFactionCard)
      {
         var answer = ship.image;

         if (answer === undefined && shipFactionCard !== undefined)
         {
            answer = shipFactionCard.image;
         }

         if (answer === undefined)
         {
            var shipName = ship.name;
            shipName = shipName.replace(/ /g, "_");
            shipName = shipName.replace(/\//g, "_");
            shipName = shipName.replace("-wing", "-Wing");

            if (ship.name === "Scurrg H-6 Bomber")
            {
               answer = shipName + ".png";
            }
            else
            {
               var faction = FactionConverter.createEnumValue(ship.faction[factionIndex]);
               faction = faction.charAt(0).toUpperCase() + faction.substring(1);
               answer = faction + "_" + shipName + ".png";
            }
         }

         if (answer === undefined)
         {
            LOGGER.warn("Can't find image for " + (shipFactionCard !== undefined ? shipFactionCard.name : shipFactionCard));
         }

         return EnumGenerator.quoteValue(answer);
      };

      ShipFactionConverter.determineWave = function(xwingData, ship, shipFactionCard)
      {
         var answer = ship.wave;

         if (shipFactionCard !== undefined)
         {
            answer = shipFactionCard.wave;
         }

         if (answer === undefined && ship.id !== undefined)
         {
            var source = xwingData.firstSource(XWingType.SHIPS, ship.id);
            answer = "" + source.wave;
         }

         return EnumGenerator.quoteValue(answer);
      };

      function createShip(name, faction)
      {
         var xws = name;
         xws = xws.replace(/ /g, "");
         xws = xws.replace(/-/g, "");
         xws = xws.toLowerCase();

         return (
         {
            name: name,
            faction: [faction],
            wave: "Aces",
            xws: xws,
         });
      }

      function findShipFactionCard(ship, factionIndex)
      {
         InputValidator.validateNotNull("ship", ship);
         InputValidator.validateIsNumber("factionIndex", factionIndex);

         var enumValue = EnumGenerator.createShipFactionEnumValue(ship, factionIndex);
         enumValue = enumValue.replace(/"/g, "");
         var answer = ShipFaction.properties[enumValue];

         if (answer === undefined)
         {
            var myShipName = ship.name;

            if (ship.faction.length > 1)
            {
               var faction = FactionConverter.createEnumValue(ship.faction[factionIndex]);
               myShipName += " (" + faction + ")";
            }

            myShipName = myShipName.toLowerCase();
            var values = ShipFaction.values();

            for (var i = 0; i < values.length; i++)
            {
               var value = values[i];
               var valueName = value.name.toLowerCase();

               if (valueName === myShipName)
               {
                  answer = value;
                  break;
               }
            }
         }

         if (answer === undefined)
         {
            LOGGER.warn("Can't find ShipFactionCard for " + enumValue);
         }

         return answer;
      }

      var EXCLUDE_NAMES = ["C-ROC Cruiser", "CR90 Corvette (Fore)", "CR90 Corvette (Aft)", "Gozanti-class Cruiser", "GR-75 Medium Transport", "Raider-class Corvette (Fore)", "Raider-class Corvette (Aft)"];

      function generateEnums(xwingData)
      {
         var shipArray = xwingData.dataByType(XWingType.SHIPS);
         var enumNames = [];
         var enumValues = [];

         var enums = shipArray.reduce(function(accumulator, ship)
         {
            if (!EXCLUDE_NAMES.includes(ship.name))
            {
               for (var f = 0; f < ship.faction.length; f++)
               {
                  var enumName = EnumGenerator.createShipFactionEnumName(ship, f);

                  if (enumNames.includes(enumName))
                  {
                     LOGGER.warn("Duplicate enum name " + enumName);
                  }

                  enumNames.push(enumName);

                  var enumValue = EnumGenerator.createShipFactionEnumValue(ship, f);

                  if (enumValues.includes(enumValue))
                  {
                     LOGGER.warn("Duplicate enum value " + enumValue);
                  }

                  enumValues.push(enumValue);
                  accumulator.push(enumName + ": " + enumValue + ",<br/>");
               }
            }
            return accumulator;
         }, []);

         enums.sort();

         enums.push("<br/>");
         enums.push("// Huge ships.<br/>");
         enums.push("IMPERIAL_GOZANTI_CLASS_CRUISER: \"imperial_gozantiClassCruiser\",<br/>");
         enums.push("IMPERIAL_RAIDER_CLASS_CORVETTE: \"imperial_raiderClassCorvette\",<br/>");
         enums.push("REBEL_CR90_CORVETTE: \"rebel_cr90Corvette\",<br/>");
         enums.push("REBEL_GR_75_MEDIUM_TRANSPORT: \"rebel_gr75MediumTransport\",<br/>");
         enums.push("SCUM_C_ROC_CRUISER: \"scum_cRocCruiser\",<br/>");

         return enums.join("");
      }

      function generateProperties(xwingData)
      {
         var shipArray = xwingData.dataByType(XWingType.SHIPS);
         var properties = shipArray.reduce(function(accumulator, ship)
         {
            if (!EXCLUDE_NAMES.includes(ship.name))
            {
               for (var f = 0; f < ship.faction.length; f++)
               {
                  var enumValue = EnumGenerator.createShipFactionEnumValue(ship, f);
                  accumulator.push(enumValue + ":<br/>{<br/>" + generatePropertiesSingle(xwingData, ship, f) + "},<br/>");
               }
            }
            return accumulator;
         }, []);

         properties.sort();

         return "properties:<br/>{<br/>" + properties.join("") + "},<br/>";
      }

      function generatePropertiesSingle(xwingData, ship, factionIndex)
      {
         var name = ship.name;
         if (ship.faction.length > 1)
         {
            var faction = FactionConverter.createEnumValue(ship.faction[factionIndex]);
            faction = faction.charAt(0).toUpperCase() + faction.substring(1);
            name += " (" + faction + ")";
         }
         name = EnumGenerator.quoteValue(name);

         var shipKey = "Ship." + EnumGenerator.createShipEnumName(ship, factionIndex);
         shipKey = shipKey.replace("_V2", "");
         shipKey = shipKey.replace("_V3", "");
         var factionKey = "Faction." + FactionConverter.createEnumName(ship.faction[factionIndex]);

         var shipFactionCard = findShipFactionCard(ship, factionIndex);
         var image = ShipFactionConverter.determineImage(ship, factionIndex, shipFactionCard);
         var wave = ShipFactionConverter.determineWave(xwingData, ship, shipFactionCard);
         var key = EnumGenerator.createShipFactionEnumValue(ship, factionIndex);

         var answer = "";

         answer += EnumGenerator.createProperty("name", name);
         answer += EnumGenerator.createProperty("shipKey", shipKey);
         answer += EnumGenerator.createProperty("factionKey", factionKey);
         answer += EnumGenerator.createProperty("image", image);
         answer += EnumGenerator.createProperty("wave", wave);
         answer += EnumGenerator.createProperty("key", key);

         return answer;
      }

      return ShipFactionConverter;
   });
