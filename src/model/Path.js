/*
 * Provides a path of points.
 */
function Path()
{
   const points = [];

   this.points = function()
   {
      return points;
   };

   this.add = function(x, y)
   {
      points.push(x);
      points.push(y);
   };
}

Path.prototype.close = function()
{
   const points = this.points();

   if (points.length >= 2)
   {
      points.push(points[0]);
      points.push(points[1]);
   }
};

Path.prototype.boundingBox = function()
{
   let answer;
   const points = this.points();

   if (points.length > 1)
   {
      let minX = points[0];
      let minY = points[1];
      let maxX = minX;
      let maxY = minY;

      for (let i = 2; i < points.length; i += 2)
      {
         const x = points[i];
         const y = points[i + 1];

         minX = Math.min(x, minX);
         minY = Math.min(y, minY);
         maxX = Math.max(x, maxX);
         maxY = Math.max(y, maxY);
      }

      LOGGER.trace("min = " + minX + " " + minY + " max = " + maxX + " " + maxY);

      answer = {
         minX: minX,
         minY: minY,
         maxX: maxX,
         maxY: maxY,
         area: (maxX - minX) * (maxY - minY),
      };
   }

   return answer;
};

Path.prototype.paintComponent = function(context, strokeStyle)
{
   const points = this.points();

   if (points.length >= 2)
   {
      context.beginPath();
      context.moveTo(points[0], points[1]);

      for (let i = 2; i < points.length; i += 2)
      {
         context.lineTo(points[i], points[i + 1]);
      }

      context.strokeStyle = strokeStyle;
      context.stroke();
   }
};

/*
 * Rotate about the given point.
 */
Path.prototype.rotate = function(angle, centerX, centerY)
{
   const points = this.points();
   const cx = centerX || 0;
   const cy = centerY || 0;
   const sin = Math.sin(angle);
   const cos = Math.cos(angle);

   for (let i = 0; i < points.length; i += 2)
   {
      const x = points[i] - cx;
      const y = points[i + 1] - cy;

      points[i] = (x * cos - y * sin) + cx;
      points[i + 1] = (x * sin + y * cos) + cy;
   }
};

Path.prototype.toString = function()
{
   let answer = "";
   const points = this.points();

   for (let i = 0; i < points.length; i += 2)
   {
      const x = points[i];
      const y = points[i + 1];

      answer += i + " (" + x + ", " + y + ")\n";
   }

   return answer;
};

Path.prototype.translate = function(dx, dy)
{
   const points = this.points();

   for (let i = 0; i < points.length; i += 2)
   {
      points[i] = points[i] + dx;
      points[i + 1] = points[i + 1] + dy;
   }
};

export default Path;