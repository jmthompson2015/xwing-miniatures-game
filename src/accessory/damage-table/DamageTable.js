import DamageCardTrait from "../../artifact/DamageCardTrait.js";

import Button from "../../view/Button.js";
import DataTable from "../../view/DataTable.js";
import ImplementedImage from "../../view/ImplementedImage.js";

import Action from "./Action.js";
import FilterContainer from "./FilterContainer.js";
import TableColumns from "./TableColumns.js";

function createImageLink(src, href)
{
   var image = ReactDOMFactories.img(
   {
      className: "imageBlock",
      src: src,
   });

   return ReactDOMFactories.a(
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
      var filterShownButton = React.createElement(Button,
      {
         name: (this.props.isFilterShown ? "Hide Filter" : "Show Filter"),
         onClick: this.toggleFilterShownActionPerformed,
      });

      var myRowData = this.props.rowData;
      var resourceBase = this.props.resourceBase;
      var cellFunctions = {
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
         "action": function(data)
         {
            return ReactDOMFactories.span(
            {
               dangerouslySetInnerHTML:
               {
                  __html: data.action,
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
         resourceBase: resourceBase,
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
   },

   toggleFilterShownActionPerformed: function()
   {
      LOGGER.trace("DamageTable.toggleFilterShownActionPerformed() start");
      this.context.store.dispatch(Action.toggleFilterShown());
      LOGGER.trace("DamageTable.toggleFilterShownActionPerformed() end");
   },
});

export default DamageTable;