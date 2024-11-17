// 詭弁タイプの日本語表示名マッピング
const FALLACY_NAMES = {
    "ad_hominem": "人身攻撃",
    "straw_man": "わら人形論法",
    "false_dichotomy": "二者択一の誤り",
    "slippery_slope": "滑りやすい坂道",
    "appeal_to_authority": "権威への訴え",
    "hasty_generalization": "性急な一般化",
    "circular_reasoning": "循環論法",
    "appeal_to_emotion": "感情への訴え",
    "red_herring": "赤にしん",
    "bandwagon": "バンドワゴン効果",
    "false_cause": "誤った因果関係",
    "appeal_to_tradition": "伝統への訴え",
    "tu_quoque": "ツー・クオック",
    "no_true_scotsman": "本物のスコットランド人"
};

// API エンドポイント
const API_ENDPOINT = 'https://your-api-endpoint.com/api/v1/judge';

async function analyzeText() {
    const textArea = document.getElementById('input-text');
    const submitButton = document.getElementById('submit-button');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    const text = textArea.value.trim();
    if (!text) {
        showError('テキストを入力してください');
        return;
    }

    // UI更新
    submitButton.disabled = true;
    loadingDiv.classList.remove('hidden');
    resultDiv.innerHTML = '';

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                language: 'ja'
            })
        });

        if (!response.ok) {
            throw new Error('API リクエストに失敗しました');
        }

        const result = await response.json();
        showResult(result);
    } catch (error) {
        showError(error.message);
    } finally {
        submitButton.disabled = false;
        loadingDiv.classList.add('hidden');
    }
}

function showResult(result) {
    const resultDiv = document.getElementById('result');

    const confidencePercent = (result.confidence_score * 100).toFixed(1);
    const icon = result.is_fallacy
        ? '⚠️'
        : '✅';

    let html = `
        <div class="result-card">
            <div class="flex items-center gap-2 mb-4">
                <span class="text-xl">${icon}</span>
                <h2 class="text-lg font-bold">分析結果</h2>
            </div>
            <p class="text-gray-600 mb-4">
                確信度: ${confidencePercent}%
            </p>
    `;

    if (result.is_fallacy && result.fallacy_types) {
        html += `
            <div class="space-y-4">
                <p class="text-red-500 font-medium">
                    このテキストには以下の論理的な問題が含まれている可能性があります：
                </p>
        `;

        result.fallacy_types.forEach(fallacy => {
            const fallacyConfidence = (fallacy.confidence * 100).toFixed(1);
            html += `
                <div class="fallacy-item">
                    <h3 class="font-medium mb-2">
                        ${FALLACY_NAMES[fallacy.type]} (${fallacyConfidence}%)
                    </h3>
                    <p class="text-gray-600 mb-2">
                        ${fallacy.explanation}
                    </p>
                    <div class="relevant-text">
                        <p class="text-sm font-medium">該当箇所:</p>
                        <p class="text-sm">${fallacy.relevant_text}</p>
                    </div>
                </div>
            `;
        });

        html += '</div>';
    } else {
        html += `
            <p class="text-green-600">
                このテキストには明確な論理的問題は見つかりませんでした。
            </p>
        `;
    }

    html += `
        <div class="text-xs text-gray-500 mt-4">
            分析時刻: ${new Date(result.metadata.analysis_timestamp).toLocaleString()}
            <br>
            使用モデル: ${result.metadata.llm_version}
        </div>
    </div>
    `;

    resultDiv.innerHTML = html;
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <p class="font-bold">エラー</p>
            <p>${message}</p>
        </div>
    `;
}
