/**
 * @author ������(wangjihu��http://weibo.com/zswang)
 */
AceCore.addModule("ZhouziBox", function(sandbox){
	/**
	 * �¼�����
	 */
	var events = sandbox.getConfig("Events");
	/**
	 * ���
	 */
	var lib = sandbox.getLib();
	/**
	 * �û��б�
	 */
	var zhouziTree;
	/**
	 * ��¼��Ϣ
	 */
	var passportInfo = {};
	
	var rowCount = 9;
	var colCount = 9;
	
	var currPlayer;
	var player1;
	var player2;
	var gameover;
	function updatePlayer(){
		lib.removeClass('zhouziBox', 'player1');
		lib.removeClass('zhouziBox', 'player2');
		lib.removeClass('zhouziBox', 'win');
		lib.removeClass('zhouziBox', 'lost');
		if (currPlayer == passportInfo.id){
			if (currPlayer == player1){
				lib.addClass('zhouziBox', 'player1');
			}
			if (currPlayer == player2){
				lib.addClass('zhouziBox', 'player2');
			}
		}
		T.g('player1').disabled = !!player1;
		T.g('player2').disabled = !!player2;
		if (gameover == 'move'){
			lib.addClass('zhouziBox', 'win');
		} else if (gameover == 'plug'){
			lib.addClass('zhouziBox', 'lost');
		}
	}
	function zhouziMove(item){
		currPlayer = item.currPlayer;
		for(var path in item.updates){
			zhouziTree.updateData({
				id: path,
				value: item.updates[path]
			});
		}
		updatePlayer();
	}
	
	function zhouziPlug(item){
		currPlayer = item.currPlayer;
		gameover = item.gameover;
		for(var path in item.updates){
			zhouziTree.updateData({
				id: path,
				value: item.updates[path]
			});
		}
		updatePlayer();
	}
	
	function zhouziRole(item){
		currPlayer = item.currPlayer;
		player1 = item.player1;
		player2 = item.player2;
		gameover = item.gameover;
		updatePlayer();
	}
	
	function zhouziAll(item){
		rowCount = item.rowCount,
		colCount = item.colCount;
		currPlayer = item.currPlayer;
		player1 = item.player1;
		player2 = item.player2;
		gameover = item.gameover;
		var items = [];
		for (var y = 0; y < rowCount; y++){
			for (var x = 0; x < colCount; x++){
				items.push({
					id: [x, y],
					x: x,
					y: y,
					value: item.map[[x, y]]
				});
			}
		}
		zhouziTree.loadChilds(items);
		updatePlayer();
	}

	/**
	 * ��ȡ���䵱ǰ״̬�ɹ�
	 * @param {Object} data
	 */
	function pickSuccess(data) {
		lib.each(data, function(item) {
			switch(item.type) {
				case "passport":
					passportInfo = item.info;
					break;
				case "zhouziMove":
					zhouziMove(item);
					break;
				case "zhouziPlug":
					zhouziPlug(item);
					break;
				case "zhouziRole":
					zhouziRole(item);
					break;
				case "zhouziAll":
					zhouziAll(item);
					break;
				case "playerRemove":
					lib.each(item.players, function(player) {
						if (player.id == player1 || player.id == player2){
							player1 = 0;
							player2 = 0;
							gameover = false;
							updatePlayer();
						}
					});
					break;
			}
		});
	}
	
	return {
		init: function() {
			zhouziTree = AceTree.create({
				parent: lib.g("zhouziListTemplate").parentNode,
				/*
				onsort: function(a, b){
					return (a.data.commandTime || 0) - (b.data.commandTime || 0);
				},
				*/
				oninit: function(tree){
					tree.eventHandler = AceEvent.on(tree.parent, function(command, target, e){
						var node = tree.node4target(target);
						node && tree.oncommand(command, node, e);
					});
				},
				onreader: function(node){
					return AceTemplate.format('zhouziListTemplate', node.data, {
						rowCount: rowCount,
						colCount: colCount
					});
				},
				oncommand: function(command, node, e){
					switch (command) {
						case "move":
							console.log([
								currPlayer, passportInfo.id, 
								player1, player2
							]);
							if (currPlayer == passportInfo.id){
								if (currPlayer == player1){
									sandbox.fire(events.move, {
										x: node.data.x,
										y: node.data.y
									});
								}
								if (currPlayer == player2){
									sandbox.fire(events.plug, {
										x: node.data.x,
										y: node.data.y
									});
								}
							}
							break;
					}
				},
				statusClasses: /^(focus|hover|select|expand|self)$/,
				oncreated: function(node) {
					node.setStatus("self", node.data.id == passportInfo.id, true);
				}
			});
			sandbox.on(events.pickSuccess, pickSuccess);
			
			AceEvent.on('roleTools', function(command){
				switch(command){
					case 'player1':
					case 'player2':
						sandbox.fire(events.role, command);
						break;
				}
			});
			setInterval(function(){
				if (!gameover) return;
				T.dom.toggleClass('zhouziBox', 'flash');
			}, 1000);
		}
	};
});