const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User')
const { API_KEY } = require('../config/config')

const router = express.Router()

router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = new User({ email, password })
    await user.save()

    // Creating a JWT
    const token = jwt.sign({ userId: user._id }, API_KEY)
    res.send({ token })
  } catch (err) {
    return res.status(422).send(err.message)
  }
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(422).send({ error: 'Must provide email and password' })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(422).send({ error: 'Invalid password or email' })
  }

  try {
    await user.comparePassword(password)
    const token = jwt.sign({ userId: user._id }, API_KEY)
    res.send({ token })
  } catch (err) {
    return res.status(422).send({ error: 'Invalid password or email' })
  }
})

module.exports = router
