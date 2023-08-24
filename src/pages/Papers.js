/** @jsxImportSource theme-ui */
import { sanityClient } from "../client"
import { useState, useEffect } from "react";
import Paper from "../components/Paper";

export default function Papers() {

    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        sanityClient
          .fetch(
            `*[_type == "paper"]  | order(publishedAt desc) {
                ...
            }`
          )
          .then((data) => {
            setItemData(data);
          })
          .catch(console.error);
      }, []);

    
    if (!itemData) {
        return "Loading...";
      } else {
        console.log(itemData);
      }

      
    return (
        <div>
          {itemData.map((paper) => {
            return (
              <Paper authors={paper.authors} event={paper.event} link={paper.link} title={paper.title}/>
            )
          })}
        </div>
    );
}