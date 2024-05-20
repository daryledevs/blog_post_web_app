import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { selectMessage, setSearch }       from "@/redux/slices/messageSlice";
import Input                              from "../../element/Input";
import RecipientsPersonList               from "./RecipientsPersonList";

function Recipients() {
  const dispatch = useAppDispatch();
  const message = useAppSelector(selectMessage);
  const search = message.search;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(event.target.value));
  };

  return (
    <label>
      To:
      <div className="recipients">
        <RecipientsPersonList />
        <Input
          id="search"
          type="text"
          value={search}
          placeholder="Search..."
          onChange={handleSearch}
        />
      </div>
    </label>
  );
}

export default Recipients;
