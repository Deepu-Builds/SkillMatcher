import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiZap,
  FiCheck,
  FiTarget,
  FiChevronRight,
  FiLoader,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useQuiz, QUIZ_QUESTIONS } from "../hooks/useQuiz";
import QuizStep from "../components/QuizStep";
import ProgressBar from "../components/ProgressBar";

const Quiz = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [answers, setAnswers] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    currentStep,
    currentQuestion,
    currentAnswer,
    totalSteps,
    isSubmitting,
    error,
    progress,
    handleAnswer,
    handleNext,
    handlePrev,
    handleSubmit,
    reset,
  } = useQuiz();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    reset();
  }, []);

  // Smooth scroll to current section
  useEffect(() => {
    if (containerRef.current) {
      const sectionIndex = currentStep;
      const sectionElement = containerRef.current.children[sectionIndex];
      if (sectionElement) {
        sectionElement.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }
  }, [currentStep]);

  const handleNextStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      handleNext();
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrevStep = () => {
    handlePrev();
  };

  // Get unique shape for each question
  const getCardShape = (index) => {
    const shapes = [
      "rounded-[30px] rounded-bl-[80px]",
      "rounded-[40px] rounded-tr-[90px]",
      "rounded-[35px] rounded-tl-[70px] rounded-br-[70px]",
      "rounded-[25px] rounded-br-[100px]",
      "rounded-[45px] rounded-bl-[60px] rounded-tr-[60px]",
      "rounded-[30px] rounded-tr-[80px] rounded-bl-[50px]",
      "rounded-[40px] rounded-tl-[80px]",
      "rounded-[35px] rounded-bl-[90px] rounded-tr-[40px]",
    ];
    return shapes[index % shapes.length];
  };

  const isLast = currentStep === totalSteps - 1;
  const canContinue = currentAnswer.trim().length > 0;

  // If submitting, show analyzing screen
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 flex items-center justify-center">
        {/* Animated background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse animation-delay-4000" />
        </div>

        {/* Analyzing screen */}
        <div className="relative z-10 max-w-md w-full mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-xl border-2 border-orange-400 rounded-3xl p-12 shadow-2xl shadow-orange-500/30 text-center">
            {/* Animated icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiLoader className="w-12 h-12 text-orange-600 animate-spin" />
                </div>
              </div>
            </div>

            {/* Animated text */}
            <h2 className="text-3xl font-black text-gray-900 font-display mb-4">
              Analyzing Your Skills
            </h2>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>

            <p className="text-gray-600 font-medium mb-8">
              Generating personalized income paths based on your answers
            </p>

            {/* Animated processing bars */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24 text-left">
                  Parsing data
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-progress-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24 text-left">
                  Matching skills
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-progress-2" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24 text-left">
                  Building paths
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-progress-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Top bar - Premium Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-white/95 via-orange-50/30 to-white/95 backdrop-blur-xl border-b border-orange-200/30 px-6 py-4 flex items-center justify-between shadow-lg shadow-gray-200/20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 active:scale-95"
            title="Go back to previous page"
          >
            <FiArrowLeft
              size={18}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center text-white shadow-lg shadow-orange-500/40 transform hover:scale-105 transition-transform">
            <FiZap size={16} />
          </div>
          <div>
            <span className="font-display font-bold text-gray-900 text-lg">
              SkillMatcher
            </span>
            <p className="text-xs text-gray-500 font-medium">
              Professional Assessment
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
            Progress
          </p>
          <p className="text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            {currentStep + 1}/{totalSteps}
          </p>
        </div>
      </header>

      {/* Progress bar - Premium */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-white/80 via-orange-50/50 to-white/80 backdrop-blur-lg px-6 py-5 shadow-md shadow-gray-200/10 border-b border-orange-100/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
            Assessment Progress
          </span>
          <span className="text-xs font-bold text-orange-600">
            {Math.round(progress)}%
          </span>
        </div>
        <ProgressBar percent={progress} size="md" color="orange" />
      </div>

      {/* Main scrollable content */}
      <div className="relative z-10 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* 3-Column Layout: Left | Center | Right */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start md:items-center justify-center md:min-h-screen">
            {/* LEFT CARD - Previous Question (Checkpoint Completed) */}
            <div
              className={`relative items-center justify-center transition-all duration-700 hidden md:flex ${
                isTransitioning
                  ? "opacity-0 scale-90 translate-x-[-60px]"
                  : "opacity-100"
              }`}
            >
              {currentStep > 0 && (
                <div className="animate-fade-in w-full">
                  <div
                    className={`bg-white/70 backdrop-blur-xl border-2 border-green-300/80 transition-all duration-700 p-8 shadow-xl hover:shadow-2xl hover:shadow-green-200/30 ${getCardShape(
                      currentStep - 1,
                    )} scale-90 opacity-80 hover:opacity-100 hover:scale-95 transform`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100/60 px-3 py-1.5 rounded-full border border-green-300/50">
                        <FiCheck size={12} /> Completed
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-green-800 mb-3 line-clamp-3">
                      {QUIZ_QUESTIONS[currentStep - 1]?.question}
                    </h3>
                    <p className="flex items-center gap-1.5 text-sm text-green-700 font-medium">
                      Move to next <FiChevronRight size={16} />
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CENTER CARD - Current Question (Active Task) */}
            <div
              className={`relative w-full flex items-start md:items-center justify-center transition-all duration-700 md:h-full ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100"
              }`}
            >
              <div ref={containerRef} className="w-full">
                <div
                  className={`bg-white/95 backdrop-blur-xl border-3 transition-all duration-700 p-6 md:p-10 shadow-2xl shadow-orange-500/30 ${getCardShape(
                    currentStep,
                  )} border-orange-400`}
                >
                  {/* Question header */}
                  <div className="mb-8 text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-widest bg-gradient-to-r from-orange-50 to-orange-100/50 px-4 py-2 rounded-full mb-4 border border-orange-200/50">
                      <FiTarget size={14} /> Challenge {currentStep + 1} of{" "}
                      {totalSteps}
                    </span>
                    <div className="w-16 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full mx-auto mb-6" />
                    <h2 className="text-4xl font-black text-gray-900 font-display leading-tight mb-4">
                      {currentQuestion?.question}
                    </h2>
                    {currentQuestion?.subtitle && (
                      <p className="text-lg text-gray-600 leading-relaxed font-medium">
                        {currentQuestion.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Input section */}
                  <div className="bg-gradient-to-br from-orange-50/80 via-gray-50 to-orange-50/50 rounded-2xl p-8 mb-8 border-2 border-orange-200/60 shadow-sm animate-fade-in">
                    <QuizStep
                      question={currentQuestion}
                      value={currentAnswer}
                      onChange={(val) =>
                        handleAnswer(
                          currentQuestion.id,
                          currentQuestion.question,
                          val,
                        )
                      }
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="mb-6 px-5 py-4 bg-red-50 border-2 border-red-200 rounded-2xl text-sm text-red-700 font-medium animate-shake flex items-center gap-2">
                      <FiZap size={16} /> {error}
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between gap-4 pt-6 border-t-2 border-gray-200/50">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStep === 0}
                      className="group flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 px-5 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 disabled:transform-none"
                    >
                      <FiArrowLeft
                        size={16}
                        className="group-hover:-translate-x-0.5 transition-transform"
                      />
                      Back
                    </button>

                    {isLast ? (
                      <button
                        onClick={handleSubmit}
                        disabled={!canContinue || isSubmitting}
                        className="group flex items-center gap-2 font-bold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 px-7 py-3 rounded-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/40 border border-orange-400/50"
                      >
                        {isSubmitting ? (
                          <>
                            <FiLoader className="w-4 h-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <FiZap
                              size={16}
                              className="group-hover:rotate-12 transition-transform"
                            />
                            Analyze My Skills
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleNextStep}
                        disabled={!canContinue}
                        className="group flex items-center gap-2 font-bold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 px-7 py-3 rounded-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/40 border border-orange-400/50"
                      >
                        Continue
                        <FiArrowRight
                          size={16}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CARD - Next Question (Checkpoint Upcoming) */}
            <div
              className={`relative items-center justify-center transition-all duration-700 hidden md:flex ${
                isTransitioning
                  ? "opacity-0 scale-90 translate-x-[60px]"
                  : "opacity-100"
              }`}
            >
              {!isLast && (
                <div className="animate-fade-in w-full">
                  <div
                    className={`bg-white/70 backdrop-blur-xl border-2 border-blue-300/80 transition-all duration-700 p-6 md:p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-200/30 ${getCardShape(
                      currentStep + 1,
                    )} scale-90 opacity-80 hover:opacity-100 hover:scale-95 transform`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100/60 px-3 py-1.5 rounded-full border border-blue-300/50">
                        <FiChevronRight size={12} /> Next Step
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-blue-800 mb-3 line-clamp-3">
                      {QUIZ_QUESTIONS[currentStep + 1]?.question}
                    </h3>
                    <p className="flex items-center gap-1.5 text-sm text-blue-700 font-medium">
                      Complete to unlock <FiChevronRight size={16} />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Privacy note at bottom */}
          <div className="mt-12 text-center">
            <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500 font-medium">
              <FiCheck size={14} /> Your answers are private and encrypted ·
              Only used to generate your paths
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
