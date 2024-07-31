import { useContext, useEffect, useRef, useState, useCallback } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import UserMessage from "../components/UserMessage";
import echo from "../echo";
import { AppContext } from "../Context/AppContext";
import useChatMessages from "../hooks/useChatMessages";

export default function Chat() {
  const { user: currentUser } = useContext(AppContext);

  const [page, setPage] = useState(1);

  const { userId } = useParams();

  const [formData, setFormData] = useState({
    receiver_id: userId,
    message: "",
  });

  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const response = await api.get("/api/user/" + userId);
      setUser(response.data.data);
    };

    fetchUser();
  }, []);

  const {
    loading,
    errors: messageErrors,
    messages,
    hasMore,
    addMessage,
  } = useChatMessages(userId, page);

  useEffect(() => {
    if (currentUser) {
      echo.private(`filachat.${currentUser.id}`).listen("MessageSent", (e) => {
        const receiverId = parseInt(e.message.receiver_id);
        const senderId = parseInt(e.sender.id);
        const currentUserId = parseInt(currentUser.id);

        if (receiverId === currentUserId && senderId === parseInt(userId)) {
          addMessage(e.message);
        }
      });
    }
  }, [currentUser, addMessage, userId]);

  async function handleSendMessage(e) {
    e.preventDefault();
    try {
      const response = await api.post("/api/message", formData);

      if (response.status === 201) {
        const newMessage = response.data.data;
        addMessage(newMessage);
        setFormData({ ...formData, message: "" });
      }
    } catch (error) {
      // Initialize errors as an empty object
      let errors = {};

      if (error.response.status === 422) {
        errors = error.response.data.errors;
      } else {
        errors = { message: [error.response.data.message] };
      }

      setErrors(errors);
    }
  }

  const observer = useRef();

  const lastMessageElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <h1>
        Say Hi to{" "}
        <span className="font-bold text-blue-700 dark:text-blue-400">
          {user.name}!
        </span>
      </h1>
      <div className="flex flex-col justify-between p-5 mt-5 space-y-5 bg-white border border-gray-300 rounded-lg dark:bg-gray-900 chat-height dark:border-gray-700">
        {loading && <p>Loading...</p>}
        {messageErrors && (
          <div>
            {Object.keys(messageErrors).map((key) => (
              <p key={key}>{messageErrors[key]}</p>
            ))}
          </div>
        )}
        <div className="flex flex-col-reverse h-full gap-3 overflow-y-auto hide-scrollbar">
          {messages.map((message, index) => {
            if (index === messages.length - 1) {
              return (
                <UserMessage
                  ref={lastMessageElementRef}
                  key={message.id}
                  message={message}
                  currentUser={currentUser}
                ></UserMessage>
              );
            } else {
              return (
                <UserMessage
                  message={message}
                  currentUser={currentUser}
                  key={message.id}
                ></UserMessage>
              );
            }
          })}
        </div>

        <div className="w-full">
          <form onSubmit={handleSendMessage}>
            <div className="w-full mb-1 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="p-2 bg-white rounded-t-lg dark:bg-gray-800">
                <input
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  id="message"
                  rows="4"
                  className="input-field"
                  placeholder="Type your message..."
                ></input>
                {errors?.message && (
                  <p className="truncate input-field-error">
                    {errors.message[0]}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end px-3 py-2 border-t dark:border-gray-600">
                <button
                  type="submit"
                  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                >
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
