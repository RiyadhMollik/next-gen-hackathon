module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('interviews', 'integrityReport', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      });

      await queryInterface.addColumn('interviews', 'behaviorReport', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      });
      
      console.log('✅ Added fraud detection columns to interviews table');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('interviews', 'integrityReport');
    await queryInterface.removeColumn('interviews', 'behaviorReport');
  }
};
