/** @jsxImportSource theme-ui */

import { Themed } from "@theme-ui/mdx";
import { useEffect, useState } from "react";
import { sanityClient } from "../client";
import Loading from "../components/Loading";
import { urlFor } from "../utils/urlFor";
import { PortableText } from "@portabletext/react";
import { customComponents } from "../theme/customComponents";
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
};

export default function Homepage() {

    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        sanityClient
          .fetch(
            `*[_type == "author"]  | order(publishedAt desc) {
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

    const bio = itemData.bio;
    const description = itemData.description;
    const image = itemData.image;

    return (
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
                        <img src={urlFor(image).url()}/>
                    </div>
                </div>
            </div>
        </div>
    );
}