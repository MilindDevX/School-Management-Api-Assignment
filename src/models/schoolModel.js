const db = require('../config/database');

/**
 * School Model — handles all database operations for schools
 */
const School = {
  /**
   * Insert a new school into the database
   * @param {Object} schoolData - { name, address, latitude, longitude }
   * @returns {Object} - The newly created school record
   */
  async create({ name, address, latitude, longitude }) {
    const [result] = await db.execute(
      `INSERT INTO schools (name, address, latitude, longitude)
       VALUES (?, ?, ?, ?)`,
      [name, address, latitude, longitude]
    );

    const [rows] = await db.execute(
      'SELECT * FROM schools WHERE id = ?',
      [result.insertId]
    );

    return rows[0];
  },

  /**
   * Fetch all schools from the database
   * @returns {Array} - All school records
   */
  async findAll() {
    const [rows] = await db.execute(
      'SELECT id, name, address, latitude, longitude, created_at FROM schools ORDER BY id ASC'
    );
    return rows;
  },

  /**
   * Find a school by its ID
   * @param {number} id
   * @returns {Object|null}
   */
  async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM schools WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },
};

module.exports = School;
