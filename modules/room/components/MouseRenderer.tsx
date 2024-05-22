import React from "react";
import { socket } from "../../../common/lib/socket";
import UserMouse from "./UserMouse";
import { useUserIds } from "../../../common/recoil/users";

const MouseRenderer = () => {
  const userIds = useUserIds();

  return (
    <>
      {userIds.map((userId) => {
        return <UserMouse userId={userId} key={userId} />;
      })}
    </>
  );
};

export default MouseRenderer;
