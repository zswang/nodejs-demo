var common = require('../common/channel.common.js');

void function(){
	/**
	 * @author 王集鹄(wangjihu，http://weibo.com/zswang)
	 */
	function PlayerPlugin(channel, options){
		this.channel = channel;
		options = options || {};
		/**
		 * 最大人数
		 */
		this.maxCount = options.maxCount || 300;
		this.playerCount = 0;
		this.players = {};
	}
	
	PlayerPlugin.prototype.command = function(fields, passport, query){
		if (!fields || !passport || !query) return;
		passport.commandTime = new Date;
		if (passport.state == "busy") {
			passport.update({
				state: "online"
			});
			fields.push({
				type: "playerUpdate",
				players: [{
					id: passport.id,
					state: passport.state
				}]
			});
		}
		switch (query.command) {
			case "enter":
				if (this.playerCount >= this.maxCount) return;
				var player = this.getPlayer(passport.id);
				if (!player) {
					this.playerCount++;
					this.players[passport.id] = player = passport;
					fields.push({
						type: "playerAdd",
						players: [{
							id: player.id,
							nick: player.nick,
							state: player.state
						}]
					});
				}
				break;
			case "nick":
				var error = common.checkNick(query.nick);
				if (error) return error;
				var player = this.getPlayer(passport.id);
				if (!player) return;
				player.update({
					nick: query.nick
				});
				fields.push({
					type: "playerUpdate",
					players: [{
						id: player.id,
						nick: player.nick,
						state: player.state
					}]
				});
				break;
		}
	};
	
	PlayerPlugin.prototype.all = function(fields, passport, query){
		if (!fields || !passport) return;
		fields.push({
			type: "playerAll",
			players: this.getPlayerAll()
		});
	};
	
	PlayerPlugin.prototype.getPlayer = function(id){
		return this.players[id];
	};
	
	PlayerPlugin.prototype.getPlayerAll = function(){
		var players = [];
		common.forEach(this.players, function(player){
			players.push({
				id: player.id,
				nick: player.nick,
				state: "online"
			});
		});
		return players;
	};
	
	/**
	 * 清理已经掉线或离开的用户
	 */
	PlayerPlugin.prototype.patrol = function(fields){
		var now = new Date;
		var self = this;
		common.forEach(this.players, function(player){
			if (now - player.passportTime > 2 * common.offineTime) { // 清除掉线用户
				fields.push({
					type: "playerRemove",
					players: [{
						id: player.id
					}]
				});
				delete self.players[player.id];
				return;
			}
			
			var state = player.state;
			if (now - player.passportTime > common.offineTime) { // 掉线
				state = 'offline';
			} else if (now - player.commandTime > common.busyTime) { // 忙碌
				state = 'busy';
			}
			if (player.state == state) return; // 状态未改变
			player.update({
				state: state
			});
			fields.push({
				type: "playerUpdate",
				players: [{
					id: player.id,
					state: player.state
				}]
			});
		});
	};
	
	exports.create = function(channel, options){
		return new PlayerPlugin(channel, options);
	};
}();
