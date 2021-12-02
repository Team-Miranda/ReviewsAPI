# ReviewsAPI

Custom API to serve product reviews and ratings to an existing e-commerce client.

## Technologies

- Server: Node, Express
- DBMS: PostgreSQL
- Deployment: AWS (EC2 - Ubuntu 20.04)
- Dev Testing: Artillery
- Production Testing: Loader.io

## Installation

Install [PostgreSQL](https://www.postgresql.org/docs/9.3/tutorial-createdb.html)

```
$ git clone https://github.com/Team-Miranda/ReviewsAPI.git
```

Install dependencies with `npm`

```
$ npm install
$ npm start
```

## API Reference

### List Reviews

> Returns a list of reviews for a specific product. _Does not includes reported reviews_

`GET /reviews`

Query Parameters

| Parameter  | Type    | Description                                                                         |
| :--------- | :------ | :---------------------------------------------------------------------------------- |
| page       | integer | Selects the page of results to return. Default 1.                                   |
| count      | integer | Specifies how many results per page to return. Default 5.                           |
| sort       | text    | Changes the sort order of reviews to be based on "newest", "helpful", or "relevant" |
| product_id | integer | `REQUIRED` Specifies the product for which to retrieve reviews.                     |

Response:
`Status: 200 OK`

---

### Get Review Metadata

> Returns review metadata for a given product.

`GET /reviews/meta`

Query Parameters

| Parameter  | Type    | Description                                                    |
| :--------- | :------ | :------------------------------------------------------------- |
| product_id | integer | `REQUIRED` ID of the product for which data should be returned |

Response:
`Status: 200 OK`

---

### Add a Review

> Adds a review for the given product.

`POST /reviews`

Body Parameters

| Parameter       | Type    | Description                                                                                                                               |
| :-------------- | :------ | :---------------------------------------------------------------------------------------------------------------------------------------- |
| product_id      | integer | `REQUIRED` ID of the product to post the review for                                                                                       |
| rating          | int     | Integer (1-5) indicating the review rating                                                                                                |
| summary         | text    | Summary text of the review                                                                                                                |
| body            | text    | Continued or full text of the review                                                                                                      |
| recommend       | boolean | Value indicating if the reviewer recommends the product                                                                                   |
| name            | text    | Username for question asker                                                                                                               |
| email           | text    | Email address for question asker                                                                                                          |
| photos          | [text]  | Array of text urls that link to images to be shown                                                                                        |
| characteristics | object  | Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...} |

Response:
`Status: 201 CREATED`

---

### Mark Review as Helpful

> Updates a review to show it was found helpful.

`PUT /reviews/:review_id/helpful`

Parameters

| Parameter | Type    | Description                           |
| :-------- | :------ | :------------------------------------ |
| reveiw_id | integer | `REQUIRED` ID of the review to update |

Response:
`Status: 204 NO CONTENT`

---

### Report Review

> Updates a review to show it was reported. _Note, this action does not delete the review, but the review will not be returned in the above GET request._

`PUT /reviews/:review_id/report`

Parameters

| Parameter | Type    | Description                           |
| :-------- | :------ | :------------------------------------ |
| review_id | integer | `REQUIRED` ID of the review to update |

Response:
`Status: 204 NO CONTENT`

---

## Author

[Kim Honrada](https://github.com/kimhonrada)
