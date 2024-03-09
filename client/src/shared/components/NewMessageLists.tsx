import React from 'react'
import NewMessageListsCard from './NewMessageListsCard';
import { useSearchUsersQuery } from 'redux/api/userApi';

type NewMessageListsProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  recipients: any;
  setRecipients: React.Dispatch<React.SetStateAction<any>>;
};

function NewMessageLists({ search, recipients, setRecipients, setSearch  }: NewMessageListsProps) {
  const listsUsersApi = useSearchUsersQuery({ search });
  if(listsUsersApi.isLoading) return null;
  return (
    <div className="new-message__search-list">
      {listsUsersApi?.data?.users?.length ? (
        <React.Fragment>
          {listsUsersApi?.data?.users?.map((user: any, index: any) => (
            <NewMessageListsCard
              key={index}
              user={user}
              recipients={recipients}
              setRecipients={setRecipients}
              setSearch={setSearch}
            />
          ))}
        </React.Fragment>
      ) : (
        <p>No account found.</p>
      )}
    </div>
  );
}

export default NewMessageLists
