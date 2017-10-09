"use strict";

define(["create-react-class", "prop-types", "react", "react-dom-factories",
  "model/js/EntityFilter", "model/js/RangeFilter", "view/js/Button", "view/js/InputPanel",
  "accessory/ability-table/Action", "accessory/ability-table/DefaultFilters", "accessory/ability-table/EventComparator"],
   function(createReactClass, PropTypes, React, DOM, EntityFilter, RangeFilter, Button, InputPanel, Action, DefaultFilters, EventComparator)
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
               deckValues: (this.props.filters.deck ? this.props.filters.deck.values() : []),
               typeValues: (this.props.filters.type ? this.props.filters.type.values() : []),
               isImplementedValues: (this.props.filters.isImplemented ? this.props.filters.isImplemented.values() : []),
               eventValues: (this.props.filters.event ? this.props.filters.event.values() : []),
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
               className: "filtersUI f6 v-top",
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
               colSpan: 4,
            }, this.createButtonTable())));

            return DOM.table(
            {
               className: "filtersUI f6 v-top",
            }, DOM.tbody(
            {}, rows));
         },

         createButtonTable: function()
         {
            var restoreButton = React.createElement(Button,
            {
               name: "Restore Defaults",
               onClick: this.restoreActionPerformed,
            });
            var unfilterButton = React.createElement(Button,
            {
               name: "Remove Filter",
               onClick: this.unfilterActionPerformed,
            });
            var filterButton = React.createElement(Button,
            {
               name: "Apply Filter",
               onClick: this.filterActionPerformed,
            });

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
               clientProps["data-entitytype"] = column.key;

               switch (column.key)
               {
                  case "deck":
                     values = ["DamageCard", "PilotCard", "UpgradeCard"];
                     break;
                  case "type":
                     values = [];
                     this.context.store.getState().tableRows.forEach(function(tableRows)
                     {
                        if (tableRows.type && !values.includes(tableRows.type))
                        {
                           values.push(tableRows.type);
                        }
                     });
                     values.sort();
                     break;
                  case "isImplemented":
                     values = [true, false];
                     labelFunction = function(value)
                     {
                        return (value ? "true" : "false");
                     };
                     break;
                  case "event":
                     values = [];
                     this.context.store.getState().tableRows.forEach(function(tableRows)
                     {
                        if (tableRows.event && !values.includes(tableRows.event))
                        {
                           values.push(tableRows.event);
                        }
                     });
                     values.sort(EventComparator);
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
                  className: "entityLabel b f6",
               }, column.label);
               var checkboxPanel = React.createElement(InputPanel,
               {
                  type: InputPanel.Type.CHECKBOX,
                  values: values,
                  labelFunction: labelFunction,
                  initialValues: initialValues,
                  onChange: this.handleEntityChange,
                  panelClass: "entitiesTable bg-white f7 tl",
                  clientProps: clientProps,
               });

               cells.push(DOM.td(
               {
                  key: cells.length,
                  className: "entityFilterContainer pl1 v-top",
               }, label, DOM.div(
               {
                  className: "entitiesContainer overflow-y-auto pl1",
               }, checkboxPanel)));
            }, this);

            var row = DOM.tr(
            {}, cells);

            return DOM.table(
            {
               className: "filtersUI f6 v-top",
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
                  className: "striped--light-gray",
               }, cells));
            }, this);

            return DOM.table(
            {
               className: "filterTable bg-white",
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
                  case "deck":
                     values.xwingAddAll(this.state.deckValues);
                     break;
                  case "type":
                     values.xwingAddAll(this.state.typeValues);
                     break;
                  case "isImplemented":
                     values.xwingAddAll(this.state.isImplementedValues);
                     break;
                  case "event":
                     values.xwingAddAll(this.state.eventValues);
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
               case "deck":
                  this.setState(
                  {
                     deckValues: values,
                  });
                  break;
               case "type":
                  this.setState(
                  {
                     typeValues: values,
                  });
                  break;
               case "isImplemented":
                  this.setState(
                  {
                     isImplementedValues: values,
                  });
                  break;
               case "event":
                  this.setState(
                  {
                     eventValues: values,
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
