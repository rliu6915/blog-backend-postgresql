const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('sessions', 'created_at')
  },
  down: async () => {
    await queryInterface.addColumn('sessions', 'created_at', {
      type: DataTypes.DATE,
    })
  }
}