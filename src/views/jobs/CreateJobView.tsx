'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useCreateJob } from '@/hooks/useJobs';
import { parseJobError } from '@/services/jobService';
import { JobCreatedModal } from '@/components/modals/JobCreatedModal';
import type { CreateJobRequestDTO, JobModality, WeightCriteria, JobResponseDTO } from '@/types/job';

// ─── Shared input classes ─────────────────────────────────────────────────────

const inputCls =
  'w-full px-4 py-2.5 text-sm bg-surface border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground text-foreground';

const labelCls = 'block text-sm font-medium text-foreground mb-1.5';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WEIGHT_LABELS: Record<keyof WeightCriteria, string> = {
  activities: 'Atividades',
  experience: 'Experiência',
  education:  'Educação',
  location:   'Localização',
  stability:  'Estabilidade',
};

function parseComma(value: string): string[] {
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

function parseLines(value: string): string[] {
  return value.split('\n').map((s) => s.trim()).filter(Boolean);
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, accent, children }: {
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-muted rounded-xl p-6 flex flex-col gap-5">
      <h2 className={`text-base font-semibold ${accent ?? 'text-foreground'}`}>{title}</h2>
      {children}
    </div>
  );
}

// ─── Checkbox row ─────────────────────────────────────────────────────────────

