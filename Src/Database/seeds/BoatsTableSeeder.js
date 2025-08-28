exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('boats', [
      {
        boat_id: 'BOAT1001',
        boatName: 'Sea Breeze',
        cargoOwner: 'ABC Logistics',
        cargoType: 'Electronics',
        captainNames: 'John Doe',
        captainContacts: '+250788123456',
        fullOrEmpty: 'Full',
        arrivalDate: '2025-08-10',
        arrivalTime: '08:30',
        exited: false,
        exitTime: '',
        status: 'Arrived',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        boat_id: 'BOAT1002',
        boatName: 'Ocean Explorer',
        cargoOwner: 'XYZ Traders',
        cargoType: 'Textiles',
        captainNames: 'Jane Smith',
        captainContacts: '+250788654321',
        fullOrEmpty: 'Empty',
        arrivalDate: '2025-08-09',
        arrivalTime: '14:00',
        exited: true,
        exitTime: '2025-08-10 10:00',
        status: 'Exited',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('boats', null, {});
  }
};