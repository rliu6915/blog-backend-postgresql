const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('sessions', 'expired_at')
    await queryInterface.addColumn('sessions', 'created_at', {
      type: DataTypes.DATE,
    })
    await queryInterface.addColumn('sessions', 'updated_at', {
      type: DataTypes.DATE,
    })
  },
  down: async () => {
    await queryInterface.addColumn('sessions', 'expired_at',{
      type: DataTypes.DATE,
      allowNull: false,
    })
    await queryInterface.removeColumn('sessions', 'created_at')
    await queryInterface.removeColumn('sessions', 'updated_at')
  }
}