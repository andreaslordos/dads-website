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
        borderRadius: "50%",  // Makes the image circle-cropped
        border: "1px solid #333"  // Optional: add a border
    },
};

export default function WorkPreview(props) {
    const { title, image } = props;
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
