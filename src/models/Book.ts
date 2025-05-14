import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
}

const BookSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publishedYear: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IBook>('Book', BookSchema); 