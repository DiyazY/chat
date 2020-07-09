import React, { useEffect, useState, useRef } from "react";
import { getSignalRService } from "../../utils/signalR";
import { IGroup } from "../../models/IGroup";
import Group from "../Group";

let hub: any = undefined;

let userName: string;

const NotMembershipGroups: React.FC = () => {
  const [groups, setGroups] = useState<IGroup[]>([]);

  const page = useRef(1);

  const LeaveGroup = (id: string) => {
    setGroups(
      groups.map((p: IGroup) => {
        if (p.id === id) {
          return {
            ...p,
            members: p.members.filter((m) => m !== userName),
          };
        }
        return p;
      })
    );
    hub.invoke("LeaveGroup", id).catch((err: any) => console.error(err));
  };

  const joinGroup = (id: string) => {
    setGroups(
      groups.map((p: IGroup) => {
        if (p.id === id) {
          return {
            ...p,
            members: [...p.members, userName],
          };
        }
        return p;
      })
    );
    hub.invoke("JoinGroup", id).catch((err: any) => console.error(err));
  };

  useEffect(() => {
    hub = getSignalRService();
    hub
      .invoke("GetGroups", page.current)
      .catch((err: any) => console.error(err));
    userName = localStorage.getItem("_name") || "";
  }, []);

  useEffect(() => {
    hub.on("ReceiveNotOwnGroups", (result: any) =>
      setGroups([
        ...groups,
        ...result.list.map(
          (p: any) =>
            ({
              id: p.id,
              name: p.name,
              members: p.members.value,
            } as IGroup)
        ),
      ])
    );
    return () => {
        hub.off("ReceiveNotOwnGroups");
      };
  }, [groups]);

  const loadGroups = () => {
    page.current++;
    hub
      .invoke("GetGroups", page.current)
      .catch((err: any) => console.error(err));
  };

  return (
    <>
      {groups.map((group) => (
        <Group
          key={`_${group.id}`}
          group={group}
          LeaveGroup={LeaveGroup}
          joinGroup={joinGroup}
          userName={userName}
        />
      ))}
      {groups.length === page.current * 20 && (
        <div style={{ margin: "1vh" }}>
          <button onClick={loadGroups} className="btn">
            more...
          </button>
        </div>
      )}
    </>
  );
};

export default NotMembershipGroups;
