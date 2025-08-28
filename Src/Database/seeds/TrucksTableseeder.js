exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('trucks', [
      {
        truck_id: 'TRK1001',
        plateNumber: 'RAB123A',
        cargoOwner: 'ABC Logistics',
        cargoType: 'Electronics',
        driverNames: 'John Doe',
        driverContacts: '+250788123456',
        fullOrEmpty: 'Full',
        sealNumber: 'SN123456',
        arrivalDate: '2025-08-10',
        arrivalTime: '08:30',
        exited: false,
        exitTime: '',
        status: 'Arrived',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        truck_id: 'TRK1002',
        plateNumber: 'RAB456B',
        cargoOwner: 'XYZ Traders',
        cargoType: 'Textiles',
        driverNames: 'Jane Smith',
        driverContacts: '+250788654321',
        fullOrEmpty: 'Empty',
        sealNumber: 'SN654321',
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
    await queryInterface.bulkDelete('trucks', null, {});
  }
};