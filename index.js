const // Libraries
  path = require('path'),
  fs = require('fs'),
  multipart = require('connect-multiparty'),
  multipartMiddleware = multipart({uploadDir: './images'}),
  bodyParser = require('body-parser'),
  express = require('express'),
  app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')))
app.use('/rateyo', express.static(path.join(__dirname, 'node_modules', 'rateyo', 'min')))

// Main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '\\index.html'))
})

// Delete a rating
app.post('/delete/:id', (req, res) => {
  var id = req.params.id
  fs.readFile('ratings.json', (err, file) => {
    var ratings = JSON.parse(file.toString())
    fs.unlink(ratings[id].image, (err) => {
      if(err) throw err
      ratings.splice(id, 1)
      ratings.forEach((rating)=> {
        if(rating.id > id) rating.id -= 1
      })
      fs.writeFile('ratings.json', JSON.stringify(ratings), (err) => {
        if(err) throw err
        res.send('Deleted')
      })
    })
  })
})

// Vote
app.post('/vote/:id', (req, res) => {
  var // Vote params
    vote = parseInt(req.body.vote),
    id = parseInt(req.params.id)
  console.log(id, vote, typeof(id), typeof(vote))

  fs.readFile('ratings.json', (err, file) => {
    var ratings = JSON.parse(file.toString())
    ratings[id].voters += 1
    ratings[id].total += vote
    ratings[id].rating = Math.round(ratings[id].total / ratings[id].voters)
    fs.writeFile('ratings.json', JSON.stringify(ratings), (err, rating) => {
      res.json(ratings[id])
    })
  })
})

// Get all ratings
app.get('/ratings', (err, res) => {
  fs.readFile('ratings.json', (err, file) => {
    res.json(JSON.parse(file.toString()))
  })
})

// Add page
app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, '\\add.html'))
})

// Add a rating
app.post('/add', multipartMiddleware, (req, res) => {
  var // Add params
    title = req.body.title,
    image = 'images/' + req.files.image.path.split('\\')[1],
    image_ext = image.split('\.')[1].toLowerCase()

  if(
    image_ext == 'png' ||
    image_ext == 'jpg' ||
    image_ext == 'gif' ||
    image_ext == 'jpeg' ||
    image_ext == 'svg' ||
    image_ext == 'bmp'){
    fs.readFile('ratings.json', (err, file) => {
      var ratings = JSON.parse(file.toString())
      var newRating = {
        id: ratings.length,
        title: title,
        image: image,
        voters: 0,
        total: 0,
        rating: 0
      }
      console.log(newRating, 'Image extention: ' + image_ext)
      ratings.push(newRating)
      fs.writeFile('ratings.json', JSON.stringify(ratings), (err) => {
        res.redirect('/')
      })
    })
  }else{
    fs.unlink(image, (err)=>{
      res.redirect('/add')
      console.log('Image extention invalid.')
  	})
  }
})

app.listen(3000, ()=> {
  console.log('[OK] Express server')
})
