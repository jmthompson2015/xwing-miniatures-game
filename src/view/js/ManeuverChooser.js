"use strict";

define(["create-react-class", "prop-types", "react-dom-factories",
  "artifact/js/Bearing", "artifact/js/Maneuver", "view/js/HtmlUtilities"],
   function(createReactClass, PropTypes, DOM, Bearing, Maneuver, HtmlUtilities)
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

            var maneuver, difficulty, iconSrc, image;

            for (var speed = maxSpeed; speed >= minSpeed; speed--)
            {
               var cells = [];
               cells.push(DOM.td(
               {
                  key: cells.length,
                  className: "maneuverCell b--xw-medium",
               }, speed));

               if (speed === 0)
               {
                  maneuver = Maneuver.properties[Maneuver.STATIONARY_0_HARD];
                  difficulty = maneuver.difficultyKey;
                  iconSrc = this.createManeuverIconSource(undefined, difficulty);
                  cells.push(DOM.td(
                  {
                     key: cells.length,
                     className: "maneuverCell b--xw-medium",
                  }, " "));
                  cells.push(DOM.td(
                  {
                     key: cells.length,
                     className: "maneuverCell b--xw-medium",
                  }, " "));
                  image = DOM.img(
                  {
                     src: iconSrc,
                  });
                  cells.push(DOM.td(
                  {
                     key: cells.length,
                     className: "maneuverCell b--xw-medium xw-min-w1-5",
                     onClick: (isEditable ? self.selectionChanged : undefined),
                     "data-tokenid": tokenId,
                     "data-maneuverkey": maneuver.key,
                  }, image));
                  cells.push(DOM.td(
                  {
                     key: cells.length,
                     className: "maneuverCell b--xw-medium",
                  }, " "));
                  cells.push(DOM.td(
                  {
                     key: cells.length,
                     className: "maneuverCell b--xw-medium",
                  }, " "));
               }
               else
               {
                  for (var i = 0; i < bearingValues.length; i++)
                  {
                     var bearing = bearingValues[i];

                     if (bearingKeys.includes(bearing))
                     {
                        maneuver = this.findManeuver(maneuvers, bearing, speed);

                        if (maneuver)
                        {
                           if (maneuver.energy !== undefined)
                           {
                              iconSrc = this.createManeuverEnergyIconSource(bearing, maneuver.energy);
                           }
                           else
                           {
                              difficulty = maneuver.difficultyKey;
                              iconSrc = this.createManeuverIconSource(bearing, difficulty);
                           }

                           image = DOM.img(
                           {
                              src: iconSrc,
                           });
                           cells.push(DOM.td(
                           {
                              key: cells.length,
                              className: "maneuverCell b--xw-medium xw-min-w1-5",
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
                              className: "maneuverCell b--xw-medium xw-min-w1-5",
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
               className: "maneuverTable b--xw-medium bg-black center white",
            }, DOM.tbody(
            {}, rows));
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

         createManeuverIconSource: function(bearing, difficulty)
         {
            var answer;

            if (bearing)
            {
               var bearingName = bearing.replace(/L/g, "_l");
               bearingName = bearingName.replace(/R/g, "_r");
               bearingName = bearingName.replace("kTurn", "koiogran_turn");
               answer = this.props.resourceBase + "maneuver/" + bearingName + "_" + difficulty + "16.png";
            }
            else
            {
               answer = this.props.resourceBase + "maneuver/stationary_" + difficulty + "16.png";
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
