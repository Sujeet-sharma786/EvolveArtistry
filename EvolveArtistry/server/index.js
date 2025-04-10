const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectMongoDB = require("./db/config");
const userModel = require("./db/User");
const multer = require("multer");

const ImagesModel = require("./db/ImageModel");

const AdminModel = require('./db/Admin.js')

const Jwt = require("jsonwebtoken");
const Jwtkey = process.env.JWT_SECRET_KEY;
const app = express();
const BASE_URL = process.env.REACT_APP_BASE_URL;
app.use(express.json());
app.use(cors())
app.use("/uploads", express.static("uploads"));
connectMongoDB();
app.post("/signup", async (req, resp) => {
  const user = new userModel(req.body);
  let result = await user.save();
  resp.send(result);
  // if(result)
  // {
  //     Jwt.sign({result},Jwtkey,{expiresIn:"2h"},(err,token)=>{
  //         if(err)
  //         {
  //             resp.send({result:"Somthing went's wrong, Please try again"});
  //         }
  //         resp.send({result,auth:token});
  //     })
  // }
});

app.post("/signupcheck", async (req, resp) => {
  let data = await userModel.findOne(req.body).select("-password");

  if (data) {
    delete data.password;
    resp.send(data);
  } else {
    resp.send({ result: "not registered email" });
  }
});

app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let admin = await AdminModel.findOne(req.body).select("-password");
    console.log(admin);
    let User = await userModel.findOne(req.body).select("-password");
    if(admin){
        Jwt.sign({admin},Jwtkey,{expiresIn:"2h"},(err,token)=>{
            if(err){
                resp.send({result:"somthing wents wrong,please try again"});
            }
            resp.send({admin,auth:token});
        })
    }
    else if(User) {
      Jwt.sign({ User }, Jwtkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send({ result: "something wents wrong, Please try again" });
        }
        resp.send({ User, auth: token });
      });
    } else {
      resp.send({ result: "No user found" });
    }
  } else {
    resp.send({ result: "No user found" });
  }
});
app.get("/", async (req, resp) => {
  const result = await ImagesModel.find();
  resp.json(result);
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage });
app.post("/upload/:password", upload.single("image"), async (req, resp) => {
  const password = req.params;
  if (req.params) {
    const name = req.body.name;
    const desc = req.body.desc;
    const imgUrl = req.file.path;
    const newImage = new ImagesModel({
      name: name,
      desc: desc,
      imgUrl: imgUrl,
    });
    const result = await newImage.save();
    console.log(req.file.path, 65);
  }
});

app.delete("/remove/:id", async (req, resp) => {
  // resp.send("remove api is working")
  const data = await ImagesModel.findById(req.body.image_id);
  console.log(req.body);
  console.log(data);
  if (data) {
    const result = await ImagesModel.deleteOne({ _id: data._id });
    resp.send(result);
  } else {
    resp.send({ result: "No data found, cheak name" });
  }
});

app.get("/potrait", async (req, resp) => {
  let result = await ImagesModel.find();
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No potrait found" });
  }
});
app.post("/admin", async (req, resp) => {
  // resp.send("Get Api working")
  let result = await AdminModel.findOne(req.body);

  if (result) {
    // delete result.password;
    resp.send(result);
  } else {
    resp.send({ result: "Not valid admin" });
  }
});

app.get("/search/:key", async (req, resp) => {
  const result = await ImagesModel.find({
    $or: [
      { name: { $regex: req.params.key } },
      { desc: { $regex: req.params.key } },
    ],
  });

  resp.send(result);
});

app.post("/download", (req, resp) => {
  console.log(req.body);
  let request = req.body;

  console.log(request.myURL);

  // console.log(myUrl)
  // let finalURL =JSON.stringify( request.myURL);
  resp.download(request.myURL);
});

app.listen(5000);
