"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "react-redux", "common/js/MathAugments",
  "artifact/js/FiringArc", "artifact/js/Range", "artifact/js/UpgradeHeader", "artifact/js/UpgradeRestriction", "artifact/js/UpgradeType",
  "view/js/DataTable", "view/js/ImplementedImage", "view/js/UpgradeTypeUI",
  "accessory/upgrade-table/Action", "accessory/upgrade-table/FilterContainer", "accessory/upgrade-table/TableColumns"],
   function(createReactClass, PropTypes, React, DOM, ReactRedux, MathAugments,
      FiringArc, Range, UpgradeHeader, UpgradeRestriction, UpgradeType,
      DataTable, ImplementedImage, UpgradeTypeUI,
      Action, FilterContainer, TableColumns)
   {
      function createImageLink(src, href)
      {
         var image = DOM.img(
         {
            className: "imageBlock",
            src: src,
         });

         return DOM.a(
         {
            href: href,
            target: "_blank",
         }, image);
      }

      var valueFunctions = {
         "restrictionKeys": function(data)
         {
            return data.restrictionKeys.reduce(function(previousValue, restrictionKey, i)
            {
               var restriction = UpgradeRestriction.properties[restrictionKey];
               return previousValue + restriction.name + (i < data.restrictionKeys.length - 1 ? " " : "");
            }, "");
         },
         "headerKey": function(data)
         {
            var header = (data.headerKey !== undefined ? UpgradeHeader.properties[data.headerKey] : undefined);
            return (header !== undefined ? header.name : undefined);
         },
         "rangeKeys": function(data)
         {
            return data.rangeKeys.reduce(function(previousValue, rangeKey, i)
            {
               var range = Range.properties[rangeKey];
               return previousValue + range.name + (i < data.rangeKeys.length - 1 ? "-" : "");
            }, "");
         },
         "firingArcKey": function(data)
         {
            var firingArc = (data.firingArcKey !== undefined ? FiringArc.properties[data.firingArcKey] : undefined);
            return (firingArc !== undefined ? firingArc.name : undefined);
         },
      };

      var UpgradeTable = createReactClass(
      {
         contextTypes:
         {
            store: PropTypes.object.isRequired,
         },

         propTypes:
         {
            isFilterShown: PropTypes.bool.isRequired,
            filters: PropTypes.object.isRequired,
            rowData: PropTypes.array.isRequired,
         },

         render: function()
         {
            var filterShownButton = DOM.button(
            {
               onClick: this.toggleFilterShownActionPerformed,
            }, (this.props.isFilterShown ? "Hide Filter" : "Show Filter"));

            var myRowData = [];

            this.props.rowData.forEach(function(pilot)
            {
               if (pilot.fore || pilot.aft)
               {
                  myRowData.push(pilot.fore);
                  myRowData.push(pilot.aft);
               }
               else
               {
                  myRowData.push(pilot);
               }
            });

            var resourceBase = this.props.resourceBase;
            var cellFunctions = {
               "typeKey": function(data)
               {
                  return React.createElement(UpgradeTypeUI,
                  {
                     upgradeType: UpgradeType.properties[data.typeKey],
                     resourceBase: resourceBase,
                  });
               },
               "name": function(data)
               {
                  var src = resourceBase + "icon/Wikipedia16.png";
                  var searchString = data.name.replace(/ /g, "_");
                  var href = "http://xwing-miniatures.wikia.com/wiki/" + searchString;
                  var link = createImageLink(src, href);
                  return DOM.span(
                  {
                     className: "textImageLink",
                  }, data.name, link);
               },
               "isImplemented": function(data)
               {
                  return React.createElement(ImplementedImage,
                  {
                     resourceBase: resourceBase,
                     isImplemented: data.isImplemented,
                  });
               },
            };

            var table = React.createElement(DataTable,
            {
               columns: TableColumns,
               rowData: myRowData,
               cellFunctions: cellFunctions,
               valueFunctions: valueFunctions,
            });

            var rows = [];
            rows.push(DOM.tr(
            {
               key: rows.length,
               className: "alignLeft",
            }, DOM.td(
            {}, filterShownButton)));

            if (this.props.isFilterShown)
            {
               var filterUI = React.createElement(ReactRedux.Provider,
               {
                  store: this.context.store,
               }, React.createElement(FilterContainer,
               {
                  resourceBase: resourceBase,
               }));

               rows.push(DOM.tr(
               {
                  key: rows.length,
               }, DOM.td(
               {}, filterUI)));
            }

            rows.push(DOM.tr(
            {
               key: rows.length,
            }, DOM.td(
            {}, table)));

            return DOM.table(
            {}, DOM.tbody(
            {}, rows));
         },

         toggleFilterShownActionPerformed: function()
         {
            LOGGER.trace("UpgradeTable.toggleFilterShownActionPerformed() start");
            this.context.store.dispatch(Action.toggleFilterShown());
            LOGGER.trace("UpgradeTable.toggleFilterShownActionPerformed() end");
         },
      });

      return UpgradeTable;
   });
