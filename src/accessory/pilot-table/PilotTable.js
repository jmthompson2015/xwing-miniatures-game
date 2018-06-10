import MathUtilities from "../../utility/MathUtilities.js";

import Faction from "../../artifact/Faction.js";
import Ship from "../../artifact/Ship.js";

import Button from "../../view/Button.js";
import DataTable from "../../view/DataTable.js";
import FactionUI from "../../view/FactionUI.js";
import ImplementedImage from "../../view/ImplementedImage.js";
import ShipSilhouetteUI from "../../view/ShipSilhouetteUI.js";

import Action from "./Action.js";
import FilterContainer from "./FilterContainer.js";
import TableColumns from "./TableColumns.js";

function createImageLink(src, href)
{
   const image = ReactDOMFactories.img(
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

class PilotTable extends React.Component
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
         "factionKey": function(data)
         {
            const faction = Faction.properties[data.factionKey];
            return React.createElement(FactionUI,
            {
               faction: faction,
               isSmall: true,
               resourceBase: resourceBase,
            });
         },
         "pilotName": function(data)
         {
            const src = resourceBase + "icon/Wikipedia16.png";
            let searchString = data.pilotName.replace(/ /g, "_");
            let href = "http://xwing-miniatures.wikia.com/wiki/" + searchString;
            const link = createImageLink(src, href);
            return ReactDOMFactories.span(
            {
               className: "textImageLink dib w-100",
            }, data.pilotName, link);
         },
         "shipKey": function(data)
         {
            const src = resourceBase + "icon/Wikipedia16.png";
            let href = data.shipWikiUrl;
            if (!href)
            {
               let searchString = data.shipName + "_Expansion_Pack";
               searchString = searchString.replace(/ /g, "_");
               href = "http://xwing-miniatures.wikia.com/wiki/" + searchString;
            }
            const link = createImageLink(src, href);
            const silhouette = React.createElement(ShipSilhouetteUI,
            {
               ship: Ship.properties[data.shipKey],
               resourceBase: resourceBase,
               showLabel: true,
            });
            return ReactDOMFactories.span(
            {
               className: "textImageLink dib w-100",
            }, silhouette, link);
         },
         "description": function(data)
         {
            let answer;
            if (data.isFlavorText)
            {
               answer = ReactDOMFactories.span(
               {
                  className: "flavorText i",
               }, data.description);
            }
            else
            {
               answer = ReactDOMFactories.span(
               {
                  dangerouslySetInnerHTML:
                  {
                     __html: data.description,
                  },
               });
            }
            return answer;
         },
         "isImplemented": function(data)
         {
            return React.createElement(ImplementedImage,
            {
               resourceBase: resourceBase,
               isImplemented: data.isImplemented,
            });
         },
         "ratioPrimaryWeaponAgility": function(data)
         {
            const value = data.ratioPrimaryWeaponAgility;
            return MathUtilities.format(value, 2);
         },
         "ratioSumStatsSquadPointCost": function(data)
         {
            const value = data.ratioSumStatsSquadPointCost;
            return MathUtilities.format(value, 4);
         },
      };

      const table = React.createElement(DataTable,
      {
         columns: TableColumns,
         rowData: myRowData,
         cellFunctions: cellFunctions,
         resourceBase: resourceBase,
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

PilotTable.prototype.toggleFilterShownActionPerformedFunction = function()
{
   LOGGER.trace("PilotTable.toggleFilterShownActionPerformed() start");
   this.context.store.dispatch(Action.toggleFilterShown());
   LOGGER.trace("PilotTable.toggleFilterShownActionPerformed() end");
};

PilotTable.contextTypes = {
   store: PropTypes.object.isRequired,
};

PilotTable.propTypes = {
   isFilterShown: PropTypes.bool.isRequired,
   filters: PropTypes.object.isRequired,
   rowData: PropTypes.array.isRequired,
};

export default PilotTable;