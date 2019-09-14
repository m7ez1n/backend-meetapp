module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('meetups', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('meetups', 'created_at');
  },
};
