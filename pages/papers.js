/** @jsxImportSource theme-ui */
import Head from "next/head";
import { sanityClient } from "../lib/sanity";
import Paper from "../src/components/Paper";
import { Themed } from "@theme-ui/mdx";

const pageSx = {
  textAlign: "center",
  a: {
    color: "#000",
  },
};

export default function Papers({ itemData }) {
  return (
    <>
      <Head>
        <title>Papers</title>
      </Head>
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
    </>
  );
}

export async function getStaticProps() {
  const itemData = await sanityClient.fetch(
    `*[_type == "paper"] | order(index asc) {
      ...
    }`
  );

  return {
    props: {
      itemData,
    },
    revalidate: 3600,
  };
}
