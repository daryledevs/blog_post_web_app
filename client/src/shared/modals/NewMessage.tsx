import React, { useState, useEffect } from "react";
import api from "../../config/api";
import avatar from "../../assets/icons/avatar.png";
import closeModal from "../../assets/icons/close.png";
import Recipients from "../components/Recipients";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { checkAccess } from "../../redux/action/auth";
import { IEOpenConversation } from "../../interfaces/interface";

interface IENewMessage {
  newMessageTrgger: boolean;
  setNewMessageTrgger: (value: any) => void;
  setOpenConversation: (value: IEOpenConversation) => void;
};

function NewMessage({ newMessageTrgger, setNewMessageTrgger, setOpenConversation }: IENewMessage) {
  const dispatch = useAppDispatch();
  const [recipient, setRecipient] = useState<any>([]);
  const [search, setSearch] = useState<string>("");
  const [list, setList] = useState<any>({ people: [] });

  useEffect(() => {
    async function searchApi() {
      try {
        const response = await api.get(`/users/search/${search}`);
        if(response.data.accessToken) return response;
        setList({ people: response.data.people });
      } catch (error) {
        console.log(error);
      }
    }

    dispatch(checkAccess({ apiRequest: searchApi }));
  }, [dispatch, search]);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (newMessageTrgger && event.code === "Escape") {
        setNewMessageTrgger(!newMessageTrgger);
      }  
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [newMessageTrgger, setNewMessageTrgger]);

  function newMessageHandler(person: any) {
    if (recipient.some((item: any) => item.user_id === person.user_id)) return;
    let newArr = [...recipient];
    newArr.push(person);
    setRecipient([...newArr]);
    setSearch("");
  };

  function newChatHandler() {
    setOpenConversation(recipient);
    setNewMessageTrgger(!newMessageTrgger);
  }

  if(!newMessageTrgger) return <></>;

  return (
    <div className="new-message__container">
      <div className="new-message__parent">
        <div className="new-message__header">
          <p>New message</p>
          <img
            src={closeModal}
            onClick={() => setNewMessageTrgger(!newMessageTrgger)}
            alt=""
          />
        </div>
        <div className="new-message__search-bar">
          <label htmlFor="search">
            To:
            <Recipients
              search={search}
              setSearch={setSearch}
              recipients={recipient}
              setRecipient={setRecipient}
            />
          </label>
        </div>
        <div className="new-message__search-list">
          {list.people && list.people.length ? (
            <>
              {list.people.map((person: any, index: any) => {
                return (
                  <div
                    key={index}
                    className="new-message__person"
                    onClick={() => newMessageHandler(person)}
                  >
                    <div className="new-message__avatar">
                      <img
                        src={person.avatar_url ? person.avatar_url : avatar}
                        alt=""
                      />
                    </div>
                    <div className="new-message__person-details">
                      <p>{person.username}</p>
                      <p>
                        {person?.first_name} {person?.last_name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p>No account found.</p>
          )}
        </div>
        <button
          disabled={!recipient.length}
          onClick={newChatHandler}
        >
          Chat
        </button>
      </div>
    </div>
  );
}

export default NewMessage;
