var tape = require('tape');

tape('function newUser should take the following parameters: usersObj, current-username and current-room, and return a newUsersObj (object type)',function(t){
    var nickname = 'bugs bunny';
    var currRoom = 'looneys';
    var usersObj = {};
    var actual = newUser(nickname,usersObj,currRoom) instanceof Object;
    t.ok(actual,'newUser returns an object');
    t.end();
});
