var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  socketNotificationReceived: function(notification, payload) {
    let threshold = payload["threshold"];
    let distDiff = payload["distanceDiff"];
    let DEBUG = payload["debug"];

    // creating demon spawn
    var child = require("child_process").spawn("sudo", [
      __dirname + "/swiper",
      JSON.stringify(payload),
    ]);

    // using arrow function to keep "this" reference of outer scope
    child.stdout.on("data", (data) => {
      data = data
        .toString()
        .replace(/\s+/g, "")
        .trim()
        .split(":");

      let leftDist = parseFloat(data[0]).toFixed(0);
      let rightDist = parseFloat(data[1]).toFixed(0);

      if (DEBUG) console.log("LEFT: " + leftDist + ", RIGHT: " + rightDist);

      	if (leftDist <= threshold && rightDist >= threshold) {
	  console.log(" left button pressed");
          this.sendSocketNotification("PAGE_INCREMENT", null);
	}else if (rightDist <= threshold && leftDist >= threshold) {
	  console.log(" right button pressed");
	  this.sendSocketNotification("PAGE_DECREMENT", null);
	}else if (leftDist <= threshold && rightDist <= threshold) {
	    if(leftDist * distDiff <= rightDist) {
	  	console.log(" left button pressed2");
          	this.sendSocketNotification("PAGE_INCREMENT", null);
            } else if (rightDist * distDiff <= leftDist) {
	  	console.log(" right button pressed2");
          	this.sendSocketNotification("PAGE_DECREMENT", null);
	    }
        }
      	if (leftDist <= threshold || rightDist <= threshold) {
          this.sendSocketNotification("PAGE_ACTIVATE", null);

	}
      
    });

    child.stdout.on("exit", function(exitCode) {
      console.log(exitCode);
    });
  },
});
