"use strict";

define(["common/js/InputValidator"], function(InputValidator)
{
   var FactionConverter = {};

   FactionConverter.createEnumName = function(factionName)
   {
      InputValidator.validateIsString("factionName", factionName);

      var answer = factionName;

      switch (factionName)
      {
         case "First Order":
            answer = "_FIRST_ORDER";
            break;
         case "Galactic Empire":
            answer = "_IMPERIAL";
            break;
         case "Rebel Alliance":
            answer = "_REBEL";
            break;
         case "Resistance":
            answer = "_RESISTANCE";
            break;
         case "Scum and Villainy":
            answer = "_SCUM";
            break;
      }

      return answer;
   };

   FactionConverter.createEnumValue = function(factionName)
   {
      InputValidator.validateIsString("factionName", factionName);

      var answer = factionName;

      switch (factionName)
      {
         case "First Order":
            answer = "_firstOrder";
            break;
         case "Galactic Empire":
            answer = "_imperial";
            break;
         case "Rebel Alliance":
            answer = "_rebel";
            break;
         case "Resistance":
            answer = "_resistance";
            break;
         case "Scum and Villainy":
            answer = "_scum";
            break;
      }

      return answer;
   };

   return FactionConverter;
});
