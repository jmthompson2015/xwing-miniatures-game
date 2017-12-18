"use strict";

define(["common/js/ArrayAugments", "common/js/InputValidator", "artifact/js/Faction", "artifact/js/Ship"],
   function(ArrayAugments, InputValidator, Faction, Ship)
   {
      var ShipFaction = {
         // First Order.
         FIRST_ORDER_TIE_FO_FIGHTER: "firstOrder_tieFoFighter",
         FIRST_ORDER_TIE_SF_FIGHTER: "firstOrder_tieSfFighter",
         FIRST_ORDER_TIE_SILENCER: "firstOrder_tieSilencer",
         FIRST_ORDER_UPSILON_CLASS_SHUTTLE: "firstOrder_upsilonClassShuttle",

         // Imperial.
         IMPERIAL_ALPHA_CLASS_STAR_WING: "imperial_alphaClassStarWing",
         IMPERIAL_FIRESPRAY_31: "imperial_firespray31",
         IMPERIAL_LAMBDA_CLASS_SHUTTLE: "imperial_lambdaClassShuttle",
         IMPERIAL_TIE_ADVANCED: "imperial_tieAdvanced",
         IMPERIAL_TIE_ADVANCED_PROTOTYPE: "imperial_tieAdvancedPrototype",
         IMPERIAL_TIE_AGGRESSOR: "imperial_tieAggressor",
         IMPERIAL_TIE_BOMBER: "imperial_tieBomber",
         IMPERIAL_TIE_BOMBER_V2: "imperial_tieBomberV2",
         IMPERIAL_TIE_DEFENDER: "imperial_tieDefender",
         IMPERIAL_TIE_DEFENDER_V2: "imperial_tieDefenderV2",
         IMPERIAL_TIE_FIGHTER: "imperial_tieFighter",
         IMPERIAL_TIE_INTERCEPTOR: "imperial_tieInterceptor",
         IMPERIAL_TIE_INTERCEPTOR_V2: "imperial_tieInterceptorV2",
         IMPERIAL_TIE_INTERCEPTOR_V3: "imperial_tieInterceptorV3",
         IMPERIAL_TIE_PHANTOM: "imperial_tiePhantom",
         IMPERIAL_TIE_PUNISHER: "imperial_tiePunisher",
         IMPERIAL_TIE_STRIKER: "imperial_tieStriker",
         IMPERIAL_VT_49_DECIMATOR: "imperial_vt49Decimator",

         // Rebel.
         REBEL_ARC_170: "rebel_arc170",
         REBEL_ATTACK_SHUTTLE: "rebel_attackShuttle",
         REBEL_AUZITUCK_GUNSHIP: "rebel_auzituckGunship",
         REBEL_A_WING: "rebel_aWing",
         REBEL_A_WING_V2: "rebel_aWingV2",
         REBEL_B_WING: "rebel_bWing",
         REBEL_B_WING_V2: "rebel_bWingV2",
         REBEL_E_WING: "rebel_eWing",
         REBEL_HWK_290: "rebel_hwk290",
         REBEL_K_WING: "rebel_kWing",
         REBEL_SCURRG_H_6_BOMBER: "rebel_scurrgH6Bomber",
         REBEL_SHEATHIPEDE_CLASS_SHUTTLE: "rebel_sheathipedeClassShuttle",
         REBEL_TIE_FIGHTER: "rebel_tieFighter",
         REBEL_U_WING: "rebel_uWing",
         REBEL_VCX_100: "rebel_vcx100",
         REBEL_X_WING: "rebel_xWing",
         REBEL_YT_1300: "rebel_yt1300",
         REBEL_YT_2400: "rebel_yt2400",
         REBEL_Y_WING: "rebel_yWing",
         REBEL_Z_95_HEADHUNTER: "rebel_z95Headhunter",

         // Resistance.
         RESISTANCE_B_SF_17_BOMBER: "resistance_bSf17Bomber",
         RESISTANCE_T_70_X_WING: "resistance_t70XWing",
         RESISTANCE_T_70_X_WING_V2: "resistance_t70XWingV2",
         RESISTANCE_YT_1300: "resistance_yt1300",

         // Scum & Villainy.
         SCUM_AGGRESSOR: "scum_aggressor",
         SCUM_FIRESPRAY_31: "scum_firespray31",
         SCUM_G_1A_STARFIGHTER: "scum_g1aStarfighter",
         SCUM_HWK_290: "scum_hwk290",
         SCUM_JUMP_MASTER_5000: "scum_jumpMaster5000",
         SCUM_KIHRAXZ_FIGHTER: "scum_kihraxzFighter",
         SCUM_KIHRAXZ_FIGHTER_V2: "scum_kihraxzFighterV2",
         SCUM_LANCER_CLASS_PURSUIT_CRAFT: "scum_lancerClassPursuitCraft",
         SCUM_M12_L_KIMOGILA_FIGHTER: "scum_m12LKimogilaFighter",
         SCUM_M3_A_INTERCEPTOR: "scum_m3AInterceptor",
         SCUM_M3_A_INTERCEPTOR_V2: "scum_m3AInterceptorV2",
         SCUM_PROTECTORATE_STARFIGHTER: "scum_protectorateStarfighter",
         SCUM_QUADJUMPER: "scum_quadjumper",
         SCUM_SCURRG_H_6_BOMBER: "scum_scurrgH6Bomber",
         SCUM_STAR_VIPER: "scum_starViper",
         SCUM_STAR_VIPER_V2: "scum_starViperV2",
         SCUM_YV_666: "scum_yv666",
         SCUM_Y_WING: "scum_yWing",
         SCUM_Z_95_HEADHUNTER: "scum_z95Headhunter",

         // Huge ships.
         IMPERIAL_GOZANTI_CLASS_CRUISER: "imperial_gozantiClassCruiser",
         IMPERIAL_RAIDER_CLASS_CORVETTE: "imperial_raiderClassCorvette",
         REBEL_CR90_CORVETTE: "rebel_cr90Corvette",
         REBEL_GR_75_MEDIUM_TRANSPORT: "rebel_gr75MediumTransport",
         SCUM_C_ROC_CRUISER: "scum_cRocCruiser",

         properties:
         {
            // First Order.
            "firstOrder_tieFoFighter":
            {
               name: "TIE/fo Fighter",
               shipKey: Ship.TIE_FO_FIGHTER,
               factionKey: Faction.FIRST_ORDER,
               image: "FirstOrder_TIE_fo_Fighter.png",
               wave: "8",
               key: "firstOrder_tieFoFighter",
            },
            "firstOrder_tieSfFighter":
            {
               name: "TIE/sf Fighter",
               shipKey: Ship.TIE_SF_FIGHTER,
               factionKey: Faction.FIRST_ORDER,
               image: "FirstOrder_TIE_sf_Fighter.png",
               wave: "9",
               key: "firstOrder_tieSfFighter",
            },
            "firstOrder_tieSilencer":
            {
               name: "TIE Silencer",
               shipKey: Ship.TIE_SILENCER,
               factionKey: Faction.FIRST_ORDER,
               wave: "13",
               key: "firstOrder_tieSilencer",
            },
            "firstOrder_upsilonClassShuttle":
            {
               name: "Upsilon-class Shuttle",
               shipKey: Ship.UPSILON_CLASS_SHUTTLE,
               factionKey: Faction.FIRST_ORDER,
               image: "FirstOrder_Upsilon-class_Shuttle.png",
               wave: "10",
               key: "firstOrder_upsilonClassShuttle",
            },

            // Imperial.
            "imperial_alphaClassStarWing":
            {
               name: "Alpha-class Star Wing",
               shipKey: Ship.ALPHA_CLASS_STAR_WING,
               factionKey: Faction.IMPERIAL,
               wave: "12",
               key: "imperial_alphaClassStarWing",
            },
            "imperial_firespray31":
            {
               name: "Firespray-31",
               shipKey: Ship.FIRESPRAY_31,
               factionKey: Faction.IMPERIAL,
               image: "Firespray-31.png",
               wave: "2",
               key: "imperial_firespray31",
            },
            "imperial_lambdaClassShuttle":
            {
               name: "Lambda-class Shuttle",
               shipKey: Ship.LAMBDA_CLASS_SHUTTLE,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_Lambda-class_Shuttle.png",
               wave: "3",
               key: "imperial_lambdaClassShuttle",
            },
            "imperial_tieAdvanced":
            {
               name: "TIE Advanced",
               shipKey: Ship.TIE_ADVANCED,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Advanced.png",
               wave: "1",
               key: "imperial_tieAdvanced",
            },
            "imperial_tieAdvancedPrototype":
            {
               name: "TIE Advanced Prototype",
               shipKey: Ship.TIE_ADVANCED_PROTOTYPE,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Advanced_Prototype.png",
               wave: "8",
               key: "imperial_tieAdvancedPrototype",
            },
            "imperial_tieAggressor":
            {
               name: "TIE Aggressor",
               shipKey: Ship.TIE_AGGRESSOR,
               factionKey: Faction.IMPERIAL,
               wave: "11",
               key: "imperial_tieAggressor",
            },
            "imperial_tieBomber":
            {
               name: "TIE Bomber",
               shipKey: Ship.TIE_BOMBER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Bomber.png",
               wave: "3",
               key: "imperial_tieBomber",
            },
            "imperial_tieBomberV2":
            {
               name: "TIE Bomber v2",
               shipKey: Ship.TIE_BOMBER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Bomber_v2.png",
               wave: "Aces",
               key: "imperial_tieBomberV2",
            },
            "imperial_tieDefender":
            {
               name: "TIE Defender",
               shipKey: Ship.TIE_DEFENDER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Defender.png",
               wave: "4",
               key: "imperial_tieDefender",
            },
            "imperial_tieDefenderV2":
            {
               name: "TIE Defender v2",
               shipKey: Ship.TIE_DEFENDER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Defender_v2.png",
               wave: "Aces",
               key: "imperial_tieDefenderV2",
            },
            "imperial_tieFighter":
            {
               name: "TIE Fighter",
               shipKey: Ship.TIE_FIGHTER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Fighter.png",
               wave: "1",
               key: "imperial_tieFighter",
            },
            "imperial_tieInterceptor":
            {
               name: "TIE Interceptor",
               shipKey: Ship.TIE_INTERCEPTOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Interceptor.png",
               wave: "2",
               key: "imperial_tieInterceptor",
            },
            "imperial_tieInterceptorV2":
            {
               name: "TIE Interceptor v2",
               shipKey: Ship.TIE_INTERCEPTOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Interceptor_v2.png",
               wave: "Aces",
               key: "imperial_tieInterceptorV2",
            },
            "imperial_tieInterceptorV3":
            {
               name: "TIE Interceptor v3",
               shipKey: Ship.TIE_INTERCEPTOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Interceptor_v3.png",
               wave: "Aces",
               key: "imperial_tieInterceptorV3",
            },
            "imperial_tiePhantom":
            {
               name: "TIE Phantom",
               shipKey: Ship.TIE_PHANTOM,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Phantom.png",
               wave: "4",
               key: "imperial_tiePhantom",
            },
            "imperial_tiePunisher":
            {
               name: "TIE Punisher",
               shipKey: Ship.TIE_PUNISHER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Punisher.png",
               wave: "7",
               key: "imperial_tiePunisher",
            },
            "imperial_tieStriker":
            {
               name: "TIE Striker",
               shipKey: Ship.TIE_STRIKER,
               factionKey: Faction.IMPERIAL,
               wave: "10",
               key: "imperial_tieStriker",
            },
            "imperial_vt49Decimator":
            {
               name: "VT-49 Decimator",
               shipKey: Ship.VT_49_DECIMATOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_VT-49_Decimator.png",
               wave: "5",
               key: "imperial_vt49Decimator",
            },

            // Rebel.
            "rebel_aWing":
            {
               name: "A-Wing",
               shipKey: Ship.A_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_A-Wing.png",
               wave: "2",
               key: "rebel_aWing",
            },
            "rebel_aWingV2":
            {
               name: "A-Wing v2",
               shipKey: Ship.A_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_A-Wing_v2.png",
               wave: "Aces",
               key: "rebel_aWingV2",
            },
            "rebel_arc170":
            {
               name: "ARC-170",
               shipKey: Ship.ARC_170,
               factionKey: Faction.REBEL,
               image: "Rebel_ARC-170.png",
               wave: "9",
               key: "rebel_arc170",
            },
            "rebel_attackShuttle":
            {
               name: "Attack Shuttle",
               shipKey: Ship.ATTACK_SHUTTLE,
               factionKey: Faction.REBEL,
               image: "Rebel_Attack_Shuttle.png",
               wave: "8",
               key: "rebel_attackShuttle",
            },
            "rebel_auzituckGunship":
            {
               name: "Auzituck Gunship",
               shipKey: Ship.AUZITUCK_GUNSHIP,
               factionKey: Faction.REBEL,
               wave: "11",
               key: "rebel_auzituckGunship",
            },
            "rebel_bWing":
            {
               name: "B-Wing",
               shipKey: Ship.B_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_B-Wing.png",
               wave: "3",
               key: "rebel_bWing",
            },
            "rebel_bWingV2":
            {
               name: "B-Wing v2",
               shipKey: Ship.B_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_B-Wing_v2.png",
               wave: "Aces",
               key: "rebel_bWingV2",
            },
            "rebel_eWing":
            {
               name: "E-Wing",
               shipKey: Ship.E_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_E-Wing.png",
               wave: "4",
               key: "rebel_eWing",
            },
            "rebel_hwk290":
            {
               name: "HWK-290",
               shipKey: Ship.HWK_290,
               factionKey: Faction.REBEL,
               image: "HWK-290.png",
               wave: "3",
               key: "rebel_hwk290",
            },
            "rebel_kWing":
            {
               name: "K-Wing",
               shipKey: Ship.K_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_K-Wing.png",
               wave: "7",
               key: "rebel_kWing",
            },
            "rebel_scurrgH6Bomber":
            {
               name: "Scurrg H-6 Bomber",
               shipKey: Ship.SCURRG_H_6_BOMBER,
               factionKey: Faction.REBEL,
               wave: "11",
               key: "rebel_scurrgH6Bomber",
            },
            "rebel_sheathipedeClassShuttle":
            {
               name: "Sheathipede-class Shuttle",
               shipKey: Ship.SHEATHIPEDE_CLASS_SHUTTLE,
               factionKey: Faction.REBEL,
               wave: "12",
               key: "rebel_sheathipedeClassShuttle",
            },
            "rebel_tieFighter":
            {
               name: "TIE Fighter",
               shipKey: Ship.TIE_FIGHTER,
               factionKey: Faction.REBEL,
               image: "Rebel_Sabines_TIE_Fighter.png",
               wave: "10",
               key: "rebel_tieFighter",
            },
            "rebel_uWing":
            {
               name: "U-Wing",
               shipKey: Ship.U_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_U-Wing.png",
               wave: "10",
               key: "rebel_uWing",
            },
            "rebel_vcx100":
            {
               name: "VCX-100",
               shipKey: Ship.VCX_100,
               factionKey: Faction.REBEL,
               image: "Rebel_VCX-100.png",
               wave: "8",
               key: "rebel_vcx100",
            },
            "rebel_xWing":
            {
               name: "X-Wing",
               shipKey: Ship.X_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_X-Wing.png",
               wave: "1",
               key: "rebel_xWing",
            },
            "rebel_yWing":
            {
               name: "Y-Wing",
               shipKey: Ship.Y_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_Y-Wing.png",
               wave: "1",
               key: "rebel_yWing",
            },
            "rebel_yt1300":
            {
               name: "YT-1300",
               shipKey: Ship.YT_1300,
               factionKey: Faction.REBEL,
               image: "Rebel_YT-1300.png",
               wave: "2",
               key: "rebel_yt1300",
            },
            "rebel_yt2400":
            {
               name: "YT-2400",
               shipKey: Ship.YT_2400,
               factionKey: Faction.REBEL,
               image: "Rebel_YT-2400.png",
               wave: "5",
               key: "rebel_yt2400",
            },
            "rebel_z95Headhunter":
            {
               name: "Z-95 Headhunter",
               shipKey: Ship.Z_95_HEADHUNTER,
               factionKey: Faction.REBEL,
               image: "Rebel_Z-95_Headhunter.png",
               wave: "4",
               key: "rebel_z95Headhunter",
            },

            // Resistance.
            "resistance_bSf17Bomber":
            {
               name: "B/SF-17 Bomber",
               shipKey: Ship.B_SF_17_BOMBER,
               factionKey: Faction.RESISTANCE,
               wave: "13",
               key: "resistance_bSf17Bomber",
            },
            "resistance_t70XWing":
            {
               name: "T-70 X-Wing",
               shipKey: Ship.T_70_X_WING,
               factionKey: Faction.RESISTANCE,
               image: "Resistance_T-70_X-Wing.png",
               wave: "8",
               key: "resistance_t70XWing",
            },
            "resistance_t70XWingV2":
            {
               name: "T-70 X-Wing v2",
               shipKey: Ship.T_70_X_WING,
               factionKey: Faction.RESISTANCE,
               image: "Resistance_T-70_X-Wing_v2.png",
               wave: "Aces",
               key: "resistance_t70XWingV2",
            },
            "resistance_yt1300":
            {
               name: "YT-1300",
               shipKey: Ship.YT_1300,
               factionKey: Faction.RESISTANCE,
               image: "Resistance_YT-1300.png",
               wave: "Aces",
               key: "resistance_yt1300",
            },

            // Scum & Villainy.
            "scum_aggressor":
            {
               name: "Aggressor",
               shipKey: Ship.AGGRESSOR,
               factionKey: Faction.SCUM,
               image: "Scum_Aggressor.png",
               wave: "6",
               key: "scum_aggressor",
            },
            "scum_firespray31":
            {
               name: "Firespray-31",
               shipKey: Ship.FIRESPRAY_31,
               factionKey: Faction.SCUM,
               image: "Firespray-31.png",
               wave: "6",
               key: "scum_firespray31",
            },
            "scum_g1aStarfighter":
            {
               name: "G-1A Starfighter",
               shipKey: Ship.G_1A_STARFIGHTER,
               factionKey: Faction.SCUM,
               image: "Scum_G-1A_Starfighter.png",
               wave: "8",
               key: "scum_g1aStarfighter",
            },
            "scum_hwk290":
            {
               name: "HWK-290",
               shipKey: Ship.HWK_290,
               factionKey: Faction.SCUM,
               image: "HWK-290.png",
               wave: "6",
               key: "scum_hwk290",
            },
            "scum_jumpMaster5000":
            {
               name: "JumpMaster 5000",
               shipKey: Ship.JUMP_MASTER_5000,
               factionKey: Faction.SCUM,
               image: "Scum_JumpMaster_5000.png",
               wave: "8",
               key: "scum_jumpMaster5000",
            },
            "scum_kihraxzFighter":
            {
               name: "Kihraxz Fighter",
               shipKey: Ship.KIHRAXZ_FIGHTER,
               factionKey: Faction.SCUM,
               image: "Scum_KihraxzFighter.png",
               wave: "7",
               key: "scum_kihraxzFighter",
            },
            "scum_kihraxzFighterV2":
            {
               name: "Kihraxz Fighter v2",
               shipKey: Ship.KIHRAXZ_FIGHTER,
               factionKey: Faction.SCUM,
               wave: "Aces",
               key: "scum_kihraxzFighterV2",
            },
            "scum_lancerClassPursuitCraft":
            {
               name: "Lancer-class Pursuit Craft",
               shipKey: Ship.LANCER_CLASS_PURSUIT_CRAFT,
               factionKey: Faction.SCUM,
               image: "Scum_Lancer-class_Pursuit_Craft.png",
               wave: "9",
               key: "scum_lancerClassPursuitCraft",
            },
            "scum_m12LKimogilaFighter":
            {
               name: "M12-L Kimogila Fighter",
               shipKey: Ship.M12_L_KIMOGILA_FIGHTER,
               factionKey: Faction.SCUM,
               wave: "12",
               key: "scum_m12LKimogilaFighter",
            },
            "scum_m3AInterceptor":
            {
               name: "M3-A Interceptor",
               shipKey: Ship.M3_A_INTERCEPTOR,
               factionKey: Faction.SCUM,
               image: "Scum_M3-A_Interceptor.png",
               wave: "6",
               key: "scum_m3AInterceptor",
            },
            "scum_m3AInterceptorV2":
            {
               name: "M3-A Interceptor v2",
               shipKey: Ship.M3_A_INTERCEPTOR,
               factionKey: Faction.SCUM,
               image: "Scum_M3-A_Interceptor_v2.png",
               wave: "Aces",
               key: "scum_m3AInterceptorV2",
            },
            "scum_protectorateStarfighter":
            {
               name: "Protectorate Starfighter",
               shipKey: Ship.PROTECTORATE_STARFIGHTER,
               factionKey: Faction.SCUM,
               image: "Scum_Protectorate_Starfighter.png",
               wave: "9",
               key: "scum_protectorateStarfighter",
            },
            "scum_quadjumper":
            {
               name: "Quadjumper",
               shipKey: Ship.QUADJUMPER,
               factionKey: Faction.SCUM,
               wave: "10",
               key: "scum_quadjumper",
            },
            "scum_scurrgH6Bomber":
            {
               name: "Scurrg H-6 Bomber",
               shipKey: Ship.SCURRG_H_6_BOMBER,
               factionKey: Faction.SCUM,
               wave: "11",
               key: "scum_scurrgH6Bomber",
            },
            "scum_starViper":
            {
               name: "StarViper",
               shipKey: Ship.STAR_VIPER,
               factionKey: Faction.SCUM,
               image: "Scum_StarViper.png",
               wave: "6",
               key: "scum_starViper",
            },
            "scum_starViperV2":
            {
               name: "StarViper v2",
               shipKey: Ship.STAR_VIPER,
               factionKey: Faction.SCUM,
               wave: "Aces",
               key: "scum_starViperV2",
            },
            "scum_yWing":
            {
               name: "Y-Wing",
               shipKey: Ship.Y_WING,
               factionKey: Faction.SCUM,
               image: "Scum_Y-Wing.png",
               wave: "6",
               key: "scum_yWing",
            },
            "scum_yv666":
            {
               name: "YV-666",
               shipKey: Ship.YV_666,
               factionKey: Faction.SCUM,
               image: "Scum_YV-666.png",
               wave: "7",
               key: "scum_yv666",
            },
            "scum_z95Headhunter":
            {
               name: "Z-95 Headhunter",
               shipKey: Ship.Z_95_HEADHUNTER,
               factionKey: Faction.SCUM,
               image: "Scum_Z-95_Headhunter.png",
               wave: "6",
               key: "scum_z95Headhunter",
            },

            ////////////////////////////////////////////////////////////////////
            // Huge ships.
            "imperial_gozantiClassCruiser":
            {
               name: "Gozanti-class Cruiser",
               shipKey: Ship.GOZANTI_CLASS_CRUISER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_Gozanti-class_Cruiser.png",
               wave: "Huge",
               key: "imperial_gozantiClassCruiser",
            },
            "imperial_raiderClassCorvette":
            {
               name: "Raider-class Corvette",
               shipKey: Ship.RAIDER_CLASS_CORVETTE,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_Raider-class_Corvette.png",
               wave: "Huge",
               key: "imperial_raiderClassCorvette",
            },
            "rebel_cr90Corvette":
            {
               name: "CR90 Corvette",
               shipKey: Ship.CR90_CORVETTE,
               factionKey: Faction.REBEL,
               image: "Rebel_CR90_Corvette.png",
               wave: "Huge",
               key: "rebel_cr90Corvette",
            },
            "rebel_gr75MediumTransport":
            {
               name: "GR-75 Medium Transport",
               shipKey: Ship.GR_75_MEDIUM_TRANSPORT,
               factionKey: Faction.REBEL,
               image: "Rebel_GR-75_Medium_Transport.png",
               wave: "Huge",
               key: "rebel_gr75MediumTransport",
            },
            "scum_cRocCruiser":
            {
               name: "C-ROC Cruiser",
               shipKey: Ship.C_ROC_CRUISER,
               factionKey: Faction.SCUM,
               image: "Scum_C-ROC_Cruiser.png",
               wave: "Huge",
               key: "scum_cRocCruiser",
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
