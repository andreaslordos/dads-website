/** @jsxImportSource theme-ui */
import { Themed } from '@theme-ui/mdx';
import { PortableText } from "@portabletext/react"
import { customComponents } from '../theme/customComponents';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import { sanityClient } from '../client';
import { useParams } from 'react-router-dom';

const contentSx = {
    textAlign: 'center',
};

export default function ContentItem(props) {
    const { slug } = useParams();
    const [itemData, setItemData] = useState(null);

    console.log(slug);
    
    useEffect(() => {
        sanityClient
            .fetch(
             `*[slug.current == $slug]{
                title,
                mainImage,
                body
            }`
        )
        .then((data) => setItemData(data))
        .catch(console.error);
    }, [slug]);

    if (!itemData) {
        return <Loading />;
    }
    else {
        console.log(itemData);
    }

    return (
        <div/>
    );
}
