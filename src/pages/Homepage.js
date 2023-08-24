/** @jsxImportSource theme-ui */

import { Themed } from "@theme-ui/mdx";

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
    return (
        <div css={homepageSx}>
            <div className="mainFlex">
                <div className="welcomeMessage">
                    <Themed.p>I am a designer of novel, feasible and sustainable space systems, specializing in Mars settlement architectures. My 30-year academic and professional background spans the fields of system architecture, systems engineering, strategy, project management, technology development, economics, accounting, finance, corporate governance, entrepreneurship, management and operations, political science and philosophy.</Themed.p>
                </div>
                <div className="updatesAndPic">
                    <div className="updates">
                        <Themed.p><b>At a glance..</b></Themed.p>
                        <Themed.ul>
                            <br/>
                            <li>At MIT, I teach a hands-on course in planetary surface technology development.</li>
                            <br/>
                            <li>I founded the student-led <a href="https://spaceresources.mit.edu/" target="_blank">Space Resources Workshop lab</a>.</li>
                            <br/>
                            <li>I am currently conducting doctoral research in the principles and methods for the establishment of robust, self-sustaining, space settlements that leverage  Earth- and space-based commercial and industrial ecosystems.</li>
                            <br/>
                            <li>In August 2022, MIT News published my profile under the title <a href="https://news.mit.edu/2022/george-lordos-space-phd-0817" target="_blank">"On the front lines of space innovation"</a></li>
                        </Themed.ul>
                    </div>
                    <div className="pic">
                        <img
                        src="/profilephoto2.jpeg"
                        loading="lazy"
                        alt="A picture of George Lordos wearing a checkered shirt, smiling with his arms crossed."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}