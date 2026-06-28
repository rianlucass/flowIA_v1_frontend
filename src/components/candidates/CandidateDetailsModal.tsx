import { useEffect, useRef } from 'react';
import { CandidateAnalysisResponseDTO } from '@/types/analysis';
import { X, BarChart3, Zap, AlertTriangle, HelpCircle, Ban, MessageCircle, FileText, Phone } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ScoreDisplay from './ScoreDisplay';
import ScoreBar from './ScoreBar';
import ContactInfo from './ContactInfo';

interface CandidateDetailsModalProps {
  analysis: CandidateAnalysisResponseDTO;
  onClose: () => void;
}

export default function CandidateDetailsModal({ analysis, onClose }: CandidateDetailsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const displayName = analysis.candidateName || `Candidato #${analysis.candidateId.slice(0, 8)}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) onClose();
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('click', handleClick);

    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-0 border-0 w-full h-full max-w-none max-h-none backdrop:bg-black/50"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
              <div className="mt-2 flex items-center gap-3">
                <ScoreDisplay score={analysis.finalScore} size="lg" />
                <StatusBadge status={analysis.status} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {(analysis.activitiesScore !== undefined ||
            analysis.experienceScore !== undefined ||
            analysis.educationScore !== undefined ||
            analysis.locationScore !== undefined ||
            analysis.stabilityScore !== undefined) && (
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <span>Scores Detalhados</span>
              </h3>
              <div className="space-y-3">
                {analysis.activitiesScore !== undefined && (
                  <ScoreBar label="Atividades e Entregas" score={analysis.activitiesScore} />
                )}
                {analysis.experienceScore !== undefined && (
                  <ScoreBar label="Experiência Profissional" score={analysis.experienceScore} />
                )}
                {analysis.educationScore !== undefined && (
                  <ScoreBar label="Formação Acadêmica" score={analysis.educationScore} />
                )}
                {analysis.locationScore !== undefined && (
                  <ScoreBar label="Localização" score={analysis.locationScore} />
                )}
                {analysis.stabilityScore !== undefined && (
                  <ScoreBar label="Estabilidade" score={analysis.stabilityScore} />
                )}
              </div>
            </section>
          )}

          {analysis.strengths?.items && analysis.strengths.items.length > 0 && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Zap className="w-5 h-5 text-green-600" />
                <span>Pontos Fortes</span>
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.items.map((strength, index) => (
                  <li key={`${strength}-${index}`} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1 shrink-0 text-green-600">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {analysis.attentionPoints?.items && analysis.attentionPoints.items.length > 0 && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Pontos de Atenção</span>
              </h3>
              <ul className="space-y-2">
                {analysis.attentionPoints.items.map((point, index) => (
                  <li key={`${point}-${index}`} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1 shrink-0 text-amber-600">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {analysis.missingInformation?.items && analysis.missingInformation.items.length > 0 && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <HelpCircle className="w-5 h-5 text-gray-500" />
                <span>Informações Faltantes</span>
              </h3>
              <ul className="space-y-2">
                {analysis.missingInformation.items.map((info, index) => (
                  <li key={`${info}-${index}`} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1 shrink-0 text-gray-400">•</span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {analysis.eliminationReasons && analysis.eliminationReasons.length > 0 && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Ban className="w-5 h-5 text-red-500" />
                <span>Motivos de Eliminação</span>
              </h3>
              <ul className="space-y-2">
                {analysis.eliminationReasons.map((reason, index) => (
                  <li key={`${reason}-${index}`} className="flex items-start gap-2 text-red-700 font-medium">
                    <span className="mt-1 shrink-0">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {analysis.interviewQuestions?.items && analysis.interviewQuestions.items.length > 0 && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <span>Perguntas Sugeridas para Entrevista</span>
              </h3>
              <ul className="space-y-2">
                {analysis.interviewQuestions.items.map((question, index) => (
                  <li key={`${question}-${index}`} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1 shrink-0 font-bold text-primary-600">{index + 1}.</span>
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {analysis.recommendation && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText className="w-5 h-5 text-blue-500" />
                <span>Recomendação da IA</span>
              </h3>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-gray-800">{analysis.recommendation}</p>
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Phone className="w-5 h-5 text-gray-600" />
              <span>Informações de Contato</span>
            </h3>
            <ContactInfo
              email={analysis.email}
              phone={analysis.phone}
              linkedinUrl={analysis.linkedinUrl}
              portfolioUrl={analysis.portfolioUrl}
              city={analysis.city}
              state={analysis.state}
            />
          </section>

          {(analysis.aiModel || analysis.promptVersion || analysis.createdAt) && (
            <section className="border-t border-gray-200 pt-6">
              <details className="cursor-pointer">
                <summary className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Informações Técnicas
                </summary>
                <div className="mt-3 space-y-1 text-xs text-gray-600">
                  {analysis.aiModel && <p>Modelo de IA: {analysis.aiModel}</p>}
                  {analysis.promptVersion && <p>Versão do Prompt: {analysis.promptVersion}</p>}
                  {analysis.createdAt && (
                    <p>Analisado em: {new Date(analysis.createdAt).toLocaleString('pt-BR')}</p>
                  )}
                  {analysis.outdated && (
                    <p className="text-amber-600 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Análise desatualizada
                    </p>
                  )}
                </div>
              </details>
            </section>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="
                rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700
                transition-colors hover:bg-gray-50
              "
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
