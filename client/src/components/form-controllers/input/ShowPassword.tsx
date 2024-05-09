export type ShowPasswordProps = {
  title: string;
  value: any;
  isVisible: boolean;
  onClick: () => void;
};

function ShowPassword({ title, value, isVisible, onClick }: ShowPasswordProps) {
  if (!value) return null;
  if (title !== "password") return null;
  return (
    <span
      className="show-password"
      onClick={onClick}
    >
      {isVisible ? "Hide" : "Show"}
    </span>
  );
}

export default ShowPassword;
