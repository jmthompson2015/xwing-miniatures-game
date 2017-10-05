"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "react-redux", "common/js/MathAugments",
  "artifact/js/DamageCardTrait", "view/js/DataTable", "view/js/ImplementedImage",
  "accessory/damage-table/Action", "accessory/damage-table/FilterContainer", "accessory/damage-table/TableColumns"],
   function(createReactClass, PropTypes, React, DOM, ReactRedux, MathAugments,
      DamageCardTrait, DataTable, ImplementedImage, Action, FilterContainer, TableColumns)
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
         "trait": function(data)
         {
            var trait = DamageCardTrait.properties[data.trait];
            return (trait !== undefined ? trait.name : undefined);
         },
      };

      var DamageTable = createReactClass(
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
               resourceBase: resourceBase,
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
            LOGGER.trace("DamageTable.toggleFilterShownActionPerformed() start");
            this.context.store.dispatch(Action.toggleFilterShown());
            LOGGER.trace("DamageTable.toggleFilterShownActionPerformed() end");
         },
      });

      return DamageTable;
   });
