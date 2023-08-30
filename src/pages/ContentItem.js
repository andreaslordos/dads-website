/** @jsxImportSource theme-ui */
import { Themed } from "@theme-ui/mdx";
import { PortableText } from "@portabletext/react";
import { customComponents } from "../theme/customComponents";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import { sanityClient } from "../client";
import { useParams } from "react-router-dom";
import { urlFor } from "../utils/urlFor";

const contentSx = {
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  img: {
    maxWidth: "50%",
  },
  gap: "2em",
  paddingBottom: "2em",

  "@media (max-width: 835px)": {
    img: {
      maxWidth: "100%",
    },
    textAlign: "justify",
    h1: {
      textAlign: "center",
    },
  },
};

export default function ContentItem(props) {
  const { slug } = useParams();
  const [itemData, setItemData] = useState(null);

  console.log(slug);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[slug.current == $slug]{
                title,
                mainImage,
                body
            }[0]`,
        { slug }
      )
      .then((data) => {
        setItemData(data);
        document.title = data.title;
      })
      .catch(console.error);
  }, [slug]);

  if (!itemData) {
    return <Loading />;
  } else {
    console.log(itemData);
  }

  const title = itemData.title;
  const body = itemData.body;
  const mainImage = itemData.mainImage;

  return (
    <div className="content" css={contentSx}>
      <Themed.h1>{title}</Themed.h1>
      <img src={urlFor(mainImage).url()} alt="" />
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
