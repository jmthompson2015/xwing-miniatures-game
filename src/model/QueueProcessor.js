import InputValidator from "../utility/InputValidator.js";

function QueueProcessor(queueIn, callback, elementFunctionIn, finishFunctionIn, delayIn)
{
   InputValidator.validateIsArray("queue", queueIn);
   InputValidator.validateIsFunction("callback", callback);
   // elementFunction optional.
   // finishFunction optional.
   // delayIn optional.

   const queue = queueIn.slice();

   this.queue = function()
   {
      return queue;
   };

   this.callback = function()
   {
      return callback;
   };

   const elementFunction = (elementFunctionIn !== undefined ? elementFunctionIn : function(element, queueCallback)
   {
      queueCallback();
   });

   this.elementFunction = function()
   {
      return elementFunction;
   };

   const finishFunction = (finishFunctionIn !== undefined ? finishFunctionIn : function(finishCallback)
   {
      finishCallback();
   });

   this.finishFunction = function()
   {
      return finishFunction;
   };

   const delay = (delayIn !== undefined ? delayIn : 1000);

   this.delay = function()
   {
      return delay;
   };
}

QueueProcessor.prototype.processQueue = function()
{
   if (this.queue().length === 0)
   {
      const finishFunction = this.finishFunction();
      const finishCallback = this.callback();

      setTimeout(function()
      {
         finishFunction(finishCallback);
      }, this.delay());
      return;
   }

   const element = this.queue().shift();
   const elementFunction = this.elementFunction();
   const processQueue = this.processQueue.bind(this);
   const queueCallback = function()
   {
      processQueue();
   };

   elementFunction(element, queueCallback);
};

export default QueueProcessor;