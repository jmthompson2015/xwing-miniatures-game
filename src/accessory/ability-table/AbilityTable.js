import StringUtilities from "../../utility/StringUtilities.js";

import DamageCardTrait from "../../artifact/DamageCardTrait.js";
import Event from "../../artifact/Event.js";
import Faction from "../../artifact/Faction.js";
import Phase from "../../artifact/Phase.js";
import UpgradeType from "../../artifact/UpgradeType.js";

import Button from "../../view/Button.js";
import DataTable from "../../view/DataTable.js";
import FactionUI from "../../view/FactionUI.js";
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
   "name": function(data)
   {
      var answer = data.name;
      answer = answer.replace(/\"/, "");
      return answer;
   },
   "event": function(data)
   {
      if (data.event)
      {
         var key = data.event.substring(data.event.indexOf(".") + 1);

         if (data.event.startsWith("Event"))
         {
            var event = Event.properties[key];
            if (event === undefined)
            {
               LOGGER.warn("Missing event for key = " + key);
            }
            return "Event" + StringUtilities.pad(Event.keys().indexOf(event.key), 2);
         }
         else if (data.event.startsWith("Phase"))
         {
            var phase = Phase.properties[key];
            if (phase === undefined)
            {
               LOGGER.warn("Missing phase for key = " + key);
            }
            return "Phase" + StringUtilities.pad(Phase.keys().indexOf(phase.key), 2);
         }
      }
      else
      {
         return data.event;
      }
   },
};

var AbilityTable = createReactClass(
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
         "type": function(data)
         {
            var answer = data.type;
            if (DamageCardTrait.properties[data.type])
            {
               answer = DamageCardTrait.properties[data.type].name;
            }
            else if (Faction.properties[data.type])
            {
               answer = React.createElement(FactionUI,
               {
                  faction: Faction.properties[data.type],
                  isSmall: true,
                  resourceBase: resourceBase,
               });
            }
            else if (UpgradeType.properties[data.type])
            {
               answer = React.createElement(UpgradeTypeUI,
               {
                  upgradeType: UpgradeType.properties[data.type],
                  resourceBase: resourceBase,
               });
            }
            return answer;
         },
         "name": function(data)
         {
            var src = resourceBase + "icon/Wikipedia16.png";
            var searchString = data.name.replace(/ /g, "_");
            var href = "http://xwing-miniatures.wikia.com/wiki/" + searchString;
            var link = createImageLink(src, href);
            return ReactDOMFactories.span(
            {
               className: "textImageLink",
            }, data.name, link);
         },
         "description": function(data)
         {
            var answer;
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
         "event": function(data)
         {
            return data.event;
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
   },

   toggleFilterShownActionPerformed: function()
   {
      LOGGER.trace("AbilityTable.toggleFilterShownActionPerformed() start");
      this.context.store.dispatch(Action.toggleFilterShown());
      LOGGER.trace("AbilityTable.toggleFilterShownActionPerformed() end");
   },
});

export default AbilityTable;