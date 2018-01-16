"use strict";

define(["common/js/InputValidator"], function(InputValidator)
{
   var ShipBase = {
      SMALL: "small",
      LARGE: "large",
      HUGE1: "huge1",
      HUGE2: "huge2",
      properties:
      {
         "small":
         {
            name: "Small ship",
            width: 40,
            height: 40,
            key: "small",
         },
         "large":
         {
            name: "Large ship",
            width: 80,
            height: 80,
            key: "large",
         },
         "huge1":
         {
            // C-ROC Cruiser, Gozanti-class Cruiser, GR-75 Medium Transport
            name: "Huge ship",
            width: 192,
            height: 80,
            key: "huge1",
         },
         "huge2":
         {
            // CR90 Corvette, Raider-class Corvette
            name: "Huge ship",
            width: 224,
            height: 80,
            key: "huge2",
         }
      },
   };

   ShipBase.isHuge = function(shipBaseKey)
   {
      InputValidator.validateNotNull("shipBaseKey", shipBaseKey);

      return shipBaseKey === ShipBase.HUGE1 || shipBaseKey === ShipBase.HUGE2;
   };

   ShipBase.keys = function()
   {
      return Object.keys(ShipBase.properties);
   };

   ShipBase.toString = function()
   {
      return "ShipBase";
   };

   ShipBase.values = function()
   {
      return Object.values(ShipBase.properties);
   };

   if (Object.freeze)
   {
      Object.freeze(ShipBase);
   }

   return ShipBase;
});
