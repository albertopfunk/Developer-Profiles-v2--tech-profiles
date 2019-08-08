/*eslint no-console: ["error", { allow: ["error"] }] */
// eslint-disable-next-line
exports.seed = function(knex, Promise) {
  const userArr = [];

  function randomFilterValue() {
    let filterOptions = ["Web Development", "iOS", "Android", "UI/UX"];
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
      { name: "Seattle, WA, USA", lat: 47.608013, lon: -122.335167 }
    ];
    let rand = [(Math.random() * filterOptions.length) | 0];
    return filterOptions[rand];
  }

  for (let i = 0; i < 25; i++) {
    let user1Location = randomLocationValue();
    let user1Interested1 = randomLocationValue();
    let user1Interested2 = randomLocationValue();
    userArr.push({
      first_name: "Jane",
      last_name: "Doe",
      image:
        "https://res.cloudinary.com/dlo7dkdfy/image/upload/v1554817779/womannnn.jpg",
      desired_title: "Unicorn Developer",
      area_of_work: randomFilterValue(),
      current_location_name: user1Location.name,
      current_location_lat: user1Location.lat,
      current_location_lon: user1Location.lon,
      interested_location_names: `${user1Interested1.name}|${user1Interested2.name}`,
      public_email: "mystery_jane@gmail.com",
      github: "github.com",
      linkedin: "linkedin.com",
      portfolio: "coolbanana.com",
      badge: "acclaim.com",
      summary:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Leeriest sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Lauds PageMaker including versions of Lorem Ipsum.",
      top_skills: "JavaScript, React, React Native, Node",
      additional_skills: "Java, Swift",
      familiar_skills: "Ruby, Elixir, SQL, Python"
    });

    let user2Location = randomLocationValue();
    let user2Interested1 = randomLocationValue();
    let user2Interested2 = randomLocationValue();
    userArr.push({
      first_name: "John",
      last_name: "Doe",
      image:
        "https://res.cloudinary.com/dlo7dkdfy/image/upload/v1554817779/mannnn.jpg",
      desired_title: "Unicorn Developer",
      area_of_work: randomFilterValue(),
      current_location_name: user2Location.name,
      current_location_lat: user2Location.lat,
      current_location_lon: user2Location.lon,
      interested_location_names: `${user2Interested1.name}|${user2Interested2.name}`,
      public_email: "mystery_john@gmail.com",
      github: "github.com",
      linkedin: "linkedin.com",
      portfolio: "coolbanana.com",
      badge: "acclaim.com",
      summary:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Leeriest sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Lauds PageMaker including versions of Lorem Ipsum.",
      top_skills: "JavaScript, React, React Native, Node",
      additional_skills: "Java, Swift",
      familiar_skills: "Ruby, Elixir, SQL, Python"
    });
  }

  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users")
        .truncate()
        .insert(userArr);
    });
};
