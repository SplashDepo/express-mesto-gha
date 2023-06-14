import mongoose, { Schema } from 'mongoose';

import URL_REGEX from '../utils/constant.js';

const cardSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    validate: {
      validator: ({ length }) => length >= 2 && length <= 30,
      message: 'Имя карточки должно быть длиной от 2 до 30 символов',
    },
  },
  link: {
    type: String,
    validate: {
      validator: (url) => URL_REGEX.test(url),
      message: 'Требуется ввести URL',
    },
    required: [true, 'Поле "link" должно быть заполнено'],
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
