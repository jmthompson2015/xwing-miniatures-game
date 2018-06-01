import Logger from "../utility/Logger.js";

import HtmlUtilities from "./HtmlUtilities.js";

window.LOGGER = new Logger();
LOGGER.setTraceEnabled(false);
LOGGER.setDebugEnabled(false);

QUnit.test("HtmlUtilities.addClass()", function(assert)
{
   // Setup.
   var element = document.getElementById("div1");
   assert.ok(HtmlUtilities.hasClass(element, "one"));
   assert.ok(!HtmlUtilities.hasClass(element, "two"));

   // Run.
   HtmlUtilities.addClass(element, "two");

   // Verify.
   assert.ok(HtmlUtilities.hasClass(element, "one"));
   assert.ok(HtmlUtilities.hasClass(element, "two"));

   // Cleanup.
   HtmlUtilities.removeClass(element, "two");
   assert.ok(HtmlUtilities.hasClass(element, "one"));
   assert.ok(!HtmlUtilities.hasClass(element, "two"));
});

QUnit.test("HtmlUtilities.hasClass()", function(assert)
{
   var element = document.getElementById("div1");
   assert.ok(HtmlUtilities.hasClass(element, "one"));
   assert.ok(!HtmlUtilities.hasClass(element, "two"));
});

QUnit.test("HtmlUtilities.removeClass()", function(assert)
{
   // Setup.
   var element = document.getElementById("div1");
   assert.ok(HtmlUtilities.hasClass(element, "one"));
   assert.ok(!HtmlUtilities.hasClass(element, "two"));

   // Run.
   HtmlUtilities.removeClass(element, "one");

   // Verify.
   assert.ok(!HtmlUtilities.hasClass(element, "one"));
   assert.ok(!HtmlUtilities.hasClass(element, "two"));

   // Cleanup.
   HtmlUtilities.addClass(element, "one");
   assert.ok(HtmlUtilities.hasClass(element, "one"));
   assert.ok(!HtmlUtilities.hasClass(element, "two"));
});

QUnit.start();