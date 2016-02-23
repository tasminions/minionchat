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
