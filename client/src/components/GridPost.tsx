import React, { useEffect } from "react";
import heart from "../assets/icons/white-heart.png";

const GridPost = function ({ posts, hover, setHover }: any) {
  let organizedPost: any[][] = [];

  for (let i = 0; i < posts.post.length; i++) {
    if (i % 2 === 0) {
      const value = posts.post.slice(i === 0 ? i : i + 1, i + 3);
      organizedPost.push([value]);
    }
  }

  return (
    <React.Fragment>
      {organizedPost.map((element: any, index: number) => {
        return (
          <div
            className="grid-post__container"
            key={index}
          >
            {element.map((post: any, idx: number) => {
              return (
                <React.Fragment key={`key_${idx}`}>
                  {post.map((item: any) => {
                    return (
                      <div
                        role="button"
                        key={item.post_id}
                        className="grid-post__card"
                        onMouseEnter={() => setHover({ post_id: item.post_id })}
                        onMouseLeave={() => setHover({ post_id: null })}
                      >
                        {hover.post_id !== item.post_id ? (
                          <img
                            src={item.image_url}
                            className="grid-post__image"
                            alt="user's post"
                          />
                        ) : (
                          <div className="grid-post__image-hover">
                            <img
                              src={item.image_url}
                              className="grid-post__image"
                              alt="user's post"
                            />

                            <div className="grid-post__image-hover-details">
                              <img src={heart} alt="" />
                              <p>{item.count}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default GridPost;