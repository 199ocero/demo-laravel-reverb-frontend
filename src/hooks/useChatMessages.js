import { useEffect, useState } from "react";
import api from "../api";

export default function useChatMessages(id, page) {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/messages/${id}?page=${page}`)
      .then((response) => {
        const newMessages = response.data.data.data;

        setMessages((previousMessages) => {
          const existingIds = new Set(previousMessages.map((msg) => msg.id));
          const filteredNewMessages = newMessages.filter(
            (msg) => !existingIds.has(msg.id)
          );
          return [...previousMessages, ...filteredNewMessages];
        });

        setHasMore(response.data.data.next_page_url !== null);

        setLoading(false);
      })
      .catch((error) => {
        // Initialize errors as an empty object
        let errors = {};

        if (error.response.status === 422) {
          errors = error.response.data.errors;
        } else {
          errors = { message: error.response.data.message };
        }

        setErrors(errors);
      });
  }, [id, page]);

  const addMessage = (message) => {
    setMessages((previousMessages) => {
      const existingIds = new Set(previousMessages.map((msg) => msg.id));

      // Only add the message if its ID is not already in the existingIds set
      if (!existingIds.has(message.id)) {
        return [message, ...previousMessages];
      }

      // Return previousMessages if the message is a duplicate
      return previousMessages;
    });
  };

  return { loading, errors, messages, hasMore, addMessage };
}
