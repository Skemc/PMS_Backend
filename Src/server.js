import http from "http";
import app from "./app";

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ✅ ${PORT}`);
});

export default server;
