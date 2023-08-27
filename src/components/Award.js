/** @jsxImportSource theme-ui */
import { Themed } from '@theme-ui/mdx';
import { urlFor } from '../utils/urlFor';

const awardSx = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    hr: {
        width: '100%',
    },
    "@media (max-width: 835px)": {
        br: {
        },
    },
};

export default function Award(props) {
    
    // image is optional
    
    const { awardingbody, prizefor, title, image } = props;
    return (
        <div sx={awardSx}>
            <br/>
            <Themed.h2>{title}</Themed.h2>
            <br/>
            <Themed.p>by {awardingbody}</Themed.p>
            <Themed.h3>for {prizefor}</Themed.h3>
            <br/>
            { image ? <img src={urlFor(image).width(200).url()} alt="logo of awarding body"/> : <></>}
            <br/>
            <hr />
        </div>
    );
}
