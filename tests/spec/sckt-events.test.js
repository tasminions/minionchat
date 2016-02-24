var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile('spec/support/jasmine.json');
jasmine.configureDefaultReporter({
    showColors: false
});
jasmine.execute();

var sckEvents = require('../../public/js/sckt-events');
describe('function joinChat should take a nickname and a roomname (optional)',function(){
    it('and should return a string URL for a request to the server',function(){
        var username = 'daffy'
        var actual = sckEvents.joinChat(username);
        var expected = '/newUser?nickname=daffy';
        expect(actual).toEqual(expected);
    });
});
