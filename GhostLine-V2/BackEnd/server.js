const { server } = require("./app");
const  {config} =require("./config/env");

server.listen(config.PORT, async () => {
    try {
        console.log(`Server running on port ${config.PORT}`);
    } catch (error) {
        console.log(`Error starting server: ${error}`);
    }
});
