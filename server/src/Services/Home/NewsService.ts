import { Request, Response } from 'express';
import _ from 'lodash';
import moment from 'moment';
import TransactionHistory, { PaymentAction, PaymentMethod } from '../../Models/TransactionHistory';
import DateTimeUtil from '../..//utils/DateTimeUtil';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import { PaginatedList, PaginatedListConstructor, PaginatedListQuery } from '../../common/PaginatedList';
import News from '../../Models/News';
import User from '../../Models/User';
import { AppUser } from '../../types/Auth/Identity';
import { INews, NewsBump, NewsStatus } from '../../types/Home/News';
import { SellType } from '../../types/Product/Category';
import LocaleUtil from '../../utils/LocaleUtil';
import Category from './../../Models/Category';
import PlacementService from './../Common/PlacementService';

type NewsRequest = {
    categoryId: string;
    productTypeId: string;
    title: string;
    price: number;
    description: string;
    province: string;
    district: string;
    ward: string;
    address: string; //d/c cụ thể
    imageUrls: string[];
};

type NewsResponse = INews &
    Partial<AppUser> & {
        slug: string;
        page?: number;
        index?: number;
        isOnline?: boolean;
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
    const user = req.session.user;

    const news = new News({
        ...req.body,
        userId: user?.id,
    });

    news.setId(Math.random());
    news.save();
    await User.updateOne(
        { id: user?.id },
        {
            province: req.body.province,
            district: req.body.district,
            ward: req.body.ward,
        },
    );

    return res.json(ResponseOk());
};

