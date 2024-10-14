# Life Timeline


## Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "events": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "startDate": {
            "type": "string",
            "format": "date-time"
          },
          "endDate": {
            "type": "string",
            "format": "date-time"
          },
          "location": {
            "type": "string"
          },
          "color": {
            "type": "string"
          },
          "url": {
            "type": "string",
            "format": "uri"
          },
          "image": {
            "type": "string",
            "format": "uri"
          },
          "keywords": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": ["name", "startDate"],
        "additionalProperties": false
      }
    }
  },
  "required": ["events"],
  "additionalProperties": false
}
```
