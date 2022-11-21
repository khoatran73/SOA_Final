import { Model, model, Schema } from 'mongoose';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { DefaultModelId } from '../configs';
import { ICategory } from '../types/Product/Category';
import { slugifyOpts } from '../utils/slugify';

interface ICategoryMethod {
    setSlug: (name: string) => void;
    setId: (num: number) => void;
}

type CategoryModel = Model<ICategory, {}, ICategoryMethod>;

const schema = new Schema<ICategory, CategoryModel, ICategoryMethod>(
    {
        id: { type: String, unique: true, required: true, default: DefaultModelId },
        code: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        slug: { type: String },
        imageUrl: { type: String },
    },
    { timestamps: true },
);

schema.methods.setSlug = function (name: string) {
    this.slug = slugify(name, slugifyOpts);
};

schema.methods.setId = function (num: number) {
    this.id = uuidv4() + '-' + (Math.random() * 10000000).toString().substring(0, 7);
};

const Category = model<ICategory, CategoryModel>('Category', schema);

export default Category;
