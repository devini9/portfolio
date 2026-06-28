import { useState } from 'react';
import './Contact.css';

export function Contact() {
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = formData.get('email');
    const message = formData.get('message');

    setStatus('Transmitindo dados... 📡');

    try {
      const response = await fetch("https://formsubmit.co/ajax/viniciusfv.9@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Novo Contato via Agente Otto`,
          email: email,
          mensagem: message
        })
      });

      const data = await response.json();

      if (data.success === "true" || response.ok) {
        setStatus('✅ Mensagem enviada com sucesso! O Otto repassou tudo para o Vinícius.');
        form.reset();
      } else {
        setStatus('⚠️ Erro ao enviar. Tente novamente mais tarde.');
      }
    } catch (err) {
      setStatus('❌ Falha na comunicação. O sistema está offline?');
    }
  };

  return (
    <section className="contact-section section" id="contato">
      <div className="main-container">
        <h2 className="section-title">Contato</h2>
        
        <div className="contact-grid">
          <div className="contact-info">
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
              Os agentes de Atendimento estam prontos para receber 
              sua mensagem e redirecioná-la diretamente para o Vinícius.
            </p>
            <div className="contact-methods">
              <p>✉️ Email: viniciusfv.9@gmail.com</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
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
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="message">Escreva sua Mensagem</label>
              <textarea id="message" name="message" rows={5} required placeholder="Insira sua mensagem aqui..."></textarea>
            </div>

            <button type="submit" className="submit-btn">
              [ ENTER ] Transmitir Dados
            </button>
            
            {status && <div className="form-status">{status}</div>}
          </form>
        </div>
      </div>
    </section>
  );
}
