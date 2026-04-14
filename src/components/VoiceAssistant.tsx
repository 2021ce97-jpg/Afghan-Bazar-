import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Volume2, X, MessageSquare, Send, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDataStore } from '../store/useDataStore';
import { GoogleGenAI, Modality } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isAudio?: boolean;
}

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: 'Welcome to Bazar. I can help you find Zamarood gems, Herat Saffron, or local shops in your PD. How can I assist you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [micError, setMicError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { shops, products } = useDataStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, isPlaying]);

  const stopAudioPlayback = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const startRecording = async () => {
    try {
      setMicError(null);
      stopAudioPlayback();
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone API not supported");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = processAudio;
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (error.name === 'NotFoundError' || errorMessage.includes('Requested device not found')) {
        setMicError('No microphone found on this device. Please type your message below.');
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setMicError('Microphone access denied. Please allow permissions in your browser.');
      } else {
        setMicError('Microphone not available. Please check permissions or type your message.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleTextSubmit = async () => {
    if (!inputText.trim() || isProcessing || isRecording) return;
    
    stopAudioPlayback();
    const text = inputText.trim();
    setInputText('');
    await processRequest(text, null);
  };

  const processAudio = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const base64AudioDataUrl = await blobToBase64(audioBlob);
      const base64Audio = base64AudioDataUrl.split(',')[1];
      await processRequest(null, base64Audio, audioBlob.type || 'audio/webm');
    } catch (error) {
      console.error('Error processing audio blob:', error);
      setMicError('Failed to process audio. Please try again or type.');
    }
  };

  const processRequest = async (text: string | null, audioBase64: string | null, mimeType?: string) => {
    setIsProcessing(true);
    setMicError(null);
    
    const userMsgId = Date.now().toString();
    if (text) {
      setMessages(prev => [...prev, { id: userMsgId, role: 'user', text }]);
    } else {
      setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: 'Voice message', isAudio: true }]);
    }
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
      
      const ai = new GoogleGenAI({ apiKey });
      
      const dbContext = JSON.stringify({
        shops: shops.map(s => ({ id: s.id, name: s.name, district: s.district, category: s.category, isOpen: s.isOpen !== false })),
        products: products.map(p => ({ id: p.id, title: p.title, price: p.price, stock: p.stock, shopId: p.shopId, category: p.category }))
      });

      const systemInstruction = `You are the voice of Bazar, a highly intelligent e-commerce guide in Afghanistan. You do not tell users "how to search." Instead, you are the search engine. You provide direct, spoken answers about the shops, products, and inventory currently available on the platform.

### 1. THE "DIRECT ANSWER" RULE (MANDATORY)
- NEVER say: "You can find that in the electronics section" or "Please use the search bar."
- ALWAYS say: "We have the [Product Name] available at [Shop Name] in [District PD]. It is currently in stock and costs [Price] AFN."
- If a product is NOT in the database, say: "I’ve checked all 20 shops in our network, and currently, that item is unavailable. Would you like me to suggest a similar shop in PD10?"

### 2. VOICE & LANGUAGE LOGIC
- DETECTION: Analyze the user's input (audio or text). If they speak or type in Dari, answer in Dari. If Pashto, answer in Pashto. 
- DEFAULT: If you are unsure of the language, default to Dari.
- TONE: Professional, helpful, and welcoming. Use a "Concierge" tone for the Luxury Vault products (Gemstones/Carpets).

### 3. DATA GROUNDING (Your Knowledge Base)
Refer to the following internal data structure for all answers:
- [Luxury Vault]: Panjshir Emeralds, Yaqoot, Silk Carpets (Always mention Certifications).
- [General Market]: Saffron (Herat), Solar Panels (Kabul Tech), Fashion (Aria).
- [Status]: You must check the "isOpen" and "stock" flags before confirming a purchase to the user via voice.

### 4. MULTIMODAL INSTRUCTIONS
- When responding, format your output for clear Text-to-Speech (TTS) playback—avoid long lists of numbers; use natural conversational flow.

Here is the current database of shops and products:
${dbContext}`;

      const contents: any[] = [];
      if (audioBase64) {
        contents.push({
          inlineData: {
            data: audioBase64,
            mimeType: mimeType || 'audio/webm',
          }
        });
      } else if (text) {
        contents.push(text);
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
        config: {
          systemInstruction,
        }
      });
      
      const responseText = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: responseText }]);
      
      // Generate TTS for all responses
      try {
        const ttsResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: responseText }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });
        
        const base64AudioOut = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64AudioOut) {
          await playAudio(base64AudioOut);
        } else {
          setIsProcessing(false);
        }
      } catch (ttsError) {
        console.error('Error generating TTS:', ttsError);
        setIsProcessing(false);
      }
      
    } catch (error) {
      console.error('Error processing request:', error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: 'Sorry, there was an error processing your request. Please try again.' }]);
      setIsProcessing(false);
    }
  };

  const playAudio = async (base64Data: string) => {
    try {
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const buffer = new Int16Array(bytes.buffer);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const audioContext = audioContextRef.current;
      
      const audioBuffer = audioContext.createBuffer(1, buffer.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      
      for (let i = 0; i < buffer.length; i++) {
        channelData[i] = buffer[i] / 32768.0;
      }
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        setIsPlaying(false);
      };
      
      source.start();
      audioSourceRef.current = source;
      setIsPlaying(true);
      setIsProcessing(false);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-900/20 border border-emerald-500"
        >
          <MessageSquare size={28} />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="w-80 md:w-96 h-[500px] bg-[#0A0A0A] border border-emerald-900/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#111111] p-4 border-b border-emerald-900/30 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Bazar Concierge</span>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  stopAudioPlayback();
                  if (isRecording) stopRecording();
                }} 
                className="text-gray-500 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/grid.svg')] bg-center">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    m.role === 'user' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#1A1A1A] text-gray-300 border border-emerald-900/20'
                  }`}>
                    {m.isAudio ? (
                      <div className="flex items-center gap-2">
                        <Mic size={16} className="text-emerald-200" />
                        <span className="italic opacity-90">Voice Message</span>
                      </div>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A1A] border border-emerald-900/20 rounded-xl p-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                    <span className="text-sm text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
              
              {isPlaying && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A1A] border border-emerald-900/20 rounded-xl p-3 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 animate-pulse text-emerald-500" />
                    <span className="text-sm text-gray-400">Speaking...</span>
                    <button className="text-xs text-gray-500 hover:text-white ml-2" onClick={stopAudioPlayback}>Stop</button>
                  </div>
                </div>
              )}

              {micError && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-900/20 p-2 rounded">
                  <AlertCircle size={14} />
                  {micError}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#111111] border-t border-emerald-900/30 shrink-0">
              <div className="flex items-center gap-2 bg-[#050505] border border-emerald-900/50 rounded-full px-4 py-2">
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                  placeholder="Ask about a product..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-600"
                  disabled={isRecording || isProcessing}
                />
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`${isRecording ? 'text-red-500 animate-bounce' : 'text-emerald-500 hover:text-emerald-400'}`}
                  title={isRecording ? "Stop recording" : "Hold to speak"}
                >
                  {isRecording ? <Square size={18} className="fill-current" /> : <Mic size={18} />}
                </button>
                <button 
                  onClick={handleTextSubmit}
                  disabled={isProcessing || !inputText.trim()}
                  className="text-emerald-500 hover:text-emerald-400 disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
