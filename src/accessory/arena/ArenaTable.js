"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "artifact/js/Faction",
  "view/js/FactionUI", "view/js/DataTable", "accessory/arena/TableColumns"],
   function(createReactClass, PropTypes, React, DOM, Faction,
      FactionUI, DataTable, TableColumns)
   {
      var ArenaTable = createReactClass(
      {
         propTypes:
         {
            resourceBase: PropTypes.string.isRequired,
            rowData: PropTypes.array.isRequired,
         },

         render: function()
         {
            var rowData = this.props.rowData;
            var resourceBase = this.props.resourceBase;
            var cellFunctions = {
               "factionKey": function(data)
               {
                  var faction = Faction.properties[data.factionKey];
                  return React.createElement(FactionUI,
                  {
                     faction: faction,
                     isSmall: true,
                     resourceBase: resourceBase,
                  });
               },
               "squadBuilder": function(data)
               {
                  return data.squadBuilder.toString();
               },
            };

            var table = React.createElement(DataTable,
            {
               cellFunctions: cellFunctions,
               columns: TableColumns,
               resourceBase: resourceBase,
               rowData: rowData,
            });

            var rows = [];
            rows.push(DOM.tr(
            {
               key: rows.length,
            }, DOM.td(
            {}, table)));

            return DOM.table(
            {}, DOM.tbody(
            {}, rows));
         },
      });

      return ArenaTable;
   });
