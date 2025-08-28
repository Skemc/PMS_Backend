import bcrypt from "bcrypt";

export async function up(queryInterface, Sequelize) {
  const saltRounds = 10;
  const password = "YourAdminPassword"; // Replace or get from env

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return queryInterface.bulkInsert("users", [
    {
      user_id: "101",
      firstName: "KAREKEZI",
      lastName: "Eric",
      userName: "KEric",
      email: "karekezieric@gmail.com",
      role: "super_admin",
      password: hashedPassword,
      created_on: new Date(),
    },
    {
      user_id: "102",
      firstName: "KARENZI",
      lastName: "Yves",
      userName: "KYves",
      email: "karenziyves@gmail.com",
      role: "port_manager",
      password: hashedPassword,
      created_on: new Date(),
    },
    {
      user_id: "103",
      firstName: "MUKUNZI",
      lastName: "EDWARD",
      userName: "MEdward",
      email: "mukunziedward@gmail.com",
      role: "wh_officer",
      password: hashedPassword,
      created_on: new Date(),
    },
    {
      user_id: "104",
      firstName: "MUSONI",
      lastName: "Patrick",
      userName: "MPatrick",
      email: "musonipatrick@gmail.com",
      role: "ops_manager",
      password: hashedPassword,
      created_on: new Date(),
    },
    // Add other initial users here...
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("users", null, {});
}