const updateNews = async (req: Request<{ id: string }, any, NewsRequest>, res: Response) => {
    const id = req.params.id;
    const news = await News.findOne({ id: id });
    if (!news) return res.json(ResponseFail('Không tìm thấy tin tức!'));

    const user = req.session.user;

    if (news.userId !== user?.id) return res.json(ResponseFail('Bạn không có quyền sửa tin này!'));

    await News.updateOne(
        { id: id },
        {
            ...req.body,
        },
    );

    await User.updateOne(
        { id: user?.id },
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
    if (!news) return res.json(ResponseFail('Không tìm thấy tin'));
    const user = await User.findOne({ id: news?.userId });
    const userDoc = _.get({ ...user }, '_doc') ?? {};
    const category = await Category.findOne({ id: news?.categoryId });
    const doc = _.get({ ...news }, '_doc') ?? {};
    const provinceName = PlacementService.getProvinceByCode(news?.province)?.name;
    const districtName = PlacementService.getDistrictByCode(news?.province, news?.district)?.name;
    const wardName = PlacementService.getWardByCode(news?.district, news?.ward)?.name;
    const response = {
        ...userDoc,
        ...doc,
        provinceName,
        districtName,
        wardName,
        slug: category?.slug ?? '',
        isOnline: category?.type === SellType.SellOnline,
    } as NewsResponse;

    return res.json(ResponseOk<NewsResponse>(response));
};

const showNewsByCategorySlug = async (req: Request<{ slug: string }, any, any, PaginatedListQuery>, res: Response) => {
    const slug = req.params.slug;
    const category = await Category.findOne({ slug: slug });
    if (!category) return res.json(ResponseFail('Không tìm danh mục'));

    const categoryId = category?.id;
    const listNews = await News.find({ categoryId: categoryId });
    const newsResponse = listNews.map(news => {
        const doc = _.get({ ...news }, '_doc') ?? {};
        const provinceName = PlacementService.getProvinceByCode(news?.province)?.name;
        const districtName = PlacementService.getDistrictByCode(news?.province, news?.district)?.name;
        const wardName = PlacementService.getWardByCode(news?.district, news?.ward)?.name;

        return { ...doc, address: `${wardName}, ${districtName}, ${provinceName}` } as NewsResponseWithAddress;
    });

    const responseOnlyOnSell = filterOnlyOnSell<NewsResponseWithAddress>(newsResponse);

    const result = PaginatedListConstructor<NewsResponseWithAddress>(
        responseOnlyOnSell,
        req.query.offset,
        req.query.limit,
    );
    return res.json(ResponseOk<PaginatedList<NewsResponseWithAddress>>(result));
};

const showNewsOthers = async (req: Request<any, any, any, { newsId: string; userId: string }>, res: Response) => {
    const { userId, newsId } = req.query;
    const listNews = await News.find({ userId: userId, id: { $ne: newsId } });
    const user = await User.find({ id: userId });
    const userDoc = _.get({ ...user }, '_doc') ?? {};

    const newsResponse = listNews.map(news => {
        const doc = _.get({ ...news }, '_doc') ?? {};
        const provinceName = PlacementService.getProvinceByCode(news?.province)?.name;
        const districtName = PlacementService.getDistrictByCode(news?.province, news?.district)?.name;
        const wardName = PlacementService.getWardByCode(news?.district, news?.ward)?.name;

        return { ...userDoc, ...doc, provinceName, districtName, wardName } as NewsResponse;
    }) as NewsResponse[];

    const responseOnlyOnSell = filterOnlyOnSell<NewsResponse>(newsResponse);

    return res.json(ResponseOk<NewsResponse[]>(responseOnlyOnSell));
};

const showNewsRelations = async (
    req: Request<any, any, any, { newsId: string; categoryId: string }>,
    res: Response,
) => {
    const { newsId, categoryId } = req.query;
    const listNews = await News.find({ categoryId: categoryId, id: { $ne: newsId } });
    const userIds = [...new Set(listNews.map(x => x.userId))];
    const users = await User.find({ id: { $in: userIds } });

    const newsResponse = listNews.map(news => {
        const doc = _.get({ ...news }, '_doc') ?? {};
        const user = users.find(y => y.id === news.userId);
        const userDoc = _.get({ ...user }, '_doc') ?? {};
        const provinceName = PlacementService.getProvinceByCode(news?.province)?.name;
        const districtName = PlacementService.getDistrictByCode(news?.province, news?.district)?.name;
        const wardName = PlacementService.getWardByCode(news?.district, news?.ward)?.name;

        return { ...userDoc, ...doc, provinceName, districtName, wardName } as NewsResponse;
    });

    const responseOnlyOnSell = filterOnlyOnSell<NewsResponse>(newsResponse);

    return res.json(ResponseOk<NewsResponse[]>(responseOnlyOnSell));
};

const showNewsNewest = async (req: Request<any, any, any, { limit: number }>, res: Response) => {
    const limit = req.query.limit;
    const listNews = await News.find().sort({ createdAt: -1 });
    const userIds = [...new Set(listNews.map(x => x.userId))];
    const users = await User.find({ id: { $in: userIds } });

    const newsResponse = listNews.map(news => {
        const doc = _.get({ ...news }, '_doc') ?? {};
        const user = users.find(y => y.id === news.userId);
        const userDoc = _.get({ ...user }, '_doc') ?? {};
        const provinceName = PlacementService.getProvinceByCode(news?.province)?.name;
        const districtName = PlacementService.getDistrictByCode(news?.province, news?.district)?.name;
        const wardName = PlacementService.getWardByCode(news?.district, news?.ward)?.name;

        return { ...userDoc, ...doc, provinceName, districtName, wardName } as NewsResponse;
    });

    const responseOnlyOnSell = filterOnlyOnSell<NewsResponse>(newsResponse);
    const result = PaginatedListConstructor<NewsResponse>(responseOnlyOnSell, 0, limit); //
    return res.json(ResponseOk<PaginatedList<NewsResponse>>(result));
};

const TenMillions = 10000000;

const searchNews = async (req: Request<any, any, any, FilterRequest>, res: Response) => {
    const { searchKey, categorySlug, maxPrice, minPrice, orderBy, provinceCode } = req.query;
    const searchKeyIgnoreSensitive = LocaleUtil.ignoreSensitive(searchKey);
    const allNews = await News.find({}).sort({ createdAt: -1 });
    const categories = await Category.find();
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
        if (provinceCode && provinceCode !== 'all') predicate = predicate && news?.province === provinceCode;

        return predicate;
    });

    let sorted = listNews;
    if (orderBy === 'new') sorted = _.orderBy(listNews, ['createdAt'], ['desc']);
    else if (orderBy === 'price') sorted = _.orderBy(listNews, ['price'], ['desc']);

    const priorities = sorted.filter(x => DateTimeUtil.checkExpirationDate(x.bumpPriority?.toDate));
    const notPriorities = sorted.filter(x => !DateTimeUtil.checkExpirationDate(x.bumpPriority?.toDate));
    sorted = priorities.concat(notPriorities);

    const userIds = [...new Set(sorted.map(x => x.userId))];
    const users = await User.find({ id: { $in: userIds } });

    const newsSearches = sorted.map(news => {
        const doc = _.get({ ...news }, '_doc') ?? {};
        const user = users.find(y => y.id === news.userId);
        const userDoc = _.get({ ...user }, '_doc') ?? {};
        const province = PlacementService.getProvinceByCode(news?.province);

        return {
            ...userDoc,
            ...doc,
            categoryName: categories.find(x => x.id === news.categoryId)?.name,
            provinceName: province?.name,
        } as NewsSearch;
    });

    const responseOnlyOnSell = filterOnlyOnSell<NewsSearch>(newsSearches);
    const result = PaginatedListConstructor<NewsSearch>(responseOnlyOnSell, req.query.offset, req.query.limit);
    return res.json(ResponseOk<PaginatedList<NewsSearch>>(result));
};

