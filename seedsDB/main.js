const campground = require("../models/campground");
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptions, descriptors } = require("./seedHelpers");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.error("connection error:", err));
db.once("open", () => {
  console.log("Database connected");
});
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const cleanCampGroundDB = async () => {
  await campground.deleteMany({});
  // const c = new campground({ title: "new hello " });
  // await c.save();
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new campground({
      location: `${cities[random1000].city},${cities[random1000].state} `,
      title: `${sample(descriptors)},${sample(places)} `,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit dolor repellat excepturi quasi fugiat, non fuga fugit perspiciatis doloribus cum porro! Maiores mollitia amet velit nesciunt officia quas libero nisi?",
      price: Math.floor(Math.random() * 20) + 10,
    });
    await camp.save();
  }
};
cleanCampGroundDB().then(() => {
  mongoose.connection.close();
});
