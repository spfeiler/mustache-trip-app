const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const path = require('path')

var session = require('express-session')

const app = express()

const VIEWS_PATH = path.join(__dirname, '/views')

app.use(session( {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({extended: false}))

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))

app.set('views', './views')

app.set('view engine', 'mustache')

let users = []
let persistedUser = {}

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/register', (req, res) => {
  let username = req.body.username
  let password = req.body.password

  let user = {username: username, password: password, userTrips: []}
  users.push(user)
  console.log(users)

  res.render('login', {registeredMessage: "You are Registered! Please Login Below!"})
})

app.post('/login', (req, res) => {
  let username = req.body.username
  let password = req.body.password

  let user = {username: username, password: password, userTrips: []}

  persistedUser = users.find((user) => {
    return user.username == username && user.password == password
  })
  if(persistedUser) {
    if(req.session) {
      req.session.username = persistedUser.username
      res.redirect('/trips')
    }
  } else {
    res.render('login', {invalidMessage: "Invalid Credentials! Please Try Again!"})
  }
})

app.post('/signout', (req, res) => {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err)
    } else {
      res.redirect('/login')
    }
  })
})

app.get('/trips', (req, res) => {
  res.render('trips', {username: req.session.username, trips: persistedUser.userTrips})
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

  let triplist = ({destination: destination, departure: departureDate, return: returnDate, image: image, tripID: tripID})
  persistedUser.userTrips.push(triplist)

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
  
  persistedUser.userTrips = persistedUser.userTrips.filter(function(trip) {
    return trip.tripID != deleteTrip
  })
  res.render('trips', {username: req.session.username, trips: persistedUser.userTrips})
})

app.listen(3000, () => {
  console.log('Server is running')
})
