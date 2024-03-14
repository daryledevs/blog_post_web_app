import db from "../database/query";
import { NextFunction, Request, Response } from "express";

const getTotalFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.body;
    const sql = `
      SELECT 
        COUNT(*)
      FROM
        POSTS
      WHERE
        POST_DATE > DATE_SUB(CURDATE(), INTERVAL 3 DAY)
      ORDER BY RAND() LIMIT 3;
    `;
    const [data] = await db(sql, [user_id]);
    res.status(200).send({ count: data["COUNT(*)"] });
  } catch (error) {
    next(error)
  };
};

const getUserFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_ids, user_id } = req.body;
    const values = post_ids.length ? post_ids : 0;
    const sql = `
      SELECT 
        F.FOLLOWED_ID, 
        F.FOLLOWER_ID, 
        P.*, 
        (SELECT 
          COUNT(*)
        FROM
          LIKES L
        WHERE
          P.POST_ID = L.POST_ID
        ) AS "COUNT"
      FROM
        FOLLOWERS F
      INNER JOIN
        POSTS P ON P.USER_ID = F.FOLLOWED_ID
      WHERE
        F.FOLLOWER_ID = (?) AND 
        P.POST_DATE > DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND
        POST_ID NOT IN (?) 
      ORDER BY RAND() LIMIT 3;
    `;
    const data = await db(sql, [user_id, values]);
    res.status(200).send({ feed: data });
  } catch (error) {
    next(error)
  };
};

const getExploreFeed = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.params;

  try {
    const sqlSelect = `
      SELECT 
        P.*,
        U.USERNAME,
        U.FIRST_NAME,
        U.LAST_NAME,
        (SELECT 
            COUNT(*)
          FROM
            LIKES L
          WHERE
            P.POST_ID = L.POST_ID AND 
            P.USER_ID = L.USER_ID
        ) AS COUNT
      FROM
        POSTS P
      INNER JOIN USERS U 
        ON P.USER_ID = U.USER_ID
      WHERE
        P.POST_DATE >= DATE_SUB(CURDATE(), INTERVAL 3 DAY) AND P.USER_ID != (?);
    `;

    const data = await db(sqlSelect, [user_id]);
    res.status(200).send({ feed: data });
  } catch (error) {
    next(error)
  };
};

export { getTotalFeed, getUserFeed, getExploreFeed };