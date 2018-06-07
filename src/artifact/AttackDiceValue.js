const AttackDiceValue = {
   HIT: "hit",
   CRITICAL_HIT: "criticalHit",
   FOCUS: "focus",
   BLANK: "blank",

   properties:
   {
      "hit":
      {
         name: "Hit",
         sortOrder: 0,
         key: "hit",
      },
      "criticalHit":
      {
         name: "Critical Hit",
         sortOrder: 1,
         key: "criticalHit",
      },
      "focus":
      {
         name: "Focus",
         sortOrder: 2,
         key: "focus",
      },
      "blank":
      {
         name: "Blank",
         sortOrder: 3,
         key: "blank",
      },
   },
};

AttackDiceValue.keys = function()
{
   return Object.keys(AttackDiceValue.properties);
};

AttackDiceValue.toString = function()
{
   return "AttackDiceValue";
};

AttackDiceValue.values = function()
{
   return Object.values(AttackDiceValue.properties);
};

if (Object.freeze)
{
   Object.freeze(AttackDiceValue);
}

export default AttackDiceValue;