"use strict";

define(["common/js/FileLoader", "common/js/InputValidator", "artifact/js/Ship", "artifact/js/ShipFaction", "accessory/xwingDataConverter/EnumGenerator", "accessory/xwingDataConverter/FactionConverter"],
   function(FileLoader, InputValidator, Ship, ShipFaction, EnumGenerator, FactionConverter)
   {
      var ShipFactionConverter = {};

      ShipFactionConverter.convert = function(callback)
      {
         var finishConvert = this.finishConvert1.bind(this);
         var finishCallback = function(response)
         {
            finishConvert(response, callback);
         };

         FileLoader.loadFile("../../../lib/xwing-data/data/ships.js", finishCallback);
      };

      ShipFactionConverter.finishConvert1 = function(response1, callback)
      {
         var finishConvert = this.finishConvert2.bind(this);
         var finishCallback = function(response)
         {
            finishConvert(response1, response, callback);
         };

         FileLoader.loadFile("../../../lib/xwing-data/data/sources.js", finishCallback);
      };

      ShipFactionConverter.finishConvert2 = function(response1, response2, callback)
      {
         var shipArray = JSON.parse(response1);
         var sourceArray = JSON.parse(response2);

         // Add wave to shipArray elements.
         shipArray.forEach(function(ship)
         {
            var sources = findSources(ship, sourceArray);
            ship.wave = sources[0].wave;
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

         var enums = generateEnums(shipArray);
         var properties = generateProperties(shipArray);

         callback(shipArray, enums, properties);
      };

      ShipFactionConverter.determineImage = function(ship, shipFactionCard)
      {
         var answer = ship.image;

         if (answer === undefined && shipFactionCard !== undefined)
         {
            answer = shipFactionCard.image;
         }

         if (answer === undefined)
         {
            LOGGER.warn("Can't find image for " + (shipFactionCard !== undefined ? shipFactionCard.name : shipFactionCard));
         }

         return EnumGenerator.quoteValue(answer);
      };

      function createShip(name, faction)
      {
         return (
         {
            name: name,
            faction: [faction],
            wave: "Aces",
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
            LOGGER.warn("Can't find ShipFactionCard for " + enumValue);
         }

         return answer;
      }

      function findSources(ship, sourceArray)
      {
         var shipId = "" + ship.id;

         var answer = sourceArray.filter(function(source)
         {
            return source.name.indexOf("Core Set") < 0 && source.contents.ships[shipId] !== undefined;
         });

         return answer;
      }

      var EXCLUDE_NAMES = ["C-ROC Cruiser", "CR90 Corvette (Fore)", "CR90 Corvette (Aft)", "Gozanti-class Cruiser", "GR-75 Medium Transport", "Raider-class Corvette (Fore)", "Raider-class Corvette (Aft)"];

      function generateEnums(shipArray)
      {
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

      function generateProperties(shipArray)
      {
         var properties = shipArray.reduce(function(accumulator, ship)
         {
            if (!EXCLUDE_NAMES.includes(ship.name))
            {
               for (var f = 0; f < ship.faction.length; f++)
               {
                  var enumValue = EnumGenerator.createShipFactionEnumValue(ship, f);
                  accumulator.push(enumValue + ":<br/>{<br/>" + generatePropertiesSingle(ship, f) + "},<br/>");
               }
            }
            return accumulator;
         }, []);

         properties.sort();

         return "properties:<br/>{<br/>" + properties.join("") + "},<br/>";
      }

      function generatePropertiesSingle(ship, factionIndex)
      {
         var name = ship.name;
         name = name.replace("-wing", "-Wing");
         name = EnumGenerator.quoteValue(name);

         var shipKey = "Ship." + EnumGenerator.createShipEnumName(ship, factionIndex);
         shipKey = shipKey.replace("_V2", "");
         shipKey = shipKey.replace("_V3", "");
         var factionKey = "Faction." + FactionConverter.createEnumName(ship.faction[factionIndex]);

         var shipFactionCard = findShipFactionCard(ship, factionIndex);
         var image = ShipFactionConverter.determineImage(ship, shipFactionCard);
         var wave = "" + ship.wave;
         wave = EnumGenerator.quoteValue(wave);
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
