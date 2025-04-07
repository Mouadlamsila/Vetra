import GridMotion from "../blocks/Backgrounds/GridMotion/GridMotion";
import SpotlightCard from "../blocks/Components/SpotlightCard/SpotlightCard";
import Steps from "../components/Steps";
import { BarChart3, Shield, Zap } from "lucide-react";

export default function Home() {
    return (
        <div className="">
            <div className="sm:block hidden">
                <GridMotion />
            </div>
            <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 255, 255, 0.217)">
                        {/* Feature 1 */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#c8c2fd] p-3 rounded-lg">
                                <Zap className="w-6 h-6 text-[#1e3a8a]" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#c8c2fd]">Lightning Fast</h3>
                        </div>
                        <p className="text-[#c8c2fd] text-base sm:text-lg">
                            Experience blazing fast performance with our optimized infrastructure and cutting-edge technology stack.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 255, 255, 0.217)">
                        {/* Feature 2 */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#c8c2fd] p-3 rounded-lg">
                                <Shield className="w-6 h-6 text-[#1e3a8a]" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#c8c2fd]">Secure & Reliable</h3>
                        </div>
                        <p className="text-[#c8c2fd] text-base sm:text-lg">
                            Your data is protected with enterprise-grade security measures and regular backups.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 255, 255, 0.217)">
                        {/* Feature 3 */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#c8c2fd] p-3 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-[#1e3a8a]" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#c8c2fd]">Analytics & Insights</h3>
                        </div>
                        <p className="text-[#c8c2fd] text-base sm:text-lg">
                            Get detailed analytics and insights to make data-driven decisions for your business.
                        </p>
                    </SpotlightCard>
                </div>
            </div>
            <Steps />
        </div>
    )
}