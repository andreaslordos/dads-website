/** @jsxImportSource theme-ui */
import { sanityClient } from "../client";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import WorkPreview from "../components/WorkPreview";
import { Themed } from "@theme-ui/mdx";

const workSx = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between", // Change this as per your design requirements

  ".previewSquare": {
    flex: "1 1 calc(25.333% - 16px)", // 100% width on small screens, 25.333% on larger screens
    margin: 2, // Margin between items
  },

  marginTop: "3vh",

  a: {
    color: "#000",
  },

  "@media (max-width: 835px)": {
    ".previewSquare": {
      flex: "1 1 100%",
    },
  },
};

const pageSx = {
  textAlign: "center",
};

export default function Work(props) {
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    const type =
      props.title === "Earth"
        ? "postEarth"
        : props.title === "Space"
        ? "post"
        : "post";

    sanityClient
      .fetch(
        `*[_type == "${type}"]  | order(publishedAt desc) {
                title,
                slug,
                mainImage,
                publishedAt,
                _id
            }`
      )
      .then((data) => {
        setItemData(data);
        document.title = props.title;
      })
      .catch(console.error);
  }, [props.title]);

  if (!itemData) {
    return <Loading />;
  } else {
    console.log(itemData);
  }

  return (
    <div sx={pageSx}>
      <Themed.h1>{props.title}</Themed.h1>
      <div className="workGrid" sx={workSx}>
        {itemData.map((work) => (
          <div className="previewSquare">
            <a href={"content/" + work.slug.current}>
              <WorkPreview
                key={work._id}
                title={work.title}
                image={work.mainImage}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
