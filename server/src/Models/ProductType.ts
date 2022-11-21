import { Model, model, Schema } from 'mongoose';
import { IProductType } from 'Product/ProductType';
import slugify from 'slugify';
import { DefaultModelId } from '../configs';
import { slugifyOpts } from '../utils/slugify';
import { v4 as uuidv4 } from 'uuid';

interface IProductTypeMethod {
    setSlug: (name: string) => void;
    setId: (num: number) => void;
}

type ProductTypeModel = Model<IProductType, {}, IProductTypeMethod>;

const schema = new Schema<IProductType, ProductTypeModel, IProductTypeMethod>(
    {
        id: { type: String, unique: true, required: true, default: DefaultModelId },
        name: { type: String, required: true },
        categoryId: { type: String, required: true },
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


const ProductType = model<IProductType, ProductTypeModel>('ProductType', schema);

export default ProductType;
