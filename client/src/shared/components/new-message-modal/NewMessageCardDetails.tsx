import { IUser } from '@/interfaces/interface';
import UserUsername from '../user/UserUsername';
import UserDetails from '../user/UsersFullName';

function NewMessageCardDetails({ user }: { user: IUser }) {
  return (
    <div className="new-message-card-details">
      <UserUsername username={user.username} />
      <UserDetails
        firstName={user.firstName}
        lastName={user.lastName}
      />
    </div>
  );
};

export default NewMessageCardDetails
