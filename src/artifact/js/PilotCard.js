"use strict";

define(["common/js/ArrayAugments", "common/js/InputValidator", "artifact/js/CardType", "artifact/js/Faction", "artifact/js/ShipFaction", "artifact/js/UpgradeType"],
   function(ArrayAugments, InputValidator, CardType, Faction, ShipFaction, UpgradeType)
   {
      var PilotCard = {
         ACADEMY_PILOT: "academyPilot",
         AIREN_CRACKEN: "airenCracken",
         ALPHA_SQUADRON_PILOT: "alphaSquadronPilot",
         ARVEL_CRYNYD: "arvelCrynyd",
         ASAJJ_VENTRESS: "asajjVentress",
         AVENGER_SQUADRON_PILOT: "avengerSquadronPilot",
         BACKDRAFT: "backdraft",
         BACKSTABBER: "backstabber",
         BANDIT_SQUADRON_PILOT: "banditSquadronPilot",
         BARON_OF_THE_EMPIRE: "baronOfTheEmpire",
         BIGGS_DARKLIGHTER: "biggsDarklighter",
         BINAYRE_PIRATE: "binayrePirate",
         BLACK_EIGHT_SQ_PILOT: "blackEightSqPilot",
         BLACK_SQUADRON_PILOT: "blackSquadronPilot",
         BLACK_SUN_ACE: "blackSunAce",
         BLACK_SUN_ENFORCER: "blackSunEnforcer",
         BLACK_SUN_SOLDIER: "blackSunSoldier",
         BLACK_SUN_VIGO: "blackSunVigo",
         BLACKMOON_SQUADRON_PILOT: "blackmoonSquadronPilot",
         BLUE_ACE: "blueAce",
         BLUE_SQUADRON_NOVICE: "blueSquadronNovice",
         BLUE_SQUADRON_PATHFINDER: "blueSquadronPathfinder",
         BLUE_SQUADRON_PILOT: "blueSquadronPilot",
         BOBA_FETT_IMPERIAL: "bobaFettImperial",
         BOBA_FETT_SCUM: "bobaFettScum",
         BODHI_ROOK: "bodhiRook",
         BOSSK: "bossk",
         BOUNTY_HUNTER: "bountyHunter",
         BRAYLEN_STRAMM: "braylenStramm",
         C_ROC_CRUISER: "cRocCruiser",
         CAPTAIN_JONUS: "captainJonus",
         CAPTAIN_KAGI: "captainKagi",
         CAPTAIN_OICUNN: "captainOicunn",
         CAPTAIN_REX: "captainRex",
         CAPTAIN_YORR: "captainYorr",
         CARNOR_JAX: "carnorJax",
         CARTEL_MARAUDER: "cartelMarauder",
         CARTEL_SPACER: "cartelSpacer",
         CASSIAN_ANDOR: "cassianAndor",
         CHASER: "chaser",
         CHEWBACCA: "chewbacca",
         CHEWBACCA_HOTR: "chewbaccaHotr",
         CHOPPER: "chopper",
         COLONEL_JENDON: "colonelJendon",
         COLONEL_VESSERY: "colonelVessery",
         COMMANDER_ALOZEN: "commanderAlozen",
         COMMANDER_KENKIRK: "commanderKenkirk",
         CONCORD_DAWN_ACE: "concordDawnAce",
         CONCORD_DAWN_VETERAN: "concordDawnVeteran",
         CONTRACTED_SCOUT: "contractedScout",
         CORRAN_HORN: "corranHorn",
         COUNTESS_RYAD: "countessRyad",
         CR90_CORVETTE: "cr90Corvette",
         CUTLASS_SQUADRON_PILOT: "cutlassSquadronPilot",
         DACE_BONEARM: "daceBonearm",
         DAGGER_SQUADRON_PILOT: "daggerSquadronPilot",
         DARK_CURSE: "darkCurse",
         DARTH_VADER: "darthVader",
         DASH_RENDAR: "dashRendar",
         DEATHFIRE: "deathfire",
         DEATHRAIN: "deathrain",
         DELTA_SQUADRON_PILOT: "deltaSquadronPilot",
         DENGAR: "dengar",
         DREA_RENTHAL: "dreaRenthal",
         DUTCH_VANDER: "dutchVander",
         EADEN_VRILL: "eadenVrill",
         ECHO: "echo",
         ELLO_ASTY: "elloAsty",
         EMON_AZZAMEEN: "emonAzzameen",
         EPSILON_ACE: "epsilonAce",
         EPSILON_LEADER: "epsilonLeader",
         EPSILON_SQUADRON_PILOT: "epsilonSquadronPilot",
         ESEGE_TUKETU: "esegeTuketu",
         ETAHN_ABAHT: "etahnAbaht",
         EZRA_BRIDGER: "ezraBridger",
         FELS_WRATH: "felsWrath",
         FENN_RAU: "fennRau",
         FOUR_LOM: "fourLom",
         GAMMA_SQUADRON_PILOT: "gammaSquadronPilot",
         GAMMA_SQUADRON_VETERAN: "gammaSquadronVeteran",
         GAND_FINDSMAN: "gandFindsman",
         GARVEN_DREIS: "garvenDreis",
         GEMMER_SOJAN: "gemmerSojan",
         GENESIS_RED: "genesisRed",
         GLAIVE_SQUADRON_PILOT: "glaiveSquadronPilot",
         GOLD_SQUADRON_PILOT: "goldSquadronPilot",
         GOZANTI_CLASS_CRUISER: "gozantiClassCruiser",
         GR_75_MEDIUM_TRANSPORT: "gr75MediumTransport",
         GRAY_SQUADRON_PILOT: "graySquadronPilot",
         GRAZ_THE_HUNTER: "grazTheHunter",
         GREEN_SQUADRON_PILOT: "greenSquadronPilot",
         GUARDIAN_SQUADRON_PILOT: "guardianSquadronPilot",
         GURI: "guri",
         HAN_SOLO: "hanSolo",
         HAN_SOLO_HOTR: "hanSoloHotr",
         HEFF_TOBBER: "heffTobber",
         HERA_SYNDULLA_ATTACK_SHUTTLE: "heraSyndullaAttackShuttle",
         HERA_SYNDULLA_VCX_100: "heraSyndullaVcx100",
         HIRED_GUN: "hiredGun",
         HOBBIE_KLIVIAN: "hobbieKlivian",
         HORTON_SALM: "hortonSalm",
         HOWLRUNNER: "howlrunner",
         IBTISAM: "ibtisam",
         IG_88A: "ig88A",
         IG_88B: "ig88B",
         IG_88C: "ig88C",
         IG_88D: "ig88D",
         INALDRA: "inaldra",
         JAKE_FARRELL: "jakeFarrell",
         JAN_ORS: "janOrs",
         JEK_PORKINS: "jekPorkins",
         JESS_PAVA: "jessPava",
         JUNO_ECLIPSE: "junoEclipse",
         KAATO_LEEACHOS: "kaatoLeeachos",
         KAD_SOLUS: "kadSolus",
         KANAN_JARRUS: "kananJarrus",
         KATH_SCARLET_IMPERIAL: "kathScarletImperial",
         KATH_SCARLET_SCUM: "kathScarletScum",
         KAVIL: "kavil",
         KETSU_ONYO: "ketsuOnyo",
         KEYAN_FARLANDER: "keyanFarlander",
         KIR_KANOS: "kirKanos",
         KNAVE_SQUADRON_PILOT: "knaveSquadronPilot",
         KRASSIS_TRELIX: "krassisTrelix",
         KYLE_KATARN: "kyleKatarn",
         KYLO_REN: "kyloRen",
         LAETIN_ASHERA: "laetinAshera",
         LANDO_CALRISSIAN: "landoCalrissian",
         LATTS_RAZZI: "lattsRazzi",
         LEEBO: "leebo",
         LIEUTENANT_BLOUNT: "lieutenantBlount",
         LIEUTENANT_COLZET: "lieutenantColzet",
         LIEUTENANT_DORMITZ: "lieutenantDormitz",
         LIEUTENANT_LORRIR: "lieutenantLorrir",
         LOTHAL_REBEL: "lothalRebel",
         LUKE_SKYWALKER: "lukeSkywalker",
         MAAREK_STELE_TIE_ADVANCED: "maarekSteleTieAdvanced",
         MAAREK_STELE_TIE_DEFENDER: "maarekSteleTieDefender",
         MAJOR_RHYMER: "majorRhymer",
         MAJOR_STRIDAN: "majorStridan",
         MANAROO: "manaroo",
         MANDALORIAN_MERCENARY: "mandalorianMercenary",
         MAULER_MITHEL: "maulerMithel",
         MIRANDA_DONI: "mirandaDoni",
         MORALO_EVAL: "moraloEval",
         NASHTAH_PUP_PILOT: "nashtahPupPilot",
         NERA_DANTELS: "neraDantels",
         NDRU_SUHLAK: "ndruSuhlak",
         NIEN_NUNB: "nienNunb",
         NIGHT_BEAST: "nightBeast",
         NORRA_WEXLEY: "norraWexley",
         OBSIDIAN_SQUADRON_PILOT: "obsidianSquadronPilot",
         OLD_TEROCH: "oldTeroch",
         OMEGA_ACE: "omegaAce",
         OMEGA_LEADER: "omegaLeader",
         OMEGA_SPECIALIST: "omegaSpecialist",
         OMEGA_SQUADRON_PILOT: "omegaSquadronPilot",
         OMICRON_GROUP_PILOT: "omicronGroupPilot",
         ONYX_SQUADRON_PILOT: "onyxSquadronPilot",
         OUTER_RIM_SMUGGLER: "outerRimSmuggler",
         PALOB_GODALHI: "palobGodalhi",
         PATROL_LEADER: "patrolLeader",
         POE_DAMERON: "poeDameron",
         POE_DAMERON_HOTR: "poeDameronHotr",
         PRINCE_XIZOR: "princeXizor",
         PROTOTYPE_PILOT: "prototypePilot",
         QUICKDRAW: "quickdraw",
         QUINN_JAST: "quinnJast",
         RAIDER_CLASS_CORVETTE: "raiderClassCorvette",
         REAR_ADMIRAL_CHIRANEAU: "rearAdmiralChiraneau",
         REBEL_OPERATIVE: "rebelOperative",
         RED_ACE: "redAce",
         RED_SQUADRON_PILOT: "redSquadronPilot",
         RED_SQUADRON_VETERAN: "redSquadronVeteran",
         REDLINE: "redline",
         RESISTANCE_SYMPATHIZER: "resistanceSympathizer",
         REXLER_BRATH: "rexlerBrath",
         REY: "rey",
         ROARK_GARNET: "roarkGarnet",
         ROOKIE_PILOT: "rookiePilot",
         ROYAL_GUARD_PILOT: "royalGuardPilot",
         RUTHLESS_FREELANCER: "ruthlessFreelancer",
         SABER_SQUADRON_PILOT: "saberSquadronPilot",
         SABINE_WREN_REBEL: "sabineWrenRebel",
         SABINE_WREN_SCUM: "sabineWrenScum",
         SCIMITAR_SQUADRON_PILOT: "scimitarSquadronPilot",
         SCOURGE: "scourge",
         SERISSU: "serissu",
         SHADOWPORT_HUNTER: "shadowportHunter",
         SHADOW_SQUADRON_PILOT: "shadowSquadronPilot",
         SHARA_BEY: "sharaBey",
         SIENAR_TEST_PILOT: "sienarTestPilot",
         SIGMA_SQUADRON_PILOT: "sigmaSquadronPilot",
         SNAP_WEXLEY: "snapWexley",
         SOONTIR_FEL: "soontirFel",
         SPICE_RUNNER: "spiceRunner",
         STARKILLER_BASE_PILOT: "starkillerBasePilot",
         STORM_SQUADRON_PILOT: "stormSquadronPilot",
         SUNNY_BOUNDER: "sunnyBounder",
         SYNDICATE_THUG: "syndicateThug",
         TALA_SQUADRON_PILOT: "talaSquadronPilot",
         TALONBANE_COBRA: "talonbaneCobra",
         TANSARII_POINT_VETERAN: "tansariiPointVeteran",
         TARN_MISON: "tarnMison",
         TEL_TREVURA: "telTrevura",
         TEMPEST_SQUADRON_PILOT: "tempestSquadronPilot",
         TEN_NUMB: "tenNumb",
         TETRAN_COWALL: "tetranCowall",
         THANE_KYRELL: "thaneKyrell",
         THE_INQUISITOR: "theInquisitor",
         TOMAX_BREN: "tomaxBren",
         TORKIL_MUX: "torkilMux",
         TRANDOSHAN_SLAVER: "trandoshanSlaver",
         TURR_PHENNIR: "turrPhennir",
         TYCHO_CELCHU: "tychoCelchu",
         VALEN_RUDOR: "valenRudor",
         WAMPA: "wampa",
         WARDEN_SQUADRON_PILOT: "wardenSquadronPilot",
         WEDGE_ANTILLES: "wedgeAntilles",
         WES_JANSON: "wesJanson",
         WHISPER: "whisper",
         WILD_SPACE_FRINGER: "wildSpaceFringer",
         WINGED_GUNDARK: "wingedGundark",
         YOUNGSTER: "youngster",
         ZEALOUS_RECRUIT: "zealousRecruit",
         ZEB_ORRELIOS: "zebOrrelios",
         ZERTIK_STROM: "zertikStrom",
         ZETA_ACE: "zetaAce",
         ZETA_LEADER: "zetaLeader",
         ZETA_SPECIALIST: "zetaSpecialist",
         ZETA_SQUADRON_PILOT: "zetaSquadronPilot",
         ZUCKUSS: "zuckuss",
         properties:
         {
            "academyPilot":
            {
               name: "Academy Pilot",
               description: "Developed by Sienar Fleet Systems, the Empire used the fast and agile TIE/In as its primary starfighter throughout most of the Galactic Civil War.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 1,
               squadPointCost: 12,
               upgradeTypeKeys: [],
               isImplemented: true,
               key: "academyPilot",
            },
            "airenCracken":
            {
               name: "Airen Cracken",
               description: "After you perform an attack, you may choose another friendly ship at Range 1. That ship may perform 1 free action.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_Z_95_HEADHUNTER,
               pilotSkillValue: 8,
               squadPointCost: 19,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               key: "airenCracken",
            },
            "alphaSquadronPilot":
            {
               name: "Alpha Squadron Pilot",
               description: "Seiner Fleet Systems designed the TIE interceptor with four wing-mounted laser cannons, easily allowing it to outgun its predecessors.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_INTERCEPTOR,
               pilotSkillValue: 1,
               squadPointCost: 18,
               upgradeTypeKeys: [],
               isImplemented: true,
               key: "alphaSquadronPilot",
            },
            "arvelCrynyd":
            {
               name: "Arvel Crynyd",
               description: "You may declare an enemy ship inside your firing arc that you are touching as the target of your attack.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_A_WING,
               pilotSkillValue: 6,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.MISSILE],
               key: "arvelCrynyd",
            },
            "asajjVentress":
            {
               name: "Asajj Ventress",
               description: "At the start of the Combat phase, you may choose a ship at Range 1-2. If it is inside your mobile firing arc, assign 1 stress token to it.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_LANCER_CLASS_PURSUIT_CRAFT,
               pilotSkillValue: 6,
               squadPointCost: 37,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CREW, UpgradeType.ILLICIT, UpgradeType.ILLICIT],
               key: "asajjVentress",
            },
            "avengerSquadronPilot":
            {
               name: "Avenger Squadron Pilot",
               description: "The finest mass-produced starfighter of its time, the TIE interceptor excels at dogfighting thanks to its heightened maneuverability and speed.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_INTERCEPTOR,
               pilotSkillValue: 3,
               squadPointCost: 20,
               upgradeTypeKeys: [],
               isImplemented: true,
               key: "avengerSquadronPilot",
            },
            "backdraft":
            {
               name: "\"Backdraft\"",
               description: "When attacking a ship inside your auxiliary firing arc, you may add 1 critical result.",
               isUnique: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_SF_FIGHTER,
               pilotSkillValue: 7,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.MISSILE, UpgradeType.TECH],
               key: "backdraft",
            },
            "backstabber":
            {
               name: "\"Backstabber\"",
               description: "When attacking from outside the defender's firing arc, roll 1 additional attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 6,
               squadPointCost: 16,
               upgradeTypeKeys: [],
               isImplemented: true,
               key: "backstabber",
            },
            "banditSquadronPilot":
            {
               name: "Bandit Squadron Pilot",
               description: "The AF4 series was the latest in a long line of Headhunter designs. Cheap and durable, it became a favorite among independent outfits like the Rebellion and Black Sun.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_Z_95_HEADHUNTER,
               pilotSkillValue: 2,
               squadPointCost: 12,
               upgradeTypeKeys: [UpgradeType.MISSILE],
               isImplemented: true,
               key: "banditSquadronPilot",
            },
            "baronOfTheEmpire":
            {
               name: "Baron of the Empire",
               description: "The aristocratic title of baron was presented to ace starfighter pilots for outstanding service to the Empire.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED_PROTOTYPE,
               pilotSkillValue: 4,
               squadPointCost: 19,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               isImplemented: true,
               key: "baronOfTheEmpire",
            },
            "biggsDarklighter":
            {
               name: "Biggs Darklighter",
               description: "Other friendly ships at Range 1 cannot be targeted by attacks if the attacker could target you instead.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_X_WING,
               pilotSkillValue: 5,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               key: "biggsDarklighter",
            },
            "binayrePirate":
            {
               name: "Binayre Pirate",
               description: "Operating from the Double Worlds, Talus and Tralus, Kath Scarlet's gang of smugglers and pirates would never be described as reputable or dependable - even by other criminals.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_Z_95_HEADHUNTER,
               pilotSkillValue: 1,
               squadPointCost: 12,
               upgradeTypeKeys: [UpgradeType.MISSILE, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "binayrePirate",
            },
            "blackEightSqPilot":
            {
               name: "Black Eight Sq. Pilot",
               description: "Darth Vader's hand-picked Black Eight Squadron earned its reputation for ruthlessness when its bombardment of Callos rendered the planet uninhabitable.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_PUNISHER,
               pilotSkillValue: 4,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB, UpgradeType.BOMB],
               isImplemented: true,
               key: "blackEightSqPilot",
            },
            "blackSquadronPilot":
            {
               name: "Black Squadron Pilot",
               description: "The TIE fighter has no shields or life support systems, forcing TIE pilots to depend solely on their skills to survive.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 4,
               squadPointCost: 14,
               upgradeTypeKeys: [UpgradeType.ELITE],
               isImplemented: true,
               key: "blackSquadronPilot",
            },
            "blackSunAce":
            {
               name: "Black Sun Ace",
               description: "The Kihraxz assault fighter was developed specifically for the Black Sun crime syndicate, whose highly paid ace pilots demanded a nimble, powerful ship to match their skills.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_KIHRAXZ_FIGHTER,
               pilotSkillValue: 5,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "blackSunAce",
            },
            "blackSunEnforcer":
            {
               name: "Black Sun Enforcer",
               description: "Prince Xizor himself collaborated with MandalMotors to design the StarViper-class attack platform, one of the most formidable starfighters in the galaxy.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_STAR_VIPER,
               pilotSkillValue: 1,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.TORPEDO],
               isImplemented: true,
               key: "blackSunEnforcer",
            },
            "blackSunSoldier":
            {
               name: "Black Sun Soldier",
               description: "The vast and influential Black Sun crime syndicate can always find a use for talented pilots, provided they aren't particular about how they earn their credits.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_Z_95_HEADHUNTER,
               pilotSkillValue: 3,
               squadPointCost: 13,
               upgradeTypeKeys: [UpgradeType.MISSILE, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "blackSunSoldier",
            },
            "blackSunVigo":
            {
               name: "Black Sun Vigo",
               description: "Following the success of the Virago prototype, the StarViper-class attack platform was streamlined and redesigned for mass production.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_STAR_VIPER,
               pilotSkillValue: 3,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.TORPEDO],
               isImplemented: true,
               key: "blackSunVigo",
            },
            "blackmoonSquadronPilot":
            {
               name: "Blackmoon Squadron Pilot",
               description: "Originally designed with only the R7-series of astromech in mind, the E-wing was later retrofitted to equip the standard R2- and R5-series droids.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_E_WING,
               pilotSkillValue: 3,
               squadPointCost: 29,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               isImplemented: true,
               key: "blackmoonSquadronPilot",
            },
            "blueAce":
            {
               name: "\"Blue Ace\"",
               description: "When performing a boost action, you may use the left or right 1 turn template.",
               isUnique: true,
               shipFactionKey: ShipFaction.RESISTANCE_T_70_X_WING,
               pilotSkillValue: 5,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.ASTROMECH, UpgradeType.TECH],
               key: "blueAce",
            },
            "blueSquadronNovice":
            {
               name: "Blue Squadron Novice",
               description: "The T-70 model benefits from its redesigned thrusters with increased maneuverability in both space and atmospheric flight.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.RESISTANCE_T_70_X_WING,
               pilotSkillValue: 2,
               squadPointCost: 24,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.ASTROMECH, UpgradeType.TECH],
               isImplemented: true,
               key: "blueSquadronNovice",
            },
            "blueSquadronPathfinder":
            {
               name: "Blue Squadron Pathfinder",
               description: "Used for deploying troops under the cover of darkness or into the heat of battle, the U-wing fulfilled the Rebel Alliance's need for a hardy transport craft.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_U_WING,
               pilotSkillValue: 2,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW],
               key: "blueSquadronPathfinder",
            },
            "blueSquadronPilot":
            {
               name: "Blue Squadron Pilot",
               description: "Because of its heavy weapons array and resilient shielding, the B-wing solidified itself as the Alliance's most formidable assault fighter.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_B_WING,
               pilotSkillValue: 2,
               squadPointCost: 22,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CANNON, UpgradeType.TORPEDO,
                                UpgradeType.TORPEDO],
               isImplemented: true,
               key: "blueSquadronPilot",
            },
            "bobaFettImperial":
            {
               name: "Boba Fett (Imperial)",
               description: "When you reveal a bank maneuver, you may rotate your dial to the other bank maneuver of the same speed.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_FIRESPRAY_31,
               pilotSkillValue: 8,
               squadPointCost: 39,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB],
               isImplemented: true,
               key: "bobaFettImperial",
            },
            "bobaFettScum":
            {
               name: "Boba Fett (Scum)",
               description: "When attacking or defending, you may reroll 1 of your dice for each enemy ship at Range 1.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_FIRESPRAY_31,
               pilotSkillValue: 8,
               squadPointCost: 39,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "bobaFettScum",
            },
            "bodhiRook":
            {
               name: "Bodhi Rook",
               description: "When a friendly ship acquires a target lock, that ship can lock onto an enemy ship at Range 1-3 of any friendly ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_U_WING,
               pilotSkillValue: 4,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW],
               key: "bodhiRook",
            },
            "bossk":
            {
               name: "Bossk",
               description: "When you perform an attack that hits, before dealing damage, you may cancel 1 of your Critical Hit results to add 2 Hit results.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_YV_666,
               pilotSkillValue: 7,
               squadPointCost: 35,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE,
                                UpgradeType.CREW, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.ILLICIT],
               key: "bossk",
            },
            "bountyHunter":
            {
               name: "Bounty Hunter",
               description: "Originally intended as a prisoner transport, the Firespray patrol craft features a versatile weapons array and heavy armor plating.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_FIRESPRAY_31,
               pilotSkillValue: 3,
               squadPointCost: 33,
               upgradeTypeKeys: [UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB],
               isImplemented: true,
               key: "bountyHunter",
            },
            "braylenStramm":
            {
               name: "Braylen Stramm",
               description: "After you execute a maneuver, you may roll an attack die. On a hit or critical result, remove 1 stress token from your ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_ARC_170,
               pilotSkillValue: 3,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.ASTROMECH],
               key: "braylenStramm",
            },
            "cRocCruiser":
            {
               name: "C-ROC Cruiser",
               description: "The C-ROC cruiser possessed tremendous cargo capacity and powerful engines, making it a mainstay of merchants and smugglers.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_C_ROC_CRUISER,
               pilotSkillValue: 1,
               squadPointCost: 35,
               upgradeTypeKeys: [UpgradeType.CREW, UpgradeType.CREW, UpgradeType.HARDPOINT, UpgradeType.TEAM, UpgradeType.CARGO, UpgradeType.CARGO, UpgradeType.CARGO],
               key: "cRocCruiser",
            },
            "captainJonus":
            {
               name: "Captain Jonus",
               description: "When another friendly ship at Range 1 attacks with a secondary weapon, it may reroll up to 2 attack dice.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_BOMBER,
               pilotSkillValue: 6,
               squadPointCost: 22,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB],
               key: "captainJonus",
            },
            "captainKagi":
            {
               name: "Captain Kagi",
               description: "When an enemy ship acquires a target lock, it must lock onto your ship if able.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_LAMBDA_CLASS_SHUTTLE,
               pilotSkillValue: 8,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CANNON, UpgradeType.CREW, UpgradeType.CREW],
               key: "captainKagi",
            },
            "captainOicunn":
            {
               name: "Captain Oicunn",
               description: "After executing a maneuver, each enemy ship you are touching suffers 1 damage.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_VT_49_DECIMATOR,
               pilotSkillValue: 4,
               squadPointCost: 42,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW,
                                UpgradeType.CREW, UpgradeType.BOMB],
               key: "captainOicunn",
            },
            "captainRex":
            {
               name: "Captain Rex",
               description: "After you perform an attack, assign the 'Suppressive Fire' Condition card to the defender.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_SABINES_TIE_FIGHTER,
               pilotSkillValue: 4,
               squadPointCost: 14,
               upgradeTypeKeys: [],
               key: "captainRex",
            },
            "captainYorr":
            {
               name: "Captain Yorr",
               description: "When another friendly ship at Range 1-2 would receive a stress token, if you have 2 or fewer stress tokens, you may receive that token instead.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_LAMBDA_CLASS_SHUTTLE,
               pilotSkillValue: 4,
               squadPointCost: 24,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CANNON, UpgradeType.CREW, UpgradeType.CREW],
               key: "captainYorr",
            },
            "carnorJax":
            {
               name: "Carnor Jax",
               description: "Enemy ships at Range 1 cannot perform focus or evade actions and cannot spend focus or evade tokens.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V3,
               pilotSkillValue: 8,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.ELITE],
               key: "carnorJax",
            },
            "cartelMarauder":
            {
               name: "Cartel Marauder",
               description: "The versatile Kihraxz was modeled after Incom's popular X-wing starfighter, but an array of after-market modification kits ensured a wide variety of designs.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_KIHRAXZ_FIGHTER,
               pilotSkillValue: 2,
               squadPointCost: 20,
               upgradeTypeKeys: [UpgradeType.MISSILE, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "cartelMarauder",
            },
            "cartelSpacer":
            {
               name: "Cartel Spacer",
               description: "MandalMotors M3-A \"Scyk\" Interceptor was purchased in large quantities by the Hutt Cartel and the Car'das smugglers due to its low cost and customizability.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_M3_A_INTERCEPTOR,
               pilotSkillValue: 2,
               squadPointCost: 14,
               upgradeTypeKeys: [],
               isImplemented: true,
               key: "cartelSpacer",
            },
            "cassianAndor":
            {
               name: "Cassian Andor",
               description: "At the start of the Activation phase, you may remove 1 stress token from 1 other friendly ship at Range 1-2.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_U_WING,
               pilotSkillValue: 6,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW],
               key: "cassianAndor",
            },
            "chaser":
            {
               name: "\"Chaser\"",
               description: "When another friendly ship at Range 1 spends a focus token, assign a focus token to your ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 3,
               squadPointCost: 14,
               upgradeTypeKeys: [],
               key: "chaser",
            },
            "chewbacca":
            {
               name: "Chewbacca",
               description: "When you are dealt a faceup Damage card, immediately flip it facedown (without resolving its ability).",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_YT_1300,
               pilotSkillValue: 5,
               squadPointCost: 42,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW],
               isImplemented: true,
               key: "chewbacca",
            },
            "chewbaccaHotr":
            {
               name: "Chewbacca (HotR)",
               description: "When another friendly ship at Range 1-3 is destroyed (but has not fled the battlefield), you may perform an attack.",
               isUnique: true,
               shipFactionKey: ShipFaction.RESISTANCE_YT_1300,
               pilotSkillValue: 5,
               squadPointCost: 42,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW],
               key: "chewbaccaHotr",
            },
            "chopper":
            {
               name: "\"Chopper\"",
               description: "At the start of the Combat phase, each enemy ship you are touching receives 1 stress token.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_VCX_100,
               pilotSkillValue: 4,
               squadPointCost: 37,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TURRET, UpgradeType.TORPEDO,
                                UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW],
               key: "chopper",
            },
            "colonelJendon":
            {
               name: "Colonel Jendon",
               description: "At the start of the Combat phase, you may assign 1 of your blue target lock tokens to a friendly ship at Range 1 if it does not have a blue target lock token.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_LAMBDA_CLASS_SHUTTLE,
               pilotSkillValue: 6,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CANNON, UpgradeType.CREW, UpgradeType.CREW],
               key: "colonelJendon",
            },
            "colonelVessery":
            {
               name: "Colonel Vessery",
               description: "When attacking, immediately after you roll attack dice, you may acquire a target lock on the defender if it already has a red target lock token.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_DEFENDER,
               pilotSkillValue: 6,
               squadPointCost: 35,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE],
               isImplemented: true,
               key: "colonelVessery",
            },
            "concordDawnAce":
            {
               name: "Concord Dawn Ace",
               description: "The elite of the Concord Dawn Protectorate mastered the Concordia Face Off maneuver, leveraging their ships' narrow attack profile to execute deadly head-on charges.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_PROTECTORATE_STARFIGHTER,
               pilotSkillValue: 5,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO],
               isImplemented: true,
               key: "concordDawnAce",
            },
            "concordDawnVeteran":
            {
               name: "Concord Dawn Veteran",
               description: "Concord Dawn Protectors favored an aggressive approach, using their craft's pivot wing technology to achieve unmatched agility in the pursuit of their quarry.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_PROTECTORATE_STARFIGHTER,
               pilotSkillValue: 3,
               squadPointCost: 22,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO],
               isImplemented: true,
               key: "concordDawnVeteran",
            },
            "commanderAlozen":
            {
               name: "Commander Alozen",
               description: "At the start of the Combat phase, you may acquire a target lock on an enemy ship at Range 1.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED,
               pilotSkillValue: 5,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               isImplemented: true,
               key: "commanderAlozen",
            },
            "commanderKenkirk":
            {
               name: "Commander Kenkirk",
               description: "If you have no shields and at least 1 Damage card assigned to you, increase your agility value by 1.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_VT_49_DECIMATOR,
               pilotSkillValue: 6,
               squadPointCost: 44,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.BOMB],
               isImplemented: true,
               key: "commanderKenkirk",
            },
            "contractedScout":
            {
               name: "Contracted Scout",
               description: "Built for long-distance reconnaissance and plotting new hyperspace routes, the lightly armed JumpMaster 5000 was often extensively retrofitted with custom upgrades.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_JUMPMASTER_5000,
               pilotSkillValue: 3,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.SALVAGED_ASTROMECH, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "contractedScout",
            },
            "corranHorn":
            {
               name: "Corran Horn",
               description: "At the start of the End phase, you may perform one attack. You cannot attack during the next round.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_E_WING,
               pilotSkillValue: 8,
               squadPointCost: 35,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.TORPEDO,
                                UpgradeType.ASTROMECH],
               key: "corranHorn",
            },
            "countessRyad":
            {
               name: "Countess Ryad",
               description: "When you reveal a Straight maneuver, you may treat it as a K-Turn maneuver.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_DEFENDER_V2,
               pilotSkillValue: 5,
               squadPointCost: 34,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE],
               isImplemented: true,
               key: "countessRyad",
            },
            "cr90Corvette":
            {
               fore:
               {
                  name: "CR90 Corvette (fore)",
                  description: "When attacking with your primary weapon, you may spend 1 energy to roll 1 additional attack die.",
                  shipFactionKey: ShipFaction.REBEL_CR90_CORVETTE,
                  pilotSkillValue: 4,
                  squadPointCost: 50,
                  upgradeTypeKeys: [UpgradeType.CREW, UpgradeType.HARDPOINT, UpgradeType.HARDPOINT,
                                    UpgradeType.TEAM, UpgradeType.TEAM, UpgradeType.CARGO],
                  key: "cr90Corvette.fore",
               },
               aft:
               {
                  name: "CR90 Corvette (aft)",
                  description: "Equipped with 11 Girodyne Ter58 high-output ion-turbine engines and a hardy hull, the Rebel Alliance prized the CR90 for its sublight speed and durability.",
                  isFlavorText: true,
                  shipFactionKey: ShipFaction.REBEL_CR90_CORVETTE,
                  pilotSkillValue: 4,
                  squadPointCost: 40,
                  upgradeTypeKeys: [UpgradeType.CREW, UpgradeType.HARDPOINT, UpgradeType.TEAM,
                                    UpgradeType.CARGO],
                  isImplemented: true,
                  key: "cr90Corvette.aft",
               },
               crippledFore:
               {
                  name: "CR90 Corvette (crippled fore)",
                  description: "Although the CR90 contained 8 Faberstien-Lago 37s escape pods, only 48 of the potential 165 passengers could safely escape.",
                  isFlavorText: true,
                  shipFactionKey: ShipFaction.REBEL_CR90_CORVETTE,
                  upgradeTypeKeys: [UpgradeType.CREW],
                  isImplemented: true,
                  key: "cr90Corvette.crippledFore",
               },
               crippledAft:
               {
                  name: "CR90 Corvette (crippled aft)",
                  description: "You cannot choose or execute Straight 4, Bank Left 2, or Bank Right 2 maneuvers.",
                  shipFactionKey: ShipFaction.REBEL_CR90_CORVETTE,
                  upgradeTypeKeys: [UpgradeType.CARGO],
                  key: "cr90Corvette.crippledAft",
               },
               name: "CR90 Corvette",
               shipFactionKey: ShipFaction.REBEL_CR90_CORVETTE,
               key: "cr90Corvette",
            },
            "cutlassSquadronPilot":
            {
               name: "Cutlass Squadron Pilot",
               description: "The TIE Punisher built upon the success of the TIE bomber, adding shielding, a second bomb chute, and three additional ordnance pods, each equipped with a twin ion engine.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_PUNISHER,
               pilotSkillValue: 2,
               squadPointCost: 21,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB, UpgradeType.BOMB],
               isImplemented: true,
               key: "cutlassSquadronPilot",
            },
            "daceBonearm":
            {
               name: "Dace Bonearm",
               description: "When an enemy ship at Range 1-3 receives at least 1 ion token, if you are not stressed, you may receive 1 stress token to cause that ship to suffer 1 damage.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_HWK_290,
               pilotSkillValue: 7,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TURRET, UpgradeType.CREW, UpgradeType.ILLICIT],
               key: "daceBonearm",
            },
            "daggerSquadronPilot":
            {
               name: "Dagger Squadron Pilot",
               description: "A unique gyrostabilization system surrounds the B-wing's cockpit, ensuring that the pilot always remains stationary during flight.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_B_WING_V2,
               pilotSkillValue: 4,
               squadPointCost: 24,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CANNON, UpgradeType.TORPEDO,
                                UpgradeType.TORPEDO],
               isImplemented: true,
               key: "daggerSquadronPilot",
            },
            "darkCurse":
            {
               name: "\"Dark Curse\"",
               description: "When defending, ships attacking you cannot spend focus tokens or reroll attack dice.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 6,
               squadPointCost: 16,
               upgradeTypeKeys: [],
               key: "darkCurse",
            },
            "darthVader":
            {
               name: "Darth Vader",
               description: "During your \"Perform Action\" step, you may perform 2 actions.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED,
               pilotSkillValue: 9,
               squadPointCost: 29,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               key: "darthVader",
            },
            "dashRendar":
            {
               name: "Dash Rendar",
               description: "You may ignore obstacles during the Activation phase and when performing actions.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_YT_2400,
               pilotSkillValue: 7,
               squadPointCost: 36,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW],
               key: "dashRendar",
            },
            "deathfire":
            {
               name: "\"Deathfire\"",
               description: "When you reveal your maneuver dial or after you perform an action, you may perform a Bomb Upgrade card action as a free action.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_BOMBER_V2,
               pilotSkillValue: 3,
               squadPointCost: 17,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB],
               key: "deathfire",
            },
            "deathrain":
            {
               name: "\"Deathrain\"",
               description: "When dropping a bomb, you may use the front guides of your ship. After dropping a bomb, you may perform a free barrel roll action.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_PUNISHER,
               pilotSkillValue: 6,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB, UpgradeType.BOMB],
               key: "deathrain",
            },
            "deltaSquadronPilot":
            {
               name: "Delta Squadron Pilot",
               description: "In addition to its four laser cannons and warhead launchers, the TIE defender came equipped with ion cannons in its upper wing.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_DEFENDER,
               pilotSkillValue: 1,
               squadPointCost: 30,
               upgradeTypeKeys: [UpgradeType.CANNON, UpgradeType.MISSILE],
               isImplemented: true,
               key: "deltaSquadronPilot",
            },
            "dengar":
            {
               name: "Dengar",
               description: "Once per round after defending, if the attacker is inside your firing arc, you may perform an attack against that ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_JUMPMASTER_5000,
               pilotSkillValue: 9,
               squadPointCost: 33,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.CREW, UpgradeType.SALVAGED_ASTROMECH, UpgradeType.ILLICIT],
               key: "dengar",
            },
            "dreaRenthal":
            {
               name: "Drea Renthal",
               description: "After you spend a target lock, you may receive 1 stress token to acquire a target lock.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_Y_WING,
               pilotSkillValue: 5,
               squadPointCost: 22,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.SALVAGED_ASTROMECH],
               key: "dreaRenthal",
            },
            "dutchVander":
            {
               name: "\"Dutch\" Vander",
               description: "After acquiring a target lock, choose another friendly ship at Range 1-2. The chosen ship may immediately acquire a target lock.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_Y_WING,
               pilotSkillValue: 6,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.ASTROMECH],
               key: "dutchVander",
            },
            "eadenVrill":
            {
               name: "Eaden Vrill",
               description: "When performing a primary weapon attack against a stressed ship, roll 1 additional attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_YT_2400,
               pilotSkillValue: 3,
               squadPointCost: 32,
               upgradeTypeKeys: [UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW],
               isImplemented: true,
               key: "eadenVrill",
            },
            "echo":
            {
               name: "\"Echo\"",
               description: "When you decloak, you must use the left or right bank 2 template instead of the straight 2 template.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_PHANTOM,
               pilotSkillValue: 6,
               squadPointCost: 30,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CREW],
               key: "echo",
            },
            "elloAsty":
            {
               name: "Ello Asty",
               description: "When you are not stressed, you may treat your Talon Roll Left and Talon Roll Right maneuvers as white maneuvers.",
               isUnique: true,
               shipFactionKey: ShipFaction.RESISTANCE_T_70_X_WING,
               pilotSkillValue: 7,
               squadPointCost: 30,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH, UpgradeType.TECH],
               isImplemented: true,
               key: "elloAsty",
            },
            "emonAzzameen":
            {
               name: "Emon Azzameen",
               description: "When dropping a bomb, you may use the Left, Straight, or Right 3 template instead of the Straight 1 template.",
               shipFactionKey: ShipFaction.SCUM_FIRESPRAY_31,
               pilotSkillValue: 6,
               squadPointCost: 36,
               upgradeTypeKeys: [UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB, UpgradeType.ILLICIT],
               key: "emonAzzameen",
            },
            "epsilonAce":
            {
               name: "\"Epsilon Ace\"",
               description: "While you do not have any Damage cards, treat your pilot skill value as \"12.\"",
               isUnique: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER,
               pilotSkillValue: 4,
               squadPointCost: 17,
               upgradeTypeKeys: [UpgradeType.TECH],
               isImplemented: true,
               key: "epsilonAce",
            },
            "epsilonLeader":
            {
               name: "\"Epsilon Leader\"",
               description: "At the start of the Combat phase, remove 1 stress token from each friendly ship at Range 1.",
               isUnique: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER,
               pilotSkillValue: 6,
               squadPointCost: 19,
               upgradeTypeKeys: [UpgradeType.TECH],
               isImplemented: true,
               key: "epsilonLeader",
            },
            "epsilonSquadronPilot":
            {
               name: "Epsilon Squadron Pilot",
               description: "Following the traditions of the Galactic Empire, the First Order has kept the TIE fighter design in service, but has updated the craft to modern combat standards.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER,
               pilotSkillValue: 1,
               squadPointCost: 15,
               upgradeTypeKeys: [UpgradeType.TECH],
               isImplemented: true,
               key: "epsilonSquadronPilot",
            },
            "esegeTuketu":
            {
               name: "Esege Tuketu",
               description: "When another friendly ship at Range 1-2 is attacking, it may treat your Focus tokens as its own.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_K_WING,
               pilotSkillValue: 6,
               squadPointCost: 28,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB, UpgradeType.BOMB],
               key: "esegeTuketu",
            },
            "etahnAbaht":
            {
               name: "Etahn A'baht",
               description: "When an enemy ship inside your firing arc at Range 1-3 is defending, the attacker may change 1 of its Hit results to a Critical Hit result.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_E_WING,
               pilotSkillValue: 5,
               squadPointCost: 32,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.TORPEDO,
                                UpgradeType.ASTROMECH],
               key: "etahnAbaht",
            },
            "ezraBridger":
            {
               name: "Ezra Bridger",
               description: "When defending, if you are stressed, you may change up to 2 of your focus results to evade results.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_ATTACK_SHUTTLE,
               pilotSkillValue: 4,
               squadPointCost: 20,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TURRET, UpgradeType.CREW],
               isImplemented: true,
               key: "ezraBridger",
            },
            "felsWrath":
            {
               name: "\"Fel's Wrath\"",
               description: "When the number of Damage cards assigned to you equals or exceeds your hull value, you are not destroyed until the end of the Combat phase.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2,
               pilotSkillValue: 5,
               squadPointCost: 23,
               upgradeTypeKeys: [],
               key: "felsWrath",
            },
            "fennRau":
            {
               name: "Fenn Rau",
               description: "When attacking or defending, if the enemy ship is at Range 1, you may roll 1 additional dice.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_PROTECTORATE_STARFIGHTER,
               pilotSkillValue: 9,
               squadPointCost: 28,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO],
               isImplemented: true,
               key: "fennRau",
            },
            "fourLom":
            {
               name: "4-LOM",
               description: "At the start of the End phase, you may assign 1 of your stress tokens to another ship at Range 1.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_G_1A_STARFIGHTER,
               pilotSkillValue: 6,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CREW, UpgradeType.ILLICIT],
               key: "fourLom",
            },
            "gammaSquadronPilot":
            {
               name: "Gamma Squadron Pilot",
               description: "While not as agile or fast as other TIE variants, TIE bombers can carry enough firepower to destroy virtually any enemy target.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_BOMBER,
               pilotSkillValue: 4,
               squadPointCost: 18,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB],
               isImplemented: true,
               key: "gammaSquadronPilot",
            },
            "gammaSquadronVeteran":
            {
               name: "Gamma Squadron Pilot",
               description: "The white-striped TIE bombers flown by the elite Gamma Squadron possess enhanced maneuverability, allowing them to nimbly strike capital ships with fearsome ease.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_BOMBER_V2,
               pilotSkillValue: 5,
               squadPointCost: 19,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB],
               key: "gammaSquadronVeteran",
            },
            "gandFindsman":
            {
               name: "Gand Findsman",
               description: "The legendary Findsmen of Gand worshipped the enshrouding mists of their home planet. Utilizing signs, augurs, and mystical rituals to track their quarry.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_G_1A_STARFIGHTER,
               pilotSkillValue: 5,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CREW, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "gandFindsman",
            },
            "garvenDreis":
            {
               name: "Garven Dreis",
               description: "After spending a focus token, you may place that token on any other friendly ship at Range 1-2 (instead of discarding it).",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_X_WING,
               pilotSkillValue: 6,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               key: "garvenDreis",
            },
            "gemmerSojan":
            {
               name: "Gemmer Sojan",
               description: "While you are at Range 1 of at least 1 enemy ship, increase your agility value by 1.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_A_WING_V2,
               pilotSkillValue: 5,
               squadPointCost: 22,
               upgradeTypeKeys: [UpgradeType.MISSILE],
               key: "gemmerSojan",
            },
            "genesisRed":
            {
               name: "Genesis Red",
               description: "After you aquire a target lock, assign focus and evade tokens to your ship until you have the same number of each token as the locked ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_M3_A_INTERCEPTOR_V2,
               pilotSkillValue: 7,
               squadPointCost: 19,
               upgradeTypeKeys: [UpgradeType.ELITE],
               key: "genesisRed",
            },
            "glaiveSquadronPilot":
            {
               name: "Glaive Squadron Pilot",
               description: "The elite pilots of Glaive Squadron often serve as protective vanguard for high-ranking Imperial officials.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_DEFENDER_V2,
               pilotSkillValue: 6,
               squadPointCost: 34,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE],
               key: "glaiveSquadronPilot",
            },
            "goldSquadronPilot":
            {
               name: "Gold Squadron Pilot",
               description: "The versatile and reliable BTL-A4 Y-wing was the Rebellion's primary starfighter until the arrival of the T-65 X-wing.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_Y_WING,
               pilotSkillValue: 2,
               squadPointCost: 18,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.ASTROMECH],
               isImplemented: true,
               key: "goldSquadronPilot",
            },
            "gozantiClassCruiser":
            {
               name: "Gozanti-class Cruiser",
               description: "After you execute a maneuver, you may deploy up to 2 docked ships.",
               shipFactionKey: ShipFaction.IMPERIAL_GOZANTI_CLASS_CRUISER,
               pilotSkillValue: 2,
               squadPointCost: 40,
               upgradeTypeKeys: [UpgradeType.CREW, UpgradeType.CREW, UpgradeType.HARDPOINT, UpgradeType.TEAM,
                                UpgradeType.CARGO, UpgradeType.CARGO],
               key: "gozantiClassCruiser",
            },
            "gr75MediumTransport":
            {
               name: "GR-75 Medium Transport",
               description: "The GR-75 played an integral role in the evacuation of Hoth, transporting the bulk of the Alliance's supplies and personnel to the rendezvous point.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_GR_75_MEDIUM_TRANSPORT,
               pilotSkillValue: 3,
               squadPointCost: 30,
               upgradeTypeKeys: [UpgradeType.CREW, UpgradeType.CREW, UpgradeType.CARGO, UpgradeType.CARGO,
                                UpgradeType.CARGO],
               isImplemented: true,
               key: "gr75MediumTransport",
            },
            "graySquadronPilot":
            {
               name: "Gray Squadron Pilot",
               description: "Long after the Y-wing was to be phased out, its speed, durability, and weapon options helped it remain a staple in the Rebel fleet.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_Y_WING,
               pilotSkillValue: 4,
               squadPointCost: 20,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               isImplemented: true,
               key: "graySquadronPilot",
            },
            "grazTheHunter":
            {
               name: "Graz The Hunter",
               description: "When defending, if the attacker is inside your firing arc, roll 1 additional defense die.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_KIHRAXZ_FIGHTER,
               pilotSkillValue: 6,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.MISSILE, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "grazTheHunter",
            },
            "greenSquadronPilot":
            {
               name: "Green Squadron Pilot",
               description: "Conceived by General Dodonna, the RZ-1 A-wing interceptor proved its worth by crippling Star Destroyers during the Battle of Endor.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_A_WING,
               pilotSkillValue: 3,
               squadPointCost: 19,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               isImplemented: true,
               key: "greenSquadronPilot",
            },
            "guardianSquadronPilot":
            {
               name: "Guardian Squadron Pilot",
               description: "The K-wing's surprising acceleration, heavy armor plating, and devastating ordnance made it a favorite for hit-and-run operations.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_K_WING,
               pilotSkillValue: 4,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB, UpgradeType.BOMB],
               isImplemented: true,
               key: "guardianSquadronPilot",
            },
            "guri":
            {
               name: "Guri",
               description: "At the start of the Combat phase, if you are at Range 1 of an enemy ship, you may assign 1 focus token to your ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_STAR_VIPER,
               pilotSkillValue: 5,
               squadPointCost: 30,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO],
               isImplemented: true,
               key: "guri",
            },
            "hanSolo":
            {
               name: "Han Solo",
               description: "When attacking, you may reroll all of your dice. If you choose to do so, you must reroll as many of your dice as possible.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_YT_1300,
               pilotSkillValue: 9,
               squadPointCost: 46,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW],
               key: "hanSolo",
            },
            "hanSoloHotr":
            {
               name: "Han Solo (HotR)",
               description: "When you are placed during setup, you can be placed anywhere in the play area beyond Range 3 of the enemy ships.",
               isUnique: true,
               shipFactionKey: ShipFaction.RESISTANCE_YT_1300,
               pilotSkillValue: 9,
               squadPointCost: 46,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW],
               key: "hanSoloHotr",
            },
            "heffTobber":
            {
               name: "Heff Tobber",
               description: "After an enemy ship executes a maneuver that causes it to overlap your ship, you may perform a free action.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_U_WING,
               pilotSkillValue: 3,
               squadPointCost: 24,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW],
               key: "heffTobber",
            },
            "heraSyndullaAttackShuttle":
            {
               name: "Hera Syndulla (Attack Shuttle)",
               description: "When you reveal a green or red maneuver, you may rotate your dial to another maneuver of the same difficulty.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_ATTACK_SHUTTLE,
               pilotSkillValue: 7,
               squadPointCost: 22,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TURRET, UpgradeType.CREW],
               key: "heraSyndullaAttackShuttle",
            },
            "heraSyndullaVcx100":
            {
               name: "Hera Syndulla (VCX-100)",
               description: "When you reveal a red or green maneuver, you may rotate your dial to another maneuver of the same difficulty.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_VCX_100,
               pilotSkillValue: 7,
               squadPointCost: 40,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TURRET, UpgradeType.TORPEDO,
                                UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW],
               key: "heraSyndullaVcx100",
            },
            "hiredGun":
            {
               name: "Hired Gun",
               description: "Just the mention of Imperial credits can bring a host of less-than-trustworthy individuals to your side.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_Y_WING,
               pilotSkillValue: 4,
               squadPointCost: 20,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.SALVAGED_ASTROMECH],
               isImplemented: true,
               key: "hiredGun",
            },
            "hobbieKlivian":
            {
               name: "\"Hobbie\" Klivian",
               description: "When you acquire or spend a target lock, you may remove 1 stress token from your ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_X_WING,
               pilotSkillValue: 5,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               key: "hobbieKlivian",
            },
            "hortonSalm":
            {
               name: "Horton Salm",
               description: "When attacking at Range 2-3, you may reroll any of your blank results.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_Y_WING,
               pilotSkillValue: 8,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               isImplemented: true,
               key: "hortonSalm",
            },
            "howlrunner":
            {
               name: "\"Howlrunner\"",
               description: "When another friendly ship at Range 1 is attacking with its primary weapon, it may reroll 1 attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 8,
               squadPointCost: 18,
               upgradeTypeKeys: [UpgradeType.ELITE],
               key: "howlrunner",
            },
            "ibtisam":
            {
               name: "Ibtisam",
               description: "When attacking or defending, if you have at least 1 stress token, you may reroll 1 of your dice.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_B_WING,
               pilotSkillValue: 6,
               squadPointCost: 28,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CANNON, UpgradeType.TORPEDO, UpgradeType.TORPEDO],
               isImplemented: true,
               key: "ibtisam",
            },
            "ig88A":
            {
               name: "IG-88A",
               description: "After you perform an attack that destroys the defender, you may recover 1 shield.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_AGGRESSOR,
               pilotSkillValue: 6,
               squadPointCost: 36,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CANNON,
                                UpgradeType.CANNON, UpgradeType.BOMB, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "ig88A",
            },
            "ig88B":
            {
               name: "IG-88B",
               description: "Once per round, after you perform an attack that does not hit, you may perform an attack with an equipped Cannon secondary weapon.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_AGGRESSOR,
               pilotSkillValue: 6,
               squadPointCost: 36,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CANNON,
                                UpgradeType.CANNON, UpgradeType.BOMB, UpgradeType.ILLICIT],
               key: "ig88B",
            },
            "ig88C":
            {
               name: "IG-88C",
               description: "After you perform a boost action, you may perform a free evade action.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_AGGRESSOR,
               pilotSkillValue: 6,
               squadPointCost: 36,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CANNON,
                                UpgradeType.CANNON, UpgradeType.BOMB, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "ig88C",
            },
            "ig88D":
            {
               name: "IG-88D",
               description: "You may execute the Segnor's Loop Left or Right 3 maneuver using the corresponding Turn Left or Right 3 template.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_AGGRESSOR,
               pilotSkillValue: 6,
               squadPointCost: 36,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CANNON,
                                UpgradeType.CANNON, UpgradeType.BOMB, UpgradeType.ILLICIT],
               key: "ig88D",
            },
            "inaldra":
            {
               name: "Inaldra",
               description: "When attacking or defending, you may spend 1 shield to reroll any number of your dice.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_M3_A_INTERCEPTOR_V2,
               pilotSkillValue: 3,
               squadPointCost: 15,
               upgradeTypeKeys: [UpgradeType.ELITE],
               key: "inaldra",
            },
            "jakeFarrell":
            {
               name: "Jake Farrell",
               description: "After you perform a focus action or are assigned a focus token, you may perform a free boost or barrel roll action.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_A_WING_V2,
               pilotSkillValue: 7,
               squadPointCost: 24,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               key: "jakeFarrell",
            },
            "janOrs":
            {
               name: "Jan Ors",
               description: "When another friendly ship at Range 1-3 is attacking, if you have no stress tokens, you may receive 1 stress token to allow that ship to roll 1 additional attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_HWK_290,
               pilotSkillValue: 8,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TURRET, UpgradeType.CREW],
               key: "janOrs",
            },
            "jekPorkins":
            {
               name: "Jek Porkins",
               description: "When you receive a stress token, you may remove it and roll 1 attack die. On a Hit result, deal 1 facedown Damage card to this ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_X_WING,
               pilotSkillValue: 7,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               isImplemented: true,
               key: "jekPorkins",
            },
            "jessPava":
            {
               name: "Jess Pava",
               description: "When attacking or defending, you may reroll 1 of your dice for each other friendly ship at Range 1.",
               isUnique: true,
               shipFactionKey: ShipFaction.RESISTANCE_T_70_X_WING_V2,
               pilotSkillValue: 3,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.ASTROMECH, UpgradeType.TECH],
               isImplemented: true,
               key: "jessPava",
            },
            "junoEclipse":
            {
               name: "Juno Eclipse",
               description: "When you reveal your maneuver, you may increase or decrease its speed by 1 (to a minimum of 1).",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED,
               pilotSkillValue: 8,
               squadPointCost: 28,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               key: "junoEclipse",
            },
            "kaatoLeeachos":
            {
               name: "Kaa'To Leeachos",
               description: "At the start of the Combat phase, you may remove 1 focus or evade token from another friendly ship at Range 1-2 and assign it to yourself.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_Z_95_HEADHUNTER,
               pilotSkillValue: 5,
               squadPointCost: 15,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE, UpgradeType.ILLICIT],
               key: "kaatoLeeachos",
            },
            "kadSolus":
            {
               name: "Kad Solus",
               description: "After you execute a red maneuver, assign 2 focus tokens to your ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_PROTECTORATE_STARFIGHTER,
               pilotSkillValue: 6,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO],
               key: "kadSolus",
            },
            "kananJarrus":
            {
               name: "Kanan Jarrus",
               description: "When an enemy ship at Range 1-2 is attacking, you may spend a focus token. If you do, the attacker rolls 1 fewer attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_VCX_100,
               pilotSkillValue: 5,
               squadPointCost: 38,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TURRET, UpgradeType.TORPEDO,
                                UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW],
               key: "kananJarrus",
            },
            "kathScarletImperial":
            {
               name: "Kath Scarlet (Imperial)",
               description: "When attacking, the defender receives 1 stress token if he cancels at least 1 Critical Hit result.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_FIRESPRAY_31,
               pilotSkillValue: 7,
               squadPointCost: 38,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB],
               key: "kathScarletImperial",
            },
            "kathScarletScum":
            {
               name: "Kath Scarlet (Scum)",
               description: "When attacking a ship inside your auxiliary firing arc, roll 1 additional attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_FIRESPRAY_31,
               pilotSkillValue: 7,
               squadPointCost: 38,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB, UpgradeType.ILLICIT],
               key: "kathScarletScum",
            },
            "kavil":
            {
               name: "Kavil",
               description: "When attacking a ship outside your firing arc, roll 1 additional attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_Y_WING,
               pilotSkillValue: 7,
               squadPointCost: 24,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.SALVAGED_ASTROMECH],
               isImplemented: true,
               key: "kavil",
            },
            "ketsuOnyo":
            {
               name: "Ketsu Onyo",
               description: "At the start of the Combat phase, you may choose a ship at Range 1. If it is inside your primary and mobile firing arcs, assign 1 tractor beam token to it.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_LANCER_CLASS_PURSUIT_CRAFT,
               pilotSkillValue: 7,
               squadPointCost: 38,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CREW, UpgradeType.ILLICIT, UpgradeType.ILLICIT],
               key: "ketsuOnyo",
            },
            "keyanFarlander":
            {
               name: "Keyan Farlander",
               description: "When attacking, you may remove 1 stress token to change all of your Focus results to Hit results.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_B_WING_V2,
               pilotSkillValue: 7,
               squadPointCost: 29,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CANNON, UpgradeType.TORPEDO, UpgradeType.TORPEDO],
               isImplemented: true,
               key: "keyanFarlander",
            },
            "kirKanos":
            {
               name: "Kir Kanos",
               description: "When attacking at Range 2-3, you may spend 1 evade token to add 1 Hit result to your roll.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V3,
               pilotSkillValue: 6,
               squadPointCost: 24,
               upgradeTypeKeys: [],
               isImplemented: true,
               key: "kirKanos",
            },
            "knaveSquadronPilot":
            {
               name: "Knave Squadron Pilot",
               description: "Specifically designed to combine the best features of the X-wing series with the A-wing series, the E-wing boasted superior firepower, speed, and maneuverability.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_E_WING,
               pilotSkillValue: 1,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               isImplemented: true,
               key: "knaveSquadronPilot",
            },
            "krassisTrelix":
            {
               name: "Krassis Trelix",
               description: "When attacking with a secondary weapon, you may reroll 1 attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_FIRESPRAY_31,
               pilotSkillValue: 5,
               squadPointCost: 36,
               upgradeTypeKeys: [UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB],
               isImplemented: true,
               key: "krassisTrelix",
            },
            "kyleKatarn":
            {
               name: "Kyle Katarn",
               description: "At the start of the Combat phase, you may assign 1 of your focus tokens to another friendly ship at Range 1-3.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_HWK_290,
               pilotSkillValue: 6,
               squadPointCost: 21,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TURRET, UpgradeType.CREW],
               key: "kyleKatarn",
            },
            "kyloRen":
            {
               name: "Kylo Ren",
               description: "The first time you are hit by an attack each round, assign the \"I'll Show You the Dark Side\" Condition card to the attacker.",
               isUnique: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_UPSILON_CLASS_SHUTTLE,
               pilotSkillValue: 6,
               squadPointCost: 34,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.TECH, UpgradeType.TECH],
               key: "kyloRen",
            },
            "laetinAshera":
            {
               name: "Laetin A'shera",
               description: "After you defend against an attack, if the attack did not hit, you may assign 1 evade token to your ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_M3_A_INTERCEPTOR,
               pilotSkillValue: 6,
               squadPointCost: 18,
               upgradeTypeKeys: [],
               isImplemented: true,
               key: "laetinAshera",
            },
            "landoCalrissian":
            {
               name: "Lando Calrissian",
               description: "After you execute a green maneuver, choose 1 other friendly ship at Range 1. That ship may perform 1 free action shown in its action bar.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_YT_1300,
               pilotSkillValue: 7,
               squadPointCost: 44,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW],
               key: "landoCalrissian",
            },
            "lattsRazzi":
            {
               name: "Latts Razzi",
               description: "When a friendly ship declares an attack, you may spend a Target Lock you have on the defender to reduce its agility by 1 for that attack.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_YV_666,
               pilotSkillValue: 5,
               squadPointCost: 33,
               upgradeTypeKeys: [UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW,
                                UpgradeType.CREW, UpgradeType.ILLICIT],
               key: "lattsRazzi",
            },
            "leebo":
            {
               name: "\"Leebo\"",
               description: "When you are dealt a faceup Damage card, draw 1 additional Damage card, choose 1 to resolve, and discard the other.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_YT_2400,
               pilotSkillValue: 5,
               squadPointCost: 34,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW],
               key: "leebo",
            },
            "lieutenantBlount":
            {
               name: "Lieutenant Blount",
               description: "When attacking, the defender is hit by your attack, even if he does not suffer any damage.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_Z_95_HEADHUNTER,
               pilotSkillValue: 6,
               squadPointCost: 17,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               isImplemented: true,
               key: "lieutenantBlount",
            },
            "lieutenantColzet":
            {
               name: "Lieutenant Colzet",
               description: "At the start of the End phase, you may spend a target lock you have on an enemy ship to flip 1 random facedown Damage card assigned to it faceup.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED,
               pilotSkillValue: 3,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.MISSILE],
               key: "lieutenantColzet",
            },
            "lieutenantDormitz":
            {
               name: "Lieutenant Dormitz",
               description: "During setup, friendly ships may be placed anywhere in the play area at Range 1-2 of you.",
               isUnique: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_UPSILON_CLASS_SHUTTLE,
               pilotSkillValue: 3,
               squadPointCost: 31,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.TECH, UpgradeType.TECH],
               key: "lieutenantDormitz",
            },
            "lieutenantLorrir":
            {
               name: "Lieutenant Lorrir",
               description: "When performing a barrel roll action, you may receive 1 stress token to use the left or right bank 1 template instead of the straight 1 template.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2,
               pilotSkillValue: 5,
               squadPointCost: 23,
               upgradeTypeKeys: [],
               key: "lieutenantLorrir",
            },
            "lothalRebel":
            {
               name: "Lothal Rebel",
               description: "Another successful Corellian Engineering Corporation freighter design, the VCX-100 was larger than the ubiquitous YT-series, boasting more living space and customizability.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_VCX_100,
               pilotSkillValue: 3,
               squadPointCost: 35,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW],
               isImplemented: true,
               key: "lothalRebel",
            },
            "lukeSkywalker":
            {
               name: "Luke Skywalker",
               description: "When defending, you may change 1 of your Focus results to an Evade result.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_X_WING,
               pilotSkillValue: 8,
               squadPointCost: 28,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               isImplemented: true,
               key: "lukeSkywalker",
            },
            "maarekSteleTieAdvanced":
            {
               name: "Maarek Stele",
               description: "When your attack deals a faceup Damage card to the defender, instead draw 3 Damage cards, choose 1 to deal, and discard the others.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED,
               pilotSkillValue: 7,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               key: "maarekSteleTieAdvanced",
            },
            "maarekSteleTieDefender":
            {
               name: "Maarek Stele",
               description: "When your attack deals a faceup Damage card to the defender, instead draw 3 Damage cards, choose 1 to deal, and discard the others.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_DEFENDER_V2,
               pilotSkillValue: 7,
               squadPointCost: 35,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE],
               key: "maarekSteleTieDefender",
            },
            "majorRhymer":
            {
               name: "Major Rhymer",
               description: "When attacking with a secondary weapon, you may increase or decrease the weapon range by 1 to a limit of Range 1-3.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_BOMBER,
               pilotSkillValue: 7,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB],
               key: "majorRhymer",
            },
            "majorStridan":
            {
               name: "Major Stridan",
               description: "For the purpose of your actions and Upgrade cards, you may treat friendly ships at Range 2-3 as being at Range 1.",
               isUnique: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_UPSILON_CLASS_SHUTTLE,
               pilotSkillValue: 4,
               squadPointCost: 32,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.TECH, UpgradeType.TECH],
               key: "majorStridan",
            },
            "manaroo":
            {
               name: "Manaroo",
               description: "At the start of the Combat phase, you may assign all focus, evade, and target lock tokens assigned to you to another friendly ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_JUMPMASTER_5000,
               pilotSkillValue: 4,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.CREW, UpgradeType.SALVAGED_ASTROMECH, UpgradeType.ILLICIT],
               key: "manaroo",
            },
            "mandalorianMercenary":
            {
               name: "Mandalorian Mercenary",
               description: "Though the Mandalorian Crusaders were all but destroyed by the Old Republic, a handful of enterprising mercenaries still claim the mantle, instilling terror in their foes.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_FIRESPRAY_31,
               pilotSkillValue: 5,
               squadPointCost: 35,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "mandalorianMercenary",
            },
            "maulerMithel":
            {
               name: "\"Mauler Mithel\"",
               description: "When attacking at Range 1, roll 1 additional attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 7,
               squadPointCost: 17,
               upgradeTypeKeys: [UpgradeType.ELITE],
               isImplemented: true,
               key: "maulerMithel",
            },
            "mirandaDoni":
            {
               name: "Miranda Doni",
               description: "Once per round when attacking, you may either spend 1 Shield to roll 1 additional attack die or roll 1 fewer attack die to recover 1 Shield.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_K_WING,
               pilotSkillValue: 8,
               squadPointCost: 29,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB, UpgradeType.BOMB],
               key: "mirandaDoni",
            },
            "moraloEval":
            {
               name: "Moralo Eval",
               description: "You can perform Cannon secondary weapon attacks against ships inside your auxiliary firing arc.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_YV_666,
               pilotSkillValue: 6,
               squadPointCost: 34,
               upgradeTypeKeys: [UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW,
                                UpgradeType.CREW, UpgradeType.ILLICIT],
               key: "moraloEval",
            },
            "nashtahPupPilot":
            {
               name: "Nashtah Pup Pilot",
               description: "You have the pilot skill and pilot ability of the friendly destroyed ship equipped with the Hound's Tooth Upgrade card.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_Z_95_HEADHUNTER,
               pilotSkillValue: undefined,
               squadPointCost: undefined,
               upgradeTypeKeys: [],
               key: "nashtahPupPilot",
            },
            "ndruSuhlak":
            {
               name: "N'Dru Suhlak",
               description: "When attacking, if there are no other friendly ships at Range 1-2, roll 1 additional attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_Z_95_HEADHUNTER,
               pilotSkillValue: 7,
               squadPointCost: 17,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "ndruSuhlak",
            },
            "neraDantels":
            {
               name: "Nera Dantels",
               description: "You can perform Torpedo secondary weapon attacks against enemy ships outside your firing arc.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_B_WING_V2,
               pilotSkillValue: 5,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CANNON,
                                UpgradeType.TORPEDO, UpgradeType.TORPEDO],
               key: "neraDantels",
            },
            "nienNunb":
            {
               name: "Nien Nunb",
               description: "When you recieve a stress token, if there is an enemy ship inside your firing arc at Range 1, you may discard that stress token.",
               isUnique: true,
               shipFactionKey: ShipFaction.RESISTANCE_T_70_X_WING_V2,
               pilotSkillValue: 7,
               squadPointCost: 29,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH, UpgradeType.TECH],
               key: "nienNunb",
            },
            "nightBeast":
            {
               name: "\"Night Beast\"",
               description: "After executing a green maneuver, you may perform a free focus action.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 5,
               squadPointCost: 15,
               upgradeTypeKeys: [],
               isImplemented: true,
               key: "nightBeast",
            },
            "norraWexley":
            {
               name: "Norra Wexley",
               description: "When attacking or defending, you may spend a target lock you have on the enemy ship to add 1 Focus result to your roll.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_ARC_170,
               pilotSkillValue: 7,
               squadPointCost: 29,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.ASTROMECH],
               key: "norraWexley",
            },
            "obsidianSquadronPilot":
            {
               name: "Obsidian Squadron Pilot",
               description: "The TIE fighter's Twin Ion Engine system was designed for speed, making the TIE one of the most maneuverable starships ever produced.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 3,
               squadPointCost: 13,
               upgradeTypeKeys: [],
               isImplemented: true,
               key: "obsidianSquadronPilot",
            },
            "oldTeroch":
            {
               name: "Old Teroch",
               description: "At the start of the Combat phase, you may choose 1 enemy ship at Range 1. If you are inside its firing arc, it discards all focus and evade tokens.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_PROTECTORATE_STARFIGHTER,
               pilotSkillValue: 7,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO],
               key: "oldTeroch",
            },
            "omegaAce":
            {
               name: "\"Omega Ace\"",
               description: "When attacking, you may spend a focus token and a target lock you have on the defender to change all of your results to Critical Hit results.",
               isUnique: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER,
               pilotSkillValue: 7,
               squadPointCost: 20,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TECH],
               isImplemented: true,
               key: "omegaAce",
            },
            "omegaLeader":
            {
               name: "\"Omega Leader\"",
               description: "Enemy ships that you have locked cannot modify any dice when attacking you or defending against your attacks.",
               isUnique: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER,
               pilotSkillValue: 8,
               squadPointCost: 21,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TECH],
               key: "omegaLeader",
            },
            "omegaSpecialist":
            {
               name: "Omega Specialist",
               description: "Special Forces TIE fighters employed a dual heavy laser turret mounted to the bottom of the fuselage to defend against threats from the rear and augment their forward firepower.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_SF_FIGHTER,
               pilotSkillValue: 5,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.MISSILE, UpgradeType.TECH],
               key: "omegaSpecialist",
            },
            "omegaSquadronPilot":
            {
               name: "Omega Squadron Pilot",
               description: "To attain a coveted position in the skilled Omega squadron, pilots had to demonstrate both their exceptional skill and their unwavering dedication to the First Order.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER,
               pilotSkillValue: 4,
               squadPointCost: 17,
               upgradeTypeKeys: [UpgradeType.TECH],
               isImplemented: true,
               key: "omegaSquadronPilot",
            },
            "omicronGroupPilot":
            {
               name: "Omicron Group Pilot",
               description: "Noted for its tri-wing design, the Lambda-class shuttle served a critical role as a light utility craft in the Imperial Navy.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_LAMBDA_CLASS_SHUTTLE,
               pilotSkillValue: 2,
               squadPointCost: 21,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CANNON, UpgradeType.CREW, UpgradeType.CREW],
               isImplemented: true,
               key: "omicronGroupPilot",
            },
            "onyxSquadronPilot":
            {
               name: "Onyx Squadron Pilot",
               description: "The TIE defender outclassed all other starfighters of its time, though its size and array of weapons greatly increased its weight and cost in credits.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_DEFENDER,
               pilotSkillValue: 3,
               squadPointCost: 32,
               upgradeTypeKeys: [UpgradeType.CANNON, UpgradeType.MISSILE],
               isImplemented: true,
               key: "onyxSquadronPilot",
            },
            "outerRimSmuggler":
            {
               name: "Outer Rim Smuggler",
               description: "Known for its durability and modular design, the YT-1300 is one of the most popular, widely used freighters in the galaxy.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_YT_1300,
               pilotSkillValue: 1,
               primaryWeaponValue: 2,
               hullValue: 6,
               shieldValue: 4,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.CREW, UpgradeType.CREW],
               isImplemented: true,
               key: "outerRimSmuggler",
            },
            "palobGodalhi":
            {
               name: "Palob Godalhi",
               description: "At the start of the Combat phase, you may remove 1 focus or evade token from an enemy ship at Range 1-2 and assign it to yourself.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_HWK_290,
               pilotSkillValue: 5,
               squadPointCost: 20,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TURRET, UpgradeType.CREW, UpgradeType.ILLICIT],
               key: "palobGodalhi",
            },
            "patrolLeader":
            {
               name: "Patrol Leader",
               description: "To be granted command of a VT-49 Decimator was seen as a significant promotion for a middling officer of the Imperial Navy.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_VT_49_DECIMATOR,
               pilotSkillValue: 3,
               squadPointCost: 40,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.CREW,
                                UpgradeType.BOMB],
               isImplemented: true,
               key: "patrolLeader",
            },
            "poeDameron":
            {
               name: "Poe Dameron",
               description: "While attacking or defending, if you have a Focus token, you may change 1 of your Focus results to a Hit or Evade result.",
               isUnique: true,
               shipFactionKey: ShipFaction.RESISTANCE_T_70_X_WING,
               pilotSkillValue: 8,
               squadPointCost: 31,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH,
                                UpgradeType.TECH],
               isImplemented: true,
               key: "poeDameron",
            },
            "poeDameronHotr":
            {
               name: "Poe Dameron (HotR)",
               description: "While attacking or defending, if you have a Focus token, you may change 1 of your Focus results to a Hit or Evade result.",
               isUnique: true,
               shipFactionKey: ShipFaction.RESISTANCE_T_70_X_WING_V2,
               pilotSkillValue: 9,
               squadPointCost: 33,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH, UpgradeType.TECH],
               key: "poeDameronHotr",
            },
            "princeXizor":
            {
               name: "Prince Xizor",
               description: "When defending, a friendly ship at Range 1 may suffer 1 uncanceled Hit or Critical Hit result instead of you.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_STAR_VIPER,
               pilotSkillValue: 7,
               squadPointCost: 31,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO],
               key: "princeXizor",
            },
            "prototypePilot":
            {
               name: "Prototype Pilot",
               description: "Due to its sensitive controls and high maneuverability, only the most talented pilots belong in an A-wing cockpit.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_A_WING_V2,
               pilotSkillValue: 1,
               squadPointCost: 17,
               upgradeTypeKeys: [UpgradeType.MISSILE],
               isImplemented: true,
               key: "prototypePilot",
            },
            "quickdraw":
            {
               name: "\"Quickdraw\"",
               description: "Once per round, when you lose a shield token, you may perform a primary weapon attack.",
               isUnique: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_SF_FIGHTER,
               pilotSkillValue: 9,
               squadPointCost: 29,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.MISSILE, UpgradeType.TECH],
               key: "quickdraw",
            },
            "quinnJast":
            {
               name: "Quinn Jast",
               description: "At the start of Combat phase, you may receive a weapons disabled token to flip one of your discarded Torpedo or Missile Upgrade cards faceup.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_M3_A_INTERCEPTOR_V2,
               pilotSkillValue: 6,
               squadPointCost: 18,
               upgradeTypeKeys: [UpgradeType.ELITE],
               key: "quinnJast",
            },
            "raiderClassCorvette":
            {
               fore:
               {
                  name: "Raider-class Corvette (fore)",
                  description: "Once per round, after you perform a primary weapon attack, you may spend 2 energy to perform another primary weapon attack.",
                  shipFactionKey: ShipFaction.IMPERIAL_RAIDER_CLASS_CORVETTE,
                  pilotSkillValue: 4,
                  squadPointCost: 50,
                  upgradeTypeKeys: [UpgradeType.HARDPOINT, UpgradeType.TEAM, UpgradeType.CARGO],
                  key: "raiderClassCorvette.fore",
               },
               aft:
               {
                  name: "Raider-class Corvette (aft)",
                  description: "The demise of the Death Star proved to Imperial High Command the importance of anti-fighter craft which renewed interest in the Raider-class corvette.",
                  isFlavorText: true,
                  shipFactionKey: ShipFaction.IMPERIAL_RAIDER_CLASS_CORVETTE,
                  pilotSkillValue: 4,
                  squadPointCost: 50,
                  upgradeTypeKeys: [UpgradeType.CREW, UpgradeType.CREW, UpgradeType.HARDPOINT,
                                    UpgradeType.HARDPOINT, UpgradeType.TEAM, UpgradeType.TEAM, UpgradeType.CARGO],
                  isImplemented: true,
                  key: "raiderClassCorvette.aft",
               },
               crippledFore:
               {
                  name: "Raider-class Corvette (crippled fore)",
                  description: "Conceived by Lira Wessex to support the larger craft of the Imperial Navy, the Raider-class corvette was a durable design for a ship of its size.",
                  isFlavorText: true,
                  shipFactionKey: ShipFaction.IMPERIAL_RAIDER_CLASS_CORVETTE,
                  upgradeTypeKeys: [UpgradeType.HARDPOINT],
                  isImplemented: true,
                  key: "raiderClassCorvette.crippledFore",
               },
               crippledAft:
               {
                  name: "Raider-class Corvette (crippled aft)",
                  description: "You cannot choose or execute Bank Left 1 or Bank Right 1 maneuvers.",
                  shipFactionKey: ShipFaction.IMPERIAL_RAIDER_CLASS_CORVETTE,
                  upgradeTypeKeys: [UpgradeType.TEAM],
                  key: "raiderClassCorvette.crippledAft",
               },
               name: "Raider-class Corvette",
               shipFactionKey: ShipFaction.IMPERIAL_RAIDER_CLASS_CORVETTE,
               key: "raiderClassCorvette",
            },
            "rearAdmiralChiraneau":
            {
               name: "Rear Admiral Chiraneau",
               description: "When attacking at Range 1-2, you may change 1 of your Focus results to a Critical Hit result.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_VT_49_DECIMATOR,
               pilotSkillValue: 8,
               squadPointCost: 46,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.BOMB],
               isImplemented: true,
               key: "rearAdmiralChiraneau",
            },
            "rebelOperative":
            {
               name: "Rebel Operative",
               description: "Designed after a bird in flight by Corellian Engineering Corporation, the \"hawk\" series excelled in its role as a personal transport.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_HWK_290,
               pilotSkillValue: 2,
               squadPointCost: 16,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.CREW],
               isImplemented: true,
               key: "rebelOperative",
            },
            "redAce":
            {
               name: "\"Red Ace\"",
               description: "The first time you remove a shield token from your ship each round, assign 1 evade token to your ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.RESISTANCE_T_70_X_WING,
               pilotSkillValue: 6,
               squadPointCost: 29,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.ASTROMECH, UpgradeType.TECH],
               isImplemented: true,
               key: "redAce",
            },
            "redSquadronPilot":
            {
               name: "Red Squadron Pilot",
               description: "Created as an elite starfighter squad, Red Squadron included some of the best pilots in the Rebel Alliance.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_X_WING,
               pilotSkillValue: 4,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               isImplemented: true,
               key: "redSquadronPilot",
            },
            "redSquadronVeteran":
            {
               name: "Red Squadron Veteran",
               description: "The modern incarnation of a classic design, the Incom T-70 X-wing fighter is the signature combat craft of the Resistance forces in their fight against the First Order.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.RESISTANCE_T_70_X_WING,
               pilotSkillValue: 4,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH, UpgradeType.TECH],
               isImplemented: true,
               key: "redSquadronVeteran",
            },
            "redline":
            {
               name: "\"Redline\"",
               description: "You may maintain 2 target locks on the same ship. When you acquire a target lock, you may acquire a second lock on that same ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_PUNISHER,
               pilotSkillValue: 7,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB, UpgradeType.BOMB],
               key: "redline",
            },
            "resistanceSympathizer":
            {
               name: "Resistance Sympathizer",
               description: "After the destruction of the Hosnian system, some spacers willingly aided the Resistance against the malevolent First Order.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.RESISTANCE_YT_1300,
               pilotSkillValue: 3,
               squadPointCost: 38,
               upgradeTypeKeys: [UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW],
               key: "resistanceSympathizer",
            },
            "rexlerBrath":
            {
               name: "Rexler Brath",
               description: "After you perform an attack that deals at least 1 Damage card to the defender, you may spend a focus token to flip those cards faceup.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_DEFENDER,
               pilotSkillValue: 8,
               squadPointCost: 37,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.CANNON, UpgradeType.MISSILE],
               key: "rexlerBrath",
            },
            "rey":
            {
               name: "Rey",
               description: "When attacking or defending, if the enemy ship is inside your firing arc, you may reroll up to 2 of your blank results.",
               isUnique: true,
               shipFactionKey: ShipFaction.RESISTANCE_YT_1300,
               pilotSkillValue: 8,
               squadPointCost: 45,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW],
               key: "rey",
            },
            "roarkGarnet":
            {
               name: "Roark Garnet",
               description: "At the start of the Combat phase, choose 1 other friendly ship at Range 1-3. Until the end fo the phase, treat that ship's pilot skill value as \"12.\"",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_HWK_290,
               pilotSkillValue: 4,
               squadPointCost: 19,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.CREW],
               key: "roarkGarnet",
            },
            "rookiePilot":
            {
               name: "Rookie Pilot",
               description: "Designed by Incom Corporation, the T-65 X-wing quickly proved to be one of the most effective military vehicles in the galaxy and a boon to the Rebellion.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_X_WING,
               pilotSkillValue: 2,
               squadPointCost: 21,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               isImplemented: true,
               key: "rookiePilot",
            },
            "royalGuardPilot":
            {
               name: "Royal Guard Pilot",
               description: "Only members of the Emperor's royal guard are permitted to fly their unique crimson fighters, which are often used to escort the Emperor's shuttle as well as its decoys.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V3,
               pilotSkillValue: 6,
               squadPointCost: 22,
               upgradeTypeKeys: [UpgradeType.ELITE],
               isImplemented: true,
               key: "royalGuardPilot",
            },
            "ruthlessFreelancer":
            {
               name: "Ruthless Freelancer",
               description: "Byblos Drive Yards earned a reputation for producing starships of questionable quality, but their willingness to perform modifications of questionable legality kept business brisk.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_G_1A_STARFIGHTER,
               pilotSkillValue: 3,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CREW, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "ruthlessFreelancer",
            },
            "saberSquadronPilot":
            {
               name: "Saber Squadron Pilot",
               description: "Led by Baron Soontir Fel, the pilots of Saber Squadron are among the Empire's best. Their TIE interceptors are marked with red stripes to designate pilots with at least ten confirmed kills.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2,
               pilotSkillValue: 4,
               squadPointCost: 21,
               upgradeTypeKeys: [UpgradeType.ELITE],
               isImplemented: true,
               key: "saberSquadronPilot",
            },
            "sabineWrenRebel":
            {
               name: "Sabine Wren (Rebel)",
               description: "Immediately before you reveal your maneuver, you may perform a free boost or barrel roll action.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_ATTACK_SHUTTLE,
               pilotSkillValue: 5,
               squadPointCost: 21,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TURRET, UpgradeType.CREW],
               key: "sabineWrenRebel",
            },
            "sabineWrenScum":
            {
               name: "Sabine Wren (Scum)",
               description: "When defending against an enemy ship inside your mobile firing arc at Range 1-2, you may add 1 Focus result to your roll.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_LANCER_CLASS_PURSUIT_CRAFT,
               pilotSkillValue: 5,
               squadPointCost: 35,
               upgradeTypeKeys: [UpgradeType.CREW, UpgradeType.ILLICIT, UpgradeType.ILLICIT],
               key: "sabineWrenScum",
            },
            "scimitarSquadronPilot":
            {
               name: "Scimitar Squadron Pilot",
               description: "The onboard targeting computer is extremely precise, allowing a TIE bomber to pinpoint its target while avoiding collateral damage to the surrounding area.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_BOMBER,
               pilotSkillValue: 2,
               squadPointCost: 16,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB],
               isImplemented: true,
               key: "scimitarSquadronPilot",
            },
            "scourge":
            {
               name: "\"Scourge\"",
               description: "When attacking a defender that has 1 or more Damage cards, roll 1 additional attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 7,
               squadPointCost: 17,
               upgradeTypeKeys: [UpgradeType.ELITE],
               isImplemented: true,
               key: "scourge",
            },
            "serissu":
            {
               name: "Serissu",
               description: "When another friendly ship at Range 1 is defending, it may reroll 1 defense die.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_M3_A_INTERCEPTOR,
               pilotSkillValue: 8,
               squadPointCost: 20,
               upgradeTypeKeys: [UpgradeType.ELITE],
               key: "serissu",
            },
            "shadowSquadronPilot":
            {
               name: "Shadow Squadron Pilot",
               description: "Featuring a hyperdrive and shields, the TIE phantom also came equipped with five laser cannons, giving it uprecedented firepower for such a small Imperial fighter.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_PHANTOM,
               pilotSkillValue: 5,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CREW],
               isImplemented: true,
               key: "shadowSquadronPilot",
            },
            "shadowportHunter":
            {
               name: "Shadowport Hunter",
               description: "Crime syndicates augmented the lethal skills of their loyal contractors with the best weapons, ships, and tech available.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_LANCER_CLASS_PURSUIT_CRAFT,
               pilotSkillValue: 2,
               squadPointCost: 33,
               upgradeTypeKeys: [UpgradeType.CREW, UpgradeType.ILLICIT, UpgradeType.ILLICIT],
               key: "shadowportHunter",
            },
            "sharaBey":
            {
               name: "Shara Bey",
               description: "When another friendly ship at Range 1-2 is attacking, it may treat your blue target lock tokens as its own.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_ARC_170,
               pilotSkillValue: 6,
               squadPointCost: 28,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.ASTROMECH],
               key: "sharaBey",
            },
            "sienarTestPilot":
            {
               name: "Sienar Test Pilot",
               description: "Sienar Fleet System's TIE Advanced v1 was a groundbreaking starfighter design featuring upgraded engines, a missile launcher, and folding s-foils.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED_PROTOTYPE,
               pilotSkillValue: 2,
               squadPointCost: 16,
               upgradeTypeKeys: [UpgradeType.MISSILE],
               isImplemented: true,
               key: "sienarTestPilot",
            },
            "sigmaSquadronPilot":
            {
               name: "Sigma Squadron Pilot",
               description: "The primary result of a hidden research facility on Imdaar Alpha, the TIE phantom added a small fighter with cloaking capabilities to the Imperial fleet.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_PHANTOM,
               pilotSkillValue: 3,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CREW],
               isImplemented: true,
               key: "sigmaSquadronPilot",
            },
            "snapWexley":
            {
               name: "\"Snap\" Wexley",
               description: "After you execute a 2-, 3- or 4-speed maneuver, if you are not touching a ship, you may perform a free boost action.",
               isUnique: true,
               shipFactionKey: ShipFaction.RESISTANCE_T_70_X_WING_V2,
               pilotSkillValue: 6,
               squadPointCost: 28,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH, UpgradeType.TECH],
               key: "snapWexley",
            },
            "soontirFel":
            {
               name: "Soontir Fel",
               description: "When you receive a stress token, you may assign 1 focus token to your ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2,
               pilotSkillValue: 9,
               squadPointCost: 27,
               upgradeTypeKeys: [UpgradeType.ELITE],
               isImplemented: true,
               key: "soontirFel",
            },
            "spiceRunner":
            {
               name: "Spice Runner",
               description: "With nothing more than a desire to fly and a junkyard at their disposal, crafty mechanics can make almost anything spaceworthy.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_HWK_290,
               pilotSkillValue: 1,
               squadPointCost: 16,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.CREW, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "spiceRunner",
            },
            "starkillerBasePilot":
            {
               name: "Starkiller Base Pilot",
               description: "The Upsilon-class shuttle served as a command ship for many of the First Order's elite officers and agents as they spread terror across the galaxy.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_UPSILON_CLASS_SHUTTLE,
               pilotSkillValue: 2,
               squadPointCost: 30,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.CREW, UpgradeType.CREW, UpgradeType.TECH, UpgradeType.TECH],
               key: "starkillerBasePilot",
            },
            "stormSquadronPilot":
            {
               name: "Storm Squadron Pilot",
               description: "The TIE Advanced improved on the popular TIE/In design by adding shielding, better weapon systems, curved solar panels, and a hyperdrive.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED,
               pilotSkillValue: 4,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.MISSILE],
               isImplemented: true,
               key: "stormSquadronPilot",
            },
            "sunnyBounder":
            {
               name: "Sunny Bounder",
               description: "Once per round, after you roll or reroll dice, if you have the same result on each of your dice, you may add 1 matching result.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_M3_A_INTERCEPTOR_V2,
               pilotSkillValue: 1,
               squadPointCost: 14,
               upgradeTypeKeys: [],
               key: "sunnyBounder",
            },
            "syndicateThug":
            {
               name: "Syndicate Thug",
               description: "Though far from nimble, the Y-wing's heavy hull, substantial shielding, and turret-mounted cannons make them excellent patrol craft.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_Y_WING,
               pilotSkillValue: 2,
               squadPointCost: 18,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.SALVAGED_ASTROMECH],
               isImplemented: true,
               key: "syndicateThug",
            },
            "talaSquadronPilot":
            {
               name: "Tala Squadron Pilot",
               description: "Manufactured by Incom Corporation, the Z-95-AF4 was the primary inspiration for the design of the T-65 X-wing.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_Z_95_HEADHUNTER,
               pilotSkillValue: 4,
               squadPointCost: 13,
               upgradeTypeKeys: [UpgradeType.MISSILE],
               isImplemented: true,
               key: "talaSquadronPilot",
            },
            "talonbaneCobra":
            {
               name: "Talonbane Cobra",
               description: "When attacking or defending, double the effect of your range combat bonuses.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_KIHRAXZ_FIGHTER,
               pilotSkillValue: 9,
               squadPointCost: 28,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "talonbaneCobra",
            },
            "tansariiPointVeteran":
            {
               name: "Tansarii Point Veteran",
               description: "The defeat of Black Sun ace Talonbane Cobra by Car'das smugglers turned the tide of the Battle of Tansarii Point Station. Survivors of the clash are respected throughout the sector.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_M3_A_INTERCEPTOR,
               pilotSkillValue: 5,
               squadPointCost: 17,
               upgradeTypeKeys: [UpgradeType.ELITE],
               isImplemented: true,
               key: "tansariiPointVeteran",
            },
            "tarnMison":
            {
               name: "Tarn Mison",
               description: "When an enemy ship declares you as the target of an attack, you may acquire a target lock on that ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_X_WING,
               pilotSkillValue: 3,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               isImplemented: true,
               key: "tarnMison",
            },
            "telTrevura":
            {
               name: "Tel Trevura",
               description: "The first time you would be destroyed, instead cancel any remaining damage, discard all Damage cards, and deal 4 facedown Damage cards to this ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_JUMPMASTER_5000,
               pilotSkillValue: 7,
               squadPointCost: 30,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.CREW, UpgradeType.SALVAGED_ASTROMECH, UpgradeType.ILLICIT],
               key: "telTrevura",
            },
            "tempestSquadronPilot":
            {
               name: "Tempest Squadron Pilot",
               description: "The TIE Advanced was produced in limited quantities, but later Sienar engineers incorporated many of its best qualities into their next TIE model: the TIE Interceptor.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED,
               pilotSkillValue: 2,
               squadPointCost: 21,
               upgradeTypeKeys: [UpgradeType.MISSILE],
               isImplemented: true,
               key: "tempestSquadronPilot",
            },
            "tenNumb":
            {
               name: "Ten Numb",
               description: "When attacking, 1 of your Critical Hit results cannot be canceled by defense dice.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_B_WING,
               pilotSkillValue: 8,
               squadPointCost: 31,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CANNON,
                                UpgradeType.TORPEDO, UpgradeType.TORPEDO],
               key: "tenNumb",
            },
            "tetranCowall":
            {
               name: "Tetran Cowall",
               description: "When you reveal a Koiogran turn maneuver, you may treat the speed of that maneuver as \"1,\" \"3,\" or \"5.\"",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2,
               pilotSkillValue: 7,
               squadPointCost: 24,
               upgradeTypeKeys: [UpgradeType.ELITE],
               key: "tetranCowall",
            },
            "thaneKyrell":
            {
               name: "Thane Kyrell",
               description: "After an enemy ship inside your firing arc at Range 1-3 attacks another friendly ship, you may perform a free action.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_ARC_170,
               pilotSkillValue: 4,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.TORPEDO, UpgradeType.CREW, UpgradeType.ASTROMECH],
               key: "thaneKyrell",
            },
            "theInquisitor":
            {
               name: "The Inquisitor",
               description: "When attacking with your primary weapon at Range 2-3, treat the range of the attack as Range 1.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED_PROTOTYPE,
               pilotSkillValue: 8,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               key: "theInquisitor",
            },
            "tomaxBren":
            {
               name: "Tomax Bren",
               description: "Once per round, after you discard an Elite Upgrade card, flip that card faceup.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_BOMBER_V2,
               pilotSkillValue: 8,
               squadPointCost: 24,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.TORPEDO, UpgradeType.MISSILE, UpgradeType.MISSILE, UpgradeType.BOMB],
               key: "tomaxBren",
            },
            "torkilMux":
            {
               name: "Torkil Mux",
               description: "At the end of the Activation phase, choose 1 enemy ship at Range 1-2. Until the end of the Combat phase, treat that ship's pilot skill value as \"0\".",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_HWK_290,
               pilotSkillValue: 3,
               squadPointCost: 19,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.CREW, UpgradeType.ILLICIT],
               key: "torkilMux",
            },
            "trandoshanSlaver":
            {
               name: "Trandoshan Slaver",
               description: "The spacious triple-decker design of the YV-666 made it popular among bounty hunters and slavers, who often retrofitted an entire deck for prisoner transport.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_YV_666,
               pilotSkillValue: 2,
               squadPointCost: 29,
               upgradeTypeKeys: [UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.CREW,
                                UpgradeType.CREW, UpgradeType.ILLICIT],
               isImplemented: true,
               key: "trandoshanSlaver",
            },
            "turrPhennir":
            {
               name: "Turr Phennir",
               description: "After you perform an attack, you may perform a free boost or barrel roll action.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_INTERCEPTOR_V2,
               pilotSkillValue: 7,
               squadPointCost: 25,
               upgradeTypeKeys: [UpgradeType.ELITE],
               isImplemented: true,
               key: "turrPhennir",
            },
            "tychoCelchu":
            {
               name: "Tycho Celchu",
               description: "You may perform actions even while you have stress tokens.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_A_WING,
               pilotSkillValue: 8,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               isImplemented: true,
               key: "tychoCelchu",
            },
            "valenRudor":
            {
               name: "Valen Rudor",
               description: "After defending, you may perform a free action.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED_PROTOTYPE,
               pilotSkillValue: 6,
               squadPointCost: 22,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               isImplemented: true,
               key: "valenRudor",
            },
            "wampa":
            {
               name: "\"Wampa\"",
               description: "When attacking, you may cancel all dice results. If you cancel a critical result, deal 1 facedown Damage card to the defender.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 4,
               squadPointCost: 14,
               upgradeTypeKeys: [],
               key: "wampa",
            },
            "wardenSquadronPilot":
            {
               name: "Warden Squadron Pilot",
               description: "Koensayr Manufacturing's K-wing boasted an advanced Sublight Acceleration Motor (SLAM) and an unprecedented 18 hard points, granting it unrivaled speed and firepower.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_K_WING,
               pilotSkillValue: 2,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.TORPEDO, UpgradeType.TORPEDO,
                                UpgradeType.MISSILE, UpgradeType.CREW, UpgradeType.BOMB, UpgradeType.BOMB],
               isImplemented: true,
               key: "wardenSquadronPilot",
            },
            "wedgeAntilles":
            {
               name: "Wedge Antilles",
               description: "When attacking, reduce the defender's agility value by 1 (to a minimum of \"0\").",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_X_WING,
               pilotSkillValue: 9,
               squadPointCost: 29,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               key: "wedgeAntilles",
            },
            "wesJanson":
            {
               name: "Wes Janson",
               description: "After you perform an attack, you may remove 1 focus, evade, or blue target lock token from the defender.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_X_WING,
               pilotSkillValue: 8,
               squadPointCost: 29,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TORPEDO, UpgradeType.ASTROMECH],
               key: "wesJanson",
            },
            "whisper":
            {
               name: "\"Whisper\"",
               description: "After you perform an attack that hits, you may assign 1 focus token to your ship.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_PHANTOM,
               pilotSkillValue: 7,
               squadPointCost: 32,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CREW],
               isImplemented: true,
               key: "whisper",
            },
            "wildSpaceFringer":
            {
               name: "Wild Space Fringer",
               description: "Although a stock YT-2400 light freighter had plenty of space for cargo, that space was often annexed to support modified weapon systems and oversized engines.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.REBEL_YT_2400,
               pilotSkillValue: 2,
               squadPointCost: 30,
               upgradeTypeKeys: [UpgradeType.CANNON, UpgradeType.MISSILE, UpgradeType.CREW],
               isImplemented: true,
               key: "wildSpaceFringer",
            },
            "wingedGundark":
            {
               name: "\"Winged Gundark\"",
               description: "When attacking at Range 1, you may change 1 of your Hit results to a Critical Hit result.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 5,
               squadPointCost: 15,
               upgradeTypeKeys: [],
               isImplemented: true,
               key: "wingedGundark",
            },
            "youngster":
            {
               name: "\"Youngster\"",
               description: "Friendly TIE fighters at Range 1-3 may perform the action on your equipped Elite Talent Upgrade card.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_FIGHTER,
               pilotSkillValue: 6,
               squadPointCost: 15,
               upgradeTypeKeys: [UpgradeType.ELITE],
               key: "youngster",
            },
            "zealousRecruit":
            {
               name: "Zealous Recruit",
               description: "The Concord Dawn Protectorate starfighter was armed with a hidden torpedo launcher, allowing it to launch a deadly salvo before its foes realized it was carrying ordnance.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.SCUM_PROTECTORATE_STARFIGHTER,
               pilotSkillValue: 1,
               squadPointCost: 20,
               upgradeTypeKeys: [UpgradeType.TORPEDO],
               isImplemented: true,
               key: "zealousRecruit",
            },
            "zebOrrelios":
            {
               name: "\"Zeb\" Orrelios",
               description: "When defending, you may cancel critical hit results before hit results.",
               isUnique: true,
               shipFactionKey: ShipFaction.REBEL_ATTACK_SHUTTLE,
               pilotSkillValue: 3,
               squadPointCost: 18,
               upgradeTypeKeys: [UpgradeType.TURRET, UpgradeType.CREW],
               key: "zebOrrelios",
            },
            "zertikStrom":
            {
               name: "Zertik Strom",
               description: "Enemy ships at Range 1 cannot add their range combat bonus when attacking.",
               isUnique: true,
               shipFactionKey: ShipFaction.IMPERIAL_TIE_ADVANCED,
               pilotSkillValue: 6,
               squadPointCost: 26,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.MISSILE],
               isImplemented: true,
               key: "zertikStrom",
            },
            "zetaAce":
            {
               name: "\"Zeta Ace\"",
               description: "When performing a barrel roll, you may use the Straight 2 template (instead of the Straight 1 template).",
               isUnique: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER,
               pilotSkillValue: 5,
               squadPointCost: 18,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TECH],
               key: "zetaAce",
            },
            "zetaLeader":
            {
               name: "\"Zeta Leader\"",
               description: "When attacking, if you are not stressed, you may receive 1 stress token to roll 1 additional attack die.",
               isUnique: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER,
               pilotSkillValue: 7,
               squadPointCost: 20,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.TECH],
               key: "zetaLeader",
            },
            "zetaSpecialist":
            {
               name: "Zeta Specialist",
               description: "Only the most elite pilots of the First Order were authorized to fly this specialized two-seater TIE craft outfitted with enhanced shields, weapons, and sensor systems.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_SF_FIGHTER,
               pilotSkillValue: 3,
               squadPointCost: 23,
               upgradeTypeKeys: [UpgradeType.SYSTEM, UpgradeType.MISSILE, UpgradeType.TECH],
               isImplemented: true,
               key: "zetaSpecialist",
            },
            "zetaSquadronPilot":
            {
               name: "Zeta Squadron Pilot",
               description: "The fragility of TIE Fighters during the Galactic Civil War led engineers to improve survivability, resulting in a more durable starfighter.",
               isFlavorText: true,
               shipFactionKey: ShipFaction.FIRST_ORDER_TIE_FO_FIGHTER,
               pilotSkillValue: 3,
               squadPointCost: 16,
               upgradeTypeKeys: [UpgradeType.TECH],
               isImplemented: true,
               key: "zetaSquadronPilot",
            },
            "zuckuss":
            {
               name: "Zuckuss",
               description: "When attacking, you may roll 1 additional attack die. If you do, then the defender rolls 1 additional defense die.",
               isUnique: true,
               shipFactionKey: ShipFaction.SCUM_G_1A_STARFIGHTER,
               pilotSkillValue: 7,
               squadPointCost: 28,
               upgradeTypeKeys: [UpgradeType.ELITE, UpgradeType.SYSTEM, UpgradeType.CREW, UpgradeType.ILLICIT],
               key: "zuckuss",
            },
         },
      };

      PilotCard.keys = function()
      {
         return Object.keys(PilotCard.properties);
      };

      PilotCard.values = function()
      {
         return Object.values(PilotCard.properties);
      };

      PilotCard.keys().forEach(function(pilotKey)
      {
         var pilot = PilotCard.properties[pilotKey];
         pilot.cardTypeKey = CardType.PILOT;
         pilot.xwingType = PilotCard;
         pilot.shipFaction = ShipFaction.properties[pilot.shipFactionKey];

         if (pilot.upgradeTypeKeys !== undefined)
         {
            pilot.upgradeTypes = pilot.upgradeTypeKeys.map(function(typeKey)
            {
               return UpgradeType.properties[typeKey];
            });
         }

         if (pilot.description && pilot.description.toLowerCase().indexOf("once per round") !== -1)
         {
            pilot.oncePerRound = true;
         }

         var imagePath = pilot.name.toLowerCase() + ".png";
         imagePath = imagePath.toLowerCase();
         imagePath = imagePath.replace(/\'/g, "-");
         imagePath = imagePath.replace(/\"/g, "");
         imagePath = imagePath.replace(/ /g, "-");
         imagePath = imagePath.replace("-(attack-shuttle)", "");
         imagePath = imagePath.replace("-(hotr)", "");
         imagePath = imagePath.replace("-(imperial)", "");
         imagePath = imagePath.replace("-(rebel)", "");
         imagePath = imagePath.replace("-(scum)", "");
         imagePath = imagePath.replace("-(vcx-100)", "");
         imagePath = imagePath.replace("black-eight-sq.-pilot", "black-eight-squadron-pilot");
         imagePath = imagePath.replace("cr90-corvette-(aft)", "cr90-corvette-aft");
         imagePath = imagePath.replace("cr90-corvette-(fore)", "cr90-corvette-fore");
         imagePath = imagePath.replace("nashtah-pup-pilot", "nashtah-pup");
         imagePath = imagePath.replace("raider-class-corvette-(aft)", "raider-class-corv-aft");
         imagePath = imagePath.replace("raider-class-corvette-(fore)", "raider-class-corv-fore");
         pilot.imagePath = imagePath;

         if (pilot.fore)
         {
            pilot.fore.cardTypeKey = CardType.PILOT;
            pilot.fore.xwingType = PilotCard;
            pilot.fore.parent = pilot;
            pilot.fore.shipFaction = ShipFaction.properties[pilot.fore.shipFactionKey];

            if (pilot.fore.description.toLowerCase().indexOf("once per round") !== -1)
            {
               pilot.fore.oncePerRound = true;
            }

            imagePath = pilot.fore.name.toLowerCase() + ".png";
            imagePath = imagePath.replace(/ /g, "-");
            imagePath = imagePath.replace(/\(/g, "");
            imagePath = imagePath.replace(/\)/g, "");
            imagePath = imagePath.replace(/raider-class-corvette/g, "raider-class-corv");
            pilot.fore.imagePath = imagePath;
         }

         if (pilot.aft)
         {
            pilot.aft.cardTypeKey = CardType.PILOT;
            pilot.aft.xwingType = PilotCard;
            pilot.aft.parent = pilot;
            pilot.aft.shipFaction = ShipFaction.properties[pilot.aft.shipFactionKey];

            if (pilot.aft.description.toLowerCase().indexOf("once per round") !== -1)
            {
               pilot.aft.oncePerRound = true;
            }

            imagePath = pilot.aft.name.toLowerCase() + ".png";
            imagePath = imagePath.replace(/ /g, "-");
            imagePath = imagePath.replace(/\(/g, "");
            imagePath = imagePath.replace(/\)/g, "");
            imagePath = imagePath.replace(/raider-class-corvette/g, "raider-class-corv");
            pilot.aft.imagePath = imagePath;
         }

         if (pilot.crippledFore)
         {
            pilot.crippledFore.cardTypeKey = CardType.PILOT;
            pilot.crippledFore.xwingType = PilotCard;
            pilot.crippledFore.parent = pilot;
            pilot.crippledFore.shipFaction = ShipFaction.properties[pilot.crippledFore.shipFactionKey];
         }

         if (pilot.crippledAft)
         {
            pilot.crippledAft.cardTypeKey = CardType.PILOT;
            pilot.crippledAft.xwingType = PilotCard;
            pilot.crippledAft.parent = pilot;
            pilot.crippledAft.shipFaction = ShipFaction.properties[pilot.crippledAft.shipFactionKey];
         }
      });

      //////////////////////////////////////////////////////////////////////////
      // Utility methods.

      PilotCard.getName = function(pilotKey)
      {
         InputValidator.validateNotNull("pilotKey", pilotKey);

         var pilot = PilotCard.properties[pilotKey];
         var answer = "";
         answer += (pilot.isUnique ? "\u2022 " : ""); // bullet
         answer += pilot.name;

         return answer;
      };

      PilotCard.keysByFaction = function(factionKey, isStrict)
      {
         InputValidator.validateNotNull("factionKey", factionKey);

         var answer = this.keys().filter(function(pilotKey)
         {
            var pilot = PilotCard.properties[pilotKey];
            return pilot.shipFaction.factionKey === factionKey;
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

      PilotCard.keysByShipAndFaction = function(shipKey, factionKey, isStrict)
      {
         InputValidator.validateNotNull("shipKey", shipKey);
         InputValidator.validateNotNull("factionKey", factionKey);

         var answer = this.keysByFaction(factionKey, isStrict).filter(function(pilotKey)
         {
            var shipFactionKey = PilotCard.properties[pilotKey].shipFactionKey;
            return ShipFaction.properties[shipFactionKey].shipKey === shipKey;
         });

         return answer;
      };

      PilotCard.keysByShipFaction = function(shipFactionKey)
      {
         InputValidator.validateNotNull("shipFactionKey", shipFactionKey);

         return this.keys().filter(function(pilotKey)
         {
            return PilotCard.properties[pilotKey].shipFactionKey === shipFactionKey;
         });
      };

      PilotCard.toString = function()
      {
         return "PilotCard";
      };

      if (Object.freeze)
      {
         Object.freeze(PilotCard);
      }

      return PilotCard;
   });
