const http = require("http");
const PORT = 3000;

const server = http.createServer((req, res) => {
	res.write("Hey there, This is Harsh, on the way to be a full stack dev.");
	res.end();
})

server.listen(PORT);
console.log(`Server is running at port ${PORT}`);
