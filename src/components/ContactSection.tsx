import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  GraduationCap,
  Facebook,
  Youtube,
  Linkedin,
  Instagram
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { services, sendContactMessage, showNotification } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Admisión Posgrado 2026-II',
    program: services[0]?.title || 'Maestría en Estrategia y Seguridad Nacional',
    rankOrStatus: 'Oficial Superior FFAA',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showNotification('Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    sendContactMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: `${formData.subject} - ${formData.program} (${formData.rankOrStatus})`,
      message: formData.message || 'Solicito información detallada de requisitos, costos y fecha límite de inscripción.'
    });

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Admisión Posgrado 2026-II',
      program: services[0]?.title || '',
      rankOrStatus: 'Oficial Superior FFAA',
      message: ''
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  const steps = [
    { num: '01', title: 'Registro y Envío de Expediente', desc: 'Completar el formulario y anexar título legalizado y récord de notas.' },
    { num: '02', title: 'Evaluación Curricular', desc: 'Validación por el Comité Académico y verificación de antecedentes.' },
    { num: '03', title: 'Prueba & Entrevista Panel', desc: 'Evaluación de competencias analíticas y entrevista con oficiales directores.' },
    { num: '04', title: 'Matrícula e Inducción', desc: 'Asignación de credenciales para el campus virtual y recepción doctrinal.' },
  ];

  return (
    <div className="bg-slate-50">
      
      {/* Admissions Banner */}
      <section id="admisiones" className="py-16 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B91C1C]/10 text-[#B91C1C] font-bold text-xs uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              Proceso de Selección
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              Pasos para la Admisión al PECPFFAA
            </h2>
            <div className="w-20 h-1 bg-[#B91C1C] mx-auto rounded-full"></div>
            <p className="text-sm text-slate-600">
              Convocatoria abierta para el personal militar activo, oficiales en retiro y profesionales del sector civil.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-[#0D3671] transition-all relative overflow-hidden group"
              >
                <div className="text-4xl font-black font-mono text-slate-100 group-hover:text-[#0D3671]/15 transition-colors absolute top-2 right-3">
                  {st.num}
                </div>
                <div className="w-9 h-9 rounded-lg bg-[#0D3671] text-amber-300 font-mono font-bold flex items-center justify-center text-sm mb-4 shadow">
                  {st.num}
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2 group-hover:text-[#0D3671]">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Directory */}
      <section id="contacto" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Contact Info & Institutional Details (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3671]/10 text-[#0D3671] font-bold text-xs uppercase tracking-wider">
                  <Phone className="w-3.5 h-3.5" />
                  Atención & Asistencia
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 font-serif">
                  Contacto y Dirección de Registro
                </h2>
                <div className="w-16 h-1 bg-[#B91C1C] rounded-full"></div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Comuníquese con nuestra secretaría docente para consultas de inscripción, legalización de certificados y convenios interinstitucionales.
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="p-3 rounded-lg bg-[#0D3671] text-white">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Sede Central PECPFFAA</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Av. 27 de Febrero esq. Av. Luperón, MINISTERIO DE DEFENSA, MIDE, Santo Domingo, R.D.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="p-3 rounded-lg bg-[#0D3671] text-white">
                    <Phone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Teléfonos de Oficina</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      (809) 530-5149 ext. 3899
                    </p>
                    <p className="text-[11px] text-slate-400">Lunes a Viernes: 8:00 AM - 4:30 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="p-3 rounded-lg bg-[#0D3671] text-white">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Correo Institucional</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      admisiones@pecpffaa.edu.do • info@pecpffaa.edu.do
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="p-5 rounded-xl bg-[#0D3671] text-white space-y-3">
                <h4 className="font-bold text-sm">Canales de Difusión Doctrinal</h4>
                <p className="text-xs text-slate-200">
                  Síganos en nuestras redes oficiales para conferencias en vivo, transmisiones de graduaciones y publicaciones:
                </p>
                <div className="flex items-center gap-2.5 pt-1">
                  {[
                    { 
                      name: 'Facebook', 
                      id: 'social-btn-facebook', 
                      icon: <Facebook className="w-5 h-5" />, 
                      hoverBg: 'hover:bg-[#1877F2]' 
                    },
                    { 
                      name: 'X', 
                      id: 'social-btn-x', 
                      icon: (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ), 
                      hoverBg: 'hover:bg-black' 
                    },
                    { 
                      name: 'YouTube', 
                      id: 'social-btn-youtube', 
                      icon: <Youtube className="w-5 h-5" />, 
                      hoverBg: 'hover:bg-[#FF0000]' 
                    },
                    { 
                      name: 'LinkedIn', 
                      id: 'social-btn-linkedin', 
                      icon: <Linkedin className="w-5 h-5" />, 
                      hoverBg: 'hover:bg-[#0A66C2]' 
                    },
                    { 
                      name: 'Instagram', 
                      id: 'social-btn-instagram', 
                      icon: <Instagram className="w-5 h-5" />, 
                      hoverBg: 'hover:bg-[#E4405F]' 
                    }
                  ].map(({ name, id, icon, hoverBg }) => (
                    <button
                      key={name}
                      id={id}
                      type="button"
                      onClick={() => showNotification(`Enlace al canal oficial de ${name} del PECPFFAA`, 'info')}
                      className={`w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${hoverBg}`}
                      title={name}
                      aria-label={name}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Interactive Application / Inquiry Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Formulario de Postulación & Consulta</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Llene los datos y un oficial de admisión le asistirá formalmente.</p>
                </div>
                <span className="text-[11px] bg-red-50 text-[#B91C1C] px-2.5 py-1 rounded-full font-bold border border-red-200">
                  Admisiones 2026
                </span>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">¡Solicitud Registrada con Éxito!</h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Su solicitud ha sido ingresada en el sistema del PECPFFAA. Se ha enviado una copia a su correo y nuestro departamento se comunicará dentro de las próximas 24 a 48 horas laborables.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-lg bg-[#0D3671] text-white text-xs font-bold hover:bg-[#092652] transition-colors"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Mayor Juan Pérez Díaz"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0D3671] focus:border-transparent outline-none bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jperez@mide.mil.do o correo@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0D3671] focus:border-transparent outline-none bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(809) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0D3671] focus:border-transparent outline-none bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Condición o Institución</label>
                      <select
                        value={formData.rankOrStatus}
                        onChange={(e) => setFormData({ ...formData, rankOrStatus: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0D3671] focus:border-transparent outline-none bg-slate-50"
                      >
                        <option value="Ejército de República Dominicana">Ejército de República Dominicana (ERD)</option>
                        <option value="Armada de República Dominicana">Armada de República Dominicana (ARD)</option>
                        <option value="Fuerza Aérea de República Dominicana">Fuerza Aérea de República Dominicana (FARD)</option>
                        <option value="Policía Nacional">Policía Nacional (PN)</option>
                        <option value="Profesional Civil">Profesional Civil (Sector Gubernamental / Privado)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Programa Académico de Interés</label>
                    <select
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0D3671] focus:border-transparent outline-none bg-slate-50 font-medium"
                    >
                      {services.map((srv) => (
                        <option key={srv.id} value={srv.title}>
                          [{srv.category}] {srv.title} ({srv.modality})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mensaje o Consulta Específica</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Escriba aquí si requiere información sobre becas de las FFAA, homologación de títulos o convalidaciones..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0D3671] focus:border-transparent outline-none bg-slate-50"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-lg bg-[#B91C1C] hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-red-800/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Solicitud Formal de Admisión
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    Sus datos están protegidos bajo la Ley de Protección de Datos Personales y Doctrina de Seguridad Nacional.
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