const showNewsByUserId = async (req: Request<any, any, any, { userId: string }>, res: Response) => {
    const userId = req.query.userId;
    const user = await User.findOne({ id: userId });
    if (!user) return res.json(ResponseFail('Người dùng không tồn tại trong hệ thống!'));
    const userDoc = _.get({ ...user }, '_doc') ?? {};
    const listNews = await News.find({ userId: userId });
    const allNews = await News.find();
    const categories = await Category.find();

    const newsResponse = listNews.map(news => {
        const doc = _.get({ ...news }, '_doc') ?? {};
        const provinceName = PlacementService.getProvinceByCode(news?.province)?.name;
        const districtName = PlacementService.getDistrictByCode(news?.province, news?.district)?.name;
        const wardName = PlacementService.getWardByCode(news?.district, news?.ward)?.name;
        const { index, page } = calculatePageAndIndex(allNews, news);
        const category = categories.find(y => y.id === news.categoryId);

        return {
            ...userDoc,
            ...doc,
            provinceName,
            districtName,
            wardName,
            page,
            index,
            categoryName: category?.name,
            slug: category?.slug,
        } as NewsSearch;
    });

    const sorted: NewsSearch[] = _.orderBy(newsResponse, ['createdAt'], ['desc']);

    return res.json(ResponseOk<NewsSearch[]>(sorted));
};

const updateNewsBump = async (
    req: Request<
        { id: string },
        any,
        {
            bumpImage: {
                day: number;
                price: number;
            } | null;
            bumpPriority: {
                day: number;
                price: number;
            } | null;
        },
        any
    >,
    res: Response,
) => {
    const id = req.params.id;
    const { bumpImage, bumpPriority } = req.body;
    const news = await News.findOne({ id: id });
    const user = req.session.user;
    if (!news) return res.json(ResponseFail('Không tìm thấy tin!'));
    if (news.userId !== user?.id) return res.json(ResponseFail('Không phải tin của bạn!'));
    const coinReduce = Number(bumpImage?.price ?? 0) + Number(bumpPriority?.price ?? 0)
    const coinRemain = Number(user?.amount) - coinReduce;
    if (coinRemain < 0) return res.json(ResponseFail('Không đủ coin'));

    let newBumpPriority: NewsBump | undefined = undefined;
    let newBumpImage: NewsBump | undefined = undefined;
    // truong hop bumpPriority
    if (bumpPriority) {
        const toDateLeft = news.bumpPriority?.toDate; // ngày kết thúc
        newBumpPriority = calculateNewBump(toDateLeft, bumpPriority.day);
    }

    if (bumpImage) {
        const toDateLeft = news.bumpImage?.toDate; // ngày kết thúc
        newBumpImage = calculateNewBump(toDateLeft, bumpImage.day);
    }

    await News.updateOne(
        { id: id },
        {
            bumpImage: !!newBumpImage ? newBumpImage : news.bumpImage,
            bumpPriority: !!newBumpPriority ? newBumpPriority : news.bumpPriority,
        },
    );

    await User.updateOne(
        { id: user?.id },
        {
            amount: coinRemain,
        },
    );

    const history = new TransactionHistory({
        userTransferId: user?.id,
        paymentMethod: PaymentMethod.Coin,
        action: PaymentAction.NewsPush,
        newsId: id,
        totalVnd: coinReduce,
    });
    history.setId(Math.random());
    await history.save(); 

    return res.json(ResponseOk());
};

const hideNews = async (req: Request<{ id: string }, any, any, any>, res: Response) => {
    const id = req.params.id;
    const news = await News.findOne({ id: id });
    if (!news) return res.json(ResponseFail('Không tìm thấy tin!'));

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
        fromDate = moment().format();
        toDate = moment().add(remainMilliSeconds, 'ms').add(day, 'd').format();
    } else {
        fromDate = moment().format();
        toDate = moment().add(day, 'd').format();
    }

    return {
        fromDate,
        toDate,
        day: day,
    } as NewsBump;
};

const calculatePageAndIndex = (allNews: INews[], news: INews) => {
    const listNews = allNews.filter(x => x.categoryId === news.categoryId);
    let sorted = _.orderBy(listNews, ['createdAt'], ['desc']);
    const priorities = sorted.filter(x => DateTimeUtil.checkExpirationDate(x.bumpPriority?.toDate));
    const notPriorities = sorted.filter(x => !DateTimeUtil.checkExpirationDate(x.bumpPriority?.toDate));
    sorted = priorities.concat(notPriorities);

    const index = sorted.findIndex(x => x.id === news.id);

    return {
        index: index + 1,
        page: Math.floor(index / 10) + 1,
    };
};

function filterOnlyOnSell<TNewsType>(newsList: TNewsType[]): TNewsType[] {
    return _.filter(newsList, x => _.get(x, 'status') === NewsStatus.OnSell);
}

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
    hideNews,
    updateNews,
};

export default NewsService;
