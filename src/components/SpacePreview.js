/** @jsxImportSource theme-ui */
import { Themed } from '@theme-ui/mdx';
import { urlFor } from '../utils/urlFor';

const previewSx = {
    textAlign: 'center',
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    img: {
        float: "left",
        width:  "250px",
        height: "250px",
        objectFit: "cover",
    },
};

export default function SpacePreview(props) {
    const { title, image, slug } = props;
    return (
        <div sx={previewSx}>
            <img src={urlFor(image).url()}/>
            <br/>
            <Themed.h3>{title}</Themed.h3>
            <br />
            <br/>
        </div>
    );
}
