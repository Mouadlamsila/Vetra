import Features from "../components/feautures";
import GridMotion from "../blocks/Backgrounds/GridMotion/GridMotion";


export default function Home() {

    return (
        <div className="">
            <div className="sm:block hidden">
                <GridMotion />
            </div>
            <Features />
        </div>
    )
}