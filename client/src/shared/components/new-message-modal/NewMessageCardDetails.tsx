import UserUsername from '../user/UserUsername';
import UserDetails from '../user/UsersFullName';

function NewMessageCardDetails({ user }: any) {
  return (
    <div className="new-message-card-details">
      <UserUsername username={user.username} />
      <UserDetails
        first_name={user.first_name}
        last_name={user.last_name}
      />
    </div>
  );
};

export default NewMessageCardDetails
