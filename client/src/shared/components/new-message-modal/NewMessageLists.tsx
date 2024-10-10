import React from "react";
import NewMessageCard from "./NewMessageCard";
import { useSearchUsersQuery } from "@/redux/api/userApi";
import { IUser } from "@/interfaces/interface";
import { selectMessage } from "@/redux/slices/messageSlice";
import { useAppSelector } from "@/hooks/reduxHooks";

function NewMessageLists() {
  const message = useAppSelector(selectMessage);
  const search = message.search;

  const listsUsersApi = useSearchUsersQuery({ search }, { skip: !search });

  if (listsUsersApi.isLoading) return null;

  return (
    <div className="new-message-search-list">
      {listsUsersApi?.data?.users?.length ? (
        <React.Fragment>
          {listsUsersApi?.data?.users?.map((user: IUser, index: any) => (
            <NewMessageCard
              key={index}
              user={user}
            />
          ))}
        </React.Fragment>
      ) : (
        <p>No account found.</p>
      )}
    </div>
  );
}

export default NewMessageLists;
