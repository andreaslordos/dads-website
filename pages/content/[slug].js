/** @jsxImportSource theme-ui */
import Head from "next/head";
import { Themed } from "@theme-ui/mdx";
import { PortableText } from "@portabletext/react";
import { customComponents } from "../../lib/theme/customComponents";
import { sanityClient } from "../../lib/sanity";
import { urlFor } from "../../lib/utils/urlFor";

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

export default function ContentItem({ itemData }) {
  const title = itemData.title;
  const body = itemData.body;
  const mainImage = itemData.mainImage;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
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
    </>
  );
}

export async function getStaticPaths() {
  const slugs = await sanityClient.fetch(
    `*[_type in ["post", "postEarth"]].slug.current`
  );

  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: 'blocking', // Generate new pages on-demand for new content
  };
}

export async function getStaticProps({ params }) {
  const itemData = await sanityClient.fetch(
    `*[slug.current == $slug]{
      title,
      mainImage,
      body
    }[0]`,
    { slug: params.slug }
  );

  if (!itemData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      itemData,
    },
    revalidate: 3600,
  };
}
