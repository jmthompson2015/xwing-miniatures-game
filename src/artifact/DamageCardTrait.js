const DamageCardTrait = {
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
   let answer;
   const values = DamageCardTrait.values();

   for (let i = 0; i < values.length; i++)
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