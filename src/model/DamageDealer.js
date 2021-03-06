import InputValidator from "../utility/InputValidator.js";

import DamageCardTrait from "../artifact/DamageCardTrait.js";
import UpgradeCard from "../artifact/UpgradeCard.js";

function DamageDealer(environment, hitCount, criticalHitCount, defender, evadeCount)
{
   InputValidator.validateNotNull("environment", environment);
   InputValidator.validateNotNull("hitCount", hitCount);
   InputValidator.validateNotNull("criticalHitCount", criticalHitCount);
   InputValidator.validateNotNull("defender", defender);
   InputValidator.validateNotNull("evadeCount", evadeCount);

   this.environment = function()
   {
      return environment;
   };

   this.hitCount = function()
   {
      return hitCount;
   };

   this.criticalHitCount = function()
   {
      return criticalHitCount;
   };

   this.defender = function()
   {
      return defender;
   };

   this.evadeCount = function()
   {
      return evadeCount;
   };

   let hits = hitCount;
   let criticalHits = criticalHitCount;
   let evades = evadeCount;
   LOGGER.debug("hits = " + hits);
   LOGGER.debug("criticalHits = " + criticalHits);
   LOGGER.debug("evades = " + evades);
   let count;

   if (hits > 0)
   {
      count = Math.min(hits, evades);
      hits -= count;
      evades -= count;
   }

   if (criticalHits > 0)
   {
      count = Math.min(criticalHits, evades);
      criticalHits -= count;
      evades -= count;
   }

   LOGGER.debug("final hits = " + hits);
   LOGGER.debug("final criticalHits = " + criticalHits);
   LOGGER.debug("final evades = " + evades);
   LOGGER.debug("before hits, shield = " + defender.shieldCount());

   this.criticalHits = function()
   {
      return criticalHits;
   };

   this.dealDamage = function()
   {
      let count, i;

      if (defender.shieldCount() > 0)
      {
         count = Math.min(hits, defender.shieldCount());
         hits -= count;

         defender.removeShield(count);
      }

      LOGGER.debug("before critical hits, shield         = " + defender.shieldCount());

      if (defender.shieldCount() > 0)
      {
         count = Math.min(criticalHits, defender.shieldCount());
         criticalHits -= count;

         defender.removeShield(count);
      }

      LOGGER.debug("after both hits, shield              = " + defender.shieldCount());
      LOGGER.debug("before hits, damage                  = " + defender.damageCount());

      for (i = 0; i < hits; i++)
      {
         defender.receiveDamage(environment.drawDamage());
      }

      LOGGER.debug("after hits, damage                       = " + defender.damageCount());
      LOGGER.debug("before critical hits, criticalDamageKeys = " + defender.criticalDamageKeys());

      for (i = 0; i < criticalHits; i++)
      {
         const damage = environment.drawDamage();
         const trait = damage.card().trait;

         if (defender.isUpgradedWith(UpgradeCard.DETERMINATION) && (trait === DamageCardTrait.PILOT))
         {
            environment.discardDamage(damage);
         }
         else
         {
            defender.receiveCriticalDamage(damage);
         }
      }

      LOGGER.debug("after critical hits, criticalDamageKeys  = " + defender.criticalDamageKeys());
      LOGGER.debug("defender.isDestroyed() ? " + defender.isDestroyed());
   };

   this.hits = function()
   {
      return hits;
   };

   this.remainingEvades = function()
   {
      return evades;
   };
}

export default DamageDealer;