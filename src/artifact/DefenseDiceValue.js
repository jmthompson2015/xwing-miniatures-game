const DefenseDiceValue = {
   EVADE: "evade",
   FOCUS: "focus",
   BLANK: "blank",

   properties:
   {
      "evade":
      {
         name: "Evade",
         sortOrder: 0,
         key: "evade",
      },
      "focus":
      {
         name: "Focus",
         sortOrder: 1,
         key: "focus",
      },
      "blank":
      {
         name: "Blank",
         sortOrder: 2,
         key: "blank",
      },
   },
};

DefenseDiceValue.keys = function()
{
   return Object.keys(DefenseDiceValue.properties);
};

DefenseDiceValue.toString = function()
{
   return "DefenseDiceValue";
};

DefenseDiceValue.values = function()
{
   return Object.values(DefenseDiceValue.properties);
};

if (Object.freeze)
{
   Object.freeze(DefenseDiceValue);
}

export default DefenseDiceValue;