/** @jsxImportSource theme-ui */
import Head from "next/head";
import { sanityClient } from "../lib/sanity";
import PressSection from "../src/components/PressSection";
import { Themed } from "@theme-ui/mdx";

const pageSx = {
  textAlign: "center",
};

export default function Press({ itemData }) {
  return (
    <>
      <Head>
        <title>Press</title>
      </Head>
      <div css={pageSx}>
        <Themed.h1>Press</Themed.h1>
        {itemData.map((topic) => {
          return (
            <PressSection key={topic._id} title={topic.title} body={topic.body} />
          );
        })}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const itemData = await sanityClient.fetch(
    `*[_type == "press"] | order(index asc) {
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
