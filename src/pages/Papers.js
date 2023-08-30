/** @jsxImportSource theme-ui */
import { sanityClient } from "../client";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Paper from "../components/Paper";
import { Themed } from "@theme-ui/mdx";

const pageSx = {
  textAlign: "center",
  a: {
    color: "#000",
  },
};

export default function Papers() {
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "paper"]  | order(index asc) {
                ...
            }`
      )
      .then((data) => {
        setItemData(data);
        document.title = 'Papers';
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
      <Themed.h1>Papers</Themed.h1>
      {itemData.map((paper) => {
        return (
          <Paper
            key={paper._id}
            authors={paper.authors}
            event={paper.event}
            link={paper.link}
            title={paper.title}
          />
        );
      })}
    </div>
  );
}
