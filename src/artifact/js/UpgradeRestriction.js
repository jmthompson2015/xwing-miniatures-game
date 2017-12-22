"use strict";

define(["common/js/InputValidator", "artifact/js/Faction", "artifact/js/PilotCard", "artifact/js/Ship", "artifact/js/ShipBase"],
   function(InputValidator, Faction, PilotCard, Ship, ShipBase)
   {
      function FactionGroupRestriction(name, factionKeys)
      {
         InputValidator.validateIsString("name", name);
         InputValidator.validateIsArray("factionKeys", factionKeys);

         return (
         {
            name: name,
            passes: function(pilotKey)
            {
               var pilot = PilotCard.properties[pilotKey];
               var myFactionKey = pilot.shipFaction.factionKey;
               return factionKeys.includes(myFactionKey);
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

      function ShipGroupRestriction(name, shipKeys)
      {
         InputValidator.validateIsString("name", name);
         InputValidator.validateIsArray("shipKeys", shipKeys);

         return (
         {
            name: name,
            passes: function(pilotKey)
            {
               var pilot = PilotCard.properties[pilotKey];
               var myShipKey = pilot.shipFaction.shipKey;
               return shipKeys.includes(myShipKey);
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

      function ShipSizeGroupRestriction(name, shipBaseKeys)
      {
         InputValidator.validateIsString("name", name);
         InputValidator.validateIsArray("shipBaseKeys", shipBaseKeys);

         return (
         {
            name: name,
            passes: function(pilotKey)
            {
               var pilot = PilotCard.properties[pilotKey];
               var myShipBaseKey = pilot.shipFaction.ship.shipBaseKey;
               return shipBaseKeys.includes(myShipBaseKey);
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

      var UpgradeRestriction = {
         // Faction specific.
         IMPERIAL_ONLY: "imperialOnly",
         REBEL_ONLY: "rebelOnly",
         SCUM_ONLY: "scumOnly",
         REBEL_AND_SCUM_ONLY: "rebelAndScumOnly",

         // PilotCard skill lower bound.
         PILOT_SKILL_ABOVE_1: "pilotSkillAbove1",
         PILOT_SKILL_ABOVE_2: "pilotSkillAbove2",
         PILOT_SKILL_ABOVE_3: "pilotSkillAbove3",
         PILOT_SKILL_ABOVE_4: "pilotSkillAbove4",

         // Ship specific.
         ALPHA_CLASS_STAR_WING_ONLY: "alphaClassStarWingOnly",
         A_WING_ONLY: "aWingOnly",
         AGGRESSOR_ONLY: "aggressorOnly",
         ARC_170_ONLY: "arc170Only",
         ATTACK_SHUTTLE_ONLY: "attackShuttleOnly",
         B_SF_17_BOMBER_ONLY: "bSf17BomberOnly",
         B_WING_ONLY: "bWingOnly",
         C_ROC_CRUISER_ONLY: "cRocCruiserOnly",
         CR90_CORVETTE_FORE_ONLY: "cr90CorvetteForeOnly",
         FIRESPRAY_31_ONLY: "firespray31Only",
         G_1A_STARFIGHTER_ONLY: "g1AStarfighterOnly",
         GOZANTI_CLASS_CRUISER_ONLY: "gozantiClassCruiserOnly",
         GR_75_MEDIUM_TRANSPORT_ONLY: "gr75MediumTransportOnly",
         HWK_290_ONLY: "hwk290Only",
         JUMP_MASTER_5000_ONLY: "jumpMaster5000Only",
         KIHRAXZ_FIGHTER_ONLY: "kihraxzFighterOnly",
         LAMBDA_CLASS_SHUTTLE_ONLY: "lambdaClassShuttleOnly",
         LANCER_CLASS_PURSUIT_CRAFT_ONLY: "lancerClassPursuitCraftOnly",
         M12_L_KIMOGILA_FIGHTER_ONLY: "m12LKimogilaFighterOnly",
         M3_A_INTERCEPTOR_ONLY: "m3AInterceptorOnly",
         PROTECTORATE_STARFIGHTER_ONLY: "protectorateStarfighterOnly",
         QUADJUMPER_ONLY: "quadjumperOnly",
         RAIDER_CLASS_CORVETTE_AFT_ONLY: "raiderClassCorvetteAftOnly",
         SCURRG_H_6_BOMBER_ONLY: "scurrgH6BomberOnly",
         SHEATHIPEDE_CLASS_SHUTTLE_ONLY: "sheathipedeClassShuttleOnly",
         STAR_VIPER_ONLY: "starViperOnly",
         T_70_X_WING_ONLY: "t70XWingOnly",
         TIE_ADVANCED_ONLY: "tieAdvancedOnly",
         TIE_ADVANCED_PROTOTYPE_ONLY: "tieAdvancedPrototypeOnly",
         TIE_AGGRESSOR_ONLY: "tieAggressorOnly",
         TIE_BOMBER_ONLY: "tieBomberOnly",
         TIE_DEFENDER_ONLY: "tieDefenderOnly",
         TIE_FIGHTER_ONLY: "tieFighterOnly",
         TIE_FO_FIGHTER_ONLY: "tieFoFighterOnly",
         TIE_INTERCEPTOR_ONLY: "tieInterceptorOnly",
         TIE_PHANTOM_ONLY: "tiePhantomOnly",
         TIE_PUNISHER_ONLY: "tiePunisherOnly",
         TIE_SF_FIGHTER_ONLY: "tieSfFighterOnly",
         TIE_SILENCER_ONLY: "tieSilencerOnly",
         TIE_STRIKER_ONLY: "tieStrikerOnly",
         U_WING_ONLY: "uWingOnly",
         UPSILON_CLASS_SHUTTLE_ONLY: "upsilonClassShuttleOnly",
         VCX_100_ONLY: "vcx100Only",
         VT_49_DECIMATOR_ONLY: "vt49DecimatorOnly",
         YT_1300_ONLY: "yt1300Only",
         YT_2400_ONLY: "yt2400Only",
         Y_WING_ONLY: "yWingOnly",
         YV_666_ONLY: "yv666Only",
         C_ROC_CRUISER_AND_GR_75_ONLY: "cRocCruiserAndGr75Only",
         TIE_ONLY: "tieOnly",
         X_WING_ONLY: "xWingOnly",
         YT_1300_AND_YT_2400_ONLY: "yt1300AndYt2400Only",

         // Ship size.
         HUGE_SHIP_ONLY: "hugeShipOnly",
         LARGE_SHIP_ONLY: "largeShipOnly",
         SMALL_SHIP_ONLY: "smallShipOnly",
         SMALL_AND_LARGE_SHIP_ONLY: "smallAndLargeShipOnly",

         // Miscellaneous.
         LIMITED: "limited",

         properties:
         {
            // Faction specific.
            "imperialOnly": new FactionRestriction(Faction.IMPERIAL),
            "rebelOnly": new FactionRestriction(Faction.REBEL),
            "scumOnly": new FactionRestriction(Faction.SCUM),

            "rebelAndScumOnly": new FactionGroupRestriction("Rebel and Scum only.", [Faction.REBEL, Faction.SCUM]),

            // PilotCard skill lower bound.
            "pilotSkillAbove1": new PilotCardSkillRestriction(1),
            "pilotSkillAbove2": new PilotCardSkillRestriction(2),
            "pilotSkillAbove3": new PilotCardSkillRestriction(3),
            "pilotSkillAbove4": new PilotCardSkillRestriction(4),

            // Ship specific.
            "alphaClassStarWingOnly": new ShipRestriction(Ship.ALPHA_CLASS_STAR_WING),
            "aWingOnly": new ShipRestriction(Ship.A_WING),
            "aggressorOnly": new ShipRestriction(Ship.AGGRESSOR),
            "arc170Only": new ShipRestriction(Ship.ARC_170),
            "attackShuttleOnly": new ShipRestriction(Ship.ATTACK_SHUTTLE),
            "bSf17BomberOnly": new ShipRestriction(Ship.B_SF_17_BOMBER),
            "bWingOnly": new ShipRestriction(Ship.B_WING),
            "cRocCruiserOnly": new ShipRestriction(Ship.C_ROC_CRUISER),
            "cr90CorvetteForeOnly": new ShipRestriction("cr90Corvette.fore"),
            "firespray31Only": new ShipRestriction(Ship.FIRESPRAY_31),
            "g1AStarfighterOnly": new ShipRestriction(Ship.G_1A_STARFIGHTER),
            "gozantiClassCruiserOnly": new ShipRestriction(Ship.GOZANTI_CLASS_CRUISER),
            "gr75MediumTransportOnly": new ShipRestriction(Ship.GR_75_MEDIUM_TRANSPORT),
            "hwk290Only": new ShipRestriction(Ship.HWK_290),
            "jumpMaster5000Only": new ShipRestriction(Ship.JUMP_MASTER_5000),
            "kihraxzFighterOnly": new ShipRestriction(Ship.KIHRAXZ_FIGHTER),
            "lambdaClassShuttleOnly": new ShipRestriction(Ship.LAMBDA_CLASS_SHUTTLE),
            "lancerClassPursuitCraftOnly": new ShipRestriction(Ship.LANCER_CLASS_PURSUIT_CRAFT),
            "m12LKimogilaFighterOnly": new ShipRestriction(Ship.M12_L_KIMOGILA_FIGHTER),
            "m3AInterceptorOnly": new ShipRestriction(Ship.M3_A_INTERCEPTOR),
            "protectorateStarfighterOnly": new ShipRestriction(Ship.PROTECTORATE_STARFIGHTER),
            "quadjumperOnly": new ShipRestriction(Ship.QUADJUMPER),
            "raiderClassCorvetteAftOnly": new ShipRestriction("raiderClassCorvette.aft"),
            "scurrgH6BomberOnly": new ShipRestriction(Ship.SCURRG_H_6_BOMBER),
            "sheathipedeClassShuttleOnly": new ShipRestriction(Ship.SHEATHIPEDE_CLASS_SHUTTLE),
            "starViperOnly": new ShipRestriction(Ship.STAR_VIPER),
            "t70XWingOnly": new ShipRestriction(Ship.T_70_X_WING),
            "tieAdvancedOnly": new ShipRestriction(Ship.TIE_ADVANCED),
            "tieAdvancedPrototypeOnly": new ShipRestriction(Ship.TIE_ADVANCED_PROTOTYPE),
            "tieAggressorOnly": new ShipRestriction(Ship.TIE_AGGRESSOR),
            "tieBomberOnly": new ShipRestriction(Ship.TIE_BOMBER),
            "tieDefenderOnly": new ShipRestriction(Ship.TIE_DEFENDER),
            "tieFighterOnly": new ShipRestriction(Ship.TIE_FIGHTER),
            "tieFoFighterOnly": new ShipRestriction(Ship.TIE_FO_FIGHTER),
            "tieInterceptorOnly": new ShipRestriction(Ship.TIE_INTERCEPTOR),
            "tiePhantomOnly": new ShipRestriction(Ship.TIE_PHANTOM),
            "tiePunisherOnly": new ShipRestriction(Ship.TIE_PUNISHER),
            "tieSfFighterOnly": new ShipRestriction(Ship.TIE_SF_FIGHTER),
            "tieSilencerOnly": new ShipRestriction(Ship.TIE_SILENCER),
            "tieStrikerOnly": new ShipRestriction(Ship.TIE_STRIKER),
            "uWingOnly": new ShipRestriction(Ship.U_WING),
            "upsilonClassShuttleOnly": new ShipRestriction(Ship.UPSILON_CLASS_SHUTTLE),
            "vcx100Only": new ShipRestriction(Ship.VCX_100),
            "vt49DecimatorOnly": new ShipRestriction(Ship.VT_49_DECIMATOR),
            "yt1300Only": new ShipRestriction(Ship.YT_1300),
            "yt2400Only": new ShipRestriction(Ship.YT_2400),
            "yWingOnly": new ShipRestriction(Ship.Y_WING),
            "yv666Only": new ShipRestriction(Ship.YV_666),

            "cRocCruiserAndGr75Only": new ShipGroupRestriction("C-ROC Cruiser and GR-75 only.", [Ship.C_ROC_CRUISER, Ship.GR_75_MEDIUM_TRANSPORT]),
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
            "xWingOnly": new ShipGroupRestriction("X-Wing only.", [Ship.X_WING, Ship.T_70_X_WING]),
            "yt1300AndYt2400Only": new ShipGroupRestriction("YT-1300 and YT-2400 only.", [Ship.YT_1300, Ship.YT_2400]),

            // Ship size.
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
            "largeShipOnly": new ShipSizeRestriction(ShipBase.LARGE),
            "smallShipOnly": new ShipSizeRestriction(ShipBase.SMALL),

            "smallAndLargeShipOnly": new ShipSizeGroupRestriction("Small and large ship only.", [ShipBase.SMALL, ShipBase.LARGE]),

            // Miscellaneous.
            "limited":
            {
               name: "Limited.",
               passes: function( /* pilotKey */ )
               {
                  // FIXME: implement Limited.passes()
                  return true;
               }
            },

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
                  throw "Can't find properties for restrictionKey: " + restrictionKey + " pilotKey: " + pilotKey;
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
