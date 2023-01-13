import { useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import HeroOne from "../components/hero/HeroOne";
import Divider from "../components/divider/Divider";
import FeaturedNFT from "../components/featuredNFT/FeaturedNFT";


export default function HomeOne () {
    
    return (
        <>
            <Header />

            <HeroOne
                heading="deFractionalize"
                subHeading="Its time to get rid of those shit tokens."
                buttonGroup={[
                    {
                        btnColor: "primary",
                        btnText: "Explore Now",
                        btnURL: "/live-bidding",
                        btnIcon: "bi-arrow-right"
                    },
                    {
                        btnColor: "minimal",
                        btnText: "All Collections",
                        btnURL: "/live-bidding",
                        btnIcon: "bi-grid-3x3-gap"
                    }
                ]}
                welcomeImage="img/illustrator/2.png"
            />

            



        </>
    )
}