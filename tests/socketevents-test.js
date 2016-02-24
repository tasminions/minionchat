var tape = require('tape');
var socketevents = require('../server/socketevents.js');

tape('function newUser should take the following parameters: users,'+
    ' current-username and current-room, and return a newUsersObj (object type)',function(t){
    var nickname = 'bugs bunny';
    var currRoom = 'looneys';
    var users = {};
    var actual = socketevents.newUser(nickname,users,currRoom) instanceof Object;
    t.ok(actual,'newUser returns an object');
    t.end();
});

tape('test that newUser returns the right filestructure',function(t){
    var nickname = 'bugs bunny';
    var currRoom = 'looneys';
    var users = {};
    var result = {
        "bugs bunny": {
          "rooms": ["looneys"]
      }
    };
    var expected = socketevents.newUser(nickname,users,currRoom);
    t.deepEqual(expected, result, 'newUser returns an object');
    t.end();
});

tape('test that newUser returns the right filestructure',function(t){
    var nickname = 'bugs bunny';
    var currRoom = 'looneys';
    var users = {"daffy": {
      "rooms": ["room1"]
    } };
    var result = {
        "daffy": {
          "rooms": ["room1"]
        },
        "bugs bunny": {
          "rooms": ["looneys"]
        }
    };
    var expected = socketevents.newUser(nickname,users,currRoom);
    t.deepEqual(expected, result, 'newUser returns an object');
    t.end();
});

tape('test that newUser returns the right filestructure',function(t){
    var nickname = 'daffy';
    var currRoom = 'looneys';
    var users = {
        "daffy": {
          "rooms": ["room1"]
        },
        "bugs bunny": {
          "rooms": ["looneys"]
        }
    };
    var result = {
        "daffy": {
          "rooms": ["room1", "looneys"]
        },
        "bugs bunny": {
          "rooms": ["looneys"]
        }
    };
    var expected = socketevents.newUser(nickname,users,currRoom);
    t.deepEqual(expected, result, 'newUser returns an object');
    t.end();
});

tape('function updateMessageHistory should take  ')