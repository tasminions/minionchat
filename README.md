# minionchat
Real time web chat

## WIREFRAMES
![chat-wireframe](assets/chat-wireframe.jpg)


## EVENTS
### CLIENT SIDE
![client-side-events](assets/client-events.jpg)

### SERVER SIDE
![server-side-events](assets/server-events.jpg)

### EVENT FLOW
![event-flow](assets/event-flow.jpg)
* **userJoin** - upon fEnd connection ('connect'):
    * fEnd socket emits 'userJoin' with **connectionInfo** as a **stringified obj**: {username:"nameEntered",room:"main"}.
    * bEnd socket listens, takes the data. and:
        * **emits 'activeUsers'** event *to all users*, sending back activeusers list in **stringified array** format.
            * fEnd listener to 'activeUsers' will *refresh list of active users* in the chat.
        * **emits 'msgHistory'** event to the *joining user only*, to provide the message history in **stringified array of objects** format.
            * fEnd listener to 'msgHistory' will *append message history* as children to the messages ```<ul></ul>``` list.
        * **broadcast 'userJoin'** to rest of the users in the chat
* **userTyping** - upon 'input' in the textarea:
    * fEnd socket emits 'userTyping' event with usual connectionInfo *stringified obj*.
    * bEnd socket listens, takes the data, and:
        * **broadcasts 'userTyping'** event to all other users.
* **updateChat** - upon form 'submit':
    * fEnd socket emits 'updateChat' event, passing an object with the below format. fEnd also updates the messageHistory list for the user who submitted the chat.
    * bEnd sockets broascasts 'updateChat' event, passing the same object.
        * fEnd appends message to messageHistory list

**Message object format** (after parsing):
```javascript
{
    "originator":"username",
    "body":"what the user wrote",
    "time": 1456391092857,
    "room": "roomName"
}
```

* 'newRoom' - upon user clicking on one of the activeUsers in the main chat room:
    * fEnd emits 'newRoom' event with **TBD**... 2 'userJoin' events?? **TBD**

## SAMPLE DATA STRUCTURE (within database)
```JSON
{
    "users":{
        "bugs-bunny":{
            "rooms":["room1","room2"]
        }
    },
    "messages": {
        "room1": [
            {
                "originator":"bugs",
                "body":"here is a message",
                "time":"24-01-2016:12.123321321312"
            }
        ],
        "room2":[],
        "room3":[]
    }
}
```

## JS FILE STRUCTURE
![file-structure](assets/file-structure.jpg)
