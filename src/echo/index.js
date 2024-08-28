import axios from "axios";
import Cookies from "js-cookie";
import Echo from "laravel-echo";

import Pusher from "pusher-js";
window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        const accessToken = Cookies.get("access_token");

        axios
          .post(
            `${import.meta.env.VITE_API_URL}/api/broadcasting/auth`,
            {
              socket_id: socketId,
              channel_name: channel.name,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then((response) => {
            callback(false, response.data);
          })
          .catch((error) => {
            callback(true, error);
          });
      },
    };
  },
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: "http",
  enabledTransports: ["ws"],
});

export default echo;
