"use strict";

define(function()
{
   var TableColumns = [
      {
         key: "version",
         label: "Version",
         className: "textCell",
        },
      {
         key: "name",
         label: "Name",
         className: "textCell",
        },
      {
         key: "trait",
         label: "Trait",
         className: "textCell",
        },
      {
         key: "description",
         label: "Description",
         className: "textCell",
        },
      {
         key: "action",
         label: "Action",
         className: "textCell",
        },
      {
         key: "isImplemented",
         label: "Implemented",
        },
    ];

   return TableColumns;
});
