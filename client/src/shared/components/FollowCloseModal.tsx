import { useNavigate } from 'react-router';
import closeIcon from "../../assets/icons/x_icon.png";

function FollowCloseModal() {
  const navigate = useNavigate();
  return (
    <img
      alt=""
      onClick={() => navigate(-1)}
      src={closeIcon}
      width={29}
    />
  );
}

export default FollowCloseModal
