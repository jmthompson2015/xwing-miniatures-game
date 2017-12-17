"use strict";

define(["common/js/InputValidator", "artifact/js/Faction", "artifact/js/PilotCard", "artifact/js/Ship", "artifact/js/ShipBase"],
   function(InputValidator, Faction, PilotCard, Ship, ShipBase)
   {
      function PilotCardSkillRestriction(pilotSkill)
      {
         InputValidator.validateNotNull("pilotSkill", pilotSkill);

         return (
         {
            name: "PilotCard Skill above \"" + pilotSkill + "\".",
            passes: function(pilotKey)
            {
               var pilot = PilotCard.properties[pilotKey];
               var myPilotCardSkill = pilot.pilotSkillValue;
               if (myPilotCardSkill === undefined && pilot.fore)
               {
                  myPilotCardSkill = pilot.fore.pilotSkillValue;
               }
               if (myPilotCardSkill === undefined)
               {
                  myPilotCardSkill = pilot.shipFaction.ship.pilotSkillValue;
               }
               if (myPilotCardSkill === undefined && pilot.shipFaction.ship.fore)
               {
                  myPilotCardSkill = pilot.shipFaction.ship.fore.pilotSkillValue;
               }
               return myPilotCardSkill > pilotSkill;
            }
         });
      }

      function ShipSizeRestriction(shipBaseKey)
      {
         InputValidator.validateNotNull("shipBaseKey", shipBaseKey);

         var props = ShipBase.properties[shipBaseKey];

         return (
         {
            name: props.name + " only.",
            passes: function(pilotKey)
            {
               var pilot = PilotCard.properties[pilotKey];
               var myShipBaseKey = pilot.shipFaction.ship.shipBaseKey;
               return myShipBaseKey === shipBaseKey;
            }
         });
      }

      function ShipRestriction(shipKey)
      {
         InputValidator.validateNotNull("shipKey", shipKey);
         var myShipKey = shipKey;
         var props = Ship.properties[myShipKey];

         if (shipKey.endsWith("fore"))
         {
            myShipKey = shipKey.split(".")[0];
            props = Ship.properties[myShipKey].fore;
         }
         else if (shipKey.endsWith("aft") && !shipKey.endsWith("Craft"))
         {
            myShipKey = shipKey.split(".")[0];
            props = Ship.properties[myShipKey].aft;
         }

         var name = props.name;

         if (shipKey === Ship.CR90_CORVETTE || shipKey === Ship.GR_75_MEDIUM_TRANSPORT)
         {
            name = props.name.split(" ")[0];
         }
         else if (shipKey.startsWith(Ship.RAIDER_CLASS_CORVETTE))
         {
            name = name.replace("(", "");
            name = name.replace(")", "");
            name += " section";
         }

         return (
         {
            name: name + " only.",
            passes: function(pilotKey)
            {
               var pilot = PilotCard.properties[pilotKey];
               var myShipKey = pilot.shipFaction.shipKey;
               return myShipKey === shipKey;
            }
         });
      }

      function FactionRestriction(factionKey)
      {
         InputValidator.validateNotNull("factionKey", factionKey);

         var props = Faction.properties[factionKey];

         return (
         {
            name: props.name + " only.",
            passes: function(pilotKey)
            {
               var pilot = PilotCard.properties[pilotKey];
               var myFactionKey = pilot.shipFaction.factionKey;
               return myFactionKey === factionKey;
            }
         });
      }

      var UpgradeRestriction = {
         // PilotCard skill lower bound.
         PILOT_SKILL_ABOVE_1: "pilotSkillAbove1",
         PILOT_SKILL_ABOVE_2: "pilotSkillAbove2",
         PILOT_SKILL_ABOVE_3: "pilotSkillAbove3",
         PILOT_SKILL_ABOVE_4: "pilotSkillAbove4",

         // Ship specific.
         A_WING_ONLY: "aWingOnly",
         AGGRESSOR_ONLY: "aggressorOnly",
         ARC_170_ONLY: "arc170Only",
         B_WING_ONLY: "bWingOnly",
         C_ROC_CRUISER_AND_GR_75_ONLY: "cRocCruiserAndGr75Only",
         C_ROC_CRUISER_ONLY: "cRocCruiserOnly",
         CR90_ONLY: "cr90Only",
         FIRESPRAY_31_ONLY: "firespray31Only",
         G_1A_STARFIGHTER_ONLY: "g1AStarfighterOnly",
         GOZANTI_CLASS_CRUISER_ONLY: "gozantiClassCruiserOnly",
         GR_75_ONLY: "gr75Only",
         HWK_290_ONLY: "hwk290Only",
         JUMP_MASTER_5000_ONLY: "jumpMaster5000Only",
         LAMBDA_CLASS_SHUTTLE_ONLY: "lambdaClassShuttleOnly",
         LANCER_CLASS_PURSUIT_CRAFT_ONLY: "lancerClassPursuitCraftOnly",
         M3_A_INTERCEPTOR_ONLY: "m3AInterceptorOnly",
         PROTECTORATE_STARFIGHTER_ONLY: "protectorateStarfighterOnly",
         RAIDER_CLASS_CORVETTE_AFT_SECTION_ONLY: "raiderClassCorvetteAftSectionOnly",
         STAR_VIPER_ONLY: "starViperOnly",
         T_70_X_WING_ONLY: "t70XWingOnly",
         TIE_ADVANCED_ONLY: "tieAdvancedOnly",
         TIE_ADVANCED_PROTOTYPE_ONLY: "tieAdvancedPrototypeOnly",
         TIE_BOMBER_ONLY: "tieBomberOnly",
         TIE_DEFENDER_ONLY: "tieDefenderOnly",
         TIE_INTERCEPTOR_ONLY: "tieInterceptorOnly",
         TIE_PHANTOM_ONLY: "tiePhantomOnly",
         TIE_SF_ONLY: "tieSfOnly",
         U_WING_ONLY: "uWingOnly",
         UPSILON_CLASS_SHUTTLE_ONLY: "upsilonClassShuttleOnly",
         VCX_100_ONLY: "vcx100Only",
         VT_49_DECIMATOR_ONLY: "vt49DecimatorOnly",
         X_WING_ONLY: "xWingOnly",
         YT_1300_AND_YT_2400_ONLY: "yt1300AndYt2400Only",
         YT_1300_ONLY: "yt1300Only",
         YT_2400_ONLY: "yt2400Only",
         Y_WING_ONLY: "yWingOnly",
         YV_666_ONLY: "yv666Only",

         // Ship size.
         HUGE_SHIP_ONLY: "hugeShipOnly",
         LARGE_SHIP_ONLY: "largeShipOnly",
         SMALL_SHIP_ONLY: "smallShipOnly",

         // Faction specific.
         IMPERIAL_ONLY: "imperialOnly",
         REBEL_AND_SCUM_ONLY: "rebelAndScumOnly",
         REBEL_ONLY: "rebelOnly",
         SCUM_ONLY: "scumOnly",

         // Miscellaneous.
         LIMITED: "limited",
         TIE_ONLY: "tieOnly",

         properties:
         {
            "aWingOnly": new ShipRestriction(Ship.A_WING),
            "aggressorOnly": new ShipRestriction(Ship.AGGRESSOR),
            "arc170Only": new ShipRestriction(Ship.ARC_170),
            "bWingOnly": new ShipRestriction(Ship.B_WING),
            "cRocCruiserAndGr75Only":
            {
               name: "C-ROC Cruiser and GR-75 only.",
               passes: function(pilotKey)
               {
                  var pilot = PilotCard.properties[pilotKey];
                  var shipKey = pilot.shipFaction.shipKey;
                  return shipKey === Ship.C_ROC_CRUISER || shipKey === Ship.GR_75_MEDIUM_TRANSPORT;
               }
            },
            "cRocCruiserOnly": new ShipRestriction(Ship.C_ROC_CRUISER),
            "cr90Only": new ShipRestriction(Ship.CR90_CORVETTE),
            "firespray31Only": new ShipRestriction(Ship.FIRESPRAY_31),
            "g1AStarfighterOnly": new ShipRestriction(Ship.G_1A_STARFIGHTER),
            "gozantiClassCruiserOnly": new ShipRestriction(Ship.GOZANTI_CLASS_CRUISER),
            "gr75Only": new ShipRestriction(Ship.GR_75_MEDIUM_TRANSPORT),
            "hugeShipOnly":
            {
               name: "Huge ship only.",
               passes: function(pilotKey)
               {
                  var pilot = PilotCard.properties[pilotKey];
                  var shipBaseKey = pilot.shipFaction.ship.shipBaseKey;
                  return ShipBase.isHuge(shipBaseKey);
               }
            },
            "hwk290Only": new ShipRestriction(Ship.HWK_290),
            "imperialOnly": new FactionRestriction(Faction.IMPERIAL),
            "jumpMaster5000Only": new ShipRestriction(Ship.JUMP_MASTER_5000),
            "lambdaClassShuttleOnly": new ShipRestriction(Ship.LAMBDA_CLASS_SHUTTLE),
            "lancerClassPursuitCraftOnly": new ShipRestriction(Ship.LANCER_CLASS_PURSUIT_CRAFT),
            "largeShipOnly": new ShipSizeRestriction(ShipBase.LARGE),
            "limited":
            {
               name: "Limited.",
               passes: function(pilotKey)
               {
                  // FIXME: implement Limited.passes()
                  return true;
               }
            },
            "m3AInterceptorOnly": new ShipRestriction(Ship.M3_A_INTERCEPTOR),
            "pilotSkillAbove1": new PilotCardSkillRestriction(1),
            "pilotSkillAbove2": new PilotCardSkillRestriction(2),
            "pilotSkillAbove3": new PilotCardSkillRestriction(3),
            "pilotSkillAbove4": new PilotCardSkillRestriction(4),
            "protectorateStarfighterOnly": new ShipRestriction(Ship.PROTECTORATE_STARFIGHTER),
            "raiderClassCorvetteAftSectionOnly": new ShipRestriction("raiderClassCorvette.aft"),
            "rebelAndScumOnly":
            {
               name: "Rebel and Scum only.",
               passes: function(pilotKey)
               {
                  var pilot = PilotCard.properties[pilotKey];
                  var factionKey = pilot.shipFaction.factionKey;
                  return factionKey === Faction.REBEL || factionKey === Faction.SCUM;
               }
            },
            "rebelOnly": new FactionRestriction(Faction.REBEL),
            "scumOnly": new FactionRestriction(Faction.SCUM),
            "smallShipOnly": new ShipSizeRestriction(ShipBase.SMALL),
            "starViperOnly": new ShipRestriction(Ship.STAR_VIPER),
            "t70XWingOnly": new ShipRestriction(Ship.T_70_X_WING),
            "tieAdvancedOnly": new ShipRestriction(Ship.TIE_ADVANCED),
            "tieAdvancedPrototypeOnly": new ShipRestriction(Ship.TIE_ADVANCED_PROTOTYPE),
            "tieBomberOnly": new ShipRestriction(Ship.TIE_BOMBER),
            "tieDefenderOnly": new ShipRestriction(Ship.TIE_DEFENDER),
            "tieInterceptorOnly": new ShipRestriction(Ship.TIE_INTERCEPTOR),
            "tieOnly":
            {
               name: "TIE only.",
               passes: function(pilotKey)
               {
                  var pilot = PilotCard.properties[pilotKey];
                  var shipKey = pilot.shipFaction.shipKey;
                  return Ship.properties[shipKey].name.startsWith("TIE");
               }
            },
            "tiePhantomOnly": new ShipRestriction(Ship.TIE_PHANTOM),
            "tieSfOnly": new ShipRestriction(Ship.TIE_SF_FIGHTER),
            "uWingOnly": new ShipRestriction(Ship.U_WING),
            "upsilonClassShuttleOnly": new ShipRestriction(Ship.UPSILON_CLASS_SHUTTLE),
            "vcx100Only": new ShipRestriction(Ship.VCX_100),
            "vt49DecimatorOnly": new ShipRestriction(Ship.VT_49_DECIMATOR),
            "xWingOnly":
            {
               name: "X-Wing only.",
               passes: function(pilotKey)
               {
                  var pilot = PilotCard.properties[pilotKey];
                  var shipKey = pilot.shipFaction.shipKey;
                  return shipKey === Ship.X_WING || shipKey === Ship.T_70_X_WING;
               }
            },
            "yt1300AndYt2400Only":
            {
               name: "YT-1300 and YT-2400 only.",
               passes: function(pilotKey)
               {
                  var pilot = PilotCard.properties[pilotKey];
                  var shipKey = pilot.shipFaction.shipKey;
                  return shipKey === Ship.YT_1300 || shipKey === Ship.YT_2400;
               }
            },
            "yt1300Only": new ShipRestriction(Ship.YT_1300),
            "yt2400Only": new ShipRestriction(Ship.YT_2400),
            "yWingOnly": new ShipRestriction(Ship.Y_WING),
            "yv666Only": new ShipRestriction(Ship.YV_666),
         },
      };

      UpgradeRestriction.keys = function()
      {
         return Object.keys(UpgradeRestriction.properties);
      };

      UpgradeRestriction.passes = function(restrictionKeys, pilotKey)
      {
         InputValidator.validateNotNull("pilotKey", pilotKey);

         var answer = true;

         if (restrictionKeys !== undefined)
         {
            answer = restrictionKeys.reduce(function(previousValue, restrictionKey)
            {
               if (!UpgradeRestriction.properties[restrictionKey])
               {
                  throw "Can't find properties for restrictionKey: " + restrictionKey;
               }
               return previousValue && UpgradeRestriction.properties[restrictionKey].passes(pilotKey);
            }, true);
         }

         return answer;
      };

      UpgradeRestriction.toString = function()
      {
         return "UpgradeRestriction";
      };

      UpgradeRestriction.values = function()
      {
         return Object.values(UpgradeRestriction.properties);
      };

      if (Object.freeze)
      {
         Object.freeze(UpgradeRestriction);
      }

      return UpgradeRestriction;
   });
