require('dotenv').config()
const mongoose = require('mongoose');;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const UrlModel = require('./models/Url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
.then(()=>console.log("Database is connected"));
app.use(cors());

app.use("/api/shorturl",bodyParser.urlencoded({extended:false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res)=>{
  const orignal_url = req.body.url;
  if(!validUrl.isWebUri(orignal_url)){
    return res.json({error:'invalid url'})
  }
  try{
    let url = await UrlModel.findOne({orignal_url:orignal_url});
    if(url){
      return res.json({ 
        orignal_url: url.orignal_url, 
        short_url: url.short_url
      });
    }else{
      const short_url = Math.floor(Math.random()*100000).toString();
      url = new UrlModel({
        orignal_url:orignal_url,
        short_url:short_url
      });
      await url.save();
      return res.json({
        original_url:orignal_url,
        short_url:short_url
      });
    }

  } catch(err){
    console.error(err);
    res.status(500).json('Server Error');
  }
});

app.get('/api/shorturl/:shortUrl', async (req, res)=>{
  const shortURL = req.params.shortUrl;
  try{
    let url = await UrlModel.findOne({short_url:shortURL});
    if(url){
      return res.redirect(url.orignal_url);
    }else{
      return res.status(404).json({error:"No short url found for given input"});
    }
  } catch (err){
    console.log(err);
    res.status(404).json({error:"Server Error"});
  }
});


app.listen(port, function() {
  console.log(`Listening on port http://localhost:${port}`);
});
