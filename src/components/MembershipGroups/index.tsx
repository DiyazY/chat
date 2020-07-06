import React, { useEffect, useState } from "react";
import { getSignalRService } from "../../utils/signalR";
import { IMessage } from "../../models/IMessage";
import { IGroup } from "../../models/IGroup";
import Group from "../Group";
import { v4 as uuidv4 } from "uuid";

export interface MembershipGroupsProps {
  userName: string;
}

let hub: any = undefined;

const MembershipGroups: React.FC<MembershipGroupsProps> = ({ userName }) => {
  const [name, setName] = useState("");

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const addGroup = () => {
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
    setName("");
  };

  const LeaveGroup = (id: string) => {
    setGroups(groups.filter((p:IGroup) => p.id !== id));
    hub.invoke("LeaveGroup", id).catch((err: any) => console.error(err));
  };

  const [groups, setGroups] = useState<IGroup[]>([]);

  useEffect(() => {
    hub = getSignalRService();
    hub.invoke("GetMembershipGroups").catch((err: any) => console.error(err));
    hub.on("ReceiveMembershipGroups", (groups: string) => console.log(groups));
    hub.on("ReceiveMessages", (message: IMessage) => console.log(message));
  }, []);
  console.log(groups);
  return (
    <>
      <div>
        <input
          type="text"
          value={name}
          onChange={onChangeName}
          placeholder="Type group name"
        ></input>
        <button onClick={addGroup}>add</button>
      </div>
      {groups.map((group) => (
        <Group key={group.id} group={group} LeaveGroup={LeaveGroup}/>
      ))}
    </>
  );
};

export default MembershipGroups;
