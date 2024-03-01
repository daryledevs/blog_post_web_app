import { useState, useEffect } from "react";
import avatar from "../../assets/icons/avatar.png";
import closeModal from "../../assets/icons/close.png";
import Recipients from "../components/Recipients";
import { selectMessage, setNewMessageTrigger, setOpenConversation } from "../../redux/slices/messageSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";


function NewMessage() {
  const messages = useAppSelector(selectMessage);
  const dispatch = useAppDispatch();

  const [recipient, setRecipient] = useState<any>([]);
  const [search, setSearch] = useState<string>("");
  const [list, setList] = useState<any>({ people: [] });


  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (messages.newMessageTrigger && event.code === "Escape") {
        dispatch(setNewMessageTrigger());
      }  
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [messages.newMessageTrigger]);

  function newMessageHandler(person: any) {
    if (recipient.some((item: any) => item.user_id === person.user_id)) return;
    let newArr = [...recipient];
    newArr.push(person);
    setRecipient([...newArr]);
    setSearch("");
  };

  function newChatHandler() {
    dispatch(setOpenConversation(recipient));
    dispatch(setNewMessageTrigger());
  }

  if (!messages.newMessageTrigger) return <></>;

  return (
    <div className="new-message__container">
      <div className="new-message__parent">
        <div className="new-message__header">
          <p>New message</p>
          <img
            src={closeModal}
            onClick={() => dispatch(setNewMessageTrigger())}
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
