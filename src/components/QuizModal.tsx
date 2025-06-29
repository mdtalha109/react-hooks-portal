import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  hookId: string;
  questions: Question[];
  onComplete: (score: number) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, hookId, questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      setQuizCompleted(true);
      const score = calculateScore();
      onComplete(score);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
  };

  const currentQ = questions[currentQuestion];
  const score = calculateScore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {hookId} Quiz
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!showResults ? (
                <div className="space-y-6">
                  {/* Progress */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {currentQ.question}
                    </h3>
                    <div className="space-y-3">
                      {currentQ.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                            selectedAnswers[currentQuestion] === index
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="font-medium text-gray-700">
                            {String.fromCharCode(65 + index)}.
                          </span>{' '}
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      onClick={previousQuestion}
                      disabled={currentQuestion === 0}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextQuestion}
                      disabled={selectedAnswers[currentQuestion] === undefined}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  {/* Score */}
                  <div>
                    <div className={`text-6xl font-bold mb-2 ${
                      score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {score}%
                    </div>
                    <p className="text-lg text-gray-600">
                      You got {selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length} out of {questions.length} questions correct!
                    </p>
                  </div>

                  {/* Results breakdown */}
                  <div className="space-y-4 text-left">
                    {questions.map((question, index) => {
                      const isCorrect = selectedAnswers[index] === question.correctAnswer;
                      return (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            {isCorrect ? (
                              <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                            ) : (
                              <XCircle size={20} className="text-red-500 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                              </p>
                              <p className="text-sm text-gray-600">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={resetQuiz}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <RotateCcw size={16} />
                      Retake Quiz
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuizModal;