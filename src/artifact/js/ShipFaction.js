"use strict";

define(["common/js/ArrayAugments", "common/js/InputValidator", "artifact/js/Faction", "artifact/js/Ship"],
   function(ArrayAugments, InputValidator, Faction, Ship)
   {
      var ShipFaction = {
         // First Order.
         FIRST_ORDER_TIE_FO_FIGHTER: "firstOrder_tiefofighter",
         FIRST_ORDER_TIE_SF_FIGHTER: "firstOrder_tiesffighter",
         FIRST_ORDER_TIE_SILENCER: "firstOrder_tiesilencer",
         FIRST_ORDER_UPSILON_CLASS_SHUTTLE: "firstOrder_upsilonclassshuttle",

         // Imperial.
         IMPERIAL_ALPHA_CLASS_STAR_WING: "imperial_alphaclassstarwing",
         IMPERIAL_FIRESPRAY_31: "imperial_firespray31",
         IMPERIAL_LAMBDA_CLASS_SHUTTLE: "imperial_lambdaclassshuttle",
         IMPERIAL_TIE_ADVANCED: "imperial_tieadvanced",
         IMPERIAL_TIE_ADVANCED_PROTOTYPE: "imperial_tieadvprototype",
         IMPERIAL_TIE_AGGRESSOR: "imperial_tieaggressor",
         IMPERIAL_TIE_BOMBER: "imperial_tiebomber",
         IMPERIAL_TIE_BOMBER_V2: "imperial_tiebomberv2",
         IMPERIAL_TIE_DEFENDER: "imperial_tiedefender",
         IMPERIAL_TIE_DEFENDER_V2: "imperial_tiedefenderv2",
         IMPERIAL_TIE_FIGHTER: "imperial_tiefighter",
         IMPERIAL_TIE_INTERCEPTOR: "imperial_tieinterceptor",
         IMPERIAL_TIE_INTERCEPTOR_V2: "imperial_tieinterceptorv2",
         IMPERIAL_TIE_INTERCEPTOR_V3: "imperial_tieinterceptorv3",
         IMPERIAL_TIE_PHANTOM: "imperial_tiephantom",
         IMPERIAL_TIE_PUNISHER: "imperial_tiepunisher",
         IMPERIAL_TIE_STRIKER: "imperial_tiestriker",
         IMPERIAL_VT_49_DECIMATOR: "imperial_vt49decimator",

         // Rebel.
         REBEL_ARC_170: "rebel_arc170",
         REBEL_ATTACK_SHUTTLE: "rebel_attackshuttle",
         REBEL_AUZITUCK_GUNSHIP: "rebel_auzituckgunship",
         REBEL_A_WING: "rebel_awing",
         REBEL_A_WING_V2: "rebel_awingv2",
         REBEL_B_WING: "rebel_bwing",
         REBEL_B_WING_V2: "rebel_bwingv2",
         REBEL_E_WING: "rebel_ewing",
         REBEL_HWK_290: "rebel_hwk290",
         REBEL_K_WING: "rebel_kwing",
         REBEL_SCURRG_H_6_BOMBER: "rebel_scurrgh6bomber",
         REBEL_SHEATHIPEDE_CLASS_SHUTTLE: "rebel_sheathipedeclassshuttle",
         REBEL_TIE_FIGHTER: "rebel_tiefighter",
         REBEL_U_WING: "rebel_uwing",
         REBEL_VCX_100: "rebel_vcx100",
         REBEL_X_WING: "rebel_xwing",
         REBEL_YT_1300: "rebel_yt1300",
         REBEL_YT_2400: "rebel_yt2400",
         REBEL_Y_WING: "rebel_ywing",
         REBEL_Z_95_HEADHUNTER: "rebel_z95headhunter",

         // Resistance.
         RESISTANCE_B_SF_17_BOMBER: "resistance_bsf17bomber",
         RESISTANCE_T_70_X_WING: "resistance_t70xwing",
         RESISTANCE_T_70_X_WING_V2: "resistance_t70xwingv2",
         RESISTANCE_YT_1300: "resistance_yt1300",

         // Scum & Villainy.
         SCUM_AGGRESSOR: "scum_aggressor",
         SCUM_FIRESPRAY_31: "scum_firespray31",
         SCUM_G_1A_STARFIGHTER: "scum_g1astarfighter",
         SCUM_HWK_290: "scum_hwk290",
         SCUM_JUMP_MASTER_5000: "scum_jumpmaster5000",
         SCUM_KIHRAXZ_FIGHTER: "scum_kihraxzfighter",
         SCUM_KIHRAXZ_FIGHTER_V2: "scum_kihraxzfighterv2",
         SCUM_LANCER_CLASS_PURSUIT_CRAFT: "scum_lancerclasspursuitcraft",
         SCUM_M12_L_KIMOGILA_FIGHTER: "scum_m12lkimogilafighter",
         SCUM_M3_A_INTERCEPTOR: "scum_m3ainterceptor",
         SCUM_M3_A_INTERCEPTOR_V2: "scum_m3ainterceptorv2",
         SCUM_PROTECTORATE_STARFIGHTER: "scum_protectoratestarfighter",
         SCUM_QUADJUMPER: "scum_quadjumper",
         SCUM_SCURRG_H_6_BOMBER: "scum_scurrgh6bomber",
         SCUM_STAR_VIPER: "scum_starviper",
         SCUM_STAR_VIPER_V2: "scum_starviperv2",
         SCUM_YV_666: "scum_yv666",
         SCUM_Y_WING: "scum_ywing",
         SCUM_Z_95_HEADHUNTER: "scum_z95headhunter",

         // Huge ships.
         IMPERIAL_GOZANTI_CLASS_CRUISER: "imperial_gozantiClassCruiser",
         IMPERIAL_RAIDER_CLASS_CORVETTE: "imperial_raiderClassCorvette",
         REBEL_CR90_CORVETTE: "rebel_cr90Corvette",
         REBEL_GR_75_MEDIUM_TRANSPORT: "rebel_gr75MediumTransport",
         SCUM_C_ROC_CRUISER: "scum_cRocCruiser",

         properties:
         {
            // First Order.
            "firstOrder_tiefofighter":
            {
               name: "TIE/fo Fighter",
               shipKey: Ship.TIE_FO_FIGHTER,
               factionKey: Faction.FIRST_ORDER,
               image: "FirstOrder_TIE_fo_Fighter.png",
               wave: "8",
               key: "firstOrder_tiefofighter",
            },
            "firstOrder_tiesffighter":
            {
               name: "TIE/sf Fighter",
               shipKey: Ship.TIE_SF_FIGHTER,
               factionKey: Faction.FIRST_ORDER,
               image: "FirstOrder_TIE_sf_Fighter.png",
               wave: "9",
               key: "firstOrder_tiesffighter",
            },
            "firstOrder_tiesilencer":
            {
               name: "TIE Silencer",
               shipKey: Ship.TIE_SILENCER,
               factionKey: Faction.FIRST_ORDER,
               image: "FirstOrder_TIE_Silencer.png",
               wave: "13",
               key: "firstOrder_tiesilencer",
            },
            "firstOrder_upsilonclassshuttle":
            {
               name: "Upsilon-class Shuttle",
               shipKey: Ship.UPSILON_CLASS_SHUTTLE,
               factionKey: Faction.FIRST_ORDER,
               image: "FirstOrder_Upsilon-class_Shuttle.png",
               wave: "10",
               key: "firstOrder_upsilonclassshuttle",
            },

            // Imperial.
            "imperial_alphaclassstarwing":
            {
               name: "Alpha-class Star Wing",
               shipKey: Ship.ALPHA_CLASS_STAR_WING,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_Alpha-class_Star_Wing.png",
               wave: "12",
               key: "imperial_alphaclassstarwing",
            },
            "imperial_firespray31":
            {
               name: "Firespray-31 (Imperial)",
               shipKey: Ship.FIRESPRAY_31,
               factionKey: Faction.IMPERIAL,
               image: "Firespray-31.png",
               wave: "2",
               key: "imperial_firespray31",
            },
            "imperial_lambdaclassshuttle":
            {
               name: "Lambda-class Shuttle",
               shipKey: Ship.LAMBDA_CLASS_SHUTTLE,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_Lambda-class_Shuttle.png",
               wave: "3",
               key: "imperial_lambdaclassshuttle",
            },
            "imperial_tieadvanced":
            {
               name: "TIE Advanced",
               shipKey: Ship.TIE_ADVANCED,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Advanced.png",
               wave: "1",
               key: "imperial_tieadvanced",
            },
            "imperial_tieadvprototype":
            {
               name: "TIE Advanced Prototype",
               shipKey: Ship.TIE_ADVANCED_PROTOTYPE,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Advanced_Prototype.png",
               wave: "8",
               key: "imperial_tieadvprototype",
            },
            "imperial_tieaggressor":
            {
               name: "TIE Aggressor",
               shipKey: Ship.TIE_AGGRESSOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Aggressor.png",
               wave: "11",
               key: "imperial_tieaggressor",
            },
            "imperial_tiebomber":
            {
               name: "TIE Bomber",
               shipKey: Ship.TIE_BOMBER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Bomber.png",
               wave: "3",
               key: "imperial_tiebomber",
            },
            "imperial_tiebomberv2":
            {
               name: "TIE Bomber v2",
               shipKey: Ship.TIE_BOMBER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Bomber_v2.png",
               wave: "Aces",
               key: "imperial_tiebomberv2",
            },
            "imperial_tiedefender":
            {
               name: "TIE Defender",
               shipKey: Ship.TIE_DEFENDER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Defender.png",
               wave: "4",
               key: "imperial_tiedefender",
            },
            "imperial_tiedefenderv2":
            {
               name: "TIE Defender v2",
               shipKey: Ship.TIE_DEFENDER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Defender_v2.png",
               wave: "Aces",
               key: "imperial_tiedefenderv2",
            },
            "imperial_tiefighter":
            {
               name: "TIE Fighter (Imperial)",
               shipKey: Ship.TIE_FIGHTER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Fighter.png",
               wave: "1",
               key: "imperial_tiefighter",
            },
            "imperial_tieinterceptor":
            {
               name: "TIE Interceptor",
               shipKey: Ship.TIE_INTERCEPTOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Interceptor.png",
               wave: "2",
               key: "imperial_tieinterceptor",
            },
            "imperial_tieinterceptorv2":
            {
               name: "TIE Interceptor v2",
               shipKey: Ship.TIE_INTERCEPTOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Interceptor_v2.png",
               wave: "Aces",
               key: "imperial_tieinterceptorv2",
            },
            "imperial_tieinterceptorv3":
            {
               name: "TIE Interceptor v3",
               shipKey: Ship.TIE_INTERCEPTOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Interceptor_v3.png",
               wave: "Aces",
               key: "imperial_tieinterceptorv3",
            },
            "imperial_tiephantom":
            {
               name: "TIE Phantom",
               shipKey: Ship.TIE_PHANTOM,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Phantom.png",
               wave: "4",
               key: "imperial_tiephantom",
            },
            "imperial_tiepunisher":
            {
               name: "TIE Punisher",
               shipKey: Ship.TIE_PUNISHER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Punisher.png",
               wave: "7",
               key: "imperial_tiepunisher",
            },
            "imperial_tiestriker":
            {
               name: "TIE Striker",
               shipKey: Ship.TIE_STRIKER,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_TIE_Striker.png",
               wave: "10",
               key: "imperial_tiestriker",
            },
            "imperial_vt49decimator":
            {
               name: "VT-49 Decimator",
               shipKey: Ship.VT_49_DECIMATOR,
               factionKey: Faction.IMPERIAL,
               image: "Imperial_VT-49_Decimator.png",
               wave: "5",
               key: "imperial_vt49decimator",
            },

            // Rebel.
            "rebel_arc170":
            {
               name: "ARC-170",
               shipKey: Ship.ARC_170,
               factionKey: Faction.REBEL,
               image: "Rebel_ARC-170.png",
               wave: "9",
               key: "rebel_arc170",
            },
            "rebel_attackshuttle":
            {
               name: "Attack Shuttle",
               shipKey: Ship.ATTACK_SHUTTLE,
               factionKey: Faction.REBEL,
               image: "Rebel_Attack_Shuttle.png",
               wave: "8",
               key: "rebel_attackshuttle",
            },
            "rebel_auzituckgunship":
            {
               name: "Auzituck Gunship",
               shipKey: Ship.AUZITUCK_GUNSHIP,
               factionKey: Faction.REBEL,
               image: "Rebel_Auzituck_Gunship.png",
               wave: "11",
               key: "rebel_auzituckgunship",
            },
            "rebel_awing":
            {
               name: "A-Wing",
               shipKey: Ship.A_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_A-Wing.png",
               wave: "2",
               key: "rebel_awing",
            },
            "rebel_awingv2":
            {
               name: "A-Wing v2",
               shipKey: Ship.A_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_A-Wing_v2.png",
               wave: "Aces",
               key: "rebel_awingv2",
            },
            "rebel_bwing":
            {
               name: "B-Wing",
               shipKey: Ship.B_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_B-Wing.png",
               wave: "3",
               key: "rebel_bwing",
            },
            "rebel_bwingv2":
            {
               name: "B-Wing v2",
               shipKey: Ship.B_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_B-Wing_v2.png",
               wave: "Aces",
               key: "rebel_bwingv2",
            },
            "rebel_ewing":
            {
               name: "E-Wing",
               shipKey: Ship.E_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_E-Wing.png",
               wave: "4",
               key: "rebel_ewing",
            },
            "rebel_hwk290":
            {
               name: "HWK-290 (Rebel)",
               shipKey: Ship.HWK_290,
               factionKey: Faction.REBEL,
               image: "HWK-290.png",
               wave: "3",
               key: "rebel_hwk290",
            },
            "rebel_kwing":
            {
               name: "K-Wing",
               shipKey: Ship.K_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_K-Wing.png",
               wave: "7",
               key: "rebel_kwing",
            },
            "rebel_scurrgh6bomber":
            {
               name: "Scurrg H-6 Bomber (Rebel)",
               shipKey: Ship.SCURRG_H_6_BOMBER,
               factionKey: Faction.REBEL,
               image: "Scurrg_H-6_Bomber.png",
               wave: "11",
               key: "rebel_scurrgh6bomber",
            },
            "rebel_sheathipedeclassshuttle":
            {
               name: "Sheathipede-class Shuttle",
               shipKey: Ship.SHEATHIPEDE_CLASS_SHUTTLE,
               factionKey: Faction.REBEL,
               image: "Rebel_Sheathipede-class_Shuttle.png",
               wave: "12",
               key: "rebel_sheathipedeclassshuttle",
            },
            "rebel_tiefighter":
            {
               name: "TIE Fighter (Rebel)",
               shipKey: Ship.TIE_FIGHTER,
               factionKey: Faction.REBEL,
               image: "Rebel_TIE_Fighter.png",
               wave: "10",
               key: "rebel_tiefighter",
            },
            "rebel_uwing":
            {
               name: "U-Wing",
               shipKey: Ship.U_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_U-Wing.png",
               wave: "10",
               key: "rebel_uwing",
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
            "rebel_xwing":
            {
               name: "X-Wing",
               shipKey: Ship.X_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_X-Wing.png",
               wave: "1",
               key: "rebel_xwing",
            },
            "rebel_yt1300":
            {
               name: "YT-1300 (Rebel)",
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
            "rebel_ywing":
            {
               name: "Y-Wing (Rebel)",
               shipKey: Ship.Y_WING,
               factionKey: Faction.REBEL,
               image: "Rebel_Y-Wing.png",
               wave: "1",
               key: "rebel_ywing",
            },
            "rebel_z95headhunter":
            {
               name: "Z-95 Headhunter (Rebel)",
               shipKey: Ship.Z_95_HEADHUNTER,
               factionKey: Faction.REBEL,
               image: "Rebel_Z-95_Headhunter.png",
               wave: "4",
               key: "rebel_z95headhunter",
            },

            // Resistance.
            "resistance_bsf17bomber":
            {
               name: "B/SF-17 Bomber",
               shipKey: Ship.B_SF_17_BOMBER,
               factionKey: Faction.RESISTANCE,
               image: "Resistance_B_SF-17_Bomber.png",
               wave: "13",
               key: "resistance_bsf17bomber",
            },
            "resistance_t70xwing":
            {
               name: "T-70 X-Wing",
               shipKey: Ship.T_70_X_WING,
               factionKey: Faction.RESISTANCE,
               image: "Resistance_T-70_X-Wing.png",
               wave: "8",
               key: "resistance_t70xwing",
            },
            "resistance_t70xwingv2":
            {
               name: "T-70 X-Wing v2",
               shipKey: Ship.T_70_X_WING,
               factionKey: Faction.RESISTANCE,
               image: "Resistance_T-70_X-Wing_v2.png",
               wave: "Aces",
               key: "resistance_t70xwingv2",
            },
            "resistance_yt1300":
            {
               name: "YT-1300 (Resistance)",
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
               name: "Firespray-31 (Scum)",
               shipKey: Ship.FIRESPRAY_31,
               factionKey: Faction.SCUM,
               image: "Firespray-31.png",
               wave: "6",
               key: "scum_firespray31",
            },
            "scum_g1astarfighter":
            {
               name: "G-1A Starfighter",
               shipKey: Ship.G_1A_STARFIGHTER,
               factionKey: Faction.SCUM,
               image: "Scum_G-1A_Starfighter.png",
               wave: "8",
               key: "scum_g1astarfighter",
            },
            "scum_hwk290":
            {
               name: "HWK-290 (Scum)",
               shipKey: Ship.HWK_290,
               factionKey: Faction.SCUM,
               image: "HWK-290.png",
               wave: "6",
               key: "scum_hwk290",
            },
            "scum_jumpmaster5000":
            {
               name: "JumpMaster 5000",
               shipKey: Ship.JUMP_MASTER_5000,
               factionKey: Faction.SCUM,
               image: "Scum_JumpMaster_5000.png",
               wave: "8",
               key: "scum_jumpmaster5000",
            },
            "scum_kihraxzfighter":
            {
               name: "Kihraxz Fighter",
               shipKey: Ship.KIHRAXZ_FIGHTER,
               factionKey: Faction.SCUM,
               image: "Scum_KihraxzFighter.png",
               wave: "7",
               key: "scum_kihraxzfighter",
            },
            "scum_kihraxzfighterv2":
            {
               name: "Kihraxz Fighter v2",
               shipKey: Ship.KIHRAXZ_FIGHTER,
               factionKey: Faction.SCUM,
               image: "Scum_Kihraxz_Fighter_v2.png",
               wave: "Aces",
               key: "scum_kihraxzfighterv2",
            },
            "scum_lancerclasspursuitcraft":
            {
               name: "Lancer-class Pursuit Craft",
               shipKey: Ship.LANCER_CLASS_PURSUIT_CRAFT,
               factionKey: Faction.SCUM,
               image: "Scum_Lancer-class_Pursuit_Craft.png",
               wave: "9",
               key: "scum_lancerclasspursuitcraft",
            },
            "scum_m12lkimogilafighter":
            {
               name: "M12-L Kimogila Fighter",
               shipKey: Ship.M12_L_KIMOGILA_FIGHTER,
               factionKey: Faction.SCUM,
               image: "Scum_M12-L_Kimogila_Fighter.png",
               wave: "12",
               key: "scum_m12lkimogilafighter",
            },
            "scum_m3ainterceptor":
            {
               name: "M3-A Interceptor",
               shipKey: Ship.M3_A_INTERCEPTOR,
               factionKey: Faction.SCUM,
               image: "Scum_M3-A_Interceptor.png",
               wave: "6",
               key: "scum_m3ainterceptor",
            },
            "scum_m3ainterceptorv2":
            {
               name: "M3-A Interceptor v2",
               shipKey: Ship.M3_A_INTERCEPTOR,
               factionKey: Faction.SCUM,
               image: "Scum_M3-A_Interceptor_v2.png",
               wave: "Aces",
               key: "scum_m3ainterceptorv2",
            },
            "scum_protectoratestarfighter":
            {
               name: "Protectorate Starfighter",
               shipKey: Ship.PROTECTORATE_STARFIGHTER,
               factionKey: Faction.SCUM,
               image: "Scum_Protectorate_Starfighter.png",
               wave: "9",
               key: "scum_protectoratestarfighter",
            },
            "scum_quadjumper":
            {
               name: "Quadjumper",
               shipKey: Ship.QUADJUMPER,
               factionKey: Faction.SCUM,
               image: "Scum_Quadjumper.png",
               wave: "10",
               key: "scum_quadjumper",
            },
            "scum_scurrgh6bomber":
            {
               name: "Scurrg H-6 Bomber (Scum)",
               shipKey: Ship.SCURRG_H_6_BOMBER,
               factionKey: Faction.SCUM,
               image: "Scurrg_H-6_Bomber.png",
               wave: "11",
               key: "scum_scurrgh6bomber",
            },
            "scum_starviper":
            {
               name: "StarViper",
               shipKey: Ship.STAR_VIPER,
               factionKey: Faction.SCUM,
               image: "Scum_StarViper.png",
               wave: "6",
               key: "scum_starviper",
            },
            "scum_starviperv2":
            {
               name: "StarViper v2",
               shipKey: Ship.STAR_VIPER,
               factionKey: Faction.SCUM,
               image: "Scum_StarViper_v2.png",
               wave: "Aces",
               key: "scum_starviperv2",
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
            "scum_ywing":
            {
               name: "Y-Wing (Scum)",
               shipKey: Ship.Y_WING,
               factionKey: Faction.SCUM,
               image: "Scum_Y-Wing.png",
               wave: "6",
               key: "scum_ywing",
            },
            "scum_z95headhunter":
            {
               name: "Z-95 Headhunter (Scum)",
               shipKey: Ship.Z_95_HEADHUNTER,
               factionKey: Faction.SCUM,
               image: "Scum_Z-95_Headhunter.png",
               wave: "6",
               key: "scum_z95headhunter",
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

      //////////////////////////////////////////////////////////////////////////
      // Utility methods.

      ShipFaction.keysByFaction = function(factionKey, isStrict)
      {
         InputValidator.validateIsString("factionKey", factionKey);

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
         InputValidator.validateIsString("shipKey", shipKey);
         InputValidator.validateIsString("factionKey", factionKey);

         var answer = this.keysByFaction(factionKey, isStrict).filter(function(shipFactionKey)
         {
            return ShipFaction.properties[shipFactionKey].shipKey === shipKey;
         });

         return answer;
      };

      ShipFaction.shipKeysByFaction = function(factionKey, isStrict)
      {
         InputValidator.validateIsString("factionKey", factionKey);

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

      if (Object.freeze)
      {
         Object.freeze(ShipFaction);
      }

      return ShipFaction;
   });
