/** @jsxImportSource theme-ui */
import { sanityClient } from "../client"
import { useState, useEffect } from "react";
import Loading from "../components/Loading"
import Award from "../components/Award";

export default function Awards() {
    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        sanityClient
          .fetch(
            `*[_type == "award"]  | order(publishedAt desc) {
                ...
            }`
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

    return (
        <div>
            {itemData.map((award) => {
                return (
                <Award key={award._id} title={award.title} awardingbody={award.awardingbody} image={award.image} prizefor={award.prizefor}/>
                )
            })}

        </div>
    );
}