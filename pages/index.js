/** @jsxImportSource theme-ui */
import Head from "next/head";
import { sanityClient } from "../lib/sanity";
import { urlFor } from "../lib/utils/urlFor";
import { PortableText } from "@portabletext/react";
import { customComponents } from "../lib/theme/customComponents";

const homepageSx = {
  ".mainFlex": {
    display: "flex",
    flexDirection: "column",
  },
  ".updatesAndPic": {
    display: "flex",
    flexDirection: "row",
  },
  ".updates": {
    width: "70%",
    padding: "3rem",
    br: {
      lineHeight: "0.5rem",
    },
  },
  ".pic": {
    display: "flex",
    alignItems: "center",
    padding: "3rem",
  },
  ".welcomeMessage": {
    paddingInline: "3rem",
  },

  "@media (max-width: 835px)": {
    ".updatesAndPic": {
      flexDirection: "column-reverse",
    },
    ".updates": {
      width: "100%",
      padding: "1.5rem",
    },
    ".pic": {
      padding: "1.5rem",
    },
    ".welcomeMessage": {
      paddingInline: "0rem",
      textAlign: "justify",
    },
  },
};

export default function Homepage({ itemData }) {
  const bio = itemData.bio;
  const description = itemData.description;
  const image = itemData.image;

  return (
    <>
      <Head>
        <title>George Lordos</title>
      </Head>
      <div css={homepageSx}>
        <div className="mainFlex">
          <div className="welcomeMessage">
            {bio && (
              <PortableText
                value={bio}
                hardBreak={false}
                components={customComponents}
              />
            )}
          </div>
          <div className="updatesAndPic">
            <div className="updates">
              {description && (
                <PortableText
                  value={description}
                  hardBreak={false}
                  components={customComponents}
                />
              )}
            </div>
            <div className="pic">
              <img src={urlFor(image).url()} alt="George Lordos" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const itemData = await sanityClient.fetch(
    `*[_type == "author"] | order(publishedAt desc) {
      ...
    }[0]`
  );

  return {
    props: {
      itemData,
    },
    revalidate: 3600, // Revalidate every hour
  };
}
