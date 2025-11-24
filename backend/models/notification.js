module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        idNotif: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        idRes: {
            type: DataTypes.INTEGER,
            allowNull: false
            // 🆕 SUPPRIMER la référence foreign key temporairement
        },
        typeNotif: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        titre: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        destinataireRole: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'reception'
        },
        statutNotif: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'non_lu'
        },
        urgence: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'moyenne'
        },
        dateEnvoi: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        dateLecture: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'notifications',
        timestamps: false,
        indexes: [
            {
                fields: ['destinataireRole']
            },
            {
                fields: ['statutNotif']
            },
            {
                fields: ['dateEnvoi']
            },
            {
                fields: ['idRes']
            }
        ]
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.Reservation, {
            foreignKey: 'idRes',
            as: 'reservation'
        });
    };

    return Notification;
};