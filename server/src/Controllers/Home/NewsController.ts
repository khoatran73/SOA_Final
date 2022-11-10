import express from 'express';
import NewsService from './../../Services/Home/NewsService';

const router = express.Router();

router.post('/create', NewsService.addNews);
router.get('/show/:id', NewsService.showNews);
router.get('/category/:slug', NewsService.showNewsByCategorySlug);
router.get('/other', NewsService.showNewsOthers);
router.get('/relation', NewsService.showNewsRelations);
router.get('/newest', NewsService.showNewsNewest);
router.get('/search', NewsService.searchNews);



export default router;
