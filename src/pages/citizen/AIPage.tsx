import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  User,
  Scale,
  ExternalLink,
  BookOpen,
  PhoneCall,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SourceCard } from '@/components/ui/SourceCard';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { UrgencyBanner } from '@/components/shared/UrgencyBanner';
import { sendChatMessage } from '@/lib/api/ai';
import { getOrCreateActiveConversation, getConversationMessages, persistChatMessage } from '@/lib/api/database';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import type { AgentResponse, UrgencyLevel, WakeelQuestion } from '@/types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  payload?: AgentResponse;
  timestamp: string;
}

export default function AIPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeUrgency, setActiveUrgency] = useState<UrgencyLevel | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize or load existing database conversation for authenticated user
  useEffect(() => {
    let mounted = true;
    async function initConversation() {
      if (!user) return;
      try {
        const convId = await getOrCreateActiveConversation();
        if (mounted) setConversationId(convId);
        const history = await getConversationMessages(convId);
        if (mounted && history.length > 0) {
          setMessages(history.map(m => ({
            id: m.id,
            sender: m.sender_type === 'user' ? 'user' : 'agent',
            text: m.content,
            payload: m.structured_payload || undefined,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          })));
        }
      } catch (err) {
        console.warn('[AIPage] Session init notice:', err);
      }
    }
    initConversation();
    return () => { mounted = false; };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Web Speech API initialization with graceful degradation
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('[WebSpeech] Recognition error:', event.error);
        setSpeechError('Microphone not permitted or speech recognition unavailable in this browser.');
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleRecording = () => {
    setSpeechError(null);
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Speech start error:', err);
        setIsRecording(false);
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Ensure conversation exists in DB
      let activeConvId = conversationId;
      if (!activeConvId && user) {
        activeConvId = await getOrCreateActiveConversation();
        setConversationId(activeConvId);
      }

      // Persist user message
      if (activeConvId) {
        persistChatMessage({
          conversationId: activeConvId,
          senderType: 'user',
          content: query,
        }).catch(e => console.warn('[AIPage] User message DB persist notice:', e));
      }

      const historyPayload = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const agentData = await sendChatMessage({
        message: query,
        history: historyPayload,
        language,
      });

      if (agentData.urgency && agentData.urgency !== 'routine') {
        setActiveUrgency(agentData.urgency);
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: agentData.summary,
        payload: agentData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, agentMsg]);

      // Persist agent response
      if (activeConvId) {
        persistChatMessage({
          conversationId: activeConvId,
          senderType: 'agent',
          content: agentData.summary,
          structuredPayload: agentData,
        }).catch(e => console.warn('[AIPage] Agent response DB persist notice:', e));
      }
    } catch (err: any) {
      console.error('Agent chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestionSelect = (option: string, question: WakeelQuestion) => {
    handleSend(`Regarding "${question.question}": ${option}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E4]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold text-[#1C1917]">Wakeel AI Assistant</h1>
            <Badge variant="accent">Agentic Triage</Badge>
          </div>
          <p className="text-sm text-[#57534E] mt-1">
            Grounded Pakistani legal navigation • CrPC, PECA 2016, and human rights procedures.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#57534E] bg-white px-3 py-1.5 rounded-lg border border-[#E7E5E4]">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>Statutory Grounding Active</span>
        </div>
      </div>

      {/* Urgency Alert if active */}
      {activeUrgency && (
        <UrgencyBanner urgency={activeUrgency} />
      )}

      {/* Main Conversation Area */}
      <div className="bg-[#FAF8F5] border border-[#E7E5E4] rounded-2xl min-h-[460px] p-4 sm:p-6 flex flex-col justify-between">
        {messages.length === 0 ? (
          <div className="my-auto py-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#1C1917]">How can Wakeel help you today?</h2>
            <p className="text-sm text-[#57534E]">
              Tell me what happened in plain language. Wakeel will evaluate urgency, check verified legal procedures, and build an actionable plan.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <button
                onClick={() => handleSend("A police station called me and told me to come tonight, but I don't know why.")}
                className="p-3 bg-white rounded-xl border border-[#E7E5E4] hover:border-[#7C3AED] text-xs transition-all text-[#1C1917]"
              >
                <div className="font-semibold text-[#7C3AED] mb-1">Police Call Scenario</div>
                "A police station called me and told me to come tonight..."
              </button>
              <button
                onClick={() => handleSend("Someone has my private photos and is threatening to leak them unless I pay them money.")}
                className="p-3 bg-white rounded-xl border border-[#E7E5E4] hover:border-[#7C3AED] text-xs transition-all text-[#1C1917]"
              >
                <div className="font-semibold text-[#DC2626] mb-1">Cyber Blackmail Scenario</div>
                "Someone has my private photos and is threatening to leak them..."
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 overflow-y-auto pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-8 h-8 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0 mt-1">
                    <Scale className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#7C3AED] text-white rounded-tr-none'
                        : 'bg-white border border-[#E7E5E4] text-[#1C1917] rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`block text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-white/70' : 'text-[#A8A29E]'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Agentic Structured Artifacts */}
                  {msg.payload && (
                    <div className="space-y-4 pt-1">
                      {/* Confidence & Assessment */}
                      <div className="flex flex-wrap items-center gap-2">
                        <ConfidenceBadge level={msg.payload.confidence} />
                        <Badge variant={msg.payload.urgency === 'high' ? 'danger' : 'caution'}>
                          Urgency: {msg.payload.urgency.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Targeted Clarifying Question */}
                      {msg.payload.what_i_need_to_know && msg.payload.what_i_need_to_know.length > 0 && (
                        <Card variant="bordered" className="bg-[#FAF8F5] border-[#7C3AED]/30">
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#7C3AED]">
                              <Info className="w-4 h-4" />
                              <span>Wakeel needs one focused detail to guide you safely:</span>
                            </div>
                            <p className="text-sm font-medium text-[#1C1917] mt-1">
                              {msg.payload.what_i_need_to_know[0].question}
                            </p>
                          </CardHeader>
                          {msg.payload.what_i_need_to_know[0].options && (
                            <CardContent className="pt-0 flex flex-wrap gap-2">
                              {msg.payload.what_i_need_to_know[0].options.map((opt, i) => (
                                <Button
                                  key={i}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuickQuestionSelect(opt, msg.payload!.what_i_need_to_know[0])}
                                  className="text-xs bg-white"
                                >
                                  {opt}
                                </Button>
                              ))}
                            </CardContent>
                          )}
                        </Card>
                      )}

                      {/* Action Plan Cards */}
                      {msg.payload.do_now && msg.payload.do_now.length > 0 && (
                        <Card variant="bordered" className="bg-white">
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#059669]">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Your Immediate Next Steps:</span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2.5 pt-0">
                            {msg.payload.do_now.map((act, i) => (
                              <div key={i} className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4] text-xs">
                                <p className="font-semibold text-[#1C1917]">{i + 1}. {act.title}</p>
                                <p className="text-[#57534E] mt-0.5">{act.description}</p>
                                <p className="text-[11px] text-[#7C3AED] mt-1 italic">Why: {act.why}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {/* Critical Things to Avoid */}
                      {msg.payload.avoid && msg.payload.avoid.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-[#DC2626]/5 border border-[#DC2626]/20 text-xs">
                          <div className="flex items-center gap-1.5 font-semibold text-[#DC2626] mb-1.5">
                            <AlertTriangle className="w-4 h-4" />
                            <span>What to Avoid:</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-[#57534E]">
                            {msg.payload.avoid.map((av, i) => (
                              <li key={i}>{av}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Official Grounded Helplines */}
                      {msg.payload.official_resources && msg.payload.official_resources.length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-[#E7E5E4] space-y-2">
                          <div className="text-xs font-semibold text-[#1C1917] flex items-center gap-1.5">
                            <PhoneCall className="w-3.5 h-3.5 text-[#059669]" />
                            <span>Verified Official Resources:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {msg.payload.official_resources.map((res, i) => (
                              <div key={i} className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4]">
                                <p className="font-medium text-[#1C1917]">{res.name}</p>
                                {res.phone && (
                                  <p className="text-[#059669] font-bold mt-0.5">Helpline: {res.phone}</p>
                                )}
                                <p className="text-[11px] text-[#57534E] mt-0.5">{res.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Grounded Legal Sources */}
                      {msg.payload.sources && msg.payload.sources.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <p className="text-xs font-semibold text-[#57534E] flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Grounded in {msg.payload.sources.length} Verified Pakistani Statute(s):</span>
                          </p>
                          <div className="space-y-2">
                            {msg.payload.sources.map((src, i) => (
                              <SourceCard
                                key={i}
                                title={src.title}
                                authority={src.authority}
                                url={src.url}
                                jurisdiction="Pakistan"
                                verified={true}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Legal Safety Disclaimer */}
                      <p className="text-[11px] text-[#A8A29E] italic">
                        {msg.payload.disclaimer}
                      </p>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#1C1917] text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="p-4 rounded-xl bg-white border border-[#7C3AED]/20 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#7C3AED]">
                  <Sparkles className="w-4 h-4 animate-spin text-[#7C3AED]" />
                  <span>Agentic Legal Reasoning Active:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#059669] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>1. Safety & Triage</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#059669] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>2. Fact Extraction</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#7C3AED] font-medium animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>3. Statute Grounding</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#A8A29E]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>4. Action Plan</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#57534E] italic pt-1 border-t border-[#E7E5E4]">
                  Cross-referencing legal facts against CrPC, PECA 2016, and verified official Pakistani procedures...
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-4 border-t border-[#E7E5E4] mt-4 space-y-2">
          {speechError && (
            <p className="text-xs text-[#DC2626]">{speechError}</p>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={toggleRecording}
              className={`shrink-0 ${isRecording ? 'text-[#DC2626] border-[#DC2626] bg-[#FEE2E2]' : ''}`}
              title="Voice Input (English / Urdu)"
            >
              {isRecording ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
            </Button>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording ? "Listening... Speak now..." : "Describe your situation in English, Urdu, or Roman Urdu..."}
              className="flex-1"
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!input.trim() || loading}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-[#A8A29E]">
            <span>Voice & text supported • No hallucinated legal statutes</span>
            <span>Emergency numbers: Police 15 • Rescue 1122 • NCCIA 1799</span>
          </div>
        </div>
      </div>
    </div>
  );
}
