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

type NewsResponse = INews & Partial<AppUser>;

type NewsResponseWithAddress = INews & {
    address: string;
};

type NewsSearch = Pick<INews, 'id' | 'title'> & { categoryName: string };

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
    const doc = _.get({ ...news }, '_doc');
    const provinceName = PlacementService.getProvinceByCode(user?.province)?.name;
    const districtName = PlacementService.getDistrictByCode(user?.province, user?.district)?.name;
    const wardName = PlacementService.getWardByCode(user?.district, user?.ward)?.name;
    const userDoc = _.get({ ...user }, '_doc');
    const response: NewsResponse = {
        ...userDoc,
        ...doc,
        provinceName,
        districtName,
        wardName,
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
        const doc = _.get({ ...x }, '_doc');
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
        const doc = _.get({ ...x }, '_doc');
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
        const doc = _.get({ ...x }, '_doc');
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
        const doc = _.get({ ...x }, '_doc');
        const user = users.find(y => y.id === x.userId);
        const provinceName = PlacementService.getProvinceByCode(user?.province)?.name;
        const districtName = PlacementService.getDistrictByCode(user?.province, user?.district)?.name;
        const wardName = PlacementService.getWardByCode(user?.district, user?.ward)?.name;

        return { ...doc, provinceName, districtName, wardName } as NewsResponse;
    });

    return res.json(ResponseOk<NewsResponse[]>(newsResponse));
};

const searchNews = async (req: Request<any, any, any, { searchKey: string }>, res: Response) => {
    const searchKey = req.query.searchKey;
    const allNews = await News.find({}).sort({ createdAt: -1 });
    const listNews = allNews.filter(news => {
        const titleIgnoreSensitive = LocaleUtil.ignoreSensitive(news.title);
        return titleIgnoreSensitive.includes(searchKey);
    });
    const categoryIds = [...new Set(listNews.map(x => x.categoryId))];
    const categories = await Category.find({ id: { $in: categoryIds } });

    const newsSearches = listNews.map(news => {
        return {
            id: news.id,
            title: news.title,
            categoryName: categories.find(x => x.id === news.categoryId)?.name,
        } as NewsSearch;
    });

    return res.json(ResponseOk<NewsSearch[]>(newsSearches));
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
