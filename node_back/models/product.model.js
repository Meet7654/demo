const {DataTypes} = require("sequelize");
const productModel = (sequelize) => {
    const attributes = {
        id: {type: DataTypes.INTEGER,allowNull: false, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING,allowNull: true},
        image: {type: DataTypes.STRING,allowNull: true},
        price: {type: DataTypes.INTEGER,allowNull: true},
        quantity: {type: DataTypes.INTEGER,allowNull: true},
    };

    const options = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    };

    return sequelize.define('products', attributes, options);
}
module.exports = productModel;


