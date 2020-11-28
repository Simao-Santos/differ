/**
 * @swagger
 *  tags:
 *   name: URLs
 *   description: API to manage URLs.
 */

/**
 *  @swagger
 *   components:
 *    schemas:
 *     URL:
 *      type: object
 *      required:
 *       - url
 *      properties:
 *       id:
 *        type: integer
 *        description: The auto-generated identifier of the URL.
 *        example: 6
 *       url:
 *        type: string
 *        description: The url of the URL object.
 *        example: https://gitlab.com/
 *      example:
 *       id: 6
 *       url: https://gitlab.com/
 */

const express = require('express');

const router = express.Router();

const urlController = require('../controllers/url-controller');

/**
 * @swagger
 * /urls/:
 *  get:
 *   summary: Gets all URLs
 *   tags: [URLs]
 *   responses:
 *    "200":
 *     description: Operation successful, returns list of URLs.
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/URL'
 *    "500":
 *     description: Server could not handle request
 */
router.get('/', urlController.get_urls);

/**
 * @swagger
 * /urls/{id}:
 *  get:
 *   summary: Gets an URL by id
 *   tags: [URLs]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The URL id
 *   responses:
 *    "200":
 *     description: Operation successful, return the URL.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/URL'
 *    "400":
 *     description: Invalid id supplied
 *    "404":
 *     description: URL not found
 *    "500":
 *     description: Server could not handle request
 */
router.get('/:id', urlController.get_urls);

/**
 * @swagger
 * /urls/:
 *  post:
 *   summary: Adds a new URL
 *   tags: [URLs]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - doNotCapture
 *       properties:
 *        url:
 *         type: string
 *         description: URL to be added
 *         example: https://gitlab.com/
 *        doNotCapture:
 *         type: boolean
 *         description: Add this parameter to specificy if a capture should be taken as soon as the URL is added
 *         default: false
 *   responses:
 *    "200":
 *     description: Operation successful, returns id of added URL.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         id:
 *          type: integer
 *          description: Id of added URL.
 *          example: 6
 *    "400":
 *     description: Invalid URL supplied
 *    "500":
 *     description: Server could not handle request
 */
router.post('/', urlController.add_url);

/**
 * @swagger
 * /urls/{id}:
 *  delete:
 *   summary: Deletes an URL by id
 *   tags: [URLs]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The URL id
 *   responses:
 *    "200":
 *     description: Operation successful, returns the deleted URL.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/URL'
 *    "400":
 *     description: Invalid id supplied
 *    "404":
 *     description: URL not found
 *    "500":
 *     description: Server could not handle request
 */
router.delete('/:id', urlController.delete_url);

module.exports = router;
