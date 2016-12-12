"use strict";

Date.prototype.pad = function (n) {
	return (n < 10) ? '0' + n : n;
};

Date.prototype.toISODateTime = function () {
	return this.getFullYear() + '-'
		+ this.pad(this.getMonth() + 1) + '-'
		+ this.pad(this.getDate()) + 'T'
		+ this.pad(this.getHours()) + ':'
		+ this.pad(this.getMinutes()) + ':'
		+ this.pad(this.getSeconds());
};

var util = require('util');
var fs = require('fs');
var path = require('path');
var cron = require('cron');
var logger = require('../lib/logger');
var messages = require('../lib/messages');
var plugins = require('../lib/plugins');
var cwd = process.cwd();

logger.setPrefix(function () {
	var d = new Date().toISODateTime();
	return '[' + d + '] ';
});

var config = require('../config.json');
var userMap = {};
var users = require('../users.json').map(function(data){
	var user = {
		id: function() { return data.id; },
		fullName: function() { return data.fullName; },
		mugshot: function() { return '/mugshots/'+data.id+'.jpg'; }
	};
	
	userMap[data.id] = user;
	
	return user;
})

var y = {
	users:function(){
		return userMap;
	},
	user: function(id){
		if ( !userMap[id] ) throw new Error('user not found ('+ id +')');
		return userMap[id];
	},
	on: function(event,cb){
		console.log(event);
	},
	sendMessage: function(cb){
		var msg = {
			threadId: function(){
				
			}
		};

		var error = null;
		
		cb(error,msg);
	},
	thread: function(threadId){
		return {
			id:threadId,
			properties: {},
			setProperty: function(key,value){
				this.properties[key] = value;
			}
		}
	},
	persistThread: function(thread){
		console.log(thread);
	}
}

var kiosk = require('../plugins/kiosk/index.js');
kiosk.init(y, config, messages, cron, logger);