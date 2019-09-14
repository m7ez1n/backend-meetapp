module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('meetups', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('meetups', 'updated_at');
  },
};
