const {DataTypes} = require("sequelize");
const orderModel = (sequelize) => {
    const attributes = {
        id: {type: DataTypes.INTEGER,allowNull: false, primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER,allowNull: true},
        product_id: {type: DataTypes.INTEGER,allowNull: true},
        product_quantity: {type: DataTypes.STRING,allowNull: true},
        total_price: {type: DataTypes.STRING,allowNull: true},

    };

    const options = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    };

    return sequelize.define('orders', attributes, options);
}
module.exports = orderModel;


