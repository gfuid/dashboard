'use client';
import { useState, useEffect } from 'react';
import { Mic, Square, Volume2, Loader2 } from 'lucide-react';

// 1. HELPER FUNCTION: Summarize 25k rows into a small text for AI
const summarizeData = (data: any[]) => {
    if (!data || data.length === 0) return "No data available.";

    const totalCount = data.length;
    const columns = Object.keys(data[0]);

    // 1. Calculate Averages (Your existing logic, slightly robust)
    const numericStats = columns.map(col => {
        const firstVal = data[0][col];
        if (!isNaN(Number(firstVal))) {
            const sum = data.reduce((acc, row) => acc + (Number(row[col]) || 0), 0);
            const avg = (sum / totalCount).toFixed(2);
            return `${col} (Avg: ${avg})`;
        }
        return null;
    }).filter(Boolean).join(", ");

    // 2. NEW: Get a "Preview" of the first 3 rows
    // This lets the AI see the format (e.g., is student_id "1" or "S-001"?)
    const dataPreview = JSON.stringify(data.slice(0, 3));

    // 3. Create the Ultimate Cheat Sheet
    return `
    Dataset Overview:
    - Total Records: ${totalCount}
    - Columns: ${columns.join(", ")}
    - Statistical Averages: ${numericStats}
    
    Data Preview (First 3 rows):
    ${dataPreview}

    Instructions: Use the averages provided above for math questions. Use the Data Preview to understand data formats.
  `;
};

// 2. ACCEPT PROPS: We accept 'csvData' from the parent Dashboard
export default function VoiceChat({ csvData }: { csvData: any[] }) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Added loading state

    // Debugging: Check if data is actually arriving
    useEffect(() => {
        console.log("VoiceChat received data rows:", csvData?.length || 0);
    }, [csvData]);

    let recognition: any = null;
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
        // @ts-ignore
        recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
    }

    const startListening = () => {
        if (!recognition) return alert("Browser not supported. Use Chrome.");
        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            handleSendMessage(text);
        };

        recognition.onend = () => setIsListening(false);
    };

    const handleSendMessage = async (text: string) => {
        setIsLoading(true);

        // 3. GENERATE SUMMARY: Create the cheat sheet for the AI
        const dataSummary = summarizeData(csvData);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                // 4. SEND CONTEXT: We send 'dataContext' along with the message
                body: JSON.stringify({
                    message: text,
                    dataContext: dataSummary
                }),
            });

            const data = await res.json();

            // Handle error from backend
            if (res.status !== 200) throw new Error(data.text);

            setResponse(data.text);
            speak(data.text);
        } catch (error) {
            console.error(error);
            setResponse("Sorry, I had trouble reading the data.");
        } finally {
            setIsLoading(false);
        }
    };

    const speak = (text: string) => {
        // Cancel any previous speech to avoid overlap
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="fixed bottom-10 right-10 bg-gray-900 p-4 rounded-xl border border-gray-700 shadow-2xl w-80 z-50">
            <div className="mb-4 text-white text-sm h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
                {transcript && <p className="text-gray-400">You: {transcript}</p>}

                {isLoading && <p className="text-yellow-400 mt-2 animate-pulse">Analyzing data...</p>}

                {!isLoading && response && <p className="text-green-400 mt-2">AI: {response}</p>}
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={startListening}
                    disabled={isLoading}
                    className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'}`}
                >
                    {isListening ? <Square size={20} /> : <Mic size={20} />}
                </button>

                {response && (
                    <button onClick={() => speak(response)} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
                        <Volume2 size={20} className={isSpeaking ? 'text-green-400' : 'text-white'} />
                    </button>
                )}
            </div>
        </div>
    );
}