import React, { useEffect, useState } from "react";
import { getSignalRService } from "../../utils/signalR";
import { IGroup } from "../../models/IGroup";
import Group from "../Group";
import { v4 as uuidv4 } from "uuid";

let hub: any = undefined;

let userName:string;

const MembershipGroups: React.FC = () => {
  const addGroup = () => {
    let el = document.getElementById("new-group-name") as HTMLInputElement;
    let name = el.value || "";
    let id = uuidv4();

    hub.invoke("CreateGroup", id, name).catch((err: any) => console.error(err));

    setGroups([
      ...groups,
      {
        id,
        name,
        members: [userName],
      },
    ]);
    el.value = "";
  };

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

  const [groups, setGroups] = useState<IGroup[]>([]);

  useEffect(() => {
    hub = getSignalRService();
    hub.invoke("GetOwnGroups").catch((err: any) => console.error(err));
    hub.on("ReceiveOwnGroups", (result: any) =>
      setGroups(
        result.list.map(
          (p: any) =>
            ({
              id: p.id,
              name: p.name,
              members: p.members.value,
            } as IGroup)
        )
      )
    );
    userName = localStorage.getItem("_name") || "";
    return () => {
      hub.off("ReceiveOwnGroups");
    };
  }, []);

  return (
    <>
      <div>
        <input
          type="text"
          id="new-group-name"
          className="inpt"
          placeholder="Type group name"
        ></input>
        <button onClick={addGroup} className="btn">
          Add new group
        </button>
      </div>
      {groups.map((group) => (
        <Group
          key={`_${group.id}_`}
          group={group}
          LeaveGroup={LeaveGroup}
          joinGroup={joinGroup}
          userName={userName}
        />
      ))}
    </>
  );
};

export default MembershipGroups;
