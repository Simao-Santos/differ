/**
 * @swagger
 *  tags:
 *   name: Gray_Zones
 *   description: API to manage gray zones.
 */

/**
 *  @swagger
 *   components:
 *    schemas:
 *     Object:
 *      type: object
 *      required:
 *       - id
 *       - page_id
 *       - element_selector
 *      properties:
 *       id:
 *        type: integer
 *        description: The auto-generated identifier of the gray zone.
 *        example: 4
 *       page_id:
 *        type: integer
 *        description: The page id of the gray zone.
 *        example: 1
 *       element_selector:
 *        type: string
 *        description: The css selector to be ignored.
 *        example: div#content
 *      example:
 *       id: 4
 *       page_id: 1
 *       element_selector: div#content
 *     Deleted:
 *      type: object
 *      required:
 *       - page_id
 *      properties:
 *       id:
 *        type: integer
 *        description: The identifier of the gray zone that was deleted.
 *        example: 4
 *      example:
 *       id: 4
 *     Insert:
 *      type: object
 *      required:
 *       - page_id
 *       - gray_zone
 *      properties:
 *       page_id:
 *        type: integer
 *        description: The page id of the gray zone.
 *        example: 1
 *       gray_zone:
 *        type: string
 *        description: The css selector to be inserted.
 *        example: div#content
 *      example:
 *       page_id: 1
 *       gray_zone : body
 */

const express = require('express');

const router = express.Router();

const grayZoneController = require('../controllers/grayzone-controller');

/**
 * @swagger
 * /gray_zones/{id}:
 *  get:
 *   summary: Gets all gray zones of a page by its id
 *   tags: [Gray_Zones]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The page id
 *   responses:
 *    "200":
 *     description: Operation successful, return the grayzones from desired page.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Object'
 *    "400":
 *     description: Invalid id format
 *    "500":
 *     description: Server could not handle request
 */
router.get('/:id', grayZoneController.get_gray_zones);

/**
* @swagger
* /gray_zones/:
*  post:
*   summary: Adds grey zones
*   tags: [Gray_Zones]
*   requestBody:
*    required: true
*    content:
*     application/json:
*      schema:
*       $ref: '#/components/schemas/Insert'
*   responses:
*    "200":
*     description: Operation successful
*    "400":
*     description: Invalid request
*    "404":
*     description: Page id is not valid
*    "500":
*     description: Server could not handle request
*/
router.post('/', grayZoneController.insert_gray_zone);

/**
 * @swagger
 * /gray_zones/{id}:
 *  delete:
 *   summary: Deletes a gray zone by its id
 *   tags: [Gray_Zones]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The gray zone id
 *   responses:
 *    "200":
 *     description: Operation successful, returns the deleted gray zone id.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Deleted'
 *    "400":
 *     description: Invalid id supplied
 *    "404":
 *     description: Gray zone id not found
 *    "500":
 *     description: Server could not handle request
 */
router.delete('/:id', grayZoneController.delete_gray_zone);

module.exports = router;
