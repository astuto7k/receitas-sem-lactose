'use client';

import QuizWizard from '../../components/QuizWizard';

export default function SuspectQuizPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-start">
      <QuizWizard initialProfile="suspect" />
    </div>
  );
}
