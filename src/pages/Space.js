/** @jsxImportSource theme-ui */
import { sanityClient } from "../client"
import { useState, useEffect } from "react";
import Loading from "../components/Loading"
import SpacePreview from "../components/SpacePreview";


const spaceSx = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Change this as per your design requirements

    ".previewSquare": {
        flex: ['1 1 calc(50% - 16px)', '1 1 calc(25.333% - 16px)'], // Responsive item width
        margin: 2, // Margin between items
    }
};

export default function Space() {
    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        sanityClient
            .fetch(
            `*[_type == "post"]  | order(publishedAt desc) {
                title,
                slug,
                mainImage,
                publishedAt,
                _id
            }`
        )
        .then((data) => setItemData(data))
        .catch(console.error);
    }, []);

    if (!itemData) {
        return <Loading />;
    }
    else {
        console.log(itemData);
    }

    return (
        <div sx={spaceSx}>
          {itemData.map((space) => (
                <div className="previewSquare">
                    <a href={"content/" + space.slug.current}>
                        <SpacePreview key={space._id} title={space.title} image={space.mainImage} />
                    </a>
                </div>
          ))}
        </div>
    );
}
