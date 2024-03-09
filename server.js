const express = require("express")
const app = express()
const server = require("http").createServer(app);
const dotenv = require("dotenv")
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const bodyParser = require('body-parser');
const multer = require("multer");
const getOutput = require("./functions")
const version = "1.0.1"
const { richTextFromMarkdown } = require('@contentful/rich-text-from-markdown');

dotenv.config()

cloudinary.config({ 
    cloud_name: 'feimo', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_PASS 
  });


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '20mb' })); // Set limit to 10 megabytes
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors())

const upload = multer({ dest: "uploads/" });



app.get("/ping",(_,res)=>{
    res.send({msg:"Server Live!",version:version})
})

app.post("/upload", upload.single("file") , async (req,res)=>{
    let path = req.file.destination+req.file.filename
    try{
        await cloudinary.uploader
    .upload(path,{
        resource_type: "video",
      })
.   then(async (result)=>{
    let output =await getOutput(result.url)
    const document = await richTextFromMarkdown(output);
    res.send({notes:document})});
    } catch(error){
        console.log(error);
        res.send({msg:"Error Occured",error_detail:error})
    }
    
})


app.post("/uploadaudio", upload.single("file") , async (req,res)=>{
    let path = req.file.destination+req.file.filename
    try{
        await cloudinary.uploader
    .upload(path,{
        resource_type: "video",
      })
.   then(result=>{
    res.send({url:result.url})});
    } catch(error){
        console.log(error);
        res.send({msg:"Error Occured",error_detail:error})
    }    
})







const port = process.env.PORT || 5500
server.listen(port,()=>{console.log(`Listening on ${port}`)})