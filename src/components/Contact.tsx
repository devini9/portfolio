import { useState } from 'react';
import './Contact.css';

export function Contact() {
  const [status, setStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Validação client-side
    const newErrors: { email?: string; message?: string } = {};
    if (!email || !validateEmail(email)) {
      newErrors.email = 'Por favor, insira um e-mail válido.';
    }
    if (!message || message.trim().length < 10) {
      newErrors.message = 'A mensagem deve ter pelo menos 10 caracteres.';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setStatus('Transmitindo dados... 📡');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch("https://formsubmit.co/ajax/viniciusfv.9@gmail.com", {
        method: "POST",
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Novo Contato via Portfólio`,
          email: email,
          mensagem: message
        })
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (data.success === "true" || response.ok) {
        setStatus('✅ Mensagem enviada com sucesso!');
        form.reset();
        setErrors({});
      } else {
        setStatus('⚠️ Erro ao enviar. Tente novamente mais tarde.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setStatus('⏰ Tempo esgotado. Verifique sua conexão e tente novamente.');
      } else {
        setStatus('❌ Falha na comunicação. O sistema está offline?');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section section" id="contato">
      <div className="main-container">
        <h2 className="section-title">Contato</h2>
        
        <div className="contact-grid">
          <div className="contact-info">
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
              Os agentes de Atendimento estão prontos para receber 
              sua mensagem e redirecioná-la diretamente para o Vinícius.
            </p>
            <div className="contact-methods">
              <p>✉️ Email: viniciusfv.9@gmail.com</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="email">E-mail para Retorno</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                placeholder="email@dominio.com"
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                title="Por favor, insira um endereço de e-mail válido (ex: nome@dominio.com)"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.email && <span id="email-error" className="error-message">{errors.email}</span>}
            </div>
            
            <div className="input-group">
              <label htmlFor="message">Escreva sua Mensagem</label>
              <textarea 
                id="message" 
                name="message" 
                rows={5} 
                required 
                placeholder="Insira sua mensagem aqui..."
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
                disabled={isSubmitting}
              ></textarea>
              {errors.message && <span id="message-error" className="error-message">{errors.message}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
            
            {status && <div className="form-status" role="alert">{status}</div>}
          </form>
        </div>
      </div>
    </section>
  );
}
