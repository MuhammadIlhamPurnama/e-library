'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg : "Email already exists."
      },
      validate: {
        isEmail: {
          msg: "Invalid email format."
        },
        notEmpty: {
          msg: "Email is required."
        },
        notNull: {
          msg: "Email is required."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required."
        },
        notNull: {
          msg: "Password is required."
        },
        len: {
          args: [8],
          msg: "Password minimum 8 characters."
        },
        isStrongPassword(value) {
          const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

          if (!regex.test(value)) {
            throw new Error(
              "Password must contain uppercase letters, lowercase letters, and numbers."
            );
          }
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Role is required."
        },
        notNull: {
          msg: "Role is required."
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);

        user.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};