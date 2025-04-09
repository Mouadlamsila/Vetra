import { motion } from "framer-motion";
import GridMotion from "../blocks/Backgrounds/GridMotion/GridMotion";
import Features from "../Home/Features";
import Steps from "../Home/Steps";
import Swip from "../Home/Swiper";
import ScrollVelocity from "../blocks/TextAnimations/ScrollVelocity/ScrollVelocity";
import AboutSection from "../Home/AboutSection";
import Contact from "../Home/Contact";
import Threads from "../blocks/Backgrounds/Threads/Threads";
import ShinyButton from "../blocks/TextAnimations/ShinyButton/ShinyButton";
import { useEffect } from "react";

export default function Home() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="overflow-hidden"
        >
            <motion.div id="home" variants={sectionVariants} className="sm:block hidden">
                <GridMotion />
            </motion.div>
            <motion.div id="home" variants={sectionVariants} className="block sm:hidden">
                <Swip />
            </motion.div>
            <motion.div id="features" variants={sectionVariants}>
                <Features />
            </motion.div>
            <motion.div id="about" variants={sectionVariants}>
                <AboutSection />
            </motion.div>
            <motion.div id="steps" variants={sectionVariants}>
                <Steps />
            </motion.div>
            <div className="w-full h-[10px] flex justify-center pt-4">
                <ShinyButton className="w-full">
                  
                </ShinyButton>
            </div>
            <motion.div id="contact" variants={sectionVariants}>
                <Contact />
            </motion.div>

        </motion.div>
    );
}