function CheckRow({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 p-3 border border-muted rounded-lg cursor-pointer hover:bg-accent transition-colors select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-primary"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function CreateJobView() {
  const router = useRouter();
  const createJobMutation = useCreateJob();

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [createdJob, setCreatedJob] = useState<JobResponseDTO | null>(null);

  // ── Basic info ──────────────────────────────────────────────────────────────
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [modality,    setModality]    = useState<JobModality>('REMOTE');
  const [salary,      setSalary]      = useState('');
  const [city,        setCity]        = useState('');
  const [jobState,    setJobState]    = useState('');

  // ── Required criteria ───────────────────────────────────────────────────────
  const [reqSkills,     setReqSkills]     = useState('');
  const [reqActivities, setReqActivities] = useState('');
  const [reqEducation,  setReqEducation]  = useState('');
  const [reqMinExp,     setReqMinExp]     = useState<number>(0);

  // ── Desired criteria ────────────────────────────────────────────────────────
  const [desCourses,       setDesCourses]       = useState('');
  const [desExperiences,   setDesExperiences]   = useState('');
  const [desDifferentials, setDesDifferentials] = useState('');

  // ── Positive criteria ───────────────────────────────────────────────────────
  const [hasCertifications, setHasCertifications] = useState(false);
  const [hasLeadership,     setHasLeadership]     = useState(false);
  const [stabilityYears,    setStabilityYears]    = useState<number>(2);

  // ── Eliminatory criteria ────────────────────────────────────────────────────
  const [requiredDegree,   setRequiredDegree]   = useState(false);
  const [elimMinExp,       setElimMinExp]       = useState<number>(0);
  const [reqSchedule,      setReqSchedule]      = useState('CLT');
  const [mandatorySkills,  setMandatorySkills]  = useState('');

  // ── Weights ─────────────────────────────────────────────────────────────────
  const [weights, setWeights] = useState<WeightCriteria>({
    activities: 30,
    experience: 25,
    education:  20,
    location:   10,
    stability:  15,
  });

  // ── Local validation ─────────────────────────────────────────────────────────
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const weightsOk   = totalWeight === 100;

  const mutationError = createJobMutation.error
    ? parseJobError(createJobMutation.error)
    : null;

  function handleWeightChange(key: keyof WeightCriteria, raw: string) {
    const value = Math.max(0, Math.min(100, Number(raw)));
    setWeights((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string[] {
    const errs: string[] = [];
    if (!title.trim())                           errs.push('Título da vaga é obrigatório.');
    if (!description.trim())                     errs.push('Descrição é obrigatória.');
    if (parseComma(reqSkills).length === 0)      errs.push('Informe ao menos uma skill obrigatória.');
    if (parseLines(reqActivities).length === 0)  errs.push('Informe ao menos uma atividade obrigatória.');
    if (parseComma(reqEducation).length === 0)   errs.push('Informe ao menos uma formação aceita.');
    if (!weightsOk)                              errs.push(`A soma dos pesos deve ser 100 (atual: ${totalWeight}).`);
    return errs;
  }

  async function handleSubmit() {
    createJobMutation.reset();
    const errs = validate();
    if (errs.length > 0) { setFieldErrors(errs); return; }
    setFieldErrors([]);

    const payload: CreateJobRequestDTO = {
      title:       title.trim(),
      description: description.trim(),
      modality,
      salary:   salary.trim()   || undefined,
      city:     city.trim()     || undefined,
      state:    jobState.trim() || undefined,
      companyId: '', // Será preenchido pelo backend
      criteria: {
        required: {
          skills:                  parseComma(reqSkills),
          activities:              parseLines(reqActivities),
          education:               parseComma(reqEducation),
          minimumExperienceYears:  reqMinExp,
        },
        desired: {
          courses:       parseComma(desCourses),
          experiences:   parseComma(desExperiences),
          differentials: parseComma(desDifferentials),
        },
        eliminatory: {
          requiredDegree,
          minimumExperienceYears: elimMinExp,
          requiredSchedule:       reqSchedule,
          mandatorySkills:        parseComma(mandatorySkills),
        },
        weights,
        positive: {
          hasCertifications,
          hasLeadershipExperience: hasLeadership,
          jobStabilityYears:       stabilityYears,
        },
      },
    };

    try {
      const job = await createJobMutation.mutateAsync(payload);
      setCreatedJob(job);
      setShowModal(true);
    } catch {
      // Error is handled via createJobMutation.error
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/vagas')}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Criar Nova Vaga</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Configure os critérios de análise da IA
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={createJobMutation.isPending}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
        >
          {createJobMutation.isPending ? 'Criando…' : 'Criar Vaga'}
        </button>
      </div>

      {/* ── Validation / API errors ──────────────────────────────────────────── */}
      {(fieldErrors.length > 0 || mutationError) && (
        <div className="flex flex-col gap-1.5 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">Corrija os erros abaixo</span>
          </div>
          <ul className="ml-6 list-disc text-sm text-red-600 space-y-0.5">
            {fieldErrors.map((e) => <li key={e}>{e}</li>)}
            {mutationError && <li>{mutationError}</li>}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Left / main column ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Informações Básicas */}
          <Section title="Informações Básicas">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="job-title" className={labelCls}>Título da Vaga *</label>
                <input
                  id="job-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Desenvolvedor Full Stack"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="job-description" className={labelCls}>Descrição *</label>
                <textarea
                  id="job-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Descreva as responsabilidades e o que você busca…"
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="job-modality" className={labelCls}>Modalidade *</label>
                  <select
                    id="job-modality"
                    value={modality}
                    onChange={(e) => setModality(e.target.value as JobModality)}
                    className={inputCls}
                  >
                    <option value="REMOTE">Remoto</option>
                    <option value="HYBRID">Híbrido</option>
                    <option value="ON_SITE">Presencial</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="job-salary" className={labelCls}>Faixa Salarial</label>
                  <input
                    id="job-salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="R$ 8.000 – R$ 12.000"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="job-city" className={labelCls}>Cidade</label>
                  <input
                    id="job-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="São Paulo"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label htmlFor="job-state" className={labelCls}>Estado</label>
                  <input
                    id="job-state"
                    value={jobState}
                    onChange={(e) => setJobState(e.target.value)}
                    placeholder="SP"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Critérios da IA */}
          <div className="bg-surface border border-muted rounded-xl p-6 flex flex-col gap-6">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Critérios da IA
            </h2>

            {/* Required */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-primary">Requisitos Obrigatórios</h3>

              <div>
                <label htmlFor="req-skills" className={labelCls}>Skills Obrigatórias *</label>
                <input
                  id="req-skills"
                  value={reqSkills}
                  onChange={(e) => setReqSkills(e.target.value)}
                  placeholder="React, Node.js, TypeScript  (separado por vírgula)"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="req-activities" className={labelCls}>
                  Atividades Obrigatórias *
                  <span className="ml-2 text-xs font-normal text-muted-foreground">(uma por linha)</span>
                </label>
                <textarea
                  id="req-activities"
                  value={reqActivities}
                  onChange={(e) => setReqActivities(e.target.value)}
                  rows={3}
                  placeholder={"Desenvolver APIs REST\nRealizar code reviews\nParticipar de cerimônias ágeis"}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div>
                <label htmlFor="req-education" className={labelCls}>Formações Aceitas *</label>
                <input
                  id="req-education"
                  value={reqEducation}
                  onChange={(e) => setReqEducation(e.target.value)}
                  placeholder="Ciência da Computação, Engenharia de Software  (separado por vírgula)"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="req-min-exp" className={labelCls}>Experiência Mínima (anos)</label>
                  <input
                    id="req-min-exp"
                    type="number"
                    min={0}
                    value={reqMinExp}
                    onChange={(e) => setReqMinExp(Number(e.target.value))}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-muted" />

            {/* Desired */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-violet-600">Diferenciais Desejáveis</h3>

              <div>
                <label htmlFor="des-courses" className={labelCls}>Cursos e Certificações</label>
                <input
                  id="des-courses"
                  value={desCourses}
                  onChange={(e) => setDesCourses(e.target.value)}
                  placeholder="AWS Cloud Practitioner, Docker Essentials  (separado por vírgula)"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="des-experiences" className={labelCls}>Experiências que Agregam</label>
                <input
                  id="des-experiences"
                  value={desExperiences}
                  onChange={(e) => setDesExperiences(e.target.value)}
                  placeholder="Trabalho em startups, Projetos open source  (separado por vírgula)"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="des-differentials" className={labelCls}>Diferenciais Competitivos</label>
                <input
                  id="des-differentials"
                  value={desDifferentials}
                  onChange={(e) => setDesDifferentials(e.target.value)}
                  placeholder="Inglês intermediário, Conhecimento em microsserviços  (separado por vírgula)"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CheckRow
                  label="Bônus: tem certificações"
                  checked={hasCertifications}
                  onChange={setHasCertifications}
                />
                <CheckRow
                  label="Bônus: experiência em liderança"
                  checked={hasLeadership}
                  onChange={setHasLeadership}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stability-years" className={labelCls}>Anos de estabilidade p/ bônus</label>
                  <input
                    id="stability-years"
                    type="number"
                    min={0}
                    value={stabilityYears}
                    onChange={(e) => setStabilityYears(Number(e.target.value))}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-muted" />

            {/* Eliminatory */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-red-600">Critérios Eliminatórios</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CheckRow
                  label="Exige formação superior completa"
                  checked={requiredDegree}
                  onChange={setRequiredDegree}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="elim-min-exp" className={labelCls}>Exp. Mínima Eliminatória (anos)</label>
                  <input
                    id="elim-min-exp"
                    type="number"
                    min={0}
                    value={elimMinExp}
                    onChange={(e) => setElimMinExp(Number(e.target.value))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label htmlFor="req-schedule" className={labelCls}>Regime Exigido</label>
                  <select
                    id="req-schedule"
                    value={reqSchedule}
                    onChange={(e) => setReqSchedule(e.target.value)}
                    className={inputCls}
                  >
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                    <option value="COOPERADO">Cooperado</option>
                    <option value="ESTAGIO">Estágio</option>
                    <option value="FREELANCER">Freelancer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mandatory-skills" className={labelCls}>Skills Mandatórias</label>
                  <input
                    id="mandatory-skills"
                    value={mandatorySkills}
                    onChange={(e) => setMandatorySkills(e.target.value)}
                    placeholder="Java, Git  (separado por vírgula)"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pesos da Análise */}
          <Section title="Pesos da Análise">
            <p className="text-sm text-muted-foreground -mt-3">
              Configure a importância de cada critério. A soma deve ser exatamente 100.
            </p>

            <div className="flex flex-col gap-5">
              {(Object.keys(weights) as (keyof WeightCriteria)[]).map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-foreground">{WEIGHT_LABELS[key]}</label>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                      {weights[key]}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={weights[key]}
                    onChange={(e) => handleWeightChange(key, e.target.value)}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 border-t border-muted">
                <span className="text-sm text-foreground font-medium">Total</span>
                <div className="flex items-center gap-2">
                  {weightsOk
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    : <AlertCircle  className="w-4 h-4 text-red-500" />
                  }
                  <span className={`text-lg font-bold ${weightsOk ? 'text-emerald-600' : 'text-red-600'}`}>
                    {totalWeight}%
                  </span>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* ── Right sidebar ────────────────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-6 flex flex-col gap-4">
          <div className="bg-linear-to-br from-primary/5 to-violet-50 border border-primary/20 rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Prévia da Análise IA
            </h3>

            <div className="bg-surface rounded-lg p-4 flex flex-col gap-2">
              <p className="text-xs text-muted-foreground font-medium mb-1">A IA irá pontuar:</p>
              {(Object.keys(weights) as (keyof WeightCriteria)[]).map((key) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-foreground/80">{WEIGHT_LABELS[key]}</span>
                  <span className="font-semibold text-primary">{weights[key]}%</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-muted text-xs font-semibold">
                <span>Total</span>
                <span className={weightsOk ? 'text-emerald-600' : 'text-red-600'}>
                  {totalWeight}%
                </span>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-4 flex flex-col gap-1.5">
              <p className="text-xs text-muted-foreground font-medium mb-1">Recursos automáticos:</p>
              {[
                'Extração de dados do PDF',
                'Análise semântica de experiências',
                'Score preditivo de sucesso',
                'Perguntas sugeridas para entrevista',
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-xs text-foreground/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {feat}
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={createJobMutation.isPending}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {createJobMutation.isPending ? 'Criando…' : 'Criar Vaga'}
            </button>
          </div>
        </div>

      </div>

      {/* ── Success Modal ──────────────────────────────────────────────────────── */}
      {showModal && createdJob && (
        <JobCreatedModal
          job={createdJob}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
