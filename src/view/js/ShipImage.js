"use strict";

define(["common/js/InputValidator", "artifact/js/FiringArc", "artifact/js/Ship"],
   function(InputValidator, FiringArc, Ship)
   {
      var ShipImage = {};

      var DEG_TO_RADIANS = Math.PI / 180;

      ShipImage.draw = function(context, scale, id, image, position, shipFaction)
      {
         InputValidator.validateNotNull("context", context);
         InputValidator.validateNotNull("scale", scale);
         // id optional.
         InputValidator.validateNotNull("image", image);
         InputValidator.validateNotNull("position", position);
         InputValidator.validateNotNull("shipFaction", shipFaction);

         // Setup.
         var primaryFiringArc = shipFaction.ship.primaryFiringArc;
         var auxiliaryFiringArc = shipFaction.ship.auxiliaryFiringArc;
         var factionColor = shipFaction.faction.color;
         var shipBase = shipFaction.ship.shipBase;
         var width = shipBase.width;
         var height = shipBase.height;
         var x = position.x();
         var y = position.y();
         var angle = position.heading() * DEG_TO_RADIANS;

         context.save();
         context.scale(scale, scale);
         context.translate(x, y);
         context.rotate(angle);

         // Draw background square.
         context.fillStyle = "rgba(255,255,255,0.4)";
         context.fillRect(-width / 2, -height / 2, width, height);
         context.fillStyle = "rgba(255,255,255,0.2)";
         context.strokeStyle = factionColor;

         // Draw the auxiliary firing arc.
         if (auxiliaryFiringArc)
         {
            context.setLineDash([5, 4]);
            ShipImage.drawFiringArc(context, auxiliaryFiringArc.key, width, height);
            context.setLineDash([]);
         }

         // Draw the primary firing arc.
         if ([Ship.CR90_CORVETTE, Ship.RAIDER_CLASS_CORVETTE].includes(shipFaction.ship.key))
         {
            ShipImage.drawFiringArc(context, shipFaction.ship.fore.primaryFiringArcKey, width, height);
            ShipImage.drawFiringArc(context, shipFaction.ship.aft.primaryFiringArcKey, width, height);
         }
         else if (primaryFiringArc)
         {
            ShipImage.drawFiringArc(context, primaryFiringArc.key, width, height);
         }

         // Draw ship image.
         context.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);

         if (id !== undefined)
         {
            // Draw the token ID.
            context.rotate(90 * DEG_TO_RADIANS);
            context.fillStyle = factionColor;
            context.font = "14px sans-serif";
            context.fillText(id, -height / 2, width / 2);
            context.rotate(-90 * DEG_TO_RADIANS);
         }

         // Cleanup.
         context.restore();
      };

      ShipImage.drawFiringArc = function(context, firingArcKey, width, height)
      {
         InputValidator.validateNotNull("context", context);
         InputValidator.validateIsString("firingArcKey", firingArcKey);
         InputValidator.validateIsNumber("width", width);
         InputValidator.validateIsNumber("height", height);

         // Draw the firing arc.
         switch (firingArcKey)
         {
            case FiringArc.AFT:
               context.beginPath();
               context.moveTo(-width / 2, -height / 2);
               context.lineTo(0, 0);
               context.lineTo(-width / 2, height / 2);
               context.fill();
               context.stroke();
               break;
            case FiringArc.AFT_180:
            case FiringArc.FORWARD_180:
               context.beginPath();
               context.moveTo(0, -height / 2);
               context.lineTo(0, 0);
               context.lineTo(0, height / 2);
               context.stroke();
               context.lineTo(width / 2, height / 2);
               context.lineTo(width / 2, -height / 2);
               context.fill();
               break;
            case FiringArc.BULLSEYE:
               context.beginPath();
               context.moveTo(8, -8);
               context.lineTo(width / 2, -8);
               context.moveTo(width / 2, 8);
               context.lineTo(8, 8);
               context.fill();
               context.stroke();
               break;
            case FiringArc.FORWARD:
               context.beginPath();
               context.moveTo(width / 2, -height / 2);
               context.lineTo(0, 0);
               context.lineTo(width / 2, height / 2);
               context.fill();
               context.stroke();
               break;
            case FiringArc.FORWARD_106:
               // +1 offset to avoid border lines
               context.beginPath();
               context.moveTo(height / 2 * Math.tan(37 * Math.PI / 180.0), -height / 2);
               context.lineTo(0, 0);
               context.lineTo(height / 2 * Math.tan(37 * Math.PI / 180.0), height / 2 + 1);
               context.stroke();
               context.lineTo(width / 2 + 1, height / 2 + 1);
               context.lineTo(width / 2 + 1, -height / 2);
               context.fill();
               break;
            case FiringArc.FORWARD_136:
               context.beginPath();
               context.moveTo(height / 2 * Math.tan(22 * Math.PI / 180.0), -height / 2);
               context.lineTo(0, 0);
               context.lineTo(height / 2 * Math.tan(22 * Math.PI / 180.0), height / 2);
               context.stroke();
               context.lineTo(width / 2, height / 2);
               context.lineTo(width / 2, -height / 2);
               context.fill();
               break;
            case FiringArc.PORT:
               context.beginPath();
               context.moveTo(-width / 2, height / 2);
               context.lineTo(0, 0);
               context.lineTo(width / 2, height / 2);
               context.fill();
               context.stroke();
               break;
            case FiringArc.PORT_AND_STARBOARD_AFT:
               context.beginPath();
               context.moveTo(-width / 2, height / 2);
               context.lineTo(-width / 2 + 40, 0);
               context.lineTo(-width / 2 + 80, height / 2);
               context.moveTo(-width / 2, -height / 2);
               context.lineTo(-width / 2 + 40, 0);
               context.lineTo(-width / 2 + 80, -height / 2);
               context.fill();
               context.stroke();
               break;
            case FiringArc.PORT_AND_STARBOARD_AFT_SKEWED:
               context.moveTo(-width / 2, height / 2);
               context.lineTo(-width / 2 + 40, 0);
               context.lineTo(0, height / 2);
               context.moveTo(-width / 2, -height / 2);
               context.lineTo(-width / 2 + 40, 0);
               context.lineTo(0, -height / 2);
               context.fill();
               context.stroke();
               break;
            case FiringArc.PORT_AND_STARBOARD_FORE:
               context.beginPath();
               context.moveTo(width / 2, height / 2);
               context.lineTo(width / 2 - 40, 0);
               context.lineTo(width / 2 - 80, height / 2);
               context.moveTo(width / 2, -height / 2);
               context.lineTo(width / 2 - 40, 0);
               context.lineTo(width / 2 - 80, -height / 2);
               context.fill();
               context.stroke();
               break;
            case FiringArc.STARBOARD:
               context.beginPath();
               context.moveTo(-width / 2, -height / 2);
               context.lineTo(0, 0);
               context.lineTo(width / 2, -height / 2);
               context.fill();
               context.stroke();
               break;
            default:
               throw "Unknown firingArc: " + firingArcKey;
         }
      };

      return ShipImage;
   });
