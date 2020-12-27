/**
 * @swagger
 *  tags:
 *   name: Gray Zones
 *   description: API to manage gray zones.
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

const grayZoneController = require('../controllers/grayzone-controller');

/**
 * @swagger
 * /gray_zones/{id}:
 *  get:
 *   summary: Gets all gray zones of a page by its id
 *   tags: [Gray Zones]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The URL id
 *   responses:
 *    "200":
 *     description: Operation successful, return the grayzones.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/URL'
 *    "400":
 *     description: Invalid id supplied
 *    "500":
 *     description: Server could not handle request
 */
router.get('/:id', grayZoneController.get_gray_zones);

/**
* @swagger
* /gray_zones/:
*  post:
*   summary: Adds grey zones
*   tags: [Gray Zones]
*   requestBody:
*    required: true
*    content:
*     application/json:
*      schema:
*       type: object
*       required:
*        - zones
*       properties:
*        zones:
*         type: JSON
*         description: grey zones to be added
*         example: {page_id: 1 , gray_zone: "body"}
*   responses:
*    "200":
*     description: Operation successful.
*    "400":
*     description: Invalid request
*    "500":
*     description: Server could not handle request
*/
router.post('/', grayZoneController.insert_gray_zone);

/**
 * @swagger
 * /gray_zones/{id}:
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
router.delete('/:id', grayZoneController.delete_gray_zone);

module.exports = router;
