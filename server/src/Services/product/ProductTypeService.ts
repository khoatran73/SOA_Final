import { Request, Response } from 'express';
import _ from 'lodash';
import { IProductType, ProductTypeResponse, ProductTypeWithSlug } from 'Product/ProductType';
import slugify from 'slugify';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import { PaginatedList, PaginatedListConstructor, PaginatedListQuery } from '../../common/PaginatedList';
import ProductType from '../../Models/ProductType';
import { Identifier } from '../../types/shared';
import { slugifyOpts } from '../../utils/slugify';
import Category from './../../Models/Category';
import { ComboOption } from './../../types/shared/ComboOption';

const getProductTypeIndex = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const types = await ProductType.find({});
    const categories = await Category.find({});
    const response = types.map(type => {
        const doc = _.get({ ...type }, '_doc') ?? {};
        return {
            ...doc,
            categoryName: categories.find(category => category.id === type.categoryId)?.name,
        } as ProductTypeResponse;
    });
    const result = PaginatedListConstructor<ProductTypeResponse>(response, req.query.offset, req.query.limit);
    return res.json(ResponseOk<PaginatedList<ProductTypeResponse>>(result));
};

const addProductType = async (req: Request<any, any, IProductType>, res: Response) => {
    const productType = new ProductType({
        ...req.body,
    });
    productType.setSlug(productType.name);
    productType.setId(Math.random());
    productType.save();

    return res.json(ResponseOk());
};

const updateProductType = async (req: Request<{ id: string }, any, IProductType, any>, res: Response) => {
    const id = req.params.id;
    const productType = await ProductType.findOne({ id: id });
    if (!productType) {
        return res.json(ResponseFail('Không tìm thấy Role!'));
    }

    await ProductType.updateOne(
        { id: id },
        {
            ...req.body,
            slug: slugify(req.body.name, slugifyOpts),
        },
    );

    return res.json(ResponseOk());
};

const deleteProductType = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    return ProductType.deleteOne({ id: id })
        .then(() => res.json(ResponseOk()))
        .catch(err => res.json(ResponseFail(err?.message)));
};

const comboProductType = async (req: Request<any, any, any, { categoryId: string }>, res: Response) => {
    const types = await ProductType.find({ categoryId: req.query.categoryId });
    const result = types.map(type => ({ value: type.id, label: type.name } as ComboOption));
    return res.json(ResponseOk<ComboOption<Identifier>[]>(result));
};

const getTypesWithSlug = async (req: Request, res: Response) => {
    const types = await ProductType.find();
    const result = types.map(type => ({ id: type.id, name: type.name, slug: type.slug } as ProductTypeWithSlug));
    return res.json(ResponseOk<ProductTypeWithSlug[]>(result));
};

const ProductTypeService = {
    getProductTypeIndex,
    addProductType,
    updateProductType,
    deleteProductType,
    comboProductType,
    getTypesWithSlug,
};

export default ProductTypeService;
