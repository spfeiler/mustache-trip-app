const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.engine('mustache', mustacheExpress())

app.set('views', './views')

app.set('view engine', 'mustache')

let trips = []

app.get('/trips', (req, res) => {
  res.render('trips', {tripList: trips})
})

app.get('/addtrip', (req, res) => {
  res.render('addtrip')
})

app.post('/addtrip', (req, res) => {
  let destination = req.body.destination
  let departureDate = req.body.departure
  let returnDate = req.body.return
  let image = req.body.image
  let tripID = guid()

  let trip = {destination: destination, departure: departureDate, return: returnDate, image: image, tripID: tripID}
  trips.push(trip)

  res.redirect('/trips')
})

function guid(length) {
       if (!length) {
           length = 8
       }
       var str = ''
       for (var i = 1; i < length + 1; i = i + 8) {
           str += Math.random().toString(36).substr(2, 10)
       }
       return ('_' + str).substr(0, length)
}

app.post('/deletetrip', (req, res) => {
  let deleteTrip = req.body.tripID

  trips = trips.filter(function(trip) {
    return trip.tripID != deleteTrip
  })
  res.render('trips', {tripList: trips})
})

app.post('/returnaddtrip', (req, res) => {
  res.redirect('/addtrip')
})

app.listen(3000, () => {
  console.log('Server is running')
})
