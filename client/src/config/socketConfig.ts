const token = sessionStorage.getItem("token");

const socketConfig = {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
  withCredentials: true,
  extraHeaders: {
    Authorization: `Bearer ${token}`,
  },
};

export default socketConfig;
