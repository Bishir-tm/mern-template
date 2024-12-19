import React from "react";
import DataPurchaseForm from "./components/DataPurchaseForm";
import TitleCard from "../../components/Cards/TitleCard";

const index = () => {
  return (
    <TitleCard title={"Mobile Data"}>
      <DataPurchaseForm />
    </TitleCard>
  );
};

export default index;
