import { forwardRef } from "react";
import PropTypes from "prop-types";

const UserMessage = forwardRef(({ message, currentUser }, ref) => {
  return currentUser.id === message.sender_id ? (
    <div className="inline-flex justify-end" ref={ref}>
      <p className="p-2 text-white bg-blue-600 rounded-lg dark:bg-blue-500">
        {message.message}
      </p>
    </div>
  ) : (
    <div className="inline-flex justify-start" ref={ref}>
      <p className="p-2 bg-gray-200 rounded-lg dark:bg-gray-800">
        {message.message}
      </p>
    </div>
  );
});

UserMessage.displayName = "UserMessage";

UserMessage.propTypes = {
  message: PropTypes.shape({
    sender_id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default UserMessage;
