import GridMotion from "../blocks/Backgrounds/GridMotion/GridMotion";
import Features from "../Home/Features";
import Steps from "../Home/Steps";

export default function Home() {
    return (
        <div className="">
            <div className="sm:block hidden">
                <GridMotion />
            </div>
            <Features />
            <Steps />
        </div>
    )
}