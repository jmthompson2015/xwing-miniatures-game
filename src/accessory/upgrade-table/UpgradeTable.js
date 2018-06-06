import FiringArc from "../../artifact/FiringArc.js";
import Range from "../../artifact/Range.js";
import UpgradeHeader from "../../artifact/UpgradeHeader.js";
import UpgradeRestriction from "../../artifact/UpgradeRestriction.js";
import UpgradeType from "../../artifact/UpgradeType.js";

import Button from "../../view/Button.js";
import DataTable from "../../view/DataTable.js";
import ImplementedImage from "../../view/ImplementedImage.js";
import UpgradeTypeUI from "../../view/UpgradeTypeUI.js";

import Action from "./Action.js";
import FilterContainer from "./FilterContainer.js";
import TableColumns from "./TableColumns.js";

function createImageLink(src, href)
{
   var image = ReactDOMFactories.img(
   {
      className: "imageBlock fr v-mid",
      src: src,
   });

   return ReactDOMFactories.a(
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

class UpgradeTable extends React.Component
{
   constructor(props)
   {
      super(props);

      this.toggleFilterShownActionPerformed = this.toggleFilterShownActionPerformedFunction.bind(this);
   }

   render()
   {
      var filterShownButton = React.createElement(Button,
      {
         name: (this.props.isFilterShown ? "Hide Filter" : "Show Filter"),
         onClick: this.toggleFilterShownActionPerformed,
      });

      var myRowData = this.props.rowData;
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
            return ReactDOMFactories.span(
            {
               className: "textImageLink dib w-100",
            }, data.name, link);
         },
         "description": function(data)
         {
            return ReactDOMFactories.span(
            {
               dangerouslySetInnerHTML:
               {
                  __html: data.description,
               },
            });
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
      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
         className: "alignLeft tl",
      }, ReactDOMFactories.td(
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

         rows.push(ReactDOMFactories.tr(
         {
            key: rows.length,
         }, ReactDOMFactories.td(
         {}, filterUI)));
      }

      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
      }, ReactDOMFactories.td(
      {}, table)));

      return ReactDOMFactories.table(
      {}, ReactDOMFactories.tbody(
      {}, rows));
   }
}

UpgradeTable.prototype.toggleFilterShownActionPerformedFunction = function()
{
   LOGGER.trace("UpgradeTable.toggleFilterShownActionPerformed() start");
   this.context.store.dispatch(Action.toggleFilterShown());
   LOGGER.trace("UpgradeTable.toggleFilterShownActionPerformed() end");
};

UpgradeTable.contextTypes = {
   store: PropTypes.object.isRequired,
};

UpgradeTable.propTypes = {
   isFilterShown: PropTypes.bool.isRequired,
   filters: PropTypes.object.isRequired,
   rowData: PropTypes.array.isRequired,
};

export default UpgradeTable;