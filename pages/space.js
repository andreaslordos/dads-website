/** @jsxImportSource theme-ui */
import Head from "next/head";
import Link from "next/link";
import { sanityClient } from "../lib/sanity";
import WorkPreview from "../src/components/WorkPreview";
import { Themed } from "@theme-ui/mdx";

const workSx = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",

  ".previewSquare": {
    flex: "1 1 calc(25.333% - 16px)",
    margin: 2,
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

export default function Space({ itemData }) {
  return (
    <>
      <Head>
        <title>Space</title>
      </Head>
      <div sx={pageSx}>
        <Themed.h1>Space</Themed.h1>
        <div className="workGrid" sx={workSx}>
          {itemData.map((work) => (
            <div className="previewSquare" key={work._id}>
              <Link href={`/content/${work.slug.current}`}>
                <WorkPreview
                  title={work.title}
                  image={work.mainImage}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const itemData = await sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      title,
      slug,
      mainImage,
      publishedAt,
      _id
    }`
  );

  return {
    props: {
      itemData,
    },
    revalidate: 3600,
  };
}
