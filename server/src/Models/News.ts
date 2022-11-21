import { Model, model, Schema } from 'mongoose';
import { DefaultModelId } from '../configs';
import { INews, NewsStatus } from '../types/Home/News';
import { v4 as uuidv4 } from 'uuid';

interface NewsMethod {
    setId: (num: number) => void;
}

type NewsModel = Model<INews, {}, NewsMethod>;

const schema = new Schema<INews, NewsModel, NewsMethod>(
    {
        id: { type: String, unique: true, required: true },
        userId: { type: String, required: true },
        categoryId: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        description: { type: String, required: true, maxlength: 1500 },
        imageUrls: { type: [String] },
        status: { type: String, default: NewsStatus.OnSell },
        bumpImage: Object,
        bumpPriority: Object,
        province: String,
        district: String,
        ward: String,
        address: String,
        productTypeId: String,
    },
    { timestamps: true },
);

schema.methods.setId = function (num: number) {
    this.id = uuidv4() + '-' + (Math.random() * 10000000).toString().substring(0, 7);
};

const News = model<INews, NewsModel>('News', schema);

export default News;
