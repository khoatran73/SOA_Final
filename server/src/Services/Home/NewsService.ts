import { AppUser } from 'Auth/Identity';
import { Request, Response } from 'express';
import { INews } from 'Home/News';
import _ from 'lodash';
import LocaleUtil from '../../utils/LocaleUtil';
import { ResponseOk } from '../../common/ApiResponse';
import { PaginatedList, PaginatedListConstructor, PaginatedListQuery } from '../../common/PaginatedList';
import News from '../../Models/News';
import User from '../../Models/User';
import Category from './../../Models/Category';
import PlacementService from './../Common/PlacementService';

type NewsRequest = INews & Pick<AppUser, 'province' | 'district' | 'ward'>;

type NewsResponse = INews &
    Partial<AppUser> & {
        slug: string;
    };

type NewsResponseWithAddress = INews & {
    address: string;
};

type NewsSearch = NewsResponse & { categoryName: string };

type FilterRequest = PaginatedListQuery & {
    minPrice: number;
    maxPrice: number;
    orderBy: 'new' | 'price';
    provinceCode: string;
    categorySlug: string;
    searchKey: string;
};

const addNews = async (req: Request<any, any, NewsRequest>, res: Response) => {
    //req.session user//
    const user = {
        email: '',
        fullName: 'Quản trị viên hệ thống',
        id: 'a35002f3-c2bd-4949-a76f-9702e360feb7',
        isSupper: true,
        username: 'admin',
        phoneNumber: '',
        amount: 10127,
    };

    const news = new News({
        ...req.body,
        userId: user.id,
    });

    news.save();
    await User.updateOne(
        { id: user.id },
        {
            province: req.body.province,
            district: req.body.district,
            ward: req.body.ward,
        },
    );

    return res.json(ResponseOk());
};

const showNews = async (req: Request<{ id: string }, any>, res: Response) => {
    const id = req.params.id;
    const news = await News.findOne({ id: id });
    const user = await User.findOne({ id: news?.userId });
    const category = await Category.findOne({ id: news?.categoryId });
    const doc = _.get({ ...news }, '_doc') ?? {};
    const provinceName = PlacementService.getProvinceByCode(user?.province)?.name;
    const districtName = PlacementService.getDistrictByCode(user?.province, user?.district)?.name;
    const wardName = PlacementService.getWardByCode(user?.district, user?.ward)?.name;
    const userDoc = _.get({ ...user }, '_doc') ?? {};
    const response: NewsResponse = {
        ...userDoc,
        ...doc,
        provinceName,
        districtName,
        wardName,
        slug: category?.slug ?? '',
    };

    return res.json(ResponseOk<NewsResponse>(response));
};

const showNewsByCategorySlug = async (req: Request<{ slug: string }, any, any, PaginatedListQuery>, res: Response) => {
    const slug = req.params.slug;
    const category = await Category.findOne({ slug: slug });
    const categoryId = category?.id;
    const news = await News.find({ categoryId: categoryId });
    const userIds = [...new Set(news.map(x => x.userId))];
    const users = await User.find({ id: { $in: userIds } });
    const newsResponse = news.map(x => {
        const doc = _.get({ ...x }, '_doc') ?? {};
        const user = users.find(y => y.id === x.userId);
        const provinceName = PlacementService.getProvinceByCode(user?.province)?.name;
        const districtName = PlacementService.getDistrictByCode(user?.province, user?.district)?.name;
        const wardName = PlacementService.getWardByCode(user?.district, user?.ward)?.name;

        return { ...doc, address: `${wardName}, ${districtName}, ${provinceName}` } as NewsResponseWithAddress;
    });

    const result = PaginatedListConstructor<NewsResponseWithAddress>(newsResponse, req.query.offset, req.query.limit);
    return res.json(ResponseOk<PaginatedList<NewsResponseWithAddress>>(result));
};

const showNewsOthers = async (req: Request<any, any, any, { newsId: string; userId: string }>, res: Response) => {
    const { userId, newsId } = req.query;
    const listNews = await News.find({ userId: userId, id: { $ne: newsId } });
    const user = await User.findOne({ id: userId });

    const newsResponse = listNews.map(x => {
        const doc = _.get({ ...x }, '_doc') ?? {};
        const provinceName = PlacementService.getProvinceByCode(user?.province)?.name;
        const districtName = PlacementService.getDistrictByCode(user?.province, user?.district)?.name;
        const wardName = PlacementService.getWardByCode(user?.district, user?.ward)?.name;

        return { ...doc, provinceName, districtName, wardName } as NewsResponse;
    });

    return res.json(ResponseOk<NewsResponse[]>(newsResponse));
};

