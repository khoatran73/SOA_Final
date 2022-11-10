import { Model, model, Schema } from 'mongoose';
import slugify from 'slugify';
import { slugifyOpts } from '../utils/slugify';
import { v4 as uuidv4 } from 'uuid';
import { IProductType } from 'Product/ProductType';

interface IProductTypeMethod {
    setSlug: (name: string) => void;
}

type ProductTypeModel = Model<IProductType, {}, IProductTypeMethod>;

const schema = new Schema<IProductType, ProductTypeModel, IProductTypeMethod>({
    id: { type: String, unique: true, required: true, default: uuidv4() },
    name: { type: String, required: true },
    categoryId: { type: String, required: true },
    slug: { type: String },
    imageUrl: { type: String },
});

schema.methods.setSlug = function (name: string) {
    this.slug = slugify(name, slugifyOpts);
};

const ProductType = model<IProductType, ProductTypeModel>('ProductType', schema);

export default ProductType;
