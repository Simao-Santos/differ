/**
 * @swagger
 *  tags:
 *   name: Comparisons
 *   description: API to manage comparisons.
 */

/**
 *  @swagger
 *   components:
 *    schemas:
 *     Comparison:
 *      type: object
 *      required:
 *       - capture_1_id
 *       - capture_2_id
 *       - text_location
 *       - image_location
 *       - diff_pixels
 *       - total_pixels
 *       - date
 *      properties:
 *       id:
 *        type: integer
 *        description: The auto-generated identifier of the comparisons.
 *        example: 4
 *       capture_1_id:
 *        type: integer
 *        description: The identifier of the older capture.
 *        example: 8
 *       capture_2_id:
 *        type: integer
 *        description: The identifier of the newer capture.
 *        example: 9
 *       text_location:
 *        type: string
 *        description: The location of the content text comparison of the comparison object.
 *        example: /shots/comparison_45_44_2020_11_25_22_23_46_521.json
 *       image_location:
 *        type: string
 *        description: The location of the screenshot comparison of the comparison object.
 *        example: /shots/comparison_45_44_2020_11_25_22_23_46_521.png
 *       diff_pixels:
 *        type: integer
 *        description: Number of different pixels between the screenshots.
 *        example: 860836
 *       total_pixels:
 *        type: integer
 *        description: Total number of pixels in each screenshot.
 *        example: 19217280
 *       date:
 *        type: string
 *        description: When the comparison was made.
 *        example: 2020-11-25T22:23:46.521Z
 *      example:
 *       id: 4
 *       capture_1_id: 8
 *       capture_2_id: 9
 *       text_location: /shots/comparison_45_44_2020_11_25_22_23_46_521.json
 *       image_location: /shots/comparison_45_44_2020_11_25_22_23_46_521.png
 *       diff_pixels: 860836
 *       total_pixels: 19217280
 *       date: 2020-11-25T22:23:46.521Z
 */

const express = require('express');

const router = express.Router();

const comparisonController = require('../controllers/comparison-controller');

/**
 * @swagger
 * /comparisons/:
 *  get:
 *   summary: Gets all comparisons
 *   tags: [Comparisons]
 *   responses:
 *    "200":
 *     description: Operation successful, returns list of comparisons.
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Comparison'
 *    "500":
 *     description: Server could not handle request
 */
router.get('/', comparisonController.get_comparisons);

/**
 * @swagger
 * /comparisons/byPageId/{id}:
 *  get:
 *   summary: Gets comparisons by page id
 *   tags: [Comparisons]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The page id
 *   responses:
 *    "200":
 *     description: Operation successful, return list of comparisons with specified page id.
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Comparison'
 *    "400":
 *     description: Invalid id supplied
 *    "500":
 *     description: Server could not handle request
 */
router.get('/byPageId/:id', comparisonController.get_comparisons_by_page_id);

/**
 * @swagger
 * /comparisons/range/{offset}/{amount}:
 *  get:
 *   summary: Gets list of comparisons bundled with capture and page information
 *   tags: [Comparisons]
 *   parameters:
 *    - in: path
 *      name: offset
 *      schema:
 *       type: integer
 *      required: true
 *      description: Offset of the first comparison in the list
 *    - in: path
 *      name: amount
 *      schema:
 *       type: integer
 *      required: true
 *      description: Amount of comparisons to return
 *   responses:
 *    "200":
 *     description: Operation successful, returns the list of bundled comparisons.
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          date:
 *           type: string
 *           example: 2020-12-03T00:31:32.328Z
 *          comp_id:
 *           type: integer
 *           example: 2
 *          page_id:
 *           type: integer
 *           example: 1
 *          url:
 *           type: string
 *           example: https://www.google.com/
 *          comp_text_location:
 *           type: string
 *           example: /shots/comparison_2_1_2020_12_03_00_31_36_978.json
 *          comp_image_location:
 *           type: string
 *           example: /shots/comparison_2_1_2020_12_03_00_31_36_978.png
 *          capt_image_location:
 *           type: string
 *           example: /shots/url_1_2020_12_03_00_31_22_670.png
 *          comp_capt_id_1:
 *           type: integer
 *           example: 2
 *          comp_capt_id_2:
 *           type: integer
 *           example: 1
 *    "400":
 *     description: Invalid parameters supplied
 *    "500":
 *     description: Server could not handle request
 */
router.get('/range/:offset/:amount', comparisonController.get_comparison_range);

/**
 * @swagger
 * /comparisons/{id}:
 *  get:
 *   summary: Gets a comparison by id
 *   tags: [Comparisons]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The comparison id
 *   responses:
 *    "200":
 *     description: Operation successful, return the comparison.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Comparison'
 *    "400":
 *     description: Invalid id supplied
 *    "404":
 *     description: Comparison not found
 *    "500":
 *     description: Server could not handle request
 */
router.get('/:id', comparisonController.get_comparisons);

/**
 * @swagger
 * /comparisons/{id}:
 *  delete:
 *   summary: Deletes a comparison by id
 *   tags: [Comparisons]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The comparison id
 *   responses:
 *    "200":
 *     description: Operation successful, returns the deleted comparison.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Comparison'
 *    "400":
 *     description: Invalid id supplied
 *    "404":
 *     description: Comparison not found
 *    "500":
 *     description: Server could not handle request
 */
router.delete('/:id', comparisonController.delete_comparisons);

module.exports = router;
