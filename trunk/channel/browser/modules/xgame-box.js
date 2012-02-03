/**
 * @author 王集鹄(wangjihu，http://weibo.com/zswang)
 */
AceCore.addModule("XGameBox", function(sandbox){
	/**
	 * 事件集合
	 */
	var events = sandbox.getConfig("Events");
	/**
	 * 类库
	 */
	var lib = sandbox.getLib();
	/**
	 * 用户列表
	 */
	var xgameTree;
	/**
	 * 登录信息
	 */
	var passportInfo = {};
	/**
	 * 获取房间当前状态成功
	 * @param {Object} data
	 */
	function pickSuccess(data) {
		lib.each(data, function(item) {
			switch(item.type) {
				case "passport":
					passportInfo = item.info;
					break;
				case "xgameAll":
					console.log("xgameAll");
					xgameTree.loadChilds(item.infos);
					break;
				case "xgameUpdate":
					lib.each(item.infos, function(item) {
						var node = xgameTree.updateData(item);
					});
					break;
			}
		});
	}
	
	return {
		init: function() {
			xgameTree = AceTree.create({
				parent: lib.g("xgameListTemplate").parentNode,
				oninit: function(tree){
					tree.eventHandler = AceEvent.on(tree.parent, function(command, target, e){
						var node = tree.node4target(target);
						node && tree.oncommand(command, node, e);
					});
				},
				onreader: function(node){
					return AceTemplate.format('xgameListTemplate', node.data, {
						node: node
					});
				},
				oncommand: function(command, node, e){
					switch (command) {
						case "focus":
							node.focus();
							sandbox.fire(events.xgame, {
								id: node.data.id,
								checked: !node.data.checked
							});
							break;
					}
				},
				statusClasses: /^(focus|hover|select|expand|self)$/
			});
			sandbox.on(events.pickSuccess, pickSuccess);
		}
	};
});