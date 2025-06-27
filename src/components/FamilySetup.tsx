import React from "react";
import { FamilyOnboarding } from "./FamilyOnboarding";
import NoFamily from "./NoFamily";

const FamilySetup = () => {
  const [createFamily, setCreateFamily] = React.useState(false);

  return createFamily ? (
    <FamilyOnboarding onCreateFamily={setCreateFamily} />
  ) : (
    <NoFamily onCreateFamily={setCreateFamily} />
  );
};

export default FamilySetup;
