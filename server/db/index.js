var Sequelize = require('sequelize');

module.exports = function(options) {

  options = options || {};
  
  var sequelize = new Sequelize(options.database, options.user, options.password, {
    dialect: 'sqlite',
    storage: options.storage || 'sprinter.sqlite'
  });

  // Import models
  var Team = sequelize.import(__dirname + '/team.js');
  var Sprint = sequelize.import(__dirname + '/sprint.js');

  // Associations
  Team.hasMany(Sprint);

  // Sync
  sequelize.sync().complete(function (err) {
    if (err) {
      console.log(err.stack);
    } else {
      console.log('Successfully synced.')
    }
  });

  // Export models
  return {
    sprint: Sprint,
    team: Team
  };

};
