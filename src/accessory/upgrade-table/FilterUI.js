import ArrayUtilities from "../../utility/ArrayUtilities.js";

import FiringArc from "../../artifact/FiringArc.js";
import Range from "../../artifact/Range.js";
import UpgradeHeader from "../../artifact/UpgradeHeader.js";
import UpgradeRestriction from "../../artifact/UpgradeRestriction.js";
import UpgradeType from "../../artifact/UpgradeType.js";

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
         typeValues: (this.props.filters.typeKey ? this.props.filters.typeKey.values() : []),
         waveValues: (this.props.filters.wave ? this.props.filters.wave.values() : []),
         restrictionValues: (this.props.filters.restrictionKeys ? this.props.filters.restrictionKeys.values() : []),
         headerValues: (this.props.filters.headerKey ? this.props.filters.headerKey.values() : []),
         isImplementedValues: (this.props.filters.isImplemented ? this.props.filters.isImplemented.values() : []),
         rangeValues: (this.props.filters.rangeKeys ? this.props.filters.rangeKeys.values() : []),
         firingArcValues: (this.props.filters.firingArcKey ? this.props.filters.firingArcKey.values() : []),
      };

      this.filterActionPerformed = this.filterActionPerformedFunction.bind(this);
      this.handleEntityChange = this.handleEntityChangeFunction.bind(this);
      this.restoreActionPerformed = this.restoreActionPerformedFunction.bind(this);
      this.unfilterActionPerformed = this.unfilterActionPerformedFunction.bind(this);
   }

   render()
   {
      const cells = [];
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

      const rows = [];
      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
      }, cells));

      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
      }, ReactDOMFactories.td(
      {
         colSpan: 6,
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
   const restoreButton = React.createElement(Button,
   {
      name: "Restore Defaults",
      onClick: this.restoreActionPerformed,
   });
   const unfilterButton = React.createElement(Button,
   {
      name: "Remove Filter",
      onClick: this.unfilterActionPerformed,
   });
   const filterButton = React.createElement(Button,
   {
      name: "Apply Filter",
      onClick: this.filterActionPerformed,
   });

   const cells = [];
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
   const row = ReactDOMFactories.tr(
   {}, cells);

   return ReactDOMFactories.table(
   {}, ReactDOMFactories.tbody(
   {}, row));
};

FilterUI.prototype.createEntityTable = function()
{
   const cells = [];

   DefaultFilters.entityColumns.forEach(function(column)
   {
      let values;
      let labelFunction;
      const clientProps = {};

      switch (column.key)
      {
         case "typeKey":
            values = UpgradeType.keys();
            labelFunction = function(value)
            {
               return UpgradeType.properties[value].name;
            };
            clientProps["data-entitytype"] = "typeKey";
            break;
         case "wave":
            values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "Aces"];
            clientProps["data-entitytype"] = "wave";
            break;
         case "restrictionKeys":
            values = UpgradeRestriction.keys();
            labelFunction = function(value)
            {
               return UpgradeRestriction.properties[value].name;
            };
            clientProps["data-entitytype"] = "restrictionKeys";
            break;
         case "headerKey":
            values = UpgradeHeader.keys();
            labelFunction = function(value)
            {
               return UpgradeHeader.properties[value].name;
            };
            clientProps["data-entitytype"] = "headerKey";
            break;
         case "isImplemented":
            values = [true, false];
            labelFunction = function(value)
            {
               return (value ? "true" : "false");
            };
            clientProps["data-entitytype"] = "isImplemented";
            break;
         case "rangeKeys":
            values = Range.keys();
            labelFunction = function(value)
            {
               return Range.properties[value].name;
            };
            clientProps["data-entitytype"] = "rangeKeys";
            break;
         case "firingArcKey":
            values = FiringArc.keys();
            labelFunction = function(value)
            {
               return FiringArc.properties[value].name;
            };
            clientProps["data-entitytype"] = "firingArcKey";
            break;
         default:
            throw "Unknown entity column: " + column.key;
      }

      const oldFilter = this.context.store.getState().filters[column.key];
      const initialValues = [];

      if (oldFilter)
      {
         ArrayUtilities.addAll(initialValues, oldFilter.values());
      }

      const label = ReactDOMFactories.span(
      {
         className: "entityLabel b f6",
      }, column.label);
      const checkboxPanel = React.createElement(InputPanel,
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

   const row = ReactDOMFactories.tr(
   {}, cells);

   return ReactDOMFactories.table(
   {
      className: "filtersUI f6 v-top",
   }, ReactDOMFactories.tbody(
   {}, row));
};

FilterUI.prototype.createRangeTable = function()
{
   const rows = [];

   DefaultFilters.rangeColumns.forEach(function(column)
   {
      const filter = this.props.filters[column.key];
      const cells = [];
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

   const filters = {};

   DefaultFilters.entityColumns.forEach(function(column)
   {
      const values = [];

      switch (column.key)
      {
         case "typeKey":
            ArrayUtilities.addAll(values, this.state.typeValues);
            break;
         case "wave":
            ArrayUtilities.addAll(values, this.state.waveValues);
            break;
         case "restrictionKeys":
            ArrayUtilities.addAll(values, this.state.restrictionValues);
            break;
         case "headerKey":
            ArrayUtilities.addAll(values, this.state.headerValues);
            break;
         case "isImplemented":
            ArrayUtilities.addAll(values, this.state.isImplementedValues);
            break;
         case "rangeKeys":
            ArrayUtilities.addAll(values, this.state.rangeValues);
            break;
         case "firingArcKey":
            ArrayUtilities.addAll(values, this.state.firingArcValues);
            break;
         default:
            throw "Unknown entity column: " + column.key;
      }

      const filter = new EntityFilter(column.key, values);
      filters[column.key] = filter;
   }, this);

   DefaultFilters.rangeColumns.forEach(function(column)
   {
      const isMinEnabled = document.getElementById(column.key + "MinChecked").checked;
      const minValue = document.getElementById(column.key + "Min").value;
      const isMaxEnabled = document.getElementById(column.key + "MaxChecked").checked;
      const maxValue = document.getElementById(column.key + "Max").value;

      const filter = new RangeFilter(column.key, isMinEnabled, minValue, isMaxEnabled, maxValue);
      filters[column.key] = filter;
   });

   this.context.store.dispatch(Action.setFilters(filters));

   LOGGER.trace("FilterUI.filterActionPerformed() end");
};

FilterUI.prototype.handleEntityChangeFunction = function(event, selected)
{
   LOGGER.trace("FilterUI.handleEntityChange() start");

   const entityType = event.target.dataset.entitytype;
   LOGGER.debug("entityType = " + entityType);
   const values = [];
   ArrayUtilities.addAll(values, selected);

   switch (entityType)
   {
      case "typeKey":
         this.setState(
         {
            typeValues: values,
         });
         break;
      case "wave":
         this.setState(
         {
            waveValues: values,
         });
         break;
      case "restrictionKeys":
         this.setState(
         {
            restrictionValues: values,
         });
         break;
      case "headerKey":
         this.setState(
         {
            headerValues: values,
         });
         break;
      case "isImplemented":
         this.setState(
         {
            isImplementedValues: values,
         });
         break;
      case "rangeKeys":
         this.setState(
         {
            rangeValues: values,
         });
         break;
      case "firingArcKey":
         this.setState(
         {
            firingArcValues: values,
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