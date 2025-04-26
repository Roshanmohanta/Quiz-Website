import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import CircularProgress from './components/CircularProgress';
import { BookOpen, ArrowRight, XCircle, Brain, CheckCircle2, BrainCircuit as Circuit, Timer, AlertTriangle } from 'lucide-react';

interface Score {
  science: number;
  commerce: number;
  arts: number;
}

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState<Score>({ science: 0, commerce: 0, arts: 0 });
  const [showScore, setShowScore] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([...questions]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); 
  const [showWarning, setShowWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  useEffect(() => {
    setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (quizStarted && !showScore) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            setShowScore(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, showScore]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (quizStarted && !showScore && document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        setShowWarning(true);
        
        if (tabSwitchCount >= 1) {
          // Reset quiz with new questions after second warning
          resetQuiz();
          setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
          setShowWarning(false);
          setTabSwitchCount(0);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [quizStarted, showScore, tabSwitchCount]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    setIsAnswerCorrect(index === shuffledQuestions[currentQuestion].correctAnswer);

    const question = shuffledQuestions[currentQuestion];
    if (index === question.correctAnswer) {
      setScore(prev => ({
        ...prev,
        [question.section]: prev[question.section as keyof Score] + 1
      }));
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      
      if (currentQuestion + 1 < shuffledQuestions.length) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  const getTotalSectionQuestions = (section: keyof Score) => {
    return questions.filter(q => q.section === section).length;
  };

  const getRecommendedStream = () => {
    const percentages = {
      science: (score.science / getTotalSectionQuestions('science')) * 100,
      commerce: (score.commerce / getTotalSectionQuestions('commerce')) * 100,
      arts: (score.arts / getTotalSectionQuestions('arts')) * 100
    };
  
    const maxPercentage = Math.max(...Object.values(percentages));
  
    const recommendedStreams: string[] = [];
  
    for (const stream in percentages) {
      if (percentages[stream as keyof Score] === maxPercentage) {
        recommendedStreams.push(stream);
      }
    }
  
    if (recommendedStreams.length === 1) {
      return recommendedStreams[0];
    } else {
      return recommendedStreams.join(', ');
    }
  };

  const getOverallPercentage = () => {
    const totalScore = score.science + score.commerce + score.arts;
    return (totalScore / questions.length) * 100;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore({ science: 0, commerce: 0, arts: 0 });
    setShowScore(false);
    setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
    setQuizStarted(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setShowFeedback(false);
    setTimeLeft(900);
    setShowWarning(false);
    setTabSwitchCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 relative overflow-hidden">
      {showWarning && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-red-900/50 backdrop-blur-xl p-8 rounded-2xl border border-red-500/50 max-w-md text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-white mb-4">Warning!</h2>
            <p className="text-red-200 mb-6">
              Switching tabs during the quiz is not allowed. This is warning {tabSwitchCount} of 2.
              {tabSwitchCount >= 1 && " The quiz will restart with new questions."}
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="bg-red-500/20 text-white px-6 py-3 rounded-full font-semibold 
                       hover:bg-red-500/40 transition-all duration-300
                       border border-red-400/30"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 grid grid-cols-8 gap-1 opacity-20">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="h-full w-full border-[0.5px] border-blue-500/30 animate-pulse-slow" />
        ))}
      </div>
      <div className="absolute inset-0">
        <div className="animate-float-diagonal absolute h-40 w-40 rounded-full bg-blue-500/20 blur-3xl -top-20 -left-20" />
        <div className="animate-float absolute h-40 w-40 rounded-full bg-purple-500/20 blur-3xl top-1/2 -right-20" />
      </div>
      
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] 
                      max-w-2xl w-full transform transition-all duration-500 
                      border border-white/20 hover:border-blue-500/50">
          {quizStarted && !showScore && (
            <div className="absolute top-4 right-4 flex items-center gap-4 text-white">
              <div className={`flex items-center gap-2 ${timeLeft < 60 ? 'text-red-400 animate-pulse' : ''}`}>
                <Timer className="w-5 h-5" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          )}
          
          {!quizStarted && !showScore ? (
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="relative">
                <Circuit className="w-24 h-24 mx-auto text-blue-400 animate-pulse" />
                <div className="absolute -top-2 -right-2">
                  <div className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-blue-400 opacity-75"></div>
                  <div className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></div>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Stream Selection Quiz</h1>
              <p className="text-blue-200 text-lg">
                Discover your ideal academic path through our interactive assessment!
              </p>
              <div className="text-blue-200 text-sm p-4 bg-blue-500/10 rounded-xl border border-blue-400/20">
                <h3 className="font-semibold mb-2">Important Notes:</h3>
                <ul className="space-y-1 text-left list-disc list-inside">
                  <li>You have 15 minutes to complete the quiz</li>
                  <li>Switching tabs is not allowed</li>
                  <li>Two tab switches will restart the quiz</li>
                </ul>
              </div>
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-blue-500/20 text-white px-10 py-4 rounded-full font-semibold 
                         hover:bg-blue-500/40 transform hover:scale-105 transition-all duration-300
                         hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95 group
                         border border-blue-400/30"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Quiz
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          ) : showScore ? (
            <div className="space-y-8 text-center animate-fadeIn">
              <div className="flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-green-400 animate-bounce" />
              </div>
              <h2 className="text-3xl font-bold text-white">Quiz Complete!</h2>
              <CircularProgress percentage={getOverallPercentage()} />
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-blue-200">Section-wise Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(score).map(([section, sectionScore]) => (
                    <div 
                      key={section}
                      className="p-6 rounded-xl bg-white/5 border border-white/10
                               hover:bg-white/10 transition-all duration-300
                               transform hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    >
                      <h4 className="capitalize font-medium text-white text-lg">{section}</h4>
                      <p className="text-2xl font-bold text-blue-400 mt-2">
                        {sectionScore}/{getTotalSectionQuestions(section as keyof Score)}
                      </p>
                      <p className="text-sm text-blue-200 mt-1">
                        {Math.round((sectionScore / getTotalSectionQuestions(section as keyof Score)) * 100)}%
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-6 bg-blue-500/10 rounded-xl border border-blue-400/20
                              transform hover:scale-105 transition-all duration-300">
                  <p className="text-xl text-white">
                    Based on your performance, we recommend the{' '}
                    <span className="font-bold text-blue-400 capitalize text-2xl">
                      {getRecommendedStream()}
                    </span>{' '}
                    stream!
                  </p>
                </div>
                <button
                  onClick={resetQuiz}
                  className="mt-8 bg-blue-500/20 text-white px-10 py-4 rounded-full font-semibold 
                           hover:bg-blue-500/40 transform hover:scale-105 transition-all duration-300
                           hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95
                           border border-blue-400/30"
                >
                  Try Again
                </button>
                  <br />
                  <button
  onClick={() => window.location.href = 'https://roaring-otter-f454fd.netlify.app'}
  className="mt-8 bg-blue-500/20 text-white px-10 py-4 rounded-full font-semibold 
             hover:bg-blue-500/40 transform hover:scale-105 transition-all duration-300
             hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95
             border border-blue-400/30"
>
  <span className="font-bold text-blue-300 capitalize text-1.5xl">
    {getRecommendedStream()}
  </span>{' '}
</button>  

              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 text-white border border-blue-400/30
                               flex items-center justify-center font-bold text-lg">
                    {currentQuestion + 1}
                  </div>
                  <span className="text-blue-200">of {shuffledQuestions.length}</span>
                </div>
                <button
                  onClick={resetQuiz}
                  className="text-red-400 hover:text-red-300 flex items-center gap-2
                           px-4 py-2 rounded-full hover:bg-red-500/20 transition-colors
                           border border-red-400/30"
                >
                  <XCircle className="w-5 h-5" />
                  Exit Quiz
                </button>
              </div>
              <div className="p-8 bg-white/5 rounded-xl border border-white/10
                            transform transition-all duration-300 hover:bg-white/10">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {shuffledQuestions[currentQuestion].question}
                </h2>
                <div className="space-y-4">
                  {shuffledQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      disabled={showFeedback}
                      className={`w-full text-left p-5 rounded-xl border 
                               transition-all duration-300 transform hover:scale-[1.02]
                               ${selectedAnswer === index 
                                 ? (isAnswerCorrect 
                                    ? 'border-green-400 bg-green-500/20' 
                                    : 'border-red-400 bg-red-500/20')
                                 : 'border-blue-400/30 hover:border-blue-400 hover:bg-blue-500/20'
                               } 
                               ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
                               group flex items-center justify-between text-white`}
                    >
                      <span className="flex-1">{option}</span>
                      <ArrowRight 
                        className={`w-5 h-5 opacity-0 group-hover:opacity-100 
                                  transform group-hover:translate-x-2 transition-all duration-300
                                  ${selectedAnswer === index ? 'opacity-100' : ''}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;