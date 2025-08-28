import http from "http";
import app from "./app";

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

export default server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ✅ ${PORT}`);
});