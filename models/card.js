import mongoose, { Schema } from 'mongoose';

import { URL_REGEX } from '../utils/constant.js';

const cardSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Название должно быть заполнено'],
    minlength: [2, 'Название не может быть короче 2 символов'],
    maxlength: [30, 'Название не может быть длиннее 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Ссылка на картинку должна быть заполнена'],
    validate: {
      validator(url) {
        return URL_REGEX.test(url);
      },
      message: 'Неверно указан URL изображения',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },

}, { versionKey: false });

export default mongoose.model('Card', cardSchema);
