import Input                from "../../elements/Input";
import RecipientsPersonList from "./RecipientsPersonList";

interface IERecipients {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

interface RecipientsProps {
  search: string;
  recipients: IERecipients[];
  setSearch: (value: any) => void;
  setRecipients: (value: any) => void;
}

function Recipients({
  search,
  setSearch,
  recipients,
  setRecipients,
}: RecipientsProps) {
  return (
    <label>
      To:
      <div className="recipients__container">
        <RecipientsPersonList
          recipients={recipients}
          setRecipients={setRecipients}
        />
        <Input
          id="search"
          type="text"
          value={search}
          placeholder="Search..."
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
    </label>
  );
}

export default Recipients;
