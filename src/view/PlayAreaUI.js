import InputValidator from "../utility/InputValidator.js";

import Difficulty from "../artifact/Difficulty.js";
import ShipFaction from "../artifact/ShipFaction.js";

import ShipImage from "./ShipImage.js";

class PlayAreaUI extends React.Component
{
   constructor(props)
   {
      super(props);

      this.explosionImage = undefined;
      this.shipFactionToImage = {};
   }

   componentDidMount()
   {
      this.loadImages();
      this.paint();
   }

   componentDidUpdate()
   {
      this.paint();
   }

   render()
   {
      const imageSrc = this.props.resourceBase + this.props.image;

      return ReactDOMFactories.canvas(
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
   }
}

PlayAreaUI.prototype.createExplosionImage = function()
{
   const image = new Image();
   image.src = this.props.resourceBase + "ship/Explosion64.png";

   return image;
};

PlayAreaUI.prototype.createShipIcon = function(shipFaction)
{
   InputValidator.validateNotNull("shipFaction", shipFaction);

   const image = new Image();
   image.onload = function()
   {
      this.forceUpdate();
   }.bind(this);

   const filename = shipFaction.image;
   image.src = this.props.resourceBase + "ship/" + filename;

   return image;
};

PlayAreaUI.prototype.drawExplosion = function(context)
{
   const explosion = this.props.explosion;

   if (explosion)
   {
      InputValidator.validateNotNull("scale", this.props.scale);
      InputValidator.validateNotNull("explosion.position", explosion.position);
      InputValidator.validateNotNull("explosion.shipBase", explosion.shipBase);
      InputValidator.validateNotNull("explosion.audioClip", explosion.audioClip);

      const position = explosion.position;
      const shipBase = explosion.shipBase;
      const audioClip = explosion.audioClip;

      const x = position.x();
      const y = position.y();
      const width = shipBase.width;
      const height = shipBase.height;

      context.save();
      context.scale(this.props.scale, this.props.scale);
      context.translate(x, y);
      context.drawImage(this.explosionImage, -width / 2, -height / 2, width, height);

      audioClip.play();

      // Cleanup.
      context.restore();
   }
};

PlayAreaUI.prototype.drawLaserBeam = function(context)
{
   const laserBeam = this.props.laserBeam;

   if (laserBeam)
   {
      InputValidator.validateNotNull("scale", this.props.scale);
      InputValidator.validateNotNull("laserBeam.fromPosition", laserBeam.fromPosition);
      InputValidator.validateNotNull("laserBeam.toPosition", laserBeam.toPosition);
      InputValidator.validateNotNull("laserBeam.isPrimary", laserBeam.isPrimary);
      InputValidator.validateNotNull("laserBeam.factionColor", laserBeam.factionColor);
      // audioClip optional.

      const fromPosition = laserBeam.fromPosition;
      const toPosition = laserBeam.toPosition;
      const isPrimary = laserBeam.isPrimary;
      const factionColor = laserBeam.factionColor;
      const audioClip = laserBeam.audioClip;

      const strokeStyle = factionColor;
      const lineDashSegments = (isPrimary ? undefined : [10, 5]);

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
};

PlayAreaUI.FOREGROUND_COLOR = "white";
PlayAreaUI.EASY_COLOR = "lime";
PlayAreaUI.HARD_COLOR = "red";

PlayAreaUI.prototype.drawManeuver = function(context)
{
   const maneuverObj = this.props.maneuver;

   if (maneuverObj)
   {
      InputValidator.validateNotNull("scale", this.props.scale);
      InputValidator.validateNotNull("maneuver.maneuver", maneuverObj.maneuver);
      InputValidator.validateNotNull("maneuver.fromPolygon", maneuverObj.fromPolygon);
      InputValidator.validateNotNull("maneuver.fromPosition", maneuverObj.fromPosition);
      InputValidator.validateNotNull("maneuver.path", maneuverObj.path);
      InputValidator.validateNotNull("maneuver.toPolygon", maneuverObj.toPolygon);

      const maneuver = maneuverObj.maneuver;
      const fromPolygon = maneuverObj.fromPolygon;
      const fromPosition = maneuverObj.fromPosition;
      const path = maneuverObj.path;
      const toPolygon = maneuverObj.toPolygon;

      context.save();
      context.scale(this.props.scale, this.props.scale);

      // Mark the center.
      context.fillStyle = PlayAreaUI.FOREGROUND_COLOR;
      const radius = 4;
      context.beginPath();
      context.arc(fromPosition.x(), fromPosition.y(), radius, 0, 2 * Math.PI);
      context.fill();

      // Draw from ship base.
      fromPolygon.paintComponent(context, PlayAreaUI.FOREGROUND_COLOR);

      if (toPolygon)
      {
         // Draw to ship base.
         toPolygon.paintComponent(context, PlayAreaUI.FOREGROUND_COLOR);
      }

      // Draw maneuver path.
      const difficulty = maneuver.difficultyKey;
      path.paintComponent(context, getColor(difficulty));

      // Cleanup.
      context.restore();
   }

   function getColor(difficulty)
   {
      let answer;

      switch (difficulty)
      {
         case Difficulty.EASY:
            answer = PlayAreaUI.EASY_COLOR;
            break;
         case Difficulty.HARD:
            answer = PlayAreaUI.HARD_COLOR;
            break;
         default:
            answer = PlayAreaUI.FOREGROUND_COLOR;
      }

      return answer;
   }
};

PlayAreaUI.prototype.drawTokens = function(context)
{
   InputValidator.validateNotNull("context", context);
   InputValidator.validateNotNull("tokenPositions", this.props.tokenPositions);

   const scale = this.props.scale;
   const tokenPositions = this.props.tokenPositions;

   if (tokenPositions)
   {
      tokenPositions.forEach(function(tokenPosition)
      {
         const token = tokenPosition.token;
         const shipFactionKey = token.card().shipFactionKey;
         const id = token.id();
         const image = this.shipFactionToImage[shipFactionKey];
         const position = tokenPosition.position;
         const shipFaction = ShipFaction.properties[shipFactionKey];

         ShipImage.draw(context, scale, id, image, position, shipFaction);
      }, this);
   }
};

PlayAreaUI.prototype.loadImages = function()
{
   InputValidator.validateNotNull("tokenPositions", this.props.tokenPositions);

   const tokenPositions = this.props.tokenPositions;
   const shipFactions = [];

   tokenPositions.forEach(function(tokenPosition)
   {
      const shipFaction = tokenPosition.token.card().shipFaction;
      if (!shipFactions.includes(shipFaction))
      {
         shipFactions.push(shipFaction);
      }
   });

   for (let i = 0; i < shipFactions.length; i++)
   {
      const shipFaction = shipFactions[i];
      this.shipFactionToImage[shipFaction.key] = this.createShipIcon(shipFaction);
   }

   this.explosionImage = this.createExplosionImage();
};

PlayAreaUI.prototype.paint = function()
{
   InputValidator.validateNotNull("width", this.props.width);
   InputValidator.validateNotNull("height", this.props.height);

   const canvas = document.getElementById("playAreaCanvas");
   const context = canvas.getContext("2d");

   context.clearRect(0, 0, this.props.width, this.props.height);

   this.drawTokens(context);
   this.drawManeuver(context);
   this.drawLaserBeam(context);
   this.drawExplosion(context);
};

PlayAreaUI.propTypes = {
   height: PropTypes.number.isRequired,
   image: PropTypes.string.isRequired,
   resourceBase: PropTypes.string.isRequired,
   scale: PropTypes.number.isRequired,
   tokenPositions: PropTypes.array.isRequired,
   width: PropTypes.number.isRequired,

   explosion: PropTypes.object,
   laserBeam: PropTypes.object,
   maneuver: PropTypes.object,
};

export default PlayAreaUI;