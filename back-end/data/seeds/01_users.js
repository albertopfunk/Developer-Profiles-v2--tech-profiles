const faker = require("faker");

// eslint-disable-next-line
exports.seed = function(knex, Promise) {
  const userArr = [];

  function randomFilterValue() {
    let filterOptions = ["Development", "iOS", "Android", "Design"];
    let rand = [(Math.random() * filterOptions.length) | 0];
    return filterOptions[rand];
  }

  function randomLocationValue() {
    let filterOptions = [
      { name: "Los Angeles, CA, USA", lat: 34.052235, lon: -118.243683 },
      { name: "Calabasas, CA, USA", lat: 34.138332, lon: -118.660835 },
      { name: "Boston, MA, USA", lat: 42.361145, lon: -71.057083 },
      { name: "Santa Fe, NM, USA", lat: 35.691544, lon: -105.944183 },
      { name: "Tempe, AZ, USA", lat: 33.427204, lon: -111.939896 },
      { name: "Flagstaff, AZ, USA", lat: 35.198284, lon: -111.651299 },
      { name: "Boulder, CO, USA", lat: 40.014984, lon: -105.270546 },
      { name: "Pueblo, CO, USA", lat: 38.276463, lon: -104.604607 },
      { name: "South Valley, NM, USA", lat: 35.106766, lon: -106.629181 },
      { name: "San Francisco, CA, USA", lat: 37.773972, lon: -122.431297 },
      { name: "Seattle, WA, USA", lat: 47.608013, lon: -122.335167 },
      { name: "San Diego, CA, USA", lat: 32.715738, lon: -117.1610838 },
      { name: "Minneapolis, MN, USA", lat: 44.977753, lon: -93.2650108 },
      { name: "Washington D.C., DC, USA", lat: 38.9071923, lon: -77.0368707 },
      { name: "Baltimore, MD, USA", lat: 39.2903848, lon: -76.6121893 },
      { name: "Portland, OR, USA", lat: 45.5051064, lon: -122.6750261 },
      { name: "Tampa, FL, USA", lat: 27.95057499999999, lon: -82.4571776 },
      { name: "Denver, CO, USA", lat: 39.7392358, lon: -104.990251 },
      { name: "Philadelphia, PA, USA", lat: 39.9525839, lon: -75.1652215 },
      { name: "Chicago, IL, USA", lat: 41.8781136, lon: -87.6297982 },
      { name: "Phoenix, AZ, USA", lat: 33.4483771, lon: -112.0740373 },
      { name: "Houston, TX, USA", lat: 29.7604267, lon: -95.3698028 },
      { name: "Austin, TX, USA", lat: 30.267153, lon: -97.7430608 },
      { name: "Charlotte, NC, USA", lat: 35.2270869, lon: -80.8431267 },
      { name: "Dallas, TX, USA", lat: 32.7766642, lon: -96.79698789999999 },
      { name: "Orlando, FL, USA", lat: 28.5383355, lon: -81.3792365 },
      {
        name: "St. Louis, MO, USA",
        lat: 38.62700249999999,
        lon: -90.19940419999999
      },
      { name: "Atlanta, GA, USA", lat: 33.7489954, lon: -84.3879824 },
      { name: "Miami, FL, USA", lat: 25.7616798, lon: -80.1917902 },
      { name: "Melbourne, FL, USA", lat: 28.0836269, lon: -80.60810889999999 },
      { name: "Salt Lake City, UT, USA", lat: 40.7607793, lon: -111.8910474 },
      { name: "Greenville, SC, USA", lat: 34.85261759999999, lon: -82.3940104 },
      { name: "Sarasota, FL, USA", lat: 27.3364347, lon: -82.53065269999999 },
      { name: "Boise, ID, USA", lat: 43.6150186, lon: -116.2023137 },
      { name: "Asheville, NC, USA", lat: 35.59505809999999, lon: -82.5514869 },
      { name: "Nashville, TN, USA", lat: 36.1626638, lon: -86.7816016 },
      { name: "San Jose, CA, USA", lat: 37.3382082, lon: -121.8863286 },
      {
        name: "Grand Rapids, MI, USA",
        lat: 42.96335990000001,
        lon: -85.6680863
      },
      { name: "Madison, WI, USA", lat: 43.0730517, lon: -89.4012302 },
      { name: "Huntsville, AL, USA", lat: 34.7303688, lon: -86.5861037 },
      { name: "Des Moines, IA, USA", lat: 41.5868353, lon: -93.6249593 },
      {
        name: "Fayetteville, NC, USA",
        lat: 35.0526641,
        lon: -78.87835849999999
      },
      { name: "Colorado Springs, CO, USA", lat: 38.8338816, lon: -104.8213634 },
      { name: "Las Vegas, NV, USA", lat: 36.1699412, lon: -115.1398296 },
      { name: "El Paso, TX, USA", lat: 31.7618778, lon: -106.4850217 },
      {
        name: "New Orleans, LA, USA",
        lat: 29.95106579999999,
        lon: -90.0715323
      },
      { name: "Albuquerque, NM, USA", lat: 35.0843859, lon: -106.650422 },
      { name: "Kansas City, MO, USA", lat: 39.0997265, lon: -94.5785667 },
      { name: "Oklahoma City, OK, USA", lat: 35.4675602, lon: -97.5164276 },
      { name: "Watertown, WI, USA", lat: 43.1947211, lon: -88.7289918 }
    ];
    let rand = [(Math.random() * filterOptions.length) | 0];
    return filterOptions[rand];
  }

  let user1Location = randomLocationValue();
  userArr.push({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    image:
      "https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_800/v1590889437/dev-profiles-v1-profile-dashboard/sxifjyiyc5hwujqfyven.webp",
    image_id: "someimageID",
    desired_title: faker.name.title(),
    area_of_work: randomFilterValue(),
    current_location_name: user1Location.name,
    current_location_lat: user1Location.lat,
    current_location_lon: user1Location.lon,
    top_skills_prev: "Ruby, Elixir, SQL, Web Performance, Vue",
    additional_skills_prev: "React, Front-End, Java, Stripe, Angular",
    public_email: faker.internet.email(),
    github: "github.com",
    linkedin: "linkedin.com",
    twitter: "twitter.com",
    portfolio: "coolbanana.com",
    summary:
      "Lorem dummy text. Lorem Ipsum has been the industry standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    stripe_subscription_name: "subscriptionexname"
  });

  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .insert(userArr);
  // return knex("users")
  //   .del()
  //   .then(function() {
  //     // Inserts seed entries
  //     return knex("users")
  //       .truncate()
  //       .insert(userArr);
  //   });
};
