import { Mail, Phone, Briefcase, Globe, MapPin } from 'lucide-react';

interface ContactInfoProps {
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  city?: string;
  state?: string;
}

export default function ContactInfo({
  email,
  phone,
  linkedinUrl,
  portfolioUrl,
  city,
  state
}: ContactInfoProps) {
  const location = [city, state].filter(Boolean).join(', ');

  const hasAnyContact = email || phone || linkedinUrl || portfolioUrl || location;

  if (!hasAnyContact) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-500">
          Informações de contato não disponíveis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {email && (
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
            <a
              href={`mailto:${email}`}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
            >
              {email}
            </a>
          </div>
        </div>
      )}

      {phone && (
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase">Telefone</p>
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="text-sm text-gray-900 hover:text-blue-600"
            >
              {phone}
            </a>
          </div>
        </div>
      )}

      {linkedinUrl && (
        <div className="flex items-start gap-3">
          <Briefcase className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase">LinkedIn</p>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
            >
              {linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </div>
        </div>
      )}

      {portfolioUrl && (
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase">Portfólio</p>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
            >
              {portfolioUrl.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </div>
        </div>
      )}

      {location && (
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase">Localização</p>
            <p className="text-sm text-gray-900">{location}</p>
          </div>
        </div>
      )}
    </div>
  );
}
