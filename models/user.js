import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { URL_REGEX } from '../utils/constant.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неверно указана почта',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Имя не может быть короче 2 символов'],
    maxlength: [30, 'Имя не может быть длиннее 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Информация о себе не может быть короче 2 символов'],
    maxlength: [30, 'Информация о себе не может быть длиннее 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return URL_REGEX.test(url);
      },
      message: 'Неверно указан URL аватара',
    },
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

export default mongoose.model('User', userSchema);
