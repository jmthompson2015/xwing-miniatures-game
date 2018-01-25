"use strict";

define(["create-react-class", "prop-types", "react-dom-factories",
  "artifact/js/Bearing", "artifact/js/Difficulty", "artifact/js/Maneuver", "view/js/HtmlUtilities"],
   function(createReactClass, PropTypes, DOM, Bearing, Difficulty, Maneuver, HtmlUtilities)
   {
      var ManeuverChooser = createReactClass(
      {
         propTypes:
         {
            resourceBase: PropTypes.string.isRequired,
            shipName: PropTypes.string.isRequired,
            maneuvers: PropTypes.array.isRequired,

            callback: PropTypes.func,
            isEditable: PropTypes.bool, // default: true
            pilotName: PropTypes.string,
            tokenId: PropTypes.number,
         },

         getInitialState: function()
         {
            return (
            {
               element: undefined,
            });
         },

         render: function()
         {
            var isEditable = (this.props.isEditable !== undefined ? this.props.isEditable : true);
            var pilotName = this.props.pilotName;
            var shipName = this.props.shipName;
            var maneuvers = this.props.maneuvers;
            var tokenId = this.props.tokenId;
            var minSpeed = this.getMinimumSpeed(maneuvers);
            var maxSpeed = this.getMaximumSpeed(maneuvers);
            var bearingValues = Bearing.keys();
            var bearingKeys = maneuvers.map(function(maneuver)
            {
               return maneuver.bearingKey;
            });
            var self = this;

            var rows = [];
            var cell;

            if (pilotName)
            {
               cell = DOM.td(
               {
                  colSpan: bearingValues.length + 1,
               }, pilotName);
               rows.push(DOM.tr(
               {
                  key: rows.length,
                  className: "pilotName bg-xw-light black f6",
                  id: "pilotName",
               }, cell));
            }

            if (shipName)
            {
               cell = DOM.td(
               {
                  colSpan: bearingValues.length + 1,
               }, shipName);
               rows.push(DOM.tr(
               {
                  key: rows.length,
                  className: "shipName bg-xw-light black f6",
                  id: "shipName",
               }, cell));
            }

            var maneuver, difficultyKey, iconSrc, image;

            for (var speed = maxSpeed; speed >= minSpeed; speed--)
            {
               var cells = [];
               cells.push(DOM.td(
               {
                  key: cells.length,
                  className: "b--xw-medium",
               }, speed));

               if (speed === 0 && maneuvers.includes(Maneuver.properties[Maneuver.STATIONARY_0_HARD]))
               {
                  maneuver = Maneuver.properties[Maneuver.STATIONARY_0_HARD];
                  difficultyKey = maneuver.difficultyKey;
                  cells.push(DOM.td(
                  {
                     key: cells.length,
                     className: "b--xw-medium",
                  }, " "));
                  cells.push(DOM.td(
                  {
                     key: cells.length,
                     className: "b--xw-medium",
                  }, " "));
                  image = this.createManeuverIcon(undefined, speed, difficultyKey);
                  cells.push(DOM.td(
                  {
                     key: cells.length,
                     className: "b--xw-medium xw-min-w1-5",
                     onClick: (isEditable ? self.selectionChanged : undefined),
                     "data-tokenid": tokenId,
                     "data-maneuverkey": maneuver.key,
                  }, image));
                  cells.push(DOM.td(
                  {
                     key: cells.length,
                     className: "b--xw-medium",
                  }, " "));
                  cells.push(DOM.td(
                  {
                     key: cells.length,
                     className: "b--xw-medium",
                  }, " "));
               }
               else
               {
                  for (var i = 0; i < bearingValues.length; i++)
                  {
                     var bearingKey = bearingValues[i];

                     if (bearingKeys.includes(bearingKey))
                     {
                        maneuver = this.findManeuver(maneuvers, bearingKey, speed);

                        if (maneuver)
                        {
                           if (maneuver.energy !== undefined)
                           {
                              iconSrc = this.createManeuverEnergyIconSource(bearingKey, maneuver.energy);
                              image = DOM.img(
                              {
                                 src: iconSrc,
                              });
                           }
                           else
                           {
                              difficultyKey = maneuver.difficultyKey;
                              image = this.createManeuverIcon(bearingKey, speed, difficultyKey);
                           }

                           cells.push(DOM.td(
                           {
                              key: cells.length,
                              className: "b--xw-medium xw-min-w1-5",
                              onClick: (isEditable ? self.selectionChanged : undefined),
                              "data-tokenid": tokenId,
                              "data-maneuverkey": maneuver.key,
                           }, image));
                        }
                        else
                        {
                           cells.push(DOM.td(
                           {
                              key: cells.length,
                              className: "b--xw-medium xw-min-w1-5",
                           }, " "));
                        }
                     }
                  }
               }

               rows.push(DOM.tr(
               {
                  key: rows.length,
               }, cells));
            }

            return DOM.table(
            {
               className: "b--xw-medium bg-black center white",
            }, DOM.tbody(
            {}, rows));
         },

         createManeuverIcon: function(bearingKey, speed, difficultyKey)
         {
            var src;

            switch (bearingKey)
            {
               case Bearing.SEGNORS_LOOP_LEFT:
                  src = "sloopleft";
                  break;
               case Bearing.SEGNORS_LOOP_RIGHT:
                  src = "sloopright";
                  break;
               case Bearing.TALLON_ROLL_LEFT:
                  src = "trollleft";
                  break;
               case Bearing.TALLON_ROLL_RIGHT:
                  src = "trollright";
                  break;
               case undefined:
                  src = "stop";
                  break;
               default:
                  src = (speed === -1 ? "reverse" : "") + bearingKey.toLowerCase();
            }

            var className = "xw-f8";

            switch (difficultyKey)
            {
               case Difficulty.EASY:
                  className += " green";
                  break;
               case Difficulty.HARD:
                  className += " red";
                  break;
            }

            return DOM.span(
            {
               className: className,
            }, DOM.i(
            {
               className: "xwing-miniatures-font xwing-miniatures-font-" + src,
            }));
         },

         findManeuver: function(maneuvers, bearingKey, speed)
         {
            var answer;

            for (var i = 0; i < maneuvers.length; i++)
            {
               var maneuver = maneuvers[i];

               if (maneuver.bearingKey === bearingKey && maneuver.speed === speed)
               {
                  answer = maneuver;
                  break;
               }
            }

            return answer;
         },

         getMaximumSpeed: function(maneuvers)
         {
            var answer = -10000;

            for (var i = 0; i < maneuvers.length; i++)
            {
               var maneuver = maneuvers[i];
               var speed = maneuver.speed;
               answer = Math.max(speed, answer);
            }

            return answer;
         },

         getMinimumSpeed: function(maneuvers)
         {
            var answer = 10000;

            for (var i = 0; i < maneuvers.length; i++)
            {
               var maneuver = maneuvers[i];
               var speed = maneuver.speed;
               answer = Math.min(speed, answer);
            }

            return answer;
         },

         createManeuverEnergyIconSource: function(bearing, energy)
         {
            var bearingName = bearing.replace(/B/g, "_b");
            bearingName = bearingName.replace(/L/g, "_l");
            bearingName = bearingName.replace(/R/g, "_r");
            bearingName = bearingName.replace("straight", "huge_straight");

            return this.props.resourceBase + "maneuver/" + bearingName + "_" + energy + ".png";
         },

         selectionChanged: function(event)
         {
            var oldElement = this.state.element;

            if (oldElement)
            {
               HtmlUtilities.removeClass(oldElement, "bg-xw-medium");
            }

            var element = event.currentTarget;
            var tokenId = element.dataset.tokenid;
            var maneuverKey = element.dataset.maneuverkey;
            LOGGER.debug("selectionChanged() maneuverKey = " + maneuverKey);
            this.setState(
            {
               element: element,
            });
            HtmlUtilities.addClass(element, "bg-xw-medium");

            var callback = this.props.callback;

            if (callback)
            {
               callback(tokenId, maneuverKey);
            }
         },
      });

      return ManeuverChooser;
   });
