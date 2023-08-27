/** @jsxImportSource theme-ui */
import { Themed } from "@theme-ui/mdx";
import { urlFor } from "../utils/urlFor";
import { useIsMobile } from "../utils/isMobile";

const previewSx = {
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignContent: "center",
  alignItems: "center",
  img: {
    float: "left",
    width: "250px",
    height: "250px",
    objectFit: "cover",
    borderRadius: "50%", // Makes the image circle-cropped
    border: "1px solid #333", // Optional: add a border
  },
};

export default function WorkPreview(props) {
  const { title, image } = props;
  const isMob = useIsMobile();
  const HeadingSize = isMob ? Themed.h2 : Themed.h3;
  return (
    <div sx={previewSx}>
      <img src={urlFor(image).url()} alt="" />
      <br />
      <HeadingSize>{title}</HeadingSize>
      <br />
      <br />
    </div>
  );
}
