import UserDetails from '../UserComponents/UsersFullName';

function NewMessageCardDetails({ user }: any) {
  return (
    <div className="new-message-card-details">
      <p>{user.username}</p>
      <UserDetails
        first_name={user.first_name}
        last_name={user.last_name}
      />
    </div>
  );
};

export default NewMessageCardDetails
