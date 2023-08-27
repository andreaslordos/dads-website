/** @jsxImportSource theme-ui */
import { Themed } from "@theme-ui/mdx";
import { PortableText } from "@portabletext/react";
import { customComponents } from "../theme/customComponents";
const sectionSx = {
  textAlign: "center",
};

export default function PressSection(props) {
  const { title, body } = props;
  return (
    <div sx={sectionSx}>
      <br />
      <Themed.h2>{title}</Themed.h2>
      <br />
      {body && (
        <PortableText
          value={body}
          hardBreak={false}
          components={customComponents}
        />
      )}
      <br />
      <hr />
    </div>
  );
}
