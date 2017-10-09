"use strict";

define(function()
{
   var TableColumns = [
      {
         key: "deck",
         label: "Deck",
         className: "textCell tl",
      },
      {
         key: "type",
         label: "Type",
         className: "tc",
        },
      {
         key: "name",
         label: "Name",
         className: "textCell tl",
        },
      {
         key: "description",
         label: "Description",
         className: "textCell tl",
        },
      {
         key: "action",
         label: "Action",
         className: "textCell tl",
        },
      {
         key: "isImplemented",
         label: "Implemented",
         className: "tc",
        },
      {
         key: "event",
         label: "Event",
         className: "textCell tl",
        },
    ];

   return TableColumns;
});
