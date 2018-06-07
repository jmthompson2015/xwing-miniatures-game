import InputValidator from "../../utility/InputValidator.js";

const TableRow = {};

TableRow.createTableRow = function(upgrade)
{
   InputValidator.validateNotNull("upgrade", upgrade);

   const restrictionKeys = (upgrade.restrictionKeys !== undefined ? upgrade.restrictionKeys : []);
   const rangeKeys = (upgrade.rangeKeys !== undefined ? upgrade.rangeKeys : []);
   const isImplemented = (upgrade.isImplemented !== undefined ? upgrade.isImplemented : false);

   return (
   {
      typeKey: upgrade.typeKey,
      name: upgrade.name,
      wave: upgrade.wave,
      restrictionKeys: restrictionKeys,
      headerKey: upgrade.headerKey,
      weaponValue: upgrade.weaponValue,
      rangeKeys: rangeKeys,
      firingArcKey: upgrade.firingArcKey,
      description: upgrade.description,
      squadPointCost: upgrade.squadPointCost,
      isImplemented: isImplemented,
   });
};

export default TableRow;