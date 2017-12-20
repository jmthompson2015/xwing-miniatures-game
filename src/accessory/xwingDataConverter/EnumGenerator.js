"use strict";

define(["common/js/InputValidator", "accessory/xwingDataConverter/FactionConverter"], function(InputValidator, FactionConverter)
{
   var EnumGenerator = {};

   EnumGenerator.createDamageEnumName = function(damage)
   {
      var answer = damage.name;

      answer = EnumGenerator.createEnumName(answer);

      return answer;
   };

   EnumGenerator.createDamageEnumValue = function(damage, isQuotedIn)
   {
      var isQuoted = (isQuotedIn !== undefined ? isQuotedIn : true);

      var answer = damage.name;
      answer = EnumGenerator.createEnumValue(answer);

      return (isQuoted ? EnumGenerator.quoteValue(answer) : answer);
   };

   EnumGenerator.createEnumName = function(name)
   {
      var answer = name;

      answer = answer.replace(/ /g, "_");
      answer = answer.replace(/-/g, "_");
      answer = answer.replace(/\//g, "_");

      answer = answer.replace(/!/g, "");
      answer = answer.replace(/'/g, "");
      answer = answer.replace(/"/g, "");
      answer = answer.replace(/\(/g, "");
      answer = answer.replace(/\)/g, "");

      answer = answer.toUpperCase();

      return answer;
   };

   EnumGenerator.createEnumValue = function(name)
   {
      var answer = name;

      answer = answer.replace(/-/g, " ");
      answer = answer.replace(/\//g, " ");

      answer = answer.replace(/!/g, "");
      answer = answer.replace(/'/g, "");
      answer = answer.replace(/"/g, "");
      answer = answer.replace(/\(/g, "");
      answer = answer.replace(/\)/g, "");

      answer = toCamelCase(answer);

      return answer;
   };

   var PILOT_APPEND_FACTION = ["Boba Fett", "Captain Nym", "Chewbacca", "Fenn Rau", "Han Solo", "Kath Scarlet"];
   var PILOT_APPEND_SHIP = ["Dalan Oberos", "Ezra Bridger", "Hera Syndulla", "Kylo Ren", "Maarek Stele", "Sabine Wren", "\"Zeb\" Orrelios"];
   var PILOT_APPEND_SOURCE = ["Poe Dameron"];

   EnumGenerator.createPilotEnumName = function(pilot)
   {
      var answer = pilot.name;
      answer = answer.replace("4-LOM", "FOUR_LOM");
      answer = EnumGenerator.createEnumName(answer);

      if (PILOT_APPEND_FACTION.includes(pilot.name))
      {
         answer += "_" + FactionConverter.createEnumName(pilot.faction);
      }
      else if (PILOT_APPEND_SHIP.includes(pilot.name))
      {
         var ship = pilot.ship;
         answer += "_" + EnumGenerator.createShipEnumName(ship);
      }
      else if (PILOT_APPEND_SOURCE.includes(pilot.name))
      {
         if (pilot.xws.endsWith("-swx57"))
         {
            answer += "_HOTR";
         }
      }

      return answer;
   };

   EnumGenerator.createPilotEnumValue = function(pilot)
   {
      var answer = pilot.name;
      answer = answer.replace("4-LOM", "Four Lom");
      answer = EnumGenerator.createEnumValue(answer);

      if (PILOT_APPEND_FACTION.includes(pilot.name))
      {
         answer += "_" + FactionConverter.createEnumValue(pilot.faction);
      }
      else if (PILOT_APPEND_SHIP.includes(pilot.name))
      {
         var ship = pilot.ship;
         answer += "_" + EnumGenerator.createShipEnumValue(ship, false);
      }
      else if (PILOT_APPEND_SOURCE.includes(pilot.name))
      {
         if (pilot.xws.endsWith("-swx57"))
         {
            answer += "_hotr";
         }
      }

      return EnumGenerator.quoteValue(answer);
   };

   EnumGenerator.createProperty = function(propertyName, propertyValue)
   {
      var answer = "";

      if (propertyValue !== undefined)
      {
         answer = propertyName + ": " + propertyValue + ",<br/>";
      }

      return answer;
   };

   EnumGenerator.createShipEnumName = function(ship)
   {
      var answer = (typeof ship === "string" ? ship : ship.name);

      answer = answer.replace("JumpMaster", "JUMP_MASTER");
      answer = answer.replace("StarViper", "STAR_VIPER");
      answer = answer.replace("TIE Adv. Prototype", "TIE_ADVANCED_PROTOTYPE");

      answer = EnumGenerator.createEnumName(answer);

      return answer;
   };

   EnumGenerator.createShipEnumValue = function(ship, isQuotedIn)
   {
      var isQuoted = (isQuotedIn !== undefined ? isQuotedIn : true);

      var answer = (typeof ship === "string" ? ship : ship.name);

      answer = answer.replace("JumpMaster", "Jump Master");
      answer = answer.replace("StarViper", "Star Viper");
      answer = answer.replace("TIE Adv.", "TIE Advanced");

      answer = EnumGenerator.createEnumValue(answer);

      return (isQuoted ? EnumGenerator.quoteValue(answer) : answer);
   };

   EnumGenerator.createShipFactionEnumName = function(ship, factionIndex)
   {
      InputValidator.validateNotNull("ship", ship);
      InputValidator.validateIsNumber("factionIndex", factionIndex);

      var factionName = FactionConverter.createEnumName(ship.faction[factionIndex]);
      var shipName = EnumGenerator.createShipEnumName(ship);
      var answer = factionName + "_" + shipName;

      return answer;
   };

   EnumGenerator.createShipFactionEnumValue = function(ship, factionIndex, isQuotedIn)
   {
      InputValidator.validateNotNull("ship", ship);
      InputValidator.validateIsNumber("factionIndex", factionIndex);

      var isQuoted = (isQuotedIn !== undefined ? isQuotedIn : true);
      var factionValue = FactionConverter.createEnumValue(ship.faction[factionIndex]);
      var shipValue = EnumGenerator.createShipEnumValue(ship, false);
      var answer = factionValue + "_" + shipValue;

      return (isQuoted ? EnumGenerator.quoteValue(answer) : answer);
   };

   var UPGRADE_APPEND_SOURCE = ["Ghost", "Millennium Falcon"];
   var UPGRADE_APPEND_TYPE = ["\"Chopper\"", "R2-D2"];

   EnumGenerator.createUpgradeEnumName = function(upgrade)
   {
      var answer = (typeof upgrade === "string" ? upgrade : upgrade.name);
      answer = answer.replace("4-LOM", "FOUR_LOM");
      answer = answer.replace("(-1)", "DECREASE");
      answer = answer.replace("(+1)", "INCREASE");
      answer = answer.replace("StarViper Mk.II", "STAR_VIPER_MKII");
      answer = answer.replace("Twin Ion Engine Mk. II", "TWIN_ION_ENGINE_MKII");
      answer = EnumGenerator.createEnumName(answer);

      if (UPGRADE_APPEND_SOURCE.includes(upgrade.name))
      {
         if (upgrade.xws.endsWith("-swx57"))
         {
            answer += "_HOTR";
         }
         else if (upgrade.xws.endsWith("-swx72"))
         {
            answer += "_PHANTOM_II";
         }
      }
      else if (UPGRADE_APPEND_TYPE.includes(upgrade.name))
      {
         var upgradeType = upgrade.slot;
         upgradeType = upgradeType.toUpperCase();
         answer += "_" + upgradeType;
      }

      return answer;
   };

   EnumGenerator.createUpgradeEnumValue = function(upgrade)
   {
      var answer = (typeof upgrade === "string" ? upgrade : upgrade.name);
      answer = answer.replace("4-LOM", "Four Lom");
      answer = answer.replace("(-1)", "Decrease");
      answer = answer.replace("(+1)", "Increase");
      answer = answer.replace("StarViper Mk.II", "Star Viper Mkii");
      answer = answer.replace("Twin Ion Engine Mk. II", "Twin Ion Engine Mkii");
      answer = EnumGenerator.createEnumValue(answer);

      if (UPGRADE_APPEND_SOURCE.includes(upgrade.name))
      {
         if (upgrade.xws.endsWith("-swx57"))
         {
            answer += "_hotr";
         }
         else if (upgrade.xws.endsWith("-swx72"))
         {
            answer += "_phantomII";
         }
      }
      else if (UPGRADE_APPEND_TYPE.includes(upgrade.name))
      {
         var upgradeType = upgrade.slot;
         upgradeType = upgradeType.toLowerCase();
         answer += "_" + upgradeType;
      }

      return EnumGenerator.quoteValue(answer);
   };

   EnumGenerator.quoteValue = function(value)
   {
      var answer;

      if (value !== undefined)
      {
         answer = "\"" + value + "\"";
      }

      return answer;
   };

   function toCamelCase(str)
   {
      return str.split(' ').map(function(word, index)
      {
         // If it is the first word make sure to lowercase all the chars.
         if (index == 0)
         {
            return word.toLowerCase();
         }

         // If it is not the first word only upper case the first char and lowercase the rest.
         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }).join('');
   }

   return EnumGenerator;
});
