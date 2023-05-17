import React, { useState } from "react";

const GridPost = function ({ posts }:any) {
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
            className="profile__post-container"
            key={index}
          >
            {element.map((post: any, idx: number) => {
              return (
                <React.Fragment key={`key_${idx}`}>
                  {post.map((item: any) => {
                    return (
                      <div key={item.post_id}>
                        <img
                          src={item.image_url}
                          className="profile__image-post"
                          alt="user's post"
                        />
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