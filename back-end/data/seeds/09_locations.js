
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('locations').del()
    .then(function () {
      // Inserts seed entries
      return knex('locations').insert([
        {location: 'Los Angeles, CA, USA'},
        {location: 'Tempe, AZ, USA'},
        {location: 'Boulder, CO, USA'},
        {location: 'South Valley, NM, USA'},
        {location: 'San Diego, CA, USA'},
        {location: 'Tampa, FL, USA'},
        {location: 'Denver, CO, USA'},
        {location: 'Philadelphia, PA, USA'},
        {location: 'Houston, TX, USA'},
        {location: 'St. Louis, MO, USA'},
        {location: 'Salt Lake City, UT, USA'},
        {location: 'Nashville, TN, USA'},
        {location: 'Madison, WI, USA'},
        {location: 'Kansas City, MO, USA'},
        {location: 'Watertown, WI, USA'},
        {location: 'New Orleans, LA, USA'},
        {location: 'Las Vegas, NV, USA'},
        {location: 'Colorado Springs, CO, USA'},
        {location: 'Fayetteville, NC, USA'},
        {location: 'Des Moines, IA, USA'},
        {location: 'Huntsville, AL, USA'},
        {location: 'San Jose, CA, USA'}
      ]);
    });
};
