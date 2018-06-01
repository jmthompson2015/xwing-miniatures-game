var DamageCardTrait = {
   PILOT: "pilot",
   SHIP: "ship",
   properties:
   {
      "pilot":
      {
         name: "Pilot",
         key: "pilot",
      },
      "ship":
      {
         name: "Ship",
         key: "ship",
      },
   },
};

DamageCardTrait.keys = function()
{
   return Object.keys(DamageCardTrait.properties);
};

DamageCardTrait.values = function()
{
   return Object.values(DamageCardTrait.properties);
};

//////////////////////////////////////////////////////////////////////////
// Utility methods.

DamageCardTrait.findByName = function(name)
{
   var answer;
   var values = DamageCardTrait.values();

   for (var i = 0; i < values.length; i++)
   {
      if (values[i].name === name)
      {
         answer = values[i];
         break;
      }
   }

   return answer;
};

DamageCardTrait.toString = function()
{
   return "DamageCardTrait";
};

if (Object.freeze)
{
   Object.freeze(DamageCardTrait);
}

export default DamageCardTrait;