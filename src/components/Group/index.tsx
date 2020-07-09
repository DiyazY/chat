import React from "react";
import { IGroup } from "../../models/IGroup";
import styles from "./Group.module.css";
import { useHistory } from "react-router-dom";

export interface GroupProps {
  group: IGroup;
  LeaveGroup: (id: string) => void;
  joinGroup: (id: string) => void;
}

let userName = localStorage.getItem("_name") || "";

const Group: React.FC<GroupProps> = ({ group, LeaveGroup, joinGroup }) => {
  const history = useHistory();
  const openGroup = (e: any) => {
    if (group.members.includes(userName) && e.target.id !== group.id) {
      history.push(`/group/${group.id}`);
    }
  };

  return (
    <div className={styles.group} onClick={openGroup}>
      <p className={styles.name}>{group.name}</p>
      {group.members.includes(userName) ? (
        <button
          className={styles.leave}
          id={group.id}
          onClick={(e) => LeaveGroup(group.id)}
        >
          leave
        </button>
      ) : (
        <button
          className={styles.join}
          id={group.id}
          onClick={() => joinGroup(group.id)}
        >
          join
        </button>
      )}
      <p className={styles.numberOfMembers}>
        {(group.members && group.members.length) || 0}
      </p>
    </div>
  );
};

export default Group;
