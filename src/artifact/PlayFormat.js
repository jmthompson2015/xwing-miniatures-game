import InputValidator from "../utility/InputValidator.js";

const PlayFormat = {
   STANDARD: "standard",
   CINEMATIC: "cinematic",
   EPIC: "epic",
   properties:
   {
      "standard":
      {
         name: "Standard",
         width: 915, // mm
         height: 915, // mm
         key: "standard",
      },
      "cinematic":
      {
         name: "Cinematic",
         width: 1830, // mm
         height: 915, // mm
         key: "cinematic",
      },
      "epic":
      {
         name: "Epic",
         width: 1830, // mm
         height: 915, // mm
         key: "epic",
      },
   },
};

PlayFormat.isPathInPlayArea = function(playFormatKey, path)
{
   InputValidator.validateNotNull("playFormatKey", playFormatKey);
   InputValidator.validateNotNull("path", path);

   let answer = true;
   const points = path.points();

   for (let i = 0; i < points.length; i += 2)
   {
      if (!PlayFormat.isPointInPlayArea(playFormatKey, points[i], points[i + 1]))
      {
         answer = false;
         break;
      }
   }

   return answer;
};

PlayFormat.isPointInPlayArea = function(playFormatKey, xIn, yIn)
{
   InputValidator.validateNotNull("playFormatKey", playFormatKey);
   InputValidator.validateNotNull("xIn", xIn);
   InputValidator.validateNotNull("yIn", yIn);

   const playFormat = PlayFormat.properties[playFormatKey];
   const x = Math.round(xIn);
   const y = Math.round(yIn);

   return ((0 <= x) && (x < playFormat.width)) && ((0 <= y) && (y < playFormat.height));
};

PlayFormat.keys = function()
{
   return Object.keys(PlayFormat.properties);
};

PlayFormat.toString = function()
{
   return "PlayFormat";
};

PlayFormat.values = function()
{
   return Object.values(PlayFormat.properties);
};

if (Object.freeze)
{
   Object.freeze(PlayFormat);
}

export default PlayFormat;