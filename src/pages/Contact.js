/** @jsxImportSource theme-ui */
import { sanityClient } from "../client";
import { PortableText } from "@portabletext/react";
import { customComponents } from "../theme/customComponents";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { Themed } from "@theme-ui/mdx";

const pageSx = {
    textAlign: 'center',
}

export default function Contact() {

    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        sanityClient
          .fetch(
            `*[_type == "contact"]  | order(publishedAt desc) {
                ...
            }[0]`
          )
          .then((data) => {
            setItemData(data);
          })
          .catch(console.error);
      }, []);

    
    if (!itemData) {
        return Loading();
      } else {
        console.log(itemData);
      }

    const body = itemData.body;

    return (
        <div css={pageSx}>
            <Themed.h1>Contact</Themed.h1>
            <br/>
            {body && (
                <PortableText
                    value={body}
                    hardBreak={false}
                    components={customComponents}
                />
            )}
        </div>
    );
}