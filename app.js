const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.error("connection error:", err));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello From YelpCamp");
});
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

//TODO:add campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect("/campgrounds"); // Redirect to the campground list page after creating a new campground
});
//TODO:get  campground id
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});
//TODO:update campground by id
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});
app.post("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campgroundData = req.body.campground;

  try {
    const campground = await Campground.findByIdAndUpdate(id, campgroundData);
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    console.error(error);
    res.redirect(`/campgrounds/${id}/edit`);
  }
});

//TODO:DELETE

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds"); // Redirect to the campground list page after deletion
  } catch (error) {
    console.error(error);
    res.redirect(`/campgrounds/${id}`);
  }
});

app.get("/makeCampground", async (req, res) => {
  const camp = new campground({
    title: "elwa7a",
    description: "wonderful place",
  });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log("Listening on port 3000 !!");
});