const showNewsRelations = async (
    req: Request<any, any, any, { newsId: string; categoryId: string }>,
    res: Response,
) => {
    const { newsId, categoryId } = req.query;
    const listNews = await News.find({ categoryId: categoryId, id: { $ne: newsId } });
    const userIds = [...new Set(listNews.map(x => x.userId))];
    const users = await User.find({ id: { $in: userIds } });

    const newsResponse = listNews.map(x => {
        const doc = _.get({ ...x }, '_doc') ?? {};
        const user = users.find(y => y.id === x.userId);
        const provinceName = PlacementService.getProvinceByCode(user?.province)?.name;
        const districtName = PlacementService.getDistrictByCode(user?.province, user?.district)?.name;
        const wardName = PlacementService.getWardByCode(user?.district, user?.ward)?.name;

        return { ...doc, provinceName, districtName, wardName } as NewsResponse;
    });

    return res.json(ResponseOk<NewsResponse[]>(newsResponse));
};

const showNewsNewest = async (req: Request, res: Response) => {
    const listNews = (await News.find().sort({ createdAt: -1 })).filter((x, index) => index < 8);
    const userIds = [...new Set(listNews.map(x => x.userId))];
    const users = await User.find({ id: { $in: userIds } });

    const newsResponse = listNews.map(x => {
        const doc = _.get({ ...x }, '_doc') ?? {};
        const user = users.find(y => y.id === x.userId);
        const provinceName = PlacementService.getProvinceByCode(user?.province)?.name;
        const districtName = PlacementService.getDistrictByCode(user?.province, user?.district)?.name;
        const wardName = PlacementService.getWardByCode(user?.district, user?.ward)?.name;

        return { ...doc, provinceName, districtName, wardName } as NewsResponse;
    });

    return res.json(ResponseOk<NewsResponse[]>(newsResponse));
};

const TenMillions = 10000000;

const searchNews = async (req: Request<any, any, any, FilterRequest>, res: Response) => {
    const { searchKey, categorySlug, maxPrice, minPrice, orderBy, provinceCode } = req.query;
    const searchKeyIgnoreSensitive = LocaleUtil.ignoreSensitive(searchKey);
    const allNews = await News.find({}).sort({ createdAt: -1 });
    const categories = await Category.find();
    const users = await User.find();
    //
    const category = categories.find(x => x.slug === categorySlug);

    const listNews = allNews.filter(news => {
        // search Key
        const titleIgnoreSensitive = LocaleUtil.ignoreSensitive(news.title);
        let predicate: any = titleIgnoreSensitive.includes(searchKeyIgnoreSensitive);
        // category
        if (category) predicate = predicate && news.categoryId === category.id;
        // min, max
        if (minPrice) predicate = predicate &&  news.price && news.price >= minPrice;
        if (maxPrice && maxPrice < TenMillions) predicate = predicate && news.price && news.price <= maxPrice;
        //province
        const user = users.find(x => x.id === news.userId);
        if (user && provinceCode && provinceCode !== 'all') predicate = predicate && user.province === provinceCode;

        return predicate;
    });

    let sorted = listNews;
    if (orderBy === 'new') sorted = _.orderBy(listNews, ['createdAt'], ['desc']);
    else if (orderBy === 'price') sorted = _.orderBy(listNews, ['price'], ['desc']);

    const newsSearches = sorted.map(news => {
        const doc = _.get({ ...news }, '_doc') ?? {};
        const user = users.find(x => x.id === news.userId);
        const province = PlacementService.getProvinceByCode(user?.province);

        return {
            ...doc,
            categoryName: categories.find(x => x.id === news.categoryId)?.name,
            provinceName: province?.name,
        } as NewsSearch;
    });

    const result = PaginatedListConstructor<NewsSearch>(newsSearches, req.query.offset, req.query.limit);

    return res.json(ResponseOk<PaginatedList<NewsSearch>>(result));
};

const NewsService = {
    addNews,
    showNews,
    showNewsByCategorySlug,
    showNewsOthers,
    showNewsRelations,
    showNewsNewest,
    searchNews,
};

export default NewsService;
