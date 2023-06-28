import { Response, Request } from "express";
import database from "../database/database";

const postAllLikes = async (req: Request, res: Response) => {
  const { post_id } = req.params;
  const sql = "SELECT COUNT(*) FROM likes WHERE post_id = (?);";

  database.query(sql, [post_id], (error, data) => {
    if(error) return res.status(500).send({ error });
    res.status(200).send({ count: data[0]["COUNT(*)"] });
  });
};

const likeStatus = async (req: Request, res: Response) => {
  const { post_id, user_id } = req.params;
  const sql = "SELECT * FROM likes WHERE post_id = (?) AND user_id = (?);";

  database.query(sql, [post_id, user_id], (error, data) => {
    if(error) return res.status(500).send({ error });
    if(!data.length) return res.status(200).send({ status: false });
    res.status(200).send({ status: true });
  });
};

const likePost = async (req: Request, res: Response) => {
  const { post_id, user_id } = req.params;
  const sql_get = "SELECT * FROM likes WHERE post_id = (?) AND user_id = (?);";
  const sql_delete = "DELETE FROM likes WHERE post_id = (?) AND user_id = (?);";
  const sql_create = "INSERT INTO likes (`post_id`, `user_id`) VALUES (?, ?);";

  // check to see if the user is already like the post
  database.query(sql_get, [post_id, user_id], (error, data) => {
    if (error) return res.status(500).send({ error });

    // if the user has already liked the post, then delete or remove
    if (data.length) {
      return database.query(sql_delete, [post_id, user_id], (error, data) => {
        if (error) return res.status(500).send({ message: "Delete row from likes table failed", error });
        return res.status(200).send("Remove like from a post");
      });
    }

    // if the user hasn't like the post yet, then create or insert
    database.query(sql_create, [post_id, user_id], (error, data) => {
      if (error)
      return res.status(500).send({ message: "Like post failed", error });
      res.status(200).send("Liked post");
    });
  });
};

export { likePost, postAllLikes, likeStatus };
