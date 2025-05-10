"use client"

/*
	Installed from https://reactbits.dev/tailwind/
*/

import React, { useState, Children, useRef, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

function Step({ children }) {
  return <div className="px-8">{children}</div>
}

function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  nextButtonIcon = null,
  disableStepIndicators = false,
  renderStepIndicator,
  stepCompleted = {},
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [direction, setDirection] = useState(0)
  const stepsArray = Children.toArray(children)
  const totalSteps = stepsArray.length
  const isCompleted = currentStep > totalSteps
  const isLastStep = currentStep === totalSteps
  const hasCompletedStep6 = currentStep > 6

  const updateStep = (newStep) => {
    if (hasCompletedStep6 && newStep < 6) return // Prevent going back after completing step 6
    setCurrentStep(newStep)
    if (newStep > totalSteps) onFinalStepCompleted()
    else onStepChange(newStep)
  }

  const handleBack = () => {
    if (currentStep > 1 && !hasCompletedStep6) {
      setDirection(-1)
      updateStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1)
      updateStep(currentStep + 1)
    }
  }

  const handleComplete = () => {
    setDirection(1)
    updateStep(totalSteps + 1)
  }

  const isStepClickable = (stepNumber) => {
    if (stepNumber === 1) return true; // Step 1 is always clickable
    if (stepNumber === 6) return currentStep >= 6; // Step 6 is only clickable when reached
    if (hasCompletedStep6) return false; // No steps clickable after completing step 6
    
    // Check if all previous steps are completed
    for (let i = 1; i < stepNumber; i++) {
      if (!stepCompleted[i]) return false;
    }
    return true;
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col items-center justify-center p-4 sm:aspect-[4/3] md:aspect-[2/1]"
      {...rest}
    >
      <div
        className={`mx-auto w-full max-w-[600px] rounded-4xl bg-white shadow-xl ${stepCircleContainerClassName}`}
        style={{
          border: "1px solid #6D28D9",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className={`${stepContainerClassName} flex w-full items-center p-8`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1
            const isNotLastStep = index < totalSteps - 1
            const isClickable = isStepClickable(stepNumber)
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      if (isClickable) {
                        setDirection(clicked > currentStep ? 1 : -1)
                        updateStep(clicked)
                      }
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      if (isClickable) {
                        setDirection(clicked > currentStep ? 1 : -1)
                        updateStep(clicked)
                      }
                    }}
                  />
                )}
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            )
          })}
        </div>
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`space-y-2 px-8 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>
        {!isCompleted && (
          <div className={`px-8 pb-8 ${footerClassName}`}>
            <div className={`mt-10 flex justify-between`}>
              {currentStep !== 1 && currentStep !== 6 && (
                <button
                  onClick={handleBack}
                  className={`duration-350 rounded px-2 py-1 transition ${
                    currentStep === 1
                      ? "pointer-events-none opacity-50 text-neutral-400"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              {currentStep === 1 && (
                <button
                  onClick={() => window.location.href = '/'}
                  className="duration-350 rounded px-2 py-1 transition text-neutral-400 hover:text-neutral-700"
                >
                  No
                </button>
              )}
              {currentStep !== 6 && 
                <button
                  onClick={isLastStep ? handleComplete : handleNext}
                  disabled={!stepCompleted[currentStep]}
                  className={`duration-350 flex items-center justify-center gap-2 rounded-full py-1.5 px-3.5 font-medium tracking-tight text-white transition ${
                    stepCompleted[currentStep]
                      ? 'bg-[#6D28D9] hover:bg-[#5b21b6] active:bg-[#4c1d95]'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  {...nextButtonProps}
                >
                  {nextButtonIcon && <span className="w-5 h-5">{nextButtonIcon}</span>}
                  {currentStep === 5 ? "Register as Owner" : (isLastStep ? "Complete" : nextButtonText)}
                </button>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className }) {
  const [parentHeight, setParentHeight] = useState(0)

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null)

  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight)
  }, [children, onHeightReady])

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  )
}

const stepVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators }) {
  const status = currentStep === step ? "active" : currentStep < step ? "inactive" : "complete"
  const isStep6 = step === 6
  const isDisabled = isStep6 && currentStep < 6

  const handleClick = () => {
    if (!isDisabled && step !== currentStep && !disableStepIndicators) onClickStep(step)
  }

  return (
    <motion.div
      onClick={handleClick}
      className={`relative ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} outline-none focus:outline-none`}
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: "#c8c2fd", color: "#6D28D9" },
          active: { scale: 1, backgroundColor: "#6D28D9", color: "#6D28D9" },
          complete: { scale: 1, backgroundColor: "#6D28D9", color: "#6D28D9" },
        }}
        transition={{ duration: 0.3 }}
        className="flex h-8 w-8 items-center justify-center rounded-full font-semibold"
      >
        {status === "complete" ? (
          <CheckIcon className="h-4 w-4 text-white" />
        ) : status === "active" ? (
          <div className="h-3 w-3 rounded-full bg-white" />
        ) : (
          <span className="text-sm">{step}</span>
        )}
      </motion.div>
    </motion.div>
  )
}

function StepConnector({ isComplete }) {
  const lineVariants = {
    incomplete: { width: 0, backgroundColor: "transparent" },
    complete: { width: "100%", backgroundColor: "#6D28D9" },
  }

  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-[#c8c2fd]">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

// Add Step as a property of Stepper
Stepper.Step = Step;

export default Stepper;
