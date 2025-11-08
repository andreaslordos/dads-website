/** @jsxImportSource theme-ui */
import Head from "next/head";
import { sanityClient } from "../lib/sanity";
import Award from "../src/components/Award";
import { Themed } from "@theme-ui/mdx";

const pageSx = {
  textAlign: "center",
};

export default function Awards({ itemData }) {
  return (
    <>
      <Head>
        <title>Awards</title>
      </Head>
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
    </>
  );
}

export async function getStaticProps() {
  const itemData = await sanityClient.fetch(
    `*[_type == "award"] | order(index asc) {
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
