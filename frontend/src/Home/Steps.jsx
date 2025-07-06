import { motion } from "framer-motion";
import { Store } from "lucide-react";
import Step1 from "../Steps/Step1";
import Step2 from "../Steps/Step2";
import Step3 from "../Steps/Step3";
import ShinyButton from "../blocks/TextAnimations/ShinyButton/ShinyButton";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getUserId, getUserRole } from '../utils/auth';


const Steps = () => {
    const { t } = useTranslation();
    const userId = getUserId();
    const role = getUserRole();


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="py-16 px-4 bg-white"

        >
            <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('howItWorks')}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    {t('platformDescription')}
                </p>
            </motion.div>

            <div className="max-w-7xl mx-auto grid gap-8">
                <motion.div variants={itemVariants}>
                    <Step1 />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Step2 />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Step3 />
                </motion.div>
            </div>
            {
                role === "User" ? (
                    <Link to="/to-owner" className="w-full flex justify-center pt-4">
                        <ShinyButton rounded={true} className="w-full sm:w-auto">
                            <p className="text-sm sm:text-base">{t('startNow')}</p>
                            <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                        </ShinyButton>
                    </Link>
                ) : (
                    <Link to="/controll" className="w-full flex justify-center pt-4">
                        <ShinyButton rounded={true} className="w-full sm:w-auto">
                            <p className="text-sm sm:text-base">{t('startNow')}</p>
                            <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                        </ShinyButton>
                    </Link>
                )
            }




        </motion.div>
    );
};

export default Steps;