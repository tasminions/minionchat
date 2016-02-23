
/// newUser - when a new user joins
function newUser(nickname, users, currRoom){
  if( users[nickname] === undefined ) {
    users[nickname] = {
      "rooms": [currRoom]
    };
  }
  else {
    users[nickname].rooms.push(currRoom);
  }
  return users;
}



module.exports = {
  newUser: newUser
};
