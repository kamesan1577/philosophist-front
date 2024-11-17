const API_ENDPOINT = process.env.VITE_APP_API_ENDPOINT;
const USERNAME = process.env.VITE_APP_USERNAME;
const PASSWORD = process.env.VITE_APP_PASSWORD;

export const analyzeText = async (text) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic ' + btoa(`${USERNAME}:${PASSWORD}`));

    const response = await fetch(`${API_ENDPOINT}/api/v1/judge`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            text,
            language: 'ja'
        })
    });

    if (!response.ok) {
        throw new Error('APIリクエストに失敗しました');
    }

    return response.json();
};
