import React, { useEffect, useState } from "react";
import { initSignalRService } from "../../utils/signalR";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Groups from "../Groups";
import GroupChat from "../Group/GroupChat";

export interface GroupsProps {
  userName: string;
}

const Chat: React.FC<GroupsProps> = ({ userName }) => {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    initSignalRService(userName).then((isConnected) =>
      setIsConnected(isConnected)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isConnected) return <p>Connecting...</p>;

  return (
    <div style={{ width: "80vw", paddingTop: "2vh" }}>
      <Router>
        <Switch>
          <Route exact path="/" component={Groups} />
          <Route path="/group/:id" component={GroupChat} />
        </Switch>
      </Router>
    </div>
  );
};

export default Chat;
