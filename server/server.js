require("express-async-errors");
require("dotenv").config();
const Photo = require("./photoModel");
const shuffle = require("./utils/shuffle");

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const xss = require("xss-clean");
const mongooseSanitize = require("express-mongo-sanitize");
const cors = require("cors");

const whitelist = ["https://imagelibrary.netlify.app"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
      // callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(xss());
app.use(mongooseSanitize());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

//routes
app.post("/upload", async (req, res) => {
  const { label, url } = req.body;
  try {
    const photoPost = new Photo({ photoUrl: url, label });
    await photoPost.save();
    return res.status(200).json({
      success: true,
      data: { photoPost },
    });
  } catch (error) {
    return res.status(404).json({ success: false, error });
  }
});

app.get(
  ["/all/:skip/:limit/:label", "/all/:skip/:limit/"],
  async (req, res) => {
    let { skip, limit, label } = req.params;

    if (!label) {
      label = "";
    }

    const regexValue = new RegExp(
      `(${label}|${label.toUpperCase()}|{${label.toLowerCase()}})`
    );
    try {
      const photos = await Photo.find({
        label: { $regex: regexValue, $options: "i" },
      })
        .skip(Number(skip))
        .limit(Number(limit));

      setTimeout(() => {
        return res
          .status(200)
          .json({ success: true, data: { photos: shuffle(photos) } });
      }, 1200);

      // return res
      //   .status(200)
      //   .json({ success: true, data: { photos: shuffle(photos) } });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Something Went Wrong", error });
      console.log(error);
    }
  }
);

app.get("/all-label/:label", async (req, res) => {
  let { label } = req.params;

  const regexValue = new RegExp(
    `(${label}|${label.toUpperCase()}|{${label.toLowerCase()}})`
  );

  try {
    const photos = await Photo.find({
      label: { $regex: regexValue, $options: "i" },
    });
    return res.status(200).json({ success: true, data: { photos } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something Went Wrong", error });
    console.log(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedImage = await Photo.findOne({ _id: id });
    await deletedImage.remove();
    res.status(202).json({
      success: true,
      message: "Image Deleted Successfully",
      data: { deletedImage },
    });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
});

app.delete("/delete-all", async (req, res) => {
  const { key } = req.body;
  try {
    if (key !== process.env.key) throw new Error("Cant Do It");
    await Photo.deleteMany({});
    res.status(202).json({
      success: true,
      message: "Image Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
});

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(port, () => console.log(`Your App is running at ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
