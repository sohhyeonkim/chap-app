import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      setCurrentMessage("");
    });
  }, [socket]);
  return (
    <div>
      <div>
        <p>Live Chat</p>
      </div>
      <div>
        <ScrollToBottom>
          {messageList.map((messsageContent) => {
            return (
              <div
                className="message"
                id={username === messsageContent.author ? "you" : "other"}
              >
                <div>
                  <div>
                    <p>{messsageContent.message}</p>
                  </div>
                  <div>
                    <p id="time">{messsageContent.time}</p>
                    <p id="author">{messsageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div>
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
