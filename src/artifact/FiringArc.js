var FiringArc = {
   AFT: "aft",
   AFT_180: "aft180",
   BULLSEYE: "bullseye",
   FORWARD: "forward",
   FORWARD_106: "forward106",
   FORWARD_136: "forward136",
   FORWARD_180: "forward180",
   PORT: "port",
   PORT_AND_STARBOARD_AFT: "portAndStarboardAft",
   PORT_AND_STARBOARD_AFT_SKEWED: "portAndStarboardAftSkewed",
   PORT_AND_STARBOARD_FORE: "portAndStarboardFore",
   STARBOARD: "starboard",

   properties:
   {
      "aft":
      {
         name: "Aft",
         key: "aft",
      },
      "aft180":
      {
         name: "Aft 180",
         key: "aft180",
      },
      "bullseye":
      {
         name: "Bullseye",
         key: "bullseye",
      },
      "forward":
      {
         name: "Forward",
         key: "forward",
      },
      "forward106":
      {
         name: "Forward 106",
         key: "forward106",
      },
      "forward136":
      {
         name: "Forward 136",
         key: "forward136",
      },
      "forward180":
      {
         name: "Forward 180",
         key: "forward180",
      },
      "port":
      {
         name: "Port",
         key: "port",
      },
      "portAndStarboardAft":
      {
         name: "Port and Starboard aft",
         key: "portAndStarboardAft",
      },
      "portAndStarboardAftSkewed":
      {
         // port 225 to 331; starboard 29 to 135
         name: "Port and Starboard aft skewed",
         key: "portAndStarboardAftSkewed",
      },
      "portAndStarboardFore":
      {
         name: "Port and Starboard fore",
         key: "portAndStarboardFore",
      },
      "starboard":
      {
         name: "Starboard",
         key: "starboard",
      },
   },
};

FiringArc.keys = function()
{
   return Object.keys(FiringArc.properties);
};

FiringArc.values = function()
{
   return Object.values(FiringArc.properties);
};

FiringArc.offsetKeys = function()
{
   // These firing arcs are offset from the ship's center.
   return [FiringArc.PORT_AND_STARBOARD_AFT, FiringArc.PORT_AND_STARBOARD_AFT_SKEWED, FiringArc.PORT_AND_STARBOARD_FORE];
};

FiringArc.toString = function()
{
   return "FiringArc";
};

if (Object.freeze)
{
   Object.freeze(FiringArc);
}

export default FiringArc;