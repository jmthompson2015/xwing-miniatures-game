"use strict";

define(["qunit", "redux",
  "artifact/js/Count", "artifact/js/DamageCard", "artifact/js/Faction", "artifact/js/Phase", "artifact/js/PilotCard", "artifact/js/ShipAction", "artifact/js/UpgradeCard",
  "model/js/Ability", "model/js/Agent", "model/js/CardAction", "model/js/CardInstance", "model/js/DamageAbility3", "model/js/EnvironmentAction", "model/js/PilotAbility3", "model/js/Position", "model/js/Reducer", "model/js/ShipActionAbility", "model/js/UpgradeAbility3"],
   function(QUnit, Redux,
      Count, DamageCard, Faction, Phase, PilotCard, ShipAction, UpgradeCard,
      Ability, Agent, CardAction, CardInstance, DamageAbility3, EnvironmentAction, PilotAbility3, Position, Reducer, ShipActionAbility, UpgradeAbility3)
   {
      QUnit.module("CardReducer");

      QUnit.test("addCloakCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.CLOAK;
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 0);

         // Run.
         store.dispatch(CardAction.addCloakCount(token));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.addCloakCount(token, 2));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 3);
      });

      QUnit.test("addCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = "focus";
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 0);

         // Run.
         store.dispatch(CardAction.addCount(token, property));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.addCount(token, property, 2));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 3);

         // Run.
         store.dispatch(CardAction.addCount(token, property, -4));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 0);
      });

      QUnit.test("addEnergyCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.ENERGY;
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 0);

         // Run.
         store.dispatch(CardAction.addEnergyCount(token));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.addEnergyCount(token, 2));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 3);
      });

      QUnit.test("addEvadeCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.EVADE;
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 0);

         // Run.
         store.dispatch(CardAction.addEvadeCount(token));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.addEvadeCount(token, 2));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 3);
      });

      QUnit.test("addFocusCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.FOCUS;
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 0);

         // Run.
         store.dispatch(CardAction.addFocusCount(token));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.addFocusCount(token, 2));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 3);
      });

      QUnit.test("addIonCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.ION;
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 0);

         // Run.
         store.dispatch(CardAction.addIonCount(token));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.addIonCount(token, 2));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 3);
      });

      QUnit.test("addReinforceCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.REINFORCE;
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 0);

         // Run.
         store.dispatch(CardAction.addReinforceCount(token));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.addReinforceCount(token, 2));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 3);
      });

      QUnit.test("addShieldCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.SHIELD;
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 0);

         // Run.
         store.dispatch(CardAction.addShieldCount(token));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.addShieldCount(token, 2));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 3);
      });

      QUnit.test("addStressCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.STRESS;
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 0);

         // Run.
         store.dispatch(CardAction.addStressCount(token));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.addStressCount(token, 2));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 3);
      });

      QUnit.test("addTokenCriticalDamage()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var damageKey0 = DamageCard.BLINDED_PILOT;
         var damageKey1 = DamageCard.CONSOLE_FIRE;
         assert.ok(!store.getState().cardCriticalDamages[token.id()]);

         // Run.
         store.dispatch(CardAction.addCriticalDamage(token, damageKey0));

         // Verify.
         var damages = store.getState().cardCriticalDamages.get(token.id());
         assert.ok(damages);
         assert.equal(damages.size, 1);
         assert.equal(damages.get(0), damageKey0);

         // Run.
         store.dispatch(CardAction.addCriticalDamage(token, damageKey1));

         // Verify.
         damages = store.getState().cardCriticalDamages.get(token.id());
         assert.ok(damages);
         assert.equal(damages.size, 2);
         assert.equal(damages.get(0), damageKey0);
         assert.equal(damages.get(1), damageKey1);
      });

      QUnit.test("addTokenDamage()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         var damageKey0 = DamageCard.BLINDED_PILOT;
         var damageKey1 = DamageCard.CONSOLE_FIRE;
         assert.ok(!store.getState().cardDamages[token.id()]);

         // Run.
         store.dispatch(CardAction.addDamage(token, damageKey0));

         // Verify.
         var damages = store.getState().cardDamages.get(token.id());
         assert.ok(damages);
         assert.equal(damages.size, 1);
         assert.equal(damages.get(0), damageKey0);

         // Run.
         store.dispatch(CardAction.addDamage(token, damageKey1));

         // Verify.
         damages = store.getState().cardDamages.get(token.id());
         assert.ok(damages);
         assert.equal(damages.size, 2);
         assert.equal(damages.get(0), damageKey0);
         assert.equal(damages.get(1), damageKey1);
      });

      QUnit.test("addTokenUpgrade()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var upgradeKey0 = UpgradeCard.ADRENALINE_RUSH;
         var upgradeKey1 = UpgradeCard.CALCULATION;
         assert.ok(!store.getState().cardUpgrades.get(token.id()));

         // Run.
         store.dispatch(CardAction.addUpgrade(token, upgradeKey0));

         // Verify.
         var upgrades = store.getState().cardUpgrades.get(token.id());
         assert.ok(upgrades);
         assert.equal(upgrades.size, 1);
         assert.equal(upgrades.get(0), upgradeKey0);

         // Run.
         store.dispatch(CardAction.addUpgrade(token, upgradeKey1));

         // Verify.
         upgrades = store.getState().cardUpgrades.get(token.id());
         assert.ok(upgrades);
         assert.equal(upgrades.size, 2);
         assert.equal(upgrades.get(0), upgradeKey0);
         assert.equal(upgrades.get(1), upgradeKey1);
      });

      QUnit.test("addTokenUpgradeEnergy()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         var upgradeKey0 = UpgradeCard.ADRENALINE_RUSH;
         var upgradeKey1 = UpgradeCard.CALCULATION;
         assert.ok(!store.getState().cardUpgradeEnergy.get(token.id()));

         // Run.
         store.dispatch(CardAction.addUpgradeEnergy(token, upgradeKey0));

         // Verify.
         var upgradeEnergy = store.getState().cardUpgradeEnergy.get(token.id());
         assert.ok(upgradeEnergy);
         assert.ok(upgradeEnergy.get(upgradeKey0));
         assert.ok(!upgradeEnergy.get(upgradeKey1));
         assert.equal(upgradeEnergy.get(upgradeKey0), 1);

         // Run.
         store.dispatch(CardAction.addUpgradeEnergy(token, upgradeKey1, 2));

         // Verify.
         upgradeEnergy = store.getState().cardUpgradeEnergy.get(token.id());
         assert.ok(upgradeEnergy);
         assert.ok(upgradeEnergy.get(upgradeKey0));
         assert.ok(upgradeEnergy.get(upgradeKey1));
         assert.equal(upgradeEnergy.get(upgradeKey0), 1);
         assert.equal(upgradeEnergy.get(upgradeKey1), 2);
      });

      QUnit.test("addTokenUsedAbility()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         var damage = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility3, Phase.COMBAT_DEAL_DAMAGE);
         var pilot = new Ability(PilotCard, PilotCard.ACADEMY_PILOT, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var shipAction = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
         var upgrade = new Ability(UpgradeCard, UpgradeCard.A_WING_TEST_PILOT, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var usedAbilities = token.usedAbilities();
         assert.equal(usedAbilities.size, 0);

         // Run.
         store.dispatch(CardAction.addUsedAbility(token, damage));

         // Verify.
         usedAbilities = token.usedAbilities();
         assert.equal(usedAbilities.size, 1);
         assert.equal(usedAbilities.get(0).source(), DamageCard);

         // Run.
         store.dispatch(CardAction.addUsedAbility(token, pilot));

         // Verify.
         usedAbilities = token.usedAbilities();
         assert.equal(usedAbilities.size, 2);
         assert.equal(usedAbilities.get(0).source(), DamageCard);
         assert.equal(usedAbilities.get(1).source(), PilotCard);

         // Run.
         store.dispatch(CardAction.addUsedAbility(token, shipAction));

         // Verify.
         usedAbilities = token.usedAbilities();
         assert.equal(usedAbilities.size, 3);
         assert.equal(usedAbilities.get(0).source(), DamageCard);
         assert.equal(usedAbilities.get(1).source(), PilotCard);
         assert.equal(usedAbilities.get(2).source(), ShipAction);

         // Run.
         store.dispatch(CardAction.addUsedAbility(token, upgrade));

         // Verify.
         usedAbilities = token.usedAbilities();
         assert.equal(usedAbilities.size, 4);
         assert.equal(usedAbilities.get(0).source(), DamageCard);
         assert.equal(usedAbilities.get(1).source(), PilotCard);
         assert.equal(usedAbilities.get(2).source(), ShipAction);
         assert.equal(usedAbilities.get(3).source(), UpgradeCard);
      });

      QUnit.test("addTokenUsedPerRoundAbility()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         var damage = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility3, Phase.COMBAT_DEAL_DAMAGE);
         var pilot = new Ability(PilotCard, PilotCard.ACADEMY_PILOT, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var shipAction = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
         var upgrade = new Ability(UpgradeCard, UpgradeCard.A_WING_TEST_PILOT, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var usedAbilities = token.usedPerRoundAbilities();
         assert.equal(usedAbilities.size, 0);

         // Run.
         store.dispatch(CardAction.addUsedPerRoundAbility(token, damage));

         // Verify.
         usedAbilities = token.usedPerRoundAbilities();
         assert.equal(usedAbilities.size, 1);
         assert.equal(usedAbilities.get(0).source(), DamageCard);

         // Run.
         store.dispatch(CardAction.addUsedPerRoundAbility(token, pilot));

         // Verify.
         usedAbilities = token.usedPerRoundAbilities();
         assert.equal(usedAbilities.size, 2);
         assert.equal(usedAbilities.get(0).source(), DamageCard);
         assert.equal(usedAbilities.get(1).source(), PilotCard);

         // Run.
         store.dispatch(CardAction.addUsedPerRoundAbility(token, shipAction));

         // Verify.
         usedAbilities = token.usedPerRoundAbilities();
         assert.equal(usedAbilities.size, 3);
         assert.equal(usedAbilities.get(0).source(), DamageCard);
         assert.equal(usedAbilities.get(1).source(), PilotCard);
         assert.equal(usedAbilities.get(2).source(), ShipAction);

         // Run.
         store.dispatch(CardAction.addUsedPerRoundAbility(token, upgrade));

         // Verify.
         usedAbilities = token.usedPerRoundAbilities();
         assert.equal(usedAbilities.size, 4);
         assert.equal(usedAbilities.get(0).source(), DamageCard);
         assert.equal(usedAbilities.get(1).source(), PilotCard);
         assert.equal(usedAbilities.get(2).source(), ShipAction);
         assert.equal(usedAbilities.get(3).source(), UpgradeCard);
      });

      QUnit.test("addWeaponsDisabledCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.WEAPONS_DISABLED;
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 0);

         // Run.
         store.dispatch(CardAction.addWeaponsDisabledCount(token));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.addWeaponsDisabledCount(token, 2));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 3);
      });

      QUnit.test("clearTokenUsedAbilities()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         var damage = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility3, Phase.COMBAT_DEAL_DAMAGE);
         var pilot = new Ability(PilotCard, PilotCard.ACADEMY_PILOT, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var shipAction = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
         var upgrade = new Ability(UpgradeCard, UpgradeCard.A_WING_TEST_PILOT, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         store.dispatch(CardAction.addUsedAbility(token, damage));
         store.dispatch(CardAction.addUsedAbility(token, pilot));
         store.dispatch(CardAction.addUsedAbility(token, shipAction));
         store.dispatch(CardAction.addUsedAbility(token, upgrade));
         assert.equal(token.usedAbilities().size, 4);

         // Run.
         store.dispatch(CardAction.clearUsedAbilities(token));

         // Verify.
         assert.equal(token.usedAbilities().size, 0);
      });

      QUnit.test("clearTokenUsedPerRoundAbilities()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         var damage = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility3, Phase.COMBAT_DEAL_DAMAGE);
         var pilot = new Ability(PilotCard, PilotCard.ACADEMY_PILOT, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var shipAction = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
         var upgrade = new Ability(UpgradeCard, UpgradeCard.A_WING_TEST_PILOT, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         store.dispatch(CardAction.addUsedPerRoundAbility(token, damage));
         store.dispatch(CardAction.addUsedPerRoundAbility(token, pilot));
         store.dispatch(CardAction.addUsedPerRoundAbility(token, shipAction));
         store.dispatch(CardAction.addUsedPerRoundAbility(token, upgrade));
         assert.equal(token.usedPerRoundAbilities().size, 4);

         // Run.
         store.dispatch(CardAction.clearUsedPerRoundAbilities(token));

         // Verify.
         assert.equal(token.usedPerRoundAbilities().size, 0);
      });

      QUnit.test("incrementNextTokenId()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         assert.equal(store.getState().nextCardId, 1);

         // Run.
         store.dispatch(CardAction.incrementNextCardId());

         // Verify.
         assert.equal(store.getState().nextCardId, 2);

         // Run.
         store.dispatch(CardAction.incrementNextCardId());

         // Verify.
         assert.equal(store.getState().nextCardId, 3);
      });

      QUnit.test("removeTokenCriticalDamage()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var damageKey0 = DamageCard.BLINDED_PILOT;
         var damageKey1 = DamageCard.CONSOLE_FIRE;
         store.dispatch(CardAction.addCriticalDamage(token, damageKey0));
         store.dispatch(CardAction.addCriticalDamage(token, damageKey1));
         var damages = store.getState().cardCriticalDamages.get(token.id());
         assert.ok(damages);
         assert.equal(damages.size, 2);
         assert.equal(damages.get(0), damageKey0);
         assert.equal(damages.get(1), damageKey1);

         // Run.
         store.dispatch(CardAction.removeCriticalDamage(token, damageKey1));

         // Verify.
         damages = store.getState().cardCriticalDamages.get(token.id());
         assert.ok(damages);
         assert.equal(damages.size, 1);
         assert.equal(damages.get(0), damageKey0);

         // Run.
         store.dispatch(CardAction.removeCriticalDamage(token, damageKey0));

         // Verify.
         damages = store.getState().cardCriticalDamages.get(token.id());
         assert.ok(damages);
         assert.equal(damages.size, 0);
      });

      QUnit.test("removeTokenDamage()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         var damageKey0 = DamageCard.BLINDED_PILOT;
         var damageKey1 = DamageCard.CONSOLE_FIRE;
         store.dispatch(CardAction.addDamage(token, damageKey0));
         store.dispatch(CardAction.addDamage(token, damageKey1));
         var damages = store.getState().cardDamages.get(token.id());
         assert.ok(damages);
         assert.equal(damages.size, 2);
         assert.equal(damages.get(0), damageKey0);
         assert.equal(damages.get(1), damageKey1);

         // Run.
         store.dispatch(CardAction.removeDamage(token, damageKey1));

         // Verify.
         damages = store.getState().cardDamages.get(token.id());
         assert.ok(damages);
         assert.equal(damages.size, 1);
         assert.equal(damages.get(0), damageKey0);

         // Run.
         store.dispatch(CardAction.removeDamage(token, damageKey0));

         // Verify.
         damages = store.getState().cardDamages.get(token.id());
         assert.ok(damages);
         assert.equal(damages.size, 0);
      });

      QUnit.test("removeTokenUpgrade()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var upgradeKey0 = UpgradeCard.ADRENALINE_RUSH;
         var upgradeKey1 = UpgradeCard.CALCULATION;
         store.dispatch(CardAction.addUpgrade(token, upgradeKey0));
         store.dispatch(CardAction.addUpgrade(token, upgradeKey1));
         assert.ok(store.getState().cardUpgrades.get(token.id()));
         assert.equal(store.getState().cardUpgrades.get(token.id()).size, 2);
         assert.equal(store.getState().cardUpgrades.get(token.id()).get(0), upgradeKey0);
         assert.equal(store.getState().cardUpgrades.get(token.id()).get(1), upgradeKey1);

         // Run.
         store.dispatch(CardAction.removeUpgrade(token, upgradeKey1));

         // Verify.
         assert.ok(store.getState().cardUpgrades.get(token.id()));
         assert.equal(store.getState().cardUpgrades.get(token.id()).size, 1);
         assert.equal(store.getState().cardUpgrades.get(token.id()).get(0), upgradeKey0);

         // Run.
         store.dispatch(CardAction.removeUpgrade(token, upgradeKey0));

         // Verify.
         assert.ok(store.getState().cardUpgrades.get(token.id()));
         assert.equal(store.getState().cardUpgrades.get(token.id()).size, 0);
      });

      QUnit.test("removeTokenUsedAbility()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         var damage = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility3, Phase.COMBAT_DEAL_DAMAGE);
         var pilot = new Ability(PilotCard, PilotCard.ACADEMY_PILOT, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var shipAction = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
         var upgrade = new Ability(UpgradeCard, UpgradeCard.A_WING_TEST_PILOT, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         store.dispatch(CardAction.addUsedAbility(token, damage));
         store.dispatch(CardAction.addUsedAbility(token, pilot));
         store.dispatch(CardAction.addUsedAbility(token, shipAction));
         store.dispatch(CardAction.addUsedAbility(token, upgrade));
         var usedAbilities = token.usedAbilities();
         assert.equal(usedAbilities.size, 4);
         assert.equal(usedAbilities.get(0).source(), DamageCard);
         assert.equal(usedAbilities.get(1).source(), PilotCard);
         assert.equal(usedAbilities.get(2).source(), ShipAction);
         assert.equal(usedAbilities.get(3).source(), UpgradeCard);

         // Run.
         store.dispatch(CardAction.removeUsedAbility(token, shipAction));

         // Verify.
         usedAbilities = token.usedAbilities();
         assert.equal(usedAbilities.size, 3);
         assert.equal(usedAbilities.get(0).source(), DamageCard);
         assert.equal(usedAbilities.get(1).source(), PilotCard);
         assert.equal(usedAbilities.get(2).source(), UpgradeCard);

         // Run.
         store.dispatch(CardAction.removeUsedAbility(token, damage));

         // Verify.
         usedAbilities = token.usedAbilities();
         assert.equal(usedAbilities.size, 2);
         assert.equal(usedAbilities.get(0).source(), PilotCard);
         assert.equal(usedAbilities.get(1).source(), UpgradeCard);

         // Run.
         store.dispatch(CardAction.removeUsedAbility(token, upgrade));

         // Verify.
         usedAbilities = token.usedAbilities();
         assert.equal(usedAbilities.size, 1);
         assert.equal(usedAbilities.get(0).source(), PilotCard);
      });

      QUnit.test("removeTokenUsedPerRoundAbility()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         var damage = new Ability(DamageCard, DamageCard.BLINDED_PILOT, DamageAbility3, Phase.COMBAT_DEAL_DAMAGE);
         var pilot = new Ability(PilotCard, PilotCard.ACADEMY_PILOT, PilotAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         var shipAction = new Ability(ShipAction, ShipAction.EVADE, ShipActionAbility, ShipActionAbility.ABILITY_KEY);
         var upgrade = new Ability(UpgradeCard, UpgradeCard.A_WING_TEST_PILOT, UpgradeAbility3, Phase.COMBAT_MODIFY_ATTACK_DICE);
         store.dispatch(CardAction.addUsedPerRoundAbility(token, damage));
         store.dispatch(CardAction.addUsedPerRoundAbility(token, pilot));
         store.dispatch(CardAction.addUsedPerRoundAbility(token, shipAction));
         store.dispatch(CardAction.addUsedPerRoundAbility(token, upgrade));
         var usedAbilities = token.usedPerRoundAbilities();
         assert.equal(usedAbilities.size, 4);
         assert.equal(usedAbilities.get(0).source(), DamageCard);
         assert.equal(usedAbilities.get(1).source(), PilotCard);
         assert.equal(usedAbilities.get(2).source(), ShipAction);
         assert.equal(usedAbilities.get(3).source(), UpgradeCard);

         // Run.
         store.dispatch(CardAction.removeUsedPerRoundAbility(token, shipAction));

         // Verify.
         usedAbilities = token.usedPerRoundAbilities();
         assert.equal(usedAbilities.size, 3);
         assert.equal(usedAbilities.get(0).source(), DamageCard);
         assert.equal(usedAbilities.get(1).source(), PilotCard);
         assert.equal(usedAbilities.get(2).source(), UpgradeCard);

         // Run.
         store.dispatch(CardAction.removeUsedPerRoundAbility(token, damage));

         // Verify.
         usedAbilities = token.usedPerRoundAbilities();
         assert.equal(usedAbilities.size, 2);
         assert.equal(usedAbilities.get(0).source(), PilotCard);
         assert.equal(usedAbilities.get(1).source(), UpgradeCard);

         // Run.
         store.dispatch(CardAction.removeUsedPerRoundAbility(token, upgrade));

         // Verify.
         usedAbilities = token.usedPerRoundAbilities();
         assert.equal(usedAbilities.size, 1);
         assert.equal(usedAbilities.get(0).source(), PilotCard);
      });

      QUnit.test("setCloakCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.CLOAK;
         store.dispatch(CardAction.addCloakCount(token));
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.setCloakCount(token, 12));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 12);
      });

      QUnit.test("setCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = "focus";
         store.dispatch(CardAction.addCount(token, property));
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.setCount(token, property, 12));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 12);
      });

      QUnit.test("setEnergyCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.ENERGY;
         store.dispatch(CardAction.addEnergyCount(token));
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.setEnergyCount(token, 12));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 12);
      });

      QUnit.test("setEvadeCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.EVADE;
         store.dispatch(CardAction.addEvadeCount(token));
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.setEvadeCount(token, 12));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 12);
      });

      QUnit.test("setFocusCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.FOCUS;
         store.dispatch(CardAction.addFocusCount(token));
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.setFocusCount(token, 12));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 12);
      });

      QUnit.test("setIonCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.ION;
         store.dispatch(CardAction.addIonCount(token));
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.setIonCount(token, 12));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 12);
      });

      QUnit.test("setReinforceCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.REINFORCE;
         store.dispatch(CardAction.addReinforceCount(token));
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.setReinforceCount(token, 12));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 12);
      });

      QUnit.test("setShieldCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.SHIELD;
         store.dispatch(CardAction.addShieldCount(token));
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.setShieldCount(token, 12));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 12);
      });

      QUnit.test("setStressCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.STRESS;
         store.dispatch(CardAction.addStressCount(token));
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.setStressCount(token, 12));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 12);
      });

      QUnit.test("setUpgradeEnergy()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         var upgradeKey0 = UpgradeCard.ADRENALINE_RUSH;
         var upgradeKey1 = UpgradeCard.CALCULATION;
         assert.ok(!store.getState().cardUpgradeEnergy.get(token.id()));

         // Run.
         store.dispatch(CardAction.setUpgradeEnergy(token, upgradeKey0, 1));

         // Verify.
         var upgradeEnergy = store.getState().cardUpgradeEnergy.get(token.id());
         assert.ok(upgradeEnergy);
         assert.equal(upgradeEnergy.get(upgradeKey0), 1);
         assert.ok(!upgradeEnergy.get(upgradeKey1), 0);

         // Run.
         store.dispatch(CardAction.setUpgradeEnergy(token, upgradeKey1, 2));

         // Verify.
         upgradeEnergy = store.getState().cardUpgradeEnergy.get(token.id());
         assert.ok(upgradeEnergy);
         assert.equal(upgradeEnergy.get(upgradeKey0), 1);
         assert.equal(upgradeEnergy.get(upgradeKey1), 2);
      });

      QUnit.test("setWeaponsDisabledCount()", function(assert)
      {
         // Setup.
         var store = Redux.createStore(Reducer.root);
         var token = new CardInstance(store, PilotCard.ACADEMY_PILOT, new Agent(store, "Imperial", Faction.IMPERIAL));
         store.dispatch(EnvironmentAction.placeToken(new Position(10, 20, 30), token));
         var property = Count.WEAPONS_DISABLED;
         store.dispatch(CardAction.addWeaponsDisabledCount(token));
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 1);

         // Run.
         store.dispatch(CardAction.setWeaponsDisabledCount(token, 12));

         // Verify.
         assert.ok(store.getState().cardCounts.get(token.id()));
         assert.equal(store.getState().cardCounts.get(token.id()).get(property), 12);
      });
   });
