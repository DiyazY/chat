import React from "react";
import { IGroup } from "../../models/IGroup";
import styles from "./Group.module.css";

export interface GroupProps {
  group: IGroup;
  LeaveGroup?: (id: string) => void;
}

const Group: React.FC<GroupProps> = ({ group, LeaveGroup }) => {
  const openGroup = (e: any) => {
    if (e.target.id !== group.id) {
      console.log("openGroup");
    }
  };

  return (
    <div className={styles.group} onClick={openGroup}>
      <p className={styles.name}>{group.name}</p>
      {LeaveGroup ? (
        <button id={group.id} onClick={(e) => LeaveGroup(group.id)}>leave</button>
      ) : (
        <button id={group.id}>join</button>
      )}
    </div>
  );
};

export default Group;
