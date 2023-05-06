import avatar from "../../assets/icons/avatar.png";
import x_icon from "../../assets/icons/x_icon.png";

function FollowModal({ list, name, close }: any) {

  return (
    <div className="follow-modal__container">
      <div className="follow-modal__parent">
        <div className="follow-modal__title">
           <p>{name}</p>
           <img onClick={close} src={x_icon} width={29} />
        </div>
        <div className="follow-modal__list-container">
          {list.map((item:any, index:number) => {
            return (
              <div className="item-card" key={index}>
                <img src={item.avatar_url ? item.avatar_url : avatar} className="item-card__avatar" />
                <div>
                  <p>{item.username}</p>
                  <p>{item.first_name} {item.last_name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FollowModal;