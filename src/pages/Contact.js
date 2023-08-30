/** @jsxImportSource theme-ui */
import { sanityClient } from "../client";
import { PortableText } from "@portabletext/react";
import { customComponents } from "../theme/customComponents";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { Themed } from "@theme-ui/mdx";

const pageSx = {
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  img: {
    maxWidth: "50%",
    paddingBottom: "1em",
  },
  "@media (max-width: 835px)": {
    img: {
      maxWidth: "100%",
    },
  },
};

export default function Contact() {
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "contact"]  | order(publishedAt desc) {
                ...
            }[0]`
      )
      .then((data) => {
        setItemData(data);
        document.title = "Contact";
      })
      .catch(console.error);
  }, []);

  if (!itemData) {
    return Loading();
  } else {
    console.log(itemData);
  }

  const body = itemData.body;

  return (
    <div css={pageSx}>
      <Themed.h1>Contact</Themed.h1>
      <br />
      {body && (
        <PortableText
          value={body}
          hardBreak={false}
          components={customComponents}
        />
      )}
    </div>
  );
}
