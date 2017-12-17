"use strict";

define(["common/js/ArrayAugments", "common/js/InputValidator", "artifact/js/Faction", "artifact/js/Ship"],
   function(ArrayAugments, InputValidator, Faction, Ship)
   {
      var ShipFaction = {
         // First Order.
         FIRST_ORDER_TIE_FO_FIGHTER: "firstOrderTieFoFighter",
         FIRST_ORDER_TIE_SF_FIGHTER: "firstOrderTieSfFighter",
         FIRST_ORDER_UPSILON_CLASS_SHUTTLE: "firstOrderUpsilonClassShuttle",

         // Imperial.
         IMPERIAL_FIRESPRAY_31: "imperialFirespray31",
         IMPERIAL_GOZANTI_CLASS_CRUISER: "imperialGozantiClassCruiser",
         IMPERIAL_LAMBDA_CLASS_SHUTTLE: "imperialLambdaClassShuttle",
         IMPERIAL_RAIDER_CLASS_CORVETTE: "imperialRaiderClassCorvette",
         IMPERIAL_TIE_ADVANCED: "imperialTieAdvanced",
         IMPERIAL_TIE_ADVANCED_PROTOTYPE: "imperialTieAdvancedPrototype",
         IMPERIAL_TIE_BOMBER: "imperialTieBomber",
         IMPERIAL_TIE_BOMBER_V2: "imperialTieBomberV2",
         IMPERIAL_TIE_DEFENDER: "imperialTieDefender",
         IMPERIAL_TIE_DEFENDER_V2: "imperialTieDefenderV2",
         IMPERIAL_TIE_FIGHTER: "imperialTieFighter",
         IMPERIAL_TIE_INTERCEPTOR: "imperialTieInterceptor",
         IMPERIAL_TIE_INTERCEPTOR_V2: "imperialTieInterceptorV2",
         IMPERIAL_TIE_INTERCEPTOR_V3: "imperialTieInterceptorV3",
         IMPERIAL_TIE_PHANTOM: "imperialTiePhantom",
         IMPERIAL_TIE_PUNISHER: "imperialTiePunisher",
         IMPERIAL_VT_49_DECIMATOR: "imperialVt49Decimator",

         // Rebel.
         REBEL_A_WING: "rebelAWing",
         REBEL_A_WING_V2: "rebelAWingV2",
         REBEL_ARC_170: "rebelArc170",
         REBEL_ATTACK_SHUTTLE: "rebelAttackShuttle",
         REBEL_B_WING: "rebelBWing",
         REBEL_B_WING_V2: "rebelBWingV2",
         REBEL_CR90_CORVETTE: "rebelCr90Corvette",
         REBEL_E_WING: "rebelEWing",
         REBEL_GR_75_MEDIUM_TRANSPORT: "rebelGr75MediumTransport",
         REBEL_HWK_290: "rebelHwk290",
         REBEL_K_WING: "rebelKWing",
         REBEL_SABINES_TIE_FIGHTER: "rebelSabinesTieFighter",
         REBEL_U_WING: "rebelUWing",
         REBEL_VCX_100: "rebelVcx100",
         REBEL_X_WING: "rebelXWing",
         REBEL_Y_WING: "rebelYWing",
         REBEL_YT_1300: "rebelYt1300",
         REBEL_YT_2400: "rebelYt2400",
         REBEL_Z_95_HEADHUNTER: "rebelZ95Headhunter",

         // Resistance.
         RESISTANCE_T_70_X_WING: "resistanceT70XWing",
         RESISTANCE_T_70_X_WING_V2: "resistanceT70XWingV2",
         RESISTANCE_YT_1300: "resistanceYt1300",

         // Scum & Villainy.
         SCUM_AGGRESSOR: "scumAggressor",
         SCUM_C_ROC_CRUISER: "scumCRocCruiser",
         SCUM_FIRESPRAY_31: "scumFirespray31",
         SCUM_G_1A_STARFIGHTER: "scumG1AStarfighter",
         SCUM_HWK_290: "scumHwk290",
         SCUM_JUMP_MASTER_5000: "scumJumpMaster5000",
         SCUM_KIHRAXZ_FIGHTER: "scumKihraxzFighter",
         SCUM_LANCER_CLASS_PURSUIT_CRAFT: "scumLancerClassPursuitCraft",
         SCUM_M3_A_INTERCEPTOR: "scumM3AInterceptor",
         SCUM_M3_A_INTERCEPTOR_V2: "scumM3AInterceptorV2",
         SCUM_PROTECTORATE_STARFIGHTER: "scumProtectorateStarfighter",
         SCUM_STAR_VIPER: "scumStarViper",
         SCUM_Y_WING: "scumYWing",
         SCUM_YV_666: "scumYv666",
         SCUM_Z_95_HEADHUNTER: "scumZ95Headhunter",

         properties:
         {
            // First Order.
            "firstOrderTieFoFighter":
            {
               name: "TIE/fo Fighter",
               shipKey: Ship.TIE_FO_FIGHTER,
               factionKey: Faction.FIRST_ORDER,
               image: "FirstOrder_TIE_fo_Fighter.png",
               wave: "8",
               key: "firstOrderTieFoFighter",
            },
            "firstOrderTieSfFighter":
            {
               name: "TIE/sf Fighter",
               shipKey: Ship.TIE_SF_FIGHTER,
               factionKey: Faction.FIRST_ORDER,
               image: "FirstOrder_TIE_sf_Fighter.png",
               wave: "9",
               key: "firstOrderTieSfFighter",
            },
            "firstOrderUpsilonClassShuttle":
            {
               name: "Upsilon-class Shuttle",
               shipKey: Ship.UPSILON_CLASS_SHUTTLE,
               factionKey: Faction.FIRST_ORDER,
               image: "FirstOrder_Upsilon-class_Shuttle.png",
               wave: "10",
               key: "firstOrderUpsilonClassShuttle",
            },

            // Imperial.
            "imperialFirespray31":
            {
               name: "Firespray-31 (Imperial)",
               shipKey: Ship.FIRESPRAY_31,
               factionKey: Faction.IMPERIAL,
               image: "Firespray-31.png",
               wave: "2",
               key: "imperialFirespray31",
            },
            "imperialGozantiClassCruiser":
            {
               name: "Gozanti-class Cruiser",
               shipKey: Ship.GOZANTI_CLASS_CRUISER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_Gozanti-class_Cruiser.png",
               wave: "Huge",
               key: "imperialGozantiClassCruiser",
            },
            "imperialLambdaClassShuttle":
            {
               name: "Lambda-class Shuttle",
               shipKey: Ship.LAMBDA_CLASS_SHUTTLE,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_Lambda-class_Shuttle.png",
               wave: "3",
               key: "imperialLambdaClassShuttle",
            },
            "imperialRaiderClassCorvette":
            {
               name: "Raider-class Corvette",
               shipKey: Ship.RAIDER_CLASS_CORVETTE,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_Raider-class_Corvette.png",
               wave: "Huge",
               key: "imperialRaiderClassCorvette",
            },
            "imperialTieAdvanced":
            {
               name: "TIE Advanced",
               shipKey: Ship.TIE_ADVANCED,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Advanced.png",
               wave: "1",
               key: "imperialTieAdvanced",
            },
            "imperialTieAdvancedPrototype":
            {
               name: "TIE Advanced Prototype",
               shipKey: Ship.TIE_ADVANCED_PROTOTYPE,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Advanced_Prototype.png",
               wave: "8",
               key: "imperialTieAdvancedPrototype",
            },
            "imperialTieBomber":
            {
               name: "TIE Bomber",
               shipKey: Ship.TIE_BOMBER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Bomber.png",
               wave: "3",
               key: "imperialTieBomber",
            },
            "imperialTieBomberV2":
            {
               name: "TIE Bomber (Gamma Squadron)",
               shipKey: Ship.TIE_BOMBER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Bomber_v2.png",
               wave: "Aces",
               key: "imperialTieBomberV2",
            },
            "imperialTieDefender":
            {
               name: "TIE Defender",
               shipKey: Ship.TIE_DEFENDER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Defender.png",
               wave: "4",
               key: "imperialTieDefender",
            },
            "imperialTieDefenderV2":
            {
               name: "TIE Defender (Glaive Squadron)",
               shipKey: Ship.TIE_DEFENDER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Defender_v2.png",
               wave: "Aces",
               key: "imperialTieDefenderV2",
            },
            "imperialTieFighter":
            {
               name: "TIE Fighter",
               shipKey: Ship.TIE_FIGHTER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Fighter.png",
               wave: "1",
               key: "imperialTieFighter",
            },
            "imperialTieInterceptor":
            {
               name: "TIE Interceptor",
               shipKey: Ship.TIE_INTERCEPTOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Interceptor.png",
               wave: "2",
               key: "imperialTieInterceptor",
            },
            "imperialTieInterceptorV2":
            {
               name: "TIE Interceptor (Saber Squadron)",
               shipKey: Ship.TIE_INTERCEPTOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Interceptor_v2.png",
               wave: "Aces",
               key: "imperialTieInterceptorV2",
            },
            "imperialTieInterceptorV3":
            {
               name: "TIE Interceptor (Royal Guard)",
               shipKey: Ship.TIE_INTERCEPTOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Interceptor_v3.png",
               wave: "Aces",
               key: "imperialTieInterceptorV3",
            },
            "imperialTiePhantom":
            {
               name: "TIE Phantom",
               shipKey: Ship.TIE_PHANTOM,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Phantom.png",
               wave: "4",
               key: "imperialTiePhantom",
            },
            "imperialTiePunisher":
            {
               name: "TIE Punisher",
               shipKey: Ship.TIE_PUNISHER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Punisher.png",
               wave: "7",
               key: "imperialTiePunisher",
            },
            "imperialVt49Decimator":
            {
               name: "VT-49 Decimator",
               shipKey: Ship.VT_49_DECIMATOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_VT-49_Decimator.png",
               wave: "5",
               key: "imperialVt49Decimator",
            },

            // Rebel.
            "rebelAWing":
            {
               name: "A-Wing",
               shipKey: Ship.A_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_A-Wing.png",
               wave: "2",
               key: "rebelAWing",
            },
            "rebelAWingV2":
            {
               name: "A-Wing (Prototype)",
               shipKey: Ship.A_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_A-Wing_v2.png",
               wave: "Aces",
               key: "rebelAWingV2",
            },
            "rebelArc170":
            {
               name: "ARC-170",
               shipKey: Ship.ARC_170,
               factionKey: Faction.REBEL,
               image: "Rebel_ARC-170.png",
               wave: "9",
               key: "rebelArc170",
            },
            "rebelAttackShuttle":
            {
               name: "Attack Shuttle",
               shipKey: Ship.ATTACK_SHUTTLE,
               factionKey: Faction.REBEL,
               image: "Rebel_Attack_Shuttle.png",
               wave: "8",
               key: "rebelAttackShuttle",
            },
            "rebelBWing":
            {
               name: "B-Wing",
               shipKey: Ship.B_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_B-Wing.png",
               wave: "3",
               key: "rebelBWing",
            },
            "rebelBWingV2":
            {
               name: "B-Wing (Dagger Squadron)",
               shipKey: Ship.B_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_B-Wing_v2.png",
               wave: "Aces",
               key: "rebelBWingV2",
            },
            "rebelCr90Corvette":
            {
               name: "CR90 Corvette",
               shipKey: Ship.CR90_CORVETTE,
               factionKey: Faction.REBEL,
               image: "Rebel_CR90_Corvette.png",
               wave: "Huge",
               key: "rebelCr90Corvette",
            },
            "rebelEWing":
            {
               name: "E-Wing",
               shipKey: Ship.E_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_E-Wing.png",
               wave: "4",
               key: "rebelEWing",
            },
            "rebelGr75MediumTransport":
            {
               name: "GR-75 Medium Transport",
               shipKey: Ship.GR_75_MEDIUM_TRANSPORT,
               factionKey: Faction.REBEL,
               image: "Rebel_GR-75_Medium_Transport.png",
               wave: "Huge",
               key: "rebelGr75MediumTransport",
            },
            "rebelHwk290":
            {
               name: "HWK-290 (Rebel)",
               shipKey: Ship.HWK_290,
               factionKey: Faction.REBEL,
               image: "HWK-290.png",
               wave: "3",
               key: "rebelHwk290",
            },
            "rebelKWing":
            {
               name: "K-Wing",
               shipKey: Ship.K_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_K-Wing.png",
               wave: "7",
               key: "rebelKWing",
            },
            "rebelSabinesTieFighter":
            {
               name: "Sabine's TIE Fighter",
               shipKey: Ship.TIE_FIGHTER,
               factionKey: Faction.REBEL,
               image: "Rebel_Sabines_TIE_Fighter.png",
               wave: "10",
               key: "rebelSabinesTieFighter",
            },
            "rebelUWing":
            {
               name: "U-Wing",
               shipKey: Ship.U_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_U-Wing.png",
               wave: "10",
               key: "rebelUWing",
            },
            "rebelVcx100":
            {
               name: "rebelVcx100",
               shipKey: Ship.VCX_100,
               factionKey: Faction.REBEL,
               image: "Rebel_VCX-100.png",
               wave: "8",
               key: "rebelVcx100",
            },
            "rebelXWing":
            {
               name: "X-Wing",
               shipKey: Ship.X_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_X-Wing.png",
               wave: "1",
               key: "rebelXWing",
            },
            "rebelYWing":
            {
               name: "Y-Wing (Rebel)",
               shipKey: Ship.Y_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_Y-Wing.png",
               wave: "1",
               key: "rebelYWing",
            },
            "rebelYt1300":
            {
               name: "YT-1300 (Rebel)",
               shipKey: Ship.YT_1300,
               factionKey: Faction.REBEL,
               image: "Rebel_YT-1300.png",
               wave: "2",
               key: "rebelYt1300",
            },
            "rebelYt2400":
            {
               name: "YT-2400",
               shipKey: Ship.YT_2400,
               factionKey: Faction.REBEL,
               image: "Rebel_YT-2400.png",
               wave: "5",
               key: "rebelYt2400",
            },
            "rebelZ95Headhunter":
            {
               name: "Z-95 Headhunter (Rebel)",
               shipKey: Ship.Z_95_HEADHUNTER,
               factionKey: Faction.REBEL,
               image: "Rebel_Z-95_Headhunter.png",
               wave: "4",
               key: "rebelZ95Headhunter",
            },

            // Resistance.
            "resistanceT70XWing":
            {
               name: "T-70 X-Wing",
               shipKey: Ship.T_70_X_WING,
               factionKey: Faction.RESISTANCE,
               image: "Resistance_T-70_X-Wing.png",
               wave: "8",
               key: "resistanceT70XWing",
            },
            "resistanceT70XWingV2":
            {
               name: "T-70 X-Wing v2",
               shipKey: Ship.T_70_X_WING,
               factionKey: Faction.RESISTANCE,
               image: "Resistance_T-70_X-Wing_v2.png",
               wave: "Aces",
               key: "resistanceT70XWingV2",
            },
            "resistanceYt1300":
            {
               name: "YT-1300 (Resistance)",
               shipKey: Ship.YT_1300,
               factionKey: Faction.RESISTANCE,
               image: "Resistance_YT-1300.png",
               wave: "Aces",
               key: "resistanceYt1300",
            },

            // Scum & Villainy.
            "scumAggressor":
            {
               name: "Aggressor",
               shipKey: Ship.AGGRESSOR,
               factionKey: Faction.SCUM,
               image: "Scum_Aggressor.png",
               wave: "6",
               key: "scumAggressor",
            },
            "scumCRocCruiser":
            {
               name: "C-ROC Cruiser",
               shipKey: Ship.C_ROC_CRUISER,
               factionKey: Faction.SCUM,
               image: "Scum_C-ROC_Cruiser.png",
               wave: "Huge",
               key: "scumCRocCruiser",
            },
            "scumFirespray31":
            {
               name: "Firespray-31 (Scum)",
               shipKey: Ship.FIRESPRAY_31,
               factionKey: Faction.SCUM,
               image: "Firespray-31.png",
               wave: "6",
               key: "scumFirespray31",
            },
            "scumG1AStarfighter":
            {
               name: "G-1A Starfighter",
               shipKey: Ship.G_1A_STARFIGHTER,
               factionKey: Faction.SCUM,
               image: "Scum_G-1A_Starfighter.png",
               wave: "8",
               key: "scumG1AStarfighter",
            },
            "scumHwk290":
            {
               name: "HWK-290 (Scum)",
               shipKey: Ship.HWK_290,
               factionKey: Faction.SCUM,
               image: "HWK-290.png",
               wave: "6",
               key: "scumHwk290",
            },
            "scumJumpMaster5000":
            {
               name: "JumpMaster 5000",
               shipKey: Ship.JUMP_MASTER_5000,
               factionKey: Faction.SCUM,
               image: "Scum_JumpMaster_5000.png",
               wave: "8",
               key: "scumJumpMaster5000",
            },
            "scumKihraxzFighter":
            {
               name: "Kihraxz Fighter",
               shipKey: Ship.KIHRAXZ_FIGHTER,
               factionKey: Faction.SCUM,
               image: "Scum_KihraxzFighter.png",
               wave: "7",
               key: "scumKihraxzFighter",
            },
            "scumLancerClassPursuitCraft":
            {
               name: "Lancer-class Pursuit Craft",
               shipKey: Ship.LANCER_CLASS_PURSUIT_CRAFT,
               factionKey: Faction.SCUM,
               image: "Scum_Lancer-class_Pursuit_Craft.png",
               wave: "9",
               key: "scumLancerClassPursuitCraft",
            },
            "scumM3AInterceptor":
            {
               name: "M3-A Interceptor",
               shipKey: Ship.M3_A_INTERCEPTOR,
               factionKey: Faction.SCUM,
               image: "Scum_M3-A_Interceptor.png",
               wave: "6",
               key: "scumM3AInterceptor",
            },
            "scumM3AInterceptorV2":
            {
               name: "M3-A Interceptor v2",
               shipKey: Ship.M3_A_INTERCEPTOR,
               factionKey: Faction.SCUM,
               image: "Scum_M3-A_Interceptor_v2.png",
               wave: "Huge",
               key: "scumM3AInterceptorV2",
            },
            "scumProtectorateStarfighter":
            {
               name: "Protectorate Starfighter",
               shipKey: Ship.PROTECTORATE_STARFIGHTER,
               factionKey: Faction.SCUM,
               image: "Scum_Protectorate_Starfighter.png",
               wave: "9",
               key: "scumProtectorateStarfighter",
            },
            "scumStarViper":
            {
               name: "StarViper",
               shipKey: Ship.STAR_VIPER,
               factionKey: Faction.SCUM,
               image: "Scum_StarViper.png",
               wave: "6",
               key: "scumStarViper",
            },
            "scumYWing":
            {
               name: "Y-Wing (Scum)",
               shipKey: Ship.Y_WING,
               factionKey: Faction.SCUM,
               image: "Scum_Y-Wing.png",
               wave: "6",
               key: "scumYWing",
            },
            "scumYv666":
            {
               name: "YV-666",
               shipKey: Ship.YV_666,
               factionKey: Faction.SCUM,
               image: "Scum_YV-666.png",
               wave: "7",
               key: "scumYv666",
            },
            "scumZ95Headhunter":
            {
               name: "Z-95 Headhunter (Scum)",
               shipKey: Ship.Z_95_HEADHUNTER,
               factionKey: Faction.SCUM,
               image: "Scum_Z-95_Headhunter.png",
               wave: "6",
               key: "scumZ95Headhunter",
            },
         },
      };

      ShipFaction.keys = function()
      {
         return Object.keys(ShipFaction.properties);
      };

      ShipFaction.keysByFaction = function(factionKey, isStrict)
      {
         InputValidator.validateNotNull("factionKey", factionKey);

         var answer = this.keys().filter(function(shipFactionKey)
         {
            return ShipFaction.properties[shipFactionKey].factionKey === factionKey;
         });

         if (!isStrict)
         {
            var friend = Faction.friend(factionKey);

            if (friend)
            {
               answer.xwingAddAll(this.keysByFaction(friend, true));
            }
         }

         return answer;
      };

      ShipFaction.keysByShipAndFaction = function(shipKey, factionKey, isStrict)
      {
         InputValidator.validateNotNull("shipKey", shipKey);
         InputValidator.validateNotNull("factionKey", factionKey);

         var answer = this.keysByFaction(factionKey, isStrict).filter(function(shipFactionKey)
         {
            return ShipFaction.properties[shipFactionKey].shipKey === shipKey;
         });

         return answer;
      };

      ShipFaction.shipKeysByFaction = function(factionKey, isStrict)
      {
         InputValidator.validateNotNull("factionKey", factionKey);

         var shipFactionKeys = ShipFaction.keysByFaction(factionKey, isStrict);

         return shipFactionKeys.reduce(function(accumulator, shipFactionKey)
         {
            var shipKey = ShipFaction.properties[shipFactionKey].shipKey;

            if (!accumulator.includes(shipKey))
            {
               accumulator.push(shipKey);
            }

            return accumulator;
         }, []);
      };

      ShipFaction.toString = function()
      {
         return "ShipFaction";
      };

      ShipFaction.values = function()
      {
         return Object.values(ShipFaction.properties);
      };

      ShipFaction.keys().forEach(function(shipFactionKey)
      {
         var shipFaction = ShipFaction.properties[shipFactionKey];
         shipFaction.ship = Ship.properties[shipFaction.shipKey];
         shipFaction.faction = Faction.properties[shipFaction.factionKey];
      });

      if (Object.freeze)
      {
         Object.freeze(ShipFaction);
      }

      return ShipFaction;
   });
