"use strict";

define(["common/js/FileLoader", "artifact/js/Bearing", "artifact/js/Difficulty", "artifact/js/Ship", "artifact/js/ShipAction", "accessory/xwingDataConverter/EnumGenerator", "accessory/xwingDataConverter/XWingData", "accessory/xwingDataConverter/XWingType"],
   function(FileLoader, Bearing, Difficulty, Ship, ShipAction, EnumGenerator, XWingData, XWingType)
   {
      var ShipConverter = {};

      ShipConverter.convert = function(callback)
      {
         var finishConvert = this.finishConvert.bind(this);
         var finishCallback = function(response)
         {
            finishConvert(response, callback);
         };

         var xwingData = new XWingData();
         xwingData.load(finishCallback);
      };

      ShipConverter.finishConvert = function(xwingData, callback)
      {
         var enums = generateEnums(xwingData);
         var properties = generateProperties(xwingData);

         callback(xwingData, enums, properties);
      };

      ShipConverter.determineAuxiliaryFiringArc = function(ship)
      {
         var answer;

         if (ship.firing_arcs)
         {
            if (ship.firing_arcs.includes("Auxiliary Rear"))
            {
               answer = "FiringArc.AFT";
            }
            else if (ship.firing_arcs.includes("Auxiliary 180"))
            {
               answer = "FiringArc.FULL_AFT";
            }
            else if (ship.firing_arcs.includes("Mobile"))
            {
               // FIXME
            }
            else if (ship.firing_arcs.includes("Bullseye"))
            {
               // FIXME
            }
         }

         return answer;
      };

      var BEARING_KEYS = [Bearing.TURN_LEFT, Bearing.BANK_LEFT, Bearing.STRAIGHT, Bearing.BANK_RIGHT, Bearing.TURN_RIGHT, Bearing.KOIOGRAN_TURN, Bearing.SEGNORS_LOOP_LEFT, Bearing.SEGNORS_LOOP_RIGHT, Bearing.TALLON_ROLL_LEFT, Bearing.TALLON_ROLL_RIGHT];
      var BEARING_NAMES = ["TURN_LEFT", "BANK_LEFT", "STRAIGHT", "BANK_RIGHT", "TURN_RIGHT", "KOIOGRAN_TURN", "SEGNORS_LOOP_LEFT", "SEGNORS_LOOP_RIGHT", "TALLON_ROLL_LEFT", "TALLON_ROLL_RIGHT"];
      var DIFFICULTY_KEYS = [undefined, Difficulty.STANDARD, Difficulty.EASY, Difficulty.HARD];
      var DIFFICULTY_NAMES = [undefined, "STANDARD", "EASY", "HARD"];

      ShipConverter.determineManeuverKeys = function(ship)
      {
         var answer = [];

         for (var speed = 0; speed <= 5; speed++)
         {
            var maneuvers = ship.maneuvers[speed];

            if (maneuvers)
            {
               for (var i = 0; i < maneuvers.length; i++)
               {
                  var bearingKey = BEARING_KEYS[i];
                  var difficultyKey = DIFFICULTY_KEYS[maneuvers[i]];

                  if (bearingKey && difficultyKey)
                  {
                     var bearingName = BEARING_NAMES[i];
                     if (speed === 0 && bearingName === "STRAIGHT")
                     {
                        bearingName = "STATIONARY";
                     }
                     var difficultyName = DIFFICULTY_NAMES[maneuvers[i]];
                     answer.push("Maneuver." + bearingName + "_" + speed + "_" + difficultyName + ",");
                  }
               }

               answer[answer.length - 1] += "<br/>";
            }
         }

         answer[answer.length - 1] = answer[answer.length - 1].replace(",<br/>", "");

         return answer.join(" ");
      };

      ShipConverter.determinePrimaryFiringArc = function(ship)
      {
         var answer;

         if (ship.firing_arcs && ship.firing_arcs.includes("Front"))
         {
            answer = "FiringArc.FORWARD";
         }

         return answer;
      };

      function determineDescription(shipCard)
      {
         var answer;

         if (shipCard)
         {
            answer = shipCard.description;
         }

         return EnumGenerator.quoteValue(answer);
      }

      function determinePrimaryWeaponTurret(ship, shipCard)
      {
         var answer;

         if (ship && ship.firing_arcs.includes("Turret"))
         {
            answer = true;
         }

         if (answer === undefined && shipCard)
         {
            answer = shipCard.isPrimaryWeaponTurret;
         }

         return answer;
      }

      function determineShipActionKeys(ship)
      {
         var answer = [];

         ship.actions.forEach(function(action)
         {
            var shipAction = ShipAction.findByName(action);

            if (shipAction)
            {
               var shipActionName = shipAction.name.toUpperCase();
               shipActionName = shipActionName.replace(/ /g, "_");
               answer.push("ShipAction." + shipActionName);
            }
            else
            {
               throw "Can't find ship action for " + action;
            }
         });

         return answer.join(", ");
      }

      function determineShipBaseKey(ship)
      {
         return (ship.size === "small" ? "ShipBase.SMALL" : "ShipBase.LARGE");
      }

      function determineWikiUrl(shipCard)
      {
         var answer;

         if (shipCard)
         {
            answer = shipCard.wikiUrl;
         }

         return EnumGenerator.quoteValue(answer);
      }

      function findShipCard(ship)
      {
         var enumValue = EnumGenerator.createShipEnumValue(ship);
         enumValue = enumValue.replace(/"/g, "");
         var shipCard = Ship.properties[enumValue];

         if (shipCard === undefined)
         {
            LOGGER.warn("Can't find ShipCard for " + enumValue);
         }

         return shipCard;
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
               var enumName = EnumGenerator.createShipEnumName(ship);

               if (enumNames.includes(enumName))
               {
                  LOGGER.warn("Duplicate enum name " + enumName);
               }

               enumNames.push(enumName);

               var enumValue = EnumGenerator.createShipEnumValue(ship);

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
      }

      function generateProperties(xwingData)
      {
         var shipArray = xwingData.dataByType(XWingType.SHIPS);
         var properties = shipArray.reduce(function(accumulator, ship)
         {
            if (!EXCLUDE_NAMES.includes(ship.name))
            {
               var source = xwingData.firstSource(XWingType.SHIPS, ship.id);
               ship.wave = "" + source.wave;
               var enumValue = EnumGenerator.createShipEnumValue(ship);
               accumulator.push(enumValue + ":<br/>{<br/>" + generatePropertiesSingle(ship) + "},<br/>");
            }
            return accumulator;
         }, []);

         properties.sort();

         return "properties:<br/>{<br/>" + properties.join("") + "},<br/>";
      }

      function generatePropertiesSingle(ship)
      {
         var name = ship.name;
         name = name.replace("-wing", "-Wing");
         name = EnumGenerator.quoteValue(name);
         var primaryFiringArc = ShipConverter.determinePrimaryFiringArc(ship);
         var auxiliaryFiringArc = ShipConverter.determineAuxiliaryFiringArc(ship);

         var shipCard = findShipCard(ship);
         var description = determineDescription(shipCard);
         var isPrimaryWeaponTurret = determinePrimaryWeaponTurret(ship, shipCard);
         var wave = EnumGenerator.quoteValue(ship.wave);
         var wikiUrl = determineWikiUrl(shipCard);

         var answer = "";

         answer += EnumGenerator.createProperty("name", name);
         answer += EnumGenerator.createProperty("description", description);
         answer += EnumGenerator.createProperty("primaryWeaponValue", ship.attack);
         answer += EnumGenerator.createProperty("agilityValue", ship.agility);
         answer += EnumGenerator.createProperty("hullValue", ship.hull);
         answer += EnumGenerator.createProperty("shieldValue", ship.shields);
         answer += EnumGenerator.createProperty("shipBaseKey", determineShipBaseKey(ship));
         answer += EnumGenerator.createProperty("primaryFiringArcKey", primaryFiringArc);
         answer += EnumGenerator.createProperty("isPrimaryWeaponTurret", isPrimaryWeaponTurret);
         answer += EnumGenerator.createProperty("auxiliaryFiringArcKey", auxiliaryFiringArc);
         answer += "maneuverKeys: [" + ShipConverter.determineManeuverKeys(ship) + "],<br/>";
         answer += "shipActionKeys: [" + determineShipActionKeys(ship) + "],<br/>";
         answer += EnumGenerator.createProperty("wave", wave);
         answer += EnumGenerator.createProperty("wikiUrl", wikiUrl);
         answer += EnumGenerator.createProperty("key", EnumGenerator.createShipEnumValue(ship));

         return answer;
      }

      return ShipConverter;
   });
