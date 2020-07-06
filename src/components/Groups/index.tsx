import React, { useEffect, useState } from "react";
import { initSignalRService } from "../../utils/signalR";
import MembershipGroups from "../MembershipGroups";

export interface GroupsProps {
  userName: string;
}

const Groups: React.FC<GroupsProps> = ({ userName }) => {
  

  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    initSignalRService(userName).then((isConnected) =>
      setIsConnected(isConnected)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isConnected) return <p>Connecting...</p>;

  return (
    <>
      

      <MembershipGroups userName={userName} />
    </>
  );
};

export default Groups;
