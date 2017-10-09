"use strict";

define(function()
{
   var TableColumns = [
      {
         key: "factionKey",
         label: "Faction",
      },
      {
         key: "squadBuilder",
         label: "Squad",
         className: "textCell tl",
      },
      {
         key: "winCount",
         label: "Win",
         className: "numberCell tr",
      },
      {
         key: "loseCount",
         label: "Lose",
         className: "numberCell tr",
      },
      {
         key: "tieCount",
         label: "Tie",
         className: "numberCell tr",
      },
   ];

   return TableColumns;
});
