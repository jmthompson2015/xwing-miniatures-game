import UpgradeType from "../artifact/UpgradeType.js";

const UpgradeTypeComparator = function(upgradeTypeA, upgradeTypeB)
{
   const valueA = UpgradeTypeComparator.TYPE_ORDER.indexOf(upgradeTypeA);
   const valueB = UpgradeTypeComparator.TYPE_ORDER.indexOf(upgradeTypeB);

   let answer = -1;

   if (valueA === valueB)
   {
      answer = 0;
   }
   else if (valueA > valueB)
   {
      answer = 1;
   }

   return answer;
};

UpgradeTypeComparator.TYPE_ORDER = [
     UpgradeType.TITLE, // type
     UpgradeType.ELITE, // type
     UpgradeType.SYSTEM, // type
     UpgradeType.TURRET, // type
     UpgradeType.CANNON, // type
     UpgradeType.TORPEDO, // type
     UpgradeType.MISSILE, // type
     UpgradeType.CREW, // type
     UpgradeType.BOMB, // type
     UpgradeType.HARDPOINT, // type
     UpgradeType.TEAM, // type
     UpgradeType.CARGO, // type
     UpgradeType.SALVAGED_ASTROMECH, // type
     UpgradeType.ASTROMECH, // type
     UpgradeType.TECH, // type
     UpgradeType.ILLICIT, // type
     UpgradeType.MODIFICATION, // type
   ];

export default UpgradeTypeComparator;