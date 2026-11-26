const appEvents = require("./appEvents");

appEvents.on("userRegistered", (user) => {
  console.log(`[event] New user registered: ${user.username} (${user.email})`);
});

appEvents.on("userLoggedIn", (user) => {
  console.log(`[event] User logged in: ${user.email}`);
});

appEvents.on("noteCreated", (note) => {
  console.log(`[event] Note created: "${note.title}" by user ${note.owner}`);
});

appEvents.on("chatMessage", (data) => {
  console.log(`[event] Chat message in ${data.room} from ${data.username}`);
});
