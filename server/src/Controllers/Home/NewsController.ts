import express from 'express';
import NewsService from './../../Services/Home/NewsService';

const router = express.Router();
/**
 * @openapi
 * '/api/home/news/create':
 *  post:
 *     tags:
 *     - News
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/NewsRequest'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.post('/create', NewsService.addNews);
/**
 * @openapi
 * '/api/home/news/show':
 *  get:
 *     tags:
 *     - News
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of news
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/show/:id', NewsService.showNews);
/**
 * @openapi
 * '/api/home/news/category':
 *  get:
 *     tags:
 *     - News
 *     parameters:
 *      - name: slug
 *        in: path
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/category/:slug', NewsService.showNewsByCategorySlug);
/**
 * @openapi
 * '/api/home/news/other':
 *  get:
 *     tags:
 *     - News
 *     parameters:
 *      - name: userId
 *        in: query
 *        description: The id of user
 *        required: true
 *      - name: newsId
 *        in: query
 *        description: The id of news
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/other', NewsService.showNewsOthers);
/**
 * @openapi
 * '/api/home/news/relation':
 *  get:
 *     tags:
 *     - News
 *     parameters:
 *      - name: newsId
 *        in: query
 *        description: The id of news
 *        required: true
 *      - name: categoryId
 *        in: query
 *        description: The id of category
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/relation', NewsService.showNewsRelations);
/**
 * @openapi
 * '/api/home/news/newest':
 *  get:
 *     tags:
 *     - News
 *     parameters:
 *      - name: limit
 *        in: query
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/newest', NewsService.showNewsNewest);
/**
 * @openapi
 * '/api/home/news/search':
 *  get:
 *     tags:
 *     - News
 *     parameters:
 *      - name: searchKey
 *        in: query
 *      - name: categorySlug
 *        in: query
 *      - name: maxPrice
 *        in: query
 *      - name: minPrice
 *        in: query
 *      - name: orderBy
 *        in: query
 *      - name: provinceCode
 *        in: query
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/search', NewsService.searchNews);
/**
 * @openapi
 * '/api/home/news/show-by-user':
 *  get:
 *     tags:
 *     - News
 *     parameters:
 *      - name: userId
 *        in: query
 *        description: The id of user
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.get('/show-by-user', NewsService.showNewsByUserId);
/**
 * @openapi
 * '/api/home/news/update-bump/{id}':
 *  put:
 *     tags:
 *     - News
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     requestBody:
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/NewsBump'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.put('/update-bump/:id', NewsService.updateNewsBump);
/**
 * @openapi
 * '/api/home/news/hide/{id}':
 *  put:
 *     tags:
 *     - News
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     requestBody:
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/NewsBump'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.put('/hide/:id', NewsService.hideNews);
/**
 * @openapi
 * '/api/home/news/update/{id}':
 *  put:
 *     tags:
 *     - News
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *     requestBody:
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/types/NewsRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/types/ApiResponse'
 */
router.put('/update/:id', NewsService.updateNews);
/**
 * @openapi
 * components:
 *  types:
 *    NewsRequest:
 *      type: object
 *      properties:
 *        categoryId:
 *          type: string
 *          default: string
 *        productTypeId:
 *          type: string
 *          default: string
 *        title:
 *          type: string
 *          default: string
 *        price:
 *          type: string
 *          default: string
 *        description:
 *          type: string
 *          default: string
 *        province:
 *          type: string
 *          default: string
 *        district:
 *          type: string
 *          default: string
 *        ward:
 *          type: string
 *          default: string
 *        address:
 *          type: string
 *          default: string
 *        imageUrls:
 *          type: array
 *          default: []
 *    NewsBump:
 *      type: object
 *      properties:
 *        bumpImage:
 *          type: number
 *        bumpPriority:
 *          type: number
*/
export default router;
