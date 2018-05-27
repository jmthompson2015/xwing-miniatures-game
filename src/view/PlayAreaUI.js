"use strict";

define(["create-react-class", "prop-types", "react-dom-factories", "utility/InputValidator",
  "artifact/Difficulty", "artifact/ShipFaction", "view/ShipImage"],
   function(createReactClass, PropTypes, DOM, InputValidator, Difficulty, ShipFaction, ShipImage)
   {
      var PlayAreaUI = createReactClass(
      {
         propTypes:
         {
            height: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
            resourceBase: PropTypes.string.isRequired,
            scale: PropTypes.number.isRequired,
            tokenPositions: PropTypes.array.isRequired,
            width: PropTypes.number.isRequired,

            explosion: PropTypes.object,
            laserBeam: PropTypes.object,
            maneuver: PropTypes.object,
         },

         explosionImage: undefined,
         shipFactionToImage:
         {},

         componentDidMount: function()
         {
            this.loadImages();
            this.paint();
         },

         componentDidUpdate: function()
         {
            this.paint();
         },

         render: function()
         {
            var imageSrc = this.props.resourceBase + this.props.image;

            return DOM.canvas(
            {
               id: "playAreaCanvas",
               style:
               {
                  backgroundImage: "url(" + imageSrc + ")",
                  backgroundSize: "100%",
               },
               width: this.props.width,
               height: this.props.height,
            });
         },

         createExplosionImage: function()
         {
            var image = new Image();
            image.src = this.props.resourceBase + "ship/Explosion64.png";

            return image;
         },

         createShipIcon: function(shipFaction)
         {
            InputValidator.validateNotNull("shipFaction", shipFaction);

            var image = new Image();
            image.onload = function()
            {
               this.forceUpdate();
            }.bind(this);

            var filename = shipFaction.image;
            image.src = this.props.resourceBase + "ship/" + filename;

            return image;
         },

         drawExplosion: function(context)
         {
            var explosion = this.props.explosion;

            if (explosion)
            {
               InputValidator.validateNotNull("scale", this.props.scale);
               InputValidator.validateNotNull("explosion.position", explosion.position);
               InputValidator.validateNotNull("explosion.shipBase", explosion.shipBase);
               InputValidator.validateNotNull("explosion.audioClip", explosion.audioClip);

               var position = explosion.position;
               var shipBase = explosion.shipBase;
               var audioClip = explosion.audioClip;

               var x = position.x();
               var y = position.y();
               var width = shipBase.width;
               var height = shipBase.height;

               context.save();
               context.scale(this.props.scale, this.props.scale);
               context.translate(x, y);
               context.drawImage(this.explosionImage, -width / 2, -height / 2, width, height);

               audioClip.play();

               // Cleanup.
               context.restore();
            }
         },

         drawLaserBeam: function(context)
         {
            var laserBeam = this.props.laserBeam;

            if (laserBeam)
            {
               InputValidator.validateNotNull("scale", this.props.scale);
               InputValidator.validateNotNull("laserBeam.fromPosition", laserBeam.fromPosition);
               InputValidator.validateNotNull("laserBeam.toPosition", laserBeam.toPosition);
               InputValidator.validateNotNull("laserBeam.isPrimary", laserBeam.isPrimary);
               InputValidator.validateNotNull("laserBeam.factionColor", laserBeam.factionColor);
               // audioClip optional.

               var fromPosition = laserBeam.fromPosition;
               var toPosition = laserBeam.toPosition;
               var isPrimary = laserBeam.isPrimary;
               var factionColor = laserBeam.factionColor;
               var audioClip = laserBeam.audioClip;

               var strokeStyle = factionColor;
               var lineDashSegments = (isPrimary ? undefined : [10, 5]);

               context.save();
               context.scale(this.props.scale, this.props.scale);
               context.lineWidth = 3;
               context.strokeStyle = strokeStyle;

               if (lineDashSegments)
               {
                  context.setLineDash(lineDashSegments);
               }

               context.beginPath();
               context.moveTo(fromPosition.x(), fromPosition.y());
               context.lineTo(toPosition.x(), toPosition.y());
               context.stroke();

               if (audioClip)
               {
                  audioClip.play();
               }

               // Cleanup.
               context.restore();
            }
         },

         drawManeuver: function(context)
         {
            var maneuverObj = this.props.maneuver;

            if (maneuverObj)
            {
               InputValidator.validateNotNull("scale", this.props.scale);
               InputValidator.validateNotNull("maneuver.maneuver", maneuverObj.maneuver);
               InputValidator.validateNotNull("maneuver.fromPolygon", maneuverObj.fromPolygon);
               InputValidator.validateNotNull("maneuver.fromPosition", maneuverObj.fromPosition);
               InputValidator.validateNotNull("maneuver.path", maneuverObj.path);
               InputValidator.validateNotNull("maneuver.toPolygon", maneuverObj.toPolygon);

               var maneuver = maneuverObj.maneuver;
               var fromPolygon = maneuverObj.fromPolygon;
               var fromPosition = maneuverObj.fromPosition;
               var path = maneuverObj.path;
               var toPolygon = maneuverObj.toPolygon;

               var FOREGROUND_COLOR = "white";
               var EASY_COLOR = "lime";
               var HARD_COLOR = "red";

               context.save();
               context.scale(this.props.scale, this.props.scale);

               // Mark the center.
               context.fillStyle = FOREGROUND_COLOR;
               var radius = 4;
               context.beginPath();
               context.arc(fromPosition.x(), fromPosition.y(), radius, 0, 2 * Math.PI);
               context.fill();

               // Draw from ship base.
               fromPolygon.paintComponent(context, FOREGROUND_COLOR);

               if (toPolygon)
               {
                  // Draw to ship base.
                  toPolygon.paintComponent(context, FOREGROUND_COLOR);
               }

               // Draw maneuver path.
               var difficulty = maneuver.difficultyKey;
               path.paintComponent(context, getColor(difficulty));

               // Cleanup.
               context.restore();
            }

            function getColor(difficulty)
            {
               var answer;

               switch (difficulty)
               {
                  case Difficulty.EASY:
                     answer = EASY_COLOR;
                     break;
                  case Difficulty.HARD:
                     answer = HARD_COLOR;
                     break;
                  default:
                     answer = FOREGROUND_COLOR;
               }

               return answer;
            }
         },

         drawTokens: function(context)
         {
            InputValidator.validateNotNull("context", context);
            InputValidator.validateNotNull("tokenPositions", this.props.tokenPositions);

            var scale = this.props.scale;
            var tokenPositions = this.props.tokenPositions;

            if (tokenPositions)
            {
               tokenPositions.forEach(function(tokenPosition)
               {
                  var token = tokenPosition.token;
                  var shipFactionKey = token.card().shipFactionKey;
                  var id = token.id();
                  var image = this.shipFactionToImage[shipFactionKey];
                  var position = tokenPosition.position;
                  var shipFaction = ShipFaction.properties[shipFactionKey];

                  ShipImage.draw(context, scale, id, image, position, shipFaction);
               }, this);
            }
         },

         loadImages: function()
         {
            InputValidator.validateNotNull("tokenPositions", this.props.tokenPositions);

            var tokenPositions = this.props.tokenPositions;
            var shipFactions = [];

            tokenPositions.forEach(function(tokenPosition)
            {
               var shipFaction = tokenPosition.token.card().shipFaction;
               if (!shipFactions.includes(shipFaction))
               {
                  shipFactions.push(shipFaction);
               }
            });

            for (var i = 0; i < shipFactions.length; i++)
            {
               var shipFaction = shipFactions[i];
               this.shipFactionToImage[shipFaction.key] = this.createShipIcon(shipFaction);
            }

            this.explosionImage = this.createExplosionImage();
         },

         paint: function()
         {
            InputValidator.validateNotNull("width", this.props.width);
            InputValidator.validateNotNull("height", this.props.height);

            var canvas = document.getElementById("playAreaCanvas");
            var context = canvas.getContext("2d");

            context.clearRect(0, 0, this.props.width, this.props.height);

            this.drawTokens(context);
            this.drawManeuver(context);
            this.drawLaserBeam(context);
            this.drawExplosion(context);
         },
      });

      return PlayAreaUI;
   });