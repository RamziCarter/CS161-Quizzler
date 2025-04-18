// src/pages/CreateQuiz.jsx
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], answer: 0 },
  ]);

  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], answer: 0 },
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === 'question') {
      updated[index].question = value;
    } else {
      updated[index].options[field] = value;
    }
    setQuestions(updated);
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...questions];
    updated[index].answer = parseInt(value);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ title, description, questions });
    const payload = {
      title,
      description,
      is_public: false, // Potentially make a toggle button for this later
      questions: questions.map((q) => ({
        question_text: q.question,
        choices: q.options.map((option, i) => ({
          choice_text: option,
          is_correct: i === q.answer,
        })),
      })),
    };
  
    try {
      const response = await fetch('http://127.0.0.1:8000/games/create-game/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Game created with ID:', data.game_id);
        // Potentially display success message before navigating
        navigate('/dashboard');
      } else {
        console.error('Error creating game:', data);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Create a New Quiz</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:ring-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:ring-1"
              rows="3"
            />
          </div>

          {questions.map((q, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border">
              <h3 className="text-lg font-semibold mb-2">Question {index + 1}</h3>
              <input
                type="text"
                placeholder="Enter the question"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                className="w-full mb-3 px-3 py-2 border rounded-md"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {q.options.map((option, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={option}
                    onChange={(e) => handleQuestionChange(index, i, e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  />
                ))}
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correct Answer (Option Number)
              </label>
              <select
                value={q.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </select>
            </div>
          ))}

          <div className="flex gap-4">
            <Button type="button" variant="secondary" onClick={handleAddQuestion}>
              Add Question
            </Button>
            <Button type="submit" variant="primary">
              Save Quiz
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateQuiz;
