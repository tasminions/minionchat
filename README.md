# minionchat
Real time web chat

## WIREFRAMES
![chat-wireframe](assets/chat-wireframe.jpg)


## EVENTS
### CLIENT SIDE
![client-side-events](assets/client-events.jpg)

### SERVER SIDE
![server-side-events](assets/server-events.jpg)

## SAMPLE DATA STRUCTURE (within database)
```JSON
{
    "users":{
        "bugs-bunny":{
            "rooms":["room1","room2"]
        }
    },
    "rooms": ["ijcwai"],
    "messages": {
        "room1": [
            {
                "originator":"bugs",
                "body":"here is a message",
                "time":"24-01-2016:12.123321321312"
            }
        ]
    }
}
```

## JS FILE STRUCTURE
![file-structure](assets/file-structure.jpg)
