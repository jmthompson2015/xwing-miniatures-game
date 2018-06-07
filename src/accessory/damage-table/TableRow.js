import InputValidator from "../../utility/InputValidator.js";

const TableRow = {};

TableRow.createTableRow = function(damage, version)
{
   InputValidator.validateNotNull("damage", damage);
   InputValidator.validateNotNull("version", version);

   const action = (damage.hasAction !== undefined && damage.hasAction ? damage.actionDescription : undefined);
   const isImplemented = (damage.isImplemented !== undefined ? damage.isImplemented : false);

   return (
   {
      version: version,
      trait: damage.trait,
      name: damage.name,
      action: action,
      description: damage.description,
      isImplemented: isImplemented,
   });
};

export default TableRow;