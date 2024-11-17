import React, { useState } from 'react';
import { analyzeText } from './api';

const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await analyzeText(text);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">詭弁チェッカー</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 border rounded-lg mb-4 h-32"
          placeholder="分析したいテキストを入力してください"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? '分析中...' : '分析する'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <span className="font-bold">判定結果: </span>
            <span className={result.is_fallacy ? 'text-red-600' : 'text-green-600'}>
              {result.is_fallacy ? '詭弁の可能性があります' : '詭弁は検出されませんでした'}
            </span>
          </div>

          {result.fallacy_types?.map((fallacy, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
              <div className="font-bold">{getFallacyTypeName(fallacy.type)}</div>
              <div className="text-sm text-gray-600 mb-2">
                確信度: {(fallacy.confidence * 100).toFixed(1)}%
              </div>
              <div className="mb-2">{fallacy.explanation}</div>
              <div className="text-sm bg-yellow-100 p-2 rounded">
                該当箇所: {fallacy.relevant_text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getFallacyTypeName = (type) => {
  const types = {
    ad_hominem: '人身攻撃',
    straw_man: 'わら人形論法',
    false_dichotomy: '二分法の誤り',
    slippery_slope: '滑りやすい坂道',
    appeal_to_authority: '権威への訴え',
    hasty_generalization: '性急な一般化',
    circular_reasoning: '循環論法',
    appeal_to_emotion: '感情への訴え',
    red_herring: 'レッドヘリング',
    bandwagon: '便乗論法',
    false_cause: '偽の因果関係',
    appeal_to_tradition: '伝統への訴え',
    tu_quoque: 'ブーメラン論法',
    no_true_scotsman: 'いいえ、本当のスコットランド人は'
  };
  return types[type] || type;
};

export default App;
