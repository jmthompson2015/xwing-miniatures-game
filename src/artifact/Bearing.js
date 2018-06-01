var Bearing = {
   HUGE_BANK_LEFT: "hugeBankLeft",
   TURN_LEFT: "turnLeft",
   BANK_LEFT: "bankLeft",
   STRAIGHT: "straight",
   BANK_RIGHT: "bankRight",
   TURN_RIGHT: "turnRight",
   HUGE_BANK_RIGHT: "hugeBankRight",

   BARREL_ROLL_LEFT: "barrelRollLeft",
   SEGNORS_LOOP_LEFT: "segnorsLoopLeft",
   TALLON_ROLL_LEFT: "tallonRollLeft",
   KOIOGRAN_TURN: "kTurn",
   BARREL_ROLL_RIGHT: "barrelRollRight",
   SEGNORS_LOOP_RIGHT: "segnorsLoopRight",
   TALLON_ROLL_RIGHT: "tallonRollRight",

   properties:
   {
      "hugeBankLeft":
      {
         name: "Huge Bank Left",
         headingChange: -30,
         isBank: true,
         key: "hugeBankLeft",
      },
      "turnLeft":
      {
         name: "Turn Left",
         headingChange: -90,
         isTurn: true,
         key: "turnLeft",
      },
      "bankLeft":
      {
         name: "Bank Left",
         headingChange: -45,
         isBank: true,
         key: "bankLeft",
      },
      "straight":
      {
         name: "Straight",
         headingChange: 0,
         key: "straight",
      },
      "bankRight":
      {
         name: "Bank Right",
         headingChange: 45,
         isBank: true,
         key: "bankRight",
      },
      "turnRight":
      {
         name: "Turn Right",
         headingChange: 90,
         isTurn: true,
         key: "turnRight",
      },
      "hugeBankRight":
      {
         name: "Huge Bank Right",
         headingChange: 30,
         isBank: true,
         key: "hugeBankRight",
      },
      "barrelRollLeft":
      {
         name: "Barrel Roll Left",
         headingChange: 0,
         key: "barrelRollLeft",
      },
      "segnorsLoopLeft":
      {
         name: "Segnor's Loop Left",
         headingChange: 135,
         isBank: true,
         key: "segnorsLoopLeft",
      },
      "tallonRollLeft":
      {
         name: "Tallon Roll Left",
         headingChange: 180,
         isTurn: true,
         key: "tallonRollLeft",
      },
      "kTurn":
      {
         name: "Koiogran Turn",
         headingChange: 180,
         key: "kTurn",
      },
      "barrelRollRight":
      {
         name: "Barrel Roll Right",
         headingChange: 0,
         key: "barrelRollRight",
      },
      "segnorsLoopRight":
      {
         name: "Segnor's Loop Right",
         headingChange: 225,
         isBank: true,
         key: "segnorsLoopRight",
      },
      "tallonRollRight":
      {
         name: "Tallon Roll Right",
         headingChange: 180,
         isTurn: true,
         key: "tallonRollRight",
      },
   },
};

Bearing.keys = function()
{
   return Object.keys(Bearing.properties);
};

Bearing.values = function()
{
   return Object.values(Bearing.properties);
};

//////////////////////////////////////////////////////////////////////////
// Utility methods.

Bearing.toString = function()
{
   return "Bearing";
};

if (Object.freeze)
{
   Object.freeze(Bearing);
}

export default Bearing;