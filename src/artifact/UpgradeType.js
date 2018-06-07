const UpgradeType = {
   ASTROMECH: "astromech",
   BOMB: "bomb",
   CANNON: "cannon",
   CARGO: "cargo",
   CREW: "crew",
   ELITE: "elite",
   HARDPOINT: "hardpoint",
   ILLICIT: "illicit",
   MISSILE: "missile",
   MODIFICATION: "modification",
   SALVAGED_ASTROMECH: "salvagedAstromech",
   SYSTEM: "system",
   TEAM: "team",
   TECH: "tech",
   TITLE: "title",
   TORPEDO: "torpedo",
   TURRET: "turret",
   properties:
   {
      "astromech":
      {
         name: "Astromech",
         key: "astromech",
      },
      "bomb":
      {
         name: "Bomb",
         key: "bomb",
      },
      "cannon":
      {
         name: "Cannon",
         key: "cannon",
      },
      "cargo":
      {
         name: "Cargo",
         key: "cargo",
      },
      "crew":
      {
         name: "Crew",
         key: "crew",
      },
      "elite":
      {
         name: "Elite",
         key: "elite",
      },
      "hardpoint":
      {
         name: "Hardpoint",
         key: "hardpoint",
      },
      "illicit":
      {
         name: "Illicit",
         key: "illicit",
      },
      "missile":
      {
         name: "Missile",
         key: "missile",
      },
      "modification":
      {
         name: "Modification",
         key: "modification",
      },
      "salvagedAstromech":
      {
         name: "Salvaged Astromech",
         key: "salvagedAstromech",
      },
      "system":
      {
         name: "System",
         key: "system",
      },
      "team":
      {
         name: "Team",
         key: "team",
      },
      "tech":
      {
         name: "Tech",
         key: "tech",
      },
      "title":
      {
         name: "Title",
         key: "title",
      },
      "torpedo":
      {
         name: "Torpedo",
         key: "torpedo",
      },
      "turret":
      {
         name: "Turret",
         key: "turret",
      },
   },
};

UpgradeType.keys = function()
{
   return Object.keys(UpgradeType.properties);
};

UpgradeType.values = function()
{
   return Object.values(UpgradeType.properties);
};

//////////////////////////////////////////////////////////////////////////
// Utility methods.

UpgradeType.findByName = function(name)
{
   let answer;
   const values = UpgradeType.values();

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

UpgradeType.toString = function()
{
   return "UpgradeType";
};

if (Object.freeze)
{
   Object.freeze(UpgradeType);
}

export default UpgradeType;