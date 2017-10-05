"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories", "artifact/js/Faction", "model/js/EntityFilter", "model/js/RangeFilter", "view/js/InputPanel",
  "accessory/squad-table/Action", "accessory/squad-table/DefaultFilters"],
   function(createReactClass, PropTypes, React, DOM, Faction, EntityFilter, RangeFilter, InputPanel, Action, DefaultFilters)
   {
      var FilterUI = createReactClass(
      {
         contextTypes:
         {
            store: PropTypes.object.isRequired,
         },

         propTypes:
         {
            filters: PropTypes.object.isRequired,
         },

         getInitialState: function()
         {
            return (
            {
               factionValues: (this.props.filters.factionKey ? this.props.filters.factionKey.values() : []),
            });
         },

         render: function()
         {
            var cells = [];
            cells.push(DOM.td(
            {
               key: cells.length,
               className: "filterTable",
            }, this.createRangeTable()));
            cells.push(DOM.td(
            {
               key: cells.length,
               className: "filtersUI",
            }, this.createEntityTable()));

            var rows = [];
            rows.push(DOM.tr(
            {
               key: rows.length,
            }, cells));

            rows.push(DOM.tr(
            {
               key: rows.length,
            }, DOM.td(
            {
               colSpan: 2,
            }, this.createButtonTable())));

            return DOM.table(
            {
               className: "filtersUI",
            }, DOM.tbody(
            {}, rows));
         },

         createButtonTable: function()
         {
            var restoreButton = DOM.button(
            {
               onClick: this.restoreActionPerformed,
            }, "Restore Defaults");
            var unfilterButton = DOM.button(
            {
               onClick: this.unfilterActionPerformed,
            }, "Remove Filter");
            var filterButton = DOM.button(
            {
               onClick: this.filterActionPerformed,
            }, "Apply Filter");

            var cells = [];
            cells.push(DOM.td(
            {
               key: cells.length,
            }, restoreButton));
            cells.push(DOM.td(
            {
               key: cells.length,
            }, unfilterButton));
            cells.push(DOM.td(
            {
               key: cells.length,
            }, filterButton));
            var row = DOM.tr(
            {}, cells);

            return DOM.table(
            {}, DOM.tbody(
            {}, row));
         },

         createEntityTable: function()
         {
            var cells = [];

            DefaultFilters.entityColumns.forEach(function(column)
            {
               var values;
               var labelFunction;
               var clientProps = {};

               switch (column.key)
               {
                  case "factionKey":
                     values = Faction.keys();
                     labelFunction = function(value)
                     {
                        return Faction.properties[value].name;
                     };
                     clientProps["data-entitytype"] = "factionKey";
                     break;
                  default:
                     throw "Unknown entity column: " + column.key;
               }

               var oldFilter = this.context.store.getState().filters[column.key];
               var initialValues = [];

               if (oldFilter)
               {
                  initialValues.xwingAddAll(oldFilter.values());
               }

               var label = DOM.span(
               {
                  className: "entityLabel",
               }, column.label);
               var checkboxPanel = React.createElement(InputPanel,
               {
                  type: InputPanel.Type.CHECKBOX,
                  values: values,
                  labelFunction: labelFunction,
                  initialValues: initialValues,
                  onChange: this.handleEntityChange,
                  panelClass: "entitiesTable",
                  clientProps: clientProps,
               });

               cells.push(DOM.td(
               {
                  key: cells.length,
                  className: "entityFilterContainer",
               }, label, DOM.div(
               {
                  className: "entitiesContainer",
               }, checkboxPanel)));
            }, this);

            var row = DOM.tr(
            {}, cells);

            return DOM.table(
            {
               className: "filtersUI",
            }, DOM.tbody(
            {}, row));
         },

         createRangeTable: function()
         {
            var rows = [];

            DefaultFilters.rangeColumns.forEach(function(column)
            {
               var filter = this.props.filters[column.key];
               var cells = [];
               cells.push(DOM.td(
               {
                  key: cells.length,
               }, DOM.input(
               {
                  id: column.key + "MinChecked",
                  type: "checkbox",
                  defaultChecked: (filter ? filter.isMinEnabled() : false),
                  onChange: this.handleRangeChange,
               })));
               cells.push(DOM.td(
               {
                  key: cells.length,
               }, DOM.input(
               {
                  id: column.key + "Min",
                  type: "number",
                  className: "filterField",
                  defaultValue: (filter ? filter.minValue() : 0),
                  onChange: this.handleRangeChange,
               })));
               cells.push(DOM.td(
               {
                  key: cells.length,
               }, "\u2264 " + column.label + " \u2264"));
               cells.push(DOM.td(
               {
                  key: cells.length,
               }, DOM.input(
               {
                  id: column.key + "MaxChecked",
                  type: "checkbox",
                  defaultChecked: (filter ? filter.isMaxEnabled() : false),
                  onChange: this.handleRangeChange,
               })));
               cells.push(DOM.td(
               {
                  key: cells.length,
               }, DOM.input(
               {
                  id: column.key + "Max",
                  type: "number",
                  className: "filterField",
                  defaultValue: (filter ? filter.maxValue() : 10),
                  onChange: this.handleRangeChange,
               })));

               rows.push(DOM.tr(
               {
                  key: rows.length,
               }, cells));
            }, this);

            return DOM.table(
            {
               className: "filterTable",
            }, DOM.tbody(
            {}, rows));
         },

         filterActionPerformed: function()
         {
            LOGGER.trace("FilterUI.filterActionPerformed() start");

            var filters = {};

            DefaultFilters.entityColumns.forEach(function(column)
            {
               var values = [];

               switch (column.key)
               {
                  case "factionKey":
                     values.xwingAddAll(this.state.factionValues);
                     break;
                  default:
                     throw "Unknown entity column: " + column.key;
               }

               var filter = new EntityFilter(column.key, values);
               filters[column.key] = filter;
            }, this);

            DefaultFilters.rangeColumns.forEach(function(column)
            {
               var isMinEnabled = document.getElementById(column.key + "MinChecked").checked;
               var minValue = document.getElementById(column.key + "Min").value;
               var isMaxEnabled = document.getElementById(column.key + "MaxChecked").checked;
               var maxValue = document.getElementById(column.key + "Max").value;

               var filter = new RangeFilter(column.key, isMinEnabled, minValue, isMaxEnabled, maxValue);
               filters[column.key] = filter;
            });

            this.context.store.dispatch(Action.setFilters(filters));

            LOGGER.trace("FilterUI.filterActionPerformed() end");
         },

         handleEntityChange: function(event, selected)
         {
            LOGGER.trace("FilterUI.handleEntityChange() start");

            var entityType = event.target.dataset.entitytype;
            LOGGER.debug("entityType = " + entityType);
            var values = [];
            values.xwingAddAll(selected);

            switch (entityType)
            {
               case "factionKey":
                  this.setState(
                  {
                     factionValues: values,
                  });
                  break;
               default:
                  throw "Unknown entityType: " + entityType;
            }

            LOGGER.trace("FilterUI.handleEntityChange() end");
         },

         restoreActionPerformed: function()
         {
            LOGGER.trace("FilterUI.restoreActionPerformed() start");
            this.context.store.dispatch(Action.setDefaultFilters());
            LOGGER.trace("FilterUI.restoreActionPerformed() end");
         },

         unfilterActionPerformed: function()
         {
            LOGGER.trace("FilterUI.unfilterActionPerformed() start");
            this.context.store.dispatch(Action.removeFilters());
            LOGGER.trace("FilterUI.unfilterActionPerformed() end");
         },
      });

      return FilterUI;
   });
