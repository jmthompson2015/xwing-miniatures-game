const UpgradeHeader = {
   ACTION: "action",
   ATTACK: "attack",
   ATTACK_ENERGY: "attackEnergy",
   ATTACK_FOCUS: "attackFocus",
   ATTACK_TARGET_LOCK: "attackTargetLock",
   ENERGY: "energy",

   properties:
   {
      "action":
      {
         name: "Action",
         key: "action",
      },
      "attack":
      {
         name: "Attack",
         key: "attack",
      },
      "attackEnergy":
      {
         name: "Attack [Energy]",
         key: "attackEnergy",
      },
      "attackFocus":
      {
         name: "Attack [Focus]",
         key: "attackFocus",
      },
      "attackTargetLock":
      {
         name: "Attack [Target Lock]",
         key: "attackTargetLock",
      },
      "energy":
      {
         name: "Energy",
         key: "energy",
      },
   },
};

UpgradeHeader.keys = function()
{
   return Object.keys(UpgradeHeader.properties);
};

UpgradeHeader.toString = function()
{
   return "UpgradeHeader";
};

UpgradeHeader.values = function()
{
   return Object.values(UpgradeHeader.properties);
};

if (Object.freeze)
{
   Object.freeze(UpgradeHeader);
}

export default UpgradeHeader;