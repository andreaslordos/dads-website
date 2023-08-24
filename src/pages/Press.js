/** @jsxImportSource theme-ui */
import { sanityClient } from "../client"
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import PressSection from "../components/PressSection"

export default function Press() {
    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        sanityClient
          .fetch(
            `*[_type == "press"]  | order(publishedAt desc) {
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
          {itemData.map((topic) => {
            return (
              <PressSection key={topic._id} title={topic.title} body={topic.body}/>
            )
          })}
        </div>
    );
}