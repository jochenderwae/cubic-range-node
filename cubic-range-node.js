module.exports = function(RED) {
    function CubicRangeNode(config) {
        RED.nodes.createNode(this, config);
		
		xs = JSON.parse("[" + config.xs + "]");
		ys = JSON.parse("[" + config.ys + "]");
		
		Spline = require('cubic-spline');
		this.property = config.property;
		this.spline = new Spline(xs, ys);
		this.acceptNewTable = config.acceptNewTable;
		this.newTableTopic = "newtable";
		
        var node = this;
		
        node.on('input', function(msg) {
			if(node.acceptNewTable && msg.table) {
				if(Array.isArray(msg.table.x) && 
					Array.isArray(msg.table.y) && 
					msg.table.x.length == msg.table.y.length && 
					msg.table.x.length > 2) {
					node.spline = new Spline(msg.table.x, msg.table.y);
					node.log("setting new table: " + node.spline);
				} else {
					node.log(RED._("contrib.cubic.range.errors.table") + ": " + msg.table);
				}
			}
			
			var value = RED.util.getMessageProperty(msg, node.property);
			if(value !== undefined) {
				var n = Number(value);
				if (!isNaN(n)) {
					if(!node.acceptNewTable || msg.topic !== node.newTableTopic) {
						value = node.spline.at(n);
						/*node.log(n + ": " + value);*/
					}

					RED.util.setMessageProperty(msg, node.property, value);
					node.send(msg);
				} else {
					node.log(RED._("contrib.cubic.range.errors.notnumber") + ": " + value);
				}
			} else {
				node.send(msg); // If no payload - just pass it on.
			}
        });
    }
    RED.nodes.registerType("cubic-range", CubicRangeNode);
}