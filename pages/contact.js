/** @jsxImportSource theme-ui */
import Head from "next/head";
import { sanityClient } from "../lib/sanity";
import { PortableText } from "@portabletext/react";
import { customComponents } from "../lib/theme/customComponents";
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

export default function Contact({ itemData }) {
  const body = itemData.body;

  return (
    <>
      <Head>
        <title>Contact</title>
      </Head>
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
    </>
  );
}

export async function getStaticProps() {
  const itemData = await sanityClient.fetch(
    `*[_type == "contact"] | order(publishedAt desc) {
      ...
    }[0]`
  );

  return {
    props: {
      itemData,
    },
    revalidate: 3600,
  };
}
