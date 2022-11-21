import { Request, Response } from 'express';
import slugify from 'slugify';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import { PaginatedList, PaginatedListConstructor, PaginatedListQuery } from '../../common/PaginatedList';
import Category from '../../Models/Category';
import { CategoryWithSlug, ICategory } from '../../types/Product/Category';
import { Identifier } from '../../types/shared';
import { slugifyOpts } from '../../utils/slugify';
import { ComboOption } from './../../types/shared/ComboOption';

const getCategoryIndex = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const categories = await Category.find({});

    const result = PaginatedListConstructor<ICategory>(categories, req.query.offset, req.query.limit);

    return res.json(ResponseOk<PaginatedList<ICategory>>(result));
};

const addCategory = async (req: Request<any, any, ICategory>, res: Response) => {
    const isExistCategory = Boolean(await Category.findOne({ code: req.body.code }));
    if (isExistCategory) {
        return res.json(ResponseFail('Code đã tồn tại!'));
    }

    const category = new Category({
        ...req.body,
    });
    category.setSlug(category.name);
    category.setId(Math.random());
    category.save();

    return res.json(ResponseOk());
};

const updateCategory = async (req: Request<{ id: string }, any, ICategory, any>, res: Response) => {
    const id = req.params.id;

    const category = await Category.findOne({ id: id });

    if (!category) {
        return res.json(ResponseFail('Không tìm thấy danh mục!'));
    }

    await Category.updateOne(
        { id: id },
        {
            ...req.body,
            slug: slugify(req.body.name, slugifyOpts),
        },
    );

    return res.json(ResponseOk());
};

const deleteCategory = async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;
    return Category.deleteOne({ id: id })
        .then(() => res.json(ResponseOk()))
        .catch(err => res.json(ResponseFail(err?.message)));
};

const comboCategory = async (req: Request, res: Response) => {
    const categories = await Category.find();
    const result = categories.map(category => ({ value: category.id, label: category.name } as ComboOption))
    return res.json(ResponseOk<ComboOption<Identifier>[]>(result))
}

const getCategoriesWithSlug = async (req: Request, res: Response) => {
    const categories = await Category.find();
    const result = categories.map(category => ({ id: category.id, name: category.name, slug: category.slug, imageUrl: category.imageUrl } as CategoryWithSlug))
    return res.json(ResponseOk<CategoryWithSlug[]>(result))
}

const CategoryService = {
    getCategoryIndex,
    addCategory,
    updateCategory,
    deleteCategory,
    comboCategory,
    getCategoriesWithSlug
};

export default CategoryService;
