const {DataTypes} = require("sequelize");
const userModel = (sequelize) => {
    const attributes = {
        id: {type: DataTypes.INTEGER,allowNull: false, primaryKey: true, autoIncrement: true},
        first_name: {type: DataTypes.STRING,allowNull: false},
        last_name: {type: DataTypes.STRING,allowNull: true},
        email: {type: DataTypes.STRING,allowNull: true},
        password: {type: DataTypes.STRING,allowNull: true},
        role: {type: DataTypes.STRING,allowNull: true},

    };

    const options = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    };

    return sequelize.define('user', attributes, options);
}
module.exports = userModel;


