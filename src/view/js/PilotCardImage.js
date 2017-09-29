/*
 * see https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement
 */
"use strict";

define(["create-react-class", "prop-types", "react-dom-factories", "common/js/InputValidator", "artifact/js/Faction"],
   function(createClassReact, PropTypes, DOM, InputValidator, Faction)
   {
      var PilotCardImage = createClassReact(
      {
         propTypes:
         {
            pilot: PropTypes.object.isRequired,

            width: PropTypes.number,
         },

         render: function()
         {
            var pilot = this.props.pilot;
            var width = (this.props.width ? this.props.width : 200);
            var myLogLoadFailure = this.logLoadFailure;

            if (pilot.fore)
            {
               var src0 = this.createSrc(pilot.fore);
               var cell0 = DOM.img(
               {
                  crossOrigin: "anonymous",
                  onError: function()
                  {
                     myLogLoadFailure(src0);
                  },
                  src: src0,
                  title: pilot.fore.name,
                  width: width,
               });

               var src1 = this.createSrc(pilot.aft);
               var cell1 = DOM.img(
               {
                  crossOrigin: "anonymous",
                  onError: function()
                  {
                     myLogLoadFailure(src1);
                  },
                  src: src1,
                  title: pilot.aft.name,
                  width: width,
               });

               return DOM.span(
               {}, cell0, cell1);
            }
            else
            {
               var src = this.createSrc(pilot);

               return DOM.img(
               {
                  crossOrigin: "anonymous",
                  onError: function()
                  {
                     myLogLoadFailure(src);
                  },
                  src: src,
                  title: pilot.name,
                  width: width,
               });
            }
         },

         createSrc: function(pilot)
         {
            InputValidator.validateNotNull("pilot", pilot);

            var factionUrls = ["Galactic Empire/", "First Order/", "Rebel Alliance/", "Resistance/", "Scum and Villainy/"];
            var factionUrl = factionUrls[Faction.keys().indexOf(pilot.shipFaction.factionKey)];

            var shipUrl = pilot.shipFaction.ship.name + "/";
            shipUrl = shipUrl.replace("-Wing", "-wing");
            shipUrl = shipUrl.replace("TIE/", "TIE-");

            var pilotUrl = pilot.name;
            pilotUrl = pilotUrl.toLowerCase();
            pilotUrl = pilotUrl.replace(/\'/g, "-");
            pilotUrl = pilotUrl.replace(/\"/g, "");
            pilotUrl = pilotUrl.replace(/ /g, "-");
            pilotUrl = pilotUrl.replace("-(attack-shuttle)", "");
            pilotUrl = pilotUrl.replace("-(hotr)", "");
            pilotUrl = pilotUrl.replace("-(imperial)", "");
            pilotUrl = pilotUrl.replace("-(rebel)", "");
            pilotUrl = pilotUrl.replace("-(scum)", "");
            pilotUrl = pilotUrl.replace("-(vcx-100)", "");
            pilotUrl = pilotUrl.replace("black-eight-sq.-pilot", "black-eight-squadron-pilot");
            pilotUrl = pilotUrl.replace("cr90-corvette-(aft)", "cr90-corvette-aft");
            pilotUrl = pilotUrl.replace("cr90-corvette-(fore)", "cr90-corvette-fore");
            pilotUrl = pilotUrl.replace("nashtah-pup-pilot", "nashtah-pup");
            pilotUrl = pilotUrl.replace("raider-class-corvette-(aft)", "raider-class-corv-aft");
            pilotUrl = pilotUrl.replace("raider-class-corvette-(fore)", "raider-class-corv-fore");

            return PilotCardImage.BASE_URL + factionUrl + shipUrl + pilotUrl + ".png";
         },

         logLoadFailure: function(src)
         {
            var lastIndex = src.lastIndexOf("/");
            lastIndex = src.lastIndexOf("/", lastIndex - 1);
            var filename = src.substring(lastIndex + 1);
            LOGGER.error("PilotCardImage failed to load " + filename);
         },
      });

      PilotCardImage.BASE_URL = "https://rawgit.com/guidokessels/xwing-data/master/images/pilots/";

      return PilotCardImage;
   });
