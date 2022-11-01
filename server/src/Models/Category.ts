import { Model, model, Schema } from 'mongoose';
import { ICategory } from '../types/Product/Category';
import slugify from 'slugify';
import { slugifyOpts } from '../utils/slugify';
import { v4 as uuidv4 } from 'uuid';

interface ICategoryMethod {
    setSlug: (name: string) => void;
}

type CategoryModel = Model<ICategory, {}, ICategoryMethod>;

const schema = new Schema<ICategory, CategoryModel, ICategoryMethod>({
    id: { type: String, unique: true, required: true, default: uuidv4() },
    code: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    slug: { type: String },
    imageUrl: { type: String },
});

schema.methods.setSlug = function (name: string) {
    this.slug = slugify(name, slugifyOpts);
};

const Category = model<ICategory, CategoryModel>('Category', schema);

export default Category;
