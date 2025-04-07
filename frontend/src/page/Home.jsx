import GridMotion from "../blocks/Backgrounds/GridMotion/GridMotion";
import Steps from "../components/Steps";


export default function Home() {

    return (
        <div className="">
            <div className="sm:block hidden">
                <GridMotion />
            </div>
            <Steps />
        </div>
    )
}