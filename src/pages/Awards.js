/** @jsxImportSource theme-ui */
import { sanityClient } from "../client";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Award from "../components/Award";
import { Themed } from "@theme-ui/mdx";

const pageSx = {
  textAlign: "center",
};

export default function Awards() {
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "award"]  | order(index asc) {
                ...
            }`
      )
      .then((data) => {
        setItemData(data);
        document.title = "Awards";
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
      <Themed.h1>Awards</Themed.h1>
      {itemData.map((award) => {
        return (
          <Award
            key={award._id}
            title={award.title}
            awardingbody={award.awardingbody}
            image={award.image}
            prizefor={award.prizefor}
            link={award.link}
          />
        );
      })}
    </div>
  );
}
