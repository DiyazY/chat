import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import styles from "./Group.module.css";
import { getSignalRService } from "../../utils/signalR";
import { IMessage } from "../../models/IMessage";
import { useLocation } from "react-router-dom";

let hub: any = undefined;
let userName = localStorage.getItem("_name") || "";
let groupId: string;

const addMsgBlock = (
  author: string,
  text: string,
  time: string,
  serverInsertion: boolean = false
) => {
  let messagesBox = document.getElementById("messages") as HTMLElement;

  var block = document.createElement("div");
  var msgDiv = document.createElement("div");

  msgDiv.setAttribute(
    "class",
    userName === author
      ? styles.message
      : `${styles.message} ${styles.pullRight}`
  );
  msgDiv.innerHTML = `<span class=${styles.author}>${author} (${
    time && new Date().toLocaleTimeString()
  }):</span> </br>${text}`;
  block.appendChild(msgDiv);
  block.setAttribute("class", styles.messageRow);
  serverInsertion
    ? messagesBox.insertBefore(block, messagesBox.children[1])
    : messagesBox.appendChild(block);

  !serverInsertion &&
    messagesBox.scroll({
      top: messagesBox.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
};

const GroupChat: React.FC = () => {
  const history = useHistory();
  const back = () => history.push("/");
  const page = useRef(1);

  let pathSection = useLocation().pathname.split("/");
  groupId = pathSection[pathSection.length - 1];

  const sendText = () => {
    let el = document.getElementById("text_input") as HTMLInputElement;
    if (!el.value) return;
    hub
      .invoke("SendMessageToGroup", groupId, el.value)
      .catch((err: any) => console.error(err));

    addMsgBlock(userName, el.value, new Date().toLocaleTimeString());

    el.value = "";
  };

  useEffect(() => {
    hub = getSignalRService();
    hub.on(
      "ReceiveChatMessage",
      (message: IMessage) =>
        message.groupId === groupId &&
        addMsgBlock(message.author, message.text, message.time)
    );
    hub.invoke("GetMessagesByGroupId", groupId, page.current);
    return () => {
      hub.off("ReceiveChatMessage");
    };
  }, []);

  const loadMessages = () => {
    page.current++;
    hub.invoke("GetMessagesByGroupId", groupId, page.current);
  };

  useEffect(() => {
    hub.on(`MessagesFrom_${groupId}`, (result: any) => {
      if (result.list.length < 20) {
        let el = document.getElementById("msg-load");
        if (el) el.hidden = true;
      }
      result.list
        //.reverse()
        .forEach((p: IMessage) => addMsgBlock(p.author, p.text, p.time, true));
      let messagesBox = document.getElementById("messages") as HTMLElement;
      page.current === 1 &&
        messagesBox.scroll({
          top: messagesBox.scrollHeight,
          left: 0,
          behavior: "smooth",
        });
    });
    return () => {
      hub.off(`MessagesFrom_${groupId}`);
    };
  }, []);

  return (
    <div>
      <button className="btn" onClick={back}>
        back
      </button>
      <div className={styles.messages} id="messages">
        <button id="msg-load" className="btn" onClick={loadMessages}>
          more...
        </button>
      </div>
      <div className={styles.send}>
        <input className="inpt" id="text_input" type="text"></input>
        <button className="btn" onClick={sendText}>
          send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
