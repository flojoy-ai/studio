---
title: Embed Videos in Block Docs
slug: "contribution/docs/embed-videos"
sidebar:
  order: 2
---

To embed a video in Block Docs like
[this example](/blocks/hardware/oscilloscopes/rigol/ds1074z/channel-on-off-ds1074z/),
you can simply add a key called `videos` to `block_data.json`.

An full example with the `videos` key in it:

```json
{
  "docstring": {
    "long_description": "The connection is made with the VISA address in the Flojoy UI.\nThis block should also work with compatible DS1000Z oscilloscopes",
    "short_description": "Connect Flojoy to a DS1074Z oscilloscope.",
    "parameters": [
      {
        "name": "device",
        "type": "VisaDevice",
        "description": "The VISA address to connect to."
      }
    ],
    "returns": [
      {
        "name": null,
        "type": "DataContainer",
        "description": "None"
      }
    ]
  },
  "videos": [
    {
      "title": "Digital Signals Oscilloscope",
      "source": "youtube",
      "link": "https://www.youtube.com/watch?v=0KqU-XWji9k"
    }
  ]
}
```

Currently only `youtube` is supported for the `source` key, and `link` is
simply the YouTube link to the video. More video sources will be supported
in the future.
