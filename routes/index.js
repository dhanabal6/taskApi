const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require('fs');

const User = require("../models/user");
var dir = "./public/upload";
if (!fs.existsSync(dir)){
fs.mkdirSync(dir);
}


const Storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/upload");
  },
  filename: function(req, file, callback) {
    var filename = Date.now().toString() + "_" + file.originalname;
    callback(null, filename);
  }
});

const upload = multer({ storage: Storage }).array("uploadFile", 8);

/* GET home page. */
router.get("/", (req, res, next) => {
  res.sendFile("index.html", {
    root: "views"
  });
});

router.get("/users", (req, res, next) => {
  User.find({}, (err, data) => {
    if (err) {
      res.status(400).send(err);
    }
    return res.send({
      data
    });
  });
});

router.post("/users", (req, res, next) => {
  const bodydata = req.body;
  const data = new User(bodydata);
  data.save((err, data) => {
    if (err) {
      res.status(400).send(err);
    } else {
      return res.send({
        msg: "Entry added Successfully!"
      });
    }
  });
});

router.post("/upload/:userId", (req, res) => {
  upload(req, res, err => {
    if (err) return res.status(500).send({ msg: err });
    const bodyData = req.body;
    console.log(bodyData);
    let files;
    req.files.forEach(val => {
      files = val;
    });
    User.findOne(
      { organizationEmail: bodyData.organizationEmail },
      (err, data) => {
        if (err) return res.status(500).send({ msg: err });
        let user2Data = data;
        console.log(user2Data);
        User.findById(req.params.userId, (err, value) => {
          if (err) return res.status(500).send({ msg: err });
          const user1Data = value;
          user1Data.uploadFile = files.filename;
          value.save();
          const orguser1Mailid = user1Data.organizationEmail;
          const orguser1Password = user1Data.organizationPassword;
          const orguser2Mailid = user2Data.organizationEmail;
          const userEmail = user2Data.email;
          const subject = "test file sharing";
          const message = "test message";
          const attachments = [
            {
              filename: files.filename,
              path: files.path,
              contentType: files.mimetype
            }
          ];
          const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
              user: orguser1Mailid,
              pass: orguser1Password
            }
          });
          const emailIds = [orguser2Mailid, userEmail];
          const mailOptions = {
            to: emailIds,
            from: orguser1Mailid,
            subject: subject,
            text:
              "Hello " +
              message +
              ",\n\n" +
              "Regards\n" +
              "company name" +
              "\n",
            attachments: attachments
          };
          smtpTransport.sendMail(mailOptions, err => {
            if (err) {
              res.send(err);
            } else {
              res.send("Success! Your Mail has been Send.");
            }
          });
        });
      }
    );
  });
});

module.exports = router;
