import { AppUser } from '../../types/Auth/Identity';
import { Request, Response } from 'express';
import { INews, NewsBump, NewsStatus } from '../../types/Home/News';
import _ from 'lodash';
import LocaleUtil from '../../utils/LocaleUtil';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import { PaginatedList, PaginatedListConstructor, PaginatedListQuery } from '../../common/PaginatedList';
import News from '../../Models/News';
import User from '../../Models/User';
import Category from './../../Models/Category';
import PlacementService from './../Common/PlacementService';
import moment from 'moment';
import DateTimeUtil from '../..//utils/DateTimeUtil';
import { userInfo } from 'os';

type NewsRequest = INews & Pick<AppUser, 'province' | 'district' | 'ward'>;

type NewsResponse = INews &
    Partial<AppUser> & {
        slug: string;
        page?: number;
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

const showNewsNewest = async (req: Request<any, any, any, { limit: number }>, res: Response) => {
    const limit = req.query.limit;
    const listNews = await News.find().sort({ createdAt: -1 });
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

    const result = PaginatedListConstructor<NewsResponse>(newsResponse, 0, limit); //

    return res.json(ResponseOk<PaginatedList<NewsResponse>>(result));
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
        if (minPrice) predicate = predicate && news.price && news.price >= minPrice;
        if (maxPrice && maxPrice < TenMillions) predicate = predicate && news.price && news.price <= maxPrice;
        //province
        const user = users.find(x => x.id === news.userId);
        if (user && provinceCode && provinceCode !== 'all') predicate = predicate && user.province === provinceCode;

        return predicate;
    });

    let sorted = listNews;
    if (orderBy === 'new') sorted = _.orderBy(listNews, ['createdAt'], ['desc']);
    else if (orderBy === 'price') sorted = _.orderBy(listNews, ['price'], ['desc']);

    const priorities = sorted.filter(x => DateTimeUtil.checkExpirationDate(x.bumpPriority?.toDate));
    const notPriorities = sorted.filter(x => !DateTimeUtil.checkExpirationDate(x.bumpPriority?.toDate));
    sorted = priorities.concat(notPriorities);

    const newsSearches = sorted.map(news => {
        const doc = _.get({ ...news }, '_doc') ?? {};
        const user = users.find(x => x.id === news.userId);
        const userDoc = _.get({ ...user }, '_doc') ?? {};
        const province = PlacementService.getProvinceByCode(user?.province);

        return {
            ...doc,
            ...userDoc,
            categoryName: categories.find(x => x.id === news.categoryId)?.name,
            provinceName: province?.name,
        } as NewsSearch;
    });

    const result = PaginatedListConstructor<NewsSearch>(newsSearches, req.query.offset, req.query.limit);

    return res.json(ResponseOk<PaginatedList<NewsSearch>>(result));
};

const showNewsByUserId = async (req: Request<any, any, any, { userId: string }>, res: Response) => {
    const userId = req.query.userId;
    const listNews = await News.find({ userId: userId });
    const allNews = await News.find();
    const user = await User.findOne({ id: userId });
    const categories = await Category.find();

    const newsResponse = listNews.map(x => {
        const doc = _.get({ ...x }, '_doc') ?? {};
        const provinceName = PlacementService.getProvinceByCode(user?.province)?.name;
        const districtName = PlacementService.getDistrictByCode(user?.province, user?.district)?.name;
        const wardName = PlacementService.getWardByCode(user?.district, user?.ward)?.name;
        const page = calculatePage(allNews, x);
        const category = categories.find(y => y.id === x.categoryId)

        return { ...doc, provinceName, districtName, wardName, page, categoryName: category?.name } as NewsSearch;
    });

    return res.json(ResponseOk<NewsSearch[]>(newsResponse));
};

const updateNewsBump = async (
    req: Request<{ id: string }, any, { bumpImage: number | undefined; bumpPriority: number | undefined }, any>,
    res: Response,
) => {
    const id = req.params.id;
    const { bumpImage, bumpPriority } = req.body;

    const news = await News.findOne({ id: id });
    if (!news) {
        return res.json(ResponseFail('Không tìm thấy tin!'));
    }

    let newBumpPriority: NewsBump | undefined = undefined;
    let newBumpImage: NewsBump | undefined = undefined;
    // truong hop bumpPriority
    if (bumpPriority) {
        const toDateLeft = news.bumpPriority?.toDate; // ngày kết thúc
        newBumpPriority = calculateNewBump(toDateLeft, bumpPriority);
    }

    if (bumpImage) {
        const toDateLeft = news.bumpImage?.toDate; // ngày kết thúc
        newBumpImage = calculateNewBump(toDateLeft, bumpImage);
    }

    await News.updateOne(
        { id: id },
        {
            bumpImage: !!newBumpImage ? newBumpImage : news.bumpImage,
            bumpPriority: !!newBumpPriority ? newBumpPriority : news.bumpPriority,
        },
    );

    return res.json(ResponseOk());
};

const hideNews = async (req: Request<{ id: string }, any, any, any>, res: Response) => {
    const id = req.params.id;
    const news = await News.findOne({ id: id });
    if (!news) {
        return res.json(ResponseFail('Không tìm thấy tin!'));
    }

    await News.updateOne(
        { id: id },
        {
            status: NewsStatus.Sold,
        },
    );

    return res.json(ResponseOk());
};

// #region private method

const calculateNewBump = (toDateLeft?: string, day?: number) => {
    let fromDate;
    let toDate;
    // const toDateLeft = news.bumpPriority.toDate; // ngày kết thúc
    const dateNow = moment().format();

    const remainMilliSeconds = DateTimeUtil.diffTwoStringDate(toDateLeft ?? '', dateNow);
    if (remainMilliSeconds > 0) {
        console.log('>');
        fromDate = moment().format();
        toDate = moment().add(remainMilliSeconds, 'ms').add(day, 'd').format();
    } else {
        console.log('<');
        fromDate = moment().format();
        toDate = moment().add(day, 'd').format();
    }

    return {
        fromDate,
        toDate,
        day: day,
    } as NewsBump;
};

const calculatePage = (allNews: INews[], news: INews) => {
    const listNews = allNews.filter(x => x.categoryId === news.categoryId);
    let sorted = _.orderBy(listNews, ['createdAt'], ['desc']);
    const priorities = sorted.filter(x => DateTimeUtil.checkExpirationDate(x.bumpPriority?.toDate));
    const notPriorities = sorted.filter(x => !DateTimeUtil.checkExpirationDate(x.bumpPriority?.toDate));
    sorted = priorities.concat(notPriorities);

    const index = sorted.findIndex(x => x.id === news.id);

    return Math.floor(index / 10) + 1;
};

// #endregion

const NewsService = {
    addNews,
    showNews,
    showNewsByCategorySlug,
    showNewsOthers,
    showNewsRelations,
    showNewsNewest,
    searchNews,
    showNewsByUserId,
    updateNewsBump,
    hideNews
};

export default NewsService;
