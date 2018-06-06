import ArrayUtilities from "../../utility/ArrayUtilities.js";

import Faction from "../../artifact/Faction.js";
import Ship from "../../artifact/Ship.js";

import EntityFilter from "../../model/EntityFilter.js";
import RangeFilter from "../../model/RangeFilter.js";

import Button from "../../view/Button.js";
import InputPanel from "../../view/InputPanel.js";

import Action from "./Action.js";
import DefaultFilters from "./DefaultFilters.js";

class FilterUI extends React.Component
{
   constructor(props)
   {
      super(props);

      this.state = {
         factionValues: (this.props.filters.factionKey ? this.props.filters.factionKey.values() : []),
         shipValues: (this.props.filters.shipKey ? this.props.filters.shipKey.values() : []),
         waveValues: (this.props.filters.wave ? this.props.filters.wave.values() : []),
         isImplementedValues: (this.props.filters.isImplemented ? this.props.filters.isImplemented.values() : []),
      };

      this.filterActionPerformed = this.filterActionPerformedFunction.bind(this);
      this.handleEntityChange = this.handleEntityChangeFunction.bind(this);
      this.restoreActionPerformed = this.restoreActionPerformedFunction.bind(this);
      this.unfilterActionPerformed = this.unfilterActionPerformedFunction.bind(this);
   }

   render()
   {
      var cells = [];
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
         className: "filterTable",
      }, this.createRangeTable()));
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
         className: "filtersUI f6 v-top",
      }, this.createEntityTable()));

      var rows = [];
      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
      }, cells));

      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
      }, ReactDOMFactories.td(
      {
         colSpan: 5,
      }, this.createButtonTable())));

      return ReactDOMFactories.table(
      {
         className: "filtersUI f6 v-top",
      }, ReactDOMFactories.tbody(
      {}, rows));
   }
}

FilterUI.prototype.createButtonTable = function()
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
   cells.push(ReactDOMFactories.td(
   {
      key: cells.length,
   }, restoreButton));
   cells.push(ReactDOMFactories.td(
   {
      key: cells.length,
   }, unfilterButton));
   cells.push(ReactDOMFactories.td(
   {
      key: cells.length,
   }, filterButton));
   var row = ReactDOMFactories.tr(
   {}, cells);

   return ReactDOMFactories.table(
   {}, ReactDOMFactories.tbody(
   {}, row));
};

FilterUI.prototype.createEntityTable = function()
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
         case "shipKey":
            values = Ship.keys();
            labelFunction = function(value)
            {
               return Ship.properties[value].name;
            };
            clientProps["data-entitytype"] = "shipKey";
            break;
         case "wave":
            values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "Aces", "Huge"];
            clientProps["data-entitytype"] = "wave";
            break;
         case "isImplemented":
            values = [true, false];
            labelFunction = function(value)
            {
               return (value ? "true" : "false");
            };
            clientProps["data-entitytype"] = "isImplemented";
            break;
         default:
            throw "Unknown entity column: " + column.key;
      }

      var oldFilter = this.context.store.getState().filters[column.key];
      var initialValues = [];

      if (oldFilter)
      {
         ArrayUtilities.addAll(initialValues, oldFilter.values());
      }

      var label = ReactDOMFactories.span(
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

      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
         className: "entityFilterContainer pl1 v-top",
      }, label, ReactDOMFactories.div(
      {
         className: "entitiesContainer overflow-y-auto pl1",
      }, checkboxPanel)));
   }, this);

   var row = ReactDOMFactories.tr(
   {}, cells);

   return ReactDOMFactories.table(
   {
      className: "filtersUI f6 v-top",
   }, ReactDOMFactories.tbody(
   {}, row));
};

FilterUI.prototype.createRangeTable = function()
{
   var rows = [];

   DefaultFilters.rangeColumns.forEach(function(column)
   {
      var filter = this.props.filters[column.key];
      var cells = [];
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
      }, ReactDOMFactories.input(
      {
         id: column.key + "MinChecked",
         type: "checkbox",
         defaultChecked: (filter ? filter.isMinEnabled() : false),
         onChange: this.handleRangeChange,
      })));
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
      }, ReactDOMFactories.input(
      {
         id: column.key + "Min",
         type: "number",
         className: "filterField",
         defaultValue: (filter ? filter.minValue() : 0),
         onChange: this.handleRangeChange,
      })));
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
      }, "\u2264 " + column.label + " \u2264"));
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
      }, ReactDOMFactories.input(
      {
         id: column.key + "MaxChecked",
         type: "checkbox",
         defaultChecked: (filter ? filter.isMaxEnabled() : false),
         onChange: this.handleRangeChange,
      })));
      cells.push(ReactDOMFactories.td(
      {
         key: cells.length,
      }, ReactDOMFactories.input(
      {
         id: column.key + "Max",
         type: "number",
         className: "filterField",
         defaultValue: (filter ? filter.maxValue() : 10),
         onChange: this.handleRangeChange,
      })));

      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
         className: "striped--light-gray",
      }, cells));
   }, this);

   return ReactDOMFactories.table(
   {
      className: "filterTable bg-white",
   }, ReactDOMFactories.tbody(
   {}, rows));
};

FilterUI.prototype.filterActionPerformedFunction = function()
{
   LOGGER.trace("FilterUI.filterActionPerformed() start");

   var filters = {};

   DefaultFilters.entityColumns.forEach(function(column)
   {
      var values = [];

      switch (column.key)
      {
         case "factionKey":
            ArrayUtilities.addAll(values, this.state.factionValues);
            break;
         case "shipKey":
            ArrayUtilities.addAll(values, this.state.shipValues);
            break;
         case "wave":
            ArrayUtilities.addAll(values, this.state.waveValues);
            break;
         case "isImplemented":
            ArrayUtilities.addAll(values, this.state.isImplementedValues);
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
};

FilterUI.prototype.handleEntityChangeFunction = function(event, selected)
{
   LOGGER.trace("FilterUI.handleEntityChange() start");

   var entityType = event.target.dataset.entitytype;
   LOGGER.debug("entityType = " + entityType);
   var values = [];
   ArrayUtilities.addAll(values, selected);

   switch (entityType)
   {
      case "factionKey":
         this.setState(
         {
            factionValues: values,
         });
         break;
      case "shipKey":
         this.setState(
         {
            shipValues: values,
         });
         break;
      case "wave":
         this.setState(
         {
            waveValues: values,
         });
         break;
      case "isImplemented":
         this.setState(
         {
            isImplementedValues: values,
         });
         break;
      default:
         throw "Unknown entityType: " + entityType;
   }

   LOGGER.trace("FilterUI.handleEntityChange() end");
};

FilterUI.prototype.restoreActionPerformedFunction = function()
{
   LOGGER.trace("FilterUI.restoreActionPerformed() start");
   this.context.store.dispatch(Action.setDefaultFilters());
   LOGGER.trace("FilterUI.restoreActionPerformed() end");
};

FilterUI.prototype.unfilterActionPerformedFunction = function()
{
   LOGGER.trace("FilterUI.unfilterActionPerformed() start");
   this.context.store.dispatch(Action.removeFilters());
   LOGGER.trace("FilterUI.unfilterActionPerformed() end");
};

FilterUI.contextTypes = {
   store: PropTypes.object.isRequired,
};

FilterUI.propTypes = {
   filters: PropTypes.object.isRequired,
};

export default FilterUI;