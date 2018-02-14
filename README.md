# Simple Rating

## Start

**node index.js**

## Info
Replace all '\\\\' with '/' if you are using a system based on UNIX.
#### Windows
``` javascript
75|    var image = 'images/' + req.files.image.path.split('\\')[1]
```
#### UNIX
``` javascript
75|    var image = 'images/' + req.files.image.path.split('/')[1]
```

## Preview

![alt text](https://i.imgur.com/GjtykRj.png)
