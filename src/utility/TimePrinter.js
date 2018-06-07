/*
 * Provides convenience methods to print time.
 */
const TimePrinter = {
   SECONDS_TO_MS: 1000,
   MINUTES_TO_MS: 60 * 1000,

   /*
    * @param title Title.
    * @param start Start time. (ms)
    * @param end End time. (ms)
    *
    * @return a formatted string.
    */
   formatElapsedTime: function(title, start, end)
   {
      const myStart = Math.min(start, end);
      const myEnd = Math.max(start, end);

      const elapsed = myEnd - myStart;
      const minutes = Math.floor(elapsed / this.MINUTES_TO_MS);
      const leftover = elapsed - (minutes * this.MINUTES_TO_MS);
      const seconds = Math.floor(leftover / this.SECONDS_TO_MS);

      let sb = "";

      sb += this.createTitleString(title);
      sb += minutes;
      sb += ":";

      if (seconds < 10)
      {
         sb += "0";
      }

      sb += seconds;
      sb += " (";
      sb += elapsed;
      sb += " ms)";

      return sb;
   },

   /*
    * @param title Title.
    * @param start Start time. (ms)
    * @param end End time. (ms)
    */
   printElapsedTime: function(title, start, end)
   {
      console.info(this.formatElapsedTime(title, start, end));
   },

   createTitleString: function(title)
   {
      let sb = "";

      if (!title || title.length === 0)
      {
         sb += "Elapsed time ";
      }
      else
      {
         sb += title;
         sb += " elapsed time ";
      }

      return sb;
   },
};

export default TimePrinter;