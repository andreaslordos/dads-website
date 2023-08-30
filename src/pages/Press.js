/** @jsxImportSource theme-ui */
import { sanityClient } from "../client";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import PressSection from "../components/PressSection";
import { Themed } from "@theme-ui/mdx";

const pageSx = {
  textAlign: "center",
};

export default function Press() {
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "press"]  | order(index asc) {
                ...
            }`
      )
      .then((data) => {
        setItemData(data);
        document.title = 'Press';
      })
      .catch(console.error);
  }, []);

  if (!itemData) {
    return Loading();
  } else {
    console.log(itemData);
  }

  return (
    <div css={pageSx}>
      <Themed.h1>Press</Themed.h1>
      {itemData.map((topic) => {
        return (
          <PressSection key={topic._id} title={topic.title} body={topic.body} />
        );
      })}
    </div>
  );
}
