import React from "react";

interface IERecipients {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

interface RecipientsProps {
  recipients: IERecipients[];
  search: string;
  setSearch: (value:any) => void;
}

function Recipients(props: RecipientsProps) {
  return (
    <div className="recipients__container">
      {props.recipients.map((item) => {
        return (
          <div
            className="recipients__selected-person"
            key={item.user_id}
          >
            <p>{item.username}</p>
            <svg 
              aria-label="Delete Item"  color="rgb(0, 149, 246)" fill="rgb(0, 149, 246)" height="13" width="13" role="img" viewBox="0 0 24 24" >
              <title>Delete Item</title>
              <polyline 
                fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3">
              </polyline>
              <line 
                fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354">
              </line>
            </svg>
          </div>
        );
      })}
      <input
        type="text"
        id="search"
        placeholder="Search..."
        value={props.search}
        onChange={(event) => props.setSearch(event.target.value)}
      />
    </div>
  );
}

export default Recipients;
