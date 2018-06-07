import InputValidator from "../../utility/InputValidator.js";

const TableRow = {};

TableRow.createTableRow = function(squadBuilder, winCountIn, loseCountIn, tieCountIn)
{
   InputValidator.validateNotNull("squadBuilder", squadBuilder);
   // winCountIn optional.
   // loseCountIn optional.
   // tieCountIn optional.

   const winCount = (winCountIn !== undefined ? winCountIn : 0);
   const loseCount = (loseCountIn !== undefined ? loseCountIn : 0);
   const tieCount = (tieCountIn !== undefined ? tieCountIn : 0);

   return (
   {
      factionKey: squadBuilder.factionKey(),
      squadBuilder: squadBuilder,
      winCount: winCount,
      loseCount: loseCount,
      tieCount: tieCount,
   });
};

export default TableRow;