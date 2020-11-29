/**
 * @swagger
 *  tags:
 *   name: Actions
 *   description: API to perform actions with the data.
 */

const express = require('express');

const router = express.Router();

const actionsController = require('../controllers/actions-controller');

/**
 * @swagger
 * /actions/capture/{id}:
 *  get:
 *   summary: Takes a capture of the URL with the specified id
 *   tags: [Actions]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The URL id
 *   responses:
 *    "200":
 *     description: Operation successful, capture has started.
 *    "400":
 *     description: Invalid id supplied
 *    "404":
 *     description: URL not found
 *    "500":
 *     description: Server could not handle request
 */
router.get('/capture/:id', actionsController.capture_url);

/**
 * @swagger
 * /actions/compare/{id}:
 *  get:
 *   summary: Compares the latest capture of the URL with the specified id with its current state
 *   tags: [Actions]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *      required: true
 *      description: The URL id
 *   responses:
 *    "200":
 *     description: Operation successful, comparison has started.
 *    "400":
 *     description: Invalid id supplied
 *    "404":
 *     description: URL not found
 *    "412":
 *     description: There is no older capture to compare with.
 *    "500":
 *     description: Server could not handle request
 */
router.get('/compare/:id', actionsController.compare_url);

module.exports = router;
