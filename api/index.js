const { response } = require('express')
const express = require('express')
const app = express()
const youtubedl = require('youtube-dl')

app.get('/fetchVideoInfo', function (req, res) {
  const url = req.query.url;
  if (url) {
    youtubedl.getInfo(url, function (err, info) {
      if (err) {
        console.log(err)
        res.send('err')
      } else {
        console.log(info.fps)
        const infofps = String(info.fps);
        res.send(info)
      }
    })
  } else res.send('missing url query');
})


app.get('*', function (req, res) {
  res.send('Hello World')
})

app.listen(8090)