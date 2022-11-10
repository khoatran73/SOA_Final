import { INews } from 'Home/News';
import { Model, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface NewsMethod {}

type NewsModel = Model<INews, {}, NewsMethod>;

const schema = new Schema<INews, NewsModel, NewsMethod>(
    {
        id: { type: String, unique: true, required: true, default: uuidv4() },
        userId: { type: String, required: true },
        categoryId: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        description: { type: String, required: true, maxlength: 1500 },
        imageUrls: { type: [String] },
    },
    { timestamps: true },
);

const News = model<INews, NewsModel>('News', schema);

export default News;
