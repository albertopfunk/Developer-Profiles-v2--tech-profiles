exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_locations")
    .del()
    .then(function () {
      let userLocationsArr = [];

      // giving all users 1-5 interested locations
      for (let i = 1; i <= 50; i++) {
        let randomAmount = Math.floor(Math.random() * (6 - 1) + 1);
        let randomUserLocations = [];
        let randomNumbers = [];

        for (let j = 0; j < randomAmount; j++) {
          let num = Math.floor(Math.random() * (120 - 1) + 1);
          let isDup = randomNumbers.includes(num);

          while (isDup) {
            num = Math.floor(Math.random() * (120 - 1) + 1);
            isDup = randomNumbers.includes(num);
          }

          randomNumbers.push(num);
          randomUserLocations.push({ user_id: i, location_id: num });
        }

        userLocationsArr = [...userLocationsArr, ...randomUserLocations];
      }

      // Inserts seed entries
      return knex("user_locations").insert(userLocationsArr);
    });
};
