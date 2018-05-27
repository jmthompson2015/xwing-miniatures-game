"use strict";

define(["utility/InputValidator"], function(InputValidator)
{
   var FactionConverter = {};

   FactionConverter.createEnumName = function(factionName)
   {
      InputValidator.validateIsString("factionName", factionName);

      var answer = factionName;

      switch (factionName)
      {
         case "First Order":
            answer = "FIRST_ORDER";
            break;
         case "Galactic Empire":
            answer = "IMPERIAL";
            break;
         case "Rebel Alliance":
            answer = "REBEL";
            break;
         case "Resistance":
            answer = "RESISTANCE";
            break;
         case "Scum and Villainy":
            answer = "SCUM";
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
            answer = "firstOrder";
            break;
         case "Galactic Empire":
            answer = "imperial";
            break;
         case "Rebel Alliance":
            answer = "rebel";
            break;
         case "Resistance":
            answer = "resistance";
            break;
         case "Scum and Villainy":
            answer = "scum";
            break;
      }

      return answer;
   };

   return FactionConverter;
});
