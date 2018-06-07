import DamageCardTrait from "../../artifact/DamageCardTrait.js";

import Button from "../../view/Button.js";
import DataTable from "../../view/DataTable.js";
import ImplementedImage from "../../view/ImplementedImage.js";

import Action from "./Action.js";
import FilterContainer from "./FilterContainer.js";
import TableColumns from "./TableColumns.js";

function createImageLink(src, href)
{
   const image = ReactDOMFactories.img(
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

const valueFunctions = {
   "trait": function(data)
   {
      const trait = DamageCardTrait.properties[data.trait];
      return (trait !== undefined ? trait.name : undefined);
   },
};

class DamageTable extends React.Component
{
   constructor(props)
   {
      super(props);

      this.toggleFilterShownActionPerformed = this.toggleFilterShownActionPerformedFunction.bind(this);
   }

   render()
   {
      const filterShownButton = React.createElement(Button,
      {
         name: (this.props.isFilterShown ? "Hide Filter" : "Show Filter"),
         onClick: this.toggleFilterShownActionPerformed,
      });

      const myRowData = this.props.rowData;
      const resourceBase = this.props.resourceBase;
      const cellFunctions = {
         "name": function(data)
         {
            const src = resourceBase + "icon/Wikipedia16.png";
            const searchString = data.name.replace(/ /g, "_");
            const href = "http://xwing-miniatures.wikia.com/wiki/" + searchString;
            const link = createImageLink(src, href);
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

      const table = React.createElement(DataTable,
      {
         columns: TableColumns,
         rowData: myRowData,
         cellFunctions: cellFunctions,
         resourceBase: resourceBase,
         valueFunctions: valueFunctions,
      });

      const rows = [];
      rows.push(ReactDOMFactories.tr(
      {
         key: rows.length,
         className: "alignLeft tl",
      }, ReactDOMFactories.td(
      {}, filterShownButton)));

      if (this.props.isFilterShown)
      {
         const filterUI = React.createElement(ReactRedux.Provider,
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

DamageTable.prototype.toggleFilterShownActionPerformedFunction = function()
{
   LOGGER.trace("DamageTable.toggleFilterShownActionPerformed() start");
   this.context.store.dispatch(Action.toggleFilterShown());
   LOGGER.trace("DamageTable.toggleFilterShownActionPerformed() end");
};

DamageTable.contextTypes = {
   store: PropTypes.object.isRequired,
};

DamageTable.propTypes = {
   isFilterShown: PropTypes.bool.isRequired,
   filters: PropTypes.object.isRequired,
   rowData: PropTypes.array.isRequired,
};

export default DamageTable;