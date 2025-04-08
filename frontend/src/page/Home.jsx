import GridMotion from "../blocks/Backgrounds/GridMotion/GridMotion";
import Features from "../Home/Features";
import Steps from "../Home/Steps";
import Swip from "../Home/Swiper";
import Contact from "../Home/Contact";

export default function Home() {
    return (
        <div className="">
            <div className="sm:block hidden">
                <GridMotion />
            </div>
            <div className="block sm:hidden">
                <Swip />
            </div>
            <Features />
            <Steps />
            <Contact />
           
        </div>
    )
}