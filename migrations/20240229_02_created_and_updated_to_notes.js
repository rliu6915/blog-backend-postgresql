const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('notes', 'created_at', {
      type: DataTypes.DATE,
    }),
    await queryInterface.addColumn('notes', 'updated_at', {
      type: DataTypes.DATE,
    })
  },
  down: async () => {
    await queryInterface.removeColumn('notes', 'created_at')
    await queryInterface.removeColumn('notes', 'updated_at')
  }
}