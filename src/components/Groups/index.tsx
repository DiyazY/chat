import React from "react";
import MembershipGroups from "../MembershipGroups";
import NotMembershipGroups from "../NotMembershipGroups";

const Groups: React.FC = () => {
  return (
    <>
      <MembershipGroups />
      <NotMembershipGroups/>
    </>
  );
};

export default Groups;
