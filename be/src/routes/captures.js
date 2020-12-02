/**
 * @swagger
 *  tags:
 *   name: Captures
 *   description: API to manage captures.
 */

/**
 *  @swagger
 *   components:
 *    schemas:
 *     Capture:
 *      type: object
 *      required:
 *       - image_location
 *       - text_location
 *       - date
 *      properties:
 *       id:
 *        type: integer
 *        description: The auto-generated identifier of the capture.
 *        example: 4
 *       image_location:
 *        type: string
 *        description: The location of the image of the capture object.
 *        example: /shots/url_2_2020_11_25_21_39_15_778.png
 *       text_location:
 *        type: string
 *        description: The location of the content of the capture object.
 *        example: /shots/url_2_2020_11_25_21_39_15_778.html
 *       date:
 *        type: string
 *        description: When the capture was taken.
 *        example: 2020-11-25T21:39:15.778Z
 *      example:
 *       id: 4
 *       image_location: /shots/url_2_2020_11_25_21_39_15_778.png
 *       text_location: /shots/url_2_2020_11_25_21_39_15_778.html
 *       date: 2020-11-25T21:39:15.778Z
 */

const express = require('express');

const router = express.Router();

const captureController = require('../controllers/capture-controller');

/**
 * @swagger
 * /captures/:
 *  get:
 *   summary: Gets all captures
 *   tags: [Captures]
 *   responses:
 *    "200":
 *     description: Operation successful, returns list of captures.
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Capture'
 *    "500":
 *     description: Server could not handle request
 */
router.get('/', captureController.get_captures);

/**
 * @swagger
 * /captures/byPageId/{id}:
 *  get:
 *   summary: Gets captures by page id
 *   tags: [Captures]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The page id
 *   responses:
 *    "200":
 *     description: Operation successful, return list of captures with specified page id.
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Capture'
 *    "400":
 *     description: Invalid id supplied
 *    "500":
 *     description: Server could not handle request
 */
router.get('/byPageId/:id', captureController.get_captures_by_page_id);

/**
 * @swagger
 * /captures/{id}:
 *  get:
 *   summary: Gets a capture by id
 *   tags: [Captures]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The capture id
 *   responses:
 *    "200":
 *     description: Operation successful, return the capture.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Capture'
 *    "400":
 *     description: Invalid id supplied
 *    "404":
 *     description: Capture not found
 *    "500":
 *     description: Server could not handle request
 */
router.get('/:id', captureController.get_captures);

/**
 * @swagger
 * /captures/{id}:
 *  delete:
 *   summary: Deletes a capture by id
 *   tags: [Captures]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The capture id
 *   responses:
 *    "200":
 *     description: Operation successful, returns the deleted capture.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Capture'
 *    "400":
 *     description: Invalid id supplied
 *    "404":
 *     description: Capture not found
 *    "500":
 *     description: Server could not handle request
 */
router.delete('/:id', captureController.delete_captures);

router.get('/count', captureController.get_count);
router.get('/:id/:offset', captureController.get_captures_range);

module.exports = router;
